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
            50: '#f0f9f0',
            100: '#dcf0dd',
            200: '#bce4be',
            300: '#91d094',
            400: '#65b66a',
            500: '#489c4d',
            600: '#3a7e3f',
            700: '#316435',
            800: '#2a512e',
            900: '#244528',
            950: '#0f260f',
          },
          secondary: {
            50: '#f7f7f6',
            100: '#e5e3df',
            200: '#cbc6be',
            300: '#aea498',
            400: '#938374',
            500: '#7e6c5d',
            600: '#65564a',
            700: '#52463c',
            800: '#423932',
            900: '#38302b',
            950: '#201c18',
          },
          accent: {
            50: '#fef7ec',
            100: '#fdecc9',
            200: '#fbd88e',
            300: '#f8bc4e',
            400: '#f5a52a',
            500: '#ec8413',
            600: '#cf630c',
            700: '#aa450e',
            800: '#8a3812',
            900: '#723014',
            950: '#411708',
          },
          success: '#15803d',
          warning: '#eab308',
          danger: '#b91c1c',
          info: '#0ea5e9'
        },
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
          heading: ['Montserrat', 'sans-serif']
        },
        boxShadow: {
          card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
        borderRadius: {
          'card': '0.5rem',
        }
      },
    },
    plugins: [],
  }