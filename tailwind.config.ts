import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'
import colors from 'tailwindcss/colors'

export default <Partial<Config>>{
  darkMode: 'class',
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './App.{js,ts,vue}',
    './app.{js,ts,vue}',
    './Error.{js,ts,vue}',
    './error.{js,ts,vue}',
  ],
  theme: {
    extend: {
      maxWidth: {
        '8xl': '90rem',
      },
      colors: {
        // Cosmic Theme Palette
        primary: {
          400: '#c084fc', // Purple for accents
          500: '#a855f7',
          600: '#9333ea',
        },
        secondary: {
          400: '#22d3ee', // Cyan for accents
          500: '#06b6d4',
        },
        dark: {
          950: '#020617', // Deepest background
          900: '#0f172a', // Card background
          800: '#1e293b',
        },
        // Legacy support (optional, can be mapped to new palette)
        green: colors.emerald,
        blue: colors.sky,
        red: colors.rose,
        slate: colors.slate,
        blackBlue: '#0E6CC2',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', ...defaultTheme.fontFamily.sans],
        display: ['Outfit', ...defaultTheme.fontFamily.sans],
      },
      backgroundImage: {
        'cosmic-gradient': 'linear-gradient(to right bottom, #020617, #0f172a, #1e1b4b)',
      },
    },
  },
}
