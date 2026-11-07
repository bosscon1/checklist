import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { legalDocuments, type LegalBlock, type LegalDocument } from "../src/content/legal.ts";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const outRoot = join(repoRoot, "deploy", "siteground");

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderBlock(block: LegalBlock): string {
  if (block.type === "p") return `<p>${escapeHtml(block.text)}</p>`;
  const items = block.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  return `<ul>${items}</ul>`;
}

function renderDocument(doc: LegalDocument): string {
  const sections = doc.sections
    .map(
      (section) => `<section aria-labelledby="${section.id}">
        <h2 id="${section.id}">${escapeHtml(section.heading)}</h2>
        ${section.blocks.map(renderBlock).join("\n")}
      </section>`,
    )
    .join("\n");
  const other = doc.kind === "privacy" ? "terms" : "privacy";
  const otherLabel = doc.kind === "privacy" ? "Terms of Service" : "Privacy Policy";
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#1c1f24" />
    <title>${escapeHtml(doc.title)} · Checklist</title>
    <meta name="description" content="${escapeHtml(doc.description)}" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&family=Outfit:wght@400;600;700&display=swap" />
    <style>
      :root { --ink:#1c1f24; --cream:#f4f0e6; --paper:#fff; --muted:#5c6370; --line:#d8d4cb; --pfeifer:#004aad; }
      * { box-sizing: border-box; }
      body { margin: 0; font-family: "DM Sans", "Segoe UI", sans-serif; background: var(--cream); color: var(--ink); }
      main { max-width: 36rem; margin: 0 auto; padding: max(1rem, env(safe-area-inset-top)) 1rem max(1.5rem, env(safe-area-inset-bottom)); }
      h1, h2 { font-family: "Outfit", "Segoe UI", sans-serif; letter-spacing: -0.03em; }
      h1 { font-size: 2.25rem; margin: 0.5rem 0 0; }
      h2 { font-size: 1.5rem; margin: 0; }
      p, li { font-size: 1rem; line-height: 1.6; overflow-wrap: anywhere; }
      .kicker { margin: 0; font-size: 0.875rem; font-weight: 600; letter-spacing: 0.04em; color: var(--muted); }
      .effective { color: var(--muted); }
      .note { margin-top: 1.5rem; padding: 0.75rem 1rem; border: 1px solid var(--line); border-radius: 0.25rem; background: var(--paper); }
      article { margin-top: 2rem; display: flex; flex-direction: column; gap: 2rem; }
      ul { padding-left: 1.25rem; }
      footer { margin-top: 2.5rem; border-top: 1px solid var(--line); padding-top: 1rem; }
      nav { display: flex; flex-wrap: wrap; gap: 0.25rem 1.25rem; }
      a { color: var(--pfeifer); font-weight: 600; min-height: 2.75rem; display: inline-flex; align-items: center; }
      a.back { color: var(--ink); }
      a:focus-visible { outline: 2px solid var(--pfeifer); outline-offset: 2px; }
    </style>
  </head>
  <body>
    <main>
      <p class="kicker">Checklist</p>
      <h1>${escapeHtml(doc.title)}</h1>
      <p class="effective">Effective ${escapeHtml(doc.effective)}</p>
      <aside class="note" role="note">${escapeHtml(doc.draftNote)}</aside>
      <article>
        ${sections}
      </article>
      <footer>
        <nav aria-label="Legal">
          <a href="/privacy/"${doc.kind === "privacy" ? ' aria-current="page"' : ""}>Privacy Policy</a>
          <a href="/terms/"${doc.kind === "terms" ? ' aria-current="page"' : ""}>Terms of Service</a>
        </nav>
        <p><a class="back" href="/checklist/">Back to Checklist</a></p>
        <p class="effective">${escapeHtml(otherLabel)} is also at <a href="/${other}/">/${other}/</a>.</p>
      </footer>
    </main>
  </body>
</html>
`;
}

for (const doc of [legalDocuments.privacy, legalDocuments.terms]) {
  const dir = join(outRoot, doc.kind);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), renderDocument(doc));
  console.log(`[legal] wrote ${join("deploy", "siteground", doc.kind, "index.html")}`);
}
