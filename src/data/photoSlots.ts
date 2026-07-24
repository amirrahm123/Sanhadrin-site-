// Canonical list of every managed photo "slot" on the public site.
//
// A "slot" is one fixed photo spot (a hero background, a section image, a card).
// Each has a stable key, a Hebrew label + group for the /admin dashboard, and
// the tile aspect ratio used at its render site. This file is the SINGLE SOURCE
// OF TRUTH for which slot keys are valid — the serverless set-slot/delete
// functions validate against it.
//
// Pure data, ZERO imports: safe to import from both the React client and the
// serverless functions under api/ without pulling React into the function
// bundle.
//
// The gallery is NOT a slot — it stays tag-based (`sandrine_gallery`) and is
// managed separately in the dashboard's gallery manager.

export type SlotRatio = '16/9' | '4/5' | '2/3' | '1/1' | '3/2' | '21/9'

export type PhotoSlot = {
  /** Stable key stored in slots.json and passed to ImagePlaceholder. */
  key: string
  /** Hebrew label shown in the admin dashboard. */
  label: string
  /** Dashboard grouping header (Hebrew). */
  group: string
  /** Aspect ratio at the render site — drives the dashboard thumbnail shape. */
  ratio: SlotRatio
  /**
   * Design-tuned default object-position (CSS `object-position`, e.g. '50% 100%')
   * for this slot's cover crop. SINGLE SOURCE OF TRUTH for the sensible default:
   * ImagePlaceholder falls back to it when neither a per-photo focal point nor an
   * explicit prop is set, and the admin focal-point editor opens on it. Omit to
   * default to centered ('50% 50%').
   */
  focus?: string
}

// Order the groups appear in the dashboard.
export const SLOT_GROUPS = [
  'עמוד הבית',
  'עמוד האחוזה והגנים',
  'חתונות',
  'בר/בת מצווה',
  'חינה',
  'האולמות',
  'קולינריה',
  'גלריה',
] as const

export const PHOTO_SLOTS: PhotoSlot[] = [
  // ── עמוד הבית ─────────────────────────────────────────────────────────────
  { key: 'home_hero', label: 'רקע ראשי (Hero) — עמוד הבית', group: 'עמוד הבית', ratio: '16/9' },
  {
    key: 'about_main',
    label: 'תמונת האחוזה (מופיעה בעמוד הבית וגם בעמוד האחוזה)',
    group: 'עמוד הבית',
    // Rendered in a tall 2/3 box (About + Home). A 9:16 aerial fits almost
    // whole; biasing the crop to the bottom keeps the full venue (building +
    // lit monument on the lawn) in frame, trimming only the top sliver of sky.
    ratio: '2/3',
    focus: '50% 100%',
  },
  {
    key: 'home_aqueduct',
    label: 'תמונת האקוודוקט — עמוד הבית',
    group: 'עמוד הבית',
    // Portrait photo in a 4/5 box → cover trims little. Bias slightly above
    // center so the crop keeps the full stone arch crown and the monument
    // beneath it in frame while trimming excess sky/foreground.
    ratio: '4/5',
    focus: '50% 42%',
  },
  { key: 'event_card_weddings', label: 'כרטיס אירוע — חתונות', group: 'עמוד הבית', ratio: '4/5' },
  { key: 'event_card_barbat', label: 'כרטיס אירוע — בר/בת מצווה', group: 'עמוד הבית', ratio: '4/5' },
  { key: 'event_card_henna', label: 'כרטיס אירוע — חינה יוקרתית', group: 'עמוד הבית', ratio: '4/5' },
  { key: 'area_card_about', label: 'כרטיס מתחם — האחוזה והגנים', group: 'עמוד הבית', ratio: '4/5' },
  { key: 'area_card_halls', label: 'כרטיס מתחם — האולמות', group: 'עמוד הבית', ratio: '4/5' },
  { key: 'area_card_culinary', label: 'כרטיס מתחם — קולינריה', group: 'עמוד הבית', ratio: '4/5' },

  // ── עמוד האחוזה והגנים ────────────────────────────────────────────────────
  {
    key: 'about_hero',
    label: 'רקע ראשי (Hero) — עמוד האחוזה',
    group: 'עמוד האחוזה והגנים',
    ratio: '16/9',
  },
  { key: 'garden_1', label: 'הגן החדש — גג הזכוכית', group: 'עמוד האחוזה והגנים', ratio: '4/5' },
  { key: 'garden_2', label: 'הגן החדש — רחבת הריקודים', group: 'עמוד האחוזה והגנים', ratio: '4/5' },
  { key: 'garden_3', label: 'הגן החדש — מזרקות ופסיפס', group: 'עמוד האחוזה והגנים', ratio: '4/5' },
  { key: 'garden_4', label: 'הגן החדש — ערוגות הפריחה', group: 'עמוד האחוזה והגנים', ratio: '4/5' },

  // ── חתונות ────────────────────────────────────────────────────────────────
  { key: 'weddings_hero', label: 'רקע ראשי (Hero) — עמוד חתונות', group: 'חתונות', ratio: '16/9' },
  { key: 'weddings_1', label: 'חתונות חורף (כרטיס בעמוד חתונות)', group: 'חתונות', ratio: '3/2' },
  { key: 'weddings_2', label: 'חתונות צהריים (כרטיס בעמוד חתונות)', group: 'חתונות', ratio: '3/2' },
  {
    key: 'noon_weddings_hero',
    label: 'רקע ראשי (Hero) — עמוד חתונות צהריים',
    group: 'חתונות',
    ratio: '16/9',
  },
  {
    key: 'noon_weddings_intro',
    label: 'תמונת אינטרו — חתונות צהריים',
    group: 'חתונות',
    ratio: '4/5',
  },
  {
    key: 'winter_weddings_hero',
    label: 'רקע ראשי (Hero) — עמוד חתונות חורף',
    group: 'חתונות',
    ratio: '16/9',
  },
  {
    key: 'winter_weddings_intro',
    label: 'תמונת אינטרו — חתונות חורף',
    group: 'חתונות',
    ratio: '4/5',
  },

  // ── בר/בת מצווה ──────────────────────────────────────────────────────────
  {
    key: 'barbat_hero',
    label: 'רקע ראשי (Hero) — עמוד בר/בת מצווה',
    group: 'בר/בת מצווה',
    ratio: '16/9',
  },
  { key: 'barbat_intro', label: 'תמונת אינטרו — בר/בת מצווה', group: 'בר/בת מצווה', ratio: '4/5' },

  // ── חינה ──────────────────────────────────────────────────────────────────
  { key: 'henna_hero', label: 'רקע ראשי (Hero) — עמוד חינה', group: 'חינה', ratio: '16/9' },
  { key: 'henna_intro', label: 'תמונת אינטרו — חינה', group: 'חינה', ratio: '4/5' },

  // ── האולמות ───────────────────────────────────────────────────────────────
  { key: 'halls_hero', label: 'רקע ראשי (Hero) — עמוד האולמות', group: 'האולמות', ratio: '16/9' },
  { key: 'halls_1', label: 'אולם Palais', group: 'האולמות', ratio: '4/5' },
  { key: 'halls_2', label: 'אולם Chateau', group: 'האולמות', ratio: '4/5' },
  { key: 'halls_3', label: 'אולם Garden', group: 'האולמות', ratio: '4/5' },

  // ── קולינריה ──────────────────────────────────────────────────────────────
  { key: 'culinary_hero', label: 'רקע ראשי (Hero) — עמוד קולינריה', group: 'קולינריה', ratio: '16/9' },
  { key: 'culinary_main', label: 'תמונת הקולינריה', group: 'קולינריה', ratio: '4/5' },

  // ── גלריה ─────────────────────────────────────────────────────────────────
  { key: 'gallery_hero', label: 'רקע ראשי (Hero) — עמוד הגלריה', group: 'גלריה', ratio: '16/9' },
]

/** All valid slot keys (used server-side to validate set-slot / delete). */
export const SLOT_KEYS: string[] = PHOTO_SLOTS.map((s) => s.key)

export function isValidSlotKey(key: string): boolean {
  return SLOT_KEYS.includes(key)
}

export const SLOT_BY_KEY: Record<string, PhotoSlot> = Object.fromEntries(
  PHOTO_SLOTS.map((s) => [s.key, s]),
)

/** The shape of one entry in Blob's slots.json. */
export type SlotOverride = {
  publicId: string
  alt?: string
  /**
   * Per-photo focal point as CSS `object-position` in the strict form
   * '<x>% <y>%' (e.g. '50% 42%'), set from the admin focal-point editor. Lets a
   * manager steer which part of an off-shape photo the cover-crop keeps, without
   * touching code. Absent → the slot's `focus` default (or centered) is used.
   */
  objectPosition?: string
}
export type SlotMap = Record<string, SlotOverride>

// ── Per-slot guidance (derived from the real container aspect ratio) ─────────
// Plain-language, automatically-accurate hints for non-technical uploaders, and
// the orientation used to warn when a wrong-shape photo is about to be cropped.

export type Orientation = 'portrait' | 'landscape' | 'square'

const RATIO_DECIMAL: Record<SlotRatio, number> = {
  '16/9': 16 / 9,
  '4/5': 4 / 5,
  '2/3': 2 / 3,
  '1/1': 1,
  '3/2': 3 / 2,
  '21/9': 21 / 9,
}

/** Classify any width/height aspect into portrait / landscape / square. */
export function orientationOfAspect(aspect: number): Orientation {
  if (aspect > 1.1) return 'landscape'
  if (aspect < 0.9) return 'portrait'
  return 'square'
}

/** The orientation a slot expects, from its container ratio. */
export function slotOrientation(ratio: SlotRatio): Orientation {
  return orientationOfAspect(RATIO_DECIMAL[ratio])
}

export type SlotGuidance = {
  orientation: Orientation
  /** Short recommendation, e.g. 'תמונה לאורך (פורטרט) מומלצת כאן'. */
  title: string
  /** One-line plain-language explanation of why. */
  hint: string
  /** Human ratio label, e.g. 'יחס מומלץ ~2:3'. */
  ratioLabel: string
}

/**
 * Plain-language upload guidance for a slot, derived from its real container
 * ratio so it's automatically correct per slot (no hand-written per-slot copy).
 */
export function slotGuidance(ratio: SlotRatio): SlotGuidance {
  const orientation = slotOrientation(ratio)
  const ratioLabel = `יחס מומלץ ~${ratio.replace('/', ':')}`
  if (orientation === 'portrait') {
    return {
      orientation,
      title: 'תמונה לאורך (פורטרט) מומלצת כאן',
      hint: 'הסלוט מיועד לתמונה גבוהה. תמונה לרוחב תיחתך בצדדים — כדאי לצלם/לבחור לאורך.',
      ratioLabel,
    }
  }
  if (orientation === 'landscape') {
    return {
      orientation,
      title: 'תמונה לרוחב (לנדסקייפ) מומלצת כאן',
      hint: 'הסלוט מיועד לתמונה רחבה. תמונה לאורך תיחתך למעלה ולמטה — כדאי לצלם/לבחור לרוחב.',
      ratioLabel,
    }
  }
  return {
    orientation,
    title: 'תמונה מרובעת מומלצת כאן',
    hint: 'הסלוט מיועד לתמונה בפרופורציות ריבועיות בערך. תמונה מוארכת מאוד תיחתך.',
    ratioLabel,
  }
}

const ORIENTATION_HE: Record<Orientation, string> = {
  portrait: 'לאורך',
  landscape: 'לרוחב',
  square: 'מרובעת',
}

/** Human Hebrew name of an orientation, for warning copy. */
export function orientationLabel(o: Orientation): string {
  return ORIENTATION_HE[o]
}
