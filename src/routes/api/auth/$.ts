import { createFileRoute } from "@tanstack/react-router";

// Cloudflare Workers cannot start the embedded auth database while a module
// loads (it throws and the whole site becomes a 500). Do not import
// `@/lib/auth/server` from this route until a real DATABASE_URL is attached.
function unavailable() {
  return Response.json({ error: "Sign-in is unavailable on this server." }, { status: 503 });
}

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: () => unavailable(),
      POST: () => unavailable(),
    },
  },
});
