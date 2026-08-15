/**
 * Real Google reviews, transcribed verbatim.
 *
 * DO NOT edit the `text` bodies — no trimming, no spelling fixes, no rewording,
 * no emoji changes. They are quoted customer speech; altering them misrepresents
 * what people actually wrote. Line breaks inside the template literals are part
 * of the quote and are rendered as-is (`whitespace-pre-line`).
 *
 * `rating` / `reviewCount` below are shown as PLAIN TEXT only. Deliberately no
 * JSON-LD AggregateRating: Google's review-snippet guidelines forbid a business
 * marking up its own aggregate rating, and StructuredData.tsx must stay clean.
 */

export type ReviewSource = 'google'

export type Review = {
  /** reviewer name, exactly as it appears on Google */
  author: string
  /** the review body, verbatim (line breaks preserved) */
  text: string
  /** relative date string as shown on Google, e.g. "לפני חודש" */
  date: string
  /** event date as written inside the review; absent when not mentioned */
  event_date?: string
  source: ReviewSource
}

/** Aggregate figures for the headline row — plain text, never schema markup. */
export const REVIEWS_SUMMARY = {
  eyebrow: 'Reviews',
  title: 'מה מספרים עלינו',
  rating: '4.5',
  countLabel: 'מתוך יותר מ-3,000 ביקורות בגוגל',
  cta: 'לכל הביקורות בגוגל',
  ctaHref: 'https://www.google.com/maps/place/?q=place_id:ChIJ1Y-UAMTOHRURM35Ek3A-BQ8',
  sourceLabel: 'ביקורת מגוגל',
} as const

export const REVIEWS: Review[] = [
  {
    author: 'Nofar Mor Haim',
    date: 'לפני חודש',
    event_date: '22/06/2026',
    source: 'google',
    text: `התחתנו באחוזת סנדרין בתאריך 22/06/2026
ואין לנו מספיק מילים כדי להודות לכם על הערב המושלם שהענקתם לנו.

מהפגישה הראשונה ועד הרגע האחרון באירוע זכינו ליחס אישי, מקצועי ואכפתי. כל פרט טופל בצורה מדויקת, הצוות היה זמין לכל בקשה ודאג שנוכל ליהנות מהיום המיוחד שלנו בראש שקט.

האולם היה מדהים, האוכל היה ברמה גבוהה וקיבל אינספור מחמאות מהאורחים, והשירות היה פשוט יוצא מן הכלל. הרגשנו שכל הצוות עושה מעל ומעבר כדי שהאירוע יהיה מושלם.

תודה ענקית על שהפכתם את יום החתונה שלנו לחוויה בלתי נשכחת. ממליצים עליכם מכל הלב! ❤️

מאור ונופר 💍💍`,
  },
  {
    author: 'שירז צמח',
    date: 'לפני 5 חודשים',
    event_date: '11.02.2026',
    source: 'google',
    text: `התחתנו באחוזת סנדרין בתאריך 11.02.2026 חתונת חורף שהייתה רחוקה ממחשבותינו .. שהגענו לסגור תאריך נפגשנו עם אריה ובשיחה אחת כל המחשבות השתנו , סגרנו את שתי האולמות כל האחוזה הייתה שלנו יחד עם הלובי וחופה ענקית כמו בחלומות באולם שלם לגמריי (הקטן) והמסיבה באולם הגדול!
היחס שקיבלנו היה יותר ממושלם ! כמה מחמאות קיבלנו גם מספר ימים לאחר האירוע , האוכל היחס של הצוות והאווירה הכל וואו ! מודים לאחוזת סנדרין על תהליך מיוחד שעברנו יחד
החל מהדבר הכי קטן ועד הגדול
גולן פרץ עיצובים תודה על עיצוב חופה שלא יישכח !
הגשמתם לנו את כל החלומות !
שירז ולירוי בנגו 🤍`,
  },
  {
    author: 'עמית אפק',
    date: 'לפני חודשיים',
    event_date: '26/5/26',
    source: 'google',
    text: `התחתנו ב 26/5/26 בגן והחוויה הייתה לא רגילה לנו וכמובן לאורחים האוכל היה ברמה גבוהה ביותר !! שפע, הכי היה טרי ומסודר ברמה הכי גבוהה שיש הכל תקתק בזכות הצוות המטורף של האולם ואביב שניהל את האירוע לפרטי פרטים
תודה לרונן אריה מזל לצוות המלון למלצרים לברמנים לשף והטבחים לעובדי הניקיון אין מילים הכל 100/100 זה היה היום המושלם בעולם בזכותכם ❤️🙏🏼`,
  },
  {
    author: 'Bar Ferber',
    date: 'לפני חודשיים',
    source: 'google',
    text: `התחתנו באולמי סנדרין, באולם של הגן
קיבלנו יחס מדהים מכל הצוות שם!! תמיד זמינים וענו לכל הבקשות שלנו, גם האוכל היה טעים וטרי
סך הכל הייתה לנו חוויה ממש טובה בתור זוג שהתחתן שם`,
  },
]
