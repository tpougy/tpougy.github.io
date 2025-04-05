<script lang="ts">
  import { languages } from "@i18n/ui";
  import { defaultLang } from "@i18n/ui";
  import { format_locale_date } from "@i18n/utils";

  export let title: string = "";
  export let date: Date = new Date();
  export let author: string = "";
  export let lang: keyof typeof languages = defaultLang;

  $: formattedDate = format_locale_date(date, lang);

  // Remove hardcoded author constant
</script>

<!-- Container Principal - Apenas Estilos Inline -->
<!-- Styles: dark: zinc-900 | Fonte base -->
<div
  style="
    height: 100%;
    width: 100%;
    display: flex;
    background-color: #18181B;
    font-family: 'Poppins', sans-serif;
  "
>
  <!-- Container de Padding -->
  <!-- Styles: Padding do tutorial | Corrigido de alignItem -->
  <div
    style="
      padding: 40px;
      display: flex;
      width: 100%;
      height: 100%;
      justify-content: center;
      align-items: stretch;
    "
  >
    <!-- Caixa de Conteúdo Principal (com borda e sombra) -->
    <!-- Styles: dark: gray-600 | dark: gray-800 | Padding do tutorial -->
     <!-- 1F2937 -->
    <div
      style="
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        border: 1px solid #4B5563;
        box-shadow: 5px 5px 0px #1F2937;
        width: 100%;
        height: 100%;
        padding: 40px;
        background-image: radial-gradient(circle at 25px 25px, #333337 2%, transparent 0%), radial-gradient(circle at 75px 75px, #333337 2%, transparent 0%);
        background-size: 120px 120px;
      "
    >
      <!-- Seção do Título -->
      <!-- Styles: Tamanho do tutorial | Peso do tutorial | Altura de linha do tutorial | Padding do tutorial | dark: gray-50 (white) | Fonte do título -->
      <div
        style="
          font-size: 44px;
          font-weight: 900;
          line-height: 3rem;
          padding: 10px 0 50px 0;
          color: #F9FAFB;
          flex: 1;
          display: flex;
          font-family: 'DM Serif Display', serif;
        "
      >
        {title}
      </div>

      <!-- Seção do Rodapé (Data e Autor) -->
      <!-- Styles: Tamanho do tutorial | Peso do tutorial | dark: gray-50 (white) -->
      <div
        style="
          font-size: 30px;
          font-weight: 300;
          color: #F9FAFB;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
        "
      >
        <!-- Data Formatada -->
        <div>{formattedDate}</div>
        <!-- Nome do Autor (Fixo) -->
        <div style="display: flex; align-items: center;">
          <span style="margin-right: 16px;">{author}</span>
        </div>
      </div>
    </div>
  </div>
</div>