import { Link } from "@tanstack/react-router";
import { SITE } from "@/data/site";
import { withBase } from "@/lib/preview-base";

export function Logo({
  compact = false,
  scrolled = false,
}: {
  compact?: boolean;
  scrolled?: boolean;
}) {
  const size = compact
    ? "h-9 w-auto"
    : scrolled
      ? "h-9 w-auto sm:h-11"
      : "h-14 w-auto sm:h-[4.5rem]";

  return (
    <Link to="/" className="flex items-center text-paper no-underline" aria-label={`${SITE.name} home`}>
      <img
        src={withBase("/images/logo.png")}
        alt=""
        width={438}
        height={132}
        className={`w-auto motion-safe:transition-[height] motion-safe:duration-200 motion-safe:ease-out ${size}`}
      />
    </Link>
  );
}
