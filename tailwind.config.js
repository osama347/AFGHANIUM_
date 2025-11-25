/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3A9D58',
          dark: '#1F5130',
          light: '#4DB86E',
        },
        secondary: {
          DEFAULT: '#C4D7C4',
          light: '#E5F0E5',
          dark: '#A8C4A8',
        },
        accent: {
          gold: '#D4AF37',
          green: '#1F5130',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      backgroundImage: {
        'afghan-pattern': "url('/patterns/afghan-pattern.svg')",
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(58, 157, 88, 0.1), 0 4px 6px -2px rgba(58, 157, 88, 0.05)',
        'md-green': '0 4px 6px -1px rgba(58, 157, 88, 0.1), 0 2px 4px -1px rgba(58, 157, 88, 0.06)',
      },
    },
  },
  plugins: [],
}
