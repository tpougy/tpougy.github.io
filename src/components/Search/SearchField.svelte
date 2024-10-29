<script lang="ts">
  import { onMount } from "svelte";
  import { debounce } from "lodash-es";
  import SearchResult from "./SearchResult.svelte";
  import { useTranslations } from '../../i18n/utils.ts';
  import {languages} from '../../i18n/ui.ts';

  export let lang: keyof typeof languages;
  const t = useTranslations(lang);

  let query = "";
  let results: any[] = [];
  let pagefind: any;

  

  // Inicializa o Pagefind quando o componente é montado
  onMount(async () => {
    try {
      pagefind = await import("/pagefind/pagefind.js?url");
      await pagefind.init();
    } catch (error) {
      console.error("Falha ao carregar o Pagefind:", error);
    }
  });

  // Executa a busca com debounce
  const performSearch = debounce(async () => {
    if (query.trim().length > 0 && pagefind) {
      const searchResponse = await pagefind.debouncedSearch(query, {}, 100);
      results = searchResponse?.results || [];
    } else {
      results = [];
    }
  }, 100);

  // Observa as mudanças na consulta
  $: if (query !== undefined) {
    performSearch();
  }

</script>

<div class="search-container space-y-4">
  <input
    type="text"
    bind:value={query}
    placeholder={t("search.placeholder")}
    class="w-full p-4 text-sm bg-gray-100 border border-black/15 rounded transition-colors duration-300 ease-in-out hover:bg-black/5 hover:text-black dark:bg-transparent dark:border-white/20 dark:hover:bg-white/5 dark:hover:text-white"
  />

  <div class="space-y-4">
    {#if results.length > 0}
      {#each results as result}
        <SearchResult {result} />
      {/each}
    {/if}
  </div>
</div>
