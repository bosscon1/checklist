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

export const CHECKLIST_MEMORY_KEY = "checklist:added";

export type ChecklistMemory = {
  keys: Record<string, { id: string; text: string; status: ChecklistStatus }>;
};

type Env = Record<string, string | undefined>;

export function checklistConfig(env: Env = process.env): { base: string; token: string } {
  const base = env.CHECKLIST_API_URL?.trim().replace(/\/+$/, "") ?? "";
  const token = env.CHECKLIST_BOT_TOKEN?.trim() ?? "";
  if (!base || !token) {
    throw new Error("Set CHECKLIST_API_URL and CHECKLIST_BOT_TOKEN.");
  }
  return { base, token };
}

export function checklistUrl(base: string, path: string): string {
  const root = base.replace(/\/+$/, "");
  if (path === "/" || path === "") return `${root}/`;
  return `${root}${path.startsWith("/") ? path : `/${path}`}`;
}

async function request<T>(path: string, init: RequestInit, env: Env): Promise<T> {
  const { base, token } = checklistConfig(env);
  const response = await fetch(checklistUrl(base, path), {
    ...init,
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
  });
  const body = (await response.json().catch(() => ({}))) as { error?: string };
  if (!response.ok) {
    throw new Error(body.error || `Checklist API returned ${response.status}.`);
  }
  return body as T;
}

export function listChecklist(env?: Env): Promise<{ items: ChecklistItem[] }> {
  return request("/", { method: "GET" }, env ?? process.env);
}

export function findChecklistKey(key: string, env?: Env): Promise<{ item: ChecklistItem }> {
  return request(`/?key=${encodeURIComponent(key)}`, { method: "GET" }, env ?? process.env);
}

export function addChecklistItem(
  input: { key: string; text: string },
  env?: Env,
): Promise<{ item: ChecklistItem; created: boolean }> {
  return request("/", { method: "POST", body: JSON.stringify(input) }, env ?? process.env);
}

export function patchChecklistItem(
  id: string,
  patch: { text?: string; status?: "done" },
  env?: Env,
): Promise<{ item: ChecklistItem }> {
  return request(`/${encodeURIComponent(id)}/`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  }, env ?? process.env);
}

export function memoryFromItems(items: ChecklistItem[]): ChecklistMemory {
  const keys: ChecklistMemory["keys"] = {};
  for (const item of items) {
    if (!item.botKey) continue;
    keys[item.botKey] = { id: item.id, text: item.text, status: item.status };
  }
  return { keys };
}

export function rememberItem(memory: ChecklistMemory, item: ChecklistItem): ChecklistMemory {
  if (!item.botKey) return memory;
  return {
    keys: {
      ...memory.keys,
      [item.botKey]: { id: item.id, text: item.text, status: item.status },
    },
  };
}
