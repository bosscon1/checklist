import { createFileRoute } from "@tanstack/react-router";
import { parseBotKey, parseChecklistText } from "@/lib/checklist";
import { addBotItem, authorizeBot, getByBotKey, json, listItems, readJson } from "@/lib/checklist.server";

function guard(work: () => Promise<Response>): Promise<Response> {
  return work().catch((err: unknown) => {
    console.error("[checklist]", err);
    return json({ error: "Couldn't update the checklist." }, 500);
  });
}

export const Route = createFileRoute("/api/checklist/bot/")({
  server: {
    handlers: {
      GET: ({ request }) =>
        guard(async () => {
          const denied = authorizeBot(request);
          if (denied) return denied;
          const key = new URL(request.url).searchParams.get("key");
          if (key === null) return json({ items: await listItems() });
          const parsed = parseBotKey(key);
          if (!parsed.ok) return json({ error: parsed.error }, 400);
          const item = await getByBotKey(parsed.key);
          if (!item) return json({ error: "No item uses that key." }, 404);
          return json({ item });
        }),
      POST: ({ request }) =>
        guard(async () => {
          const denied = authorizeBot(request);
          if (denied) return denied;
          const body = await readJson(request);
          if (body instanceof Response) return body;
          const text = parseChecklistText(body.text);
          if (!text.ok) return json({ error: text.error }, 400);
          const key = parseBotKey(body.key);
          if (!key.ok) return json({ error: key.error }, 400);
          const result = await addBotItem(text.text, key.key);
          return json(result, result.created ? 201 : 200);
        }),
    },
  },
});
