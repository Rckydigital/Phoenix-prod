import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs du logo RCKY DIGITAL
        brand: {
          DEFAULT: '#E8742A', // orange du phénix (décor, grandes surfaces)
          deep: '#B4511A', // orange foncé : boutons et textes (contraste suffisant)
          soft: '#FDF0E6', // fond orangé très clair
        },
        teal: { DEFAULT: '#2A93A8', deep: '#1F6F80', soft: '#E7F4F6' },
        plum: { DEFAULT: '#7A2E6B', soft: '#F5EAF2' },
        ember: '#C8383C',
        ink: { DEFAULT: '#1E2A33', soft: '#4B5863', muted: '#6B7680' },
        sand: '#FAF7F3',
        line: '#ECE6DF',
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        site: '72rem',
      },
    },
  },
  plugins: [],
}

export default config
