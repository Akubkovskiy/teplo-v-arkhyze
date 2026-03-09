/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './lib/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50:  '#f0f7f0',
          100: '#dff0df',
          200: '#c0e0c0',
          300: '#90c890',
          400: '#5aaa5a',
          500: '#3a8f3a',
          600: '#2c6e2c',
          700: '#1e4e1e',
          800: '#143414',
          900: '#0c200c',
        },
        gold: {
          100: '#fdf3dc',
          200: '#f9e4b0',
          300: '#f2cc7a',
          400: '#e8b04a',
          500: '#c8913a',
          600: '#a6721e',
          700: '#7a5214',
        },
        cream: {
          50:  '#fefdfb',
          100: '#faf7f2',
          200: '#f2ebe0',
          300: '#e8deca',
          400: '#d4c8ad',
        },
        stone: {
          400: '#a89378',
          500: '#8b7355',
          600: '#6b5640',
          700: '#4e3e2e',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"Inter"', 'system-ui', 'sans-serif'],
      },
      backgroundSize: {
        '300%': '300% 300%',
      },
      keyframes: {
        mountainDrift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '33%':       { backgroundPosition: '100% 0%' },
          '66%':       { backgroundPosition: '50% 100%' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'mountain-drift': 'mountainDrift 20s ease infinite',
        'fade-up':        'fadeUp 0.7s ease-out forwards',
        'float':          'float 5s ease-in-out infinite',
        'shimmer':        'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
};
