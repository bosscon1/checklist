import { Link } from "@tanstack/react-router";
import { LegalNav } from "@/components/legal-nav";
import type { LegalDocument } from "@/content/legal";

export function LegalDocumentPage({ doc }: { doc: LegalDocument }) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col bg-cream px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] text-ink">
      <p className="text-sm font-semibold tracking-wide text-muted">Checklist</p>
      <h1 className="mt-2 font-display text-4xl">{doc.title}</h1>
      <p className="mt-2 text-base text-muted">Effective {doc.effective}</p>
      <aside
        role="note"
        className="mt-6 rounded border border-line bg-paper px-4 py-3 text-base leading-relaxed"
      >
        {doc.draftNote}
      </aside>
      <article className="mt-8 flex flex-col gap-8">
        {doc.sections.map((section) => (
          <section key={section.id} aria-labelledby={section.id} className="scroll-mt-6">
            <h2 id={section.id} className="font-display text-2xl">
              {section.heading}
            </h2>
            <div className="mt-3 flex flex-col gap-3 text-base leading-relaxed">
              {section.blocks.map((block, index) =>
                block.type === "p" ? (
                  <p key={`${section.id}-${index}`} className="[overflow-wrap:anywhere]">
                    {block.text}
                  </p>
                ) : (
                  <ul key={`${section.id}-${index}`} className="list-disc space-y-2 pl-5">
                    {block.items.map((item) => (
                      <li key={item} className="[overflow-wrap:anywhere]">
                        {item}
                      </li>
                    ))}
                  </ul>
                ),
              )}
            </div>
          </section>
        ))}
      </article>
      <footer className="mt-10 border-t border-line pt-4">
        <LegalNav current={doc.kind} />
        <p className="mt-1">
          <Link
            to="/checklist/"
            className="inline-flex min-h-11 items-center text-base font-semibold text-ink underline decoration-line underline-offset-4"
          >
            Back to Checklist
          </Link>
        </p>
      </footer>
    </main>
  );
}
