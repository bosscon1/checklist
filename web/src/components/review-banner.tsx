import { useEffect, useRef, useState, type TransitionEvent } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { REVIEW_SUMMARY, REVIEWS } from "@/data/reviews";

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function Stars() {
  return (
    <span className="inline-flex gap-0.5 text-star" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="size-3.5 fill-current" />
      ))}
    </span>
  );
}

function Card({ name, date, quote }: { name: string; date: string; quote: string }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);

  return (
    <article className="flex w-80 shrink-0 flex-col border border-line bg-paper p-4 sm:w-96">
      <div className="flex items-center gap-2">
        <div className="flex size-9 items-center justify-center bg-pfeifer font-sans text-xs font-bold text-paper">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="truncate font-sans text-sm font-semibold text-ink">{name}</p>
          <p className="text-xs text-muted">{date}</p>
        </div>
        <span className="ml-auto">
          <GoogleMark />
        </span>
      </div>
      <div className="mt-2">
        <Stars />
      </div>
      <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-ink/85">{quote}</p>
      <p className="mt-3 text-[0.7rem] uppercase tracking-wide text-muted">Posted on Google</p>
    </article>
  );
}

const DELAY_MS = 5000;
const SLIDE_MS = 500;
const GAP_PX = 16;

let reviewTimer: number | null = null;

function armReviewTimer(cb: () => void) {
  if (reviewTimer != null) window.clearTimeout(reviewTimer);
  reviewTimer = window.setTimeout(() => {
    reviewTimer = null;
    cb();
    armReviewTimer(cb);
  }, DELAY_MS);
}

function disarmReviewTimer() {
  if (reviewTimer == null) return;
  window.clearTimeout(reviewTimer);
  reviewTimer = null;
}

export function ReviewBanner() {
  const count = REVIEWS.length;
  const slides = [...REVIEWS, ...REVIEWS];
  const viewportRef = useRef<HTMLDivElement>(null);
  const hover = useRef(false);
  const indexRef = useRef(0);
  const [index, setIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [reduce, setReduce] = useState(false);

  function setSlide(next: number, withAnim = true) {
    indexRef.current = next;
    setAnimate(withAnim);
    setIndex(next);
  }

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);

    function measure() {
      const cards = viewportRef.current?.querySelectorAll("[data-review-track] article");
      if (!cards || cards.length < 2) return;
      const stride = cards[1].getBoundingClientRect().left - cards[0].getBoundingClientRect().left;
      if (stride > 0) setStep(stride);
    }
    measure();
    const ro = new ResizeObserver(measure);
    if (viewportRef.current) ro.observe(viewportRef.current);

    if (!mq.matches) {
      armReviewTimer(() => {
        if (hover.current || document.hidden) return;
        setSlide(indexRef.current + 1, true);
      });
    }

    return () => {
      ro.disconnect();
      disarmReviewTimer();
    };
  }, []);

  function jump(dir: number) {
    const current = indexRef.current;
    if (dir < 0 && current === 0) {
      setSlide(count, false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setSlide(count - 1, true));
      });
      return;
    }
    setSlide(current + dir, true);
  }

  function onEnd(e: TransitionEvent<HTMLDivElement>) {
    if (e.target !== e.currentTarget) return;
    if (indexRef.current < count) return;
    setSlide(indexRef.current - count, false);
  }

  return (
    <section className="overflow-hidden border-y border-line bg-cream" aria-label="Google reviews">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <GoogleMark />
          <p className="font-sans text-sm font-bold uppercase tracking-[0.14em] text-ink">
            {REVIEW_SUMMARY.label}
          </p>
          <Stars />
          <p className="text-sm text-muted">Based on {REVIEW_SUMMARY.count} Google reviews</p>
        </div>
        <a
          href={REVIEW_SUMMARY.href}
          className="font-sans text-xs font-bold uppercase tracking-wide text-pfeifer no-underline hover:text-pfeifer-dark"
          target="_blank"
          rel="noreferrer"
        >
          Read them all
        </a>
      </div>
      <div
        className="relative pb-5"
        onMouseEnter={() => {
          hover.current = true;
        }}
        onMouseLeave={() => {
          hover.current = false;
        }}
      >
        <div
          ref={viewportRef}
          className={`review-mask px-4 ${reduce ? "overflow-x-auto" : "overflow-hidden"}`}
        >
          <div
            data-review-track
            data-index={index}
            className="flex"
            style={{
              gap: GAP_PX,
              transform: reduce ? undefined : `translateX(-${index * step}px)`,
              transition: animate && !reduce ? `transform ${SLIDE_MS}ms ease-in-out` : "none",
            }}
            onTransitionEnd={onEnd}
          >
            {(reduce ? REVIEWS : slides).map((r, i) => (
              <Card key={`${r.name}-${i}`} name={r.name} date={r.date} quote={r.quote} />
            ))}
          </div>
        </div>
        {!reduce && (
          <>
            <button
              type="button"
              className="absolute left-2 top-1/2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center border border-line bg-paper text-ink shadow-sm sm:inline-flex"
              aria-label="Previous reviews"
              onClick={() => jump(-1)}
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              className="absolute right-2 top-1/2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center border border-line bg-paper text-ink shadow-sm sm:inline-flex"
              aria-label="Next reviews"
              onClick={() => jump(1)}
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
      </div>
    </section>
  );
}
