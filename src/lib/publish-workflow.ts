import "server-only";
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, open, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const liveUrl = process.env.PORTFOLIO_LIVE_URL ?? "https://portfoilo-livid-six.vercel.app/";
const publishLockPath = path.join(projectRoot, ".portfolio-drafts", "publish.lock");

type CommandResult = { stdout: string; stderr: string; exitCode: number };

export type PublishChange = {
  path: string;
  status: string;
  kind: "new" | "modified" | "deleted" | "renamed";
};

export type PublishStatus = {
  branch: string;
  remote: string;
  githubUrl: string;
  liveUrl: string;
  head: string;
  ahead: number;
  behind: number;
  changes: PublishChange[];
  blockedReasons: string[];
  fingerprint: string;
};

export type ValidationStep = {
  label: string;
  status: "passed" | "failed";
  detail: string;
};

function runFile(file: string, args: string[], timeout = 300_000, environment: NodeJS.ProcessEnv = process.env): Promise<CommandResult> {
  return new Promise((resolve) => {
    execFile(file, args, {
      cwd: projectRoot,
      windowsHide: true,
      timeout,
      maxBuffer: 12 * 1024 * 1024,
      env: { ...environment, GIT_TERMINAL_PROMPT: "0" },
    }, (error, stdout, stderr) => {
      const rawCode = error?.code;
      const exitCode = typeof rawCode === "number" ? rawCode : error ? 1 : 0;
      resolve({ stdout: String(stdout).trim(), stderr: String(stderr).trim(), exitCode });
    });
  });
}

async function git(args: string[], allowFailure = false) {
  const result = await runFile("git", args, 180_000);
  if (!allowFailure && result.exitCode !== 0) {
    throw new Error(result.stderr || result.stdout || `Git command failed: ${args.join(" ")}`);
  }
  return result;
}

function normalizeRemote(remote: string) {
  try {
    const url = new URL(remote);
    url.username = "";
    url.password = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return remote;
  }
}

function githubUrlForRemote(remote: string) {
  const https = remote.match(/^https?:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?$/i);
  if (https) return `https://github.com/${https[1]}/${https[2]}`;
  const ssh = remote.match(/^git@github\.com:([^/]+)\/(.+?)(?:\.git)?$/i);
  return ssh ? `https://github.com/${ssh[1]}/${ssh[2]}` : "";
}

function parseChanges(output: string): PublishChange[] {
  if (!output) return [];
  return output.split(/\r?\n/).filter(Boolean).map((line) => {
    const status = line.slice(0, 2);
    const rawPath = line.slice(3).trim();
    const filePath = rawPath.startsWith('"') && rawPath.endsWith('"')
      ? rawPath.slice(1, -1).replace(/\\"/g, '"')
      : rawPath;
    const kind = status.includes("R") ? "renamed"
      : status === "??" || status.includes("A") ? "new"
        : status.includes("D") ? "deleted"
          : "modified";
    return { path: filePath, status, kind };
  });
}

function fingerprintFor(head: string, branch: string, changes: PublishChange[], ahead: number, behind: number) {
  return createHash("sha256")
    .update(JSON.stringify({ head, branch, changes, ahead, behind }))
    .digest("hex");
}

export async function getPublishStatus(): Promise<PublishStatus> {
  const [branchResult, remoteResult, headResult, changesResult, countsResult] = await Promise.all([
    git(["branch", "--show-current"]),
    git(["remote", "get-url", "origin"], true),
    git(["rev-parse", "HEAD"]),
    git(["status", "--porcelain=v1", "--untracked-files=all"]),
    git(["rev-list", "--left-right", "--count", "origin/main...HEAD"], true),
  ]);
  const branch = branchResult.stdout;
  const remote = normalizeRemote(remoteResult.stdout);
  const githubUrl = githubUrlForRemote(remote);
  const changes = parseChanges(changesResult.stdout);
  const [behind = 0, ahead = 0] = countsResult.exitCode === 0
    ? countsResult.stdout.split(/\s+/).map((value) => Number(value))
    : [0, 0];
  const blockedReasons: string[] = [];
  if (branch !== "main") blockedReasons.push(`Publishing is limited to the main branch. Current branch: ${branch || "detached HEAD"}.`);
  if (!remoteResult.stdout) blockedReasons.push("The origin Git remote is not configured.");
  if (!githubUrl) blockedReasons.push("The origin remote is not a GitHub repository.");
  if (behind > 0) blockedReasons.push(`The local main branch is ${behind} commit${behind === 1 ? "" : "s"} behind origin. Pull and review before publishing.`);
  const sensitive = changes.filter((change) => /(^|\/)(\.env|.*\.(pem|key|p12|pfx))$/i.test(change.path));
  if (sensitive.length) blockedReasons.push(`Potentially sensitive files must be removed before publishing: ${sensitive.map((item) => item.path).join(", ")}`);
  return {
    branch,
    remote,
    githubUrl,
    liveUrl,
    head: headResult.stdout,
    ahead,
    behind,
    changes,
    blockedReasons,
    fingerprint: fingerprintFor(headResult.stdout, branch, changes, ahead, behind),
  };
}

export async function withPublishLock<T>(operation: string, task: () => Promise<T>): Promise<T> {
  await mkdir(path.dirname(publishLockPath), { recursive: true });
  let handle;
  try {
    handle = await open(publishLockPath, "wx");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
    try {
      const details = await stat(publishLockPath);
      if (Date.now() - details.mtimeMs > 15 * 60 * 1000) {
        await rm(publishLockPath, { force: true });
        handle = await open(publishLockPath, "wx");
      }
    } catch (lockError) {
      if ((lockError as NodeJS.ErrnoException).code !== "ENOENT") throw lockError;
      handle = await open(publishLockPath, "wx");
    }
    if (!handle) throw new Error("Another validation, publish, or rollback operation is already running.");
  }
  try {
    await handle.writeFile(`${JSON.stringify({ operation, pid: process.pid, startedAt: new Date().toISOString() })}\n`, "utf8");
    return await task();
  } finally {
    await handle.close();
    await rm(publishLockPath, { force: true });
  }
}

function shortFailure(result: CommandResult) {
  const output = result.stderr || result.stdout || "Command failed without output.";
  return output.length > 1800 ? `${output.slice(-1800)}\n…` : output;
}

export async function validateForPublish() {
  const before = await getPublishStatus();
  if (before.blockedReasons.length) throw new Error(before.blockedReasons.join(" "));
  if (before.changes.length === 0 && before.ahead === 0) throw new Error("There are no local changes or pending commits to publish.");

  const nextEnvPath = path.join(projectRoot, "next-env.d.ts");
  const nextEnvBefore = await readFile(nextEnvPath);
  const productionEnvironment: NodeJS.ProcessEnv = { ...process.env, NODE_ENV: "production" };
  delete productionEnvironment["PORTFOLIO_LOCAL_EDITOR"];
  const steps: ValidationStep[] = [];
  const checks = [
    { label: "Whitespace and patch safety", file: "git", args: ["diff", "--check"] },
    { label: "Git LFS configuration", file: "git", args: ["lfs", "version"] },
    { label: "Code quality", file: process.execPath, args: ["node_modules/eslint/bin/eslint.js", "."] },
    { label: "TypeScript", file: process.execPath, args: ["node_modules/typescript/bin/tsc", "--noEmit"] },
    { label: "Production build", file: process.execPath, args: ["node_modules/next/dist/bin/next", "build"], environment: productionEnvironment },
  ];

  try {
    for (const check of checks) {
      const result = await runFile(check.file, check.args, 300_000, check.environment);
      if (result.exitCode !== 0) {
        steps.push({ label: check.label, status: "failed", detail: shortFailure(result) });
        throw Object.assign(new Error(`${check.label} failed.`), { steps });
      }
      steps.push({ label: check.label, status: "passed", detail: check.label === "Production build" ? "Production build completed successfully." : "Passed." });
    }
  } finally {
    await writeFile(nextEnvPath, nextEnvBefore);
  }

  const after = await getPublishStatus();
  if (after.fingerprint !== before.fingerprint) {
    throw Object.assign(new Error("Files changed during validation. Review the updated file list and validate again."), { steps });
  }
  return { status: after, validationToken: after.fingerprint, steps };
}

function cleanCommitMessage(value: string) {
  const message = value.trim().replace(/[\r\n]+/g, " ");
  if (message.length < 3 || message.length > 72) throw new Error("Use a commit message between 3 and 72 characters.");
  return message;
}

export async function publishToGitHub(input: { confirmation: string; validationToken: string; commitMessage: string }) {
  if (input.confirmation !== "PUBLISH") throw new Error("Type PUBLISH to confirm the live update.");
  const fetchResult = await git(["fetch", "origin", "main"], true);
  if (fetchResult.exitCode !== 0) throw new Error(`Could not refresh origin/main. Check the internet connection and GitHub credentials: ${shortFailure(fetchResult)}`);
  const status = await getPublishStatus();
  if (status.blockedReasons.length) throw new Error(status.blockedReasons.join(" "));
  if (status.fingerprint !== input.validationToken) throw new Error("The files changed after validation. Validate again before publishing.");

  let commit = status.head;
  if (status.changes.length > 0) {
    const message = cleanCommitMessage(input.commitMessage || "Update portfolio content");
    await git(["add", "--all"]);
    const staged = await git(["diff", "--cached", "--quiet"], true);
    if (staged.exitCode === 0) throw new Error("There are no staged changes to commit.");
    await git(["commit", "-m", message]);
    commit = (await git(["rev-parse", "HEAD"])).stdout;
  }

  const push = await git(["push", "origin", "main"], true);
  if (push.exitCode !== 0) {
    throw Object.assign(new Error(`The commit is saved locally, but GitHub push failed: ${shortFailure(push)}`), { commit });
  }
  return {
    commit,
    shortCommit: commit.slice(0, 7),
    githubCommitUrl: status.githubUrl ? `${status.githubUrl}/commit/${commit}` : "",
    liveUrl: status.liveUrl,
    message: "GitHub push succeeded. Vercel should begin its connected deployment automatically.",
  };
}

export async function getDeploymentStatus(commit?: string) {
  const status = await getPublishStatus();
  const sha = commit && /^[a-f0-9]{7,40}$/i.test(commit) ? commit : status.head;
  const match = status.githubUrl.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)$/i);
  if (!match) return { state: "unknown", label: "Deployment status unavailable", liveUrl: status.liveUrl, commit: sha };
  try {
    const response = await fetch(`https://api.github.com/repos/${match[1]}/${match[2]}/commits/${sha}/check-runs`, {
      headers: { Accept: "application/vnd.github+json", "User-Agent": "Darshan-Portfolio-Local-Editor" },
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
    const payload = await response.json() as { check_runs?: { name: string; status: string; conclusion: string | null; details_url?: string }[] };
    const check = payload.check_runs?.find((item) => /vercel/i.test(item.name));
    if (!check) return { state: "queued", label: "Waiting for Vercel deployment check", liveUrl: status.liveUrl, commit: sha };
    const state = check.status === "completed" ? check.conclusion === "success" ? "ready" : "error" : "building";
    return {
      state,
      label: state === "ready" ? "Vercel deployment ready" : state === "error" ? "Vercel deployment failed" : "Vercel deployment building",
      detailsUrl: check.details_url ?? "",
      liveUrl: status.liveUrl,
      commit: sha,
    };
  } catch (error) {
    return {
      state: "unknown",
      label: "Could not read the Vercel deployment check",
      detail: error instanceof Error ? error.message : "Network unavailable",
      liveUrl: status.liveUrl,
      commit: sha,
    };
  }
}

export async function getRecoveryHistory() {
  const result = await git(["log", "-2", "--pretty=format:%H%x1f%h%x1f%s%x1f%ci%x1e"]);
  return result.stdout.split("\x1e").map((record) => record.trim()).filter(Boolean).map((record) => {
    const [commit, shortCommit, subject, createdAt] = record.split("\x1f");
    return { commit, shortCommit, subject, createdAt };
  });
}

export async function rollbackLatestPublish(input: { confirmation: string; expectedCommit: string }) {
  if (input.confirmation !== "ROLLBACK") throw new Error("Type ROLLBACK to confirm restoring the previous live version.");
  const fetchResult = await git(["fetch", "origin", "main"], true);
  if (fetchResult.exitCode !== 0) throw new Error(`Could not refresh origin/main. Check the internet connection and GitHub credentials: ${shortFailure(fetchResult)}`);
  const status = await getPublishStatus();
  if (status.blockedReasons.length) throw new Error(status.blockedReasons.join(" "));
  if (status.changes.length || status.ahead > 0 || status.behind > 0) throw new Error("Live rollback requires a clean, fully synchronized main branch.");
  if (status.head !== input.expectedCommit) throw new Error("The latest commit changed. Refresh Recovery before rolling back.");
  const history = await getRecoveryHistory();
  if (history.length < 2) throw new Error("There is no earlier commit available to restore.");

  let committed = false;
  const revert = await git(["revert", "--no-commit", status.head], true);
  if (revert.exitCode !== 0) {
    await git(["revert", "--abort"], true);
    throw new Error(`Git could not prepare the rollback cleanly: ${shortFailure(revert)}`);
  }
  try {
    await validateForPublish();
    await git(["commit", "-m", `Revert ${history[0].shortCommit}: ${history[0].subject}`]);
    committed = true;
    const commit = (await git(["rev-parse", "HEAD"])).stdout;
    const push = await git(["push", "origin", "main"], true);
    if (push.exitCode !== 0) throw Object.assign(new Error(`Rollback commit is saved locally, but GitHub push failed: ${shortFailure(push)}`), { commit });
    return {
      commit,
      shortCommit: commit.slice(0, 7),
      restoredCommit: history[1].shortCommit,
      liveUrl: status.liveUrl,
      githubCommitUrl: status.githubUrl ? `${status.githubUrl}/commit/${commit}` : "",
      message: "Rollback commit pushed. Vercel should redeploy the previous portfolio version automatically.",
    };
  } catch (error) {
    if (!committed) await git(["revert", "--abort"], true);
    throw error;
  }
}
