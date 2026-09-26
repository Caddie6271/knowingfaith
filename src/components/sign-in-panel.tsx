import { useState } from "react";
import { authEnabled, signIn } from "@/lib/auth/client";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export function SignInPanel() {
  const { user, isPending } = useCurrentUserState();
  const [error, setError] = useState("");

  if (user) {
    return (
      <div className="max-w-md">
        <p className="text-sm text-ink-soft">You are signed in. There is no charge.</p>
        <div className="mt-4">
          <UserButton />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md">
      {authEnabled ? (
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            setError("");
            void signIn("grok-google", { callbackURL: "/" }).catch((reason: unknown) => {
              setError(reason instanceof Error ? reason.message : "Sign-in didn’t open.");
            });
          }}
          className="inline-flex min-h-11 items-center rounded-md bg-brass-deep px-4 text-sm font-medium text-paper hover:bg-brass disabled:opacity-50"
        >
          Continue with Google
        </button>
      ) : (
        <p className="text-sm text-muted">Sign-in is not available in this session.</p>
      )}
      {error ? <p className="mt-3 text-sm text-muted">{error}</p> : null}
      <p className="mt-4 text-sm leading-relaxed text-muted">
        Microsoft sign-in is not available. There is no charge.
      </p>
    </div>
  );
}
