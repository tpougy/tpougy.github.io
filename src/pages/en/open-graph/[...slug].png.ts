import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { generateOgImage } from "../../../lib/og";
import { languages } from "../../../i18n/ui"; // Import languages
// Remove importação não utilizada de SITE

// Define a interface para as props que a rota receberá de getStaticPaths
interface OgProps {
  title: string;
  date: Date;
  lang: keyof typeof languages; // Use imported type for lang
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Busca todos os posts da coleção 'blog' que começam com 'en/'
  const posts = await getCollection("blog", ({ id }) => id.startsWith("en/"));

  // Mapeia os posts para o formato esperado por getStaticPaths
  return posts.map((post) => {
    // Remove o prefixo 'en/' do slug para formar o parâmetro da URL
    // Ex: 'en/my-first-post' vira 'my-first-post'
    const slug = post.slug.replace(/^en\//, "");

    return {
      params: { slug: slug }, // O slug que aparecerá na URL: /en/open-graph/[slug].png
      props: {
        title: post.data.title,
        // Certifique-se que 'pubDate' é o nome correto do campo de data na sua coleção
        // Usa o campo 'date' existente no schema da coleção
        date: post.data.date, // Usa o campo 'date' definido no schema
        lang: "en", // Pass lang prop again
        // author remains removed
      },
    };
  });
};

// A função GET que será chamada para cada rota estática gerada
export const GET: APIRoute<OgProps> = async ({ props }) => {
  // Receive only title and date from props
  // Recebe apenas title e date das props
  // Receive lang prop again
  const { title, date, lang } = props;

  // Chama a função para gerar o buffer da imagem PNG
  // Call generateOgImage with only title and date
  // Chama generateOgImage apenas com title e date
  // Pass lang to generateOgImage
  const responseBuffer = await generateOgImage(title, date, lang);

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
