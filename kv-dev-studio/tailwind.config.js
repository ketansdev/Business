/**
 * Design system constraints:
 * - Spacing (padding / margin / gap / space) is locked to the token scale below.
 * - Two typefaces: Manrope (headings, `font-display`) and Inter (body and UI, `font-sans`), both self hosted.
 *   Text sizes come from the named, fluid text styles in index.css.
 * - Default transition curve is the base curve cubic-bezier(0.22,1,0.36,1).
 */

// Spacing tokens: Spacing-0 … Spacing-1100
const space = {
  0: '0px',
  0.5: '2px', // Spacing-25
  1: '4px', // Spacing-50
  2: '8px', // Spacing-75
  3: '12px', // Spacing-100
  4: '16px', // Spacing-200
  6: '24px', // Spacing-300
  8: '32px', // Spacing-400
  10: '40px', // Spacing-500
  12: '48px', // Spacing-600
  16: '64px', // Spacing-700
  20: '80px', // Spacing-800
  24: '96px', // Spacing-900
  28: '112px', // Spacing-1000
  32: '128px', // Spacing-1100
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./*.html', './src/**/*.{js,jsx}'],
  theme: {
    padding: space,
    margin: { ...space, auto: 'auto' },
    gap: space,
    space,
    scrollMargin: space,
    extend: {
      colors: {
        // Brand tokens live in src/index.css as CSS variables; change them there.
        ink: {
          DEFAULT: 'rgb(var(--ink) / <alpha-value>)',
          soft: 'rgb(var(--ink-soft) / <alpha-value>)',
          muted: 'rgb(var(--ink-muted) / <alpha-value>)',
        },
        paper: {
          DEFAULT: 'rgb(var(--paper) / <alpha-value>)',
          raised: 'rgb(var(--paper-raised) / <alpha-value>)',
          sunken: 'rgb(var(--paper-sunken) / <alpha-value>)',
        },
        // Approved dark surfaces only
        night: {
          DEFAULT: '#181818',
          1: '#1F1F1F',
          2: '#272727',
          3: '#313131',
        },
        line: 'rgb(var(--line) / <alpha-value>)',
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          soft: 'rgb(var(--accent-soft) / <alpha-value>)',
          ink: 'rgb(var(--accent-ink) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Manrope Variable"', '"Inter Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        // 1408px container = 1280px of content inside the 64px desktop gutters
        container: '1408px',
        hero: '680px',
      },
      borderRadius: {
        // Radius scale: inputs 12px (xl), tiles 16px (2xl), cards 24px (3xl), dark panel 32–40px (4xl / 5xl), actions pill
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgb(24 24 24 / 0.04), 0 8px 24px -12px rgb(24 24 24 / 0.12)',
        lift: '0 2px 4px rgb(24 24 24 / 0.04), 0 24px 48px -20px rgb(24 24 24 / 0.22)',
        card: '0 0 0 1px rgb(24 24 24 / 0.06), 0 12px 32px -16px rgb(24 24 24 / 0.16)',
        'card-hover': '0 0 0 1px rgb(24 24 24 / 0.08), 0 28px 56px -24px rgb(24 24 24 / 0.28)',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.22, 1, 0.36, 1)',
        base: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      transitionDuration: {
        DEFAULT: '300ms',
      },
    },
  },
  plugins: [],
};
