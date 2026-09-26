import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// @ts-expect-error JS plugin alongside the TS vite config
import { grokPwaPlugin } from "./scripts/grok-pwa-plugin.mjs";

/**
 * Cloudflare Workers build. The default vite.config.ts stays on the Vercel
 * Nitro preset so the preview deploy is unchanged. Use:
 *   npm run build:cloudflare
 *   npm run deploy:cloudflare
 */
export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    grokPwaPlugin(),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
});
