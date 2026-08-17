import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "var(--bg-base)",
        sidebar: "var(--bg-sidebar)",
        surface: {
          DEFAULT: "var(--bg-surface)",
          hover: "var(--bg-hover)",
        },
        border: "var(--border)",
        accent: {
          DEFAULT: "var(--accent)",
          bg: "var(--accent-bg)",
        },
        content: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
          ai: "var(--ai-text)",
        },
        bubble: {
          user: "var(--user-bubble)",
          "user-border": "var(--user-bubble-border)",
        },
        success: "var(--success)",
        danger: "var(--danger)",
      },
      boxShadow: {
        "accent-glow": "0 0 20px -3px rgba(139, 124, 248, 0.25)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;