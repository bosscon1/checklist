import type { GalleryFolder } from "@/lib/gallery.functions";

export type PhpBridgeUser = { email: string; name: string };
let phpCsrf: string | null = null;

export type PhpBridgeStatus = {
  ok: boolean;
  php?: boolean;
  config_file?: boolean;
  password_set?: boolean;
  mysql?: boolean;
  mysql_error?: string | null;
  table?: boolean;
  google?: boolean;
  ready?: boolean;
  user?: PhpBridgeUser | null;
  error?: string;
};

export function isLivePfeiferHost(): boolean {
  if (typeof window === "undefined") return false;
  // PHP CMS writes must be enabled deliberately for a staging or approved
  // production build. Never infer write access from the current hostname.
  return import.meta.env.VITE_PHP_CMS_ENABLED === "true";
}

export function phpBridgeReady(status: PhpBridgeStatus | null | undefined): boolean {
  return Boolean(status?.php && status.ready);
}

export async function phpBridgeStatus(): Promise<PhpBridgeStatus | null> {
  try {
    const res = await fetch("/api/bridge/status.php", { credentials: "include", cache: "no-store" });
    const text = await res.text();
    if (!text.trim().startsWith("{")) {
      return { ok: false, php: false, error: "PHP did not run. Confirm api/bridge/*.php is in the SiteGround web root and .php files execute." };
    }
    return JSON.parse(text) as PhpBridgeStatus;
  } catch {
    return { ok: false, php: false, error: "Could not reach /api/bridge/status.php." };
  }
}

export async function phpBridgeSession(): Promise<PhpBridgeUser | null> {
  try {
    const res = await fetch("/api/bridge/session.php", { credentials: "include" });
    const text = await res.text();
    if (!res.ok || !text.trim().startsWith("{")) return null;
    const body = JSON.parse(text) as { user?: PhpBridgeUser | null; csrf?: string };
    phpCsrf = typeof body.csrf === "string" ? body.csrf : null;
    return body.user ?? null;
  } catch {
    return null;
  }
}

async function phpCsrfToken(): Promise<string> {
  if (phpCsrf) return phpCsrf;
  await phpBridgeSession();
  if (!phpCsrf) throw new Error("Your PHP admin session expired. Sign in again.");
  return phpCsrf;
}

async function phpJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const csrf = await phpCsrfToken();
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  headers.set("X-Pfeifer-CSRF", csrf);
  const res = await fetch(path, { ...init, credentials: "include", headers });
  const text = await res.text();
  let body: { ok?: boolean; error?: string } & T;
  try {
    body = JSON.parse(text) as typeof body;
  } catch {
    throw new Error("PHP bridge did not respond.");
  }
  if (!res.ok || !body.ok) throw new Error(body.error || "Could not save media.");
  return body;
}

export async function phpListGalleryFolders(): Promise<GalleryFolder[]> {
  const body = await phpJson<{ folders: GalleryFolder[] }>("/api/bridge/media-list.php");
  return body.folders;
}

export async function phpUploadGalleryPhotos(data: {
  category: string;
  city: string;
  what: string;
  files: File[];
}): Promise<{ category: string; folders: GalleryFolder[]; results: Array<{
  original: string;
  name?: string;
  largeUrl: string;
  thumbUrl: string;
  error?: string | null;
}> }> {
  const form = new FormData();
  form.set("category", data.category);
  form.set("city", data.city);
  form.set("what", data.what);
  for (const file of data.files) form.append("files[]", file, file.name);
  return phpJson<{
    category: string;
    folders: GalleryFolder[];
    results: Array<{
      original: string;
      name?: string;
      largeUrl: string;
      thumbUrl: string;
      error?: string | null;
    }>;
  }>("/api/bridge/media-upload.php", { method: "POST", body: form });
}

export async function phpDeleteGalleryPhoto(data: { category: string; name: string }): Promise<{
  folder: GalleryFolder;
  deleted: string;
}> {
  return phpJson<{ folder: GalleryFolder; deleted: string }>("/api/bridge/media-delete.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function phpUploadGalleryVideo(data: { category: string; file: File }): Promise<{
  folder: GalleryFolder;
  name: string;
}> {
  const form = new FormData();
  form.set("category", data.category);
  form.set("video", data.file, data.file.name);
  return phpJson<{ folder: GalleryFolder; name: string }>("/api/bridge/hero-video-upload.php", {
    method: "POST",
    body: form,
  });
}

export async function phpDeleteGalleryVideo(data: { category: string }): Promise<{ folder: GalleryFolder }> {
  return phpJson<{ folder: GalleryFolder }>("/api/bridge/hero-video-delete.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function phpSaveGallerySettings(data: {
  category: string;
  featured?: string | null;
  order?: string[];
  overlay?: number;
  video?: string | null;
}): Promise<void> {
  await phpJson("/api/bridge/gallery-settings.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
