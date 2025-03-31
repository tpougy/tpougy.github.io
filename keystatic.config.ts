// keystatic.config.ts
import { config, fields, collection } from "@keystatic/core";

export default config({
  storage: {
    kind: "local",
  },
  collections: {
    blog_en: collection({
      label: "Blog Posts (EN)",
      slugField: "title", // Define o título como slug
      entryLayout: "content",
      path: "src/content/blog/en/*/index", // Cria uma pasta com o nome do slug
      format: {
        contentField: "content", // Combina conteúdo e metadados em um arquivo `index.md`
      },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        description: fields.text({ label: "Description" }),
        date: fields.date({ label: "Date" }),
        lang: fields.select({
          label: "Language",
          options: [{ label: "EN", value: "en" }],
          defaultValue: "en",
        }),
        draft: fields.checkbox({
          label: "Draft",
          description: "Check will not publish the content",
        }),
        content: fields.mdx({ label: "Content", extension: "mdx" }), // Para conteúdo Markdown
      },
    }),
    blog_pt: collection({
      label: "Blog Posts (PT)",
      slugField: "title",
      entryLayout: "content",
      path: "src/content/blog/pt/*/index", // Pasta baseada no slug para posts em português
      format: {
        contentField: "content",
      },
      schema: {
        title: fields.slug({ name: { label: "Título" } }),
        description: fields.text({ label: "Descrição" }),
        date: fields.date({ label: "Data" }),
        lang: fields.select({
          label: "Língua",
          options: [{ label: "PT-BR", value: "pt" }],
          defaultValue: "pt",
        }),
        draft: fields.checkbox({
          label: "Rascunho",
          description: "Marque para não publicar o conteúdo",
        }),
        content: fields.mdx({ label: "Conteúdo", extension: "mdx" }),
      },
    }),
  },
});
