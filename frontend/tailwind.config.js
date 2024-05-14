const plugin = require('tailwindcss/plugin')
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'Roboto': ['Arial', 'sans-serif'],
      },
      colors: {
        'SideMenuBackground': '#2f323a',
        'SideMenuHover': '#282a31',
        'SideMenuSelected': '#1f2227'
      }
    }
  },
  plugins: [
    plugin(function ({addVariant}) {
        addVariant('progress-filled', ['&::-webkit-progress-bar', '&::-moz-progress-bar', '&']);
        addVariant('progress-unfilled', ['&::-webkit-progress-value', '&::-moz-progress-value', '&']);
    })
  ],
  corePlugins: {
    preflight: false,
  }
}

