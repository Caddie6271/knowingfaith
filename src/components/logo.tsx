import { clsx } from "clsx";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={clsx("shrink-0", className ?? "size-8")}
    >
      <rect width="64" height="64" rx="14" fill="#f3eee6" />
      <rect x="2.5" y="2.5" width="59" height="59" rx="12" fill="none" stroke="#8d6840" strokeWidth="2" />
      <path fill="#1a1714" d="M9 31 L27 23 L30 26 L30 48 L12 53 Z" />
      <path fill="#1a1714" d="M55 31 L37 23 L34 26 L34 48 L52 53 Z" />
      <path stroke="#f3eee6" strokeWidth="1.15" strokeLinecap="round" d="M16 34.5h10M15.2 38.5h11M14.6 42.5h11.4" />
      <path stroke="#f3eee6" strokeWidth="1.15" strokeLinecap="round" d="M38 34.5h10M37.8 38.5h11M38 42.5h11.6" />
      <path fill="#4a3218" d="M30.15 14h3.7v8.2H43v3.7H33.85V47h-3.7V25.9H21v-3.7h9.15V14z" />
    </svg>
  );
}

export function Logo({ className, markClassName }: { className?: string; markClassName?: string }) {
  return (
    <span className={clsx("inline-flex items-center gap-2 text-ink", className)}>
      <LogoMark className={markClassName} />
      <span className="font-serif text-xl leading-none">Knowing Faith</span>
    </span>
  );
}
