import { REASONS } from "@/data/site";

export function SixReasons() {
  return (
    <section className="bg-cream py-16">
      <div className="mx-auto max-w-6xl px-4">
        <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-pfeifer">
          Why homeowners hire us
        </p>
        <h2 className="mt-2 font-display text-3xl text-ink">
          Six reasons to choose Pfeifer Building Company
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((r) => (
            <article key={r.n} className="border border-line bg-paper p-6">
              <p className="font-display text-2xl text-pfeifer">{r.n}</p>
              <h3 className="mt-2 font-display text-xl text-ink">{r.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{r.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
