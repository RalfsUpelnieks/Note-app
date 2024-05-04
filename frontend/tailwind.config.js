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
  plugins: [],
  corePlugins: {
    preflight: false,
  }
}

