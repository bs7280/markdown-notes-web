/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // ← manual class toggling
  content: ["./src/**/*.{js,ts,jsx,tsx,css}"],
  theme: {
    extend: {
    colors: {
      foreground: "var(--foreground)",
      background: "var(--background)",
    },
    fontFamily: {
      sans: "var(--font-sans)",
      mono: "var(--font-mono)",
    },
  },
  },
  plugins: [require("@tailwindcss/typography")],
};
