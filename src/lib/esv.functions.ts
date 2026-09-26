import { createServerFn } from "@tanstack/react-start";

const ESV_NOTICE =
  "Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®), © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved. The ESV text may not be quoted in any publication made available to the public by a Creative Commons license. The ESV may not be translated in whole or in part into any other language.";

type EsvInput = { query: string; token: string };

export const fetchEsv = createServerFn({ method: "POST" })
  .validator((input: EsvInput) => {
    const query = typeof input?.query === "string" ? input.query.trim() : "";
    const token = typeof input?.token === "string" ? input.token.trim() : "";
    if (!query || query.length > 120) throw new Error("That reference is too long.");
    if (!token || token.length > 200 || /\s/.test(token)) {
      throw new Error("The ESV token doesn’t look right.");
    }
    return { query, token };
  })
  .handler(async ({ data }) => {
    const url = new URL("https://api.esv.org/v3/passage/text/");
    url.searchParams.set("q", data.query);
    url.searchParams.set("include-headings", "false");
    url.searchParams.set("include-footnotes", "false");
    url.searchParams.set("include-footnote-body", "false");
    url.searchParams.set("include-verse-numbers", "true");
    url.searchParams.set("include-short-copyright", "false");
    url.searchParams.set("include-passage-references", "true");
    url.searchParams.set("include-first-verse-numbers", "true");
    url.searchParams.set("indent-poetry", "false");

    const res = await fetch(url, {
      headers: { Authorization: `Token ${data.token}` },
    });
    if (res.status === 401 || res.status === 403) {
      return {
        ok: false as const,
        error: "Crossway refused that token. Check the application at api.esv.org.",
      };
    }
    if (!res.ok) {
      return {
        ok: false as const,
        error: `Crossway returned ${res.status}. The passage was not loaded.`,
      };
    }
    const body = (await res.json()) as { canonical?: string; passages?: string[] };
    const raw = body.passages?.[0]?.trim() ?? "";
    if (!raw) {
      return { ok: false as const, error: "Crossway returned an empty passage." };
    }
    return {
      ok: true as const,
      canonical: body.canonical?.trim() || data.query,
      raw,
      notice: ESV_NOTICE,
    };
  });
