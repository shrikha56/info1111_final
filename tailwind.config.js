/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          50: '#fdf2f2',
          100: '#fbe6e6',
          200: '#f5d0d0',
          300: '#eeadad',
          400: '#e47d7d',
          500: '#d65454',
          600: '#c13333',
          700: '#a12727',
          800: '#852323',
          900: '#702020',
        },
      },
    },
  },
  plugins: [],
} 