import "server-only";
import { headers } from "next/headers";

export function isLocalEditorEnabled() {
  return process.env.NODE_ENV === "development" && process.env.PORTFOLIO_LOCAL_EDITOR === "1";
}

export async function assertLocalEditorAccess(write = false) {
  if (!isLocalEditorEnabled()) throw new Error("LOCAL_EDITOR_DISABLED");
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "";
  if (!/^(127\.0\.0\.1|localhost):\d+$/.test(host)) throw new Error("LOCAL_EDITOR_HOST_REQUIRED");
  if (write) {
    const origin = requestHeaders.get("origin");
    if (!origin || new URL(origin).host !== host) throw new Error("LOCAL_EDITOR_ORIGIN_REQUIRED");
  }
}
