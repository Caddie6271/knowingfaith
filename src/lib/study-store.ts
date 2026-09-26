import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StudyResult } from "@/lib/ai.functions";

export type TranslationId = "ESV" | "CSB";

export type ReadingCreds = {
  translation: TranslationId;
  esvToken: string;
  csbKey: string;
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
  answers: Record<string, StudyResult>;
  setReady: () => void;
  setTranslation: (translation: TranslationId) => void;
  setEsvToken: (token: string) => void;
  setCsbKey: (key: string) => void;
  setNote: (note: string) => void;
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
      answers: {},
      setReady: () => set({ ready: true }),
      setTranslation: (translation) => set({ translation }),
      setEsvToken: (esvToken) =>
        set({
          esvToken,
          translation: esvToken.trim() ? "ESV" : get().csbKey.trim() ? "CSB" : "ESV",
        }),
      setCsbKey: (csbKey) =>
        set({
          csbKey,
          translation: csbKey.trim() ? "CSB" : get().esvToken.trim() ? "ESV" : get().translation,
        }),
      setNote: (note) => set({ note }),
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
        if (state.translation !== "ESV" && state.translation !== "CSB") {
          state.translation = state.csbKey && !state.esvToken ? "CSB" : "ESV";
        }
        return state as {
          translation: TranslationId;
          esvToken: string;
          csbKey: string;
          cards: MemoryCard[];
          note: string;
          answers: Record<string, StudyResult>;
        };
      },
      partialize: (state) => ({
        translation: state.translation,
        esvToken: state.esvToken,
        csbKey: state.csbKey,
        cards: state.cards,
        note: state.note,
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
