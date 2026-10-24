import assert from "node:assert/strict";
import test from "node:test";
import {
  applyBotPatch,
  applyUserPatch,
  parseBotKey,
  parseChecklistText,
} from "./checklist.ts";

const open = { status: "open" as const, text: "Call the inspector" };

test("the owner can check, uncheck, dismiss, and restore", () => {
  const checked = applyUserPatch(open, { status: "done" });
  assert.equal(checked.ok, true);
  if (!checked.ok) return;
  assert.equal(checked.status, "done");
  assert.equal(checked.statusSource, "user");

  const unchecked = applyUserPatch({ ...open, status: "done" }, { status: "open" });
  assert.equal(unchecked.ok && unchecked.status, "open");

  const dismissed = applyUserPatch(open, { status: "dismissed" });
  assert.equal(dismissed.ok && dismissed.status, "dismissed");

  const restored = applyUserPatch({ ...open, status: "dismissed" }, { status: "open" });
  assert.equal(restored.ok && restored.status, "open");
  assert.equal(restored.ok && restored.statusSource, "user");
});

test("the bot cannot reopen a dismissed item or uncheck a box", () => {
  const dismissed = applyBotPatch({ ...open, status: "dismissed" }, { status: "done" });
  assert.equal(dismissed.ok, false);
  if (dismissed.ok) return;
  assert.equal(dismissed.status, 409);

  const reword = applyBotPatch({ ...open, status: "dismissed" }, { text: "Still calling" });
  assert.equal(reword.ok, false);

  const uncheck = applyBotPatch({ ...open, status: "done" }, { text: "Changed" });
  assert.equal(uncheck.ok, false);
  if (uncheck.ok) return;
  assert.match(uncheck.error, /open items/);
});

test("the bot can add wording and mark an open item done", () => {
  const edited = applyBotPatch(open, { text: "  Call   the inspector tomorrow  " });
  assert.equal(edited.ok, true);
  if (!edited.ok) return;
  assert.equal(edited.text, "Call the inspector tomorrow");

  const done = applyBotPatch(open, { status: "done" });
  assert.equal(done.ok && done.status, "done");
  assert.equal(done.ok && done.statusSource, "bot");
});

test("marking an already checked item done is a no-op", () => {
  const again = applyBotPatch({ ...open, status: "done" }, { status: "done" });
  assert.deepEqual(again, { ok: true });
});

test("text and bot keys are bounded", () => {
  assert.equal(parseChecklistText("   ").ok, false);
  assert.equal(parseChecklistText("x".repeat(281)).ok, false);
  assert.equal(parseChecklistText("Paint the porch").ok, true);
  assert.equal(parseBotKey("call-inspector").ok, true);
  assert.equal(parseBotKey("has space").ok, false);
  assert.equal(parseBotKey("").ok, false);
});
