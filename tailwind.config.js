/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0C0C0C',
        surface: '#141419',
        ink: '#D7E2EA',
        muted: '#8A929B',
        monitor: '#4FC9FF',
        'monitor-2': '#A8E8FF',
        pop: '#B600A8',
      },
      fontFamily: {
        sans: ['Kanit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
