import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#18232d",
        sand: "#f7f4ee",
        saffron: "#e6753d",
        teal: "#176b66",
        mint: "#d9eee6",
      },
      boxShadow: { card: "0 16px 45px rgba(24, 35, 45, .08)" },
    },
  },
  plugins: [],
};

export default config;
