import { clsx } from "clsx";

export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src="/logo.png"
      alt=""
      className={clsx("w-auto shrink-0", className ?? "h-9")}
    />
  );
}

export function Logo({ className, markClassName }: { className?: string; markClassName?: string }) {
  return (
    <span className={clsx("inline-flex items-center gap-2.5 text-ink", className)}>
      <LogoMark className={markClassName} />
      <span className="font-serif text-xl leading-none">Knowing Faith</span>
    </span>
  );
}
