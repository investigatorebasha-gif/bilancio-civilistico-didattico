import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        ink: "#17201a",
        mint: "#0f766e",
        paper: "#f8faf7",
        line: "#dbe5dc"
      },
      boxShadow: {
        soft: "0 10px 30px rgba(23, 32, 26, 0.08)"
      }
    }
  },
  plugins: []
} satisfies Config;
