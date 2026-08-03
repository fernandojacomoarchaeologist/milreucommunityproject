/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 08Q — valida o modelo do banner: caixa externa partilhada, conteúdo
 * adaptável e nunca cortado, crop apenas na imagem e auto-play preservado.
 */
import { readFileSync } from "node:fs";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const text = (p) => readFileSync(p, "utf8");
const fail = (m) => { throw new Error(`08Q banner: ${m}`); };

const EXPECTED = "0.37.0";
const model = read("public/data/home-banner-responsive-model.json");
if (model.version !== EXPECTED) fail("versão do contrato incorreta.");
if (model.canonicalOuterBoxSource !== "museu-de-memorias") fail("fonte da caixa externa incorreta.");
if (model.textClippingAllowed !== false || model.buttonClippingAllowed !== false) fail("o contrato deve proibir corte de texto/botões.");
if (model.mediaCroppingAllowed !== true) fail("o contrato deve permitir crop da imagem.");
if (model.maxSameViewportBoxDifferenceCssPx !== 1) fail("tolerância de caixa incorreta.");
if (model.autoplayMustRemainFunctional !== true) fail("o contrato deve exigir auto-play funcional.");
for (const el of ["title", "subtitle", "actions"]) if (!model.requiredVisibleElements.includes(el)) fail(`elemento obrigatório em falta: ${el}`);

const css = text("src/styles/app.css");
// Caixa externa partilhada: slides empilhados na mesma célula (caixa idêntica entre slides).
if (!/\.home-carousel__viewport\{[^}]*display:grid/.test(css)) fail("viewport não empilha os slides (display:grid).");
if (!/\.home-carousel__slide\{[^}]*grid-area:1\/1/.test(css)) fail("slides não partilham a mesma célula (grid-area:1/1).");
if (!/\.home-carousel__viewport\{[^}]*min-height:72vh/.test(css)) fail("viewport sem caixa canónica (min-height:72vh).");
// O slide não corta conteúdo; o crop é só na media.
if (/\.home-carousel__slide\{[^}]*overflow:hidden/.test(css)) fail("o slide não pode usar overflow:hidden (cortaria texto/botões).");
if (!/\.home-carousel__media\{[^}]*overflow:hidden/.test(css)) fail("o crop deve estar na camada de media.");
// Conteúdo adaptável: tipografia com clamp e ações que quebram/empilham.
if (!/clamp\(/.test(css)) fail("tipografia sem clamp() para adaptação responsiva.");
if (!/\.hero-actions\{[^}]*flex-wrap:wrap/.test(css)) fail("as ações do banner devem poder quebrar (flex-wrap).");
// A imagem vertical não pode definir a altura do card.
if (!/\.home-carousel__survey-image img\{[^}]*position:absolute/.test(css)) fail("a imagem do Inquérito deve ser absoluta para não forçar a altura.");
// Proibições do contrato.
if (/text-overflow:ellipsis/.test(css) && /home-carousel__(content|survey-copy)[^}]*text-overflow:ellipsis/.test(css)) fail("títulos/subtítulos não podem usar ellipsis.");

// Equalizador de caixa por JS (garante ≤1px entre slides sem cortar).
const main = text("src/main.js");
if (!/function equalizeHomeCarousel\(\)/.test(main)) fail("falta o equalizador de caixa do carrossel.");
if (!/scrollHeight/.test(main)) fail("o equalizador deve usar scrollHeight (altura real do conteúdo).");
if (!/equalizeHomeCarousel\(\);/.test(main)) fail("o equalizador não é chamado no ciclo de render.");
// Auto-play preservado.
if (!/function scheduleHomeCarousel\(\)/.test(main)) fail("auto-play (scheduleHomeCarousel) ausente.");

console.log("Pacote 08Q banner validado: caixa externa partilhada (empilhada + equalizada), conteúdo adaptável sem corte, crop só na imagem e auto-play preservado.");
