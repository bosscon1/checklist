import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { CITIES, SERVICES, SITE } from "@/data/site";
import { Logo } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="bg-charcoal text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo compact />
          <p className="mt-4 text-sm leading-relaxed text-cream/75">
            Remodeling and general contracting in Fayette and Coweta Counties since 1997.
          </p>
        </div>
        <div>
          <h2 className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-paper">
            Services
          </h2>
          <ul className="mt-3 space-y-2">
            {SERVICES.map((s) => (
              <li key={s.href}>
                <Link to={s.href} className="text-sm text-cream/80 no-underline hover:text-paper">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-paper">
            Service area
          </h2>
          <ul className="mt-3 space-y-2">
            {CITIES.map((c) => (
              <li key={c.href}>
                <Link to={c.href} className="text-sm text-cream/80 no-underline hover:text-paper">
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/service-area/" className="text-sm text-cream/80 no-underline hover:text-paper">
                Service area
              </Link>
            </li>
            <li>
              <Link to="/about/" className="text-sm text-cream/80 no-underline hover:text-paper">
                About the company
              </Link>
            </li>
            <li>
              <Link to="/employment/" className="text-sm text-cream/80 no-underline hover:text-paper">
                Employment
              </Link>
            </li>
            <li>
              <Link to="/blog/" className="text-sm text-cream/80 no-underline hover:text-paper">
                Blog
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-paper">
            Office
          </h2>
          <ul className="mt-3 space-y-3 text-sm text-cream/80">
            <li>
              <a href={SITE.mapsHref} className="inline-flex gap-2 no-underline hover:text-paper" target="_blank" rel="noreferrer">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                {SITE.addressLine}
                <br />
                {SITE.cityLine}
              </a>
            </li>
            <li>
              <a href={SITE.phoneHref} className="inline-flex items-center gap-2 font-semibold text-paper no-underline">
                <Phone className="size-4" />
                {SITE.phone}
              </a>
            </li>
            <li>
              <a href={SITE.emailHref} className="inline-flex items-center gap-2 no-underline hover:text-paper">
                <Mail className="size-4" />
                {SITE.email}
              </a>
            </li>
          </ul>
          <p className="mt-4 text-xs text-cream/60">{SITE.hours}</p>
        </div>
      </div>
      <div className="border-t border-paper/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-cream/55 sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.legal}. All rights reserved.{" "}
            <a href="/internal/fonts/" className="text-cream/40 no-underline hover:text-cream/70">
              Type reference
            </a>
          </p>
          <p>We use only the cookies your browser needs to load the page.</p>
        </div>
      </div>
    </footer>
  );
}
