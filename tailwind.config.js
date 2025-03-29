/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'sky-blue': '#a6d8ff',
          'sky-blue-light': '#e8f6ff',
          'primary': '#3a86b7',
          'secondary': '#4CAF50',
          'accent': '#ff9800',
        },
      },
    },
    plugins: [],
  }