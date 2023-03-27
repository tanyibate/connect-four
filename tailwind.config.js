/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        yellow: "#FFCE67",
        red: "#FD6687",
        purple: "#7945FF",
        "dark-purple": "#5C2DD5",
      },
    },
  },
  plugins: [],
};
