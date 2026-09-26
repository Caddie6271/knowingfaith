import { fetchEsv } from "@/lib/esv.functions";
import { parseRef, type ParsedRef } from "@/lib/refs";
import type { ReadingCreds } from "@/lib/study-store";

export type Verse = { chapter: number; number: number; text: string };

export type Passage = {
  reference: string;
  book: string;
  translation: "ESV" | "CSB";
  verses: Verse[];
  notice?: string;
  warning?: string;
};

const sessionCache = new Map<string, Passage>();

export function connectedTranslation(creds: ReadingCreds): boolean {
  return creds.esvToken.trim().length > 0;
}

function cacheKey(input: string, creds: ReadingCreds): string {
  const secret = creds.esvToken;
  return `ESV:${input}:${secret.length}:${secret.slice(-4)}`;
}

export function parseMarkedVerses(raw: string, startChapter: number): Verse[] {
  const cleaned = raw.replace(/\s*\((?:ESV|CSB)\)\s*$/i, "").trim();
  const matches = [...cleaned.matchAll(/\[(\d+)\]\s*/g)];
  if (matches.length === 0) {
    const text = cleaned.replace(/^[^\n]+\n+/, "").replace(/\s+/g, " ").trim();
    return text ? [{ chapter: startChapter, number: 1, text }] : [];
  }
  const verses: Verse[] = [];
  let chapter = startChapter;
  let previous = 0;
  for (let index = 0; index < matches.length; index += 1) {
    const current = matches[index];
    if (!current || current.index == null) continue;
    const number = Number(current[1]);
    const start = current.index + current[0].length;
    const next = matches[index + 1];
    const end = next?.index ?? cleaned.length;
    const text = cleaned.slice(start, end).replace(/\s+/g, " ").trim();
    if (previous && number < previous) chapter += 1;
    previous = number;
    if (text) verses.push({ chapter, number, text });
  }
  return verses;
}

function trimToRequest(verses: Verse[], parsed: ParsedRef): Verse[] {
  return verses.filter((verse) => {
    if (verse.chapter < parsed.chapterStart || verse.chapter > parsed.chapterEnd) return false;
    if (verse.chapter === parsed.chapterStart && parsed.verseStart != null && verse.number < parsed.verseStart) {
      return false;
    }
    if (verse.chapter === parsed.chapterEnd && parsed.verseEnd != null && verse.number > parsed.verseEnd) {
      return false;
    }
    return true;
  });
}

export async function loadPassage(input: string, creds: ReadingCreds): Promise<Passage> {
  const parsed = parseRef(input);
  if (!connectedTranslation(creds)) {
    throw new Error("Add an ESV API token from Crossway.");
  }
  const hit = sessionCache.get(cacheKey(parsed.label, creds));
  if (hit) return hit;

  const esv = await fetchEsv({ data: { query: parsed.label, token: creds.esvToken.trim() } });
  if (!esv.ok) throw new Error(esv.error);
  const verses = trimToRequest(parseMarkedVerses(esv.raw, parsed.chapterStart), parsed).slice(0, 80);
  if (verses.length === 0) throw new Error("Crossway returned an empty passage.");
  const passage: Passage = {
    reference: esv.canonical || parsed.label,
    book: parsed.name,
    translation: "ESV",
    verses,
    notice: esv.notice,
  };
  sessionCache.set(cacheKey(parsed.label, creds), passage);
  return passage;
}

export function passageText(passage: Passage): string {
  return passage.verses.map((verse) => `${verse.chapter}:${verse.number} ${verse.text}`).join("\n");
}

export function verseKey(verse: Verse): string {
  return `${verse.chapter}:${verse.number}`;
}
