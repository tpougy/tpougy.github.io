<script lang="ts">
  import { onMount } from 'svelte';

  export let result: any;

  let data: any = {};
  let title = '';
  let excerpt = '';

  onMount(async () => {
    data = await result.data();
    console.log(data, data.meta.title, data.excerpt);
    title = data.meta.title || data.url;
    excerpt = data.excerpt;
  });
</script>

<a
  href={data.url}
  class="group relative flex flex-nowrap border border-black px-4 py-3 pr-10 hover:bg-black hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-black"
>
  <div class="flex flex-1 flex-col truncate">
    <div class="font-serif font-semibold">{title}</div>
    <div class="text-sm line-clamp-2">
      {@html excerpt}
    </div>
  </div>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    class="absolute right-2 top-1/2 w-5 h-5 -translate-y-1/2 fill-none stroke-current stroke-2"
  >
    <line
      x1="5"
      y1="12"
      x2="19"
      y2="12"
      class="group-hover:scale-x-100"
    />
    <polyline
      points="12 5 19 12 12 19"
    />
  </svg>
</a>
