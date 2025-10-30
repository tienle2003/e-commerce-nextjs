import type { Config } from "tailwindcss";

export default {
  important: true,
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "font-poppins": "var(--font-poppins)",
      },
      boxShadow: {
        custom: "0px 0px 24px 0px rgba(0, 0, 0, 0.08)",
      },
      colors: {
        primary: "#c4ab64",
        secondary: "#eae7dc",
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;
