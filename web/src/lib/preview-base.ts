/** GitHub Pages preview lives at /pfeifer-com/. Production (SiteGround) stays at /. */
export const PREVIEW_BASE = import.meta.env.BASE_URL.replace(/\/$/, "") === "/pfeifer-com"
  ? "/pfeifer-com"
  : "";

export function withBase(path: string): string {
  if (!path.startsWith("/")) return path;
  if (!PREVIEW_BASE) return path;
  if (path === "/") return `${PREVIEW_BASE}/`;
  if (path.startsWith(`${PREVIEW_BASE}/`)) return path;
  return `${PREVIEW_BASE}${path}`;
}
