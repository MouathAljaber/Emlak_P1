# Trainingslager Antalya

Full-stack enquiry website for football training camps.

## Stack

- Frontend: responsive HTML/CSS/JavaScript landing page with German/English UI
- Backend: Node.js 20 + Express
- Database: MySQL 8
- Email: SMTP via Nodemailer
- Admin: API-key protected enquiry dashboard at `/admin.html`
- Security: Helmet with a strict Content Security Policy, rate-limited and honeypot-protected enquiry endpoint, timing-safe admin key check
- Product positioning: B2B football training camps for youth teams, amateur clubs, senior teams, academies, and professional teams
- Conversion sections: team categories, services, facilities and hotels, test matches, planning guides, references, FAQ, and a five-step offer request

## Run locally

1. Install Node.js 20+ and Docker.
2. Start MySQL:

   ```sh
   docker compose up -d mysql
   ```

3. Configure the app:

   ```sh
   cp .env.example .env
   ```

   Set a strong `ADMIN_API_KEY`. SMTP variables are required for email notifications and can be left blank while testing the form.

4. Install and start:

   ```sh
   npm install
   npm start
   ```

   Open [http://localhost:3000](http://localhost:3000). The database table is created automatically on startup.

5. Open `/admin.html`, enter `ADMIN_API_KEY`, and load enquiries.

## Editing the website

- **Homepage** (`/` and `/en/`): edit `src/home.template.html` for layout and `src/de.json` / `src/en.json` for text, then run `npm run build`. Do not edit `index.html` or `en/index.html` directly; they are generated.
- **Content pages** (`/youth-teams/`, `/en/faq/`, …): edit the page content directly. The shared header and footer between the `<!-- site-header -->` / `<!-- site-footer -->` markers are rewritten by `npm run build` (change them in `scripts/build.mjs`).
- **Styles and behaviour:** `site.css` (one design system for all pages), `site.js` (menu, cookie consent, analytics, mobile CTA), `home.js` (enquiry form), `admin.js` (dashboard).

The site runs without MySQL: pages are served and the form shows a friendly error until the database is reachable (the server retries every 15 seconds).

## Receiving applications by email

Every form submission is emailed to `ADMIN_EMAIL`, with the applicant set as Reply-To so you can answer directly. The applicant receives a confirmation copy in the language of the page they used. Fill these in `.env` and restart the server:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=you@gmail.com
SMTP_PASSWORD=your-16-character-app-password
SMTP_FROM="Antalya Camp <you@gmail.com>"
ADMIN_EMAIL=you@gmail.com
```

For Gmail, create an App password (Google Account → Security → 2-Step Verification → App passwords); your normal password will not work. On startup the server logs `Email ready: applications will be sent to …` when the settings work. MySQL is optional: when it is running, applications are also stored and visible in `/admin.html`. A submission only fails if it can be neither emailed nor saved.

## API

- `GET /api/health` checks the API and database connection.
- `POST /api/enquiries` validates and stores a new enquiry, then sends an admin notification and applicant confirmation when SMTP is configured.
- `GET /api/admin/enquiries` lists the latest 200 enquiries and requires `x-admin-key`.
- `PATCH /api/admin/enquiries/:id` updates an enquiry status (`new`, `contacted`, or `closed`) and requires `x-admin-key`.

## Production configuration

Set `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`, `ADMIN_API_KEY`, and all `SMTP_*`/`ADMIN_EMAIL` values in the hosting provider's secret environment variables. Do not commit `.env`. Use a managed MySQL database and enable HTTPS at the hosting layer.

## MySQL Workbench

Connect with:

- Connection method: Standard TCP/IP
- Hostname: `127.0.0.1`
- Port: `3306`
- Username: `root`
- Password: leave blank for this local development install
- Default schema: `trainingslager`

The enquiries table is `trainingslager.enquiries`.

## SEO and analytics launch checklist

1. Set `PUBLIC_SITE_URL` to the canonical production URL (used by the server and by `npm run build`).
2. Create a GA4 web data stream and set its Measurement ID in `GA4_MEASUREMENT_ID`. Analytics loads only after cookie consent.
3. Add the site in Google Search Console, set the verification token in `GOOGLE_SITE_VERIFICATION`, deploy, and submit `/sitemap.xml`.
4. Configure HTTPS, SMTP, a managed MySQL instance, and a strong `ADMIN_API_KEY` before launch.
5. Add licensed WebP/AVIF photos and videos with descriptive `alt` text when the final media is supplied. The page exposes semantic headings, metadata, Open Graph/Twitter previews, hreflang, Organization/Brand/SportsActivityLocation/FAQ JSON-LD, canonical URL, robots.txt, and sitemap.xml.
