import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/button";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const ADDRESS = "hello@knowing.faith";

export const Route = createFileRoute("/contact")({ component: ContactPage });

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function send(event: FormEvent) {
    event.preventDefault();
    const body = `${message.trim()}\n\n— ${name.trim()}\n${email.trim()}`;
    const href = `mailto:${ADDRESS}?subject=${encodeURIComponent("Knowing Faith")}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
  }

  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-14 md:py-20">
        <p className="kicker">Contact</p>
        <h1 className="mt-3 font-serif text-5xl text-ink">Write to the desk.</h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
          A passage that will not open, a word in the lexicon, or a note about the reading room. This opens
          your mail to {ADDRESS}.
        </p>
        <form onSubmit={send} className="mt-10 max-w-xl space-y-4">
          <label className="block text-sm text-ink">
            Name
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-3 text-ink"
            />
          </label>
          <label className="block text-sm text-ink">
            Email
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-3 text-ink"
            />
          </label>
          <label className="block text-sm text-ink">
            Message
            <textarea
              required
              rows={7}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="mt-1 w-full resize-y rounded-md border border-line bg-paper px-3 py-3 text-sm leading-relaxed text-ink"
            />
          </label>
          <Button type="submit">Send</Button>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}
