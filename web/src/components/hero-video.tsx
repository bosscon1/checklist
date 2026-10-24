import { useEffect, useRef } from "react";
import { withBase } from "@/lib/preview-base";

export function HeroVideo({
  src,
  poster,
}: {
  src: string;
  poster: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.muted = true;
    el.defaultMuted = true;
    el.playsInline = true;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const play = () => {
      if (reduce.matches) {
        el.pause();
        return;
      }
      const p = el.play();
      if (p) p.catch(() => {});
    };

    play();
    reduce.addEventListener("change", play);
    const onVis = () => {
      if (!document.hidden) play();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      reduce.removeEventListener("change", play);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <video
      ref={ref}
      className="absolute inset-0 size-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster={withBase(poster)}
      aria-hidden="true"
    >
      <source src={withBase(src)} type="video/mp4" />
    </video>
  );
}
