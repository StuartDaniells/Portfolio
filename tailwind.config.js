module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    container: {
      // you can configure the container to be centered
      center: true,

      // default breakpoints but with 40px removed
      screens: {
        sm: "100%",
        md: "100%",
        lg: "992px",
        xl: "1280px",
      },
    },
    fontFamily: {
      poppins: ["Poppins", "sans-serif"],
      robotoSlab: ["Roboto Slab", "serif"],
    },
    fontSize: {
      xs: ".75rem", // 12px
      xtiny: ".8125rem", // 13px
      tiny: ".875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.375rem", // 22px
      "3xl": "1.5rem", // 24px
      "4xl": "1.5625rem", // 25px
      "5xl": "1.625rem", // 26px
      "6xl": "1.75rem", // 28px
      "7xl": "2.5rem", // 40px
      "8xl": "6rem", // 40px
      // Works pages: fluid editorial scale (Spec 01 §5)
      "works-h1": ["clamp(2.25rem, 4.2vw, 4rem)", { lineHeight: "1.06", letterSpacing: "-0.022em" }],
      "works-h2": ["clamp(1.4rem, 2vw, 2rem)", { lineHeight: "1.2", letterSpacing: "-0.012em" }],
      "works-h3": ["1.3125rem", { lineHeight: "1.3" }],
      "works-body": ["1.0625rem", { lineHeight: "1.75" }],
      "works-meta": ["0.8125rem", { lineHeight: "1.5" }],
    },

    extend: {
      backgroundImage: {
        homeBg: "url('/src/assets/images/background/bg.jpg')",
        "homeBg-dark": "url('/src/assets/images/background/bg-dark.jpg')",
      },
      colors: {
        gray: "#F3F6F6",
        "gray-lite": "#44566C",
        oriange: "#E93B81",
        green: "#6AB5B9",
        "oriange-lite": "#FD7590",
        "color-810": "#F8FBFB",
        // dark-color
        "color-910": "#A6A6A6",
        "color-990": "#212425",
        // Works semantic aliases. These resolve to CSS variables declared in
        // src/index.css, which map onto the existing palette above for both
        // light and dark themes. No new brand colours are introduced.
        works: {
          surface: "rgb(var(--works-surface) / <alpha-value>)",
          card: "rgb(var(--works-card) / <alpha-value>)",
          "card-hover": "rgb(var(--works-card-hover) / <alpha-value>)",
          border: "rgb(var(--works-border) / <alpha-value>)",
          text: "rgb(var(--works-text) / <alpha-value>)",
          muted: "rgb(var(--works-muted) / <alpha-value>)",
          accent: "rgb(var(--works-accent) / <alpha-value>)",
          "accent-alt": "rgb(var(--works-accent-alt) / <alpha-value>)",
          route: "rgb(var(--works-route) / <alpha-value>)",
        },
      },
      maxWidth: {
        works: "75rem", // 1200px page measure
        reading: "50rem", // 800px article measure
        figure: "68.75rem", // 1100px diagram measure
      },
      boxShadow: {
        icon: "0 4px 6px 0px rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [],
};
