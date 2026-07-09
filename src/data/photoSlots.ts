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

export type SlotRatio = '16/9' | '4/5' | '1/1' | '3/2' | '21/9'

export type PhotoSlot = {
  /** Stable key stored in slots.json and passed to ImagePlaceholder. */
  key: string
  /** Hebrew label shown in the admin dashboard. */
  label: string
  /** Dashboard grouping header (Hebrew). */
  group: string
  /** Aspect ratio at the render site — drives the dashboard thumbnail shape. */
  ratio: SlotRatio
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
    ratio: '4/5',
  },
  { key: 'event_card_weddings', label: 'כרטיס אירוע — חתונות', group: 'עמוד הבית', ratio: '4/5' },
  { key: 'event_card_barbat', label: 'כרטיס אירוע — בר/בת מצווה', group: 'עמוד הבית', ratio: '4/5' },
  { key: 'event_card_henna', label: 'כרטיס אירוע — חינה יוקרתית', group: 'עמוד הבית', ratio: '4/5' },
  { key: 'area_card_about', label: 'כרטיס מתחם — האחוזה והגנים', group: 'עמוד הבית', ratio: '16/9' },
  { key: 'area_card_halls', label: 'כרטיס מתחם — האולמות', group: 'עמוד הבית', ratio: '16/9' },
  { key: 'area_card_culinary', label: 'כרטיס מתחם — קולינריה', group: 'עמוד הבית', ratio: '16/9' },

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
  { key: 'weddings_1', label: 'חתונות חורף', group: 'חתונות', ratio: '3/2' },
  { key: 'weddings_2', label: 'חתונות צהריים', group: 'חתונות', ratio: '3/2' },

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
export type SlotOverride = { publicId: string; alt?: string }
export type SlotMap = Record<string, SlotOverride>
