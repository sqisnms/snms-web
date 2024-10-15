import type { Config } from "tailwindcss"

import plugin from "tailwindcss/plugin"
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./ui/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: { 400: "#2589FE", 500: "#0070F3", 600: "#2F6FEB" },
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: { shimmer: "shimmer 2s 1" },
      backgroundImage: {
        "gradient-shimmer":
          "linear-gradient(to right, transparent, rgba(255, 255, 255, 0.6), transparent",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
}
export default config
