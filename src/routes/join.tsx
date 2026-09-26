import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/button";
import { useStudy } from "@/lib/study-store";

export const Route = createFileRoute("/join")({ component: JoinPage });

function JoinPage() {
  const note = useStudy((state) => state.note);
  const setNote = useStudy((state) => state.setNote);
  const ready = useStudy((state) => state.ready);
  const [draft, setDraft] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const value = draft ?? (ready ? note : "");

  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-14">
        <p className="kicker">Membership</p>
        <h1 className="display-title mt-4 text-4xl text-ink">Not open yet.</h1>
        <p className="mt-6 text-lg leading-relaxed text-ink-soft">
          Knowing Faith will take a sign-in with Google or Microsoft, and then payment, when the reading room
          has been tested. Neither is turned on. Nothing on this page charges you.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <article className="border border-line bg-paper p-5">
            <p className="kicker">Now</p>
            <h2 className="mt-2 font-serif text-3xl">The reading room</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Read, compare, lexicon, and memory. Open to anyone using this preview. Your memory set and ESV
              token stay in this browser.
            </p>
          </article>
          <article className="border border-line bg-parchment p-5">
            <p className="kicker">Later</p>
            <h2 className="mt-2 font-serif text-3xl">Membership</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Sign in, then pay. The price will be set when checkout opens. Accounts are how a set of verses
              will be able to follow you off this device.
            </p>
          </article>
        </div>

        <fieldset disabled className="mt-10 border border-line p-5">
          <legend className="px-2 text-sm font-medium text-muted">Sign-in, after testing</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className="min-h-11 rounded-md border border-line bg-paper px-4 text-sm text-muted">
              Google · later
            </button>
            <button type="button" className="min-h-11 rounded-md border border-line bg-paper px-4 text-sm text-muted">
              Microsoft · later
            </button>
          </div>
          <p className="mt-3 text-sm text-muted">These stay closed on purpose. There is no checkout button yet.</p>
        </fieldset>

        <form
          className="mt-10"
          onSubmit={(event) => {
            event.preventDefault();
            setNote(value.trim());
            setSaved(true);
            setDraft(null);
          }}
        >
          <label className="text-sm font-medium" htmlFor="hope">
            What do you want to study first?
          </label>
          <textarea
            id="hope"
            value={value}
            onChange={(event) => {
              setDraft(event.target.value);
              setSaved(false);
            }}
            rows={4}
            className="mt-2 w-full rounded-md border border-line bg-paper px-3 py-3 text-sm"
            placeholder="A gospel, the psalms, a word you keep meeting…"
          />
          <div className="mt-3 flex items-center gap-3">
            <Button type="submit">Save on this device</Button>
            {saved ? <p className="text-sm text-brass-deep">Saved here. It isn’t an account yet.</p> : null}
          </div>
        </form>
      </main>
    </div>
  );
}
