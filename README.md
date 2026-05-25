# Packr — Marketing Site

The Packr homepage. Plain HTML + CSS, no build step. ~35KB total.

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
├── index.html          ← all markup (single file)
├── styles.css          ← all styling
├── vercel.json         ← Vercel config (cache headers)
├── README.md           ← this file
├── .gitignore
└── package.json        ← so Cursor recognizes it as a project
```

## Things to update before launch

- [ ] Replace the inline SVG favicon with a real `favicon.ico` / `favicon.svg`.
- [ ] Add a real `og.png` (1200×630) and reference it in `<meta property="og:image">`.
- [ ] Wire the "Book a Demo" button to a real form provider (Formspree, Tally, Cal.com). Currently it `mailto:`s `sales@packr.io`.
- [ ] Add `<meta name="robots">` and a `sitemap.xml` if you want SEO.
- [ ] Plug in analytics (Plausible, Fathom, Vercel Analytics — your call).

## Fonts

Loaded from Google Fonts via `<link>` in `index.html`. If you want to self-host them later, download from [fontsource.com](https://fontsource.com) and replace the `<link>`.
