import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { generateOgImage } from "../../../lib/og"; // Ajuste o caminho se necessário
import { SITE } from "../../../consts"; // Importa constantes do site para o autor padrão

// Define a interface para as props que a rota receberá de getStaticPaths
interface OgProps {
  title: string;
  date: Date;
  lang: "en" | "pt";
  author: string; // Adiciona autor às props
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Busca todos os posts da coleção 'blog' que começam com 'pt/'
  const posts = await getCollection("blog", ({ id }) => id.startsWith("pt/"));

  // Mapeia os posts para o formato esperado por getStaticPaths
  return posts.map((post) => {
    // Remove o prefixo 'pt/' do slug para formar o parâmetro da URL
    // Ex: 'pt/meu-primeiro-post' vira 'meu-primeiro-post'
    const slug = post.slug.replace(/^pt\//, "");

    return {
      params: { slug: slug }, // O slug que aparecerá na URL: /pt/open-graph/[slug].png
      props: {
        title: post.data.title,
        // Usa o campo 'date' existente no schema da coleção
        date: post.data.date, // Usa o campo 'date' definido no schema
        lang: "pt", // Define o idioma explicitamente para português
        // Usa o nome do site como autor padrão, já que 'author' não existe no schema
        author: SITE.NAME,
      },
    };
  });
};

// A função GET que será chamada para cada rota estática gerada
export const GET: APIRoute<OgProps> = async ({ props }) => {
  const { title, date, lang, author } = props; // Recebe as props de getStaticPaths

  // Chama a função para gerar o buffer da imagem PNG
  const responseBuffer = await generateOgImage(title, date, lang, author);

  // Retorna a resposta com o buffer da imagem
  return new Response(responseBuffer, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      // Adiciona cache forte para as imagens geradas estaticamente
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
