import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/faq")({ component: FaqPage });

const items = [
  {
    q: "How do I open a passage?",
    a: "Open Read, type a reference such as John 1 or Psalm 23, and press enter. The first time, connect your ESV token. The text is fetched then, and it is not kept on the server.",
    video: "/faq/read.mp4",
    poster: "/faq/read.jpg",
  },
  {
    q: "How do I set two passages beside each other?",
    a: "Open Compare. The desks start with Genesis 1 and John 1. Change either reference, or choose a prepared pair. Ask a question only after both passages are on the page.",
    video: "/faq/compare.mp4",
    poster: "/faq/compare.jpg",
  },
  {
    q: "How do I look up a Greek or Hebrew word?",
    a: "Open Lexicon and search a word, a Strong’s number, or a book. The note is a short study aid, not a full lexicon. From a verse you can carry the word back into Read.",
    video: "/faq/lexicon.mp4",
    poster: "/faq/lexicon.jpg",
  },
  {
    q: "How do I keep a verse?",
    a: "In Read, select a line and add it to memory. Memory brings it back in stages: the reference, then a cue, then the line itself.",
    video: "/faq/memory.mp4",
    poster: "/faq/memory.jpg",
  },
  {
    q: "How do I write a note, or transcribe a sermon?",
    a: "Journal holds your notes in this browser. Import sermon takes an mp3, m4a, or wav under 80 MB, turns it into text you can edit, and does not keep the recording.",
    video: "/faq/journal.mp4",
    poster: "/faq/journal.jpg",
  },
  {
    q: "Do I need an account?",
    a: "No. The reading room works without one. Register signs you in with Google if you want an account. There is no charge.",
  },
] as const;

function FaqPage() {
  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-14 md:py-20">
        <p className="kicker">How to use</p>
        <h1 className="mt-3 font-serif text-5xl text-ink">The reading room, one step at a time.</h1>
        <p className="mt-6 text-lg leading-relaxed text-ink-soft">
          Short recordings of the pages themselves. Press play. Nothing starts on its own.
        </p>
        <div className="mt-12 space-y-14">
          {items.map((item) => (
            <article key={item.q}>
              <h2 className="font-serif text-3xl text-ink">{item.q}</h2>
              <p className="mt-3 leading-relaxed text-ink-soft">{item.a}</p>
              {"video" in item ? (
                <video
                  className="mt-5 w-full border border-line bg-paper"
                  controls
                  playsInline
                  preload="metadata"
                  poster={item.poster}
                >
                  <source src={item.video} type="video/mp4" />
                </video>
              ) : null}
            </article>
          ))}
        </div>
        <p className="mt-14 text-sm text-muted">
          Something still stuck? <Link to="/contact" className="text-brass-deep">Write to the desk.</Link>
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
