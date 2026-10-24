export type ChecklistStatus = "open" | "done" | "dismissed";
export type ChecklistActor = "user" | "bot";

export type ChecklistItem = {
  id: string;
  text: string;
  status: ChecklistStatus;
  source: ChecklistActor;
  statusSource: ChecklistActor;
  botKey: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ChecklistPatch = {
  text?: string;
  status?: ChecklistStatus;
};

export type RuleResult =
  | { ok: true; text?: string; status?: ChecklistStatus; statusSource?: ChecklistActor }
  | { ok: false; status: 400 | 409; error: string };

const STATUSES: ChecklistStatus[] = ["open", "done", "dismissed"];

export function normalizeChecklistText(input: string): string {
  return input.replace(/\s+/g, " ").trim();
}

export function parseChecklistText(
  input: unknown,
): { ok: true; text: string } | { ok: false; error: string } {
  if (typeof input !== "string") return { ok: false, error: "Text is required." };
  const text = normalizeChecklistText(input);
  if (!text) return { ok: false, error: "Text is required." };
  if (text.length > 280) return { ok: false, error: "Keep it under 280 characters." };
  return { ok: true, text };
}

export function parseBotKey(
  input: unknown,
): { ok: true; key: string } | { ok: false; error: string } {
  if (typeof input !== "string") return { ok: false, error: "A stable key is required." };
  const key = input.trim();
  if (!key || key.length > 80 || /\s/.test(key)) {
    return { ok: false, error: "Key must be 1–80 characters with no spaces." };
  }
  return { ok: true, key };
}

export function isChecklistStatus(value: unknown): value is ChecklistStatus {
  return typeof value === "string" && STATUSES.includes(value as ChecklistStatus);
}

export function applyUserPatch(
  item: { status: ChecklistStatus; text: string },
  patch: ChecklistPatch,
): RuleResult {
  const next: { text?: string; status?: ChecklistStatus; statusSource?: ChecklistActor } = {};
  if (patch.text !== undefined) {
    const parsed = parseChecklistText(patch.text);
    if (!parsed.ok) return { ok: false, status: 400, error: parsed.error };
    if (parsed.text !== item.text) next.text = parsed.text;
  }
  if (patch.status !== undefined) {
    if (!isChecklistStatus(patch.status)) {
      return { ok: false, status: 400, error: "Status must be open, done, or dismissed." };
    }
    if (patch.status !== item.status) {
      next.status = patch.status;
      next.statusSource = "user";
    }
  }
  if (next.text === undefined && next.status === undefined) return { ok: true };
  return { ok: true, ...next };
}

export function applyBotPatch(
  item: { status: ChecklistStatus; text: string },
  patch: { text?: string; status?: "done" },
): RuleResult {
  if (patch.status !== undefined && patch.status !== "done") {
    return { ok: false, status: 400, error: "The bot can only mark an open item done." };
  }
  if (item.status === "dismissed") {
    return { ok: false, status: 409, error: "Dismissed items stay dismissed." };
  }
  if (patch.status === "done" && item.status === "done" && patch.text === undefined) {
    return { ok: true };
  }
  if (patch.text !== undefined && item.status !== "open") {
    return { ok: false, status: 409, error: "Only open items can be reworded." };
  }
  if (patch.status === "done" && item.status !== "open") {
    return { ok: false, status: 409, error: "Only an open item can be marked done." };
  }

  const next: { text?: string; status?: ChecklistStatus; statusSource?: ChecklistActor } = {};
  if (patch.text !== undefined) {
    const parsed = parseChecklistText(patch.text);
    if (!parsed.ok) return { ok: false, status: 400, error: parsed.error };
    if (parsed.text !== item.text) next.text = parsed.text;
  }
  if (patch.status === "done" && item.status === "open") {
    next.status = "done";
    next.statusSource = "bot";
  }
  if (next.text === undefined && next.status === undefined) return { ok: true };
  return { ok: true, ...next };
}

export function sortChecklistItems(items: ChecklistItem[]): ChecklistItem[] {
  const rank: Record<ChecklistStatus, number> = { open: 0, done: 1, dismissed: 2 };
  return [...items].sort(
    (a, b) => rank[a.status] - rank[b.status] || a.createdAt.localeCompare(b.createdAt),
  );
}
