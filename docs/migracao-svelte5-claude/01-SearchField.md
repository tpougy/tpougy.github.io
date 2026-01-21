# Migração: SearchField.svelte

**Arquivo:** `src/components/Search/SearchField.svelte`

Campo de busca que integra com Pagefind para busca client-side.

## Mudanças realizadas

### 1. Props: `export let` → `$props()`

**Antes:**
```svelte
export let lang: keyof typeof languages;
```

**Depois:**
```svelte
let { lang }: { lang: keyof typeof languages } = $props();
```

**Motivo:** No Svelte 5, props são declaradas usando a rune `$props()` com destructuring. A tipagem TypeScript é aplicada diretamente no destructuring.

---

### 2. Estado reativo: `let` → `$state()`

**Antes:**
```svelte
let query = "";
let results: any[] = [];
let pagefind: any;
```

**Depois:**
```svelte
let query = $state("");
let results: any[] = $state([]);
let pagefind: any = $state(null);
```

**Motivo:** No Svelte 4, variáveis declaradas com `let` eram automaticamente reativas. No Svelte 5, é necessário usar `$state()` para criar estado reativo explicitamente.

---

### 3. Lifecycle: `onMount` → `$effect()`

**Antes:**
```svelte
import { onMount } from "svelte";

onMount(async () => {
  try {
    pagefind = await import("/pagefind/pagefind.js?url");
    await pagefind.init();
  } catch (error) {
    console.error("Falha ao carregar o Pagefind:", error);
  }
});
```

**Depois:**
```svelte
$effect(() => {
  const initPagefind = async () => {
    try {
      pagefind = await import("/pagefind/pagefind.js?url");
      await pagefind.init();
    } catch (error) {
      console.error("Falha ao carregar o Pagefind:", error);
    }
  };
  initPagefind();
});
```

**Motivo:** A rune `$effect()` substitui `onMount`. Como `$effect` não suporta funções async diretamente no callback, criamos uma função async interna e a invocamos imediatamente. O `$effect` executa automaticamente após o componente ser montado no DOM.

---

### 4. Reactive statement: `$:` → `$effect()`

**Antes:**
```svelte
$: if (query !== undefined) {
  performSearch();
}
```

**Depois:**
```svelte
$effect(() => {
  performSearch(query);
});
```

**Motivo:** Statements reativos com `$:` são substituídos por `$effect()`. O Svelte 5 rastreia automaticamente as dependências dentro do `$effect`, então quando `query` muda, o efeito é re-executado.

**Nota:** A função `performSearch` foi modificada para receber `query` como parâmetro ao invés de capturá-la do escopo externo, tornando as dependências mais explícitas.

---

### 5. Import removido

**Antes:**
```svelte
import { onMount } from "svelte";
```

**Depois:**
```svelte
// Removido - $effect() é uma rune, não precisa de import
```

**Motivo:** Runes são primitivas da linguagem no Svelte 5 e não precisam ser importadas.

---

## Código completo migrado

```svelte
<script lang="ts">
  import { debounce } from "lodash-es";
  import SearchResult from "./SearchResult.svelte";
  import { useTranslations } from '../../i18n/utils.ts';
  import { languages } from '../../i18n/ui.ts';

  let { lang }: { lang: keyof typeof languages } = $props();
  const t = useTranslations(lang);

  let query = $state("");
  let results: any[] = $state([]);
  let pagefind: any = $state(null);

  $effect(() => {
    const initPagefind = async () => {
      try {
        pagefind = await import("/pagefind/pagefind.js?url");
        await pagefind.init();
      } catch (error) {
        console.error("Falha ao carregar o Pagefind:", error);
      }
    };
    initPagefind();
  });

  const performSearch = debounce(async (searchQuery: string) => {
    if (searchQuery.trim().length > 0 && pagefind) {
      const searchResponse = await pagefind.debouncedSearch(searchQuery, {}, 100);
      results = searchResponse?.results || [];
    } else {
      results = [];
    }
  }, 100);

  $effect(() => {
    performSearch(query);
  });
</script>
```
