import { createServerFn } from "@tanstack/react-start";

export type CompareQuestion = { prompt: string; aim: string };

export type StudyResult =
  | {
      kind: "compare";
      shared: string;
      observations: string[];
      questions: CompareQuestion[];
      pressure: string;
      nextReading: string;
    }
  | {
      kind: "memory";
      cues: string[];
      blankPrompt: string;
      checkQuestion: string;
    }
  | { kind: "followup"; answer: string; question: string }
  | { kind: "prose"; text: string };

type PassageInput = { reference: string; translation: string; text: string };

type AskInput = {
  mode: "compare" | "memory" | "followup";
  passages: PassageInput[];
  question?: string;
};

const stamps: number[] = [];

function allowCall(): boolean {
  const now = Date.now();
  while (stamps.length && now - stamps[0]! > 60_000) stamps.shift();
  if (stamps.length >= 12) return false;
  stamps.push(now);
  return true;
}

function asString(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function asStrings(value: unknown, maxItems: number, maxLen: number): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => asString(item, maxLen))
    .filter(Boolean)
    .slice(0, maxItems);
}

function parseResult(mode: AskInput["mode"], raw: string): StudyResult {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) return { kind: "prose", text: raw.trim() };
  let data: unknown;
  try {
    data = JSON.parse(raw.slice(start, end + 1));
  } catch {
    return { kind: "prose", text: raw.trim() };
  }
  if (!data || typeof data !== "object") return { kind: "prose", text: raw.trim() };
  const record = data as Record<string, unknown>;

  if (mode === "memory") {
    const cues = asStrings(record.cues, 4, 280);
    const blankPrompt = asString(record.blankPrompt, 400);
    const checkQuestion = asString(record.checkQuestion, 400);
    if (cues.length === 0 || !checkQuestion) return { kind: "prose", text: raw.trim() };
    return { kind: "memory", cues, blankPrompt, checkQuestion };
  }

  if (mode === "followup") {
    const answer = asString(record.answer, 1200);
    const question = asString(record.question, 400);
    if (!answer) return { kind: "prose", text: raw.trim() };
    return { kind: "followup", answer, question };
  }

  const questionsRaw = Array.isArray(record.questions) ? record.questions : [];
  const questions = questionsRaw
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      const prompt = asString(row.prompt, 320);
      const aim = asString(row.aim, 220);
      if (!prompt) return null;
      return { prompt, aim };
    })
    .filter((item): item is CompareQuestion => item != null)
    .slice(0, 5);

  const shared = asString(record.shared, 500);
  const observations = asStrings(record.observations, 4, 320);
  const pressure = asString(record.pressure, 500);
  const nextReading = asString(record.nextReading, 80);
  if (!shared && observations.length === 0 && questions.length === 0) {
    return { kind: "prose", text: raw.trim() };
  }
  return { kind: "compare", shared, observations, questions, pressure, nextReading };
}

function systemPrompt(mode: AskInput["mode"]): string {
  const shared = [
    "You are the reading companion inside Knowing Faith, a Scripture study app.",
    "Use only the passage text supplied in the user message. Do not quote other verses as if they were on the page.",
    "Do not invent wording, verse numbers, or manuscript details.",
    "Do not correct the supplied translation into another one.",
    "Do not reprint the passage. Refer to verse numbers.",
    "Be brief, concrete, and reverent. No sermon.",
    "If the question is not answered by these words, say so.",
    "Respond with JSON only.",
  ];
  if (mode === "memory") {
    return [
      ...shared,
      'Shape: {"cues": string[3], "blankPrompt": string, "checkQuestion": string}.',
      "cues help someone recall the sense without giving the missing words away.",
      "blankPrompt is one sentence telling them which idea to say back in their own words.",
      "checkQuestion asks what the verse itself claims, not a trivia fact from outside it.",
    ].join(" ");
  }
  if (mode === "followup") {
    return [
      ...shared,
      'Shape: {"answer": string, "question": string}.',
      "answer is at most two short paragraphs.",
      "question sends them back to a specific phrase in the supplied text.",
    ].join(" ");
  }
  return [
    ...shared,
    'Shape: {"shared": string, "observations": string[3], "questions": [{"prompt": string, "aim": string}], "pressure": string, "nextReading": string}.',
    "questions (four of them) must force a return to repeated words, actors, and changes between the passages.",
    "aim is one short clause saying what the question is trying to notice.",
    "pressure is where the passages push on each other, or where one passage presses the reader.",
    "nextReading is one reference worth opening next, or an empty string if you are not sure.",
  ].join(" ");
}

export const askStudy = createServerFn({ method: "POST" })
  .validator((input: AskInput) => {
    const mode = input?.mode;
    if (mode !== "compare" && mode !== "memory" && mode !== "followup") {
      throw new Error("Unknown study request.");
    }
    const passages = Array.isArray(input.passages) ? input.passages.slice(0, 2) : [];
    if (passages.length === 0) throw new Error("Open a passage first.");
    const clean = passages.map((passage) => {
      const reference = typeof passage?.reference === "string" ? passage.reference.trim().slice(0, 80) : "";
      const translation =
        typeof passage?.translation === "string" ? passage.translation.trim().slice(0, 12) : "";
      const text = typeof passage?.text === "string" ? passage.text.trim().slice(0, 4500) : "";
      if (!reference || !text) throw new Error("A passage was missing its text.");
      return { reference, translation, text };
    });
    const question = typeof input.question === "string" ? input.question.trim().slice(0, 400) : "";
    return { mode, passages: clean, question };
  })
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "Study questions aren’t available in this session." };
    }
    if (!allowCall()) {
      return {
        ok: false as const,
        error: "Too many questions in a short span. Read what you have, then ask again in a minute.",
      };
    }

    const body = data.passages
      .map(
        (passage) =>
          `PASSAGE ${passage.reference} (${passage.translation || "unknown"})\n${passage.text}`,
      )
      .join("\n\n");
    const user = data.question
      ? `${body}\n\nReader's question: ${data.question}`
      : body;

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        temperature: 0.4,
        max_tokens: 700,
        messages: [
          { role: "system", content: systemPrompt(data.mode) },
          { role: "user", content: user },
        ],
      }),
    });

    if (!res.ok) {
      return { ok: false as const, error: `The study companion returned ${res.status}.` };
    }
    const payload = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = payload.choices?.[0]?.message?.content?.trim() ?? "";
    if (!text) return { ok: false as const, error: "The study companion sent an empty reply." };
    return { ok: true as const, result: parseResult(data.mode, text) };
  });
