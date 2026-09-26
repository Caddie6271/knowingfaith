import { clsx } from "clsx";
import type { ButtonHTMLAttributes } from "react";

const tones = {
  solid: "bg-brass-deep text-paper hover:bg-brass",
  line: "border border-line bg-paper text-ink hover:border-brass",
  quiet: "bg-transparent text-ink-soft hover:text-ink",
} as const;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: keyof typeof tones;
};

export function Button({ tone = "solid", className, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={clsx(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
