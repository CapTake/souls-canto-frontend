/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/**/*.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
        colors: {
            canto: '#06fc99'
        },
    }
  },
  plugins: [],
}
