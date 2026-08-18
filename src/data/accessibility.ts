// ---------------------------------------------------------------------------
// Accessibility statement (הצהרת נגישות) — the CLIENT'S LEGAL TEXT, VERBATIM.
//
// Do not rewrite, reorder, shorten or "improve" any string in this file. If the
// client sends revised wording, replace the strings; do not edit them in place
// to match the site's copy style. The page at /accessibility renders these in
// order and adds no copy of its own.
//
// The feature list must keep describing what the widget actually does — see
// STEPPERS/TOGGLES in src/components/AccessibilityWidget.tsx. If a control is
// ever removed, the client has to be asked to amend the statement; the site
// must never claim an accessibility feature it does not provide.
// ---------------------------------------------------------------------------

export const ACCESSIBILITY = {
  intro: [
    'אחוזת סנדרין ונוס בע"מ מאמינה בהנגשה ואיכות השירות.',
    'אנו פועלים ועובדים עבור ערך שוויון זכויות ונגישות לאנשים עם מוגבלויות.',
    'כחלק מהפעולות בוצעה הנגשה באתר האינטרנט על מנת לאפשר לכלל האזרחים להתרשם מהאתר. יש לציין שהאתר הינו תדמיתי בלבד.',
    'כמו כן אחוזת סנדרין הנגישה את מרחבי האולם באופן מקסימלי עבור האורחים אשר מגיעים להנות מהאולם, החל מחנייה נגישה, שירותים, ראמפה ועוד.',
  ],

  featuresIntro: 'הנגשת אתר האינטרנט שלנו פועלת למענכם, ובה תוכלו להיעזר:',

  features: [
    'תצוגה ברורה של רכיבי האתר.',
    'אפשרות לשינוי גודל הגופן.',
    'התאמה לדפדפנים שונים.',
    'התאמה לעבודה ברזולוציות שונות.',
    'כבדי ראייה — ביטול צבעים והפיכת הצבעים לגווני אפור.',
    'כבדי ראייה — מצבי ניגודיות גבוהה והפוכה, ושליטה בבהירות וברוויה.',
    'הפסקת הבהובים — עצירת אנימציות ותנועה באתר.',
    'פונט קריא — מחליף את הפונט לפונט אחיד לאורך כל האתר.',
    'הדגשת קישורים — מדגיש בעזרת קו סימון את הקישורים באתר.',
    'סמן גדול — הגדלת סמן העכבר לנראות טובה יותר.',
  ],

  outro: [
    'במידה ותרצו סיוע ועזרה נוספים אנו מעמידים מענה טלפוני אישי עבור כלל לקוחותינו, ונשמח להיות עבורכם אוזן קשבת ומענה אנושי ואישי, כך שנשמח שתיצרו עימנו קשר ותגידו לנו כיצד נוכל לשפר למענכם את ההנגשה.',
    'במידה ותמצאו חלקים ספציפיים באתר או באולם שאינם נגישים לשביעות רצונכם, בבקשה צרו איתנו קשר על מנת שנוכל להשתפר ולעמוד לשירותכם.',
  ],

  contactHeading: 'צור קשר:',
  // Labels and values are split only so the value can be a live mailto:/tel:
  // link. The rendered sentence reads exactly as the client wrote it.
  emailLabel: 'מייל:',
  email: 'morvsandrine@gmail.com',
  phoneLabel: 'הזמנות ושירות לקוחות:',
  // Displayed exactly as the client wrote it. The tel: href uses the site's
  // shared international number (CONTACT.phoneIntl) — same line, dialable.
  phone: '04-6222221',
} as const
