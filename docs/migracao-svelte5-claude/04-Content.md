# Migração: Content.svelte

**Arquivo:** `src/components/Comments/Content.svelte`

Componente que exibe um comentário individual e suas respostas aninhadas (usa recursão com `svelte:self`).

## Mudanças realizadas

### 1. Props: `export let` → `$props()`

**Antes:**
```svelte
export let lang;
export let comment;
export let showReplyForm = false;
export let isChild = false;
```

**Depois:**
```svelte
let { lang, comment, showReplyForm = false, isChild = false } = $props();
```

**Motivo:** Props são declaradas com destructuring usando `$props()`.

---

### 2. Estado local para prop mutável

**Antes:**
```svelte
export let showReplyForm = false;
// Usado diretamente: showReplyForm = !showReplyForm
```

**Depois:**
```svelte
let { showReplyForm = false } = $props();
let localShowReplyForm = $state(showReplyForm);
// Usado: localShowReplyForm = !localShowReplyForm
```

**Motivo:** No Svelte 5, props são readonly por padrão. Para ter um estado local que pode ser modificado (toggle do formulário de resposta), criamos uma variável `$state()` inicializada com o valor da prop.

---

### 3. Valor derivado: `$:` → `$derived()`

**Antes:**
```svelte
$: sortedReplies = comment.replies.data.slice().sort((a, b) => {
  return new Date(a.createdAt) - new Date(b.createdAt);
});
```

**Depois:**
```svelte
let sortedReplies = $derived(
  comment.replies.data.slice().sort((a, b) => {
    return new Date(a.createdAt) - new Date(b.createdAt);
  })
);
```

**Motivo:** Valores computados/derivados que dependem de outros valores reativos devem usar `$derived()`. Quando `comment.replies.data` mudar, `sortedReplies` será recalculado automaticamente.

---

### 4. Event handler: `on:click` → `onclick`

**Antes:**
```svelte
<button on:click={() => (showReplyForm = !showReplyForm)}>
```

**Depois:**
```svelte
<button onclick={() => (localShowReplyForm = !localShowReplyForm)}>
```

**Motivo:** Svelte 5 usa a sintaxe nativa de eventos HTML.

---

## Código completo migrado (script)

```svelte
<script>
  import { getContext } from 'svelte';
  import { useTranslations } from "../../i18n/utils.ts";
  import Post from './Post.svelte';
  import Self from './Content.svelte';

  let { lang, comment, showReplyForm = false, isChild = false } = $props();

  // svelte-ignore state_referenced_locally
  let localShowReplyForm = $state(showReplyForm);

  // svelte-ignore state_referenced_locally
  const t = useTranslations(lang);
  const { showIndicator } = getContext('attrs');

  // Valor derivado para ordenar replies
  let sortedReplies = $derived(
    comment.replies.data.slice().sort((a, b) => {
      return new Date(a.createdAt) - new Date(b.createdAt);
    })
  );
</script>
```

---

### 5. Recursão: `svelte:self` → self-import

**Antes:**
```svelte
{#each sortedReplies as child (child.id)}
  <svelte:self isChild={true} comment={child} lang={lang} />
{/each}
```

**Depois:**
```svelte
<script>
  import Self from './Content.svelte';
</script>

{#each sortedReplies as child (child.id)}
  <Self isChild={true} comment={child} lang={lang} />
{/each}
```

**Motivo:** `<svelte:self>` está deprecado no Svelte 5. A alternativa é importar o próprio componente com um alias (convencionalmente `Self`).

---

### 6. Suprimindo warnings

Adicionados comentários `svelte-ignore` para suprimir warnings intencionais:

```svelte
// svelte-ignore state_referenced_locally
let localShowReplyForm = $state(showReplyForm);

// svelte-ignore state_referenced_locally
const t = useTranslations(lang);
```

**Motivo:** Esses warnings indicam que o valor inicial da prop é capturado, o que é o comportamento desejado nestes casos.

---

## Notas importantes

### getContext
O `getContext` continua sendo importado do Svelte e funciona da mesma forma. Não é uma rune.
