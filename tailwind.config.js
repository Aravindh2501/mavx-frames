/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '.dark'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: 'rgb(var(--paper) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        mute: 'rgb(var(--mute) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)'
      },
      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}
