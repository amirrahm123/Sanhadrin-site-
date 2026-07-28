/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F8F4EC',
        ivory: '#FFFFFF',
        emerald: {
          DEFAULT: '#18463A',
          deep: '#0F3329',
        },
        gold: {
          // Decorative gold: borders, dividers, icons, frames, and TEXT on dark
          // backgrounds (5.57:1 on emerald-deep). Too light for text on a light
          // surface — only 2.25:1 on cream — so never use it for copy there.
          DEFAULT: '#C2A14D',
          soft: '#D9C189',
          // Text-only gold for LIGHT surfaces. Clears WCAG AA 4.5:1 on every
          // light background the site uses: cream 4.78:1, ivory 5.24:1,
          // stone/30 4.50:1, gold/15-over-ivory 4.65:1. Inverts on dark
          // (2.87:1 on emerald-deep) — keep DEFAULT there.
          deep: '#836920',
        },
        stone: '#E6DECF',
        ink: '#2B2A26',
        muted: '#6B665C',
      },
      fontFamily: {
        // Hebrew display / headings
        serif: ['"Frank Ruhl Libre"', 'serif'],
        // Latin display
        display: ['"Cormorant Garamond"', 'serif'],
        // Body / UI
        sans: ['Heebo', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        latin: '0.08em',
      },
      maxWidth: {
        content: '1200px',
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(15, 51, 41, 0.18)',
        card: '0 16px 50px -20px rgba(15, 51, 41, 0.28)',
        header: '0 6px 24px -10px rgba(15, 51, 41, 0.20)',
      },
      keyframes: {
        'scroll-cue': {
          '0%, 100%': { transform: 'translateY(0)', opacity: '0.6' },
          '50%': { transform: 'translateY(8px)', opacity: '1' },
        },
      },
      animation: {
        'scroll-cue': 'scroll-cue 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
