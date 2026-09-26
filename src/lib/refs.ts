import { CANON, type CanonBook } from "@/data/canon";

export type ParsedRef = {
  osis: string;
  name: string;
  chapterStart: number;
  verseStart: number | null;
  chapterEnd: number;
  verseEnd: number | null;
  label: string;
};

const ALIAS = new Map<string, CanonBook>();
for (const book of CANON) {
  for (const alias of book.aliases) {
    if (!ALIAS.has(alias)) ALIAS.set(alias, book);
  }
}

function bookKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function dash(value: string): string {
  return value.replace(/[–—]/g, "-");
}

export function formatLabel(
  name: string,
  chapterStart: number,
  verseStart: number | null,
  chapterEnd: number,
  verseEnd: number | null,
): string {
  if (verseStart == null) {
    if (chapterStart === chapterEnd) return `${name} ${chapterStart}`;
    return `${name} ${chapterStart}–${chapterEnd}`;
  }
  if (chapterStart === chapterEnd) {
    if (verseEnd == null || verseEnd === verseStart) return `${name} ${chapterStart}:${verseStart}`;
    return `${name} ${chapterStart}:${verseStart}–${verseEnd}`;
  }
  const endVerse = verseEnd ?? verseStart;
  return `${name} ${chapterStart}:${verseStart}–${chapterEnd}:${endVerse}`;
}

export function parseRef(input: string): ParsedRef {
  const trimmed = dash(input).trim();
  if (!trimmed) throw new Error("Enter a reference, like John 1:1–5.");

  const match = trimmed.match(/^(.+?)\s+(\d+)(?::(\d+))?(?:\s*-\s*(\d+)(?::(\d+))?)?$/);
  let bookPart = trimmed;
  let chapterStart = 1;
  let verseStart: number | null = null;
  let chapterEnd = 1;
  let verseEnd: number | null = null;

  if (match?.[1] && match[2]) {
    bookPart = match[1];
    chapterStart = Number(match[2]);
    chapterEnd = chapterStart;
    verseStart = match[3] ? Number(match[3]) : null;
    const tail = match[4] ? Number(match[4]) : null;
    const tailVerse = match[5] ? Number(match[5]) : null;
    if (verseStart == null && tail != null && tailVerse == null) {
      chapterEnd = tail;
    } else if (verseStart != null && tail != null && tailVerse == null) {
      verseEnd = tail;
    } else if (verseStart != null && tail != null && tailVerse != null) {
      chapterEnd = tail;
      verseEnd = tailVerse;
    } else if (verseStart != null) {
      verseEnd = verseStart;
    }
  }

  const book = ALIAS.get(bookKey(bookPart));
  if (!book) throw new Error(`“${bookPart.trim()}” isn’t a book I recognize.`);
  if (chapterStart < 1 || chapterStart > book.chapters) {
    throw new Error(`${book.name} has ${book.chapters} ${book.chapters === 1 ? "chapter" : "chapters"}.`);
  }
  if (chapterEnd < chapterStart || chapterEnd > book.chapters) {
    throw new Error("That chapter range doesn’t fit this book.");
  }
  if (
    verseStart != null &&
    verseEnd != null &&
    chapterStart === chapterEnd &&
    verseEnd < verseStart
  ) {
    throw new Error("That verse range goes backwards.");
  }

  return {
    osis: book.osis,
    name: book.name,
    chapterStart,
    verseStart,
    chapterEnd,
    verseEnd,
    label: formatLabel(book.name, chapterStart, verseStart, chapterEnd, verseEnd),
  };
}

export function bookByOsis(osis: string): CanonBook | undefined {
  return CANON.find((book) => book.osis === osis);
}
