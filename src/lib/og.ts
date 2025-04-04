import sharp from "sharp";
import { readFile } from "node:fs/promises";
import satori, { type SatoriOptions } from "satori";
// Importa o componente JSX diretamente
import OgTemplate from "../components/OpenGraph/OgTemplate.jsx";
import { languages } from "../i18n/ui"; // Correct relative path
import path from "node:path"; // Para resolver caminhos

// Função auxiliar para ler fontes da pasta public/fonts
const readFont = (filename: string) => {
  const fontPath = path.resolve(process.cwd(), "public/fonts", filename);
  return readFile(fontPath);
};

// Assinatura da função permanece a mesma
// Re-add lang parameter to function signature
export const generateOgImage = async (
  title: string = "Default Title",
  date: Date = new Date(),
  lang: keyof typeof languages = "en", // Use imported type for lang
): Promise<Buffer> => {
  // Carrega os dados das fontes
  const fontPoppinsRegular = await readFont("Poppins-Regular.ttf");
  const fontPoppinsBold = await readFont("Poppins-Bold.ttf");
  const fontDmSerifDisplayRegular = await readFont(
    "DMSerifDisplay-Regular.ttf",
  );

  const options: SatoriOptions = {
    width: 1200,
    height: 630,
    embedFont: true,
    fonts: [
      // Poppins
      {
        name: "Poppins",
        data: fontPoppinsRegular,
        weight: 400,
        style: "normal",
      },
      {
        name: "Poppins",
        data: fontPoppinsBold,
        weight: 700,
        style: "normal",
      },
      // DM Serif Display
      {
        name: "DM Serif Display",
        data: fontDmSerifDisplayRegular,
        weight: 400,
        style: "normal",
      },
      // Adicione outros pesos/estilos se necessário
    ],
    // debug: false, // Depuração desabilitada por padrão
  };

  // Chama o componente JSX diretamente para obter o elemento React
  // O Satori espera um elemento React (JSX) como primeiro argumento
  // Pass only title and date to OgTemplate
  // Pass lang prop to OgTemplate
  const element = OgTemplate({ title, date, lang });

  // Gera o SVG a partir do elemento JSX
  const svg = await satori(element, options);

  // Converte o SVG para PNG
  const sharpSvg = Buffer.from(svg);
  const buffer = await sharp(sharpSvg).png().toBuffer();

  return buffer;
};
