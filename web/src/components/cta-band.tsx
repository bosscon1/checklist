import { Link } from "@tanstack/react-router";
import { SITE } from "@/data/site";

export function CtaBand({
  title = "Ready to talk through the job?",
  body = "Call the office or send the project type, city, and a few photos. We will tell you honestly if it is a fit.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="bg-pfeifer py-12 text-paper">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 md:flex-row md:items-center">
        <div>
          <h2 className="font-display text-3xl">{title}</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-paper/85">{body}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={SITE.phoneHref}
            className="inline-flex min-h-12 items-center bg-paper px-5 font-sans text-sm font-bold uppercase tracking-wide text-pfeifer no-underline"
          >
            Call {SITE.phone}
          </a>
          <Link
            to="/get-started/"
            className="inline-flex min-h-12 items-center border border-paper px-5 font-sans text-sm font-bold uppercase tracking-wide text-paper no-underline"
          >
            Request a bid
          </Link>
        </div>
      </div>
    </section>
  );
}
