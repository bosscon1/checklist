import { Link } from "@tanstack/react-router";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { SERVICES, SITE } from "@/data/site";

export function CityPage({
  city,
  county,
  title,
  lede,
  why,
}: {
  city: string;
  county: string;
  title: string;
  lede: string;
  why: string;
}) {
  return (
    <main>
      <PageHero image="/images/full-home.jpg" alt={`${city}, Georgia homes`} eyebrow={county} title={title} lede={lede} />
      <article className="mx-auto max-w-3xl px-4 py-14">
        <h2 className="font-display text-2xl text-ink">Why choose us in {city}?</h2>
        <p className="mt-4 leading-relaxed text-muted">{why}</p>
        <ul className="mt-8 space-y-2">
          {SERVICES.map((s) => (
            <li key={s.href}>
              <Link to={s.href} className="text-pfeifer no-underline hover:underline">
                {s.title}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-muted">
          {SITE.addressLine}, {SITE.cityLine} ·{" "}
          <a href={SITE.phoneHref}>{SITE.phone}</a>
        </p>
      </article>
      <CtaBand title={`Remodeling in ${city}`} />
    </main>
  );
}
