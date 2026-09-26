import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/button";
import { transcribeSermon } from "@/lib/sermon.functions";
import { useStudy } from "@/lib/study-store";

export const Route = createFileRoute("/journal")({ component: JournalPage });

function titleFromFile(name: string): string {
  const base = name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim();
  return base.slice(0, 120) || "Sermon";
}

function JournalPage() {
  const ready = useStudy((state) => state.ready);
  const entries = useStudy((state) => state.entries);
  const addEntry = useStudy((state) => state.addEntry);
  const updateEntry = useStudy((state) => state.updateEntry);
  const removeEntry = useStudy((state) => state.removeEntry);
  const fileRef = useRef<HTMLInputElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const active = entries.find((entry) => entry.id === activeId) ?? entries[0] ?? null;

  function startNote() {
    const id = addEntry({ title: "Note", body: "", source: "note" });
    setActiveId(id);
    setStatus("");
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setStatus("Transcribing the sermon…");
    try {
      const form = new FormData();
      form.set("audio", file);
      const result = await transcribeSermon({ data: form });
      if (!result.ok) {
        setStatus(result.error);
        return;
      }
      const id = addEntry({ title: titleFromFile(file.name), body: result.text, source: "sermon" });
      setActiveId(id);
      setStatus("The recording was transcribed and is not kept.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "The sermon could not be transcribed.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <AppShell>
      <p className="kicker">Journal</p>
      <h1 className="mt-2 font-serif text-4xl text-ink md:text-5xl">Notes, and the sermon beside them</h1>
      <p className="mt-3 max-w-2xl text-ink-soft">
        Write what you are studying. Or bring in a sermon recording and turn it into notes you can edit. The
        audio is not stored. The notes stay in this browser.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button onClick={startNote}>New note</Button>
        <Button tone="line" disabled={busy} onClick={() => fileRef.current?.click()}>
          {busy ? "Transcribing…" : "Import sermon"}
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="audio/*,.mp3,.m4a,.wav,.ogg,.webm,.aac,.flac"
          className="sr-only"
          onChange={(event) => void onFile(event.target.files?.[0])}
        />
      </div>
      {status ? <p className="mt-3 text-sm text-muted">{status}</p> : null}

      {!ready ? <p className="mt-8 text-sm text-muted">Opening your journal…</p> : null}

      {ready && entries.length === 0 ? (
        <div className="mt-8 max-w-xl border border-line bg-paper p-6">
          <h2 className="font-serif text-3xl">Nothing written yet</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Start a note, or import an mp3, m4a, or wav of a sermon. Long recordings should stay under 80 MB.
          </p>
        </div>
      ) : null}

      {ready && entries.length > 0 ? (
        <div className="mt-8 grid gap-8 md:grid-cols-[16rem_1fr]">
          <ul className="border-t border-line">
            {entries.map((entry) => {
              const selected = entry.id === active?.id;
              return (
                <li key={entry.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(entry.id)}
                    className={
                      selected
                        ? "flex min-h-11 w-full flex-col items-start bg-wash px-2 py-2 text-left"
                        : "flex min-h-11 w-full flex-col items-start px-2 py-2 text-left hover:bg-paper"
                    }
                  >
                    <span className="font-medium text-ink">{entry.title || "Untitled"}</span>
                    <span className="text-xs text-muted">
                      {entry.source === "sermon" ? "Sermon" : "Note"} ·{" "}
                      {new Date(entry.updatedAt).toLocaleDateString()}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          {active ? (
            <div>
              <label className="sr-only" htmlFor="journal-title">
                Title
              </label>
              <input
                id="journal-title"
                value={active.title}
                onChange={(event) => updateEntry(active.id, { title: event.target.value })}
                className="w-full bg-transparent font-serif text-3xl text-ink outline-none"
              />
              <label className="sr-only" htmlFor="journal-body">
                Notes
              </label>
              <textarea
                id="journal-body"
                value={active.body}
                onChange={(event) => updateEntry(active.id, { body: event.target.value })}
                rows={16}
                placeholder="What are you keeping from this reading?"
                className="mt-4 w-full resize-y rounded-md border border-line bg-paper px-3 py-3 text-sm leading-relaxed text-ink"
              />
              <Button
                tone="quiet"
                className="mt-2 px-1"
                onClick={() => {
                  removeEntry(active.id);
                  setActiveId(null);
                }}
              >
                Remove this entry
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
    </AppShell>
  );
}
