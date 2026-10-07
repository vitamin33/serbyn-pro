import type { Config } from 'tailwindcss'

// Colors are the hex tokens in styles/theme.css. color-mix keeps Tailwind's
// opacity modifiers working (`bg-primary/10`) without converting the tokens to
// channel triplets, so the tokens stay exactly as in the reference.
const token = (name: string) =>
  `color-mix(in srgb, var(${name}) calc(<alpha-value> * 100%), transparent)`

const config: Config = {
  // Dark mode is token-driven (prefers-color-scheme + data-theme), so `dark:`
  // variants are not needed. If one is ever added, it follows the same rules.
  darkMode: ['variant', ['@media (prefers-color-scheme: dark) { &:not([data-theme=light] *) }', '&:is([data-theme=dark] *)']],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.mdx',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--body)'],
        display: ['var(--display)'],
        mono: ['var(--mono)'],
      },
      maxWidth: {
        measure: 'var(--measure)',
        wide: 'var(--wide)',
      },
      colors: {
        // reference token names
        bg: token('--bg'),
        surface: token('--surface'),
        fg: token('--fg'),
        line: token('--line'),
        soft: token('--accent-soft'),
        tier: {
          a: token('--tier-a'),
          b: token('--tier-b'),
          c: token('--tier-c'),
          d: token('--tier-d'),
        },
        // shadcn names, mapped onto the reference tokens. Note the clash:
        // shadcn `accent` is a hover background (→ --accent-soft); the
        // reference's deep green --accent is Tailwind `primary`.
        border: token('--line'),
        input: token('--line'),
        ring: token('--accent'),
        background: token('--bg'),
        foreground: token('--fg'),
        primary: {
          DEFAULT: token('--accent'),
          foreground: token('--bg'),
        },
        secondary: {
          DEFAULT: `color-mix(in srgb, color-mix(in srgb, var(--line) 45%, var(--surface)) calc(<alpha-value> * 100%), transparent)`,
          foreground: token('--fg'),
        },
        destructive: {
          DEFAULT: token('--tier-d'),
          foreground: token('--bg'),
        },
        success: token('--tier-a'),
        warning: token('--tier-c'),
        muted: {
          DEFAULT: token('--bg'),
          foreground: token('--muted'),
        },
        accent: {
          DEFAULT: token('--accent-soft'),
          foreground: token('--fg'),
        },
        popover: {
          DEFAULT: token('--surface'),
          foreground: token('--fg'),
        },
        card: {
          DEFAULT: token('--surface'),
          foreground: token('--fg'),
        },
      },
      // Reference radii: 6px for frames and cards, 4px for diagram boxes and
      // small controls, 3px for tags. `rounded-full` (dots) is untouched.
      borderRadius: {
        DEFAULT: 'var(--radius)',
        lg: 'var(--radius)',
        md: 'var(--radius)',
        sm: 'var(--radius-sm)',
      },
    },
  },
  plugins: [],
}
export default config
