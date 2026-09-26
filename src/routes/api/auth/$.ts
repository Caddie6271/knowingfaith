import { createFileRoute } from "@tanstack/react-router";

async function handle(request: Request) {
  try {
    const { auth } = await import("@/lib/auth/server");
    return auth.handler(request);
  } catch (error) {
    console.error("[auth] request failed", error);
    return Response.json({ error: "Sign-in is unavailable on this server." }, { status: 503 });
  }
}

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: ({ request }) => handle(request),
      POST: ({ request }) => handle(request),
    },
  },
});
