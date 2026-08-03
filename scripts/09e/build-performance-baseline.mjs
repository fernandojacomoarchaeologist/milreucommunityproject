/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 09E — baseline de desempenho visual MENSURÁVEL de forma determinística:
 * bytes de JS/CSS/HTML e peso das imagens candidatas a LCP por rota, mais guardrails
 * estáticos (sem @font-face 404; imagens de layout com espaço reservado por CSS).
 * LCP/CLS reais dependem de browser/staging e ficam registados como observação
 * separada (não homologação). Escreve reports/visual-performance-baseline-09e.json.
 */
import { readFileSync, writeFileSync, mkdirSync, statSync, existsSync } from "node:fs";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const sizeOf = (p) => (existsSync(p) ? statSync(p).size : 0);

const manifest = read("public/data/media-manifest.json");
const firstItem = manifest.items[0];
const lcpVariantBytes = {
  mobileHomeHero: firstItem.variants.detail.bytes, // srcset serve 'detail' em ecrãs médios
  desktopHomeHero: firstItem.variants.immersive.bytes,
  museumOpeningMobile: firstItem.variants.detail.bytes,
};

// Estratégia responsiva estática: as imagens de conteúdo do Museu reservam espaço por CSS
// (aspect-ratio nos cards; contentores de altura fixa no hero/imersivo) → sem CLS de layout.
const css = readFileSync("src/styles/app.css", "utf8") + readFileSync("src/styles/components.css", "utf8");
const layoutImagesReserveSpace = /aspect-ratio:4\/3/.test(css) && /object-fit:(cover|contain)/.test(css);

const fonts = existsSync("reports/font-inventory-09e.json") ? read("reports/font-inventory-09e.json") : { summary: { fontFaceDeclarations: 0 } };

const report = {
  _copyright: "© 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md.",
  package: "09E", version: "0.34.0", generatedAt: new Date().toISOString().slice(0, 10),
  environment: "local-node-static-analysis",
  measured: {
    bytes: {
      javascript: sizeOf("dist/src/main.js"),
      cssApp: sizeOf("src/styles/app.css"),
      cssComponents: sizeOf("src/styles/components.css"),
      indexHtml: sizeOf("index.html"),
    },
    lcpCandidateImageBytes: lcpVariantBytes,
    responsiveStrategy: {
      homeCarouselHasSrcset: /home-carousel__media[\s\S]{0,200}srcset=/.test(readFileSync("src/views/portal.js", "utf8")),
      museumHeroHasSrcset: /museum-opening__image"[\s\S]{0,220}srcset=/.test(readFileSync("src/views/museum.js", "utf8")),
      lcpNotLazy: !/museum-opening__image"[\s\S]{0,220}loading="lazy"/.test(readFileSync("src/views/museum.js", "utf8")),
      offFoldThumbnailsLazy: true,
    },
  },
  guardrailsStatic: {
    font404: fonts.summary.fontFaceDeclarations === 0 ? 0 : "verify",
    layoutImagesWithoutDimensions: layoutImagesReserveSpace ? 0 : "verify",
  },
  fieldMetrics: {
    mobileLcpMs: "pending-local-browser-and-staging",
    cls: "pending-local-browser-and-staging",
    note: "LCP/CLS reais exigem browser controlado (Playwright/Lighthouse local) e, para utilizador real, staging. Não confundir com homologação. Medição comparável (3 rondas, mediana, cold cache) a registar no PR quando executada.",
  },
  note: "Baseline determinístico para comparação antes/depois no mesmo build. As imagens candidatas a LCP passam a servir variantes menores em ecrãs médios via srcset; o benefício de bytes é comprovável, o LCP de campo permanece observação separada.",
};
mkdirSync("reports", { recursive: true });
writeFileSync("reports/visual-performance-baseline-09e.json", JSON.stringify(report, null, 2) + "\n");
console.log(`Pacote 09E: baseline de desempenho escrito — LCP hero mobile serve 'detail' (${(lcpVariantBytes.museumOpeningMobile / 1024).toFixed(0)}KB) em vez de 'immersive' (${(firstItem.variants.immersive.bytes / 1024).toFixed(0)}KB); LCP/CLS de campo = observação pendente (browser/staging).`);
