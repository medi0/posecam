/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: {
          50: '#faf9f6',
          100: '#f4f1ea',
          200: '#e8e2d4',
          300: '#d6ccb8',
        },
        warm: {
          400: '#9c8b72',
          500: '#7d6b52',
          600: '#5c4d38',
        },
        accent: {
          400: '#e8a87c',
          500: '#d4895a',
          600: '#b86e3a',
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
