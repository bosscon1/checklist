import { Link } from "@tanstack/react-router";

const linkClass =
  "inline-flex min-h-11 items-center text-base font-semibold text-pfeifer underline decoration-pfeifer/40 underline-offset-4 hover:decoration-pfeifer";

export function LegalNav({ current }: { current?: "privacy" | "terms" }) {
  return (
    <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-1">
      <Link
        to="/privacy/"
        className={linkClass}
        aria-current={current === "privacy" ? "page" : undefined}
      >
        Privacy Policy
      </Link>
      <Link
        to="/terms/"
        className={linkClass}
        aria-current={current === "terms" ? "page" : undefined}
      >
        Terms of Service
      </Link>
    </nav>
  );
}

export function LegalFooter({ edge = false }: { edge?: boolean }) {
  return (
    <footer className={`px-4 ${edge ? "pb-[max(0.75rem,env(safe-area-inset-bottom))]" : "pb-1"}`}>
      <LegalNav />
    </footer>
  );
}
