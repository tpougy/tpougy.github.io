# Migração: Section.svelte

**Arquivo:** `src/components/Comments/Section.svelte`

Container principal do sistema de comentários Cusdis. Gerencia estado, API e contexto para componentes filhos.

## Mudanças realizadas

### 1. Props: `export let` → `$props()`

**Antes:**
```svelte
export let attrs;
export let commentsResult = { data: [], pageCount: 0 };
```

**Depois:**
```svelte
let { attrs, commentsResult = { data: [], pageCount: 0 } } = $props();
```

**Motivo:** Props são declaradas com destructuring usando `$props()`. Valores default são definidos diretamente no destructuring.

---

### 2. Estado reativo: `let` → `$state()`

**Antes:**
```svelte
let page = 1;
let loadingComments = true;
let message = '';
let error;
let theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
```

**Depois:**
```svelte
let page = $state(1);
let loadingComments = $state(true);
let message = $state('');
let error = $state(undefined);
let theme = $state(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
```

**Motivo:** Todo estado reativo deve usar `$state()` explicitamente.

---

### 3. Reactive statement: `$:` → `$effect()`

**Antes:**
```svelte
$: document.documentElement.style.setProperty('color-scheme', theme);
```

**Depois:**
```svelte
$effect(() => {
  document.documentElement.style.setProperty('color-scheme', theme);
});
```

**Motivo:** Statements reativos que produzem efeitos colaterais devem usar `$effect()`.

---

### 4. Lifecycle com cleanup: `onMount` → `$effect()`

**Antes:**
```svelte
onMount(() => {
  function onMessage(e) {
    try {
      const msg = JSON.parse(e.data);
      if (msg.from === 'cusdis') {
        if (msg.event === 'setTheme') {
          theme = msg.data;
        }
      }
    } catch (e) {}
  }
  window.addEventListener('message', onMessage);

  return () => {
    window.removeEventListener('message', onMessage);
  };
});
```

**Depois:**
```svelte
$effect(() => {
  function onMessage(e) {
    try {
      const msg = JSON.parse(e.data);
      if (msg.from === 'cusdis') {
        if (msg.event === 'setTheme') {
          theme = msg.data;
        }
      }
    } catch (e) {}
  }
  window.addEventListener('message', onMessage);

  return () => {
    window.removeEventListener('message', onMessage);
  };
});
```

**Motivo:** O `$effect()` suporta cleanup functions retornando uma função, igual ao `onMount`. A função de cleanup é executada antes do efeito ser re-executado ou quando o componente é desmontado.

---

### 5. Inicialização: `onMount` → `$effect()`

**Antes:**
```svelte
onMount(() => {
  getComments();
});
```

**Depois:**
```svelte
$effect(() => {
  getComments();
});
```

**Motivo:** Código de inicialização que roda uma vez após o mount usa `$effect()`.

---

### 6. Event handler: `on:click` → `onclick`

**Antes:**
```svelte
<button on:click={() => onClickPage(index + 1)}>
```

**Depois:**
```svelte
<button onclick={() => onClickPage(index + 1)}>
```

**Motivo:** Svelte 5 usa a sintaxe nativa de eventos HTML (`onclick`) ao invés da diretiva `on:`.

---

### 7. Import atualizado

**Antes:**
```svelte
import { onMount, setContext } from 'svelte';
```

**Depois:**
```svelte
import { setContext } from 'svelte';
```

**Motivo:** `onMount` foi substituído por `$effect()`. `setContext` continua sendo importado normalmente pois não é uma rune.

---

## Código completo migrado (script)

```svelte
<script>
  import { setContext } from 'svelte';
  import axios from 'redaxios';
  import Content from './Content.svelte';
  import Post from './Post.svelte';
  import { useTranslations } from '../../i18n/utils.ts';

  let { attrs, commentsResult = { data: [], pageCount: 0 } } = $props();

  const t = useTranslations(attrs.lang);

  let page = $state(1);
  let loadingComments = $state(true);
  let message = $state('');
  let error = $state(undefined);
  let theme = $state(document.documentElement.classList.contains('dark') ? 'dark' : 'light');

  const api = axios.create({
    baseURL: attrs.host || 'https://cusdis.com',
  });

  function setMessage(msg) {
    message = msg;
  }

  $effect(() => {
    document.documentElement.style.setProperty('color-scheme', theme);
  });

  $effect(() => {
    function onMessage(e) {
      try {
        const msg = JSON.parse(e.data);
        if (msg.from === 'cusdis') {
          if (msg.event === 'setTheme') {
            theme = msg.data;
          }
        }
      } catch (e) {}
    }
    window.addEventListener('message', onMessage);

    return () => {
      window.removeEventListener('message', onMessage);
    };
  });

  setContext('api', api);
  setContext('attrs', attrs);
  setContext('refresh', getComments);
  setContext('setMessage', setMessage);

  async function getComments(p = 1) {
    loadingComments = true;
    try {
      const res = await api.get(`/api/open/comments`, {
        headers: {
          'x-timezone-offset': -new Date().getTimezoneOffset(),
        },
        params: {
          page: p,
          appId: attrs.appId,
          pageId: attrs.pageId,
        },
      });
      commentsResult = res.data.data;
    } catch (e) {
      error = e;
    } finally {
      loadingComments = false;
    }
  }

  function onClickPage(p) {
    page = p;
    getComments(p);
  }

  $effect(() => {
    getComments();
  });
</script>
```
