/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        wine: { 950: '#12040a', 900: '#1d0710', 800: '#2c0b19', 700: '#431022', 600: '#5e1830', 500: '#7b2140' },
        gold: { 300: '#f6d58b', 400: '#ecbd62', 500: '#d9a441', 600: '#b88530' },
        cream: { 50: '#fbf6ea', 100: '#f4ead2', 200: '#e9dab8', 300: '#d8c397' },
        olive: { 400: '#8a9a4a', 500: '#6b7a3a', 600: '#515e2a' },
        lemon: { 300: '#f7e57a', 400: '#f2d94e' },
        ruby: { 500: '#b8213a', 600: '#9b1b30', 700: '#7e1226' },
        ink: { DEFAULT: '#3a0f1c', soft: '#6b3a45' },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        script: ['Italianno', '"Snell Roundhand"', 'cursive'],
        hand: ['Caveat', '"Bradley Hand"', 'cursive'],
        sans: ['"Inter Variable"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      letterSpacing: { widest2: '0.32em' },
    },
  },
  plugins: [],
};
