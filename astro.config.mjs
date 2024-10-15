import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import svelte from "@astrojs/svelte";

export default defineConfig({
  site: "https://astro-nano-demo.vercel.app",
  integrations: [
    mdx(),
    sitemap(),
    tailwind(),
    svelte(),
    icon({
      include: {
        ph: ["hand-waving-bold"],
      },
    }),
  ],
});
