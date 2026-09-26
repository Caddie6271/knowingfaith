import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { askStudy, type StudyResult } from "@/lib/ai.functions";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/button";
import { PassageView } from "@/components/passage-view";
import { COMPARE_PRESETS } from "@/data/presets";
import { connectedTranslation, loadPassage, passageText, type Passage } from "@/lib/scripture";
import { useStudy } from "@/lib/study-store";
import { TranslationFields } from "@/components/settings-dialog";

export const Route = createFileRoute("/compare")({
  validateSearch: (search: Record<string, unknown>) => ({
    a: typeof search.a === "string" ? search.a : "",
    b: typeof search.b === "string" ? search.b : "",
  }),
  component: ComparePage,
});

function initialPair(a: string, b: string): { left: string; right: string } {
  if (!a && !b) return { left: "Genesis 1:1-5", right: "John 1:1-5" };
  return { left: a, right: b };
}

function ComparePage() {
  const search = Route.useSearch();
  const ready = useStudy((state) => state.ready);
  const translation = useStudy((state) => state.translation);
  const esvToken = useStudy((state) => state.esvToken);
  const csbKey = useStudy((state) => state.csbKey);
  const connected = connectedTranslation({ translation, esvToken, csbKey });
  const answers = useStudy((state) => state.answers);
  const saveAnswer = useStudy((state) => state.saveAnswer);
  const start = initialPair(search.a, search.b);
  const [leftInput, setLeftInput] = useState(start.left);
  const [rightInput, setRightInput] = useState(start.right);
  const [left, setLeft] = useState<Passage | null>(null);
  const [right, setRight] = useState<Passage | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [asking, setAsking] = useState(false);
  const [result, setResult] = useState<StudyResult | null>(null);
  const [askError, setAskError] = useState("");
  const [question, setQuestion] = useState("");
  const [follows, setFollows] = useState(0);
  const [loadedKey, setLoadedKey] = useState("");

  useEffect(() => {
    const next = initialPair(search.a, search.b);
    setLeftInput(next.left);
    setRightInput(next.right);
  }, [search.a, search.b]);

  useEffect(() => {
    if (!ready || !connected) return;
    const next = initialPair(search.a, search.b);
    if (!next.left && !next.right) return;
    void openPair(next.left, next.right);
  }, [search.a, search.b, translation, esvToken, csbKey, ready, connected]);

  async function openPair(leftRef: string, rightRef: string) {
    setLoading(true);
    setError("");
    setResult(null);
    setAskError("");
    setFollows(0);
    setQuestion("");
    try {
      const creds = { translation: useStudy.getState().translation, esvToken: useStudy.getState().esvToken, csbKey: useStudy.getState().csbKey };
      const [first, second] = await Promise.all([
        leftRef.trim() ? loadPassage(leftRef, creds) : Promise.resolve(null),
        rightRef.trim() ? loadPassage(rightRef, creds) : Promise.resolve(null),
      ]);
      setLeft(first);
      setRight(second);
      const key = `${first?.reference ?? ""}|${first?.translation ?? ""}|${second?.reference ?? ""}|${second?.translation ?? ""}`;
      setLoadedKey(key);
      const saved = useStudy.getState().answers[key];
      if (saved?.kind === "compare") setResult(saved);
    } catch (reason) {
      setLeft(null);
      setRight(null);
      setError(reason instanceof Error ? reason.message : "Those passages didn’t open.");
    } finally {
      setLoading(false);
    }
  }

  async function ask(fresh: boolean) {
    if (!left || !right) return;
    const key = loadedKey;
    if (!fresh) {
      const saved = answers[key];
      if (saved?.kind === "compare") {
        setResult(saved);
        return;
      }
    }
    setAsking(true);
    setAskError("");
    const reply = await askStudy({
      data: {
        mode: "compare",
        question,
        passages: [
          { reference: left.reference, translation: left.translation, text: passageText(left) },
          { reference: right.reference, translation: right.translation, text: passageText(right) },
        ],
      },
    });
    setAsking(false);
    if (!reply.ok) {
      setAskError(reply.error);
      return;
    }
    setResult(reply.result);
    if (reply.result.kind === "compare") saveAnswer(key, reply.result);
  }

  async function followUp() {
    if (!left || !right || !question.trim() || follows >= 3) return;
    setAsking(true);
    setAskError("");
    const reply = await askStudy({
      data: {
        mode: "followup",
        question: question.trim(),
        passages: [
          { reference: left.reference, translation: left.translation, text: passageText(left) },
          { reference: right.reference, translation: right.translation, text: passageText(right) },
        ],
      },
    });
    setAsking(false);
    if (!reply.ok) {
      setAskError(reply.error);
      return;
    }
    setResult(reply.result);
    setFollows((count) => count + 1);
    setQuestion("");
  }

  return (
    <AppShell>
      <p className="kicker">Compare</p>
      <h1 className="mt-2 font-serif text-4xl text-ink md:text-5xl">Two passages, one desk</h1>
      <p className="mt-3 max-w-2xl text-ink-soft">
        Read them together. Then ask for questions that stay inside the words on the page.
      </p>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {COMPARE_PRESETS.map((preset) => (
          <button
            key={preset.title}
            type="button"
            className="min-h-11 shrink-0 rounded-md border border-line bg-paper px-3 text-left text-sm hover:border-brass"
            onClick={() => {
              setLeftInput(preset.a);
              setRightInput(preset.b);
              void openPair(preset.a, preset.b);
            }}
          >
            <span className="block font-medium text-ink">{preset.title}</span>
            <span className="block text-muted">{preset.why}</span>
          </button>
        ))}
      </div>

      <form
        className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_auto]"
        onSubmit={(event) => {
          event.preventDefault();
          void openPair(leftInput, rightInput);
        }}
      >
        <input
          aria-label="First passage"
          value={leftInput}
          onChange={(event) => setLeftInput(event.target.value)}
          className="min-h-11 rounded-md border border-line bg-paper px-3 text-sm"
          placeholder="Genesis 1:1-5"
        />
        <input
          aria-label="Second passage"
          value={rightInput}
          onChange={(event) => setRightInput(event.target.value)}
          className="min-h-11 rounded-md border border-line bg-paper px-3 text-sm"
          placeholder="John 1:1-5"
        />
        <Button type="submit">Open</Button>
      </form>

      {!connected && ready ? (
        <div className="mt-8 border border-line bg-paper p-6">
          <h2 className="font-serif text-3xl">Connect ESV or CSB</h2>
          <p className="mt-3 text-sm text-muted">Passages stay closed until a licensed text is connected.</p>
          <div className="mt-5">
            <TranslationFields />
          </div>
        </div>
      ) : null}

      {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      {loading ? <p className="mt-4 text-sm text-muted">Opening both passages…</p> : null}

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="border-t border-line pt-4">
          {left ? <PassageView passage={left} /> : <p className="text-muted">The first passage will sit here.</p>}
        </div>
        <div className="border-t border-line pt-4">
          {right ? (
            <PassageView passage={right} />
          ) : (
            <p className="text-muted">Add a second reference to set beside the first.</p>
          )}
        </div>
      </div>

      <section className="mt-10 border-t border-line pt-6">
        <h2 className="font-serif text-3xl text-ink">Questions</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          One comparison, then up to three follow-ups. The companion only has the passages open on this page.
        </p>
        <label className="mt-4 block text-sm font-medium" htmlFor="ask">
          Optional question
        </label>
        <textarea
          id="ask"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          rows={3}
          className="mt-2 w-full rounded-md border border-line bg-paper px-3 py-3 text-sm"
          placeholder="What does “beginning” name in each passage?"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <Button disabled={!left || !right || asking} onClick={() => void ask(false)}>
            {asking ? "Reading…" : "Compare with questions"}
          </Button>
          <Button tone="line" disabled={!left || !right || asking || follows >= 3 || !question.trim()} onClick={() => void followUp()}>
            Ask this
          </Button>
          <Button tone="quiet" disabled={!left || !right || asking} onClick={() => void ask(true)}>
            Ask again
          </Button>
        </div>
        {askError ? <p className="mt-3 text-sm text-danger">{askError}</p> : null}
        {result ? <StudyReply result={result} /> : null}
      </section>
    </AppShell>
  );
}

function StudyReply({ result }: { result: StudyResult }) {
  if (result.kind === "prose") {
    return <p className="mt-6 leading-relaxed whitespace-pre-wrap text-ink-soft">{result.text}</p>;
  }
  if (result.kind === "followup") {
    return (
      <div className="mt-6 space-y-3">
        <p className="leading-relaxed whitespace-pre-wrap text-ink-soft">{result.answer}</p>
        {result.question ? (
          <p className="border-l-2 border-brass pl-3 text-ink">{result.question}</p>
        ) : null}
      </div>
    );
  }
  if (result.kind !== "compare") return null;
  return (
    <div className="mt-6 grid gap-6">
      {result.shared ? <p className="font-serif text-2xl leading-snug text-ink">{result.shared}</p> : null}
      {result.observations.length > 0 ? (
        <ul className="space-y-2 text-sm leading-relaxed text-ink-soft">
          {result.observations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
      <ol className="space-y-4">
        {result.questions.map((item, index) => (
          <li key={item.prompt} className="border-t border-line pt-3">
            <p className="kicker">Question {index + 1}</p>
            <p className="mt-1 text-ink">{item.prompt}</p>
            {item.aim ? <p className="mt-1 text-sm text-muted">{item.aim}</p> : null}
          </li>
        ))}
      </ol>
      {result.pressure ? <p className="leading-relaxed text-ink-soft">{result.pressure}</p> : null}
      {result.nextReading ? (
        <p className="text-sm text-brass-deep">Read next: {result.nextReading}</p>
      ) : null}
    </div>
  );
}
