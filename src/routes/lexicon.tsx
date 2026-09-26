import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { LEXICON, searchLexicon, type LexEntry } from "@/data/lexicon";

export const Route = createFileRoute("/lexicon")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === "string" ? search.q : "",
  }),
  component: LexiconPage,
});

function LexiconPage() {
  const { q } = Route.useSearch();
  const [query, setQuery] = useState(q);
  const [language, setLanguage] = useState<"all" | "hebrew" | "greek">("all");
  const results = useMemo(() => searchLexicon(query, language), [query, language]);
  const [picked, setPicked] = useState(q || "logos");
  const entry =
    results.find((item) => matchesPick(item, picked)) ??
    LEXICON.find((item) => matchesPick(item, picked)) ??
    results[0] ??
    LEXICON[0];

  return (
    <AppShell>
      <p className="kicker">Lexicon</p>
      <h1 className="mt-2 font-serif text-4xl text-ink md:text-5xl">Words that carry the story</h1>
      <p className="mt-3 max-w-2xl text-ink-soft">
        Short study notes on Greek and Hebrew words, written for the reading room. Strong’s numbers are
        identifiers. This is not a full lexicon.
      </p>
      <div className="mt-6 flex flex-col gap-6 lg:grid lg:grid-cols-[20rem_1fr]">
        <div>
          <label className="sr-only" htmlFor="lex-search">
            Search the lexicon
          </label>
          <input
            id="lex-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="love, hesed, John, G3056"
            className="w-full rounded-md border border-line bg-paper px-3 py-3 text-sm"
          />
          <div className="mt-3 flex gap-2">
            {(
              [
                ["all", "All"],
                ["hebrew", "Hebrew"],
                ["greek", "Greek"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setLanguage(value)}
                className={
                  language === value
                    ? "min-h-11 rounded-md bg-brass-deep px-3 text-sm text-paper"
                    : "min-h-11 rounded-md border border-line bg-paper px-3 text-sm text-ink"
                }
              >
                {label}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted">{results.length} words</p>
          <ul className="mt-2 border-t border-line">
            {results.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setPicked(item.id)}
                  className={
                    entry?.id === item.id
                      ? "flex min-h-11 w-full items-baseline justify-between gap-3 bg-wash px-2 text-left"
                      : "flex min-h-11 w-full items-baseline justify-between gap-3 px-2 text-left hover:bg-paper"
                  }
                >
                  <span className="font-serif text-lg">{item.word}</span>
                  <span className="text-xs text-muted">{item.gloss}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        {entry ? <Entry entry={entry} /> : <p className="text-muted">No word matched that search.</p>}
      </div>
    </AppShell>
  );
}

function matchesPick(entry: LexEntry, picked: string): boolean {
  const needle = picked.toLowerCase();
  return (
    entry.id.toLowerCase() === needle ||
    entry.transliteration.toLowerCase() === needle ||
    entry.gloss.toLowerCase() === needle
  );
}

function Entry({ entry }: { entry: LexEntry }) {
  return (
    <article className="border border-line bg-paper p-6 md:p-8">
      <p className="kicker">
        {entry.language === "greek" ? "Greek" : "Hebrew"} · {entry.strong}
      </p>
      <h2 className="mt-2 font-serif text-5xl break-words text-ink">{entry.word}</h2>
      <p className="mt-2 text-sm text-muted">
        {entry.transliteration} · {entry.gloss} · {entry.kind}
      </p>
      <p className="mt-5 text-lg leading-relaxed text-ink-soft">{entry.definition}</p>
      <p className="mt-4 leading-relaxed text-ink">{entry.note}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {entry.see.map((ref) => (
          <Link
            key={ref}
            to="/study"
            search={{ ref }}
            className="inline-flex min-h-11 items-center rounded-md border border-line px-3 text-sm text-brass-deep hover:border-brass"
          >
            {ref}
          </Link>
        ))}
      </div>
    </article>
  );
}
