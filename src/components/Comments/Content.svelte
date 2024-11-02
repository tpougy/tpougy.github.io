<script>
  import { getContext } from 'svelte';
  import { useTranslations } from "../../i18n/utils.ts";
  import Post from './Post.svelte';

  export let lang;
  export let comment;
  export let showReplyForm = false;
  export let isChild = false;
  
  const t = useTranslations(lang);
  const { showIndicator } = getContext('attrs');

  // Reactive statement to sort replies by creation date (oldest first)
  $: sortedReplies = comment.replies.data.slice().sort((a, b) => {
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

</script>

<div
  class="my-4"
  class:pl-4={isChild}
  class:border-l-2={isChild}
  class:border-color-gray-200={isChild}
  class:cusdis-indicator={showIndicator}
>
<div class="flex items-center">
  <div class="mr-2 font-medium dark:text-gray-100">
    {comment.moderator && comment.moderator.displayName ? comment.moderator.displayName : comment.by_nickname}
  </div>

  {#if comment.moderatorId}
    <div class="mr-2 dark:bg-gray-500 bg-gray-200 text-xs py-0.5 px-1 rounded dark:text-gray-100">
      <span>{t('comments.content.mod_badge')}</span>
    </div>
  {/if}
</div>

<div class="text-black/50 text-sm dark:text-gray-400">
  {comment.parsedCreatedAt}
</div>

<div class="text-black my-2 dark:text-gray-200">
  {@html comment.parsedContent}
</div>

{#if sortedReplies.length > 0}
  {#each sortedReplies as child (child.id)}
    <svelte:self isChild={true} comment={child} lang={lang} />
  {/each}
{/if}

{#if !isChild}
  <div>
    <button
      class="group relative mt-2 rounded border border-black/15 pl-5 pr-1 pb-1 transition-colors duration-300 ease-in-out hover:bg-black/5 hover:text-black dark:border-white/20 dark:hover:bg-white/5 dark:hover:text-white"
      type="button"
      on:click={() => (showReplyForm = !showReplyForm)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        class="absolute left-1 top-1/2 w-4 h-4 -translate-y-1/2 fill-none stroke-current stroke-2"
      >
        <circle
          cx="12"
          cy="12"
          r="1"
          class="fill-current text-white transform scale-100 transition-transform duration-300 ease-in origin-center group-hover:scale-0"
        />
        <path
          d="M10 7l-3 3l3 3"
          class="[stroke-dasharray:10] [stroke-dashoffset:10] transition-[stroke-dashoffset] duration-300 ease-in-out group-hover:[stroke-dashoffset:0]"
        />
        <path
          d="M17 13v-1a2 2 0 0 0-2-2H7"
          class="[stroke-dasharray:20] [stroke-dashoffset:20] transition-[stroke-dashoffset] duration-300 ease-in-out group-hover:[stroke-dashoffset:0] delay-150"
        />
      </svg>
      <div class="font-serif text-sm font-bold">
        <!-- Reply -->
        {t('comments.content.reply_btn')}
      </div>
    </button>

    {#if showReplyForm}
      <div class="mt-4 pl-4 border-l-2 border-gray-200">
        <Post
          parentId={comment.id}
          onSuccess={() => (showReplyForm = false)}
          lang={lang}
        />
      </div>
    {/if}
  </div>
{/if}

</div>
