/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        surface: {
          DEFAULT: "rgb(12 14 22)",
          elevated: "rgb(18 21 32)",
          border: "rgb(36 42 61)",
        },
      },
    },
  },
  plugins: [],
};
