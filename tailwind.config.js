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
          600: '#0071e3',
          700: '#005bb8',
          800: '#004a94',
          900: '#003d7a',
          950: '#00264d',
        },
        accent: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
        },
        success: {
          50: '#f0fdf4',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        surface: {
          50: '#ffffff',
          100: '#f5f5f7',
          200: '#e5e5ea',
          300: '#d1d1d6',
          400: '#aeaeb2',
          500: '#8e8e93',
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.7)',
          medium: 'rgba(255, 255, 255, 0.85)',
          heavy: 'rgba(255, 255, 255, 0.95)',
          border: 'rgba(255, 255, 255, 0.8)',
        },
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'card': '0 10px 30px -18px rgba(15, 23, 42, 0.32)',
        'card-hover': '0 14px 40px -18px rgba(15, 23, 42, 0.40)',
        'card-elevated': '0 20px 60px -24px rgba(15, 23, 42, 0.40)',
        'popover': '0 18px 48px -24px rgba(15, 23, 42, 0.36)',
        'focus': '0 0 0 4px rgba(0, 113, 227, 0.14)',
        'glow': '0 0 20px rgba(0, 113, 227, 0.15)',
        'glow-strong': '0 0 30px rgba(0, 113, 227, 0.25)',
        'inner-glow': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.5)',
        'depth': '0 2px 1px rgba(0, 0, 0, 0.03), 0 4px 8px rgba(0, 0, 0, 0.04)',
        'depth-md': '0 2px 1px rgba(0, 0, 0, 0.02), 0 8px 20px rgba(0, 0, 0, 0.06)',
        'depth-lg': '0 2px 1px rgba(0, 0, 0, 0.02), 0 16px 40px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        card: '1.5rem',
        'card-sm': '1.25rem',
        control: '0.75rem',
        pill: '9999px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(0, 113, 227, 0.2)' },
          '50%': { boxShadow: '0 0 20px rgba(0, 113, 227, 0.4)' },
        },
      },
    },
  },
  plugins: [],
};
