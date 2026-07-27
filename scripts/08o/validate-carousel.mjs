/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 08O — valida os fixes do carrossel da Home:
 * asset do Inquérito 2026, caixa canónica partilhada e auto-play definitivo.
 */
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const fail = (m) => { throw new Error(`08O carrossel: ${m}`); };

const EXPECTED_VERSION = "0.28.0";
const EXPECTED_ASSET = "public/media/home/inquerito-2026-carousel.png";
const EXPECTED_SHA = "ea58885f4c16dbcb524544ce80de46e93bb21bb594b68be6a991ec71f6ccebba";

const pkg = read("package.json");
if (pkg.version !== EXPECTED_VERSION) fail("versão do pacote incorreta.");

// 1. Contrato pós-merge do carrossel
const model = read("public/data/carousel-post-merge-model.json");
if (model.version !== EXPECTED_VERSION) fail("versão do contrato incorreta.");
if (model.canonicalSizeSource !== "museu-de-memorias") fail("fonte canónica de tamanho incorreta.");
if (model.maxBoundingBoxDifferenceCssPixels !== 1) fail("tolerância de caixa incorreta.");
if (model.imageFit !== "cover") fail("imageFit deve ser cover.");
for (const flag of ["required", "loop", "pauseOnHover", "pauseOnFocusWithin", "pauseWhenDocumentHidden", "respectReducedMotion", "singleTimer", "resetAfterManualNavigation"]) {
  if (model.autoplay?.[flag] !== true) fail(`autoplay.${flag} deve ser true no contrato.`);
}
if (model.requiresRealBrowserE2E !== true) fail("contrato deve exigir E2E de browser real.");
for (const bp of [375, 768, 1280]) if (!model.breakpointsToTest?.includes(bp)) fail(`breakpoint ${bp} em falta no contrato.`);

// 2. Slide do Inquérito usa o asset exato; asset existe e o SHA-256 confere
const carousel = read("public/data/home-carousel.json");
if (carousel.version !== EXPECTED_VERSION) fail("versão do home-carousel incorreta.");
if (carousel.slides.length !== 3) fail("o carrossel deve ter exatamente 3 slides.");
const [museum, proteus, survey] = carousel.slides;
if (museum.id !== "museum" || museum.kind !== "museum-memory") fail("primeiro slide deve ser o Museu de Memórias (fonte canónica).");
if (proteus.kind !== "empty-state" || proteus.image) fail("slide Proteus deve ser empty-state sem imagem inventada.");
if (survey.id !== "survey-2026") fail("terceiro slide deve ser o Inquérito 2026.");
if (survey.image !== EXPECTED_ASSET) fail(`slide do Inquérito deve referenciar ${EXPECTED_ASSET}.`);
if (!survey.primaryAction?.href?.includes("surveymonkey.com")) fail("ação do Inquérito deve apontar para o SurveyMonkey.");
if (survey.primaryAction?.external !== true) fail("ação do Inquérito deve ser externa.");

if (!existsSync(EXPECTED_ASSET)) fail(`asset ausente: ${EXPECTED_ASSET}`);
const sha = createHash("sha256").update(readFileSync(EXPECTED_ASSET)).digest("hex");
if (sha !== EXPECTED_SHA) fail(`SHA-256 do asset diverge (${sha}).`);

// Metadados do asset declarados
const assets = carousel.assets || {};
if (assets.surveyAssetSha256 !== EXPECTED_SHA) fail("surveyAssetSha256 divergente.");
if (assets.surveyAssetWidth !== 1030 || assets.surveyAssetHeight !== 1426) fail("dimensões do asset incorretas.");
if (assets.surveyAssetFormat !== "PNG") fail("formato do asset deve ser PNG.");

// 3. Referência antiga (webp) não pode continuar referenciada
const css = readFileSync("src/styles/app.css", "utf8");
if (existsSync("public/media/home/inquerito-2026.webp")) fail("asset antigo inquerito-2026.webp ainda presente.");
if (css.includes("inquerito-2026.webp") || JSON.stringify(carousel).includes("inquerito-2026.webp")) fail("referência antiga inquerito-2026.webp ainda existe.");

// 4. Caixa canónica partilhada (modelo 08Q): os slides são empilhados na mesma célula
//    (grid-area:1/1) e a viewport tem a caixa canónica; o crop está só na camada de media.
if (!/\.home-carousel__viewport\{[^}]*min-height:72vh/.test(css)) fail("viewport sem caixa canónica (min-height:72vh).");
if (!/\.home-carousel__slide\{[^}]*grid-area:1\/1/.test(css)) fail("slides não empilhados na caixa canónica (grid-area:1/1).");
if (/\.home-carousel__slide\{[^}]*overflow:hidden/.test(css)) fail("o slide não deve usar overflow:hidden (cortaria o conteúdo).");
if (!/\.home-carousel__media\{[^}]*overflow:hidden/.test(css)) fail("o crop deve estar na camada de media.");
if (!/object-fit:cover/.test(css)) fail("imagem do Inquérito deve usar object-fit:cover.");

// 5. Auto-play definitivo no main.js
const main = readFileSync("src/main.js", "utf8");
if (!/function scheduleHomeCarousel\(\)/.test(main)) fail("scheduleHomeCarousel ausente.");
if (!/function clearHomeCarouselTimer\(\)/.test(main)) fail("clearHomeCarouselTimer ausente.");
// timer único: schedule limpa antes de agendar
if (!/function scheduleHomeCarousel\(\)\s*\{\s*clearHomeCarouselTimer\(\);/.test(main)) fail("scheduleHomeCarousel deve limpar o timer antes de agendar (timer único).");
if (!/document\.hidden/.test(main)) fail("auto-play deve pausar quando document.hidden.");
if (!/visibilitychange/.test(main)) fail("falta o listener de visibilitychange.");
if (!/prefers-reduced-motion/.test(main)) fail("auto-play deve respeitar reduced motion.");
if (!/config\.intervalMs\s*\|\|\s*7000/.test(main)) fail("intervalo deve usar o config com fallback 7000 ms.");
if (!/mouseenter/.test(main) || !/focusin/.test(main)) fail("faltam listeners de pausa em hover/focus.");

console.log("Pacote 08O carrossel validado: asset exato, caixa canónica fixa e auto-play definitivo (timer único, document.hidden, reduced motion, fallback 7000 ms).");
