import assert from "node:assert/strict";
import test from "node:test";
import { checklistConfig, checklistUrl, memoryFromItems } from "./checklist-api.ts";

test("joins the bot API without dropping the trailing slash", () => {
  assert.equal(
    checklistUrl("https://example.com/api/checklist/bot/", "/"),
    "https://example.com/api/checklist/bot/",
  );
  assert.equal(
    checklistUrl("https://example.com/api/checklist/bot", "/item-1/"),
    "https://example.com/api/checklist/bot/item-1/",
  );
});

test("requires both the API url and the bot token", () => {
  assert.throws(() => checklistConfig({ CHECKLIST_API_URL: "https://example.com/api/checklist/bot" }), /CHECKLIST_BOT_TOKEN/);
  const config = checklistConfig({
    CHECKLIST_API_URL: "https://example.com/api/checklist/bot/",
    CHECKLIST_BOT_TOKEN: "secret",
  });
  assert.equal(config.base, "https://example.com/api/checklist/bot");
  assert.equal(config.token, "secret");
});

test("memory keeps only rows the bot keyed", () => {
  const memory = memoryFromItems([
    {
      id: "1",
      text: "Mine",
      status: "open",
      source: "user",
      statusSource: "user",
      botKey: null,
      createdAt: "",
      updatedAt: "",
    },
    {
      id: "2",
      text: "Call",
      status: "dismissed",
      source: "bot",
      statusSource: "user",
      botKey: "call",
      createdAt: "",
      updatedAt: "",
    },
  ]);
  assert.deepEqual(memory.keys, { call: { id: "2", text: "Call", status: "dismissed" } });
});
