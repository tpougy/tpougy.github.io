import sharp from "sharp";
import { readFile } from "node:fs/promises";
import satori, { type SatoriOptions } from "satori";

import { svelteComponentToJsx } from "@ethercorps/svelte-h2j";
import OgImage from "../components/OpenGraph/OGImage.svelte";
import { languages, defaultLang } from "../i18n/ui";
import path from "node:path";
import { SITE } from "@consts";

const readFont = (filename: string) => {
  const fontPath = path.resolve(process.cwd(), "public/fonts", filename);
  return readFile(fontPath);
};

export const generateOgImage = async (
  title: string = "",
  date: Date = new Date(),
  lang: keyof typeof languages = defaultLang,
  author: string = SITE.NAME,
): Promise<Buffer> => {
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
      {
        name: "DM Serif Display",
        data: fontDmSerifDisplayRegular,
        weight: 400,
        style: "normal",
      },
      // Adicione outros pesos/estilos se necessário
    ],
    debug: true,
  };

  const jsxElement = await svelteComponentToJsx(OgImage, {
    title,
    date,
    lang,
    author,
  });

  // Loga a estrutura JSX gerada para depuração
  // console.log("--- svelteComponentToJsx Output ---");
  // console.log(JSON.stringify(element, null, 2));
  // console.log("---------------------------------");

  const svg = await satori(jsxElement, options);

  const sharpSvg = Buffer.from(svg);
  const buffer = await sharp(sharpSvg).png().toBuffer();

  return buffer;
};
