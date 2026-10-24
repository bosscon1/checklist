/** Office domain for staff accounts. Personal inboxes cannot open admin. */
export const STAFF_EMAIL_DOMAIN = "pfeiferbuild.com";

export function isStaffEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  const at = normalized.lastIndexOf("@");
  if (at < 1) return false;
  return normalized.slice(at + 1) === STAFF_EMAIL_DOMAIN;
}

export function staffEmailError(): string {
  return `Admin accounts must use an @${STAFF_EMAIL_DOMAIN} email.`;
}
