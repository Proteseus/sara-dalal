/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#FFB6C1',
          DEFAULT: '#FF69B4',
          dark: '#DB7093',
        },
        secondary: {
          light: '#E6E6FA',
          DEFAULT: '#D8BFD8',
          dark: '#9370DB',
        },
        accent: {
          light: '#98FB98',
          DEFAULT: '#90EE90',
          dark: '#32CD32',
        },
        background: {
          light: '#FFF5EE',
          DEFAULT: '#FFFAF0',
          dark: '#FDF5E6',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
};