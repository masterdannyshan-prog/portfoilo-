"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckCircleIcon,
  CopyIcon,
  DesktopIcon,
  DeviceMobileIcon,
  DeviceTabletIcon,
  EyeIcon,
  FloppyDiskIcon,
  PlusIcon,
  TrashIcon,
  UploadSimpleIcon,
} from "@phosphor-icons/react";
import { PortfolioPublisher } from "@/components/PortfolioPublisher";
import { RecoveryPanel } from "@/components/RecoveryPanel";

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
type JsonObject = { [key: string]: JsonValue };
type DocumentKey = string;
type Mode = "edit" | "preview" | "review" | "publish" | "recovery";
type Device = "phone" | "tablet" | "desktop";
type CaseStudySummary = { key: string; slug: string; title: string };
type DocumentSummary = { key: DocumentKey; label: string; description: string };

const fixedDocuments: DocumentSummary[] = [
  { key: "site", label: "Website content", description: "Navigation, homepage, About, background, tools and contact" },
  { key: "projects", label: "Project cards", description: "Work and Fun cards, order, thumbnails and links" },
];

const deviceWidths: Record<Device, number> = { phone: 375, tablet: 820, desktop: 1366 };

function labelFor(key: string) {
  return key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[-_]/g, " ").replace(/^./, (letter) => letter.toUpperCase());
}

function cloneValue<T extends JsonValue>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function newArrayItem(example: JsonValue): JsonValue {
  if (typeof example === "string") return "";
  if (typeof example === "number") return 0;
  if (typeof example === "boolean") return false;
  if (Array.isArray(example)) return [];
  if (example && typeof example === "object") {
    const copy = cloneValue(example) as JsonObject;
    for (const key of Object.keys(copy)) {
      if (typeof copy[key] !== "string") continue;
      if (key === "title" || key === "name" || key === "heading" || key === "label") copy[key] = "New item";
      else if (key === "slug") copy[key] = `new-item-${Date.now().toString().slice(-6)}`;
      else if (!["layout", "variant"].includes(key)) copy[key] = "";
    }
    return copy;
  }
  return null;
}

function setAtPath(root: JsonValue, path: (string | number)[], nextValue: JsonValue): JsonValue {
  if (path.length === 0) return nextValue;
  const [head, ...tail] = path;
  const copy = cloneValue(root);
  if (Array.isArray(copy) && typeof head === "number") copy[head] = setAtPath(copy[head], tail, nextValue);
  else if (copy && typeof copy === "object" && !Array.isArray(copy) && typeof head === "string") {
    copy[head] = setAtPath(copy[head], tail, nextValue);
  }
  return copy;
}

function summaryFor(value: JsonValue, index: number) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    for (const key of ["title", "name", "heading", "label", "slug", "course", "role"]) {
      if (typeof value[key] === "string" && value[key]) return value[key];
    }
  }
  return `Item ${index + 1}`;
}

function differences(before: JsonValue, after: JsonValue, path = ""): string[] {
  if (JSON.stringify(before) === JSON.stringify(after)) return [];
  if (Array.isArray(before) && Array.isArray(after)) {
    const results: string[] = [];
    const length = Math.max(before.length, after.length);
    for (let index = 0; index < length; index += 1) {
      const itemPath = `${path}[${index}]`;
      if (index >= before.length) results.push(`${itemPath} added`);
      else if (index >= after.length) results.push(`${itemPath} removed`);
      else results.push(...differences(before[index], after[index], itemPath));
    }
    return results;
  }
  if (before && after && typeof before === "object" && typeof after === "object" && !Array.isArray(before) && !Array.isArray(after)) {
    const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
    return [...keys].flatMap((key) => {
      const itemPath = path ? `${path} › ${labelFor(key)}` : labelFor(key);
      if (!(key in before)) return [`${itemPath} added`];
      if (!(key in after)) return [`${itemPath} removed`];
      return differences(before[key], after[key], itemPath);
    });
  }
  return [path || "Document"];
}

function FieldEditor({
  name,
  value,
  path,
  onChange,
}: {
  name: string;
  value: JsonValue;
  path: (string | number)[];
  onChange: (path: (string | number)[], value: JsonValue) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const looksLikeMedia = typeof value === "string" && (
    /^(src|image|logo|portrait|heroVideo)$/i.test(name)
    || /\.(png|jpe?g|webp|gif|svg|mp4|webm|pdf)$/i.test(value)
  );
  const multiline = typeof value === "string" && (value.length > 90 || /description|paragraph|subtitle|intro|detail|caption|explanation/i.test(name));

  async function upload(file: File) {
    setUploading(true);
    const body = new FormData();
    body.append("file", file);
    try {
      const response = await fetch("/api/admin/upload", { method: "POST", body });
      const result = await response.json() as { ok: boolean; path?: string; message?: string };
      if (!result.ok || !result.path) throw new Error(result.message || "Upload failed");
      onChange(path, result.path);
    } finally {
      setUploading(false);
    }
  }

  if (Array.isArray(value)) {
    return (
      <fieldset className="editor-array">
        <legend>{labelFor(name)} <span>{value.length}</span></legend>
        <div className="editor-array-list">
          {value.map((item, index) => (
            <details className="editor-array-item" open={value.length <= 3} key={index}>
              <summary>
                <span>{summaryFor(item, index)}</span>
                <span className="editor-item-actions" onClick={(event) => event.preventDefault()}>
                  <button type="button" aria-label="Move up" disabled={index === 0} onClick={() => {
                    const next = [...value]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; onChange(path, next);
                  }}><ArrowUpIcon aria-hidden="true" /></button>
                  <button type="button" aria-label="Move down" disabled={index === value.length - 1} onClick={() => {
                    const next = [...value]; [next[index + 1], next[index]] = [next[index], next[index + 1]]; onChange(path, next);
                  }}><ArrowDownIcon aria-hidden="true" /></button>
                  <button type="button" aria-label="Duplicate item" onClick={() => {
                    const next = [...value]; next.splice(index + 1, 0, cloneValue(item)); onChange(path, next);
                  }}><CopyIcon aria-hidden="true" /></button>
                  <button type="button" className="editor-danger" aria-label="Remove item" onClick={() => onChange(path, value.filter((_, itemIndex) => itemIndex !== index))}><TrashIcon aria-hidden="true" /></button>
                </span>
              </summary>
              <div className="editor-array-item-body">
                <FieldEditor name={String(index)} value={item} path={[...path, index]} onChange={onChange} />
              </div>
            </details>
          ))}
        </div>
        {value.length > 0 ? (
          <button className="editor-add" type="button" onClick={() => onChange(path, [...value, newArrayItem(value[value.length - 1])])}>
            <PlusIcon aria-hidden="true" /> Add item
          </button>
        ) : null}
      </fieldset>
    );
  }

  if (value && typeof value === "object") {
    return (
      <fieldset className="editor-object">
        {name !== "root" ? <legend>{labelFor(name)}</legend> : null}
        <div className="editor-fields">
          {Object.entries(value).map(([key, child]) => (
            <FieldEditor name={key} value={child} path={[...path, key]} onChange={onChange} key={key} />
          ))}
        </div>
      </fieldset>
    );
  }

  if (typeof value === "boolean") {
    return (
      <label className="editor-checkbox">
        <input type="checkbox" checked={value} onChange={(event) => onChange(path, event.target.checked)} />
        <span>{labelFor(name)}</span>
      </label>
    );
  }

  if (typeof value === "number") {
    return (
      <label className="editor-field">
        <span>{labelFor(name)}</span>
        <input type="number" value={value} onChange={(event) => onChange(path, Number(event.target.value))} />
      </label>
    );
  }

  return (
    <label className="editor-field">
      <span>{labelFor(name)}</span>
      {multiline ? (
        <textarea value={String(value ?? "")} rows={4} onChange={(event) => onChange(path, event.target.value)} />
      ) : (
        <input value={String(value ?? "")} onChange={(event) => onChange(path, event.target.value)} />
      )}
      {looksLikeMedia ? (
        <span className="editor-upload-row">
          <span className="editor-path-hint">Paste a public path or upload a replacement.</span>
          <span className="editor-upload">
            <UploadSimpleIcon aria-hidden="true" />
            {uploading ? "Uploading…" : "Upload"}
            <input
              type="file"
              accept="image/*,video/mp4,video/webm,application/pdf"
              disabled={uploading}
              onChange={(event) => event.target.files?.[0] && upload(event.target.files[0])}
            />
          </span>
        </span>
      ) : null}
    </label>
  );
}

export function PortfolioEditor() {
  const [documentKey, setDocumentKey] = useState<DocumentKey>("site");
  const [caseStudies, setCaseStudies] = useState<CaseStudySummary[]>([]);
  const [mode, setMode] = useState<Mode>("edit");
  const [device, setDevice] = useState<Device>("desktop");
  const [previewView, setPreviewView] = useState("home");
  const [value, setValue] = useState<JsonValue>({});
  const [published, setPublished] = useState<JsonValue>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [reviewed, setReviewed] = useState(false);
  const [previewRevision, setPreviewRevision] = useState(0);
  const [creatingCase, setCreatingCase] = useState(false);
  const [caseTitle, setCaseTitle] = useState("");
  const [caseSlug, setCaseSlug] = useState("");
  const [caseCollection, setCaseCollection] = useState<"projects" | "funProjects">("projects");
  const [slugTouched, setSlugTouched] = useState(false);
  const [createError, setCreateError] = useState("");

  const documents = useMemo<DocumentSummary[]>(() => [
    ...fixedDocuments,
    ...caseStudies.map((item) => ({
      key: item.key,
      label: `${item.title} case study`,
      description: item.key === "sitescope"
        ? "Hero, chapters, sections, media and sample links"
        : item.key === "ghost-frame"
          ? "Hero, chapters, decisions, sections and media"
          : "Reusable case-study sections, media, decisions and links",
    })),
  ], [caseStudies]);

  async function loadCaseStudies() {
    const response = await fetch("/api/admin/case-studies", { cache: "no-store" });
    const result = await response.json() as { ok: boolean; caseStudies?: CaseStudySummary[]; message?: string };
    if (!result.ok || !result.caseStudies) throw new Error(result.message || "Unable to list case studies.");
    setCaseStudies(result.caseStudies);
  }

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/case-studies", { cache: "no-store" })
      .then((response) => response.json())
      .then((result: { ok: boolean; caseStudies?: CaseStudySummary[]; message?: string }) => {
        if (cancelled) return;
        if (!result.ok || !result.caseStudies) throw new Error(result.message || "Unable to list case studies.");
        setCaseStudies(result.caseStudies);
      })
      .catch((error: unknown) => {
        if (!cancelled) setMessage(error instanceof Error ? error.message : "Unable to list case studies.");
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/content?document=${documentKey}`, { cache: "no-store" })
      .then((response) => response.json())
      .then((result: { ok: boolean; published: JsonValue; draft: JsonValue; message?: string }) => {
        if (cancelled) return;
        if (!result.ok) throw new Error(result.message || "Unable to load content");
        setPublished(result.published);
        setValue(result.draft);
        setReviewed(false);
        setLoading(false);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setMessage(error instanceof Error ? error.message : "Unable to load content");
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [documentKey]);

  const changed = useMemo(() => JSON.stringify(value) !== JSON.stringify(published), [value, published]);
  const changeList = useMemo(() => differences(published, value), [published, value]);

  function update(path: (string | number)[], nextValue: JsonValue) {
    setValue((current) => setAtPath(current, path, nextValue));
    setReviewed(false);
  }

  async function saveDraft(showMessage = true): Promise<boolean> {
    setBusy(true);
    try {
      const response = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ document: documentKey, action: "save-draft", value }),
      });
      const result = await response.json() as { ok: boolean; message: string };
      if (!result.ok) throw new Error(result.message);
      if (showMessage) setMessage(result.message);
      setPreviewRevision((revision) => revision + 1);
      return true;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save draft.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function openPreview() {
    if (!await saveDraft(false)) return;
    setMessage("Draft saved locally for preview. Nothing was applied or published.");
    if (documentKey === "sitescope") setPreviewView("sitescope");
    else if (documentKey === "ghost-frame") setPreviewView("ghost-frame");
    else if (documentKey.startsWith("case:")) setPreviewView(documentKey);
    else if (documentKey === "projects" && previewView === "sitescope") setPreviewView("home");
    setMode("preview");
  }

  function slugify(title: string) {
    return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  async function createCaseStudy(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setCreateError("");
    try {
      const response = await fetch("/api/admin/case-studies", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title: caseTitle, slug: caseSlug, collection: caseCollection }),
      });
      const result = await response.json() as { ok: boolean; caseStudy?: CaseStudySummary; message?: string };
      if (!result.ok || !result.caseStudy) throw new Error(result.message || "Unable to create case study.");
      await loadCaseStudies();
      setLoading(true);
      setDocumentKey(result.caseStudy.key);
      setPreviewView(result.caseStudy.key);
      setMode("edit");
      setMessage(result.message || "Case-study draft created.");
      setCreatingCase(false);
      setCaseTitle("");
      setCaseSlug("");
      setSlugTouched(false);
    } catch (error) {
      setCreateError(error instanceof Error ? error.message : "Unable to create case study.");
    } finally {
      setBusy(false);
    }
  }

  async function publish() {
    if (!reviewed || !changed) return;
    setBusy(true);
    try {
      const response = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ document: documentKey, action: "publish", value }),
      });
      const result = await response.json() as { ok: boolean; message: string };
      if (!result.ok) throw new Error(result.message);
      setPublished(cloneValue(value));
      setReviewed(false);
      setMessage(result.message);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not apply changes.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="portfolio-editor">
      <header className="editor-topbar">
        <div>
          <p className="editor-eyebrow">Local portfolio editor</p>
          <h1>Content Studio</h1>
        </div>
        <div className="editor-topbar-actions">
          <span className={`editor-state ${changed ? "is-draft" : "is-synced"}`}>
            {changed ? "Unapplied changes" : "Matches site files"}
          </span>
          <button type="button" className="editor-secondary" disabled={busy || loading} onClick={() => void saveDraft()}>
            <FloppyDiskIcon aria-hidden="true" /> Save draft
          </button>
          <button type="button" className="editor-primary" disabled={busy || loading} onClick={() => void openPreview()}>
            <EyeIcon aria-hidden="true" /> Preview
          </button>
        </div>
      </header>

      <div className="editor-layout">
        <aside className="editor-sidebar">
          <p className="editor-sidebar-label">Content</p>
          <nav aria-label="Editable portfolio documents">
            {documents.map((document) => (
              <button
                type="button"
                className={document.key === documentKey ? "is-active" : ""}
                onClick={() => {
                  if (document.key === documentKey) {
                    setMode("edit");
                    return;
                  }
                  setLoading(true);
                  setMessage("");
                  setDocumentKey(document.key);
                  setMode("edit");
                }}
                key={document.key}
              >
                <strong>{document.label}</strong>
                <span>{document.description}</span>
              </button>
            ))}
          </nav>
          <button type="button" className="editor-new-case" onClick={() => {
            setCreateError("");
            setCreatingCase(true);
          }}>
            <PlusIcon aria-hidden="true" /> New case study
          </button>
          <div className="editor-safety-note">
            <strong>Local only</strong>
            <p>Applying changes updates files on this computer. It never deploys or pushes to GitHub.</p>
          </div>
        </aside>

        <section className="editor-workspace">
          <div className="editor-workspace-head">
            <div className="editor-tabs" role="tablist" aria-label="Editor workflow">
              {(["edit", "preview", "review", "publish", "recovery"] as Mode[]).map((item) => (
                <button
                  role="tab"
                  aria-selected={mode === item}
                  type="button"
                  onClick={() => item === "preview" ? void openPreview() : setMode(item)}
                  key={item}
                >
                  {labelFor(item)}
                </button>
              ))}
            </div>
            {message ? <p className="editor-message" role="status">{message}</p> : null}
          </div>

          {loading ? <div className="editor-loading">Loading editable content…</div> : null}

          {mode === "publish" ? <PortfolioPublisher /> : null}
          {mode === "recovery" ? <RecoveryPanel /> : null}

          {!loading && mode === "edit" ? (
            <div className="editor-form">
              <div className="editor-form-intro">
                <h2>{documents.find((document) => document.key === documentKey)?.label}</h2>
                <p>Fields keep the portfolio’s existing templates and design rules. Reorder array items with the arrow controls.</p>
              </div>
              <FieldEditor name="root" value={value} path={[]} onChange={update} />
            </div>
          ) : null}

          {!loading && mode === "preview" ? (
            <div className="editor-preview">
              <div className="editor-preview-toolbar">
                <label>
                  <span>Page</span>
                  <select value={previewView} onChange={(event) => setPreviewView(event.target.value)}>
                    <option value="home">Homepage</option>
                    <option value="fun">Fun page</option>
                    <option value="sitescope">SiteScope case study</option>
                    <option value="ghost-frame">Ghost Frame case study</option>
                    {documentKey.startsWith("case:") ? (
                      <option value={documentKey}>
                        {caseStudies.find((item) => item.key === documentKey)?.title || "New case study"}
                      </option>
                    ) : null}
                  </select>
                </label>
                <div className="editor-device-switcher" aria-label="Preview width">
                  <button type="button" className={device === "phone" ? "is-active" : ""} onClick={() => setDevice("phone")} aria-label="Phone preview"><DeviceMobileIcon /></button>
                  <button type="button" className={device === "tablet" ? "is-active" : ""} onClick={() => setDevice("tablet")} aria-label="Tablet preview"><DeviceTabletIcon /></button>
                  <button type="button" className={device === "desktop" ? "is-active" : ""} onClick={() => setDevice("desktop")} aria-label="Desktop preview"><DesktopIcon /></button>
                </div>
                <span>{deviceWidths[device]}px</span>
              </div>
              <div className="editor-preview-stage">
                <iframe
                  title={`${labelFor(previewView)} draft preview`}
                  src={`/admin/preview/${previewView}?revision=${previewRevision}`}
                  style={{ width: deviceWidths[device] }}
                  key={`${previewView}-${previewRevision}`}
                />
              </div>
            </div>
          ) : null}

          {!loading && mode === "review" ? (
            <div className="editor-review">
              <div className="editor-review-head">
                <CheckCircleIcon aria-hidden="true" />
                <div>
                  <h2>Review before applying</h2>
                  <p>{changed ? `${changeList.length} changed field${changeList.length === 1 ? "" : "s"} in this document.` : "No changes to apply."}</p>
                </div>
              </div>
              {changed ? (
                <>
                  <ol className="editor-change-list">
                    {changeList.slice(0, 100).map((change, index) => <li key={`${change}-${index}`}>{change}</li>)}
                  </ol>
                  {changeList.length > 100 ? <p>Plus {changeList.length - 100} more changes.</p> : null}
                  <label className="editor-review-check">
                    <input type="checkbox" checked={reviewed} onChange={(event) => setReviewed(event.target.checked)} />
                    <span>I reviewed the draft preview and want to update the local content file.</span>
                  </label>
                  <button type="button" className="editor-publish" disabled={!reviewed || busy} onClick={() => void publish()}>
                    Apply reviewed changes locally
                  </button>
                  <p className="editor-publish-note">This creates a local backup. It does not push to GitHub or deploy to Vercel.</p>
                </>
              ) : null}
            </div>
          ) : null}
        </section>
      </div>

      {creatingCase ? (
        <div className="editor-dialog-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setCreatingCase(false);
        }}>
          <section className="editor-dialog" role="dialog" aria-modal="true" aria-labelledby="new-case-title">
            <div className="editor-dialog-heading">
              <p className="editor-eyebrow">Reusable case-study template</p>
              <h2 id="new-case-title">Create a case study</h2>
              <p>This starts a local draft and adds a linked draft card. Nothing changes on the site until you review and apply each document.</p>
            </div>
            <form onSubmit={(event) => void createCaseStudy(event)}>
              <label className="editor-field">
                <span>Project title</span>
                <input
                  autoFocus
                  required
                  value={caseTitle}
                  onChange={(event) => {
                    setCaseTitle(event.target.value);
                    if (!slugTouched) setCaseSlug(slugify(event.target.value));
                  }}
                />
              </label>
              <label className="editor-field">
                <span>Page URL</span>
                <span className="editor-slug-field">
                  <span>/projects/</span>
                  <input
                    required
                    pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                    value={caseSlug}
                    onChange={(event) => {
                      setSlugTouched(true);
                      setCaseSlug(event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
                    }}
                  />
                </span>
              </label>
              <label className="editor-field">
                <span>Project collection</span>
                <select value={caseCollection} onChange={(event) => setCaseCollection(event.target.value as "projects" | "funProjects")}>
                  <option value="projects">Work</option>
                  <option value="funProjects">Fun</option>
                </select>
              </label>
              {createError ? <p className="editor-dialog-error" role="alert">{createError}</p> : null}
              <div className="editor-dialog-actions">
                <button type="button" className="editor-secondary" onClick={() => setCreatingCase(false)}>Cancel</button>
                <button type="submit" className="editor-primary" disabled={busy || !caseTitle || !caseSlug}>
                  {busy ? "Creating…" : "Create drafts"}
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </main>
  );
}
