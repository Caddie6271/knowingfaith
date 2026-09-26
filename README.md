# Knowing Faith

A reading room for Scripture. Compare passages, look up Greek and Hebrew words, and keep verses by heart. The site is [knowing.faith](https://knowing.faith).

The English text is not in this repository. Connect your own key in the reading room:

- **ESV** — free non-commercial token from [api.esv.org](https://api.esv.org/)

Sign-in and payment are not turned on yet.

## Run it

```bash
npm install
npm run dev
```

The app listens on port 8080.

## Cloudflare

Production for knowing.faith is a Cloudflare Worker. From this folder, after `npx wrangler login`:

```bash
npm run deploy:cloudflare
```

In the Cloudflare dashboard, open the `knowing-faith` worker and add the custom domain `knowing.faith`. For the study questions, set the secret `XAI_API_KEY` (`npx wrangler secret put XAI_API_KEY`). The ESV token stays in the browser.

