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
import react from "@astrojs/react";
import markdoc from "@astrojs/markdoc";
import keystatic from "@keystatic/astro";
import { vitePluginSvelteH2J } from "@ethercorps/svelte-h2j/vite"; // Re-importa o plugin

const isDev = process.env.NODE_ENV === "development";

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
        lineMd: ["search", "github"],
        iconoir: ["language", "github"],
      },
    }),
    react(),
    markdoc(),
    pagefind(),
    ...(isDev ? [keystatic()] : []), // uses the integration conditionally
  ],
  vite: {
    plugins: [
      vitePluginSvelteH2J(), // Re-adiciona o plugin svelte-h2j
    ],
    build: {
      rollupOptions: {
        external: ["/pagefind/pagefind.js?url"],
      },
    },
  },
  output: isDev ? "hybrid" : "static", // only set hybrid rendering for dev mode
});
