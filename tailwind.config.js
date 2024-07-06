/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      screens: {
        'custom-lg': '601px',
        'custom-sm': '384px',
      },
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}