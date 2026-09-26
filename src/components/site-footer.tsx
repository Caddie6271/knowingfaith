import { Link } from "@tanstack/react-router";

const links = [
  { to: "/about", label: "About" },
  { to: "/faq", label: "How to use" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-xs leading-relaxed text-muted md:flex-row md:items-center md:justify-between">
        <p>Knowing Faith · knowing.faith</p>
        <nav className="flex flex-wrap gap-x-4 gap-y-1">
          {links.map((link) => (
            <Link key={link.to} to={link.to} className="inline-flex min-h-11 items-center hover:text-ink">
              {link.label}
            </Link>
          ))}
        </nav>
        <p>ESV® from Crossway. Text is fetched when you ask for a passage.</p>
      </div>
    </footer>
  );
}
