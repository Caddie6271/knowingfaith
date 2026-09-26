import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/about")({ component: AboutPage });

function AboutPage() {
  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-14 md:py-20">
        <p className="kicker">About</p>
        <h1 className="mt-3 font-serif text-5xl text-ink">A room for the words.</h1>
        <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink-soft">
          <p>
            Knowing Faith is a reading room. You open a passage, set another beside it, look up the Greek or
            Hebrew under a word, and keep a line until you can say it.
          </p>
          <p>
            The English text is the ESV. It is fetched from Crossway when you ask for a passage, with a token
            you connect yourself. It is not stored here, and another translation is not put in its place.
          </p>
          <p>
            Notes and memory cards stay in this browser until you sign in. Google sign-in is open. There is
            no charge.
          </p>
          <p>The site is knowing.faith.</p>
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            to="/faq"
            className="inline-flex min-h-11 items-center rounded-md bg-brass-deep px-4 text-sm font-medium text-paper hover:bg-brass"
          >
            How to use it
          </Link>
          <Link
            to="/contact"
            className="inline-flex min-h-11 items-center rounded-md border border-line bg-paper px-4 text-sm font-medium text-ink hover:border-brass"
          >
            Contact
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
