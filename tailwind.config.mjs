import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["JetBrains Mono", "IBM Plex Mono", ...defaultTheme.fontFamily.mono],
        serif: ["JetBrains Mono", "IBM Plex Mono", ...defaultTheme.fontFamily.mono],
        mono: ["JetBrains Mono", "IBM Plex Mono", ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
