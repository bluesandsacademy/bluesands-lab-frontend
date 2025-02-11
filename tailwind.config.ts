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
        bgWhite: "var(--bg-white)",
        blackText: "var(--black-text)",
        bgGrey: "var(--bg-grey)",
        bgBlue: "var(--bg-blue)"
      },
    },
  },
  plugins: [],
} satisfies Config;
