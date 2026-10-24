import { defineTool } from "@cursor/bdk/tools";
import { z } from "zod";
import {
  CHECKLIST_MEMORY_KEY,
  addChecklistItem,
  findChecklistKey,
  patchChecklistItem,
  rememberItem,
  type ChecklistMemory,
} from "../lib/checklist-api";

const inputSchema = z.object({
  action: z.enum(["add", "edit", "complete"]),
  key: z.string().trim().min(1).max(80),
  text: z.string().trim().min(1).max(280).optional(),
});

async function readMemory(ctx: { host: { kv: { get: (key: string) => Promise<unknown> } } }): Promise<ChecklistMemory> {
  const stored = await ctx.host.kv.get(CHECKLIST_MEMORY_KEY);
  if (!stored || typeof stored !== "object" || !("keys" in stored)) return { keys: {} };
  const keys = (stored as { keys?: unknown }).keys;
  if (!keys || typeof keys !== "object") return { keys: {} };
  return { keys: keys as ChecklistMemory["keys"] };
}

export default defineTool({
  description:
    "Update the owner's phone checklist through its database. Use a stable key per task so a repeat call does not create a second row. add creates an open item. edit rewords an open item. complete marks an open item done. Dismissed items stay dismissed. Do not try to uncheck a box the owner checked. Memory of keys you already added lives in host kv, but the phone database wins if they disagree.",
  effect: "write",
  inputSchema,
  dryRunResult: ({ action, key }) => ({ dryRun: true, action, key }),
  async execute(input, ctx) {
    const memory = await readMemory(ctx);

    if (input.action === "add") {
      if (!input.text) throw new Error("Add needs text.");
      const result = await addChecklistItem({ key: input.key, text: input.text });
      await ctx.host.kv.put(CHECKLIST_MEMORY_KEY, rememberItem(memory, result.item));
      return {
        created: result.created,
        item: result.item,
        note:
          result.item.status === "dismissed"
            ? "This key is already on the list and the owner dismissed it. Leave it dismissed."
            : result.created
              ? "Added."
              : "This key was already on the list.",
      };
    }

    const item = (await findChecklistKey(input.key)).item;
    if (input.action === "edit") {
      if (!input.text) throw new Error("Edit needs text.");
      const updated = await patchChecklistItem(item.id, { text: input.text });
      await ctx.host.kv.put(CHECKLIST_MEMORY_KEY, rememberItem(memory, updated.item));
      return { item: updated.item };
    }

    const updated = await patchChecklistItem(item.id, { status: "done" });
    await ctx.host.kv.put(CHECKLIST_MEMORY_KEY, rememberItem(memory, updated.item));
    return { item: updated.item };
  },
});
