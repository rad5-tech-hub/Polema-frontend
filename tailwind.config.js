module.exports = {
  mode: "jit",
  content: [
    "./index.html",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.html",
    "./src/**/*.js",
    "./src/**/*.jsx",
    "./src/**/*.ts",
    "./src/**/*.tsx",
  ],
  darkMode: "media",
  theme: {
    extend: {
      // Add any customizations or extensions here
      fontFamily: {
        space: ["Space Grotesk", "sans-serif"],
        amsterdam: ["New Amsterdam", "sans-serif"],
      },
    },
    screens: {
      xs: "360px",
      ss: "620px",
      sm: "768px",
      md: "1060px",
      lg: "1200px",
      xl: "1700px",
    },
  },
  variants: {
    extend: {
      // Add any custom variants here if needed
    },
  },
  plugins: [
    // Add any custom plugins here if needed
  ],
};
