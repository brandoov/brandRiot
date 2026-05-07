/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f5f7ff",
          100: "#e8edff",
          200: "#c8d2ff",
          300: "#9aabff",
          400: "#6b80ff",
          500: "#4054ff",
          600: "#2c3be6",
          700: "#222db4",
          800: "#1b2489",
          900: "#171e6b"
        }
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif"
        ]
      }
    }
  },
  plugins: []
};
