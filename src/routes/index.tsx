import { useEffect, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { LogoMark } from "@/components/logo";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <div>
      <SiteHeader />
      <main>
        <section className="mx-auto grid max-w-6xl items-end gap-12 px-5 py-14 md:grid-cols-2 md:py-24">
          <div>
            <LogoMark className="size-14" />
            <p className="kicker mt-5">Scripture study</p>
            <h1 className="display-title mt-4 text-ink">Knowing Faith</h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">
              A reading room for setting passages beside each other, learning the words underneath them, and
              keeping them by heart. Questions are asked so you go back to the text, not away from it.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/study"
                search={{ ref: "John 1" }}
                className="inline-flex min-h-11 items-center rounded-md bg-brass-deep px-4 text-sm font-medium text-paper hover:bg-brass"
              >
                Open the reading room
              </Link>
              <Link
                to="/compare"
                search={{ a: "Genesis 1:1-5", b: "John 1:1-5" }}
                className="inline-flex min-h-11 items-center rounded-md border border-line bg-paper px-4 text-sm font-medium text-ink hover:border-brass"
              >
                Compare two passages
              </Link>
            </div>
          </div>
          <article className="border border-line bg-paper px-6 py-8 md:px-8">
            <p className="kicker">John 1</p>
            <h2 className="mt-2 font-serif text-3xl text-ink">The Word</h2>
            <p className="mt-6 font-serif text-2xl leading-relaxed text-ink">
              The passage opens in the ESV once that license is connected. Knowing Faith does not substitute another Bible.
            </p>
            <p className="mt-6 text-sm text-muted">Genesis 1:1–5 beside John 1:1–5 is the first comparison.</p>
          </article>
        </section>

        <section className="border-t border-line">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-4">
            {[
              ["01", "Read", "Open a chapter. Select a line. Carry it into memory or into a comparison."],
              ["02", "Compare", "Set two passages on the same desk and ask what they do to each other."],
              ["03", "Lexicon", "Greek and Hebrew words that carry the story, with the verses that show them."],
              ["04", "Memory", "The words come away in stages. Then you sit with what the verse actually says."],
            ].map(([index, title, copy]) => (
              <div key={index}>
                <p className="kicker">{index}</p>
                <h2 className="mt-2 font-serif text-3xl text-ink">{title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">{copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-line bg-ink text-paper">
          <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
            <p className="kicker text-brass">Study</p>
            <h2 className="mt-3 max-w-xl font-serif text-4xl">Stay with the words.</h2>
            <p className="mt-4 max-w-xl leading-relaxed text-paper/80">
              Open the page. Let one line sit next to another. The reading room is for staying, not skimming.
            </p>
            <StudyFilm />
          </div>
        </section>

        <section className="border-t border-line bg-paper">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2">
            <div>
              <p className="kicker">Compare</p>
              <h2 className="mt-3 font-serif text-4xl text-ink">In the beginning, and the Word</h2>
              <p className="mt-4 text-ink-soft">
                Genesis 1 and John 1 are not the same paragraph. Knowing Faith puts them side by side and asks
                questions that only the wording can answer.
              </p>
              <ul className="mt-6 space-y-4 text-sm leading-relaxed text-ink-soft">
                <li>What does “beginning” name in each passage, and what is already there before anything is made?</li>
                <li>Where is the darkness in Genesis 1, and what does John 1 say the light does?</li>
                <li>Who speaks in Genesis 1, and who is called the Word in John 1?</li>
              </ul>
              <Link
                to="/compare"
                search={{ a: "Genesis 1:1-5", b: "John 1:1-5" }}
                className="mt-6 inline-flex min-h-11 items-center text-sm font-medium text-brass-deep"
              >
                Open this comparison
              </Link>
            </div>
            <div className="grid gap-4">
              <article className="border border-line bg-parchment p-5">
                <p className="kicker">Left</p>
                <p className="mt-3 font-serif text-3xl text-ink">Genesis 1:1–5</p>
              </article>
              <article className="border border-line bg-parchment p-5">
                <p className="kicker">Right</p>
                <p className="mt-3 font-serif text-3xl text-ink">John 1:1–5</p>
              </article>
            </div>
          </div>
        </section>

        <section className="border-t border-line">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1fr_1.2fr]">
            <div>
              <p className="kicker">Lexicon</p>
              <h2 className="mt-3 font-serif text-4xl text-ink">The word under the word</h2>
              <p className="mt-4 leading-relaxed text-ink-soft">
                A starter lexicon of the Greek and Hebrew words that keep showing up: love, covenant, light,
                servant, beginning. Each note points back at a verse. It is a reading aid, not a full academic
                dictionary.
              </p>
              <Link
                to="/lexicon"
                search={{ q: "logos" }}
                className="mt-6 inline-flex min-h-11 items-center text-sm font-medium text-brass-deep"
              >
                Look up logos
              </Link>
            </div>
            <article className="border border-line bg-paper p-6 md:p-8">
              <p className="kicker">Greek · G3056</p>
              <h3 className="mt-2 font-serif text-5xl text-ink">λόγος</h3>
              <p className="mt-1 text-sm text-muted">logos · word</p>
              <p className="mt-4 leading-relaxed text-ink-soft">
                A spoken or written word, and also the reason that holds a message together. In John’s opening
                it is the name he gives the Son who was with God and was God.
              </p>
              <p className="mt-4 text-sm text-brass-deep">See John 1:1</p>
            </article>
          </div>
        </section>

        <section className="border-t border-line bg-paper">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <p className="kicker">The text</p>
            <h2 className="mt-3 max-w-2xl font-serif text-4xl text-ink">The English Standard Version.</h2>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-ink-soft">
              Free for non-commercial use from Crossway at api.esv.org. Create an application and paste the token. A paid product needs a license, and Crossway licenses organizations, not solo developers.
            </p>
          </div>
        </section>

        <section className="border-t border-line">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-16 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="kicker">Register</p>
              <h2 className="mt-3 font-serif text-4xl text-ink">Sign-in and payment wait until this is tested.</h2>
              <p className="mt-4 leading-relaxed text-ink-soft">
                Google and Microsoft login, and checkout, are not turned on. The reading room is. Use it. When
                accounts open, Register is the door.
              </p>
            </div>
            <Link
              to="/join"
              className="inline-flex min-h-11 items-center rounded-md bg-brass-deep px-4 text-sm font-medium text-paper hover:bg-brass"
            >
              Register
            </Link>
          </div>
        </section>
      </main>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-xs leading-relaxed text-muted md:flex-row md:justify-between">
          <p>Knowing Faith · knowing.faith</p>
          <p>ESV® from Crossway. Text is fetched when you ask for a passage.</p>
        </div>
      </footer>
    </div>
  );
}

function StudyFilm() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      return;
    }
    void video.play().catch(() => undefined);
  }, []);

  return (
    <video
      ref={ref}
      className="mt-8 aspect-video w-full bg-ink object-cover"
      muted
      loop
      playsInline
      autoPlay
      poster="/study-poster.jpg"
      aria-label="An open Bible on a desk. A brass cross stands where the pages part, and a hand turns the page."
    >
      <source src="/study.mp4" type="video/mp4" />
    </video>
  );
}
