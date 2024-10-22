# tpougy blog

_Based on [Astro Nano](https://github.com/markhorn-dev/astro-nano)_

My personal blog to share dive deep into programming and tech topics.

## Internationalization (i18n)

Implemented i18n features to support English (en) and Portuguese (pt-BR) dinamically as selected by the user.

## Comment Engine

Using [Cusdis](https://cusdis.com/) as the engine for the comment section on blog posts.

## 💻 Commands to Run the Dev

All commands are run from the root of the project, from a terminal:

Replace npm with your package manager of choice. `npm`, `pnpm`, `yarn`, `bun`, etc

| Command                   | Action                                            |
| :------------------------ | :------------------------------------------------ |
| `npm install`             | Installs dependencies                             |
| `npm run dev`             | Starts local dev server at `localhost:4321`       |
| `npm run dev:network`     | Starts local dev server on local network          |
| `npm run sync`            | Generates TypeScript types for all Astro modules. |
| `npm run build`           | Build your production site to `./dist/`           |
| `npm run preview`         | Preview your build locally, before deploying      |
| `npm run preview:network` | Preview build on local network                    |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check`  |
| `npm run astro -- --help` | Get help using the Astro CLI                      |
| `npm run lint`            | Run ESLint                                        |
| `npm run lint:fix`        | Auto-fix ESLint issues                            |
