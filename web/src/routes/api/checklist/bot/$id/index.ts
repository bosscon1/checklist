import { createFileRoute } from "@tanstack/react-router";
import { parseChecklistText } from "@/lib/checklist";
import { authorizeBot, json, patchBotItem, readJson } from "@/lib/checklist.server";

function guard(work: () => Promise<Response>): Promise<Response> {
  return work().catch((err: unknown) => {
    console.error("[checklist]", err);
    return json({ error: "Couldn't update the checklist." }, 500);
  });
}

export const Route = createFileRoute("/api/checklist/bot/$id/")({
  server: {
    handlers: {
      PATCH: ({ request, params }) =>
        guard(async () => {
          const denied = authorizeBot(request);
          if (denied) return denied;
          const body = await readJson(request);
          if (body instanceof Response) return body;
          const patch: { text?: string; status?: "done" } = {};
          if ("text" in body) {
            const parsed = parseChecklistText(body.text);
            if (!parsed.ok) return json({ error: parsed.error }, 400);
            patch.text = parsed.text;
          }
          if ("status" in body) {
            if (body.status !== "done") {
              return json({ error: "The bot can only mark an open item done." }, 400);
            }
            patch.status = "done";
          }
          if (patch.text === undefined && patch.status === undefined) {
            return json({ error: "Nothing to change." }, 400);
          }
          const result = await patchBotItem(params.id, patch);
          if (!result.ok) return json({ error: result.error }, result.status);
          return json({ item: result.item });
        }),
    },
  },
});
