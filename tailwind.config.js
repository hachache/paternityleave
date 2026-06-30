/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"SF Pro Text"', '"SF Pro Display"', '-apple-system', 'BlinkMacSystemFont', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        display: ['"SF Pro Display"', '"SF Pro Text"', '-apple-system', 'BlinkMacSystemFont', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#d9ecff',
          200: '#b8dcff',
          300: '#86c5ff',
          400: '#4aa7f5',
          500: '#0071e3',
          600: '#0066cc',
          700: '#0055aa',
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
          300: '#fafafc',
          900: '#1d1d1f',
        },
      },
      boxShadow: {
        'soft': '0 1px 2px rgba(0, 0, 0, 0.03)',
        'glass': '0 1px 2px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 0 1px rgba(0, 102, 204, 0.18)',
      },
      animation: {
        'pop': 'pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0.95)' },
          '40%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
