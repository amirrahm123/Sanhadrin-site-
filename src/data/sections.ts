// Centralised, typed copy + nav config. Edit here, not in JSX.
import { GALLERY_BASE, GALLERY_NAV_LINKS } from './galleryData'

export type NavLeaf = {
  label: string
  to: string
}

// A dropdown group. `to` is optional: when set, the group label is itself a
// link (e.g. "גלריה" → the gallery landing) while still opening the submenu.
export type NavGroup = { label: string; to?: string; children: NavLeaf[] }

export type NavItem = NavLeaf | NavGroup

export function isNavGroup(item: NavItem): item is NavGroup {
  return 'children' in item
}

// Top-level navigation. Real page routes (react-router), not anchor scrolling.
// The "אירועים" group is a dropdown so the bar stays clean as celebration
// pages grow (corporate / testimonials can be added here later). "גלריה" is a
// dropdown too — its label links to the landing index while listing every
// category (pulled from galleryData, the single source of truth).
export const NAV_ITEMS: NavItem[] = [
  { label: 'בית', to: '/' },
  { label: 'האחוזה', to: '/about' },
  {
    label: 'אירועים',
    children: [
      { label: 'חתונות', to: '/weddings' },
      { label: 'בר/בת מצווה', to: '/bar-bat-mitzvah' },
      { label: 'חינות יוקרתיות', to: '/henna' },
    ],
  },
  { label: 'האולמות', to: '/halls' },
  { label: 'קולינריה', to: '/culinary' },
  { label: 'גלריה', to: GALLERY_BASE, children: GALLERY_NAV_LINKS },
  // Scroll target — the contact form lives in the global footer (id=contact-form).
  { label: 'צור קשר', to: '#contact-form' },
]

// Flat list of the real *route* links (hash/scroll links excluded) — used for
// the footer nav grid. A group with its own `to` (e.g. גלריה) contributes that
// single top-level link; a group without one (אירועים) contributes its
// children, so the footer stays exactly as before.
export const NAV_LINKS: NavLeaf[] = NAV_ITEMS.flatMap((i) =>
  isNavGroup(i) ? (i.to ? [{ label: i.label, to: i.to }] : i.children) : [i],
).filter((l) => l.to.startsWith('/'))

export const BRAND = {
  he: 'אחוזת סנדרין',
  latin: 'Sandrine Events',
  tagline: 'where dreams come true',
} as const

export const CONTACT = {
  phone: '04-622-2221',
  // Fixed: was +972046222221 — dropped the stray 0 after the country code.
  phoneIntl: '+97246222221',
  whatsapp: '972526222221',
  // Prefilled Hebrew WhatsApp message (encoded at use site).
  whatsappMessage: 'היי, אשמח לקבל פרטים על אירוע באחוזת סנדרין',
  location: 'מתחם רגבה, נהריה',
  addressFull: 'מתחם רגבה (BIG רגבה), רגבה 26814',
  addressLocality: 'רגבה',
  addressRegion: 'צפון',
  postalCode: '26814',
  areaServed: 'צפון הארץ — נהריה, רגבה והסביבה',
  hours: [
    { days: 'ראשון–חמישי', time: '10:00–21:30' },
    { days: 'שישי', time: '09:30–13:00' },
    { days: 'שבת', time: 'סגור' },
  ],
  googleBusiness: 'https://maps.app.goo.gl/VDUEPkBFPHHQYibn8',
  instagram: 'https://www.instagram.com/sandrine_event/',
  facebook: 'https://www.facebook.com/sandrin.rgba',
} as const

export const HERO = {
  title: BRAND.he,
  latinLine: BRAND.tagline,
  positioning: 'מתחם האירועים הגדול בישראל — חתונות אירועים עסקיים ואירועים יוקרתיים בצפון',
  primaryCta: 'לתיאום סיור',
  secondaryCta: 'לצפייה בגלריה',
} as const

export const ABOUT = {
  eyebrow: 'Our Estate',
  title: 'אחוזה שנבנתה כדי להגשים לכם כל חלום',
  paragraphs: [
    'אחוזת סנדרין היא מתחם האירועים הגדול בישראל — כחמישים דונם של גנים פורחים, מזרקות ונחלים, הנפרשים לאורכו של אקוודוקט רומי עתיק. כאן הטבע, ההיסטוריה והיוקרה נפגשים לחוויה אחת בלתי נשכחת.',
    'בלב האחוזה שלושה אולמות מפוארים ואולם כנסים אלגנטי, המתאימים לאירועים פרטיים ועסקיים כאחד. ניתן לשכור כל אולם בנפרד — או לשמור את האחוזה כולה באופן בלעדי, כך שהיום כולו שלכם בלבד.',
  ],
  stats: [
    { value: '50', unit: 'דונם', label: 'גנים ומרחבים פתוחים' },
    { value: '3', unit: 'אולמות', label: 'יוקרתיים + אולם כנסים' },
    { value: '1000', unit: 'אורחים', label: 'בקיבולת המרבית' },
    { value: '1', unit: 'אקוודוקט', label: 'רומי עתיק לאורך הגנים' },
  ],
  imageLabel: 'מבט אל האחוזה',
} as const

// The venue's signature differentiator: the ancient Roman aqueduct running
// through the gardens. Fresh wording (not copied from ABOUT/GARDEN) drawn from
// the live-site language — deliberately no age, date or name, only "רומית עתיקה".
export const AQUEDUCT = {
  eyebrow: 'Roman Aqueduct',
  title: 'חוגגים לצד אמת מים רומית עתיקה',
  body: 'לאורך גני האחוזה משתרעת אמת מים רומית עתיקה (אקוודוקט), ולצדה נחגגים הרגעים הגדולים שלכם. מזרקות מים ופסיפסי רצפה בעבודת יד נשזרים בבנייני המתחם, בארכיטקטורה מודרנית שמפגישה עבר, הווה ועתיד. עם רדת החשכה מוארת אמת המים בתאורה יוקרתית — והטבע, ההיסטוריה והיוקרה מתלכדים לחוויה אחת.',
  emphasis: 'תפאורה שכמוה לא תמצאו באף מקום אחר.',
  imageLabel: 'אמת המים הרומית',
} as const

export const GARDEN = {
  eyebrow: 'The New Garden',
  title: 'הגן החדש — קסם לאורך האקוודוקט',
  paragraphs: [
    'גן קסום הנפרש לאורך האקוודוקט הרומי: משטחי דשא מדורגים, ערוגות פרחים וירק עוטף עד קצה האופק. מבנה ייחודי בעל גג זכוכית מכניס את הירוק פנימה — חוויה של אוויר פתוח ומרחב מקורה כאחד, בכל מזג אוויר.',
    'תאורת רחבת ריקודים יוצאת דופן, מזרקות מים ופסיפסי רצפה בעבודת יד יוצרים אווירה חד-פעמית. עמדות בר צמודות לרחבה, והפקות קונספט בליווי המעצב הבית — כל ערב הופך ליצירה.',
  ],
  gallery: [
    { label: 'גג הזכוכית', ratio: '4/5' as const },
    { label: 'רחבת הריקודים', ratio: '4/5' as const },
    { label: 'מזרקות ופסיפס', ratio: '4/5' as const },
    { label: 'ערוגות הפריחה', ratio: '4/5' as const },
  ],
} as const

export type WeddingFeature = {
  id: string
  title: string
  body: string
  bullets: string[]
  imageLabel: string
}

export const WEDDINGS: { eyebrow: string; title: string; intro: string; features: WeddingFeature[] } = {
  eyebrow: 'Weddings',
  title: 'חתונות שנחקקות בלב',
  intro: 'בין אם תחת שמי ערב מלאי כוכבים ובין אם באור היום הרך — כל חתונה בסנדרין נתפרת למידותיכם.',
  features: [
    {
      id: 'winter',
      title: 'חתונות חורף',
      body: 'שקיעות עוצרות נשימה נפרשות מעבר לחלונות, ולובי רחב ומפואר הופך לחלל קבלת פנים עוטף ומלכותי. חופות מעוצבות במגוון סגנונות משלימות ערב של חום ויוקרה.',
      bullets: ['שקיעות חורף מרהיבות', 'לובי קבלת פנים מפואר', 'מבחר חופות מעוצבות'],
      imageLabel: 'חתונת חורף',
    },
    {
      id: 'afternoon',
      title: 'חתונות צהריים',
      body: 'אור יום טבעי ורך, קונספטים יצירתיים ואווירה קלילה ומאירת פנים. חתונות שישי וצהריים מזמינות צילום מהפנט ורגעים מוצפים שמש.',
      bullets: ['אור יום טבעי', 'קונספט יצירתי וחדשני', 'צילום יום מרהיב'],
      imageLabel: 'חתונת צהריים',
    },
  ],
}

export const CULINARY = {
  eyebrow: 'Culinary',
  title: 'מסע קולינרי שלא תשכחו',
  paragraphs: [
    'תפריט מקורי ועשיר, חומרי גלם משובחים וטכניקות מהמטבח הגבוה — כל מנה היא הצהרת כוונות. קבלת פנים נדיבה עם עמדות מכל קצוות העולם מקדמת את אורחיכם בשפע.',
    'שירות אמריקאי לשולחנות, עמדת קינוחים מרהיבה, והכול כשר בהשגחת הרבנות. שולחן שמתכתב עם הגנים שבחוץ — חגיגה לכל החושים.',
  ],
  stations: [
    'פוקצ׳ות ולחמי טאבון',
    'מטעמי המזרח הרחוק',
    'עישון בשרים בהופעה חיה',
    'עמדה מקסיקנית',
    'בשרים על האש',
    'עמדות שף לבחירת המקום',
  ],
  imageLabel: 'בר קבלת הפנים',
  kosher: 'כשר בהשגחת הרבנות',
} as const

export const GALLERY = {
  eyebrow: 'Gallery',
  title: 'הצצה אל האחוזה',
  subtitle: 'רגעים, מרחבים ופרטים — טעימה ממה שמחכה לכם בסנדרין.',
  cta: 'לגלריה המלאה',
  tiles: [
    { label: 'הגן החדש', ratio: '4/5' as const },
    { label: 'אולם Palais', ratio: '16/9' as const },
    { label: 'קבלת פנים', ratio: '1/1' as const },
    { label: 'החופה', ratio: '4/5' as const },
    { label: 'האקוודוקט', ratio: '16/9' as const },
    { label: 'רחבת הריקודים', ratio: '1/1' as const },
    { label: 'סוויטת הזוג', ratio: '4/5' as const },
    { label: 'עמדות הבר', ratio: '1/1' as const },
    { label: 'מזרקות הגן', ratio: '16/9' as const },
    { label: 'אולם Chateau', ratio: '4/5' as const },
    { label: 'בית הכנסת', ratio: '1/1' as const },
    { label: 'תאורת הערב', ratio: '16/9' as const },
  ],
} as const

export const CONTACT_SECTION = {
  eyebrow: 'Get in Touch',
  title: 'בואו נתכנן את האירוע שלכם',
  subtitle: 'השאירו פרטים ונחזור אליכם לתיאום סיור באחוזה. נשמח להכיר ולחלום יחד.',
  successTitle: 'תודה!',
  successBody: 'ניצור איתכם קשר בהקדם לתיאום סיור באחוזה.',
} as const

export const EVENT_TYPES = [
  'חתונה',
  'בר/בת מצווה',
  'חינה',
  'אירוע חברה',
  'אחר',
] as const

// ---------------------------------------------------------------------------
// Celebration pages (bar-mitzvah / bat-mitzvah / henna). New brand-voice copy,
// kept truthful and general — no invented capacities, prices or dates.
// NOTE: "חינות יוקרתיות" is read as henna (חינה) pre-celebration ceremonies.
// If the client meant something else, adjust HENNA below.
// ---------------------------------------------------------------------------
export type CelebrationFeature = { title: string; body: string }

export type CelebrationContent = {
  eyebrow: string
  h1: string
  heroSubtitle: string
  intro: { title: string; paragraphs: string[]; imageLabel: string }
  features: CelebrationFeature[]
  closingTitle: string
  closingBody: string
}

// Bar & Bat Mitzvah share one page (/bar-bat-mitzvah) — merged copy covering both.
export const BAR_BAT_MITZVAH: CelebrationContent = {
  eyebrow: 'Bar & Bat Mitzvah',
  h1: 'בר/בת מצווה באחוזת סנדרין',
  heroSubtitle:
    'רגע של גאווה וכניסה לפרק חדש — חוגגים בר וגם בת מצווה בגדול, בין גנים פורחים לאולמות מלכותיים.',
  intro: {
    title: 'ערב שהילד או הילדה שלכם יזכרו כל החיים',
    paragraphs: [
      'בר או בת מצווה הם רגע דרך — ובאחוזת סנדרין הם מקבלים את הבמה שמגיעה להם. בין כחמישים דונם של גנים, מזרקות ואקוודוקט רומי עתיק, לצד אולמות מפוארים עם מסכי LED, גג חופה לבן ותאורה חכמה, כל ערב נתפר סביב הילד או הילדה והמשפחה.',
      'בין חגיגה גדולה וסוחפת לערב אינטימי ומעוצב — צוות ההפקה והמעצב הבית שלנו ילוו אתכם מהרעיון ועד הפרט האחרון: קונספט אישי, עיצוב, תאורה וקולינריה עשירה, הכול כשר בהשגחת הרבנות.',
    ],
    imageLabel: 'בר/בת מצווה באחוזה',
  },
  features: [
    {
      title: 'הפקה וקונספט אישי',
      body: 'עיצוב, תאורה ותוכן שנבנים סביב עולמו של הילד או הילדה — מהכניסה הדרמטית ועד רחבת הריקודים.',
    },
    {
      title: 'רחבה שלא מפסיקה לזוז',
      body: 'תאורה, סאונד ואווירה שגורמים לחברים ולמשפחה לרקוד עד הרגע האחרון.',
    },
    {
      title: 'קולינריה שכולם אוהבים',
      body: 'עמדות קבלת פנים עשירות ומנות מהמטבח הגבוה — הכול כשר בהשגחת הרבנות.',
    },
    {
      title: 'בית כנסת בלב האחוזה',
      body: 'אפשרות לעלייה לתורה ולתפילה במקום, להשלמת המעמד המשפחתי.',
    },
  ],
  closingTitle: 'מתכננים בר או בת מצווה?',
  closingBody: 'בואו לסיור באחוזה ונתכנן יחד ערב בלתי נשכח.',
}

export const HENNA: CelebrationContent = {
  eyebrow: 'Henna',
  h1: 'חינה יוקרתית באחוזת סנדרין',
  heroSubtitle:
    'צבע, מסורת ושמחה — חוגגים את החינה באירוח חם ומפואר, בין גנים לאולמות.',
  intro: {
    title: 'חינה שעושים רק פעם בחיים.',
    paragraphs: [
      'מסורת, צבעים, מוזיקה ואווירה שלא רואים בכל מקום.',
      'אצלנו תוכלו לבחור את החוויה שמתאימה בדיוק לכם, חינה קסומה בגן האקוודוקט תחת כיפת השמיים, או חגיגה יוקרתית באחת מהאחוזות המרהיבות שלנו. כל מתחם מציע אופי ייחודי, אבל כולם נבנו כדי ליצור את אותו אפקט, וואו מהרגע הראשון.',
      'בין אם אתם חולמים על חינה מסורתית ועשירה ובין אם על הפקה מודרנית ומעוצבת, אנחנו נדאג לכל פרט, מהעיצוב והאווירה ועד הקולינריה וההפקה, כדי שאתם פשוט תיהנו מכל רגע.',
      'כי חינה היא לא עוד אירוע, היא חוויה של פעם בחיים. ובאחוזת סנדרין יודעים בדיוק איך להפוך אותה לבלתי נשכחת.',
    ],
    imageLabel: 'חינה באחוזה',
  },
  features: [
    {
      title: 'הפקה עתירת צבע',
      body: 'עיצוב, תאורה ואביזרים שמדגישים את יופיו של טקס החינה.',
    },
    {
      title: 'מרחבי גן פתוחים',
      body: 'טקס תחת כיפת השמיים בין מזרקות וירק, עם מעבר נעים אל האולם.',
    },
    {
      title: 'אירוח וקולינריה',
      body: 'שפע של מטעמים ועמדות — הכול כשר בהשגחת הרבנות.',
    },
  ],
  closingTitle: 'חוגגים חינה?',
  closingBody: 'בואו נחגוג יחד חינה מלאת צבע ושמחה.',
}

export const FOOTER = {
  seoLine: 'אחוזת סנדרין · גן אירועים בצפון · חתונות יוקרה בצפון',
  disclaimer: 'התמונות להמחשה בלבד',
  accessibility: 'הצהרת נגישות',
  crossLink: 'עוד מבית סנדרין: אולמי גלורי',
} as const
