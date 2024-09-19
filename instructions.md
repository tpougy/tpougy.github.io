In this recipe, you will learn how to use content collections and dynamic routing to build your own internationalization (i18n) solution and serve your content in different languages.

This example serves each language at its own subpath, e.g. `example.com/en/blog` for English and `example.com/fr/blog` for French.

If you prefer the default language to not be visible in the URL unlike other languages, there are [instructions to hide the default language](about:/en/recipes/i18n/#hide-default-language-in-the-url) below.

See the resources section for external links to related topics such as right-to-left (RTL) styling and choosing language tags.

### Set up pages for each language

Section titled Set up pages for each language

  1. Create a directory for each language you want to support. For example, `en/` and `fr/` if you are supporting English and French:

     * Directorysrc/ 
       * Directorypages/ 
         * Directory**en/**
           * about.astro
           * index.astro
         * Directory**fr/**
           * about.astro
           * index.astro
         * index.astro
  2. Set up `src/pages/index.astro` to redirect to your default language.

     * Static 
     * SSR 
    
        <meta http-equiv="refresh" content="0;url=/en/" />

This approach uses a [meta refresh](https://en.wikipedia.org/wiki/Meta_refresh) and will work however you deploy your site. Some static hosts also let you configure server redirects with a custom configuration file. See your deploy platform’s documentation for more details.




### Use collections for translated content

Section titled Use collections for translated content

  1. Create a folder in `src/content/` for each type of content you want to include and add subdirectories for each supported language. For example, to support English and French blog posts:

     * Directorysrc/ 
       * Directorycontent/ 
         * Directoryblog/ 
           * Directory**en/**
             * post-1.md
             * post-2.md
           * Directory**fr/**
             * post-1.md
             * post-2.md
  2. Create a `src/content/config.ts` file and export a collection for each type of content.
    
        import { defineCollection, z } from 'astro:content';
    
    const blogCollection = defineCollection({
    
      schema: z.object({
    
        title: z.string(),
    
        author: z.string(),
    
        date: z.date()
    
      })
    
    });
    
    export const collections = {
    
      'blog': blogCollection
    
    };

  3. Use [dynamic routes](about:/en/guides/routing/#dynamic-routes) to fetch and render content based on a `lang` and a `slug` parameter.

     * Static 
     * SSR 

In static rendering mode, use `getStaticPaths` to map each content entry to a page:
    
        ---
    
    import { getCollection } from 'astro:content';
    
    export async function getStaticPaths() {
    
      const pages = await getCollection('blog');
    
      const paths = pages.map(page => {
    
        const [lang, ...slug] = page.slug.split('/');
    
        return { params: { lang, slug: slug.join('/') || undefined }, props: page };
    
      });
    
      return paths;
    
    }
    
    const { lang, slug } = Astro.params;
    
    const page = Astro.props;
    
    const formattedDate = page.data.date.toLocaleString(lang);
    
    const { Content } = await page.render();
    
    ---
    
    <h1>{page.data.title}</h1>
    
    <p>by {page.data.author} • {formattedDate}</p>
    
    <Content/>




### Translate UI strings

Section titled Translate UI strings

Create dictionaries of terms to translate the labels for UI elements around your site. This allows your visitors to experience your site fully in their language.

  1. Create a `src/i18n/ui.ts` file to store your translation strings:
    
        export const languages = {
    
      en: 'English',
    
      fr: 'Français',
    
    };
    
    export const defaultLang = 'en';
    
    export const ui = {
    
      en: {
    
        'nav.home': 'Home',
    
        'nav.about': 'About',
    
        'nav.twitter': 'Twitter',
    
      },
    
      fr: {
    
        'nav.home': 'Accueil',
    
        'nav.about': 'À propos',
    
      },
    
    } as const;

  2. Create two helper functions: one to detect the page language based on the current URL, and one to get translations strings for different parts of the UI in `src/i18n/utils.ts`:
    
        import { ui, defaultLang } from './ui';
    
    export function getLangFromUrl(url: URL) {
    
      const [, lang] = url.pathname.split('/');
    
      if (lang in ui) return lang as keyof typeof ui;
    
      return defaultLang;
    
    }
    
    export function useTranslations(lang: keyof typeof ui) {
    
      return function t(key: keyof typeof ui[typeof defaultLang]) {
    
        return ui[lang][key] || ui[defaultLang][key];
    
      }
    
    }

  3. Import the helpers where needed and use them to choose the UI string that corresponds to the current language. For example, a nav component might look like:
    
        ---
    
    import { getLangFromUrl, useTranslations } from '../i18n/utils';
    
    const lang = getLangFromUrl(Astro.url);
    
    const t = useTranslations(lang);
    
    ---
    
    <ul>
    
        <li>
    
            <a href={`/${lang}/home/`}>
    
              {t('nav.home')}
    
            </a>
    
        </li>
    
        <li>
    
            <a href={`/${lang}/about/`}>
    
              {t('nav.about')}
    
            </a>
    
        </li>
    
        <li>
    
            <a href="https://twitter.com/astrodotbuild">
    
              {t('nav.twitter')}
    
            </a>
    
        </li>
    
    </ul>

  4. Each page must have a `lang` attribute on the `<html>` element that matches the language on the page. In this example, a [reusable layout](/en/basics/layouts/) extracts the language from the current route:
    
        ---
    
    import { getLangFromUrl } from '../i18n/utils';
    
    const lang = getLangFromUrl(Astro.url);
    
    ---
    
    <html lang={lang}>
    
        <head>
    
            <meta charset="utf-8" />
    
            <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    
            <meta name="viewport" content="width=device-width" />
    
            <title>Astro</title>
    
        </head>
    
        <body>
    
            <slot />
    
        </body>
    
    </html>

You can then use this base layout to ensure that pages use the correct `lang` attribute automatically.
    
        ---
    
    import Base from '../../layouts/Base.astro';
    
    ---
    
    <Base>
    
        <h1>About me</h1>
    
        ...
    
    </Base>




### Let users switch between languages

Section titled Let users switch between languages

Create links to the different languages you support so users can choose the language they want to read your site in.

  1. Create a component to show a link for each language:
    
        ---
    
    import { languages } from '../i18n/ui';
    
    ---
    
    <ul>
    
      {Object.entries(languages).map(([lang, label]) => (
    
        <li>
    
          <a href={`/${lang}/`}>{label}</a>
    
        </li>
    
      ))}
    
    </ul>

  2. Add `<LanguagePicker />` to your site so it is shown on every page. The example below adds it to the site footer in a base layout:
    
        ---
    
    import LanguagePicker from '../components/LanguagePicker.astro';
    
    import { getLangFromUrl } from '../i18n/utils';
    
    const lang = getLangFromUrl(Astro.url);
    
    ---
    
    <html lang={lang}>
    
        <head>
    
            <meta charset="utf-8" />
    
            <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    
            <meta name="viewport" content="width=device-width" />
    
            <title>Astro</title>
    
        </head>
    
        <body>
    
            <slot />
    
            <footer>
    
              <LanguagePicker />
    
            </footer>
    
        </body>
    
    </html>




### Hide default language in the URL

Section titled Hide default language in the URL

  1. Create a directory for each language except the default language. For example, store your default language pages directly in `pages/`, and your translated pages in `fr/`:

     * Directorysrc/ 
       * Directorypages/ 
         * about.astro
         * index.astro
         * Directory**fr/**
           * about.astro
           * index.astro
  2. Add another line to the `src/i18n/ui.ts` file to toggle the feature:
    
        export const showDefaultLang = false;

  3. Add a helper function to `src/i18n/utils.ts`, to translate paths based on the current language:
    
        import { ui, defaultLang, showDefaultLang } from './ui';
    
    export function useTranslatedPath(lang: keyof typeof ui) {
    
      return function translatePath(path: string, l: string = lang) {
    
        return !showDefaultLang && l === defaultLang ? path : `/${l}${path}`
    
      }
    
    }

  4. Import the helper where needed. For example, a `nav` component might look like:
    
        ---
    
    import { getLangFromUrl, useTranslations, useTranslatedPath } from '../i18n/utils';
    
    const lang = getLangFromUrl(Astro.url);
    
    const t = useTranslations(lang);
    
    const translatePath = useTranslatedPath(lang);
    
    ---
    
    <ul>
    
        <li>
    
            <a href={translatePath('/home/')}>
    
              {t('nav.home')}
    
            </a>
    
        </li>
    
        <li>
    
            <a href={translatePath('/about/')}>
    
              {t('nav.about')}
    
            </a>
    
        </li>
    
        <li>
    
            <a href="https://twitter.com/astrodotbuild">
    
              {t('nav.twitter')}
    
            </a>
    
        </li>
    
    </ul>

  5. The helper function can also be used to translate paths for a specific language. For example, when users switch between languages:
    
        ---
    
    import { languages } from '../i18n/ui';
    
    import { getLangFromUrl, useTranslatedPath } from '../i18n/utils';
    
    const lang = getLangFromUrl(Astro.url);
    
    const translatePath = useTranslatedPath(lang);
    
    ---
    
    <ul>
    
      {Object.entries(languages).map(([lang, label]) => (
    
        <li>
    
          <a href={translatePath('/', lang)}>{label}</a>
    
        </li>
    
      ))}
    
    </ul>
