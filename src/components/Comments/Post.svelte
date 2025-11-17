<script>
  import { getContext } from 'svelte';
  import { useTranslations } from '../../i18n/utils.ts';

  export let lang;
  export let parentId;
  export let onSuccess;

  let content = '';
  let nickname = '';
  let email = '';
  let loading = false;

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

<div class="grid grid-cols-1 gap-4">
  <div class="grid grid-cols-2 gap-4">
    <div class="px-1">
      <label class="mb-2 block text-black dark:text-white" for="nickname">{t('comments.post.nickname')}</label>
      <input
        name="nickname"
        class="w-full p-2 text-sm bg-white px-4 border border-black hover:bg-black hover:text-white dark:bg-black dark:border-white dark:hover:bg-white dark:hover:text-black"
        type="text"
        title={t('nickname')}
        bind:value={nickname}
      />
    </div>
    <div class="px-1">
      <label class="mb-2 block text-black dark:text-white" for="email">{t('comments.post.email')}</label>
      <input
        name="email"
        class="w-full p-2 text-sm bg-white px-4 border border-black hover:bg-black hover:text-white dark:bg-black dark:border-white dark:hover:bg-white dark:hover:text-black"
        type="email"
        title={t('comments.post.email')}
        bind:value={email}
      />
    </div>
  </div>

  <div class="px-1">
    <label class="mb-2 block text-black dark:text-white" for="reply_content">{t('comments.post.reply_placeholder')}</label>
    <textarea
      name="reply_content"
      class="w-full p-2 text-sm bg-white px-4 border border-black hover:bg-black hover:text-white dark:bg-black dark:border-white dark:hover:bg-white dark:hover:text-black"
      title={t('reply_placeholder')}
      bind:value={content}
    />
  </div>

  <div class="px-1">
    <button
      class="group relative flex w-fit flex-nowrap border border-black py-1.5 pl-8 pr-3 hover:bg-black hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-black"
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
        <!-- Checkmark -->
        <polyline
          points="7 11 10 14 17 8"
        />
      </svg>
      <!-- Texto do Botão -->
      <div class="font-serif text-sm font-bold">
        {loading ? t('comments.post.sending') : t('comments.post.post_comment')}
      </div>
    </button>
  </div>
  
  

</div>
