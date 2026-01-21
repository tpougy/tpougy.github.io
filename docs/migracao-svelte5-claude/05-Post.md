# Migração: Post.svelte

**Arquivo:** `src/components/Comments/Post.svelte`

Formulário para postar novos comentários ou respostas no sistema Cusdis.

## Mudanças realizadas

### 1. Props: `export let` → `$props()`

**Antes:**
```svelte
export let lang;
export let parentId;
export let onSuccess;
```

**Depois:**
```svelte
let { lang, parentId, onSuccess } = $props();
```

**Motivo:** Props são declaradas com destructuring usando `$props()`.

---

### 2. Estado reativo: `let` → `$state()`

**Antes:**
```svelte
let content = '';
let nickname = '';
let email = '';
let loading = false;
```

**Depois:**
```svelte
let content = $state('');
let nickname = $state('');
let email = $state('');
let loading = $state(false);
```

**Motivo:** Estado que é modificado e precisa atualizar a UI deve usar `$state()`.

---

### 3. Event handler: `on:click` → `onclick`

**Antes:**
```svelte
<button on:click={addComment}>
```

**Depois:**
```svelte
<button onclick={addComment}>
```

**Motivo:** Svelte 5 usa a sintaxe nativa de eventos HTML.

---

### 4. Two-way binding

O `bind:value` continua funcionando da mesma forma no Svelte 5:

```svelte
<input bind:value={nickname} />
<input bind:value={email} />
<textarea bind:value={content} />
```

**Nota:** `bind:value` funciona com variáveis `$state()`. Se a prop precisasse ser "bindable" do componente pai, usaríamos `$bindable()`, mas neste caso o estado é local.

---

## Código completo migrado (script)

```svelte
<script>
  import { getContext } from 'svelte';
  import { useTranslations } from '../../i18n/utils.ts';

  let { lang, parentId, onSuccess } = $props();

  let content = $state('');
  let nickname = $state('');
  let email = $state('');
  let loading = $state(false);

  const t = useTranslations(lang);
  const api = getContext('api');
  const setMessage = getContext('setMessage');
  const { appId, pageId, pageUrl, pageTitle } = getContext('attrs');
  const refresh = getContext('refresh');

  async function addComment() {
    if (!content) {
      alert(t('comments.post.content_is_required'));
      return;
    }

    if (!nickname) {
      alert(t('comments.post.nickname_is_required'));
      return;
    }

    try {
      loading = true;
      await api.post('/api/open/comments', {
        appId,
        pageId,
        content,
        nickname,
        email,
        parentId,
        pageUrl,
        pageTitle,
      });
      await refresh();
      teardown();
      setMessage(t('comments.post.comment_has_been_sent'));
    } finally {
      loading = false;
    }
  }

  function teardown() {
    content = '';
    nickname = '';
    email = '';
    onSuccess && onSuccess();
  }
</script>
```

## Notas importantes

### Callback props
A prop `onSuccess` é um callback passado pelo componente pai. No Svelte 5, callbacks funcionam da mesma forma - são simplesmente funções passadas como props e invocadas quando necessário:

```javascript
onSuccess && onSuccess();
```

### getContext
O `getContext` continua funcionando normalmente. Ele obtém valores do contexto definido pelo componente pai (`Section.svelte`).
