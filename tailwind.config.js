/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Futuristic Cyber Cyan & Violet palette
        brand: {
          cyan: "#00d2ff",
          sky: "#38bdf8",
          teal: "#06b6d4",
          violet: "#8b5cf6",
          indigo: "#6366f1",
          purple: "#a855f7",
          emerald: "#10b981",
          amber: "#f59e0b",
        },
        dark: {
          bg: "#090d16",
          card: "rgba(17, 24, 39, 0.75)",
          surface: "#111827",
          border: "rgba(255, 255, 255, 0.08)",
        },
        light: {
          bg: "#f8fafc",
          card: "rgba(255, 255, 255, 0.85)",
          surface: "#ffffff",
          border: "rgba(148, 163, 184, 0.2)",
        },
      },
      fontFamily: {
        display: ["'Outfit'", "'Fraunces'", "sans-serif"],
        body: ["'Plus Jakarta Sans'", "'Manrope'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "cyber-glow": "radial-gradient(circle at 50% 0%, rgba(0, 210, 255, 0.15), transparent 70%)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-14px) rotate(1deg)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.08)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        gradientFlow: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        float: "float 5s ease-in-out infinite",
        "float-slow": "float-slow 8s ease-in-out infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
        shimmer: "shimmer 3s ease-in-out infinite",
        gradient: "gradientFlow 6s ease infinite",
      },
    },
  },
  plugins: [],
};

