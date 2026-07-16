import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#8B0000",
          hover: "#6B0000",
          light: "#B22222",
        },
        background: {
          DEFAULT: "#F5F3F0",
          dark: "#0F0F0F",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          dark: "#1A1A1A",
        },
        text: {
          DEFAULT: "#1A1A1A",
          muted: "#6B7280",
          dark: "#F5F3F0",
        },
        success: "#16A34A",
        warning: "#D97706",
        error: "#DC2626",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "8px",
      },
    },
  },
  plugins: [],
};

export default config;