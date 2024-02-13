/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'Roboto': ['Arial', 'sans-serif'],
        'Helvetica': ['sans-serif']
      }
    }
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  }
}

