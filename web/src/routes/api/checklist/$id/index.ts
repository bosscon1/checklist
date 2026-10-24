import { createFileRoute } from "@tanstack/react-router";
import { isChecklistStatus, type ChecklistPatch } from "@/lib/checklist";
import { authorizeOwner, json, patchUserItem, readJson } from "@/lib/checklist.server";

function guard(work: () => Promise<Response>): Promise<Response> {
  return work().catch((err: unknown) => {
    console.error("[checklist]", err);
    return json({ error: "Couldn't update the checklist." }, 500);
  });
}

export const Route = createFileRoute("/api/checklist/$id/")({
  server: {
    handlers: {
      PATCH: ({ request, params }) =>
        guard(async () => {
          const denied = authorizeOwner(request);
          if (denied) return denied;
          const body = await readJson(request);
          if (body instanceof Response) return body;
          const patch: ChecklistPatch = {};
          if ("text" in body) patch.text = typeof body.text === "string" ? body.text : "";
          if ("status" in body) {
            if (!isChecklistStatus(body.status)) {
              return json({ error: "Status must be open, done, or dismissed." }, 400);
            }
            patch.status = body.status;
          }
          if (patch.text === undefined && patch.status === undefined) {
            return json({ error: "Nothing to change." }, 400);
          }
          const result = await patchUserItem(params.id, patch);
          if (!result.ok) return json({ error: result.error }, result.status);
          return json({ item: result.item });
        }),
    },
  },
});
