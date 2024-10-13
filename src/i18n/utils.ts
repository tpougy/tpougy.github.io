import { ui, defaultLang, showDefaultLang, languages } from "./ui";

export function getLangFromUrl(url: URL) {
  const pathParts = url.pathname.split("/");
  const lang = pathParts[1]; // o idioma é a primeira parte após a raiz ("/")

  // Verifique se o idioma é válido (ajuste conforme seus idiomas suportados)
  const supportedLangs = Object.keys(languages);
  if (supportedLangs.includes(lang)) {
    return lang;
  }

  return defaultLang; // Retorna um idioma padrão se não for encontrado
}

export function getLangFromSlug(slug: string) {
  const pathParts = slug.split("/");
  const lang = pathParts[0]; // o idioma é a primeira parte do slug

  // Verifique se o idioma é válido (ajuste conforme seus idiomas suportados)
  const supportedLangs = Object.keys(languages);
  if (supportedLangs.includes(lang)) {
    return lang;
  }

  return defaultLang; // Retorna um idioma padrão se não for encontrado
}

export function getPureSlug(slug: string) {
  const pathParts = slug.split("/");
  const pure = pathParts[1];
  return pure;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  };
}

export function UrlToPathLang(url: URL, lang: string) {
  const pathParts = url.pathname.split("/");
  pathParts[1] = lang;

  // Reconstrua o caminho e retorne
  return pathParts.join("/");
}
