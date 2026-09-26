import { createFileRoute } from "@tanstack/react-router";
import { SignInPanel } from "@/components/sign-in-panel";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-14 md:py-20">
        <p className="kicker">Register</p>
        <h1 className="mt-3 font-serif text-5xl text-ink">Sign in with Google.</h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
          The reading room stays open without an account. Sign in if you want one. Knowing Faith does not
          charge.
        </p>
        <div className="mt-10">
          <SignInPanel />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
