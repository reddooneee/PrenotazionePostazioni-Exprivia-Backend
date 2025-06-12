
/** @type {import('tailwindcss').Config} */
//module.exports = {
//  content: [
//    "./src/**/*.{html,ts}",
//  ],
//  theme: {
//    extend: {},
//  },
//  plugins: [],
//  important: true,
//} 



/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        expriviaBlue: "#004C6A",
        expriviaOrange: "#E9500E",
        expriviaOrange400: "#F09151",
        expriviaOrange600: "#D1430A",
      },
    },
  },
plugins: [],
  important: true,
} 