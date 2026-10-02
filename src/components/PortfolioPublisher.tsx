"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ArrowClockwiseIcon,
  CheckCircleIcon,
  CloudArrowUpIcon,
  GitBranchIcon,
  GithubLogoIcon,
  SpinnerGapIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";

type Change = { path: string; status: string; kind: "new" | "modified" | "deleted" | "renamed" };
type Status = {
  branch: string;
  remote: string;
  githubUrl: string;
  liveUrl: string;
  head: string;
  ahead: number;
  behind: number;
  changes: Change[];
  blockedReasons: string[];
  fingerprint: string;
};
type ValidationStep = { label: string; status: "passed" | "failed"; detail: string };
type PublishResult = {
  commit: string;
  shortCommit: string;
  githubCommitUrl: string;
  liveUrl: string;
  message: string;
};
type Deployment = {
  state: "queued" | "building" | "ready" | "error" | "unknown";
  label: string;
  detail?: string;
  detailsUrl?: string;
  liveUrl: string;
  commit: string;
};
type Connectivity = {
  online: boolean;
  label: string;
  detail: string;
};

const changeLabels = { new: "New", modified: "Modified", deleted: "Deleted", renamed: "Renamed" } as const;

export function PortfolioPublisher() {
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<"" | "validate" | "publish">("");
  const [message, setMessage] = useState("");
  const [steps, setSteps] = useState<ValidationStep[]>([]);
  const [validationToken, setValidationToken] = useState("");
  const [validatedFingerprint, setValidatedFingerprint] = useState("");
  const [commitMessage, setCommitMessage] = useState("Update portfolio content");
  const [confirmation, setConfirmation] = useState("");
  const [result, setResult] = useState<PublishResult | null>(null);
  const [deployment, setDeployment] = useState<Deployment | null>(null);
  const [connectivity, setConnectivity] = useState<Connectivity | null>(null);
  const [connectivityLoading, setConnectivityLoading] = useState(true);

  const refreshStatus = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/publish", { cache: "no-store" });
      const payload = await response.json() as { ok: boolean; status?: Status; message?: string };
      if (!payload.ok || !payload.status) throw new Error(payload.message || "Could not inspect the repository.");
      setStatus(payload.status);
      if (validatedFingerprint && payload.status.fingerprint !== validatedFingerprint) {
        setValidationToken("");
        setSteps([]);
        setMessage("The local files changed. Run validation again before publishing.");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not inspect the repository.");
    } finally {
      setLoading(false);
    }
  }, [validatedFingerprint]);

  const checkConnectivity = useCallback(async () => {
    setConnectivityLoading(true);
    try {
      const response = await fetch("/api/admin/publish?view=connectivity", { cache: "no-store" });
      const payload = await response.json() as { ok: boolean; connectivity?: Connectivity; message?: string };
      if (!payload.ok || !payload.connectivity) throw new Error(payload.message || "Could not check GitHub connectivity.");
      setConnectivity(payload.connectivity);
    } catch (error) {
      setConnectivity({
        online: false,
        label: "GitHub connection unavailable",
        detail: error instanceof Error ? error.message : "Could not check GitHub connectivity.",
      });
    } finally {
      setConnectivityLoading(false);
    }
  }, []);

  useEffect(() => {
    const refreshWhenActive = () => {
      if (document.visibilityState === "visible") {
        void Promise.all([refreshStatus(), checkConnectivity()]);
      }
    };
    const initialRefresh = window.setTimeout(refreshWhenActive, 0);
    window.addEventListener("focus", refreshWhenActive);
    window.addEventListener("online", refreshWhenActive);
    document.addEventListener("visibilitychange", refreshWhenActive);
    return () => {
      window.clearTimeout(initialRefresh);
      window.removeEventListener("focus", refreshWhenActive);
      window.removeEventListener("online", refreshWhenActive);
      document.removeEventListener("visibilitychange", refreshWhenActive);
    };
  }, [checkConnectivity, refreshStatus]);

  const checkDeployment = useCallback(async (commit: string) => {
    try {
      const response = await fetch(`/api/admin/publish?view=deployment&commit=${encodeURIComponent(commit)}`, { cache: "no-store" });
      const payload = await response.json() as { ok: boolean; deployment?: Deployment; message?: string };
      if (!payload.ok || !payload.deployment) throw new Error(payload.message || "Could not read deployment status.");
      setDeployment(payload.deployment);
    } catch (error) {
      setDeployment({
        state: "unknown",
        label: "Deployment status unavailable",
        detail: error instanceof Error ? error.message : "Network unavailable",
        liveUrl: result?.liveUrl ?? status?.liveUrl ?? "",
        commit,
      });
    }
  }, [result?.liveUrl, status?.liveUrl]);

  useEffect(() => {
    if (!result || !deployment || !["queued", "building"].includes(deployment.state)) return;
    const timer = window.setTimeout(() => void checkDeployment(result.commit), 10_000);
    return () => window.clearTimeout(timer);
  }, [checkDeployment, deployment, result]);

  async function validate() {
    setBusy("validate");
    setMessage("Running Git safety checks, lint, TypeScript, Git LFS, and the production build…");
    setSteps([]);
    setValidationToken("");
    setResult(null);
    setDeployment(null);
    try {
      const response = await fetch("/api/admin/publish", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "validate" }),
      });
      const payload = await response.json() as {
        ok: boolean;
        status?: Status;
        steps?: ValidationStep[];
        validationToken?: string;
        message?: string;
      };
      setSteps(payload.steps ?? []);
      if (!payload.ok || !payload.status || !payload.validationToken) throw new Error(payload.message || "Validation failed.");
      setStatus(payload.status);
      setValidationToken(payload.validationToken);
      setValidatedFingerprint(payload.status.fingerprint);
      setMessage("Validation passed. Review the file list, then confirm the GitHub publish.");
      await checkConnectivity();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Validation failed.");
    } finally {
      setBusy("");
    }
  }

  async function publish() {
    setBusy("publish");
    setMessage("Creating the Git commit and pushing main to GitHub…");
    try {
      const response = await fetch("/api/admin/publish", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "publish",
          validationToken,
          confirmation,
          commitMessage,
        }),
      });
      const payload = await response.json() as { ok: boolean; result?: PublishResult; message?: string; commit?: string };
      if (!payload.ok || !payload.result) throw new Error(payload.message || "Publishing failed.");
      setResult(payload.result);
      setMessage(payload.result.message);
      setConfirmation("");
      setValidationToken("");
      setValidatedFingerprint("");
      setSteps([]);
      await checkDeployment(payload.result.commit);
      await refreshStatus();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Publishing failed.");
    } finally {
      setBusy("");
    }
  }

  const hasPublishableWork = Boolean(status && (status.changes.length > 0 || status.ahead > 0));
  const canValidate = Boolean(status && status.blockedReasons.length === 0 && hasPublishableWork && !busy);
  const canPublish = Boolean(validationToken && confirmation === "PUBLISH" && commitMessage.trim().length >= 3 && !busy);
  const publishReadiness = !validationToken
    ? "Validate first"
    : commitMessage.trim().length < 3
      ? "Enter a commit message"
      : confirmation !== "PUBLISH"
        ? "Type PUBLISH to enable"
        : connectivity?.online
          ? "Ready to publish"
          : "Ready — GitHub will retry";

  return (
    <div className="editor-publisher">
      <div className="publisher-intro">
        <div>
          <p className="editor-eyebrow">Phase 4 · GitHub → Vercel</p>
          <h2>Publish the reviewed portfolio</h2>
          <p>Validate every listed file, commit it to the connected GitHub main branch, and let Vercel deploy that commit automatically.</p>
        </div>
        <button type="button" className="editor-secondary" disabled={loading || Boolean(busy)} onClick={() => void Promise.all([refreshStatus(), checkConnectivity()])}>
          <ArrowClockwiseIcon aria-hidden="true" /> Refresh
        </button>
      </div>

      {message ? <p className={`publisher-message${message.toLowerCase().includes("failed") ? " is-error" : ""}`} role="status">{message}</p> : null}

      {loading && !status ? <div className="editor-loading">Reading the local repository…</div> : null}

      {status ? (
        <>
          <section className="publisher-repository" aria-label="Publishing destination">
            <div><GitBranchIcon aria-hidden="true" /><span>Branch</span><strong>{status.branch}</strong></div>
            <div><GithubLogoIcon aria-hidden="true" /><span>GitHub</span><strong>{status.githubUrl || status.remote || "Not connected"}</strong></div>
            <div><CloudArrowUpIcon aria-hidden="true" /><span>Live site</span><strong>{status.liveUrl}</strong></div>
          </section>

          {status.blockedReasons.map((reason) => (
            <div className="publisher-warning is-blocked" key={reason}><WarningCircleIcon aria-hidden="true" /><p>{reason}</p></div>
          ))}

          <section className="publisher-card">
            <div className="publisher-card-head">
              <div>
                <span className="publisher-step">1</span>
                <h3>Review files</h3>
              </div>
              <span>{status.changes.length} changed file{status.changes.length === 1 ? "" : "s"}</span>
            </div>
            {status.changes.length ? (
              <ul className="publisher-file-list">
                {status.changes.map((change) => (
                  <li key={`${change.status}-${change.path}`}>
                    <span className={`publisher-file-kind is-${change.kind}`}>{changeLabels[change.kind]}</span>
                    <code>{change.path}</code>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="publisher-empty">No uncommitted files. {status.ahead ? `${status.ahead} local commit${status.ahead === 1 ? " is" : "s are"} ready to push.` : "The local repository matches its latest commit."}</p>
            )}
          </section>

          <section className="publisher-card">
            <div className="publisher-card-head">
              <div><span className="publisher-step">2</span><h3>Validate</h3></div>
              {validationToken ? <span className="publisher-passed"><CheckCircleIcon aria-hidden="true" /> Passed</span> : null}
            </div>
            <p className="publisher-card-copy">This checks the patch, Git LFS, ESLint, TypeScript, and the complete production build. It does not use the internet or publish anything.</p>
            {steps.length ? (
              <ul className="publisher-check-list">
                {steps.map((step) => (
                  <li className={step.status === "passed" ? "is-passed" : "is-failed"} key={step.label}>
                    {step.status === "passed" ? <CheckCircleIcon aria-hidden="true" /> : <WarningCircleIcon aria-hidden="true" />}
                    <span><strong>{step.label}</strong><small>{step.detail}</small></span>
                  </li>
                ))}
              </ul>
            ) : null}
            <button type="button" className="editor-primary" disabled={!canValidate} onClick={() => void validate()}>
              {busy === "validate" ? <SpinnerGapIcon className="editor-spin" aria-hidden="true" /> : <CheckCircleIcon aria-hidden="true" />}
              {busy === "validate" ? "Validating…" : "Validate for publishing"}
            </button>
          </section>

          <section className={`publisher-card${validationToken ? " is-ready" : ""}`}>
            <div className="publisher-card-head">
              <div><span className="publisher-step">3</span><h3>Commit and publish</h3></div>
              <span>{publishReadiness}</span>
            </div>
            <p className="publisher-card-copy">All files shown above will be committed and pushed to <strong>origin/main</strong>. Vercel’s Git integration will then start the live deployment.</p>
            <div className={`publisher-connectivity${connectivity?.online ? " is-connected" : " is-unavailable"}`}>
              {connectivityLoading ? <SpinnerGapIcon className="editor-spin" aria-hidden="true" /> : connectivity?.online ? <CheckCircleIcon aria-hidden="true" /> : <WarningCircleIcon aria-hidden="true" />}
              <span>
                <strong>{connectivityLoading ? "Checking GitHub connection" : connectivity?.label ?? "GitHub connection not checked"}</strong>
                <small>{connectivityLoading ? "Testing origin/main from this computer…" : connectivity?.detail ?? "Run the connection check before publishing."}</small>
              </span>
              <button type="button" className="editor-secondary" disabled={connectivityLoading || Boolean(busy)} onClick={() => void checkConnectivity()}>Check again</button>
            </div>
            <label className="editor-field">
              <span>Commit message</span>
              <input maxLength={72} value={commitMessage} onChange={(event) => setCommitMessage(event.target.value)} disabled={!validationToken || Boolean(busy)} />
            </label>
            <label className="editor-field publisher-confirmation">
              <span>Type PUBLISH to confirm</span>
              <input autoComplete="off" value={confirmation} onChange={(event) => setConfirmation(event.target.value.toUpperCase())} disabled={!validationToken || Boolean(busy)} />
            </label>
            {validationToken && confirmation !== "PUBLISH" ? <p className="publisher-confirmation-help">The button remains disabled until you type <strong>PUBLISH</strong> exactly. The GitHub connection is checked again when you publish.</p> : null}
            <button type="button" className="editor-publish publisher-live-button" disabled={!canPublish} onClick={() => void publish()}>
              {busy === "publish" ? <SpinnerGapIcon className="editor-spin" aria-hidden="true" /> : <CloudArrowUpIcon aria-hidden="true" />}
              {busy === "publish" ? "Publishing…" : "Publish to GitHub and Vercel"}
            </button>
          </section>

          {result ? (
            <section className="publisher-result" aria-live="polite">
              <CheckCircleIcon aria-hidden="true" />
              <div>
                <h3>GitHub push succeeded</h3>
                <p>Commit <strong>{result.shortCommit}</strong> is on main. The connected Vercel project is processing that commit.</p>
                <div className="publisher-result-links">
                  {result.githubCommitUrl ? <a href={result.githubCommitUrl} target="_blank" rel="noreferrer">View GitHub commit</a> : null}
                  <a href={result.liveUrl} target="_blank" rel="noreferrer">Open live portfolio</a>
                  <button type="button" onClick={() => void checkDeployment(result.commit)}>Refresh deployment status</button>
                </div>
                {deployment ? (
                  <p className={`publisher-deployment is-${deployment.state}`}>
                    <span aria-hidden="true" /> {deployment.label}{deployment.detail ? ` — ${deployment.detail}` : ""}
                    {deployment.detailsUrl ? <a href={deployment.detailsUrl} target="_blank" rel="noreferrer">View details</a> : null}
                  </p>
                ) : null}
              </div>
            </section>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
