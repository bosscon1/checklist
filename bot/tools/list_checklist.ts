import { defineTool } from "@cursor/bdk/tools";
import { z } from "zod";
import { CHECKLIST_MEMORY_KEY, listChecklist, memoryFromItems } from "../lib/checklist-api";

export default defineTool({
  description:
    "Read the owner's phone checklist, including done and dismissed items. Call this before adding work so you do not repeat something they already checked or dismissed. The phone database is the source of truth. This refreshes host memory at checklist:added from rows that already have a bot key.",
  effect: "read",
  inputSchema: z.object({}),
  async execute(_input, ctx) {
    const { items } = await listChecklist();
    await ctx.host.kv.put(CHECKLIST_MEMORY_KEY, memoryFromItems(items));
    return { items };
  },
});
