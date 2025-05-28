/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ccb: {
          orange: '#F99D2A',
          'orange-dark': '#E88A1F',
          blue: '#00BDF2',
          'blue-dark': '#0099CC',
          gray: '#474C55',
          'gray-light': '#F5F5F5',
          'gray-dark': '#2C2C2C'
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'slide-down': 'slide-down 0.5s ease-out',
      },
      keyframes: {
        'fade-in': {
          'from': {
            opacity: '0',
            transform: 'translateY(20px)'
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'slide-up': {
          'from': {
            transform: 'translateY(100%)'
          },
          'to': {
            transform: 'translateY(0)'
          }
        },
        'slide-down': {
          'from': {
            transform: 'translateY(-100%)'
          },
          'to': {
            transform: 'translateY(0)'
          }
        }
      }
    },
  },
  plugins: [],
}