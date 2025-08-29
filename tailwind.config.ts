import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Kibzee Design System Colors
        sage: "#7d8471",
        clay: "#c97d60",
        gold: "#d4a574",
        dust: "#e8e2db",
        ink: "#1a1a1a",
        paper: "#fafaf8",
        // Semantic colors
        background: "#fafaf8",
        foreground: "#1a1a1a",
        primary: {
          DEFAULT: "#7d8471",
          50: "#f5f5f3",
          100: "#e8e9e5",
          200: "#d1d3cb",
          300: "#b1b5a6",
          400: "#8f9584",
          500: "#7d8471",
          600: "#606855",
          700: "#4c5344",
          800: "#3f4439",
          900: "#363b32",
        },
        secondary: {
          DEFAULT: "#c97d60",
          50: "#fcf5f2",
          100: "#fae8e1",
          200: "#f4cfc2",
          300: "#ecac98",
          400: "#e1816c",
          500: "#c97d60",
          600: "#b65841",
          700: "#974536",
          800: "#7c3b31",
          900: "#68342c",
        },
        accent: {
          DEFAULT: "#d4a574",
          50: "#fbf8f3",
          100: "#f6ede0",
          200: "#ecdbbd",
          300: "#e0c195",
          400: "#d4a574",
          500: "#c88e58",
          600: "#b9754a",
          700: "#9a5e3f",
          800: "#7d4e38",
          900: "#66412f",
        },
        neutral: {
          DEFAULT: "#e8e2db",
          50: "#fafaf9",
          100: "#f5f3f0",
          200: "#e8e2db",
          300: "#d7cdc2",
          400: "#b8aa9b",
          500: "#9d8b7b",
          600: "#867362",
          700: "#6e5d51",
          800: "#5c4f45",
          900: "#4f443c",
        },
      },
      fontFamily: {
        serif: ["Georgia", "serif"],
        sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      fontSize: {
        "display-lg": ["3rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        "display-md": ["2.5rem", { lineHeight: "1.3", letterSpacing: "-0.02em" }],
        "display-sm": ["2rem", { lineHeight: "1.4", letterSpacing: "-0.02em" }],
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },
      borderRadius: {
        "subtle": "2px",
      },
      boxShadow: {
        "soft": "0 2px 8px rgba(26, 26, 26, 0.08)",
        "medium": "0 4px 16px rgba(26, 26, 26, 0.12)",
        "large": "0 8px 32px rgba(26, 26, 26, 0.16)",
      },
      animation: {
        "drift": "drift 20s ease-in-out infinite",
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
          "33%": { transform: "translate(30px, -30px) rotate(120deg)" },
          "66%": { transform: "translate(-20px, 20px) rotate(240deg)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
