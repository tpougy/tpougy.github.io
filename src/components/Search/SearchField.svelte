<script lang="ts">
  import { onMount } from "svelte";
  import { debounce } from "lodash-es";
  import SearchResult from "./SearchResult.svelte";

  let query = "";
  let results: any[] = [];
  let pagefind: any;

  // Inicializa o Pagefind quando o componente é montado
  onMount(async () => {
    try {
      console.log("Pagefind inicializando...");
      pagefind = await import("/pagefind/pagefind.js?url");
      await pagefind.init();
      console.log("Pagefind inicializado com sucesso.");
    } catch (error) {
      console.error("Falha ao carregar o Pagefind:", error);
    }
  });

  // Executa a busca com debounce
  const performSearch = debounce(async () => {
    const filters = await pagefind.filters();
    console.log("Fiters:")
    console.log(filters)
    console.log("Executando performSearch");
    if (query.trim().length > 0 && pagefind) {
      console.log("Realizando busca por:", query);
      const searchResponse = await pagefind.debouncedSearch(query, {}, 100);
      results = searchResponse?.results || [];
      console.log("Resultados obtidos:", results);
    } else {
      results = [];
      console.log("Consulta vazia ou Pagefind não inicializado");
    }
  }, 100);

  // Observa as mudanças na consulta
  $: if (query !== undefined) {
    console.log("Query mudou:", query);
    performSearch();
  }

  // Função para lidar com eventos de entrada
  function handleInput(event: Event) {
    console.log("Executando handle input");
    // Não atualize 'query' aqui, pois 'bind:value' já faz isso
  }
</script>

<div class="search-container space-y-4">
  <input
    type="text"
    bind:value={query}
    on:input={handleInput}
    placeholder="Buscar..."
    class="w-full p-4 border border-black/15 rounded-lg bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-white/20 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
  />

  <div class="space-y-4">
    {#if results.length > 0}
      {#each results as result}
        <SearchResult {result} />
      {/each}
    {/if}
  </div>
</div>
