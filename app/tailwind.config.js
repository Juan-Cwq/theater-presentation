/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // "Broadway Marquee" — dark theatrical luxury palette
        bg: "#120E16",
        panel: "#261C2C",
        elevated: "#3A2C41",
        gold: "#D9AA3F",
        "pale-gold": "#EBD9A8",
        crimson: "#B3283F",
        "muted-text": "#BDB3C4",
        "off-white": "#F4EEE6",
      },
      fontFamily: {
        serif: ['"Fraunces"', '"DM Serif Display"', "Georgia", "serif"],
        display: ['"DM Serif Display"', '"Fraunces"', "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "-apple-system", "sans-serif"],
      },
      letterSpacing: {
        kicker: "0.22em",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        card: "0 24px 60px -24px rgba(0,0,0,0.75), 0 2px 8px rgba(0,0,0,0.4)",
        "gold-glow": "0 0 40px -8px rgba(217,170,63,0.45)",
      },
      keyframes: {
        "marquee-chase": {
          "0%, 100%": { opacity: "0.25", transform: "scale(0.85)" },
          "50%": { opacity: "1", transform: "scale(1)" },
        },
        "dash-flow": {
          to: { strokeDashoffset: "-1000" },
        },
      },
      animation: {
        "dash-flow": "dash-flow 30s linear infinite",
      },
    },
  },
  plugins: [],
};
