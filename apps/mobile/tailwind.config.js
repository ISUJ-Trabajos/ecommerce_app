/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: '#071327',
        surface: '#132149',
        'surface-low': '#101b30',
        'surface-high': '#2a354a',
        primary: '#74b8d3',
        text: '#ededea',
        'text-secondary': '#7d8489'
      },
    },
  },
  plugins: [],
}
