import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#f8f9ff",
          dim: "#ccdbf4",
          bright: "#f8f9ff",
          "container-lowest": "#ffffff",
          "container-low": "#eff4ff",
          container: "#e6eeff",
          "container-high": "#dde9ff",
          "container-highest": "#d5e3fd",
          variant: "#d5e3fd",
        },
        "on-surface": {
          DEFAULT: "#0d1c2f",
          variant: "#44474e",
        },
        primary: {
          DEFAULT: "#002046",
          container: "#1b365d",
          fixed: "#d6e3ff",
        },
        "on-primary": {
          DEFAULT: "#ffffff",
          container: "#87a0cd",
        },
        secondary: {
          DEFAULT: "#9b4500",
          container: "#fd8a42",
          fixed: "#ffdbca",
        },
        "on-secondary": {
          DEFAULT: "#ffffff",
          container: "#682c00",
        },
        tertiary: {
          DEFAULT: "#06223a",
          container: "#1f3751",
        },
        outline: {
          DEFAULT: "#74777f",
          variant: "#c4c6cf",
        },
        error: {
          DEFAULT: "#ba1a1a",
          container: "#ffdad6",
        },
      },
      spacing: {
        "space-2xs": "0.25rem",
        "space-xs": "0.5rem",
        "space-sm": "0.75rem",
        "space-md": "1rem",
        "space-lg": "1.5rem",
        "space-xl": "2rem",
        "space-2xl": "3rem",
      },
      fontFamily: {
        sans: ["Inter", "Sarabun", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
