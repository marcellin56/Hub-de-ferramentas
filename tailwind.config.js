/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#13DA87',
          50: '#f0fdf7',
          100: '#dbfceb',
          200: '#bbf7d9',
          300: '#13DA87', // Main
          400: '#0ea365', // Darker for hover/text
          500: '#13DA87',
          600: '#0d945b',
          700: '#0b7549',
          800: '#0a5c3b',
          900: '#084c31',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'soft-glow': '0 20px 40px -10px rgba(0, 0, 0, 0.05), 0 0 15px rgba(19, 218, 135, 0.2)',
        'inner-light': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.3)',
      }
    }
  },
  plugins: [],
}