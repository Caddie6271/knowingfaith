import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StudyResult } from "@/lib/ai.functions";

export type TranslationId = "ESV" | "CSB";

export type ReadingCreds = {
  translation: TranslationId;
  esvToken: string;
  csbKey: string;
};

export type JournalEntry = {
  id: string;
  title: string;
  body: string;
  createdAt: number;
  updatedAt: number;
  source: "note" | "sermon";
};

export type MemoryCard = {
  id: string;
  ref: string;
  translation: TranslationId | "WEB";
  text: string;
  addedAt: number;
  dueAt: number;
  intervalDays: number;
  reps: number;
  lapses: number;
};

type StudyState = {
  ready: boolean;
  translation: TranslationId;
  esvToken: string;
  csbKey: string;
  cards: MemoryCard[];
  note: string;
  entries: JournalEntry[];
  answers: Record<string, StudyResult>;
  setReady: () => void;
  setTranslation: (translation: TranslationId) => void;
  setEsvToken: (token: string) => void;
  setCsbKey: (key: string) => void;
  setNote: (note: string) => void;
  addEntry: (entry: { title: string; body: string; source: JournalEntry["source"] }) => string;
  updateEntry: (id: string, patch: { title?: string; body?: string }) => void;
  removeEntry: (id: string) => void;
  addCard: (card: Omit<MemoryCard, "id" | "addedAt" | "dueAt" | "intervalDays" | "reps" | "lapses">) => boolean;
  removeCard: (id: string) => void;
  gradeCard: (id: string, remembered: boolean) => void;
  saveAnswer: (key: string, result: StudyResult) => void;
};

export function readingCreds(state: Pick<StudyState, "translation" | "esvToken" | "csbKey">): ReadingCreds {
  return { translation: state.translation, esvToken: state.esvToken, csbKey: state.csbKey };
}

export const useStudy = create<StudyState>()(
  persist(
    (set, get) => ({
      ready: false,
      translation: "ESV",
      esvToken: "",
      csbKey: "",
      cards: [],
      note: "",
      entries: [],
      answers: {},
      setReady: () => set({ ready: true }),
      setTranslation: (translation) => set({ translation }),
      setEsvToken: (esvToken) =>
        set({
          esvToken,
          translation: "ESV",
        }),
      setCsbKey: (csbKey) => set({ csbKey, translation: "ESV" }),
      setNote: (note) => set({ note }),
      addEntry: (entry) => {
        const id = crypto.randomUUID();
        const now = Date.now();
        const next: JournalEntry = {
          id,
          title: entry.title.trim().slice(0, 120) || "Untitled",
          body: entry.body.slice(0, 80_000),
          createdAt: now,
          updatedAt: now,
          source: entry.source,
        };
        set({ entries: [next, ...get().entries].slice(0, 40) });
        return id;
      },
      updateEntry: (id, patch) =>
        set({
          entries: get().entries.map((entry) =>
            entry.id === id
              ? {
                  ...entry,
                  title: patch.title != null ? patch.title.slice(0, 120) : entry.title,
                  body: patch.body != null ? patch.body.slice(0, 80_000) : entry.body,
                  updatedAt: Date.now(),
                }
              : entry,
          ),
        }),
      removeEntry: (id) => set({ entries: get().entries.filter((entry) => entry.id !== id) }),
      addCard: (card) => {
        const exists = get().cards.some(
          (item) => item.ref === card.ref && item.translation === card.translation,
        );
        if (exists) return false;
        const next: MemoryCard = {
          ...card,
          id: crypto.randomUUID(),
          addedAt: Date.now(),
          dueAt: Date.now(),
          intervalDays: 0,
          reps: 0,
          lapses: 0,
        };
        set({ cards: [next, ...get().cards].slice(0, 80) });
        return true;
      },
      removeCard: (id) => set({ cards: get().cards.filter((card) => card.id !== id) }),
      gradeCard: (id, remembered) => {
        set({
          cards: get().cards.map((card) => {
            if (card.id !== id) return card;
            if (!remembered) {
              return { ...card, reps: 0, lapses: card.lapses + 1, intervalDays: 0, dueAt: Date.now() };
            }
            const intervalDays = card.reps === 0 ? 1 : card.reps === 1 ? 3 : Math.min(60, Math.round(card.intervalDays * 2.2) || 7);
            return {
              ...card,
              reps: card.reps + 1,
              intervalDays,
              dueAt: Date.now() + intervalDays * 86_400_000,
            };
          }),
        });
      },
      saveAnswer: (key, result) => {
        const entries = Object.entries(get().answers);
        const next = [...entries.filter(([item]) => item !== key), [key, result] as const].slice(-12);
        set({ answers: Object.fromEntries(next) });
      },
    }),
    {
      name: "knowing-faith",
      version: 1,
      migrate: (persisted, version) => {
        const state = {
          ...(persisted as Record<string, unknown>),
        };
        if (version < 1 && typeof state.token === "string" && !state.esvToken) {
          state.esvToken = state.token;
        }
        delete state.token;
        if (state.translation !== "ESV") state.translation = "ESV";
        return state as {
          translation: TranslationId;
          esvToken: string;
          csbKey: string;
          cards: MemoryCard[];
          note: string;
          entries: JournalEntry[];
          answers: Record<string, StudyResult>;
        };
      },
      partialize: (state) => ({
        translation: state.translation,
        esvToken: state.esvToken,
        csbKey: state.csbKey,
        cards: state.cards,
        note: state.note,
        entries: state.entries,
        answers: state.answers,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setReady();
      },
    },
  ),
);

export function normalizeRecite(value: string): string {
  return value
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[^a-z0-9'\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
