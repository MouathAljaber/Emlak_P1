# Trainingslager Antalya

Frontend-only website for football training camps.

## Stack

- Frontend: responsive HTML/CSS/JavaScript landing page with German/English UI
- Static hosting: HTML, CSS and JavaScript
- Optional local preview: dependency-free Node.js server
- Form: five-step offer request, validated in the browser and again on the server; sent by email through Resend (Cloudflare Worker)
- Product positioning: B2B football training camps for youth teams, amateur clubs, senior teams, academies, and professional teams
- Conversion sections: team categories, services, facilities and hotels, test matches, planning guides, references, FAQ, and a five-step offer request

## Run locally

1. Install Node.js 20+.
2. Install dependencies:

   ```sh
   npm install
   npm start
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Editing the website

- **Homepage** (`/` and `/en/`): edit `src/home.template.html` for layout and `src/de.json` / `src/en.json` for text, then run `npm run build`. Do not edit `index.html` or `en/index.html` directly; they are generated.
- **Content pages** (`/youth-teams/`, `/en/faq/`, …): edit the page content directly. The shared header and footer between the `<!-- site-header -->` / `<!-- site-footer -->` markers are rewritten by `npm run build` (change them in `scripts/build.mjs`).
- **Styles and behaviour:** `site.css`, `site.js` and `home.js`.
- **Form:** `POST /api/offer` handled by `worker.js` / `lib/offer.js` (also served by `server.js` locally). Needs the `RESEND_API_KEY` secret and `NOTIFY_EMAIL` (see `wrangler.jsonc`, `.env.example`).
- **Guides:** long-form pages live in `scripts/guides.mjs`; `npm run build` generates them (DE + EN).
- **Deploy:** `npm run build && npx wrangler deploy` (Worker name `emlak-p1`, static assets plus the form endpoint).

## SEO and analytics launch checklist

1. Set `PUBLIC_SITE_URL` to the canonical production URL (used by the server and by `npm run build`).
2. Create a GA4 web data stream and set its Measurement ID in `GA4_MEASUREMENT_ID`. Analytics loads only after cookie consent.
3. Add the site in Google Search Console, set the verification token in `GOOGLE_SITE_VERIFICATION`, deploy, and submit `/sitemap.xml`.
4. Deploy with Cloudflare Workers. Set `RESEND_API_KEY` with `npx wrangler secret put RESEND_API_KEY`; verify a domain in Resend to email customers other than the account owner.
5. Add licensed WebP/AVIF photos and videos with descriptive `alt` text when the final media is supplied. The page exposes semantic headings, metadata, Open Graph/Twitter previews, hreflang, Organization/Brand/SportsActivityLocation/FAQ JSON-LD, canonical URL, robots.txt, and sitemap.xml.
