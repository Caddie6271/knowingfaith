import { clsx } from "clsx";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={clsx("shrink-0", className ?? "size-8")}
    >
      <rect width="32" height="32" rx="7" fill="#f3eee6" />
      <rect x="1.25" y="1.25" width="29.5" height="29.5" rx="6" fill="none" stroke="#8d6840" strokeWidth="1.5" />
      <path fill="#1a1714" d="M6.8 9.4c2.8-.8 5.4-.3 7.2.9v13.2c-1.9-1.1-4.5-1.5-7.2-.7V9.4z" />
      <path fill="#1a1714" d="M25.2 9.4c-2.8-.8-5.4-.3-7.2.9v13.2c1.9-1.1 4.5-1.5 7.2-.7V9.4z" />
      <path fill="#f3eee6" d="M15.2 10.6h1.6v12.2h-1.6z" />
      <path stroke="#8d6840" strokeWidth="1.7" strokeLinecap="round" d="M19.1 15.1h4.3M19.1 18.3h3.1" />
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
