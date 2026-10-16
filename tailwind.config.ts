import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "editorial-orange": "#ff4800",
        editorial: {
          DEFAULT: "#ff4800",
          orange: "#ff4800",
          flame: "#ff5e1a",
          amber: "#f97316",
        },
        orange: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#ff4800", // Unified vibrant editorial orange
          600: "#ea3f00",
          700: "#c23300",
          800: "#9a2a00",
          900: "#7c2402",
          950: "#431001",
        },
        ink: {
          950: "#080808",
          900: "#121212",
          800: "#1e1e1e",
          700: "#2a2a2a",
        },
        paper: {
          50: "#ffffff",
          100: "#fafafa",
          200: "#f4f4f5",
          300: "#e4e4e7",
        },
      },
      fontFamily: {
        syne: ["var(--font-syne)", "sans-serif"],
        sans: ["var(--font-jakarta)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      animation: {
        "marquee": "marquee 28s linear infinite",
        "marquee-slow": "marquee 38s linear infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "spin-slow": "spin 16s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px) scale(1)" },
          "50%": { transform: "translateY(-12px) scale(1.05)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
