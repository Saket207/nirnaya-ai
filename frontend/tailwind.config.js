/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf8f5',
          100: '#fbf4ef',
          200: '#f5e9df',
          300: '#fdeae5',
          400: '#e89580',
          500: '#d9684c', // Primary Noovotic terracotta
          600: '#b2553e', // Deep Noovotic rust
          700: '#8c402e',
          800: '#59271b',
          900: '#312c29', // Deep espresso
          950: '#1c1816',
        },
        noovotic: {
          linen: '#FBF4EF',
          oatmeal: '#F5F0EC',
          espresso: '#312C29',
          stone: '#5D5753',
          muted: '#7A736E',
          border: '#DED1C9',
          terracotta: '#D9684C',
          rust: '#B2553E',
          tint: '#FDEAE5',
          card: '#FFFFFF',
        },
        risk: {
          low: '#2e7d32', // refined forest green
          medium: '#d9684c', // terracotta amber
          high: '#c62828', // rich crimson
        }
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['"DM Sans"', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
