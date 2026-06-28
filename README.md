# אחוזת סנדרין · Sandrine Events

A single-page luxury marketing site for **אחוזת סנדרין** — a premium event venue in northern
Israel. Hebrew, RTL, mobile-first. Built as a pitch demo.

## Quick start

```bash
npm install
npm run dev
```

Then open the printed local URL.

## Scripts

| script            | what it does                          |
| ----------------- | ------------------------------------- |
| `npm run dev`     | start the Vite dev server             |
| `npm run build`   | TypeScript typecheck + production build |
| `npm run preview` | preview the production build locally  |

## Stack

Vite · React 18 · TypeScript · Tailwind CSS · framer-motion · lucide-react

## Editing content

All copy lives in typed constants — no copy is hardcoded in JSX:

- `src/data/sections.ts` — nav, hero, about, garden, weddings, culinary, gallery, contact, footer
- `src/data/halls.ts` — the three halls (Palais / Chateau / Gallery)

See [`NOTES.md`](./NOTES.md) for design decisions and the two "swap later" items
(real photos + exact brand hex).
