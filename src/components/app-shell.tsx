import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { SettingsDialog } from "@/components/settings-dialog";
import { Logo } from "@/components/logo";
import { useStudy } from "@/lib/study-store";

const links = [
  { to: "/study", label: "Read" },
  { to: "/compare", label: "Compare" },
  { to: "/lexicon", label: "Lexicon" },
  { to: "/memory", label: "Memory" },
  { to: "/journal", label: "Journal" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const setReady = useStudy((state) => state.setReady);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!useStudy.getState().ready) setReady();
    }, 300);
    return () => window.clearTimeout(timer);
  }, [setReady]);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-line bg-parchment">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2">
          <Link to="/" className="shrink-0" aria-label="Knowing Faith, home">
            <Logo />
          </Link>
          <nav className="ml-auto flex min-w-0 flex-wrap items-center justify-end gap-1 text-sm">
            {links.map((link) => {
              const active = pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={
                    active
                      ? "inline-flex min-h-11 shrink-0 items-center border-b-2 border-brass-deep px-2 text-ink"
                      : "inline-flex min-h-11 shrink-0 items-center px-2 text-muted hover:text-ink"
                  }
                >
                  {link.label}
                </Link>
              );
            })}
            <SettingsDialog />
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-6 md:py-10">{children}</div>
      <footer className="mx-auto max-w-6xl px-4 pb-12 text-xs leading-relaxed text-muted">
        ESV® text is fetched live from Crossway. It is not stored in Knowing Faith.
      </footer>
    </div>
  );
}
