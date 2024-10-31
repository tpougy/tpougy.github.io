import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import svelte from "@astrojs/svelte";
import { astroExpressiveCode } from "astro-expressive-code";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import pagefind from "astro-pagefind";
import { pluginCodeOutput } from "@fujocoded/expressive-code-output";

export default defineConfig({
  site: "https://tpougy.blog",
  integrations: [
    astroExpressiveCode({
      plugins: [pluginLineNumbers(), pluginCodeOutput()],
      themes: ["dracula", "github-light"],
      themeCssSelector: (theme) => `[data-theme='${theme.type}']`,
    }),
    pluginLineNumbers(),
    mdx(),
    sitemap(),
    tailwind(),
    svelte(),
    icon({
      include: {
        lineMd: ["search"],
        iconoir: ["language"],
      },
    }),
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
