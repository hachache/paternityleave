/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#d9ecff',
          200: '#b8dcff',
          300: '#86c5ff',
          400: '#4aa7f5',
          500: '#147ce5',
          600: '#0071e3', // Primary Brand Color (Apple Blue)
          700: '#005bb8',
          800: '#004a94',
          900: '#003d7a',
          950: '#00264d',
        },
        accent: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6', // Secondary Action
          600: '#2563eb',
        },
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
        },
        surface: {
          50: '#ffffff',
          100: '#f5f5f7', // Page background
          200: '#e5e5ea', // Borders
        },
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'card': '0 10px 30px -18px rgba(15, 23, 42, 0.32)',
        'popover': '0 18px 48px -24px rgba(15, 23, 42, 0.36)',
        'focus': '0 0 0 4px rgba(0, 113, 227, 0.14)',
      },
      borderRadius: {
        card: '1.5rem',
        control: '0.75rem',
      },
    },
  },
  plugins: [],
};
