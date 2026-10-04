# Bento — food diary

A private, installable food diary (PWA). Plain HTML, CSS and JavaScript; no framework, no backend, no accounts.

## Put it on GitHub Pages

1. On github.com create a new **public** repository (for example `Bento`).
2. Open the repository, choose **Add file → Upload files**, and drag in *everything inside this folder* (the files and the folders `css`, `js`, `data`, `fonts`, `icons`, `vendor`). Commit.
3. Go to **Settings → Pages**, set **Source: Deploy from a branch**, **Branch: main**, folder **/ (root)**, and save.
4. After a minute or two the app is live at `https://<your-username>.github.io/<repository-name>/`.
5. Open that address in Chrome on Android, then menu **⋮ → Install app** (or More → Install on this phone inside the app).

## Updating

Upload changed files over the old ones. The app picks up new versions of its own files the second time it is opened after an update.
If you ever replace `data/foods.json` or anything in `vendor/`, also change `VERSION` at the top of `sw.js` (for example to `bento-v2`).

## What is where

- `index.html`, `css/app.css` — page and styling
- `js/core.js` — nutrients, storage, calculations; `js/app.js` — screens; `js/scan.js` — barcode and label scanning
- `data/foods.json` — built-in foods (USDA Standard Reference, release 28, public domain)
- `vendor/` — Tesseract.js (label reading, Apache-2.0) and ZXing (barcode fallback, Apache-2.0)
- `fonts/` — Bricolage Grotesque (SIL Open Font Licence)
- `sw.js`, `manifest.webmanifest`, `icons/` — offline support and installation

Barcode lookups use Open Food Facts (Open Database Licence) and need a connection.
