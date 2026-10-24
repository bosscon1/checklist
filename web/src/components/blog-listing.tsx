import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import type { Article } from "@/data/articles";
import {
  articleIso,
  articleTags,
  pageCount,
  TAG_LABEL,
  uniqueMonths,
  usedTags,
  type Tag,
} from "@/data/taxonomy";

export function BlogFilters({
  activeMonth,
  activeTag,
}: {
  activeMonth?: string;
  activeTag?: string;
}) {
  const months = uniqueMonths();
  const tags = usedTags();
  return (
    <div className="mb-10 space-y-6">
      <div>
        <p className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-pfeifer">By month</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          <li>
            <FilterChip href="/blog/" active={!activeMonth && !activeTag}>
              All
            </FilterChip>
          </li>
          {months.map((m) => (
            <li key={m.href}>
              <FilterChip href={m.href} active={activeMonth === `${m.year}-${m.month}`}>
                {m.label} ({m.count})
              </FilterChip>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-pfeifer">By topic</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {tags.map((t) => (
            <li key={t.tag}>
              <FilterChip href={t.href} active={activeTag === t.tag}>
                {t.label} ({t.count})
              </FilterChip>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active?: boolean;
  children: ReactNode;
}) {
  const className = active
    ? "border border-pfeifer bg-pfeifer px-3 py-1 text-sm text-white no-underline"
    : "border border-line px-3 py-1 text-sm text-ink no-underline hover:border-pfeifer hover:text-pfeifer";
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

export function ArticleList({ articles }: { articles: Article[] }) {
  if (articles.length === 0) {
    return <p className="text-muted">No articles in this list yet.</p>;
  }
  return (
    <ul className="divide-y divide-line">
      {articles.map((p) => {
        const iso = articleIso(p);
        const tags = articleTags(p);
        return (
          <li key={p.href} className="py-8">
            <p className="text-xs uppercase tracking-wide text-muted">
              <Link to="/$year/$month/" params={{ year: iso.slice(0, 4), month: iso.slice(5, 7) }} className="text-muted no-underline hover:text-pfeifer">
                {p.date}
              </Link>
            </p>
            <h2 className="mt-2 font-display text-2xl">
              <Link to={p.href} className="text-ink no-underline hover:text-pfeifer">
                {p.title}
              </Link>
            </h2>
            <p className="mt-2 text-muted">{p.excerpt}</p>
            {tags.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-2">
                {tags.map((t) => (
                  <li key={t}>
                    <Link
                      to="/blog/topic/$tag/"
                      params={{ tag: t }}
                      className="text-xs uppercase tracking-wide text-pfeifer no-underline hover:underline"
                    >
                      {TAG_LABEL[t as Tag] ?? t}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function BlogPagination({ page, total }: { page: number; total: number }) {
  const pages = pageCount(total);
  if (pages <= 1) return null;
  return (
    <nav className="mt-10 flex flex-wrap items-center gap-2" aria-label="Blog pages">
      {Array.from({ length: pages }, (_, i) => i + 1).map((n) =>
        n <= 1 ? (
          <Link
            key={n}
            to="/blog/"
            aria-current={n === page ? "page" : undefined}
            className={
              n === page
                ? "border border-pfeifer bg-pfeifer px-3 py-1 text-sm text-white no-underline"
                : "border border-line px-3 py-1 text-sm text-ink no-underline hover:border-pfeifer"
            }
          >
            {n}
          </Link>
        ) : (
          <Link
            key={n}
            to="/blog/page/$page/"
            params={{ page: String(n) }}
            aria-current={n === page ? "page" : undefined}
            className={
              n === page
                ? "border border-pfeifer bg-pfeifer px-3 py-1 text-sm text-white no-underline"
                : "border border-line px-3 py-1 text-sm text-ink no-underline hover:border-pfeifer"
            }
          >
            {n}
          </Link>
        ),
      )}
    </nav>
  );
}

export function BlogShell({
  title,
  lede,
  articles,
  activeMonth,
  activeTag,
  page,
  total,
}: {
  title: string;
  lede: string;
  articles: Article[];
  activeMonth?: string;
  activeTag?: string;
  page?: number;
  total?: number;
}) {
  return (
    <main>
      <PageHero image="/images/addition.jpg" alt="Home addition in Fayette County" title={title} lede={lede} />
      <section className="mx-auto max-w-3xl px-4 py-14">
        <BlogFilters activeMonth={activeMonth} activeTag={activeTag} />
        <ArticleList articles={articles} />
        {page != null && total != null && <BlogPagination page={page} total={total} />}
      </section>
      <CtaBand />
    </main>
  );
}
