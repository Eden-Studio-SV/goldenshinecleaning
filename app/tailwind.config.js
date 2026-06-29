/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta del proyecto (§5 de la especificación técnica)
        navy: {
          900: "#1A3A5C", // fondos oscuros, hero, footer
          800: "#1F3864", // encabezados, panel
        },
        brand: {
          // azul de acento / primario
          50: "#EBF3FB",
          500: "#2E75B6",
          600: "#27649C",
          700: "#1F3864",
        },
        gold: {
          DEFAULT: "#E8B23A",
          dark: "#CD9A28",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1.25rem",
          lg: "2rem",
        },
        screens: {
          "2xl": "1200px",
        },
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};
