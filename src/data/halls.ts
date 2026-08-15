// Hall specs. Each hall is a card in the Halls section.

export type AspectRatio = '16/9' | '4/5' | '1/1' | '3/2'

export type Hall = {
  id: string
  name: string // display name (Latin or Hebrew — see latinName)
  /**
   * True when `name` is written in Latin script, so the card renders it in the
   * Latin display face with its letter-spacing (`.latin`). Leave unset for a
   * Hebrew name: Cormorant Garamond has no Hebrew glyphs, and `tracking-latin`
   * pulls Hebrew letters apart. Explicit on purpose — sniffing the first
   * character would silently pick the wrong face for a name starting with a
   * quote, a digit, or any non-Latin character.
   */
  latinName?: boolean
  he: string // Hebrew descriptor
  capacity: string
  tagline: string
  description: string
  highlights: string[]
  imageLabel: string
  flagship?: boolean
}

// Highlights shared across the venue, woven per hall.
export const HALLS_SECTION = {
  eyebrow: 'The Halls',
  title: 'שלוש אחוזות, חוויה אחת יוצאת דופן',
  intro:
    'כל אחוזה היא עולם ומלואו — מסכי LED ענקיים, תאורה חכמה ומודרנית, וילונות אווירה הנפתחים אל הגנים והאקוודוקט המואר, וגג לבן קעור בצורת חופה ענקית. לכל אירוע מעצב מקצועי מבית האחוזה.',
  sharedHighlights: [
    'שתי סוויטות מלכותיות לזוג',
    'בית כנסת בלב האחוזה',
    'קייטרינג כשר מלא בהשגחת הרבנות',
    'מעצב בית מקצועי לכל אירוע',
  ],
  cta: 'לפרטים נוספים',
} as const

export const HALLS: Hall[] = [
  {
    id: 'palais',
    name: 'Palais',
    latinName: true,
    he: 'אחוזה + גן',
    capacity: 'עד 1,800 אורחים',
    tagline: 'אחוזת הדגל',
    description:
      'גולת הכותרת של המתחם — אחוזה ענקית הנפתחת אל גן פרטי, עם מסכי LED עוצמתיים וגג חופה לבן ומרהיב. הבמה המושלמת לאירועי הענק.',
    highlights: ['מסכי LED ענקיים', 'וילונות אווירה אל הגן', 'גג חופה לבן דרמטי'],
    imageLabel: 'אחוזת Palais',
    flagship: true,
  },
  {
    id: 'chateau',
    name: 'Chateau',
    latinName: true,
    he: 'אחוזה + גן',
    capacity: 'עד 500 אורחים',
    tagline: 'יוקרה במידה מושלמת',
    description:
      'אחוזה מפוארת עם גן צמוד, המשלבת אינטימיות ופאר. תאורה חכמה ווילונות הנפתחים אל הירוק יוצרים אווירה חמה ומלכותית.',
    highlights: ['תאורה חכמה ומודרנית', 'גן צמוד פרטי', 'אווירה אינטימית ומלכותית'],
    imageLabel: 'אחוזת Chateau',
  },
  {
    id: 'garden-hall',
    name: 'אקוודוקט',
    he: 'אחוזת בוטיק אינטימית',
    capacity: 'אחוזת בוטיק',
    tagline: 'בהשראת צרפת ורומא',
    description:
      'אחוזת בוטיק אינטימית בהשראה צרפתית-רומית, לאירועים מצומצמים ומוקפדים. כל פרט תוכנן ביד אמן — מקום שבו האווירה היא הכוכבת.',
    highlights: ['עיצוב צרפתי-רומי', 'אווירה בוטיק מוקפדת', 'מושלמת לאירועים אינטימיים'],
    imageLabel: 'אחוזת אקוודוקט',
  },
]
