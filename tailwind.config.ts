import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base: "#0a0a0a",
          subtle: "#111111",
          card: "#161616",
          hover: "#1c1c1c",
        },
        ink: {
          primary: "#f5f5f4",
          secondary: "#a8a29e",
          muted: "#57534e",
        },
        gold: {
          DEFAULT: "#D4622A",
          light: "#E8783E",
          dark: "#B04E1E",
        },
        line: {
          subtle: "#262626",
          DEFAULT: "#2e2e2e",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-1": ["clamp(3rem, 8vw, 6rem)", { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "700" }],
        "display-2": ["clamp(2rem, 5vw, 3.5rem)", { lineHeight: "1.1", letterSpacing: "-0.025em", fontWeight: "600" }],
        "heading": ["clamp(1.25rem, 2.5vw, 1.5rem)", { lineHeight: "1.3", letterSpacing: "-0.015em", fontWeight: "600" }],
        "body-lg": ["1.125rem", { lineHeight: "1.7" }],
        "body": ["1rem", { lineHeight: "1.6" }],
        "caption": ["0.8125rem", { lineHeight: "1.5", letterSpacing: "0.04em" }],
      },
      borderRadius: {
        "token-sm": "4px",
        "token-md": "8px",
        "token-lg": "12px",
        "token-xl": "16px",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(212, 98, 42, 0.4)" },
          "50%": { boxShadow: "0 0 0 8px rgba(212, 98, 42, 0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
