# Antalya Camp – Landing Page (React)

A one-page information site for Antalya Camp in German and English, built with React + Vite.
It presents the project, why clubs should choose it, the services and the process.
It only shows information – enquiries go through the
main website (trainingslager-antalya.de).

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static files in dist/ – upload that folder to any web host
```

## Edit

- **All text (DE and EN):** `src/content.js` – change wording there, no component changes needed.
- **Links** (main website, contact, imprint): `LINKS` at the top of `src/content.js`.
- **Layout:** `src/components/Sections.jsx`, styles in `src/styles.css`.
- **Language:** DE/EN switch in the header. The choice is remembered and shown in the URL
  (`?lang=en`), so you can share a link to a specific language.

## Before publishing

- Replace the stock hero photo with a licensed photo.
- Have the "Why choose us" texts approved.
