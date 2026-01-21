# Migração: SearchResult.svelte

**Arquivo:** `src/components/Search/SearchResult.svelte`

Componente que exibe um resultado individual da busca Pagefind.

## Mudanças realizadas

### 1. Props: `export let` → `$props()`

**Antes:**
```svelte
export let result: any;
```

**Depois:**
```svelte
let { result }: { result: any } = $props();
```

**Motivo:** Props são declaradas usando `$props()` com destructuring no Svelte 5.

---

### 2. Estado reativo: `let` → `$state()`

**Antes:**
```svelte
let data: any = {};
let title = '';
let excerpt = '';
```

**Depois:**
```svelte
let data: any = $state({});
let title = $state('');
let excerpt = $state('');
```

**Motivo:** Estado que precisa ser reativo deve usar `$state()` explicitamente.

---

### 3. Lifecycle: `onMount` → `$effect()`

**Antes:**
```svelte
import { onMount } from 'svelte';

onMount(async () => {
  data = await result.data();
  console.log(data, data.meta.title, data.excerpt);
  title = data.meta.title || data.url;
  excerpt = data.excerpt;
});
```

**Depois:**
```svelte
$effect(() => {
  const loadData = async () => {
    data = await result.data();
    console.log(data, data.meta.title, data.excerpt);
    title = data.meta.title || data.url;
    excerpt = data.excerpt;
  };
  loadData();
});
```

**Motivo:** O `$effect()` substitui `onMount`. Como `$effect` não pode ser async diretamente, usamos uma função async interna.

---

### 4. Import removido

**Antes:**
```svelte
import { onMount } from 'svelte';
```

**Depois:**
```svelte
// Removido - $effect() é uma rune nativa
```

---

## Código completo migrado

```svelte
<script lang="ts">
  let { result }: { result: any } = $props();

  let data: any = $state({});
  let title = $state('');
  let excerpt = $state('');

  $effect(() => {
    const loadData = async () => {
      data = await result.data();
      console.log(data, data.meta.title, data.excerpt);
      title = data.meta.title || data.url;
      excerpt = data.excerpt;
    };
    loadData();
  });
</script>
```
