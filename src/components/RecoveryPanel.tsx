"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArchiveBoxIcon,
  ArrowClockwiseIcon,
  ArrowCounterClockwiseIcon,
  CheckCircleIcon,
  ClockCounterClockwiseIcon,
  FileImageIcon,
  ShieldCheckIcon,
  SpinnerGapIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";

type Backup = { filename: string; document: string; label: string; createdAt: string; size: number };
type Media = { path: string; size: number; referenced: boolean };
type ArchivedMedia = { id: string; path: string; size: number; archivedAt: string };
type HistoryItem = { commit: string; shortCommit: string; subject: string; createdAt: string };
type Repository = {
  head: string;
  branch: string;
  ahead: number;
  behind: number;
  changes: { path: string }[];
  blockedReasons: string[];
  liveUrl: string;
};
type RecoveryData = {
  backups: Backup[];
  media: Media[];
  archivedMedia: ArchivedMedia[];
  history: HistoryItem[];
  repository: Repository;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export function RecoveryPanel() {
  const [data, setData] = useState<RecoveryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [archiveConfirmation, setArchiveConfirmation] = useState("");
  const [rollbackConfirmation, setRollbackConfirmation] = useState("");
  const [rollbackResult, setRollbackResult] = useState<{ shortCommit: string; restoredCommit: string; liveUrl: string; githubCommitUrl: string; message: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/recovery", { cache: "no-store" });
      const payload = await response.json() as { ok: boolean; message?: string } & Partial<RecoveryData>;
      if (!payload.ok || !payload.backups || !payload.media || !payload.archivedMedia || !payload.history || !payload.repository) {
        throw new Error(payload.message || "Could not load recovery information.");
      }
      setData({
        backups: payload.backups,
        media: payload.media,
        archivedMedia: payload.archivedMedia,
        history: payload.history,
        repository: payload.repository,
      });
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load recovery information.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/recovery", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload: { ok: boolean; message?: string } & Partial<RecoveryData>) => {
        if (cancelled) return;
        if (!payload.ok || !payload.backups || !payload.media || !payload.archivedMedia || !payload.history || !payload.repository) {
          throw new Error(payload.message || "Could not load recovery information.");
        }
        setData({ backups: payload.backups, media: payload.media, archivedMedia: payload.archivedMedia, history: payload.history, repository: payload.repository });
        setLoading(false);
      })
      .catch((loadError: unknown) => {
        if (cancelled) return;
        setError(loadError instanceof Error ? loadError.message : "Could not load recovery information.");
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  async function post(action: string, input: Record<string, string>) {
    setBusy(action);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/admin/recovery", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action, ...input }),
      });
      const payload = await response.json() as {
        ok: boolean;
        message?: string;
        result?: { message?: string; shortCommit?: string; restoredCommit?: string; liveUrl?: string; githubCommitUrl?: string };
      };
      if (!payload.ok || !payload.result) throw new Error(payload.message || "Recovery action failed.");
      setMessage(payload.result.message || "Recovery action completed.");
      if (action === "rollback-live" && payload.result.shortCommit && payload.result.restoredCommit && payload.result.liveUrl) {
        setRollbackResult({
          shortCommit: payload.result.shortCommit,
          restoredCommit: payload.result.restoredCommit,
          liveUrl: payload.result.liveUrl,
          githubCommitUrl: payload.result.githubCommitUrl ?? "",
          message: payload.result.message ?? "Rollback pushed.",
        });
      }
      setArchiveConfirmation("");
      setRollbackConfirmation("");
      await load();
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Recovery action failed.");
    } finally {
      setBusy("");
    }
  }

  const unusedMedia = useMemo(() => data?.media.filter((item) => !item.referenced) ?? [], [data]);
  const referencedMedia = (data?.media.length ?? 0) - unusedMedia.length;
  const rollbackBlocked = Boolean(!data || data.repository.changes.length || data.repository.ahead || data.repository.behind || data.repository.blockedReasons.length || data.history.length < 2);

  return (
    <div className="editor-recovery">
      <div className="recovery-intro">
        <div>
          <p className="editor-eyebrow">Phase 5 · Recovery and handoff</p>
          <h2>Recover without breaking the portfolio</h2>
          <p>Restore content into Draft, archive unused uploads without deleting them, or roll the live website back through a traceable Git commit.</p>
        </div>
        <button type="button" className="editor-secondary" disabled={loading || Boolean(busy)} onClick={() => void load()}>
          <ArrowClockwiseIcon aria-hidden="true" /> Refresh
        </button>
      </div>

      {error ? <p className="recovery-message is-error" role="alert"><WarningCircleIcon aria-hidden="true" />{error}</p> : null}
      {message ? <p className="recovery-message" role="status"><CheckCircleIcon aria-hidden="true" />{message}</p> : null}
      {loading && !data ? <div className="editor-loading">Reading backups, uploads, and Git history…</div> : null}

      {data ? (
        <div className="recovery-grid">
          <section className="recovery-card recovery-card--wide">
            <div className="recovery-card-head">
              <div><ClockCounterClockwiseIcon aria-hidden="true" /><span><h3>Content backups</h3><p>Restoring creates a draft. It never overwrites the current file or changes the live site.</p></span></div>
              <strong>{data.backups.length}</strong>
            </div>
            {data.backups.length ? (
              <ul className="recovery-list">
                {data.backups.map((backup) => (
                  <li key={backup.filename}>
                    <span><strong>{backup.label}</strong><small>{formatDate(backup.createdAt)} · {formatBytes(backup.size)}</small></span>
                    <button type="button" disabled={Boolean(busy)} onClick={() => void post("restore-backup", { filename: backup.filename })}>
                      {busy === "restore-backup" ? <SpinnerGapIcon className="editor-spin" aria-hidden="true" /> : <ArrowCounterClockwiseIcon aria-hidden="true" />}
                      Restore as draft
                    </button>
                  </li>
                ))}
              </ul>
            ) : <p className="recovery-empty">Backups appear here after you apply reviewed content changes.</p>}
          </section>

          <section className="recovery-card">
            <div className="recovery-card-head">
              <div><FileImageIcon aria-hidden="true" /><span><h3>Media health</h3><p>Draft and published references are checked before an upload is considered unused.</p></span></div>
            </div>
            <div className="recovery-stat-row">
              <span><strong>{referencedMedia}</strong>Referenced</span>
              <span><strong>{unusedMedia.length}</strong>Unused</span>
              <span><strong>{data.archivedMedia.length}</strong>Archived</span>
            </div>
            {unusedMedia.length ? (
              <>
                <ul className="recovery-media-list">
                  {unusedMedia.map((item) => <li key={item.path}><code>{item.path}</code><span>{formatBytes(item.size)}</span></li>)}
                </ul>
                <label className="editor-field">
                  <span>Type ARCHIVE to move unused files safely</span>
                  <input value={archiveConfirmation} onChange={(event) => setArchiveConfirmation(event.target.value.toUpperCase())} disabled={Boolean(busy)} />
                </label>
                <button type="button" className="recovery-archive-button" disabled={archiveConfirmation !== "ARCHIVE" || Boolean(busy)} onClick={() => void post("archive-unused-media", { confirmation: archiveConfirmation })}>
                  {busy === "archive-unused-media" ? <SpinnerGapIcon className="editor-spin" aria-hidden="true" /> : <ArchiveBoxIcon aria-hidden="true" />}
                  Archive unused media
                </button>
              </>
            ) : <p className="recovery-empty">No unused uploaded media was found.</p>}
          </section>

          <section className="recovery-card">
            <div className="recovery-card-head">
              <div><ArchiveBoxIcon aria-hidden="true" /><span><h3>Media archive</h3><p>Archived uploads stay on this computer and can be returned to their original paths.</p></span></div>
            </div>
            {data.archivedMedia.length ? (
              <ul className="recovery-list recovery-list--compact">
                {data.archivedMedia.map((item) => (
                  <li key={item.id}>
                    <span><strong>{item.path}</strong><small>{formatDate(item.archivedAt)} · {formatBytes(item.size)}</small></span>
                    <button type="button" disabled={Boolean(busy)} onClick={() => void post("restore-media", { id: item.id })}>Restore</button>
                  </li>
                ))}
              </ul>
            ) : <p className="recovery-empty">The recovery archive is empty.</p>}
          </section>

          <section className="recovery-card recovery-card--wide recovery-live">
            <div className="recovery-card-head">
              <div><ShieldCheckIcon aria-hidden="true" /><span><h3>Restore the previous live version</h3><p>This creates and pushes a new Git revert commit. History is preserved and Vercel deploys the result normally.</p></span></div>
            </div>
            {data.history.length >= 2 ? (
              <div className="recovery-history">
                <div><span>Current</span><strong>{data.history[0].subject}</strong><code>{data.history[0].shortCommit}</code></div>
                <ArrowCounterClockwiseIcon aria-hidden="true" />
                <div><span>Restore</span><strong>{data.history[1].subject}</strong><code>{data.history[1].shortCommit}</code></div>
              </div>
            ) : null}
            {rollbackBlocked ? (
              <p className="recovery-blocked"><WarningCircleIcon aria-hidden="true" />Rollback unlocks only when main is clean, synchronized with GitHub, and has an earlier commit.</p>
            ) : (
              <>
                <label className="editor-field">
                  <span>Type ROLLBACK to confirm the live restore</span>
                  <input value={rollbackConfirmation} onChange={(event) => setRollbackConfirmation(event.target.value.toUpperCase())} disabled={Boolean(busy)} />
                </label>
                <button type="button" className="recovery-rollback-button" disabled={rollbackConfirmation !== "ROLLBACK" || Boolean(busy)} onClick={() => void post("rollback-live", { confirmation: rollbackConfirmation, expectedCommit: data.repository.head })}>
                  {busy === "rollback-live" ? <SpinnerGapIcon className="editor-spin" aria-hidden="true" /> : <ArrowCounterClockwiseIcon aria-hidden="true" />}
                  Restore previous live version
                </button>
              </>
            )}
            {rollbackResult ? (
              <div className="recovery-result">
                <CheckCircleIcon aria-hidden="true" />
                <p>{rollbackResult.message} New commit: <strong>{rollbackResult.shortCommit}</strong>.</p>
                <span>{rollbackResult.githubCommitUrl ? <a href={rollbackResult.githubCommitUrl} target="_blank" rel="noreferrer">View GitHub commit</a> : null}<a href={rollbackResult.liveUrl} target="_blank" rel="noreferrer">Open live portfolio</a></span>
              </div>
            ) : null}
          </section>
        </div>
      ) : null}
    </div>
  );
}
