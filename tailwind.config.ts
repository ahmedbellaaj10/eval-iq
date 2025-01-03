import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBlue: "#1e3a8a",
        darkerGray: "#1f2937",
        lightGray: "#d1d5db",
        whiteGray: "#f9fafb",
      },
    },
  },
  plugins: [],
} satisfies Config;
