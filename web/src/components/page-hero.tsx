import { HeroVideo } from "@/components/hero-video";
import { withBase } from "@/lib/preview-base";

export function PageHero({
  image,
  video,
  overlay = 55,
  alt = "",
  eyebrow,
  title,
  lede,
}: {
  image: string;
  video?: string;
  overlay?: number;
  alt?: string;
  eyebrow?: string;
  title: string;
  lede?: string;
}) {
  const wash = Math.max(0, Math.min(80, overlay)) / 100;
  return (
    <section className="relative min-h-[70vh] overflow-hidden bg-charcoal">
      {video ? (
        <HeroVideo src={video} poster={image} />
      ) : (
        <img src={withBase(image)} alt={alt} className="absolute inset-0 size-full object-cover" />
      )}
      <div className="absolute inset-0" style={{ backgroundColor: `rgba(28, 31, 36, ${wash})` }} />
      <div className="relative mx-auto flex min-h-[70vh] max-w-4xl flex-col items-center justify-center px-4 pb-16 pt-44 text-center text-paper">
        {eyebrow && (
          <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-cream">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-2 font-display text-4xl leading-tight md:text-5xl">
          {title}
        </h1>
        {lede && <p className="mt-4 max-w-2xl text-base leading-relaxed text-cream/90">{lede}</p>}
      </div>
    </section>
  );
}
