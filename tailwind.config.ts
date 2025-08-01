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
        ted: {
          red: '#e62b1e',
          dark: '#1a1a1a',
          gray: '#666666',
        },
      },
    },
  },
  plugins: [],
};
export default config;