/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['SF Pro Text', 'SF Pro Display', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['SF Pro Display', 'SF Pro Text', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        hand: ['SF Pro Text', 'SF Pro Display', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif']
      },
      colors: {
        brand: {
          50: '#f1f7ff',
          100: '#d6e9ff',
          200: '#b8d9ff',
          300: '#8bbfff',
          400: '#4a98ff',
          500: '#0071e3',
          600: '#0068d1',
          700: '#005bb6',
          800: '#004a94',
          900: '#00396f'
        },
        success: {
          50: '#edfdf3',
          100: '#d7f7e2',
          500: '#34c759',
          600: '#28a745'
        },
        surface: {
          50: '#ffffff',
          100: '#f5f5f7',
          200: '#ebebed'
        }
      },
      boxShadow: {
        soft: '0 8px 30px rgba(0, 0, 0, 0.06)',
        glow: '0 0 20px rgba(0, 113, 227, 0.16)'
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease',
        'fade-in': 'fadeIn 0.3s ease',
        'fade-in-delay': 'fadeIn 0.6s ease',
        'slide-up': 'slideUp 0.5s ease',
        'slide-in': 'slideIn 0.5s ease',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
        pop: 'pop 0.3s ease'
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(14px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        },
        slideIn: {
          '0%': { opacity: 0, transform: 'translateX(-8px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' }
        },
        bounceSubtle: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-3px)' }
        },
        pulseSubtle: {
          '0%,100%': { opacity: '0.75' },
          '50%': { opacity: '1' }
        },
        pop: {
          '0%': { transform: 'scale(0.98)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 }
        }
      }
    }
  },
  plugins: []
}
