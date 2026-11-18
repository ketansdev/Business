/**
 * Design system constraints (landing-page-design skill):
 * - Spacing (padding / margin / gap / space) is locked to the token scale below.
 * - One typeface: Geist. Text sizes come from Tailwind's default scale via named text styles in index.css.
 * - Default transition curve is the base curve cubic-bezier(0.22,1,0.36,1).
 */

// Spacing tokens: Spacing-0 … Spacing-900
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
        sans: ['"Geist Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        container: '1240px',
        hero: '680px',
      },
      boxShadow: {
        soft: '0 1px 2px rgb(24 24 24 / 0.04), 0 8px 24px -12px rgb(24 24 24 / 0.12)',
        lift: '0 2px 4px rgb(24 24 24 / 0.04), 0 24px 48px -20px rgb(24 24 24 / 0.22)',
        card: '0 0 0 1px rgb(24 24 24 / 0.06), 0 12px 32px -16px rgb(24 24 24 / 0.16)',
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
