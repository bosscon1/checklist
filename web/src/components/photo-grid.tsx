import { useCallback, useState, useSyncExternalStore } from "react";
import { Lightbox, type LightboxPhoto } from "@/components/lightbox";
import { withBase } from "@/lib/preview-base";

function subscribeColumns(onChange: () => void) {
  const sm = window.matchMedia("(min-width: 640px)");
  const lg = window.matchMedia("(min-width: 1024px)");
  sm.addEventListener("change", onChange);
  lg.addEventListener("change", onChange);
  return () => {
    sm.removeEventListener("change", onChange);
    lg.removeEventListener("change", onChange);
  };
}

function columnCount() {
  if (window.matchMedia("(min-width: 1024px)").matches) return 3;
  if (window.matchMedia("(min-width: 640px)").matches) return 2;
  return 1;
}

/** Round-robin into columns so admin order 1,2,3 sits across the top, then packs down. */
function masonryColumns<T>(items: T[], cols: number): T[][] {
  const columns: T[][] = Array.from({ length: cols }, () => []);
  items.forEach((item, i) => {
    columns[i % cols].push(item);
  });
  return columns;
}

export function PhotoGrid({
  items,
  heading = "Photos of completed projects",
  lede = "Representative work in Fayette and Coweta. Ask to see jobs in your neighborhood.",
  layout = "grid",
}: {
  items: LightboxPhoto[];
  heading?: string;
  lede?: string;
  layout?: "grid" | "masonry";
}) {
  const [open, setOpen] = useState<number | null>(null);
  const last = items.length - 1;
  const close = useCallback(() => setOpen(null), []);
  const prev = useCallback(() => setOpen((i) => (i === null ? i : i === 0 ? last : i - 1)), [last]);
  const next = useCallback(() => setOpen((i) => (i === null ? i : i === last ? 0 : i + 1)), [last]);
  const cols = useSyncExternalStore(subscribeColumns, columnCount, () => 3);

  if (items.length === 0) return null;

  const masonry = layout === "masonry";
  const indexed = items.map((item, index) => ({ item, index }));
  const columns = masonryColumns(indexed, cols);

  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="font-display text-3xl text-ink">{heading}</h2>
        <p className="mt-2 text-sm text-muted">{lede}</p>
        {masonry ? (
          <div className="mt-8 flex gap-4">
            {columns.map((column, c) => (
              <div key={c} className="flex min-w-0 flex-1 flex-col gap-4">
                {column.map(({ item, index }) => (
                  <figure key={item.src + item.alt} className="overflow-hidden bg-cream">
                    <button
                      type="button"
                      className="block w-full cursor-zoom-in text-left"
                      onClick={() => setOpen(index)}
                      aria-label={`View larger: ${item.alt}`}
                    >
                      <img src={withBase(item.src)} alt={item.alt} className="block w-full" />
                    </button>
                  </figure>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => (
              <figure key={item.src + item.alt} className="overflow-hidden bg-cream">
                <button
                  type="button"
                  className="block w-full cursor-zoom-in text-left"
                  onClick={() => setOpen(i)}
                  aria-label={`View larger: ${item.alt}`}
                >
                  <img
                    src={withBase(item.src)}
                    alt={item.alt}
                    className="aspect-16/10 w-full object-cover"
                  />
                </button>
              </figure>
            ))}
          </div>
        )}
      </div>
      {open !== null ? (
        <Lightbox items={items} index={open} onClose={close} onPrev={prev} onNext={next} />
      ) : null}
    </section>
  );
}
