import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { withBase } from "@/lib/preview-base";

export type LightboxPhoto = {
  src: string;
  alt: string;
  fullSrc?: string;
  caption?: string;
};

export function Lightbox({
  items,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  items: LightboxPhoto[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const photo = items[index];

  useEffect(() => {
    if (!photo) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [photo, onClose, onPrev, onNext, index]);

  if (!photo) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/92 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={photo.alt}
      onClick={onClose}
    >
      <button
        ref={closeRef}
        type="button"
        className="absolute right-4 top-4 grid size-12 place-items-center text-paper hover:bg-paper/10"
        onClick={onClose}
        aria-label="Close photo"
      >
        <X className="size-7" strokeWidth={2} />
      </button>

      {items.length > 1 ? (
        <>
          <button
            type="button"
            className="absolute left-2 top-1/2 grid size-12 -translate-y-1/2 place-items-center text-paper hover:bg-paper/10 sm:left-4"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            aria-label="Previous photo"
          >
            <ChevronLeft className="size-8" strokeWidth={2} />
          </button>
          <button
            type="button"
            className="absolute right-2 top-1/2 grid size-12 -translate-y-1/2 place-items-center text-paper hover:bg-paper/10 sm:right-4"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            aria-label="Next photo"
          >
            <ChevronRight className="size-8" strokeWidth={2} />
          </button>
        </>
      ) : null}

      <figure
        className="flex max-h-[90dvh] max-w-5xl flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={withBase(photo.fullSrc ?? photo.src)}
          alt={photo.alt}
          className="max-h-[78dvh] w-auto max-w-full object-contain"
        />
        <figcaption className="mt-4 text-center text-sm text-paper/85">
          {photo.caption ?? photo.alt}
          {items.length > 1 ? (
            <span className="mt-1 block text-xs uppercase tracking-wide text-paper/55">
              {index + 1} of {items.length}
            </span>
          ) : null}
        </figcaption>
      </figure>
    </div>,
    document.body,
  );
}
