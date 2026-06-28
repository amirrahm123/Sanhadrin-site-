# NOTES — אחוזת סנדרין marketing site

Design + implementation decisions, and the known "swap later" items.

## Swap-later items (intentional)

1. **Real photography** — every image is a designed `<ImagePlaceholder>` (soft stone/cream
   or dark-emerald gradient, faint Roman-arch/aqueduct motif, italic caption). To use a real
   photo, pass `src` (and `alt`): `<ImagePlaceholder src="/img/garden.jpg" alt="..." />`.
   The motif is replaced automatically; no other change needed.
2. **Exact brand hex** — colors are approximations of the venue aesthetic. Final hex values
   should be pulled from the official logo. They live in two mirrored places:
   - `tailwind.config.js` → `theme.extend.colors`
   - `src/index.css` → `:root` CSS variables (used for raw SVG fills / gradients)
   Update both so Tailwind classes and inline SVG stay in sync.

## Stack

- Vite + React 18 + TypeScript (strict, no `any`)
- Tailwind CSS v3 (config-based theme tokens)
- framer-motion (scroll reveals + drawer + FAB), lucide-react (icons)
- Hebrew, RTL (`<html dir="rtl" lang="he">`)

## Design system

- **Colors:** cream page, ivory surfaces, deep emerald (gardens), gold accent, stone neutrals.
- **Type:** Frank Ruhl Libre (Hebrew headings), Cormorant Garamond (Latin display, `.latin`),
  Heebo (body/UI). Loaded via Google Fonts in `index.html`.
- **Primitives** in `src/components/ui/`: `Button` (polymorphic button/anchor, 4 variants),
  `Section` + `SectionHeading`, `Reveal` (framer-motion fade-up + blur-in wrapper).
- **Motion:** gentle fade-up + slight blur-in on scroll via `Reveal` + viewport observer.
  Honors `prefers-reduced-motion` (framer-motion `useReducedMotion` + a global CSS fallback
  in `index.css`).

## Content

All copy is original Hebrew, written from the supplied facts (not copied from any site).
It lives as typed constants in `src/data/sections.ts` and `src/data/halls.ts` — edit there,
not in JSX.

## Notable choices

- **Header:** transparent over hero → solid cream + shadow after 24px scroll; desktop nav
  appears at `xl` (8 anchors + CTA need the room), mobile drawer below that. Active link via
  `useScrollSpy` (IntersectionObserver).
- **Gallery:** CSS `columns` for natural masonry with varied tile ratios (no JS layout).
- **Contact form:** client-side only. Validates name/phone/event-type, then animates to an
  elegant success state. No network request is made.
- **Floating CTA:** WhatsApp FAB (bottom-left for RTL), appears after 600px scroll; uses a
  demo number — replace `CONTACT.whatsapp` in `src/data/sections.ts`.
- **Phone / location:** `04-622-2221`, מרכז רגבה–נהריה (from the brief). Update in
  `src/data/sections.ts` → `CONTACT`.

## Run

```
npm install
npm run dev      # local dev
npm run build    # typecheck + production build
npm run preview  # preview the production build
```
