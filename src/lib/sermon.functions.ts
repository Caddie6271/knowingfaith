import { createServerFn } from "@tanstack/react-start";

const MAX_BYTES = 80 * 1024 * 1024;

type Word = { text?: string; speaker?: number };

function paragraphs(text: string): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return "";
  const sentences = clean.split(/(?<=[.!?])\s+/);
  const blocks: string[] = [];
  let buf: string[] = [];
  for (const sentence of sentences) {
    buf.push(sentence);
    if (buf.length >= 4) {
      blocks.push(buf.join(" "));
      buf = [];
    }
  }
  if (buf.length) blocks.push(buf.join(" "));
  return blocks.join("\n\n").slice(0, 80_000);
}

function fromWords(words: Word[]): string {
  const speakers = new Set(words.map((word) => word.speaker).filter((speaker) => speaker != null));
  if (speakers.size <= 1) {
    return paragraphs(words.map((word) => word.text ?? "").join(" "));
  }
  const blocks: string[] = [];
  let speaker: number | undefined;
  let line: string[] = [];
  const flush = () => {
    const text = paragraphs(line.join(" "));
    if (!text) return;
    blocks.push(speaker == null ? text : `Speaker ${speaker + 1}\n${text}`);
    line = [];
  };
  for (const word of words) {
    const text = word.text?.trim();
    if (!text) continue;
    if (line.length && word.speaker !== speaker) flush();
    speaker = word.speaker;
    line.push(text);
  }
  flush();
  return blocks.join("\n\n").slice(0, 80_000);
}

export const transcribeSermon = createServerFn({ method: "POST" })
  .validator((form: FormData) => {
    const file = form.get("audio");
    if (!(file instanceof File)) throw new Error("Choose an audio file.");
    const name = file.name || "sermon";
    const audio =
      file.type.startsWith("audio/") ||
      file.type === "video/mp4" ||
      /\.(mp3|m4a|wav|ogg|webm|mp4|aac|flac)$/i.test(name);
    if (!audio) throw new Error("Use an audio file, such as mp3, m4a, or wav.");
    if (file.size < 1000) throw new Error("That recording looks empty.");
    if (file.size > MAX_BYTES) throw new Error("Keep the sermon under 80 MB.");
    return form;
  })
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "Transcription isn’t available in this session." };
    }
    const file = data.get("audio");
    if (!(file instanceof File)) {
      return { ok: false as const, error: "Choose an audio file." };
    }

    const body = new FormData();
    body.set("file", file, file.name || "sermon.mp3");
    body.set("model", "grok-voice-transcribe-2.0");
    body.set("language", "en");
    body.set("diarize", "true");

    let res: Response;
    try {
      res = await fetch("https://api.x.ai/v1/stt", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}` },
        body,
      });
    } catch {
      return { ok: false as const, error: "The transcription service could not be reached." };
    }
    if (!res.ok) {
      return { ok: false as const, error: `Transcription returned ${res.status}.` };
    }

    let payload: { text?: string; words?: Word[] };
    try {
      payload = (await res.json()) as { text?: string; words?: Word[] };
    } catch {
      return { ok: false as const, error: "The transcript came back unreadable." };
    }

    const text =
      payload.words && payload.words.length > 0
        ? fromWords(payload.words)
        : paragraphs(typeof payload.text === "string" ? payload.text : "");
    if (!text) return { ok: false as const, error: "The recording produced an empty transcript." };
    return { ok: true as const, text };
  });
