import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { askStudy, type StudyResult } from "@/lib/ai.functions";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/button";
import { MEMORY_STARTERS } from "@/data/presets";
import { connectedTranslation, loadPassage } from "@/lib/scripture";
import { useStudy, normalizeRecite, type MemoryCard } from "@/lib/study-store";
import { TranslationFields } from "@/components/settings-dialog";

export const Route = createFileRoute("/memory")({ component: MemoryPage });

function MemoryPage() {
  const ready = useStudy((state) => state.ready);
  const cards = useStudy((state) => state.cards);
  const addCard = useStudy((state) => state.addCard);
  const removeCard = useStudy((state) => state.removeCard);
  const gradeCard = useStudy((state) => state.gradeCard);
  const translation = useStudy((state) => state.translation);
  const esvToken = useStudy((state) => state.esvToken);
  const csbKey = useStudy((state) => state.csbKey);
  const connected = connectedTranslation({ translation, esvToken, csbKey });
  const [activeId, setActiveId] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [adding, setAdding] = useState(false);

  const due = useMemo(
    () => cards.filter((card) => card.dueAt <= Date.now()).sort((a, b) => a.dueAt - b.dueAt),
    [cards],
  );
  const active = cards.find((card) => card.id === activeId) ?? due[0] ?? cards[0] ?? null;

  async function addStarters() {
    if (!connected) {
      setAdding(false);
      setStatus(translation === "CSB" ? "Save an API.Bible key first." : "Save an ESV token first.");
      return;
    }
    setAdding(true);
    setStatus("");
    let added = 0;
    for (const ref of MEMORY_STARTERS) {
      try {
        const passage = await loadPassage(ref, { translation, esvToken, csbKey });
        const text = passage.verses
          .map((verse) => verse.text.replace(/^A Psalm by David\.\s*/, ""))
          .join(" ");
        if (
          addCard({
            ref: passage.reference,
            translation: passage.translation,
            text,
          })
        ) {
          added += 1;
        }
      } catch {
        setStatus("One of the starter verses didn’t load.");
      }
    }
    setAdding(false);
    setStatus(added ? `Added ${added} to your set.` : "Those verses are already in your set.");
  }

  return (
    <AppShell>
      <p className="kicker">Memory</p>
      <h1 className="mt-2 font-serif text-4xl text-ink md:text-5xl">Learn it, then sit with it</h1>
      <p className="mt-3 max-w-2xl text-ink-soft">
        Read the verse once. Words drop away. When you can say it, ask what it claims. Your set stays on
        this device.
      </p>

      {!ready ? <p className="mt-6 text-sm text-muted">Opening your set…</p> : null}

      {ready && cards.length === 0 ? (
        <div className="mt-8 max-w-xl border border-line bg-paper p-6">
          <h2 className="font-serif text-3xl">Nothing kept yet</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Select verses in the reading room, or start with five short passages: John 1:1, John 3:16, Micah
            6:8, Romans 8:1, and Philippians 4:6–7.
          </p>
          <div className="mt-5">
            <TranslationFields />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button disabled={adding} onClick={() => void addStarters()}>
              {adding ? "Adding…" : "Add a starter set"}
            </Button>
            <Link
              to="/study"
              search={{ ref: "John 1" }}
              className="inline-flex min-h-11 items-center rounded-md border border-line px-4 text-sm"
            >
              Open the reading room
            </Link>
          </div>
        </div>
      ) : null}

      {active ? (
        <Practice
          key={active.id}
          card={active}
          onGrade={(remembered) => {
            gradeCard(active.id, remembered);
            setActiveId(null);
          }}
          onRemove={() => {
            removeCard(active.id);
            setActiveId(null);
          }}
        />
      ) : null}

      {status ? <p className="mt-4 text-sm text-brass-deep">{status}</p> : null}

      {cards.length > 0 ? (
        <section className="mt-10">
          <h2 className="font-serif text-2xl">Your set</h2>
          <p className="mt-1 text-sm text-muted">
            {due.length} due · {cards.filter((card) => card.reps >= 2).length} settling in
          </p>
          <ul className="mt-4 divide-y divide-line border-t border-line">
            {cards.map((card) => (
              <li key={card.id} className="flex flex-wrap items-center gap-3 py-3">
                <button type="button" className="min-h-11 text-left" onClick={() => setActiveId(card.id)}>
                  <span className="block font-medium">{card.ref}</span>
                  <span className="block text-xs text-muted">
                    {card.translation} · {card.dueAt <= Date.now() ? "due" : "later"} · {card.reps} remembered
                  </span>
                </button>
                <button
                  type="button"
                  className="ml-auto min-h-11 px-2 text-sm text-muted"
                  onClick={() => removeCard(card.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </AppShell>
  );
}

function maskWords(text: string, round: number): string {
  const parts = text.split(/(\s+)/);
  let wordIndex = 0;
  return parts
    .map((part) => {
      if (!part.trim()) return part;
      const current = wordIndex;
      wordIndex += 1;
      if (round <= 0) return part;
      if (round === 1 && current % 2 === 1 && part.length > 2) return "____";
      if (round >= 2 && part.length > 2) return `${part.slice(0, 1)}${"_".repeat(Math.min(6, part.length - 1))}`;
      return part;
    })
    .join("");
}

function Practice({
  card,
  onGrade,
  onRemove,
}: {
  card: MemoryCard;
  onGrade: (remembered: boolean) => void;
  onRemove: () => void;
}) {
  const [round, setRound] = useState(0);
  const [typed, setTyped] = useState("");
  const [checked, setChecked] = useState<"yes" | "no" | null>(null);
  const [study, setStudy] = useState<StudyResult | null>(null);
  const [studyError, setStudyError] = useState("");
  const [studying, setStudying] = useState(false);

  const shown = round >= 3 ? "" : maskWords(card.text, round);

  async function sit() {
    setStudying(true);
    setStudyError("");
    const reply = await askStudy({
      data: {
        mode: "memory",
        passages: [{ reference: card.ref, translation: card.translation, text: card.text }],
      },
    });
    setStudying(false);
    if (!reply.ok) {
      setStudyError(reply.error);
      return;
    }
    setStudy(reply.result);
  }

  return (
    <section className="mt-8 border border-line bg-paper p-6 md:p-8">
      <p className="kicker">{card.translation}</p>
      <h2 className="mt-2 font-serif text-3xl text-ink">{card.ref}</h2>
      {round < 3 ? (
        <p className="mt-5 font-serif text-2xl leading-relaxed text-ink">{shown}</p>
      ) : (
        <div className="mt-5">
          <label className="text-sm font-medium" htmlFor="recite">
            Say it back
          </label>
          <textarea
            id="recite"
            value={typed}
            onChange={(event) => {
              setTyped(event.target.value);
              setChecked(null);
            }}
            rows={4}
            className="mt-2 w-full rounded-md border border-line bg-parchment px-3 py-3 text-base"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              tone="line"
              onClick={() =>
                setChecked(normalizeRecite(typed) === normalizeRecite(card.text) ? "yes" : "no")
              }
            >
              Check
            </Button>
            <Button tone="quiet" onClick={() => setRound(0)}>
              Show the verse
            </Button>
          </div>
          {checked === "yes" ? <p className="mt-3 text-sm text-brass-deep">The wording matches.</p> : null}
          {checked === "no" ? (
            <p className="mt-3 text-sm text-ink-soft">
              Not yet. Show the verse, then try the line you missed.
            </p>
          ) : null}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        {round < 3 ? (
          <Button onClick={() => setRound((value) => value + 1)}>
            {round === 0 ? "Hide some words" : "Hide more"}
          </Button>
        ) : null}
        <Button tone="line" disabled={studying} onClick={() => void sit()}>
          {studying ? "Sitting with it…" : "Study this with me"}
        </Button>
        <Button tone="quiet" onClick={onRemove}>
          Remove
        </Button>
      </div>

      {studyError ? <p className="mt-4 text-sm text-danger">{studyError}</p> : null}
      {study?.kind === "memory" ? (
        <div className="mt-6 space-y-3 border-t border-line pt-4">
          <ul className="space-y-2 text-sm leading-relaxed text-ink-soft">
            {study.cues.map((cue) => (
              <li key={cue}>{cue}</li>
            ))}
          </ul>
          {study.blankPrompt ? <p className="text-ink">{study.blankPrompt}</p> : null}
          <p className="font-serif text-xl text-ink">{study.checkQuestion}</p>
        </div>
      ) : null}
      {study?.kind === "prose" ? <p className="mt-4 whitespace-pre-wrap text-ink-soft">{study.text}</p> : null}

      <div className="mt-6 flex flex-wrap gap-2 border-t border-line pt-4">
        <Button onClick={() => onGrade(true)}>I remember it</Button>
        <Button tone="line" onClick={() => onGrade(false)}>
          Again
        </Button>
      </div>
    </section>
  );
}
