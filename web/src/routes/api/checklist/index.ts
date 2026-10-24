import { createFileRoute } from "@tanstack/react-router";
import { parseChecklistText } from "@/lib/checklist";
import { addUserItem, authorizeOwner, json, listItems, readJson } from "@/lib/checklist.server";

function guard(work: () => Promise<Response>): Promise<Response> {
  return work().catch((err: unknown) => {
    console.error("[checklist]", err);
    return json({ error: "Couldn't update the checklist." }, 500);
  });
}

export const Route = createFileRoute("/api/checklist/")({
  server: {
    handlers: {
      GET: ({ request }) =>
        guard(async () => {
          const denied = authorizeOwner(request);
          if (denied) return denied;
          return json({ items: await listItems() });
        }),
      POST: ({ request }) =>
        guard(async () => {
          const denied = authorizeOwner(request);
          if (denied) return denied;
          const body = await readJson(request);
          if (body instanceof Response) return body;
          const parsed = parseChecklistText(body.text);
          if (!parsed.ok) return json({ error: parsed.error }, 400);
          return json({ item: await addUserItem(parsed.text) }, 201);
        }),
    },
  },
});
