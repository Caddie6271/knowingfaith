import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/button";
import { PassageView } from "@/components/passage-view";
import { CANON } from "@/data/canon";
import { parseRef } from "@/lib/refs";
import { connectedTranslation, loadPassage, verseKey, type Passage, type Verse } from "@/lib/scripture";
import { useStudy } from "@/lib/study-store";
import { TranslationFields } from "@/components/settings-dialog";

export const Route = createFileRoute("/study")({
  validateSearch: (search: Record<string, unknown>) => ({
    ref: typeof search.ref === "string" && search.ref.trim() ? search.ref : "John 1",
  }),
  component: StudyPage,
});

function StudyPage() {
  const { ref } = Route.useSearch();
  const navigate = useNavigate({ from: "/study" });
  const ready = useStudy((state) => state.ready);
  const translation = useStudy((state) => state.translation);
  const esvToken = useStudy((state) => state.esvToken);
  const csbKey = useStudy((state) => state.csbKey);
  const creds = { translation, esvToken, csbKey };
  const connected = connectedTranslation(creds);
  const addCard = useStudy((state) => state.addCard);
  const [draft, setDraft] = useState(ref);
  const [passage, setPassage] = useState<Passage | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [anchor, setAnchor] = useState<string | null>(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    setDraft(ref);
  }, [ref]);

  useEffect(() => {
    if (!ready) return;
    if (!connected) {
      setLoading(false);
      setPassage(null);
      setError("");
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError("");
    setSelected([]);
    setAnchor(null);
    setNote("");
    loadPassage(ref, creds)
      .then((next) => {
        if (!cancelled) setPassage(next);
      })
      .catch((reason: unknown) => {
        if (!cancelled) {
          setPassage(null);
          setError(reason instanceof Error ? reason.message : "That passage didn’t open.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [ref, ready, connected, creds.translation, creds.esvToken, creds.csbKey]);

  const parsed = useMemo(() => {
    try {
      return parseRef(ref);
    } catch {
      return null;
    }
  }, [ref]);

  function go(next: string) {
    navigate({ search: { ref: next } });
  }

  function onVerse(verse: Verse, shift: boolean) {
    const key = verseKey(verse);
    if (!passage) return;
    if (shift && anchor) {
      const ids = passage.verses.map((item) => verseKey(item));
      const start = ids.indexOf(anchor);
      const end = ids.indexOf(key);
      if (start >= 0 && end >= 0) {
        const [from, to] = start < end ? [start, end] : [end, start];
        setSelected(ids.slice(from, to + 1));
        return;
      }
    }
    setAnchor(key);
    setSelected((current) => (current.length === 1 && current[0] === key ? [] : [key]));
  }

  const chosen = passage?.verses.filter((verse) => selected.includes(verseKey(verse))) ?? [];
  const selectionLabel = labelFor(passage, chosen);

  function memorize() {
    if (!passage || chosen.length === 0 || !selectionLabel) return;
    const added = addCard({
      ref: selectionLabel,
      translation: passage.translation,
      text: chosen.map((verse) => verse.text).join(" "),
    });
    setNote(added ? `${selectionLabel} is in your memory set.` : `${selectionLabel} is already there.`);
  }

  return (
    <AppShell>
      <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            go(draft);
          }}
        >
          <label className="block text-sm font-medium" htmlFor="goto">
            Go to
          </label>
          <input
            id="goto"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            className="w-full rounded-md border border-line bg-paper px-3 py-3 text-sm"
            placeholder="Romans 8:1-4"
          />
          <Button type="submit" tone="line" className="w-full">
            Open
          </Button>
          <label className="mt-4 block text-sm font-medium" htmlFor="book">
            Book
          </label>
          <select
            id="book"
            className="w-full rounded-md border border-line bg-paper px-3 py-3 text-sm"
            value={parsed?.osis ?? "John"}
            onChange={(event) => {
              const book = CANON.find((item) => item.osis === event.target.value);
              if (book) go(`${book.name} 1`);
            }}
          >
            <optgroup label="Old Testament">
              {CANON.filter((book) => book.testament === "OT").map((book) => (
                <option key={book.osis} value={book.osis}>
                  {book.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="New Testament">
              {CANON.filter((book) => book.testament === "NT").map((book) => (
                <option key={book.osis} value={book.osis}>
                  {book.name}
                </option>
              ))}
            </optgroup>
          </select>
          {parsed ? (
            <div className="flex items-center gap-2">
              <Button
                tone="line"
                className="px-3"
                onClick={() => go(`${parsed.name} ${Math.max(1, parsed.chapterStart - 1)}`)}
                disabled={parsed.chapterStart <= 1}
              >
                Prev
              </Button>
              <label className="sr-only" htmlFor="chapter">
                Chapter
              </label>
              <select
                id="chapter"
                className="min-h-11 flex-1 rounded-md border border-line bg-paper px-2 text-sm"
                value={parsed.chapterStart}
                onChange={(event) => go(`${parsed.name} ${event.target.value}`)}
              >
                {Array.from({ length: CANON.find((book) => book.osis === parsed.osis)?.chapters ?? 1 }, (_, index) => (
                  <option key={index + 1} value={index + 1}>
                    Chapter {index + 1}
                  </option>
                ))}
              </select>
              <Button
                tone="line"
                className="px-3"
                onClick={() => {
                  const max = CANON.find((book) => book.osis === parsed.osis)?.chapters ?? parsed.chapterStart;
                  go(`${parsed.name} ${Math.min(max, parsed.chapterStart + 1)}`);
                }}
                disabled={
                  parsed.chapterStart >= (CANON.find((book) => book.osis === parsed.osis)?.chapters ?? 1)
                }
              >
                Next
              </Button>
            </div>
          ) : null}
          <p className="text-sm leading-relaxed text-muted">
            Select a verse. Shift-click to take a range. Then memorize it, or set it beside another passage.
          </p>
        </form>

        <div>
          {ready && !connected ? (
            <div className="border border-line bg-paper p-6">
              <h2 className="font-serif text-3xl text-ink">Connect ESV or CSB</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                The reading room will not open another translation. Choose one and save its key.
              </p>
              <div className="mt-5">
                <TranslationFields />
              </div>
            </div>
          ) : null}
          {loading && connected ? <p className="text-muted">Opening the passage…</p> : null}
          {error ? <p className="text-danger">{error}</p> : null}
          {passage && !loading ? (
            <PassageView passage={passage} selected={selected} onVerse={onVerse} />
          ) : null}
          {chosen.length > 0 && passage ? (
            <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-line pt-4">
              <p className="mr-auto text-sm text-ink-soft">{selectionLabel}</p>
              <Button onClick={memorize}>Memorize</Button>
              <Button
                tone="line"
                onClick={() =>
                  navigate({
                    to: "/compare",
                    search: { a: selectionLabel, b: "" },
                  })
                }
              >
                Compare
              </Button>
            </div>
          ) : null}
          {note ? <p className="mt-3 text-sm text-brass-deep">{note}</p> : null}
        </div>
      </div>
    </AppShell>
  );
}

function labelFor(passage: Passage | null, verses: Verse[]): string {
  if (!passage || verses.length === 0) return "";
  const first = verses[0];
  const last = verses[verses.length - 1];
  if (!first || !last) return "";
  if (first.chapter === last.chapter && first.number === last.number) {
    return `${passage.book} ${first.chapter}:${first.number}`;
  }
  if (first.chapter === last.chapter) {
    return `${passage.book} ${first.chapter}:${first.number}–${last.number}`;
  }
  return `${passage.book} ${first.chapter}:${first.number}–${last.chapter}:${last.number}`;
}
