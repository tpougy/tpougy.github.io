import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { generateOgImage } from "../../../lib/og";
import { languages } from "../../../i18n/ui";
import { SITE } from "../../../consts"; // Import SITE for author name

// Define a interface para as props que a rota receberá de getStaticPaths
interface OgProps {
  title: string;
  date: Date;
  lang: keyof typeof languages;
  author: string;
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
        lang: "pt", // Pass lang prop, ensuring it's the correct type key
        author: SITE.NAME, // Pass SITE.NAME as author prop
      },
    };
  });
};

// A função GET que será chamada para cada rota estática gerada
export const GET: APIRoute<OgProps> = async ({ props }) => {
  // Receive title, date, and lang from props
  // Receive author prop
  const { title, date, lang, author } = props;

  // Pass lang to generateOgImage
  // Pass author to generateOgImage
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
