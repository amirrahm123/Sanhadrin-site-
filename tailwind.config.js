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
          DEFAULT: '#C2A14D',
          soft: '#D9C189',
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
