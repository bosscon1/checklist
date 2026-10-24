import { useEffect, useId, useRef, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { ChevronDown, Mail, MapPin, Menu, Phone, X } from "lucide-react";
import { CITIES, SERVICES, SITE } from "@/data/site";
import { Logo } from "@/components/logo";

const companyLinks = [
  { href: "/about/", label: "About" },
  { href: "/get-started/", label: "Get started" },
  { href: "/login/", label: "Staff admin sign in" },
];
const portfolioLinks = [
  { href: "/portfolio/", label: "Project gallery" },
  { href: "/before-and-after/", label: "Before & after" },
  { href: "/decks-by-pfeifer/", label: "Decks" },
  { href: "/covered-porches-by-pfeifer/", label: "Porches" },
  { href: "/kitchens/", label: "Kitchens" },
  { href: "/detached-garages/", label: "Garages" },
  { href: "/pool-houses-by-pfeifer/", label: "Pool houses" },
];

function Drop({
  label,
  items,
  open,
  onOpen,
  onClose,
}: {
  label: string;
  items: { href: string; label: string }[];
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const menuId = useId();
  const hovering = useRef(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        hovering.current = true;
        onOpen();
      }}
      onMouseLeave={() => {
        hovering.current = false;
        onClose();
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={menuId}
        className="inline-flex min-h-11 items-center gap-1 px-2 font-sans text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-paper/90"
        onClick={() => {
          // Hover already opened it; a follow-up click must not toggle it shut.
          if (hovering.current && open) return;
          if (open) onClose();
          else onOpen();
        }}
      >
        {label}
        <ChevronDown className={`size-3.5 opacity-70 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <div
        id={menuId}
        role="menu"
        className={`absolute left-0 top-full z-40 min-w-52 border border-line bg-paper py-2 shadow-lg ${
          open ? "visible opacity-100" : "pointer-events-none invisible opacity-0"
        }`}
      >
        {items.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            role="menuitem"
            className="block px-4 py-2 font-sans text-sm text-ink no-underline hover:bg-cream hover:text-pfeifer"
            onClick={onClose}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function SiteHeader() {
  const pathname = useLocation({ select: (l) => l.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDrop, setOpenDrop] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const serviceLinks = SERVICES.map((s) => ({ href: s.href, label: s.title }));
  const solid = scrolled || mobileOpen;

  useEffect(() => {
    setMobileOpen(false);
    setOpenDrop(null);
  }, [pathname]);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 16);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setOpenDrop(null);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function closeMenus() {
    setMobileOpen(false);
    setOpenDrop(null);
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 text-paper motion-safe:transition-colors motion-safe:duration-200 ${
        mobileOpen
          ? "bg-pfeifer/95 shadow-md backdrop-blur-sm"
          : scrolled
            ? "bg-pfeifer/75 shadow-md backdrop-blur-sm"
            : "bg-transparent drop-shadow-md"
      }`}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest("a")) closeMenus();
      }}
    >
      <div
        className={`hidden md:grid motion-safe:transition-[grid-template-rows,opacity] motion-safe:duration-200 motion-safe:ease-out ${
          scrolled ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100"
        }`}
        aria-hidden={scrolled}
      >
        <div className={`overflow-hidden ${scrolled ? "pointer-events-none" : ""}`}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-1 px-4 py-1.5 text-xs sm:justify-end">
          <a
            href={SITE.mapsHref}
            className="inline-flex min-h-8 items-center gap-1.5 text-paper/90 no-underline hover:text-paper"
            target="_blank"
            rel="noreferrer"
          >
            <MapPin className="size-3.5" />
            {SITE.addressLine} {SITE.cityLine}
          </a>
          <a
            href={SITE.phoneHref}
            className="inline-flex min-h-8 items-center gap-1.5 font-semibold text-paper no-underline"
          >
            <Phone className="size-3.5" />
            {SITE.phone}
          </a>
          <a
            href={SITE.emailHref}
            className="inline-flex min-h-8 items-center gap-1.5 text-paper/90 no-underline hover:text-paper"
          >
            <Mail className="size-3.5" />
            {SITE.email}
          </a>
        </div>
        </div>
      </div>
      <div className={solid ? "border-b border-white/15" : ""}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5">
          <Logo scrolled={scrolled} />
          <nav className="hidden items-center lg:flex" aria-label="Primary">
            <Link
              to="/"
              className="px-2 font-sans text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-paper/90 no-underline hover:text-paper"
            >
              Home
            </Link>
            <Drop
              label="Company"
              items={companyLinks}
              open={openDrop === "company"}
              onOpen={() => setOpenDrop("company")}
              onClose={() => setOpenDrop((v) => (v === "company" ? null : v))}
            />
            <Drop
              label="Services"
              items={serviceLinks}
              open={openDrop === "services"}
              onOpen={() => setOpenDrop("services")}
              onClose={() => setOpenDrop((v) => (v === "services" ? null : v))}
            />
            <Drop
              label="Portfolio"
              items={portfolioLinks}
              open={openDrop === "portfolio"}
              onOpen={() => setOpenDrop("portfolio")}
              onClose={() => setOpenDrop((v) => (v === "portfolio" ? null : v))}
            />
            <Link
              to="/blog/"
              className="px-2 font-sans text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-paper/90 no-underline hover:text-paper"
            >
              Blog
            </Link>
            <Link
              to="/contact/"
              className="px-2 font-sans text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-paper/90 no-underline hover:text-paper"
            >
              Get in touch
            </Link>
            <Link
              to="/get-started/"
              className="ml-2 inline-flex min-h-11 items-center border border-paper px-4 font-sans text-[0.75rem] font-bold uppercase tracking-[0.14em] text-paper no-underline hover:bg-paper hover:text-pfeifer"
            >
              Get started
            </Link>
          </nav>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center text-paper lg:hidden"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
        {mobileOpen && (
          <div className="border-t border-white/15 bg-pfeifer-dark px-4 py-4 lg:hidden">
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {[
                { href: "/", label: "Home" },
                ...companyLinks,
                ...serviceLinks,
                { href: "/portfolio/", label: "Portfolio" },
                { href: "/blog/", label: "Blog" },
                { href: "/contact/", label: "Get in touch" },
                ...CITIES.map((c) => ({ href: c.href, label: c.name })),
              ].map((item) => (
                <Link
                  key={item.href + item.label}
                  to={item.href}
                  className="min-h-11 px-2 py-2 font-sans text-sm text-paper no-underline"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/get-started/"
                className="mt-2 inline-flex min-h-11 items-center justify-center bg-paper font-sans text-sm font-bold uppercase tracking-wide text-pfeifer no-underline"
              >
                Get started
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
