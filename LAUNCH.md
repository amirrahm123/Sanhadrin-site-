# אחוזת סנדרין — Launch checklist

Multi-page, SSG, SEO- and tracking-ready site. Stack unchanged: **Vite + React 18
+ TypeScript + Tailwind + framer-motion**, with build-time static generation via
**vite-react-ssg** and routing via **react-router-dom**.

```bash
npm install
npm run dev      # local dev (CSR)
npm run build    # tsc + vite-react-ssg (pre-render) + sitemap/robots
npm run preview  # serve the built dist/
```

Every route pre-renders to standalone HTML in `dist/` with its own
title / description / canonical / OG tags and a single `<h1>`.

## 1. Fill in these placeholders before go-live

All launch values live in **one file: [`src/data/site.ts`](src/data/site.ts)**
(except the two snippets baked into `index.html`, noted below).

| What | Where | Current placeholder |
| --- | --- | --- |
| **Domain** (canonical, OG, sitemap) | `SITE.url` in `src/data/site.ts` | `https://REPLACE-WITH-DOMAIN.com` |
| **GTM container id** | `index.html` (head + noscript) **and** `SITE.gtmId` | `GTM-XXXXXXX` |
| **GA4 measurement id** | configured **inside GTM**; ref in `SITE.ga4Id` | `G-XXXXXXXXXX` |
| **Search Console token** | `index.html` `<meta name="google-site-verification">` **and** `SITE.searchConsoleToken` | `REPLACE_WITH_SEARCH_CONSOLE_TOKEN` |
| **Web3Forms access key** | `SITE.web3formsKey` | `REPLACE_WITH_WEB3FORMS_KEY` |
| **Geo coordinates** (JSON-LD) | `SITE.geo` (currently `null`) | not set — do **not** guess |
| **Social share image** | `public/og-image.svg` → replace with real `og-image.jpg` and update `SITE.ogImage` | branded SVG placeholder |
| ~~**Sister-brand link**~~ ✅ done | `Footer.tsx` (`FOOTER.crossLink`) | `https://www.glory-wedding.com` |
| **Accessibility statement** | `Footer.tsx` (`FOOTER.accessibility`, `href="#"`) | `#` |

> The GTM id and Search Console token appear in `index.html` because they must
> load as early/raw HTML. Keep `SITE.gtmId` / `SITE.searchConsoleToken` in sync
> for reference. Everything else is driven from `site.ts`.

### Web3Forms (contact form)
1. Register **morvsandrine@gmail.com** at <https://web3forms.com> and copy the
   access key into `SITE.web3formsKey`.
2. The form posts JSON to `https://api.web3forms.com/submit`; Web3Forms forwards
   submissions to that email. **The email is never shown on the site.**
3. Until the real key is set, submissions return a friendly error that points
   visitors to phone / WhatsApp.

### GA4 through GTM
GA4 is intended to run **inside** the GTM container (create a GA4 Configuration
tag in GTM using the `G-XXXXXXXXXX` id). A direct gtag snippet is left commented
out in `index.html` if you ever want a second, direct tag instead.

## 2. Confirmed business data (already wired)
In [`src/data/sections.ts`](src/data/sections.ts) `CONTACT`:
- Phone `04-622-2221` → `tel:+97246222221`
- WhatsApp `972526222221` (prefilled Hebrew message)
- Address `מתחם רגבה (BIG רגבה), רגבה 26814`
- Hours: ראשון–חמישי 10:00–21:30 · שישי 09:30–13:00 · שבת סגור
- Google Business: <https://maps.app.goo.gl/VDUEPkBFPHHQYibn8>

## 3. Routes
`/` · `/about` · `/weddings` · `/bar-bat-mitzvah` · `/henna` · `/halls` ·
`/culinary` · `/gallery` (+ pre-rendered `404.html`).

There is **no `/contact` page** — the contact form lives in the global footer
(`id="contact-form"`); "צור קשר" and the "לתיאום סיור" CTAs smooth-scroll to it.
Bar & Bat Mitzvah share one page, `/bar-bat-mitzvah`.

Edit per-page SEO text in [`src/data/seo.ts`](src/data/seo.ts). To add a page:
add a route in `src/routes.tsx` **and** an entry in `seo.ts` with the same path.

> **Assumption:** *חינות יוקרתיות* is treated as **henna** (חינה) ceremonies
> (`/henna`). If the client meant something else, adjust `HENNA` in `sections.ts`
> and the `/henna` SEO entry.

## 4. Hosting (Vercel)
- Framework preset: **Vite**. Build `npm run build`, output `dist/`.
- `vercel.json` sets `cleanUrls` (serves `/about` from `about.html`) and
  `trailingSlash: false`. Vercel serves `dist/404.html` for unknown paths.

## 5. Pre-launch verification
- [ ] Set all placeholders in §1, then `npm run build`.
- [ ] `dist/robots.txt` allows all and points to `‹domain›/sitemap.xml`; no stray `Disallow`.
- [ ] `dist/sitemap.xml` lists all 10 pages with the real domain.
- [ ] View-source each route: unique `<title>`, meta description, one `<h1>`, correct `<link rel="canonical">`; no `noindex`.
- [ ] Paste a page URL into the [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) — OG image/title/description preview correctly (also test a WhatsApp share).
- [ ] Rich Results / Schema test on the homepage — LocalBusiness parses (add `SITE.geo` for the map pin).
- [ ] Submit `sitemap.xml` in Google Search Console; confirm indexing over the following days.
- [ ] In GTM Preview, confirm `phone_click`, `whatsapp_click` and `form_submit` reach the dataLayer.
- [ ] Send a real test submission and confirm it arrives at morvsandrine@gmail.com.
- [ ] Run Lighthouse (mobile) — aim for green Performance/SEO/Best-Practices/Accessibility.

## 6. Replacing placeholder images
Photos are `ImagePlaceholder` components. To use a real photo, pass `src` (and a
meaningful Hebrew `alt`); the component already sets `loading="lazy"`
(hero is `eager`), intrinsic `width`/`height` (no layout shift) and
`decoding="async"`. **Export photos as compressed `webp`/`avif` at the right
size.** No sliders/carousels are used — the gallery is a static responsive grid.
