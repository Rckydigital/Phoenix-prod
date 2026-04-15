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
        brand: {
          DEFAULT: '#E85D26',
          dark: '#C44D1E',
          light: '#FF7A45',
        },
        dark: {
          DEFAULT: '#0A0A0A',
          100: '#111111',
          200: '#1A1A1A',
          300: '#222222',
          400: '#333333',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
