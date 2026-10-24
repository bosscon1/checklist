import { createHash, timingSafeEqual } from "node:crypto";
import { getSql } from "@/lib/db";
import {
  applyBotPatch,
  applyUserPatch,
  parseBotKey,
  parseChecklistText,
  type ChecklistActor,
  type ChecklistItem,
  type ChecklistPatch,
  type ChecklistStatus,
} from "@/lib/checklist";

type Row = {
  id: string;
  body: string;
  status: ChecklistStatus;
  source: ChecklistActor;
  status_source: ChecklistActor;
  bot_key: string | null;
  created_at: string | Date;
  updated_at: string | Date;
};

function iso(value: string | Date): string {
  if (value instanceof Date) return value.toISOString();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? String(value) : parsed.toISOString();
}

function toItem(row: Row): ChecklistItem {
  return {
    id: row.id,
    text: row.body,
    status: row.status,
    source: row.source,
    statusSource: row.status_source,
    botKey: row.bot_key,
    createdAt: iso(row.created_at),
    updatedAt: iso(row.updated_at),
  };
}

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function bearer(request: Request): string {
  const header = request.headers.get("authorization") ?? "";
  const match = /^Bearer\s+(\S+)\s*$/i.exec(header);
  return match?.[1] ?? "";
}

function tokenMatches(provided: string, expected: string): boolean {
  const a = createHash("sha256").update(provided).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

function authorize(request: Request, secret: string): Response | null {
  if (!secret) return json({ error: "Checklist auth is not configured." }, 503);
  if (!tokenMatches(bearer(request), secret)) return json({ error: "Unauthorized." }, 401);
  return null;
}

export function authorizeOwner(request: Request): Response | null {
  return authorize(request, process.env.CHECKLIST_OWNER_SECRET?.trim() ?? "");
}

export function authorizeBot(request: Request): Response | null {
  return authorize(request, process.env.CHECKLIST_BOT_TOKEN?.trim() ?? "");
}

export async function listItems(): Promise<ChecklistItem[]> {
  const sql = await getSql();
  const rows = await sql<Row>`
    select id, body, status, source, status_source, bot_key, created_at, updated_at
    from checklist_items
    order by case status when 'open' then 0 when 'done' then 1 else 2 end, created_at asc
  `;
  return rows.map(toItem);
}

export async function getItem(id: string): Promise<ChecklistItem | null> {
  const sql = await getSql();
  const rows = await sql<Row>`
    select id, body, status, source, status_source, bot_key, created_at, updated_at
    from checklist_items
    where id = ${id}
    limit 1
  `;
  return rows[0] ? toItem(rows[0]) : null;
}

export async function getByBotKey(key: string): Promise<ChecklistItem | null> {
  const sql = await getSql();
  const rows = await sql<Row>`
    select id, body, status, source, status_source, bot_key, created_at, updated_at
    from checklist_items
    where bot_key = ${key}
    limit 1
  `;
  return rows[0] ? toItem(rows[0]) : null;
}

function isUniqueViolation(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const code = "code" in err ? String((err as { code: unknown }).code) : "";
  if (code === "23505") return true;
  const message = "message" in err ? String((err as { message: unknown }).message) : "";
  return /unique|duplicate key/i.test(message);
}

async function insertItem(
  text: string,
  source: ChecklistActor,
  botKey: string | null,
): Promise<ChecklistItem> {
  const sql = await getSql();
  const id = crypto.randomUUID();
  const rows = await sql<Row>`
    insert into checklist_items (id, body, status, source, status_source, bot_key)
    values (${id}, ${text}, 'open', ${source}, ${source}, ${botKey})
    returning id, body, status, source, status_source, bot_key, created_at, updated_at
  `;
  return toItem(rows[0]);
}

export async function addUserItem(text: string): Promise<ChecklistItem> {
  return insertItem(text, "user", null);
}

export async function addBotItem(
  text: string,
  key: string,
): Promise<{ item: ChecklistItem; created: boolean }> {
  const existing = await getByBotKey(key);
  if (existing) return { item: existing, created: false };
  try {
    const item = await insertItem(text, "bot", key);
    return { item, created: true };
  } catch (err) {
    if (!isUniqueViolation(err)) throw err;
    const again = await getByBotKey(key);
    if (again) return { item: again, created: false };
    throw err;
  }
}

async function writeItem(
  item: ChecklistItem,
  change: { text?: string; status?: ChecklistStatus; statusSource?: ChecklistActor },
  onlyIfOpen: boolean,
): Promise<ChecklistItem | null> {
  const sql = await getSql();
  const text = change.text ?? item.text;
  const status = change.status ?? item.status;
  const statusSource = change.statusSource ?? item.statusSource;
  const rows = onlyIfOpen
    ? await sql<Row>`
        update checklist_items
        set body = ${text},
            status = ${status},
            status_source = ${statusSource},
            updated_at = now()
        where id = ${item.id} and status = 'open'
        returning id, body, status, source, status_source, bot_key, created_at, updated_at
      `
    : await sql<Row>`
        update checklist_items
        set body = ${text},
            status = ${status},
            status_source = ${statusSource},
            updated_at = now()
        where id = ${item.id}
        returning id, body, status, source, status_source, bot_key, created_at, updated_at
      `;
  return rows[0] ? toItem(rows[0]) : null;
}

export async function patchUserItem(
  id: string,
  patch: ChecklistPatch,
): Promise<{ ok: true; item: ChecklistItem } | { ok: false; status: number; error: string }> {
  const item = await getItem(id);
  if (!item) return { ok: false, status: 404, error: "That item is gone." };
  const change = applyUserPatch(item, patch);
  if (!change.ok) return change;
  if (change.text === undefined && change.status === undefined) return { ok: true, item };
  const saved = await writeItem(item, change, false);
  if (!saved) return { ok: false, status: 404, error: "That item is gone." };
  return { ok: true, item: saved };
}

export async function patchBotItem(
  id: string,
  patch: { text?: string; status?: "done" },
): Promise<{ ok: true; item: ChecklistItem } | { ok: false; status: number; error: string }> {
  const item = await getItem(id);
  if (!item) return { ok: false, status: 404, error: "That item is gone." };
  const change = applyBotPatch(item, patch);
  if (!change.ok) return change;
  if (change.text === undefined && change.status === undefined) return { ok: true, item };
  const saved = await writeItem(item, change, true);
  if (saved) return { ok: true, item: saved };
  const latest = await getItem(id);
  if (!latest) return { ok: false, status: 404, error: "That item is gone." };
  const again = applyBotPatch(latest, patch);
  if (!again.ok) return again;
  return { ok: true, item: latest };
}

export async function readJson(request: Request): Promise<Record<string, unknown> | Response> {
  try {
    const body = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return json({ error: "Expected a JSON object." }, 400);
    }
    return body as Record<string, unknown>;
  } catch {
    return json({ error: "Expected a JSON object." }, 400);
  }
}

export function userText(body: Record<string, unknown>): { ok: true; text: string } | Response {
  const parsed = parseChecklistText(body.text);
  if (!parsed.ok) return json({ error: parsed.error }, 400);
  return parsed;
}

export function botKeyFrom(body: Record<string, unknown>): { ok: true; key: string } | Response {
  const parsed = parseBotKey(body.key);
  if (!parsed.ok) return json({ error: parsed.error }, 400);
  return parsed;
}
