/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Light mode — warm desert palette
        "tea-green": "#ccd5ae",
        beige: "#e9edc9",
        cornsilk: "#fefae0",
        "papaya-whip": "#faedcd",
        "light-bronze": "#d4a373",
        // Dark mode — deep ocean palette
        "deep-twilight": "#03045e",
        "bright-teal-blue": "#0077b6",
        "turquoise-surf": "#00b4d8",
        "frosted-blue": "#90e0ef",
        "light-cyan": "#caf0f8",
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Manrope'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        "sunrise-grain": "radial-gradient(circle at top, rgba(212,163,115,0.18), transparent 60%)",
        "ocean-grain": "radial-gradient(circle at top, rgba(0,180,216,0.16), transparent 60%)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        floaty: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        tideShift: {
          "0%,100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.8s ease forwards",
        floaty: "floaty 6s ease-in-out infinite",
        tide: "tideShift 8s ease infinite",
      },
    },
  },
  plugins: [],
};
