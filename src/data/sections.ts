// Centralised, typed copy + nav config. Edit here, not in JSX.

export type NavLeaf = {
  label: string
  to: string
}

export type NavItem = NavLeaf | { label: string; children: NavLeaf[] }

export function isNavGroup(item: NavItem): item is { label: string; children: NavLeaf[] } {
  return 'children' in item
}

// Top-level navigation. Real page routes (react-router), not anchor scrolling.
// The "אירועים" group is a dropdown so the bar stays clean as celebration
// pages grow (corporate / testimonials can be added here later).
export const NAV_ITEMS: NavItem[] = [
  { label: 'בית', to: '/' },
  { label: 'האחוזה', to: '/about' },
  {
    label: 'אירועים',
    children: [
      { label: 'חתונות', to: '/weddings' },
      { label: 'בר מצווה', to: '/bar-mitzvah' },
      { label: 'בת מצווה', to: '/bat-mitzvah' },
      { label: 'חינות יוקרתיות', to: '/henna' },
    ],
  },
  { label: 'האולמות', to: '/halls' },
  { label: 'קולינריה', to: '/culinary' },
  { label: 'גלריה', to: '/gallery' },
  { label: 'צור קשר', to: '/contact' },
]

// Flat list of every real link in the nav — handy for the footer sitemap block.
export const NAV_LINKS: NavLeaf[] = NAV_ITEMS.flatMap((i) =>
  isNavGroup(i) ? i.children : [i],
)

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
  positioning: 'מתחם האירועים הגדול בישראל — חתונות ואירועים יוקרתיים בצפון',
  primaryCta: 'לתיאום סיור',
  secondaryCta: 'לצפייה בגלריה',
} as const

export const ABOUT = {
  eyebrow: 'Our Estate',
  title: 'אחוזה שכל כולה הזמנה לחגוג',
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
  'בר מצווה',
  'בת מצווה',
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

export const BAR_MITZVAH: CelebrationContent = {
  eyebrow: 'Bar Mitzvah',
  h1: 'בר מצווה באחוזת סנדרין',
  heroSubtitle:
    'רגע של גאווה וכניסה לבגרות — חוגגים אותו בגדול, בין גנים פורחים לאולמות מלכותיים.',
  intro: {
    title: 'ערב שהילד שלכם יזכור כל החיים',
    paragraphs: [
      'בר המצווה הוא רגע דרך — ובאחוזת סנדרין הוא מקבל את הבמה שמגיעה לו. בין כחמישים דונם של גנים, מזרקות ואקוודוקט רומי עתיק, לצד אולמות מפוארים עם מסכי LED ותאורה חכמה, כל ערב נתפר סביב הילד ומשפחתו.',
      'בין אם חלמתם על חגיגה גדולה וסוחפת ובין אם על ערב אינטימי ומעוצב, צוות ההפקה והמעצב הבית שלנו ילוו אתכם מהרעיון ועד הפרט האחרון — כולל קייטרינג כשר בהשגחת הרבנות ועמדות שף שירתקו גם את החברים וגם את הדור המבוגר.',
    ],
    imageLabel: 'בר מצווה באחוזה',
  },
  features: [
    {
      title: 'הפקה בהתאמה אישית',
      body: 'קונספט, עיצוב ותאורה שנבנים סביב עולם התוכן של הילד — מהכניסה הדרמטית ועד רחבת הריקודים.',
    },
    {
      title: 'מרחב לכל הגילים',
      body: 'רחבה תוססת לצעירים לצד פינות ישיבה מוארות למבוגרים, בגנים ובאולם כאחד.',
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
  closingTitle: 'מתכננים בר מצווה?',
  closingBody: 'בואו לסיור באחוזה ונתכנן יחד ערב שכולם ידברו עליו.',
}

export const BAT_MITZVAH: CelebrationContent = {
  eyebrow: 'Bat Mitzvah',
  h1: 'בת מצווה באחוזת סנדרין',
  heroSubtitle:
    'ערב מנצנץ שכולו היא — עיצוב מוקפד, אווירה קסומה ורחבה שלא מפסיקה לזוז.',
  intro: {
    title: 'החגיגה שתגשים לה את החלום',
    paragraphs: [
      'בת המצווה חולמת על ערב מושלם — ובאחוזת סנדרין הוא קורם עור וגידים. גנים פורחים המוארים באור זהוב, אולמות עם גג חופה לבן ומסכי LED, ופרטים קטנים שהופכים ערב לזיכרון של פעם בחיים.',
      'המעצב הבית וצוות ההפקה יעצבו סביב בת המצווה קונספט אישי — ממגוון סגנונות, מהקלאסי-מלכותי ועד המודרני-נוצץ — עם קולינריה עשירה וכשרה בהשגחת הרבנות, ושירות שדואג לכל אורח ואורחת.',
    ],
    imageLabel: 'בת מצווה באחוזה',
  },
  features: [
    {
      title: 'עיצוב וקונספט אישי',
      body: 'עולם שלם שנבנה סביב הטעם של בת המצווה — צבעים, תאורה ועמדות צילום.',
    },
    {
      title: 'רחבת ריקודים בלתי נשכחת',
      body: 'תאורה, סאונד ואווירה שגורמים לחברות לרקוד עד הרגע האחרון.',
    },
    {
      title: 'חוויה קולינרית',
      body: 'עמדות שף וקינוחים מרהיבים — הכול כשר בהשגחת הרבנות.',
    },
    {
      title: 'גם בחוץ וגם בפנים',
      body: 'שילוב של גני האחוזה המוארים עם אולם עוטף — בכל מזג אוויר.',
    },
  ],
  closingTitle: 'מתכננים בת מצווה?',
  closingBody: 'בואו ניצור לבת המצווה שלכם ערב שכולו קסם.',
}

export const HENNA: CelebrationContent = {
  eyebrow: 'Henna',
  h1: 'חינה יוקרתית באחוזת סנדרין',
  heroSubtitle:
    'צבע, מסורת ושמחה — חוגגים את החינה באירוח חם ומפואר, בין גנים לאולמות.',
  intro: {
    title: 'חינה חוגגת מסורת — במסגרת מלכותית',
    paragraphs: [
      'החינה היא חגיגה של צבע, מוזיקה ומסורת — ובאחוזת סנדרין היא מקבלת מסגרת יוקרתית ומרהיבה. גני האחוזה, האקוודוקט הרומי המואר והאולמות המפוארים יוצרים רקע חלומי לטקס עתיר צבעים.',
      'בין אם בסגנון מסורתי-אותנטי ובין אם בפרשנות מודרנית ומעוצבת, צוות ההפקה והמעצב הבית ילוו אתכם — עם עמדות קולינריה עשירות, אווירה חמה וכיבוד כשר בהשגחת הרבנות, כדי שהמשפחה כולה תוכל פשוט לחגוג.',
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
    {
      title: 'חוויה למשפחה כולה',
      body: 'מרחב חם ומזמין לכל הדורות, מהילדים ועד הסבים והסבתות.',
    },
  ],
  closingTitle: 'חוגגים חינה?',
  closingBody: 'בואו נחגוג יחד חינה מלאת צבע ושמחה.',
}

export const FOOTER = {
  seoLine: 'אחוזת סנדרין · גן אירועים בצפון · חתונות יוקרה בצפון',
  disclaimer: 'התמונות להמחשה בלבד',
  accessibility: 'הצהרת נגישות',
  crossLink: 'עוד מבית סנדרין: אולמי יהלום',
} as const
