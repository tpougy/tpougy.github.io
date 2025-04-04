import React from "react"; // Necessário para JSX

// Define a interface para as props (usando JSDoc para simplicidade em .jsx)
/**
 * @typedef {object} OgData
 * @property {string} title
 * @property {Date} date
 * @property {keyof import('../../i18n/ui').languages} lang // Use keys from ui.ts
 * // author prop remains removed
 */

/**
 * @param {OgData} props
 */
const OgTemplate = (props) => {
  // Remove lang and author from destructuring
  const {
    title = "Default Title",
    date = new Date(),
    lang = "en", // Re-add lang prop with default
  } = props;
  const author = "tpougy.blog"; // Keep author hardcoded

  // Formata a data com base no idioma
  // Use the lang prop for date formatting
  const formattedDate = date.toLocaleDateString(
    lang === "pt" ? "pt-BR" : "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  return (
    <div
      style={{
        height: "100%", // Match tutorial structure
        width: "100%", // Match tutorial structure
        display: "flex",
        backgroundColor: "#18181B", // dark: zinc-900
        fontFamily: "'Poppins', sans-serif", // Fonte base
        backgroundImage:
          "radial-gradient(circle at 25px 25px, #27272A 2%, transparent 0%), radial-gradient(circle at 75px 75px, #27272A 2%, transparent 0%)", // dark: zinc-800 for dots
        backgroundSize: "100px 100px",
      }}
    >
      {/* Container de Padding */}
      <div
        style={{
          padding: "20px",
          display: "flex",
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "stretch",
        }}
      >
        {/* Caixa de Conteúdo Principal */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            border: "1px solid #4B5563", // dark: gray-600
            boxShadow: "5px 5px 0px #1F2937", // dark: gray-800
            width: "100%",
            height: "100%",
            padding: "10px", // Match tutorial padding
          }}
        >
          {/* Seção do Título */}
          <div
            style={{
              fontSize: "32px", // Match tutorial font size
              fontWeight: 900, // Match tutorial font weight
              lineHeight: "3rem", // Match tutorial line height
              padding: "10px 0 50px 0", // Match tutorial padding
              color: "#F9FAFB", // dark: gray-50 (white)
              flex: 1,
              display: "flex",
              fontFamily: "'DM Serif Display', serif", // Fonte do título
            }}
          >
            {title}
          </div>

          {/* Seção do Rodapé */}
          <div
            style={{
              fontSize: "16px", // Match tutorial font size
              fontWeight: 900, // Match tutorial font weight (use Poppins Black if available, or Bold 700 is ok)
              color: "#F9FAFB", // dark: gray-50 (white)
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* Data Formatada */}
            <div>{formattedDate}</div>
            {/* Nome do Autor */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ marginRight: "16px" }}>{author}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OgTemplate;
