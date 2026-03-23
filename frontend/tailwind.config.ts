import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Manrope", "sans-serif"],
      },
      colors: {
        ink: "#0f172a",
        cream: "#f8f4ec",
        accent: "#f97316",
        moss: "#14532d",
        sand: "#e7d7be",
      },
      boxShadow: {
        soft: "0 20px 60px rgba(15, 23, 42, 0.10)",
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top left, rgba(249,115,22,0.18), transparent 25%), radial-gradient(circle at bottom right, rgba(20,83,45,0.18), transparent 30%)",
      },
    },
  },
  plugins: [],
} satisfies Config;

