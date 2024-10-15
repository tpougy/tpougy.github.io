<script>
  import { getContext } from 'svelte';
  import { t } from '../i18n';

  export let parentId;
  export let onSuccess;

  let content = '';
  let nickname = '';
  let email = '';
  let loading = false;

  const api = getContext('api');
  const setMessage = getContext('setMessage');
  const { appId, pageId, pageUrl, pageTitle } = getContext('attrs');
  const refresh = getContext('refresh');

  async function addComment() {
    if (!content) {
      alert(t('content_is_required'));
      return;
    }

    if (!nickname) {
      alert(t('nickname_is_required'));
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
      setMessage(t('comment_has_been_sent'));
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

<div class="grid grid-cols-1 gap-4">
  <div class="grid grid-cols-2 gap-4">
    <div class="px-1">
      <label class="mb-2 block text-black dark:text-white" for="nickname">{t('nickname')}</label>
      <input
        name="nickname"
        class="w-full p-2 text-sm bg-gray-100 px-4 font-bold border border-black/15 rounded transition-colors duration-300 ease-in-out hover:bg-black/5 hover:text-black dark:bg-transparent dark:border-white/20 dark:hover:bg-white/5 dark:hover:text-white"
        type="text"
        title={t('nickname')}
        bind:value={nickname}
      />
    </div>
    <div class="px-1">
      <label class="mb-2 block text-black dark:text-white" for="email">{t('email')}</label>
      <input
        name="email"
        class="w-full p-2 text-sm bg-gray-100 px-4 font-bold border border-black/15 rounded transition-colors duration-300 ease-in-out hover:bg-black/5 hover:text-black dark:bg-transparent dark:border-white/20 dark:hover:bg-white/5 dark:hover:text-white"
        type="email"
        title={t('email')}
        bind:value={email}
      />
    </div>
  </div>

  <div class="px-1">
    <label class="mb-2 block text-black dark:text-white" for="reply_content">{t('reply_placeholder')}</label>
    <textarea
      name="reply_content"
      class="w-full p-2 text-sm bg-gray-100 px-4 font-bold border border-black/15 rounded transition-colors duration-300 ease-in-out hover:bg-black/5 hover:text-black dark:bg-transparent dark:border-white/20 dark:hover:bg-white/5 dark:hover:text-white"
      title={t('reply_placeholder')}
      bind:value={content}
    />
  </div>

  <div class="px-1">
    <button
      class="group relative flex w-fit flex-nowrap rounded border border-black/15 py-1.5 pl-8 pr-3 transition-colors duration-300 ease-in-out hover:bg-black/5 hover:text-black dark:border-white/20 dark:hover:bg-white/5 dark:hover:text-white"
      class:cusdis-disabled={loading}
      on:click={addComment}
    >
      <!-- Ícone de Comentário com Checkmark -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        class="absolute left-2 top-1/2 w-4 h-4 -translate-y-1/2 fill-none stroke-current stroke-2"
      >
        <!-- Contorno do Comentário -->
        <path
          d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
        />
        <!-- Checkmark com Animação -->
        <polyline
          points="7 11 10 14 17 8"
          class="[stroke-dasharray:40] [stroke-dashoffset:40] transition-[stroke-dashoffset] duration-300 ease-in-out group-hover:[stroke-dashoffset:0]"
        />
      </svg>
      <!-- Texto do Botão -->
      <div class="font-serif text-sm font-bold">
        {loading ? t('sending') : t('post_comment')}
      </div>
    </button>
  </div>
  
  

</div>
