# Migração Svelte 4 para Svelte 5

Este documento descreve a migração dos componentes Svelte deste projeto da versão 4 para a versão 5 (Runes).

## Por que migrar?

O Svelte 5 introduz um novo sistema de reatividade chamado **Runes**, que substitui a "mágica" do compilador por primitivas explícitas. As principais vantagens são:

1. **Reatividade explícita**: Fica claro o que é reativo e o que não é
2. **Melhor performance**: O novo sistema é mais eficiente
3. **Compatibilidade com Astro 5**: O `@astrojs/svelte@7.x` requer Svelte 5

## Principais mudanças de sintaxe

### 1. Props: `export let` → `$props()`

**Svelte 4:**
```svelte
<script>
  export let name;
  export let count = 0;
</script>
```

**Svelte 5:**
```svelte
<script>
  let { name, count = 0 } = $props();
</script>
```

### 2. Estado reativo: `let` → `$state()`

**Svelte 4:**
```svelte
<script>
  let count = 0;
</script>
```

**Svelte 5:**
```svelte
<script>
  let count = $state(0);
</script>
```

### 3. Valores derivados: `$:` → `$derived()`

**Svelte 4:**
```svelte
<script>
  export let items;
  $: total = items.length;
  $: doubled = count * 2;
</script>
```

**Svelte 5:**
```svelte
<script>
  let { items } = $props();
  let total = $derived(items.length);
  let doubled = $derived(count * 2);
</script>
```

### 4. Efeitos colaterais: `$:` → `$effect()`

**Svelte 4:**
```svelte
<script>
  $: console.log('count changed:', count);
  $: document.title = `Count: ${count}`;
</script>
```

**Svelte 5:**
```svelte
<script>
  $effect(() => {
    console.log('count changed:', count);
  });

  $effect(() => {
    document.title = `Count: ${count}`;
  });
</script>
```

### 5. Lifecycle: `onMount` → `$effect()`

**Svelte 4:**
```svelte
<script>
  import { onMount } from 'svelte';

  onMount(() => {
    console.log('mounted');
    return () => console.log('cleanup');
  });
</script>
```

**Svelte 5:**
```svelte
<script>
  $effect(() => {
    console.log('mounted');
    return () => console.log('cleanup');
  });
</script>
```

### 6. Event handlers: `on:click` → `onclick`

**Svelte 4:**
```svelte
<button on:click={handleClick}>Click</button>
<button on:click={() => count++}>Increment</button>
```

**Svelte 5:**
```svelte
<button onclick={handleClick}>Click</button>
<button onclick={() => count++}>Increment</button>
```

### 7. Two-way binding com props: `bind:value` + `export let` → `$bindable()`

**Svelte 4:**
```svelte
<script>
  export let value;
</script>
<input bind:value />
```

**Svelte 5:**
```svelte
<script>
  let { value = $bindable() } = $props();
</script>
<input bind:value />
```

## Componentes migrados

| Componente | Arquivo | Descrição |
|------------|---------|-----------|
| SearchField | `src/components/Search/SearchField.svelte` | Campo de busca com Pagefind |
| SearchResult | `src/components/Search/SearchResult.svelte` | Resultado individual da busca |
| Section | `src/components/Comments/Section.svelte` | Container principal de comentários |
| Content | `src/components/Comments/Content.svelte` | Exibição de um comentário |
| Post | `src/components/Comments/Post.svelte` | Formulário para postar comentário |
| OGImage | `src/components/OpenGraph/OGImage.svelte` | Template para imagem Open Graph |

## Outras mudanças importantes

### Self-closing tags

Svelte 5 emite warnings para tags HTML não-void que são self-closing:

```svelte
<!-- Antes (warning) -->
<div class="spacer" />
<textarea bind:value={text} />

<!-- Depois (correto) -->
<div class="spacer"></div>
<textarea bind:value={text}></textarea>
```

### Recursão: `svelte:self` → self-import

`<svelte:self>` está deprecado. Use self-import:

```svelte
<!-- Antes -->
<svelte:self prop={value} />

<!-- Depois -->
<script>
  import Self from './Component.svelte';
</script>
<Self prop={value} />
```

### Suprimindo warnings de `state_referenced_locally`

Quando props são usadas para inicializar constantes (comportamento intencional), use:

```svelte
// svelte-ignore state_referenced_locally
const t = useTranslations(lang);
```

## Referências

- [Svelte 5 Migration Guide](https://svelte.dev/docs/svelte/v5-migration-guide)
- [Svelte 5 Runes](https://svelte.dev/docs/svelte/runes)
