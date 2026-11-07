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
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb', // primary blue
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        khqr: {
          red: '#e11d48',
          gold: '#f59e0b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Khmer', 'system-ui', 'sans-serif'],
        khmer: ['Noto Sans Khmer', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

