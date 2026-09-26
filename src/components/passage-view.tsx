import { clsx } from "clsx";
import type { Passage, Verse } from "@/lib/scripture";
import { verseKey } from "@/lib/scripture";

const ESV_SHORT =
  "Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®), © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved.";

export function PassageView({
  passage,
  selected,
  onVerse,
}: {
  passage: Passage;
  selected?: string[];
  onVerse?: (verse: Verse, shift: boolean) => void;
}) {
  const showChapter = passage.verses.some((verse, index) => index > 0 && verse.chapter !== passage.verses[0]?.chapter);

  return (
    <article>
      <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-serif text-4xl text-ink">{passage.reference}</h2>
          <p className="kicker mt-2">English Standard Version</p>
        </div>
      </header>
      {passage.warning ? (
        <p className="mb-4 rounded-md border border-line bg-wash px-3 py-3 text-sm text-ink-soft">
          {passage.warning}
        </p>
      ) : null}
      <ol className="space-y-3">
        {passage.verses.map((verse) => {
          const key = verseKey(verse);
          const active = selected?.includes(key);
          const body = (
            <>
              {showChapter ? (
                <span className="verse-no">
                  {verse.chapter}:{verse.number}
                </span>
              ) : (
                <span className="verse-no">{verse.number}</span>
              )}
              <span>{verse.text}</span>
            </>
          );
          if (!onVerse) {
            return (
              <li key={key} className="font-serif text-xl leading-relaxed text-ink">
                {body}
              </li>
            );
          }
          return (
            <li key={key}>
              <button
                type="button"
                onClick={(event) => onVerse(verse, event.shiftKey)}
                className={clsx(
                  "w-full rounded-md px-2 py-2 text-left font-serif text-xl leading-relaxed text-ink",
                  active ? "bg-wash" : "hover:bg-paper",
                )}
              >
                {body}
              </button>
            </li>
          );
        })}
      </ol>
      <p className="mt-6 text-xs leading-relaxed text-muted">
        {passage.notice || ESV_SHORT}
      </p>
    </article>
  );
}
