/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "var(--color-surface)",
          dim: "var(--color-surface-dim)",
          bright: "var(--color-surface-bright)",
        },
        outline: "var(--color-outline)",
        primary: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
          on: "var(--color-on-primary)",
        },
        text: {
          header: "var(--color-text-header)",
          body: "var(--color-text-body)",
          muted: "var(--color-text-muted)",
        },
        tertiary: "var(--color-tertiary)",
        "nav-active": "var(--color-active-nav-bg)",
        success: "var(--color-success)",
      },
      fontFamily: {
        serif: ["var(--font-eb-garamond)", "serif"],
        sans: ["var(--font-manrope)", "sans-serif"],
      },
      boxShadow: {
        sahara: "0 2px 16px rgba(58, 48, 42, 0.04)",
        "sahara-md": "0 4px 20px rgba(58, 48, 42, 0.08)",
        "sahara-lg": "0 10px 30px rgba(194, 101, 42, 0.12)",
      },
      borderRadius: {
        standard: "8px",
        large: "12px",
      },
    },
  },
  plugins: [],
};
