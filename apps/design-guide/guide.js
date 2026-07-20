/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 */

(function initialiseGuide() {
  "use strict";

  const translations = {
    "pt-PT": {
      skip:"Saltar para o conteúdo", project:"Projeto Comunitário de Milreu", title:"Guia do Sistema de Design",
      fontToggle:"Comparar corpo: Spectral", navPrinciples:"Princípios", navColours:"Cores", navTypography:"Tipografia", navComponents:"Componentes", navModes:"Portal e Museu", navPrint:"Impressão", navStatus:"Estado",
      foundation:"Fundação 0.1.0", foundations:"Fundações", introTitle:"Duas vozes, uma identidade", introText:"A comunidade ocupa a superfície; a instituição fornece moldura, proveniência e rigor.",
      communityVoice:"Voice A — Comunidade", communityText:"Fotografia, memória, relação e participação surgem primeiro.", institutionVoice:"Voice B — Instituição", institutionText:"Metadados, confiança, fontes, créditos e direitos funcionam como moldura.",
      colourTitle:"Sistema de cor", brickRule:"Regra: se o tijolo cobre uma área relevante, a composição está errada.", typeTitle:"Tipografia", bodySample:"As memórias revelam formas distintas de relação entre as pessoas e Milreu.",
      componentsBeta:"Componentes beta", componentsTitle:"Elementos nucleares", patterns:"Padrões", modesTitle:"Uma identidade, dois modos", portalMode:"Modo Portal", museumMode:"Modo Museu", projectShort:"Milreu", projectNav:"Projeto", museumNav:"Museu", dataNav:"Dados", libraryNav:"Biblioteca",
      portalPlaceholder:"Shell demonstrativo. Nenhuma página pública foi implementada.", imagePlaceholder:"Placeholder abstrato — sem fotografia real", backProject:"Voltar ao Projeto", memoryExample:"Memória demonstrativa", museumPlaceholder:"A fotografia ocupa a superfície; os detalhes surgem por camadas.", details:"Detalhes",
      physical:"Físico e digital", printTitle:"Fundação dos painéis", printExample:"Relações com Milreu", printText:"Composição demonstrativa à escala reduzida. Não é um painel pronto para impressão.",
      governance:"Governação", statusTitle:"Estado desta versão", statusText:"Tokens autoritativos e componentes beta. Logótipo, auditoria visual final, templates de impressão e Flutter permanecem pendentes."
    },
    en: {
      skip:"Skip to content", project:"Milreu Community Project", title:"Design System Guide", fontToggle:"Compare body: Spectral", navPrinciples:"Principles", navColours:"Colours", navTypography:"Typography", navComponents:"Components", navModes:"Portal and Museum", navPrint:"Print", navStatus:"Status",
      foundation:"Foundation 0.1.0", foundations:"Foundations", introTitle:"Two voices, one identity", introText:"The community occupies the surface; the institution provides framing, provenance and rigour.", communityVoice:"Voice A — Community", communityText:"Photography, memory, relationships and participation come first.", institutionVoice:"Voice B — Institution", institutionText:"Metadata, confidence, sources, credits and rights act as a frame.", colourTitle:"Colour system", brickRule:"Rule: if brick covers a significant area, the composition is wrong.", typeTitle:"Typography", bodySample:"Memories reveal different relationships between people and Milreu.", componentsBeta:"Beta components", componentsTitle:"Core elements", patterns:"Patterns", modesTitle:"One identity, two modes", portalMode:"Portal mode", museumMode:"Museum mode", projectShort:"Milreu", projectNav:"Project", museumNav:"Museum", dataNav:"Data", libraryNav:"Library", portalPlaceholder:"Demonstration shell. No public page has been implemented.", imagePlaceholder:"Abstract placeholder — no real photograph", backProject:"Back to Project", memoryExample:"Demonstration memory", museumPlaceholder:"Photography occupies the surface; details are progressively revealed.", details:"Details", physical:"Physical and digital", printTitle:"Panel foundations", printExample:"Relationships with Milreu", printText:"Reduced-scale demonstration. This is not a print-ready panel.", governance:"Governance", statusTitle:"Version status", statusText:"Authoritative tokens and beta components. Logo, final visual audit, print templates and Flutter remain pending."
    },
    es: {
      skip:"Saltar al contenido", project:"Proyecto Comunitario de Milreu", title:"Guía del Sistema de Diseño", fontToggle:"Comparar cuerpo: Spectral", navPrinciples:"Principios", navColours:"Colores", navTypography:"Tipografía", navComponents:"Componentes", navModes:"Portal y Museo", navPrint:"Impresión", navStatus:"Estado", foundation:"Fundación 0.1.0", foundations:"Fundamentos", introTitle:"Dos voces, una identidad", introText:"La comunidad ocupa la superficie; la institución aporta marco, procedencia y rigor.", communityVoice:"Voz A — Comunidad", communityText:"La fotografía, la memoria, las relaciones y la participación aparecen primero.", institutionVoice:"Voz B — Institución", institutionText:"Los metadatos, la confianza, las fuentes, los créditos y los derechos funcionan como marco.", colourTitle:"Sistema de color", brickRule:"Regla: si el ladrillo cubre un área relevante, la composición es incorrecta.", typeTitle:"Tipografía", bodySample:"Las memorias revelan distintas relaciones entre las personas y Milreu.", componentsBeta:"Componentes beta", componentsTitle:"Elementos esenciales", patterns:"Patrones", modesTitle:"Una identidad, dos modos", portalMode:"Modo Portal", museumMode:"Modo Museo", projectShort:"Milreu", projectNav:"Proyecto", museumNav:"Museo", dataNav:"Datos", libraryNav:"Biblioteca", portalPlaceholder:"Estructura de demostración. No se ha implementado ninguna página pública.", imagePlaceholder:"Marcador abstracto — sin fotografía real", backProject:"Volver al Proyecto", memoryExample:"Memoria demostrativa", museumPlaceholder:"La fotografía ocupa la superficie; los detalles aparecen por capas.", details:"Detalles", physical:"Físico y digital", printTitle:"Fundamentos de los paneles", printExample:"Relaciones con Milreu", printText:"Composición demostrativa a escala reducida. No es un panel listo para imprimir.", governance:"Gobernanza", statusTitle:"Estado de esta versión", statusText:"Tokens autoritativos y componentes beta. El logotipo, la auditoría visual final, las plantillas de impresión y Flutter siguen pendientes."
    },
    fr: {
      skip:"Aller au contenu", project:"Projet Communautaire de Milreu", title:"Guide du Système de Design", fontToggle:"Comparer le corps : Spectral", navPrinciples:"Principes", navColours:"Couleurs", navTypography:"Typographie", navComponents:"Composants", navModes:"Portail et Musée", navPrint:"Impression", navStatus:"État", foundation:"Fondation 0.1.0", foundations:"Fondations", introTitle:"Deux voix, une identité", introText:"La communauté occupe la surface ; l’institution apporte cadre, provenance et rigueur.", communityVoice:"Voix A — Communauté", communityText:"La photographie, la mémoire, les relations et la participation apparaissent en premier.", institutionVoice:"Voix B — Institution", institutionText:"Les métadonnées, le niveau de confiance, les sources, les crédits et les droits servent de cadre.", colourTitle:"Système de couleurs", brickRule:"Règle : si la couleur brique couvre une zone importante, la composition est incorrecte.", typeTitle:"Typographie", bodySample:"Les mémoires révèlent différentes relations entre les personnes et Milreu.", componentsBeta:"Composants bêta", componentsTitle:"Éléments essentiels", patterns:"Modèles", modesTitle:"Une identité, deux modes", portalMode:"Mode Portail", museumMode:"Mode Musée", projectShort:"Milreu", projectNav:"Projet", museumNav:"Musée", dataNav:"Données", libraryNav:"Bibliothèque", portalPlaceholder:"Structure de démonstration. Aucune page publique n’a été mise en œuvre.", imagePlaceholder:"Emplacement abstrait — aucune photographie réelle", backProject:"Retour au Projet", memoryExample:"Mémoire de démonstration", museumPlaceholder:"La photographie occupe la surface ; les détails apparaissent par couches.", details:"Détails", physical:"Physique et numérique", printTitle:"Fondations des panneaux", printExample:"Relations avec Milreu", printText:"Composition de démonstration à échelle réduite. Ce panneau n’est pas prêt à imprimer.", governance:"Gouvernance", statusTitle:"État de cette version", statusText:"Tokens faisant autorité et composants bêta. Le logo, l’audit visuel final, les modèles d’impression et Flutter restent à définir."
    }
  };

  let currentLanguage = "pt-PT";
  let bodyFont = "spectral";

  function applyLanguage(language) {
    const dictionary = translations[language] || translations["pt-PT"];
    currentLanguage = language;
    document.documentElement.lang = language;
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const key = node.dataset.i18n;
      if (dictionary[key]) node.textContent = dictionary[key];
    });
    updateFontButton();
  }

  function updateFontButton() {
    const button = document.getElementById("font-toggle");
    const name = bodyFont === "spectral" ? "Spectral" : "Archivo";
    const prefixes = {"pt-PT":"Comparar corpo", en:"Compare body", es:"Comparar cuerpo", fr:"Comparer le corps"};
    button.textContent = `${prefixes[currentLanguage] || prefixes["pt-PT"]}: ${name}`;
    document.getElementById("body-font-name").textContent = name;
  }

  document.getElementById("language-toggle").append(
    MilreuDS.createLanguageToggle({ active: currentLanguage, onChange: applyLanguage })
  );

  document.getElementById("font-toggle").addEventListener("click", () => {
    bodyFont = bodyFont === "spectral" ? "archivo" : "spectral";
    document.documentElement.dataset.bodyFont = bodyFont;
    updateFontButton();
  });

  const confidenceDemo = document.getElementById("confidence-demo");
  confidenceDemo.append(
    MilreuDS.createConfidenceDot({status:"confirmed", label:"Certa / Confirmed"}),
    MilreuDS.createConfidenceDot({status:"probable", label:"Provável / Probable"}),
    MilreuDS.createConfidenceDot({status:"hypothesis", label:"Hipótese / Hypothesis"}),
    MilreuDS.createStatusBadge("Beta")
  );

  document.getElementById("figure-demo").append(
    MilreuDS.createFigureCard({
      id:"MM20XXXX · EXEMPLO",
      title:"Relações com Milreu",
      text:"Registo demonstrativo. Não representa uma fotografia, pessoa, data ou memória real."
    })
  );
  document.getElementById("provenance-demo").append(
    MilreuDS.createProvenanceNote({
      eyebrow:"Proveniência",
      text:"Exemplo de nota institucional. A fonte e o nível de confiança devem ser indicados no registo real."
    })
  );
  document.getElementById("rights-demo").append(
    MilreuDS.createRightsNotice({
      text:"As fotografias e narrativas integram um processo comunitário vivo. O registo real deverá oferecer um canal de correção, contestação ou remoção."
    })
  );
  document.getElementById("footer").append(MilreuDS.createStandardFooter());
  applyLanguage(currentLanguage);
})();
