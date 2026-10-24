import { Link } from "@tanstack/react-router";

export function NotFoundPage() {
  return (
    <main className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-muted">
        Page not found
      </p>
      <h1 className="mt-3 font-display text-4xl text-ink">That URL is not a live page.</h1>
      <p className="mt-4 text-muted">
        If you followed an old WordPress link, tell the office. We can point it at the right
        service or city page so Google keeps the ranking.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="inline-flex min-h-12 items-center bg-pfeifer px-5 font-sans text-sm font-bold uppercase tracking-wide text-paper no-underline"
        >
          Home
        </Link>
        <Link
          to="/contact/"
          className="inline-flex min-h-12 items-center border border-pfeifer px-5 font-sans text-sm font-bold uppercase tracking-wide text-pfeifer no-underline"
        >
          Contact
        </Link>
      </div>
    </main>
  );
}
