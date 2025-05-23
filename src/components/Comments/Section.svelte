<script>
  import { onMount, setContext } from 'svelte';
  import axios from 'redaxios';
  import Content from './Content.svelte';
  import Post from './Post.svelte';
  import { useTranslations } from '../../i18n/utils.ts';

  export let attrs;
  export let commentsResult = { data: [], pageCount: 0 };

  const t = useTranslations(attrs.lang);

  let page = 1;
  let loadingComments = true;
  let message = '';
  let error;
  let theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';

  const api = axios.create({
    baseURL: attrs.host || 'https://cusdis.com',
  });

  function setMessage(msg) {
    message = msg;
  }

  $: document.documentElement.style.setProperty('color-scheme', theme);

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

  onMount(() => {
    getComments();
  });

</script>

{#if !error}

<div class:dark={theme === 'dark'}>
  {#if message}
    <div class="p-2 mb-4 text-center rounded border border-black/15 transition-colors duration-300 ease-in-out hover:bg-black/5 hover:text-black dark:border-white/20 dark:hover:bg-white/5 dark:hover:text-whiteW">
      {message}
    </div>
  {/if}

  <Post lang={attrs.lang} />

  <div class="my-8" />

  <div class="mt-4 px-1">
    {#if loadingComments}
      <div class="text-black dark:text-gray-100">
        {t('comments.section.loading')}...
      </div>
    {:else}
      {#each commentsResult.data as comment (comment.id)}
        <Content {comment} lang={attrs.lang} />
      {/each}
      {#if commentsResult.pageCount > 1}
        <div>
          {#each Array(commentsResult.pageCount) as _, index}
            <button
              class="px-2 py-1 text-sm mr-2"
              class:underline={page === index + 1}
              on:click={() => onClickPage(index + 1)}>{index + 1}</button>
          {/each}
        </div>
      {/if}
    {/if}
  </div>

  <div class="my-4" />

  <div class="text-center text-black/50 dark:text-gray-100 text-xs">
    <a class="underline" href="https://cusdis.com">{t('comments.section.powered_by')}</a>
  </div>
</div>
{/if}
