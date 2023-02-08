/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/**/*.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
    },
    fontFamily: {
        digits: ['Bitter', 'serif'],
        nice: ['Londrina Solid', 'cursive'],
    }
  },
  plugins: [],
}
