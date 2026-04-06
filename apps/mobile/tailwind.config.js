/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Base
        background: '#071327',
        'background-dark': '#030e22',
        // Surface hierarchy - Tonal Layering
        surface: '#071327', // Level 0 - Base
        'surface-container-lowest': '#030e22',
        'surface-container-low': '#101b30', // Level 1
        'surface-container': '#142034', // Level 2 - Cards
        'surface-container-high': '#1f2a3f',
        'surface-container-highest': '#2a354a', // Level 3 - Modals
        'surface-bright': '#2e394f',
        'surface-variant': '#2a354a',
        // Primary
        primary: '#90d4ef',
        'primary-container': '#74b8d3',
        'primary-fixed': '#b9eaff',
        'primary-fixed-dim': '#8cd0ec',
        // Secondary
        secondary: '#b8c5f6',
        'secondary-container': '#38456f',
        'secondary-fixed': '#dbe1ff',
        // Tertiary
        tertiary: '#c5cbd1',
        'tertiary-container': '#a9b0b5',
        // Text colors (Material You naming)
        'on-background': '#d7e2ff',
        'on-surface': '#d7e2ff',
        'on-surface-variant': '#bfc8cd',
        'on-primary': '#003544',
        'on-primary-container': '#00485c',
        'on-secondary': '#212e57',
        'on-secondary-container': '#a7b3e4',
        // Legacy aliases for compatibility
        text: '#d7e2ff',
        'text-secondary': '#bfc8cd',
        // Outlines - Ghost Border Rule
        outline: '#899297',
        'outline-variant': '#3f484c',
        // Error
        error: '#ffb4ab',
        'error-container': '#93000a',
        'on-error': '#690005',
        'on-error-container': '#ffdad6',
        // Inverse
        'inverse-surface': '#d7e2ff',
        'inverse-on-surface': '#253046',
        'inverse-primary': '#15667f',
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        full: '9999px',
      },
      fontFamily: {
        display: ['Manrope'],
        headline: ['Manrope'],
        body: ['Manrope'],
        label: ['Manrope'],
      },
    },
  },
  plugins: [],
}
