import plugin from 'tailwindcss/plugin'

function withOpacity(color: string) {
  return `hsla(var(${color}), <alpha-value>)`
}

export const shadcnPlugin = plugin(
  function ({ addBase, addUtilities }) {
    addBase({
      '*': { '@apply border-border': {} },
      body: { '@apply bg-background text-foreground': {} },
    })
    addUtilities({})
  },
  {
    theme: {
      container: {
        center: true,
        padding: '2rem',
        screens: {
          '2xl': '1400px',
        },
      },
      extend: {
        colors: {
          neutral: {
            DEFAULT: withOpacity('--neutral'),
            50: withOpacity('--neutral-50'),
            100: withOpacity('--neutral-100'),
            200: withOpacity('--neutral-200'),
            300: withOpacity('--neutral-300'),
            400: withOpacity('--neutral-400'),
            500: withOpacity('--neutral-500'),
            600: withOpacity('--neutral-600'),
            700: withOpacity('--neutral-700'),
            800: withOpacity('--neutral-800'),
            900: withOpacity('--neutral-900'),
            950: withOpacity('--neutral-950'),
            1000: withOpacity('--neutral-1000'),
          },
          base: {
            50: withOpacity('--base-50'),
            100: withOpacity('--base-100'),
            200: withOpacity('--base-200'),
            300: withOpacity('--base-300'),
            400: withOpacity('--base-400'),
            500: withOpacity('--base-500'),
            600: withOpacity('--base-600'),
            700: withOpacity('--base-700'),
            800: withOpacity('--base-800'),
            900: withOpacity('--base-900'),
            950: withOpacity('--base-950'),
            1000: withOpacity('--base-1000'),
          },
          complementary: {
            50: withOpacity('--complementary-50'),
            100: withOpacity('--complementary-100'),
            200: withOpacity('--complementary-200'),
            300: withOpacity('--complementary-300'),
            400: withOpacity('--complementary-400'),
            500: withOpacity('--complementary-500'),
            600: withOpacity('--complementary-600'),
            700: withOpacity('--complementary-700'),
            800: withOpacity('--complementary-800'),
            900: withOpacity('--complementary-900'),
            950: withOpacity('--complementary-950'),
            1000: withOpacity('--complementary-1000'),
          },
          negative: {
            50: withOpacity('--negative-50'),
            100: withOpacity('--negative-100'),
            200: withOpacity('--negative-200'),
            300: withOpacity('--negative-300'),
            400: withOpacity('--negative-400'),
            500: withOpacity('--negative-500'),
            600: withOpacity('--negative-600'),
            700: withOpacity('--negative-700'),
            800: withOpacity('--negative-800'),
            900: withOpacity('--negative-900'),
            950: withOpacity('--negative-950'),
            1000: withOpacity('--negative-1000'),
          },
          background: withOpacity('--background'),
          foreground: withOpacity('--foreground'),
          primary: {
            DEFAULT: withOpacity('--primary'),
            foreground: withOpacity('--primary-foreground'),
          },
          secondary: {
            DEFAULT: withOpacity('--secondary'),
            foreground: withOpacity('--secondary-foreground'),
          },
          muted: {
            DEFAULT: withOpacity('--muted'),
            foreground: withOpacity('--muted-foreground'),
          },
          accent: {
            DEFAULT: withOpacity('--accent'),
            foreground: withOpacity('--accent-foreground'),
          },
          destructive: {
            DEFAULT: withOpacity('--destructive'),
            foreground: withOpacity('--destructive-foreground'),
          },
          popover: {
            DEFAULT: withOpacity('--popover'),
            foreground: withOpacity('--popover-foreground'),
          },
          card: {
            DEFAULT: withOpacity('--card'),
            foreground: withOpacity('--card-foreground'),
          },
          border: withOpacity('--border'),
          input: withOpacity('--input'),
          ring: withOpacity('--ring'),
        },
        borderRadius: {
          lg: 'var(--radius)',
          md: 'calc(var(--radius) - 2px)',
          sm: 'calc(var(--radius) - 4px)',
        },
        keyframes: {
          'accordion-down': {
            from: { height: '0' },
            to: { height: 'var(--radix-accordion-content-height)' },
          },
          'accordion-up': {
            from: { height: 'var(--radix-accordion-content-height)' },
            to: { height: '0' },
          },
        },
        animation: {
          'accordion-down': 'accordion-down 0.2s ease-out',
          'accordion-up': 'accordion-up 0.2s ease-out',
        },
      },
    },
  }
)
