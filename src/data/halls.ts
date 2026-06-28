// Hall specs. Each hall is a card in the Halls section.

export type AspectRatio = '16/9' | '4/5' | '1/1' | '3/2'

export type Hall = {
  id: string
  name: string // Latin display name
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
  title: 'שלושה אולמות, חוויה אחת יוצאת דופן',
  intro:
    'כל אולם הוא עולם בפני עצמו — מסכי LED ענקיים, תאורה חכמה ומודרנית, וילונות אווירה הנפתחים אל הגנים והאקוודוקט המואר, וגג לבן קעור בצורת חופה ענקית. לכל אירוע מעצב מקצועי מבית האחוזה.',
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
    he: 'אולם + גן',
    capacity: 'עד 1000 אורחים',
    tagline: 'אולם הדגל',
    description:
      'גולת הכותרת של האחוזה — אולם ענק הנפתח אל גן פרטי, עם מסכי LED עוצמתיים וגג חופה לבן ומרהיב. הבמה המושלמת לאירועי הענק.',
    highlights: ['מסכי LED ענקיים', 'וילונות אווירה אל הגן', 'גג חופה לבן דרמטי'],
    imageLabel: 'אולם Palais',
    flagship: true,
  },
  {
    id: 'chateau',
    name: 'Chateau',
    he: 'אולם + גן',
    capacity: 'עד 500 אורחים',
    tagline: 'יוקרה במידה מושלמת',
    description:
      'אולם מפואר עם גן צמוד, המשלב אינטימיות ופאר. תאורה חכמה ווילונות הנפתחים אל הירוק יוצרים אווירה חמה ומלכותית.',
    highlights: ['תאורה חכמה ומודרנית', 'גן צמוד פרטי', 'אווירה אינטימית ומלכותית'],
    imageLabel: 'אולם Chateau',
  },
  {
    id: 'garden-hall',
    name: 'Garden',
    he: 'אולם בוטיק אינטימי',
    capacity: 'אולם בוטיק',
    tagline: 'בהשראת צרפת ורומא',
    description:
      'אולם בוטיק אינטימי בהשראה צרפתית-רומית, לאירועים מצומצמים ומוקפדים. כל פרט תוכנן ביד אמן — מקום שבו האווירה היא הכוכבת.',
    highlights: ['עיצוב צרפתי-רומי', 'אווירה בוטיק מוקפדת', 'מושלם לאירועים אינטימיים'],
    imageLabel: 'אולם Garden',
  },
]
