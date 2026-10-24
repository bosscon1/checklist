/** Staff admin session for this Grok preview (24 hours). */

const BEARER_KEY = "grok-auth.bearer-token";
const REMEMBER_KEY = "pfeifer-staff-session";
const TTL_MS = 24 * 60 * 60 * 1000;

export function restoreStaffSession() {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(REMEMBER_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as { token?: string; exp?: number };
    if (!parsed.token || typeof parsed.exp !== "number" || Date.now() > parsed.exp) {
      window.localStorage.removeItem(REMEMBER_KEY);
      return;
    }
    if (!window.sessionStorage.getItem(BEARER_KEY)) {
      window.sessionStorage.setItem(BEARER_KEY, parsed.token);
    }
  } catch {
    /* storage unavailable */
  }
}

export function rememberStaffSession(token: string) {
  if (typeof window === "undefined" || !token) return;
  try {
    window.sessionStorage.setItem(BEARER_KEY, token);
    window.localStorage.setItem(
      REMEMBER_KEY,
      JSON.stringify({ token, exp: Date.now() + TTL_MS }),
    );
  } catch {
    /* storage unavailable */
  }
}

export function rememberCurrentStaffSession() {
  if (typeof window === "undefined") return;
  try {
    const token = window.sessionStorage.getItem(BEARER_KEY);
    if (token) rememberStaffSession(token);
  } catch {
    /* storage unavailable */
  }
}

export function tokenFromAuthData(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const token = (data as { token?: unknown }).token;
  return typeof token === "string" && token.length > 0 ? token : null;
}

export function clearStaffSession() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(REMEMBER_KEY);
  } catch {
    /* storage unavailable */
  }
}

restoreStaffSession();
