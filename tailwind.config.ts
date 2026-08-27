import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "stone-paper": "#F6F4EF",
        ink: "#26231F",
        "ink-soft": "#6B6459",
        bronze: "#8C6F4E",
        "bronze-deep": "#6B5439",
        line: "#E4DFD3",
        sage: "#6E7A6A",
        gold: "#B08C3E",
        rose: "#B37B72",
        seal: "#8B3A3A",
        "seal-deep": "#6E2C2C",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        accent: ["var(--font-accent)"],
      },
      boxShadow: {
        soft: "0 4px 20px rgba(38, 35, 31, 0.06)",
        medium: "0 8px 32px rgba(38, 35, 31, 0.10)",
      },
    },
  },
  plugins: [],
};
export default config;