// ---------------------------------------------------------------------------
// Per-page SEO. THE place to edit each page's title / description / H1.
// `path` is the route; the canonical URL is derived from SITE.url + path.
// To add a page: add a route in routes.tsx and an entry here with the same key.
// ---------------------------------------------------------------------------
import { GALLERY_CATEGORIES, galleryPath } from './galleryData'

export type SeoEntry = {
  /** <title> */
  title: string
  /** meta description + og/twitter description */
  description: string
  /** the page's single visible <h1> */
  h1: string
  /** optional per-page share image (path); falls back to SITE.ogImage */
  ogImage?: string
  /** exclude from sitemap.xml (e.g. the 404) */
  noSitemap?: boolean
}

export const SEO: Record<string, SeoEntry> = {
  '/': {
    title: 'אחוזת סנדרין | חתונות ואירועים יוקרתיים בצפון',
    description:
      'אחוזת סנדרין — מתחם אירועים יוקרתי בצפון, בגנים לאורך אקוודוקט רומי עתיק. חתונות, בר ובת מצווה, חינות ואירועים. תאמו סיור באחוזה.',
    h1: 'אחוזת סנדרין',
  },
  '/about': {
    title: 'האחוזה והגנים | אחוזת סנדרין',
    description:
      'כחמישים דונם של גנים, מזרקות ואקוודוקט רומי עתיק, אולמות מפוארים וגן זכוכית ייחודי — הכירו את אחוזת סנדרין, מתחם האירועים בצפון.',
    h1: 'האחוזה שלנו',
  },
  '/weddings': {
    title: 'חתונות יוקרה בצפון | אחוזת סנדרין',
    description:
      'חתונות יוקרה באחוזת סנדרין — חופה בגנים לאורך אקוודוקט רומי, אולמות מפוארים וקולינריה כשרה בהשגחת הרבנות. תאמו סיור באחוזה.',
    h1: 'חתונות באחוזת סנדרין',
  },
  '/bar-bat-mitzvah': {
    title: 'בר/בת מצווה בצפון | אחוזת סנדרין',
    description:
      'חוגגים בר או בת מצווה באחוזת סנדרין — גנים פורחים, אולמות עם מסכי LED, עמדות שף כשרות ובית כנסת בלב האחוזה. תאמו סיור.',
    h1: 'בר/בת מצווה באחוזת סנדרין',
  },
  '/henna': {
    title: 'חינה יוקרתית בצפון | אחוזת סנדרין',
    description:
      'חוגגים חינה באחוזת סנדרין — טקס עתיר צבע בגנים ובאולמות, אירוח חם וכיבוד כשר בהשגחת הרבנות. תאמו סיור באחוזה.',
    h1: 'חינה יוקרתית באחוזת סנדרין',
  },
  '/halls': {
    title: 'אולמות אירועים | אחוזת סנדרין',
    description:
      'שלושה אולמות וגנים פרטיים באחוזת סנדרין — מאולם הדגל הענק ועד אולם בוטיק אינטימי, עם מסכי LED, תאורה חכמה וגג חופה לבן.',
    h1: 'האולמות',
  },
  '/culinary': {
    title: 'קולינריה כשרה לאירועים | אחוזת סנדרין',
    description:
      'מטבח גבוה באחוזת סנדרין — עמדות קבלת פנים מכל העולם, שירות אמריקאי וקינוחים מרהיבים, הכול כשר בהשגחת הרבנות.',
    h1: 'קולינריה',
  },
  '/gallery': {
    title: 'גלריה | אחוזת סנדרין',
    description:
      'גלריית תמונות מאחוזת סנדרין — הגנים, האקוודוקט הרומי, האולמות, החופה ורחבת הריקודים. הציצו אל המתחם.',
    h1: 'גלריה',
  },
}

// One SEO entry per gallery category, generated from galleryData (the single
// source of truth) so the category pages get a canonical URL, title and meta
// without hand-maintaining nine near-identical blocks.
for (const category of GALLERY_CATEGORIES) {
  SEO[galleryPath(category.id)] = {
    title: `${category.title} | גלריה | אחוזת סנדרין`,
    description: `גלריית תמונות — ${category.title} באחוזת סנדרין, מתחם האירועים היוקרתי בצפון. הציצו אל המתחם ותאמו סיור.`,
    h1: category.title,
  }
}
