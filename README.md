# Packr — Marketing Site

The Packr marketing site. Plain HTML + CSS + a small shared JS file, no build step.

## Edit it

Open `index.html` in your browser to see it (just double-click). Edit `index.html` for content/markup, `styles.css` for visuals.

## Run locally with Cursor

1. Open this folder in **Cursor**.
2. Right-click `index.html` → **Open with Live Server** (install the Live Server extension if you don't have it).
   *Or:* run `npx serve` in the folder for a quick local preview at `http://localhost:3000`.
3. Edit. Save. Refresh.

Cursor's AI will work on this file directly — ask it to change copy, add sections, swap colors, etc.

## Deploy to Vercel

### One-time setup

1. **Create a GitHub repo:**
   - In Cursor, open the Source Control panel (Cmd+Shift+G).
   - Click "Initialize Repository", then "Publish to GitHub". Pick public or private.
2. **Connect to Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new) and sign in with GitHub.
   - Import the repo you just published.
   - Framework preset: **Other** (Vercel auto-detects static HTML).
   - Click **Deploy**. You'll get a `*.vercel.app` URL in ~30 seconds.
3. **Point packr.io at Vercel:**
   - In your Vercel project → **Settings → Domains** → add `packr.io`.
   - Vercel shows you DNS records to add at your domain registrar (an A record, usually `76.76.21.21`, plus a CNAME for `www`).
   - Add those records, wait ~5 min for DNS, done.

### Going forward

Edit a file in Cursor → commit + push to GitHub → Vercel auto-deploys in ~30 seconds. Every push creates a preview URL too, so you can preview branches before merging.

## File map

```
packr-site/
├── index.html          ← homepage (deck-aligned narrative)
├── pricing.html        ← /pricing (interactive calculator)
├── schedule-demo.html  ← /schedule-demo (auto-opens Calendly)
├── styles.css          ← all styling (design tokens in :root)
├── site.js             ← shared nav / Calendly popup / scroll reveal / parallax
├── vercel.json         ← Vercel config (cleanUrls + cache headers)
├── assets/             ← logo PNGs
│   └── screens/        ← product screenshots (see its README for the manifest)
├── README.md           ← this file
├── .gitignore
└── package.json        ← dev scripts (npm run dev)
```

**Cache-busting:** `styles.css` and `site.js` are served with 1-year
immutable caching — every reference uses a `?v=N` query string. Bump it
whenever you edit either file.

## Things to update before launch

- [ ] Drop real product screenshots into `assets/screens/` (see `assets/screens/README.md` for exact filenames + sizes). Placeholder frames render until then.
- [ ] Add a real `og-home.png` (1200×630) to `assets/screens/` and swap the `og:image` meta on `index.html`.
- [ ] Add a `sitemap.xml` / `robots.txt` if you want SEO.
- [ ] Plug in analytics (Plausible, Fathom, Vercel Analytics — your call).

## Fonts

Loaded from Google Fonts via `<link>` in `index.html`. If you want to self-host them later, download from [fontsource.com](https://fontsource.com) and replace the `<link>`.
