import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { LEGAL_DRAFT_NOTE, LEGAL_EFFECTIVE, legalDocuments, legalPlainText } from "./legal.ts";

const repoRoot = join(import.meta.dirname, "..", "..", "..");

test("legal drafts stay dated, qualified, and free of an invented operator", () => {
  const privacy = legalPlainText(legalDocuments.privacy);
  const terms = legalPlainText(legalDocuments.terms);
  const combined = `${privacy}\n${terms}`;

  assert.equal(legalDocuments.privacy.effective, LEGAL_EFFECTIVE);
  assert.equal(legalDocuments.terms.effective, LEGAL_EFFECTIVE);
  assert.match(LEGAL_EFFECTIVE, /November 7, 2026/);
  assert.match(privacy, /Drafts for legal review|drafts for legal review/i);
  assert.match(LEGAL_DRAFT_NOTE, /drafts for legal review/i);
  assert.match(privacy, /checklist-owner-key/);
  assert.match(privacy, /checklist:added/);
  assert.match(privacy, /Nothing in this code deletes items on a timer/);
  assert.match(privacy, /no feature for selling item text/);
  assert.match(privacy, /fonts\.googleapis\.com/);
  assert.match(privacy, /Pfeifer Building Company/);
  assert.match(privacy, /does not treat that company/);
  assert.match(terms, /do not choose a country/);
  assert.doesNotMatch(combined, /we do not sell/i);
  assert.doesNotMatch(combined, /arbitration program applies/i);
  assert.doesNotMatch(combined, /GDPR|CCPA|SOC 2|ISO 27001/);
  assert.doesNotMatch(combined, /office@pfeiferbuild\.com/);
});

test("the SiteGround pages include the same draft", () => {
  for (const kind of ["privacy", "terms"] as const) {
    const html = readFileSync(join(repoRoot, "deploy", "siteground", kind, "index.html"), "utf8");
    const doc = legalDocuments[kind];
    assert.match(html, new RegExp(doc.title));
    assert.match(html, /November 7, 2026/);
    assert.match(html, /drafts for legal review/i);
    assert.match(html, /href="\/privacy\/"/);
    assert.match(html, /href="\/terms\/"/);
    assert.match(html, /href="\/checklist\/"/);
    for (const section of doc.sections) {
      assert.ok(html.includes(section.heading), `${kind} is missing ${section.heading}`);
      for (const block of section.blocks) {
        const samples = block.type === "p" ? [block.text] : block.items;
        for (const sample of samples) {
          assert.ok(
            html.includes(sample.slice(0, 80)),
            `${kind} is missing copy: ${sample.slice(0, 80)}`,
          );
        }
      }
    }
  }
});
