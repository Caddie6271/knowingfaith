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
      <path
        stroke="#f3eee6"
        strokeWidth="4.4"
        strokeLinecap="square"
        d="M16 9.2v14.2M11.2 15.4h9.6"
      />
      <path
        stroke="#4a3218"
        strokeWidth="2.1"
        strokeLinecap="square"
        d="M16 10.2v12.2M12.2 15.4h7.6"
      />
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
