# Migração: OGImage.svelte

**Arquivo:** `src/components/OpenGraph/OGImage.svelte`

Template para geração de imagens Open Graph dinâmicas. Este componente é convertido para JSX usando `svelte-h2j` e depois renderizado como PNG via Satori + Sharp.

## Mudanças realizadas

### 1. Props com tipos e defaults: `export let` → `$props()`

**Antes:**
```svelte
export let title: string = "";
export let date: Date = new Date();
export let author: string = "";
export let lang: keyof typeof languages = defaultLang;
```

**Depois:**
```svelte
let {
  title = "",
  date = new Date(),
  author = "",
  lang = defaultLang
}: {
  title?: string;
  date?: Date;
  author?: string;
  lang?: keyof typeof languages;
} = $props();
```

**Motivo:** No Svelte 5 com TypeScript, a tipagem das props é feita com type annotation no destructuring. Props opcionais são marcadas com `?` e valores default são definidos diretamente.

---

### 2. Valor derivado: `$:` → `$derived()`

**Antes:**
```svelte
$: formattedDate = format_locale_date(date, lang);
```

**Depois:**
```svelte
let formattedDate = $derived(format_locale_date(date, lang));
```

**Motivo:** `$derived()` é usado para valores computados que dependem de props ou estado. Quando `date` ou `lang` mudam, `formattedDate` é recalculado automaticamente.

---

## Código completo migrado (script)

```svelte
<script lang="ts">
  import { languages } from "@i18n/ui";
  import { defaultLang } from "@i18n/ui";
  import { format_locale_date } from "@i18n/utils";

  let {
    title = "",
    date = new Date(),
    author = "",
    lang = defaultLang
  }: {
    title?: string;
    date?: Date;
    author?: string;
    lang?: keyof typeof languages;
  } = $props();

  let formattedDate = $derived(format_locale_date(date, lang));
</script>
```

## Notas importantes

### Uso com svelte-h2j
Este componente é usado com a biblioteca `@ethercorps/svelte-h2j` para gerar imagens Open Graph:

```typescript
import { svelteComponentToJsx } from "@ethercorps/svelte-h2j";
import OgImage from "../components/OpenGraph/OGImage.svelte";

const jsxElement = await svelteComponentToJsx(OgImage, {
  title,
  date,
  lang,
  author,
});

const svg = await satori(jsxElement, options);
```

A migração para Svelte 5 não afeta o uso com `svelte-h2j` - o componente continua funcionando normalmente para geração de imagens.

### Estilos inline
O componente usa apenas estilos inline (necessário para Satori). Isso não muda entre Svelte 4 e 5.
