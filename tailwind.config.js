/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/**/*.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
        colors: {
            canto: '#06fc99'
        },
    },
    fontFamily: {
        digits: ['Bitter', 'serif'],
        mono: ['ui-monospace', 'serif']
    }
  },
  plugins: [],
}
