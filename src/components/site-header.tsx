import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/logo";

const links = [
  { to: "/study", label: "Read", search: { ref: "John 1" } },
  { to: "/compare", label: "Compare", search: { a: "", b: "" } },
  { to: "/lexicon", label: "Lexicon", search: { q: "" } },
  { to: "/memory", label: "Memory" },
] as const;

export function SiteHeader() {
  return (
    <header className="border-b border-line bg-parchment">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2">
        <Link to="/" className="shrink-0" aria-label="Knowing Faith, home">
          <Logo />
        </Link>
        <nav className="ml-auto flex min-w-0 flex-wrap items-center justify-end gap-1 text-sm text-ink-soft">
          {links.map((link) =>
            "search" in link ? (
              <Link
                key={link.to}
                to={link.to}
                search={link.search}
                className="inline-flex min-h-11 shrink-0 items-center px-2 hover:text-ink"
              >
                {link.label}
              </Link>
            ) : (
              <Link
                key={link.to}
                to={link.to}
                className="inline-flex min-h-11 shrink-0 items-center px-2 hover:text-ink"
              >
                {link.label}
              </Link>
            ),
          )}
          <Link
            to="/join"
            className="ml-1 inline-flex min-h-11 shrink-0 items-center rounded-md bg-brass-deep px-3 text-paper hover:bg-brass"
          >
            Register
          </Link>
        </nav>
      </div>
    </header>
  );
}
