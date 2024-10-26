import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import svelte from "@astrojs/svelte";
import { astroExpressiveCode } from "astro-expressive-code";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import pagefind from "astro-pagefind";

export default defineConfig({
  site: "https://astro-nano-demo.vercel.app",
  integrations: [
    astroExpressiveCode({
      themes: ["dracula", "github-light"],
      themeCssSelector: (theme) => `[data-theme='${theme.type}']`,
    }),
    pluginLineNumbers(),
    mdx(),
    sitemap(),
    tailwind(),
    svelte(),
    icon({}),
    pagefind(),
  ],
  vite: {
    build: {
      rollupOptions: {
        external: ["/pagefind/pagefind.js?url"],
      },
    },
  },
});
