import { Link } from "@tanstack/react-router";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import type { Article } from "@/data/articles";
import { articleIso, articleTags, blogArticles, TAG_LABEL, type Tag } from "@/data/taxonomy";

export function ArticlePage({ article }: { article: Article }) {
  const others = blogArticles()
    .filter((a) => a.href !== article.href)
    .slice(0, 4);
  const tags = articleTags(article);
  const iso = articleIso(article);

  return (
    <main>
      <PageHero
        image={article.image}
        alt={article.imageAlt}
        eyebrow={article.date}
        title={article.h1}
        lede={article.lede}
      />
      <article className="mx-auto max-w-3xl px-4 py-14">
        {tags.length > 0 && (
          <p className="mb-8 text-sm text-muted">
            <Link to="/$year/$month/" params={{ year: iso.slice(0, 4), month: iso.slice(5, 7) }} className="text-pfeifer no-underline hover:underline">
              {article.date}
            </Link>
            {" · "}
            {tags.map((t, i) => (
              <span key={t}>
                {i > 0 && " · "}
                <Link to="/blog/topic/$tag/" params={{ tag: t }} className="text-pfeifer no-underline hover:underline">
                  {TAG_LABEL[t as Tag] ?? t}
                </Link>
              </span>
            ))}
          </p>
        )}
        {article.sections.map((s) => (
          <section key={s.heading} className="mb-10">
            <h2 className="font-display text-2xl text-ink">{s.heading}</h2>
            {s.paragraphs.map((p) => (
              <p key={p.slice(0, 40)} className="mt-3 leading-relaxed text-muted">
                {p}
              </p>
            ))}
          </section>
        ))}
        {article.related.length > 0 && (
          <p className="mt-8 text-sm text-muted">
            Related:{" "}
            {article.related.map((r, i) => (
              <span key={r.href}>
                {i > 0 && " · "}
                <Link to={r.href} className="text-pfeifer no-underline hover:underline">
                  {r.label}
                </Link>
              </span>
            ))}
          </p>
        )}
        <nav className="mt-12 border-t border-line pt-8" aria-label="More articles">
          <p className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-pfeifer">
            From the shop notes
          </p>
          <ul className="mt-4 space-y-3">
            {others.map((a) => (
              <li key={a.href}>
                <Link to={a.href} className="text-ink no-underline hover:text-pfeifer">
                  {a.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </article>
      <CtaBand />
    </main>
  );
}

export function articleHead(article: Article) {
  return {
    meta: [
      { title: article.titleTag },
      { name: "description", content: article.description },
    ],
    links: [{ rel: "canonical", href: `https://pfeiferbuild.com${article.href}` }],
  };
}
