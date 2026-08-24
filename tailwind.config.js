/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#08090A',
        surface: '#0E1012',
        'surface-2': '#131619',
        ink: '#E8E9EC',
        muted: '#8D949E',
        faint: '#5D636C',
        // fills only — see the note in index.css
        fill: '#071E17',
        'fill-2': '#0A2A20',
        // strokes only
        line: '#7FA292',
        'line-bright': '#9FBFB0',
        eye: '#8FD8FF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Instrument Serif', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      transitionTimingFunction: {
        lux: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
