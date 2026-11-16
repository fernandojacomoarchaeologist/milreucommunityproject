// © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu.
// Consultar RIGHTS.md. A atribuição não transfere direitos de terceiros.
//
// Item 18 — Template de apresentação do Projecto (PowerPoint, 16:9).
// Cores lidas dos tokens v0.2 (packages/design-tokens/v0.2/primitives.json); tipografia
// Fraunces (títulos) · Spectral (texto) · Archivo (rótulos). Faixa de Logos segundo
// docs/governance/FAIXA_DE_LOGOS_CANONICA.md. Imagens sugeridas geradas por prepare_images.py.
//
// Uso (a partir da raiz do repositório, depois de prepare_images.py):
//   NODE_PATH=<node_modules com pptxgenjs, react, react-dom, react-icons, sharp> \
//   PPTX_SKILL=<pasta da skill pptx com scripts/apply_theme.js> node build_template.js

const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const { PiChatsCircle, PiHandshake, PiUsersThree } = require("react-icons/pi");

const ROOT = path.resolve(__dirname, "../../../../..");
const ITEM = path.join(ROOT, "docs/dissemination/template-apresentacao");
const IMG = path.join(ITEM, "imagens-sugeridas");
const BUILD = path.join(ITEM, "_private/build");
const OUT = process.env.TEMPLATE_OUT || path.join(ITEM, "TEMPLATE_Apresentacao_Projecto_Milreu_v0.1.pptx");

// ---------- tokens v0.2 ----------
const prim = JSON.parse(fs.readFileSync(path.join(ROOT, "packages/design-tokens/v0.2/primitives.json")));
const tok = (fam, step) => {
  const v = prim.color[fam][step];
  return (typeof v === "object" ? v.value : v).replace("#", "").toUpperCase();
};
const T = {
  paper0: tok("paper", "0"), paper50: tok("paper", "50"), paper100: tok("paper", "100"), paper200: tok("paper", "200"),
  ink950: tok("ink", "950"), ink700: tok("ink", "700"), ink600: tok("ink", "600"), ink500: tok("ink", "500"),
  ink300: tok("ink", "300"), ink200: tok("ink", "200"),
  red700: tok("red", "700"), red500: tok("red", "500"), red300: tok("red", "300"),
  patina500: tok("patina", "500"), sepia500: tok("sepia", "500"), sepia700: tok("sepia", "700"),
  stone500: tok("stone", "500"), stone700: tok("stone", "700"), dataBlue: tok("data", "blue"),
};

const THEME = {
  name: "Projecto Comunitario de Milreu v0.2",
  headFontFace: "Fraunces",
  bodyFontFace: "Spectral",
  colors: {
    dk1: T.ink950, lt1: T.paper50, dk2: T.ink700, lt2: T.paper100,
    accent1: T.red500, accent2: T.red700, accent3: T.patina500, accent4: T.sepia500,
    accent5: T.stone700, accent6: T.dataBlue, hlink: T.red700, folHlink: T.sepia700,
  },
};
const LABEL = "Archivo";

// ---------- dados de apoio ----------
const IMGS = JSON.parse(fs.readFileSync(path.join(BUILD, "imagens.json")));
const LOGOS = JSON.parse(fs.readFileSync(path.join(BUILD, "logos.json")));
const img = (f) => path.join(IMG, f);
const credit = (f) => IMGS[f].credito_obrigatorio;
const museum = JSON.parse(fs.readFileSync(path.join(ROOT, "public/data/museum-index.json"))).records
  .reduce((a, r) => ((a[r.id] = r), a), {});

// ---------- geometria ----------
const W = 13.333, H = 7.5, M = 0.6, CW = W - 2 * M;

// ---------- Faixa de Logos (FAIXA_DE_LOGOS_CANONICA.md §2–§3) ----------
// Alturas ópticas relativas ao trio = 1,00; intervalo único = 0,6 × altura do trio.
const OPTICAL = [0.92, 0.99, 0.92, 0.92, 1.0, 0.78];
const GAP = 0.6;
function bandRowWidth(h) {
  return LOGOS.reduce((s, l, i) => s + (l.w / l.h) * OPTICAL[i] * h, 0) + 5 * GAP * h;
}
function logoRow(x, yCenter, h) {
  const out = [];
  let cx = x;
  LOGOS.forEach((l, i) => {
    const lh = OPTICAL[i] * h, lw = (l.w / l.h) * lh;
    out.push({ image: { path: l.file, x: cx, y: yCenter - lh / 2, w: lw, h: lh, altText: l.name } });
    cx += lw + GAP * h;
  });
  return out;
}
// devolve objectos para um layout ou para addShape/addImage num slide
function logoBand({ x, y, w, trioH, mode, bilingual = true }) {
  const objs = [];
  objs.push({ line: { x, y, w, h: 0, line: { color: T.stone500, width: 0.75 } } });
  objs.push({ text: { text: bilingual ? "APOIO INSTITUCIONAL E PARCERIAS · INSTITUTIONAL SUPPORT AND PARTNERSHIPS" : "APOIO INSTITUCIONAL E PARCERIAS",
    options: { x, y: y + 0.08, w: w * 0.68, h: 0.22, margin: 0, fontFace: LABEL, fontSize: 8, bold: true, color: T.ink950, charSpacing: 1.5 } } });
  objs.push({ text: { text: "Apoiado pela CCDR Algarve, I.P.",
    options: { x: x + w * 0.62, y: y + 0.08, w: w * 0.38, h: 0.22, margin: 0, fontFace: LABEL, fontSize: 8, color: T.ink600, align: "right" } } });
  let h = trioH;
  if (mode === "A") h = w / (bandRowWidth(1));
  const rowY = y + 0.42 + (OPTICAL[1] * h) / 2;
  return objs.concat(logoRow(x, rowY, h));
}
function placeOnSlide(slide, objs) {
  objs.forEach((o) => {
    if (o.line) slide.addShape("line", { ...o.line, line: { ...o.line.line } });
    if (o.text) slide.addText(o.text.text, { ...o.text.options, isTextBox: true });
    if (o.image) slide.addImage({ ...o.image });
  });
}

// ---------- ícones ----------
async function iconPng(Comp, color) {
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(Comp, { color: "#" + color, size: 256 }));
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

// ---------- utilitários de texto ----------
const footer = (dark = false) => [
  { text: { text: "Projecto Comunitário de Milreu", options: { x: M, y: 7.02, w: 5, h: 0.25, margin: 0, fontFace: LABEL, fontSize: 9, color: dark ? T.ink300 : T.ink500 } } },
];
const SLIDE_NUM = { x: W - M - 0.6, y: 7.02, w: 0.6, h: 0.25, fontFace: LABEL, fontSize: 9, color: T.ink500, align: "right" };
const eyebrowPh = (y = 0.42) => ({ placeholder: { options: { name: "eyebrow", type: "body", x: M, y, w: CW, h: 0.3, margin: 0, fontFace: LABEL, fontSize: 11, bold: true, color: T.red700, charSpacing: 2.5, valign: "top" }, text: "[RÓTULO DE SECÇÃO]" } });
const titlePh = (w = CW) => ({ placeholder: { options: { name: "title", type: "title", align: "left", x: M, y: 0.75, w, h: 0.8, margin: 0, fontSize: 32, color: T.ink950, valign: "top" }, text: "[Título do slide]" } });

// Layouts partilhados pelo template e pelas derivações (MIL_*).
function defineLayouts(pres) {
  const projLogo = LOGOS[0];

  pres.defineSlideMaster({
    title: "MIL_CAPA",
    background: { color: T.paper50 },
    objects: [
      { image: { path: projLogo.file, x: M, y: 0.5, w: 1.0 * (projLogo.w / projLogo.h), h: 1.0, altText: "Logótipo do Projecto Comunitário de Milreu" } },
      { placeholder: { options: { name: "identificador", type: "body", x: M, y: 1.68, w: 5.8, h: 0.3, margin: 0, fontFace: LABEL, fontSize: 10, bold: true, color: T.ink600, charSpacing: 2 }, text: "MUSEUS SEM FRONTEIRAS · INICIATIVAS 2026" } },
      { placeholder: { options: { name: "title", type: "title", align: "left", x: M, y: 2.2, w: 5.9, h: 1.85, margin: 0, fontSize: 38, color: T.ink950, valign: "bottom" }, text: "[Título da apresentação]" } },
      { placeholder: { options: { name: "subtitulo", type: "body", x: M, y: 4.18, w: 5.9, h: 0.75, margin: 0, fontSize: 18, color: T.ink700, valign: "top" }, text: "[Subtítulo — uma frase]" } },
      { placeholder: { options: { name: "meta", type: "body", x: M, y: 5.0, w: 5.9, h: 0.4, margin: 0, fontFace: LABEL, fontSize: 12, bold: true, color: T.red700 }, text: "[Evento] · [Local] · [DD-MM-AAAA]" } },
      { placeholder: { options: { name: "imagem", type: "pic", x: 6.9, y: 0, w: W - 6.9, h: 5.45, color: T.ink500 }, text: "Inserir imagem (ver anexo «Banco de imagens sugeridas»)" } },
      { placeholder: { options: { name: "credito", type: "body", x: 6.9, y: 5.52, w: W - 6.9 - M, h: 0.38, margin: 0, fontFace: LABEL, fontSize: 8.5, color: T.ink500, valign: "top" }, text: "[Crédito obrigatório da imagem]" } },
      ...logoBand({ x: M, y: 6.0, w: CW, trioH: 0.42, mode: "B" }),
    ],
  });

  pres.defineSlideMaster({
    title: "MIL_DIVISOR",
    background: { color: T.ink950 },
    objects: [
      { text: { text: "Projecto Comunitário de Milreu", options: { x: M, y: 0.5, w: 6, h: 0.25, margin: 0, fontFace: LABEL, fontSize: 9, color: T.ink300 } } },
      { placeholder: { options: { name: "numero", type: "body", x: M, y: 1.5, w: 3, h: 1.2, margin: 0, fontFace: THEME.headFontFace, fontSize: 72, color: T.red300, valign: "bottom" }, text: "00" } },
      { placeholder: { options: { name: "title", type: "title", align: "left", x: M, y: 2.85, w: 7.2, h: 1.55, margin: 0, fontSize: 40, color: T.paper0, valign: "top" }, text: "[Título da secção]" } },
      { placeholder: { options: { name: "texto", type: "body", x: M, y: 4.55, w: 7.0, h: 1.3, margin: 0, fontSize: 16, color: T.ink200, valign: "top" }, text: "[Uma ou duas frases de entrada]" } },
      { placeholder: { options: { name: "imagem", type: "pic", x: 8.6, y: 0, w: W - 8.6, h: H, color: T.ink300 }, text: "Inserir imagem vertical" } },
      { placeholder: { options: { name: "credito", type: "body", x: M, y: 6.7, w: 7.4, h: 0.5, margin: 0, fontFace: LABEL, fontSize: 8.5, color: T.ink300, valign: "bottom" }, text: "[Crédito obrigatório da imagem]" } },
    ],
  });

  pres.defineSlideMaster({
    title: "MIL_TEXTO_IMAGEM",
    background: { color: T.paper50 },
    slideNumber: SLIDE_NUM,
    objects: [
      eyebrowPh(), titlePh(),
      { placeholder: { options: { name: "texto", type: "body", x: M, y: 1.85, w: 6.0, h: 4.5, margin: 0, fontSize: 16, color: T.ink950, valign: "top", paraSpaceAfter: 8 }, text: "[Texto — 3 a 5 frases curtas ou tópicos]" } },
      { placeholder: { options: { name: "imagem", type: "pic", x: 7.13, y: 1.85, w: 5.6, h: 4.6, color: T.ink500 }, text: "Inserir imagem" } },
      { placeholder: { options: { name: "credito", type: "body", x: 7.13, y: 6.5, w: 5.6, h: 0.4, margin: 0, fontFace: LABEL, fontSize: 8.5, color: T.ink500, valign: "top" }, text: "[Crédito obrigatório da imagem]" } },
      ...footer(),
    ],
  });

  pres.defineSlideMaster({
    title: "MIL_TITULO",
    background: { color: T.paper50 },
    slideNumber: SLIDE_NUM,
    objects: [eyebrowPh(), titlePh(), ...footer()],
  });

  pres.defineSlideMaster({
    title: "MIL_IMAGEM_INTEIRA",
    background: { color: T.paper50 },
    slideNumber: { ...SLIDE_NUM, y: 6.98 },
    objects: [
      { placeholder: { options: { name: "imagem", type: "pic", x: 0, y: 0, w: W, h: 6.2, color: T.ink500 }, text: "Inserir fotografia horizontal" } },
      { placeholder: { options: { name: "legenda", type: "body", x: M, y: 6.33, w: 10.5, h: 0.42, margin: 0, fontSize: 15, color: T.ink950, valign: "top" }, text: "[Legenda — o quê, onde, quando]" } },
      { placeholder: { options: { name: "credito", type: "body", x: M, y: 6.85, w: 10.5, h: 0.4, margin: 0, fontFace: LABEL, fontSize: 8.5, color: T.ink500, valign: "top" }, text: "[Crédito obrigatório da imagem]" } },
    ],
  });

  pres.defineSlideMaster({
    title: "MIL_DESTAQUE",
    background: { color: T.paper50 },
    slideNumber: SLIDE_NUM,
    objects: [
      { placeholder: { options: { name: "imagem", type: "pic", x: 0, y: 0, w: 6.2, h: H, color: T.ink500 }, text: "Inserir imagem do registo" } },
      { placeholder: { options: { name: "eyebrow", type: "body", x: 6.8, y: 0.42, w: 5.93, h: 0.3, margin: 0, fontFace: LABEL, fontSize: 11, bold: true, color: T.red700, charSpacing: 2.5 }, text: "MEMÓRIA EM DESTAQUE · [ID]" } },
      { placeholder: { options: { name: "title", type: "title", align: "left", x: 6.8, y: 0.75, w: 5.93, h: 1.2, margin: 0, fontSize: 28, color: T.ink950, valign: "top" }, text: "[Título do registo]" } },
      { placeholder: { options: { name: "meta", type: "body", x: 6.8, y: 2.0, w: 5.93, h: 0.35, margin: 0, fontFace: LABEL, fontSize: 11, color: T.ink600 }, text: "[Data] · [Local]" } },
      { text: { text: "NARRATIVA COMUNITÁRIA", options: { x: 6.8, y: 2.6, w: 5.93, h: 0.25, margin: 0, fontFace: LABEL, fontSize: 9, bold: true, color: T.ink600, charSpacing: 2 } } },
      { placeholder: { options: { name: "narrativa", type: "body", x: 6.8, y: 2.9, w: 5.93, h: 1.6, margin: 0, fontSize: 15, color: T.ink950, valign: "top" }, text: "[Voz da comunidade — testemunho ou memória partilhada, com consentimento registado]" } },
      { text: { text: "CONTEXTO INSTITUCIONAL", options: { x: 6.8, y: 4.65, w: 5.93, h: 0.25, margin: 0, fontFace: LABEL, fontSize: 9, bold: true, color: T.ink600, charSpacing: 2 } } },
      { placeholder: { options: { name: "contexto", type: "body", x: 6.8, y: 4.95, w: 5.93, h: 1.3, margin: 0, fontSize: 14, color: T.ink700, valign: "top" }, text: "[Contexto arqueológico/histórico — com fonte e grau de certeza]" } },
      { placeholder: { options: { name: "credito", type: "body", x: 6.8, y: 6.35, w: 5.0, h: 0.6, margin: 0, fontFace: LABEL, fontSize: 8.5, color: T.ink500, valign: "top" }, text: "[Crédito obrigatório da imagem]" } },
    ],
  });

  pres.defineSlideMaster({
    title: "MIL_CITACAO",
    background: { color: T.paper100 },
    slideNumber: SLIDE_NUM,
    objects: [
      { text: { text: "“", options: { x: M, y: 0.3, w: 1.6, h: 1.8, margin: 0, fontFace: THEME.headFontFace, fontSize: 150, color: T.red500 } } },
      { placeholder: { options: { name: "citacao", type: "body", x: 1.9, y: 1.6, w: 9.8, h: 3.3, margin: 0, fontFace: THEME.headFontFace, italic: true, fontSize: 30, color: T.ink950, valign: "middle" }, text: "[Citação literal de um membro da comunidade]" } },
      { placeholder: { options: { name: "autoria", type: "body", x: 1.9, y: 5.15, w: 9.8, h: 0.4, margin: 0, fontFace: LABEL, fontSize: 13, bold: true, color: T.ink700 }, text: "[Nome ou «Anónimo»] · [contexto: reunião / inquérito / data]" } },
      { placeholder: { options: { name: "nota", type: "body", x: 1.9, y: 5.6, w: 9.8, h: 0.4, margin: 0, fontFace: LABEL, fontSize: 9.5, color: T.ink500 }, text: "[Base de utilização: autorização registada em …]" } },
      ...footer(),
    ],
  });

  pres.defineSlideMaster({
    title: "MIL_FECHO",
    background: { color: T.paper50 },
    objects: [
      { image: { path: projLogo.file, x: M, y: 0.55, w: 0.85 * (projLogo.w / projLogo.h), h: 0.85, altText: "Logótipo do Projecto Comunitário de Milreu" } },
      { placeholder: { options: { name: "title", type: "title", align: "left", x: M, y: 1.75, w: 8.0, h: 1.2, margin: 0, fontSize: 54, color: T.ink950, valign: "top" }, text: "Obrigado" } },
      { placeholder: { options: { name: "texto", type: "body", x: M, y: 3.0, w: 7.6, h: 1.9, margin: 0, fontSize: 16, color: T.ink700, valign: "top", paraSpaceAfter: 6 }, text: "[Contactos e próximos encontros]" } },
      { rect: { x: 10.33, y: 1.75, w: 2.4, h: 2.4, fill: { color: T.paper100 }, line: { color: T.ink300, width: 1, dashType: "dash" } } },
      { text: { text: "QR\n(só com URL real)", options: { x: 10.33, y: 2.6, w: 2.4, h: 0.7, margin: 0, fontFace: LABEL, fontSize: 10, color: T.ink500, align: "center" } } },
      { placeholder: { options: { name: "qr", type: "pic", x: 10.33, y: 1.75, w: 2.4, h: 2.4, color: T.ink500 }, text: "QR — gerar só com URL real" } },
      { placeholder: { options: { name: "qr_legenda", type: "body", x: 9.33, y: 4.25, w: 3.4, h: 0.35, margin: 0, fontFace: LABEL, fontSize: 10, color: T.ink600, align: "right" }, text: "[URL legível do QR]" } },
      { text: { text: "MUSEUS SEM FRONTEIRAS · INICIATIVAS 2026", options: { x: M, y: 5.0, w: 6, h: 0.3, margin: 0, fontFace: LABEL, fontSize: 10, bold: true, color: T.ink600, charSpacing: 2 } } },
      ...logoBand({ x: M, y: 5.55, w: CW, trioH: 0, mode: "A" }),
    ],
  });

}

async function main() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.title = "Template de apresentação — Projecto Comunitário de Milreu";
  pres.author = "Fernando Rodrigues de Jácomo";
  pres.company = "Projecto Comunitário de Milreu";
  pres.subject = "Item 18 — template v0.1 (rascunho para revisão humana)";
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  const C = pres.SchemeColor;

  defineLayouts(pres);

  // ================= SLIDES =================
  const notesBase = "Template v0.1 — rascunho para revisão humana. Substituir todos os campos entre [ ]. Não inventar nomes, datas, números, citações ou créditos: na falta, deixar o campo marcado e confirmar com o responsável. Cada imagem leva o crédito obrigatório (ver imagens-sugeridas/IMAGENS_SUGERIDAS.csv).";

  // 1 — Capa
  pres.addSection({ title: "Abertura" });
  let s = pres.addSlide({ masterName: "MIL_CAPA", sectionTitle: "Abertura" });
  s.addText("[Título da apresentação]", { placeholder: "title" });
  s.addText("[Subtítulo — uma frase]", { placeholder: "subtitulo" });
  s.addText("[Evento] · [Local] · [DD-MM-AAAA]", { placeholder: "meta" });
  s.addImage({ placeholder: "imagem", path: img("capa_MM202613.jpg"), w: W - 6.9, h: 5.45, altText: museum.MM202613.title["pt-PT"] });
  s.addText("MM202613 · " + museum.MM202613.title["pt-PT"] + ". " + credit("capa_MM202613.jpg"), { placeholder: "credito" });
  s.addNotes(notesBase + "\n\nCapa: a Faixa de Logos (modo B compacto) e a menção «Apoiado pela CCDR Algarve, I.P.» estão no layout e não se editam no slide. O identificador «MUSEUS SEM FRONTEIRAS · INICIATIVAS 2026» só se mantém em apresentações do ciclo 2026; noutros contextos, apagar. O logótipo diz «PROJETO» (asset oficial — não corrigir).");

  // 2 — Sumário
  s = pres.addSlide({ masterName: "MIL_TITULO", sectionTitle: "Abertura" });
  s.addText("SUMÁRIO", { placeholder: "eyebrow" });
  s.addText("O que vamos ver", { placeholder: "title" });
  const secs = [["01", "O Projecto"], ["02", "Iniciativas 2026"], ["03", "Museu de Memórias"], ["04", "Parcerias e próximos passos"]];
  secs.forEach(([n, t], i) => {
    const x = M + (i % 2) * 6.2, y = 2.0 + Math.floor(i / 2) * 2.2;
    s.addShape("rect", { x, y, w: 5.9, h: 1.9, fill: { color: T.paper100 }, line: { color: T.paper100 }, objectName: "cartao-" + n });
    s.addText(n, { x: x + 0.35, y: y + 0.3, w: 1.3, h: 1.0, margin: 0, fontFace: THEME.headFontFace, fontSize: 48, color: C.accent1, isTextBox: true, objectName: "num-" + n });
    s.addText(t, { x: x + 1.75, y: y + 0.2, w: 3.9, h: 0.85, margin: 0, fontFace: THEME.headFontFace, fontSize: 22, color: C.text1, valign: "bottom", isTextBox: true });
    s.addText("[Uma linha sobre esta parte]", { x: x + 1.75, y: y + 1.15, w: 3.9, h: 0.6, margin: 0, fontSize: 14, color: C.text2, valign: "top", isTextBox: true });
  });
  s.addNotes(notesBase + "\n\nAjustar o número e o nome das secções ao alinhamento real. Manter no máximo 4–5 partes.");

  // 3 — Divisor 01
  pres.addSection({ title: "01 O Projecto" });
  s = pres.addSlide({ masterName: "MIL_DIVISOR", sectionTitle: "01 O Projecto" });
  s.addText("01", { placeholder: "numero" });
  s.addText("O Projecto", { placeholder: "title" });
  s.addText("[Uma ou duas frases de entrada]", { placeholder: "texto" });
  s.addImage({ placeholder: "imagem", path: img("divisor_MM202610.jpg"), w: W - 8.6, h: H, altText: museum.MM202610.title["pt-PT"] });
  s.addText("MM202610 · " + museum.MM202610.title["pt-PT"] + ". " + credit("divisor_MM202610.jpg"), { placeholder: "credito" });
  s.addNotes(notesBase);

  // 4 — O Projecto (texto + imagem)
  s = pres.addSlide({ masterName: "MIL_TEXTO_IMAGEM", sectionTitle: "01 O Projecto" });
  s.addText("O PROJECTO", { placeholder: "eyebrow" });
  s.addText("Arqueologia pública e comunitária em Milreu", { placeholder: "title" });
  s.addText([
    { text: "Programa plurianual de Arqueologia Pública e Comunitária associado às Ruínas Romanas de Milreu, em Estoi, Faro.", options: { breakLine: true } },
    { text: "[Objectivo principal — uma frase]", options: { breakLine: true } },
    { text: "[Como trabalhamos com a comunidade — uma frase]", options: { breakLine: true } },
    { text: "[Onde estamos hoje — uma frase]" },
  ], { placeholder: "texto" });
  s.addImage({ placeholder: "imagem", path: img("texto_MM202606.jpg"), w: 5.6, h: 4.6, altText: museum.MM202606.title["pt-PT"] });
  s.addText("MM202606 · " + museum.MM202606.title["pt-PT"] + " (" + museum.MM202606.dateDisplay["pt-PT"] + "). " + credit("texto_MM202606.jpg"), { placeholder: "credito" });
  s.addNotes(notesBase + "\n\nA 1.ª frase é a definição canónica do projecto (CLAUDE.md §1). As restantes ficam por preencher.");

  // 5 — Pilares
  s = pres.addSlide({ masterName: "MIL_TITULO", sectionTitle: "01 O Projecto" });
  s.addText("PILARES", { placeholder: "eyebrow" });
  s.addText("Três pilares orientam o trabalho", { placeholder: "title" });
  const pilares = [[PiChatsCircle, "Comunicação"], [PiHandshake, "Mutualidade"], [PiUsersThree, "Pertinência Social e Política"]];
  for (let i = 0; i < 3; i++) {
    const [Ic, name] = pilares[i];
    const x = M + i * 4.13, y = 2.0, cw = 3.87;
    s.addShape("rect", { x, y, w: cw, h: 4.4, fill: { color: T.paper100 }, line: { color: T.paper100 }, objectName: "pilar-" + (i + 1) });
    s.addShape("ellipse", { x: x + 0.35, y: y + 0.4, w: 0.85, h: 0.85, fill: { color: C.accent1 }, line: { color: T.red500 } });
    s.addImage({ data: await iconPng(Ic, T.paper0), x: x + 0.52, y: y + 0.57, w: 0.51, h: 0.51, altText: "Ícone " + name });
    s.addText(name, { x: x + 0.35, y: y + 1.5, w: cw - 0.7, h: 0.9, margin: 0, fontFace: THEME.headFontFace, fontSize: 22, color: C.text1, valign: "top", isTextBox: true });
    s.addText("[O que este pilar significa na prática — 2 a 3 frases]", { x: x + 0.35, y: y + 2.45, w: cw - 0.7, h: 1.7, margin: 0, fontSize: 14, color: C.text2, valign: "top", isTextBox: true });
  }
  s.addNotes(notesBase + "\n\nOs nomes dos pilares são canónicos (regra 07D.1). As descrições ficam por escrever.");

  // 6 — Divisor 02
  pres.addSection({ title: "02 Iniciativas 2026" });
  s = pres.addSlide({ masterName: "MIL_DIVISOR", sectionTitle: "02 Iniciativas 2026" });
  s.addText("02", { placeholder: "numero" });
  s.addText("Iniciativas 2026", { placeholder: "title" });
  s.addText("Museus sem Fronteiras · Iniciativas 2026: museu itinerante «Entre Ruínas e Memórias» e Circuito Educativo.", { placeholder: "texto" });
  s.addImage({ placeholder: "imagem", path: img("divisor_MM202624.jpg"), w: W - 8.6, h: H, altText: museum.MM202624.title["pt-PT"] });
  s.addText("MM202624 · " + museum.MM202624.title["pt-PT"] + ". " + credit("divisor_MM202624.jpg"), { placeholder: "credito" });
  s.addNotes(notesBase + "\n\nArquitectura MSF 2026: docs/governance/IDENTITY_2026_MUSEUS_SEM_FRONTEIRAS.md. «Documentando Milreu» e a investigação são frentes do projecto, não iniciativas MSF 2026.");

  // 7 — Duas iniciativas
  s = pres.addSlide({ masterName: "MIL_TITULO", sectionTitle: "02 Iniciativas 2026" });
  s.addText("MUSEUS SEM FRONTEIRAS · INICIATIVAS 2026", { placeholder: "eyebrow" });
  s.addText("Duas iniciativas, uma comunidade", { placeholder: "title" });
  const ini = [
    ["iniciativa_expo_exposicao-01.jpg", "Entre Ruínas e Memórias", "Museu itinerante · exposição de 12 painéis bilingues", null],
    ["iniciativa_circuito_oficina.jpg", "Circuito Educativo", "[Público e formato das oficinas]", "Representação conceptual · não documental"],
  ];
  ini.forEach(([f, name, sub, aviso], i) => {
    const x = M + i * 6.2, cw = 5.93;
    s.addImage({ path: img(f), x, y: 1.85, w: cw, h: cw / (5.7 / 2.6), altText: name, objectName: "imagem-iniciativa-" + (i + 1) });
    const ih = cw / (5.7 / 2.6);
    let y = 1.85 + ih + 0.08;
    s.addText(aviso ? aviso + " · " + credit(f) : credit(f), { x, y, w: cw, h: 0.3, margin: 0, fontFace: LABEL, fontSize: 8.5, color: aviso ? T.red700 : T.ink500, bold: !!aviso, valign: "top", isTextBox: true });
    y += 0.42;
    s.addText(name, { x, y, w: cw, h: 0.5, margin: 0, fontFace: THEME.headFontFace, fontSize: 24, color: C.text1, isTextBox: true });
    s.addText(sub, { x, y: y + 0.52, w: cw, h: 0.32, margin: 0, fontFace: LABEL, fontSize: 11, bold: true, color: T.red700, isTextBox: true });
    s.addText("[Descrição — 2 frases: o que é, para quem, onde]", { x, y: y + 0.9, w: cw, h: 0.75, margin: 0, fontSize: 14, color: C.text2, valign: "top", isTextBox: true });
  });
  s.addNotes(notesBase + "\n\nA imagem do Circuito Educativo é gerada por IA: o aviso «Representação conceptual · não documental» é obrigatório e não pode ser apagado. A fotografia da exposição é de 10-10-2026 (Museu do Traje, São Brás de Alportel).");

  // 8 — Cronologia
  s = pres.addSlide({ masterName: "MIL_TITULO", sectionTitle: "02 Iniciativas 2026" });
  s.addText("PERCURSO", { placeholder: "eyebrow" });
  s.addText("Actividades realizadas e próximas", { placeholder: "title" });
  const n = 5, x0 = M + 1.1, x1 = W - M - 1.1, ly = 3.35;
  s.addShape("line", { x: x0, y: ly, w: x1 - x0, h: 0, line: { color: T.ink300, width: 1.5 } });
  for (let i = 0; i < n; i++) {
    const cx = x0 + (i * (x1 - x0)) / (n - 1);
    s.addShape("ellipse", { x: cx - 0.13, y: ly - 0.13, w: 0.26, h: 0.26, fill: { color: i < n - 1 ? T.red500 : T.paper50 }, line: { color: T.red500, width: 2 } });
    s.addText("[DD-MM-AAAA]", { x: cx - 1.1, y: ly - 0.85, w: 2.2, h: 0.35, margin: 0, fontFace: LABEL, fontSize: 12, bold: true, color: T.red700, align: "center", isTextBox: true });
    s.addText("[Actividade]", { x: cx - 1.1, y: ly + 0.4, w: 2.2, h: 0.4, margin: 0, fontFace: THEME.headFontFace, fontSize: 16, color: C.text1, align: "center", isTextBox: true });
    s.addText("[Local]", { x: cx - 1.1, y: ly + 0.85, w: 2.2, h: 0.6, margin: 0, fontSize: 14, color: C.text2, align: "center", valign: "top", isTextBox: true });
  }
  s.addText("Círculo cheio = realizado · círculo vazio = próximo", { x: M, y: 6.3, w: 8, h: 0.3, margin: 0, fontFace: LABEL, fontSize: 10, color: T.ink500, isTextBox: true });
  s.addNotes(notesBase + "\n\nReferência factual (Item 16, handoff §11): rodas de conversa a 7-02-2026 (Ruínas de Milreu), 11-04-2026 (Junta de Freguesia de Estoi, apresentação do Museu de Memórias) e 18-04-2026; exposição «Entre Ruínas e Memórias», 1.ª apresentação a 10-10-2026 no 2.º Encontro dos Amigos dos Museus do Algarve (Museu do Traje, São Brás de Alportel); Junta de Estoi 31-10 a 6-11-2026; Inquérito Milreu 2026. Confirmar datas e locais antes de preencher.");

  // 9 — Fotografia inteira
  s = pres.addSlide({ masterName: "MIL_IMAGEM_INTEIRA", sectionTitle: "02 Iniciativas 2026" });
  s.addImage({ placeholder: "imagem", path: img("inteira_roda-02.jpg"), w: W, h: 6.2, altText: "Roda de conversas, Junta de Freguesia de Estoi, 11-04-2026" });
  s.addText("Roda de conversas «Milreu: memória e comunidade» · Junta de Freguesia de Estoi · 11-04-2026", { placeholder: "legenda" });
  s.addText(credit("inteira_roda-02.jpg"), { placeholder: "credito" });
  s.addNotes(notesBase + "\n\nFotografia com participantes: usar só em apresentações do projecto (consentimento confirmado pelo responsável para esta imagem). Ao trocar a imagem, confirmar o consentimento da nova.");

  // 10 — Números
  s = pres.addSlide({ masterName: "MIL_TITULO", sectionTitle: "02 Iniciativas 2026" });
  s.addText("EM NÚMEROS", { placeholder: "eyebrow" });
  s.addText("[Mensagem principal dos números]", { placeholder: "title" });
  for (let i = 0; i < 3; i++) {
    const x = M + i * 4.13, cw = 3.87;
    s.addText("[00]", { x, y: 2.0, w: cw, h: 1.5, margin: 0, fontFace: THEME.headFontFace, fontSize: 72, color: T.red700, valign: "bottom", isTextBox: true });
    s.addText("[Indicador — ex.: registos no Museu]", { x, y: 3.65, w: cw, h: 0.75, margin: 0, fontFace: LABEL, fontSize: 14, bold: true, color: C.text1, valign: "top", isTextBox: true });
    s.addText("[Período ou contexto]", { x, y: 4.4, w: cw, h: 0.5, margin: 0, fontSize: 14, color: C.text2, valign: "top", isTextBox: true });
  }
  s.addText("Fonte: [documento / data de extracção] · Estado: [preliminar · em revisão · validado]", { x: M, y: 6.3, w: CW, h: 0.3, margin: 0, fontFace: LABEL, fontSize: 10, color: T.ink500, isTextBox: true });
  s.addNotes(notesBase + "\n\nNão usar números de público/participação sem validação (em revalidação no Item 13). Indicar sempre fonte e estado.");

  // 11 — Divisor 03
  pres.addSection({ title: "03 Museu de Memórias" });
  s = pres.addSlide({ masterName: "MIL_DIVISOR", sectionTitle: "03 Museu de Memórias" });
  s.addText("03", { placeholder: "numero" });
  s.addText("Museu de Memórias", { placeholder: "title" });
  s.addText("[Uma ou duas frases de entrada]", { placeholder: "texto" });
  s.addImage({ placeholder: "imagem", path: img("divisor_MM202611.jpg"), w: W - 8.6, h: H, altText: museum.MM202611.title["pt-PT"] });
  s.addText("MM202611 · " + museum.MM202611.title["pt-PT"] + ". " + credit("divisor_MM202611.jpg"), { placeholder: "credito" });
  s.addNotes(notesBase);

  // 12 — Grelha do Museu
  s = pres.addSlide({ masterName: "MIL_TITULO", sectionTitle: "03 Museu de Memórias" });
  s.addText("MUSEU DE MEMÓRIAS", { placeholder: "eyebrow" });
  s.addText("[Mensagem — o que estas memórias mostram]", { placeholder: "title" });
  const grid = ["MM202602", "MM202615", "MM202621", "MM202605"];
  grid.forEach((id, i) => {
    const sz = 2.75, x = M + i * (sz + 0.377), y = 1.8, f = `grelha_${id}.jpg`, r = museum[id];
    s.addImage({ path: img(f), x, y, w: sz, h: sz, altText: r.title["pt-PT"], objectName: "memoria-" + id });
    s.addText(id + " · " + r.dateDisplay["pt-PT"], { x, y: y + sz + 0.12, w: sz, h: 0.45, valign: "top", margin: 0, fontFace: LABEL, fontSize: 10, bold: true, color: T.red700, isTextBox: true });
    s.addText(r.title["pt-PT"], { x, y: y + sz + 0.6, w: sz, h: 0.62, margin: 0, fontFace: THEME.headFontFace, fontSize: 13, color: C.text1, valign: "top", isTextBox: true });
    s.addText(r.credit["pt-PT"], { x, y: y + sz + 1.25, w: sz, h: 0.85, margin: 0, fontFace: LABEL, fontSize: 8, color: T.ink500, valign: "top", isTextBox: true });
  });
  s.addNotes(notesBase + "\n\nTítulos, datas e créditos lidos do índice do Museu (public/data/museum-index.json). Ao trocar uma memória, trocar os três campos a partir do índice. Nunca usar MM202617 (inelegível para lançamento público) nem registos com retoque por IA sem o aviso correspondente.");

  // 13 — Memória em destaque
  s = pres.addSlide({ masterName: "MIL_DESTAQUE", sectionTitle: "03 Museu de Memórias" });
  const d = museum.MM202601;
  s.addImage({ placeholder: "imagem", path: img("destaque_MM202601.jpg"), w: 6.2, h: H, altText: d.title["pt-PT"] });
  s.addText("MEMÓRIA EM DESTAQUE · MM202601", { placeholder: "eyebrow" });
  s.addText(d.title["pt-PT"], { placeholder: "title" });
  s.addText(d.dateDisplay["pt-PT"] + " · " + d.place["pt-PT"], { placeholder: "meta" });
  s.addText("[Voz da comunidade — testemunho ou memória partilhada, com consentimento registado]", { placeholder: "narrativa" });
  s.addText("[Contexto arqueológico/histórico — com fonte e grau de certeza]", { placeholder: "contexto" });
  s.addText(d.credit["pt-PT"], { placeholder: "credito" });
  s.addNotes(notesBase + "\n\nOrdem obrigatória: a narrativa comunitária antecede o contexto institucional. Grau de certeza só confirmed / probable / hypothesis (confirmado / provável / hipótese).");

  // 14 — Citação
  s = pres.addSlide({ masterName: "MIL_CITACAO", sectionTitle: "03 Museu de Memórias" });
  s.addText("[Citação literal de um membro da comunidade]", { placeholder: "citacao" });
  s.addText("[Nome ou «Anónimo»] · [contexto: reunião / inquérito / data]", { placeholder: "autoria" });
  s.addText("[Base de utilização: autorização registada em …]", { placeholder: "nota" });
  s.addNotes(notesBase + "\n\nSó citações literais com autorização registada (ex.: respostas 2/3 do Inquérito usadas no painel Q12). Não parafrasear testemunhos.");

  // 15 — Divisor 04
  pres.addSection({ title: "04 Parcerias e próximos passos" });
  s = pres.addSlide({ masterName: "MIL_DIVISOR", sectionTitle: "04 Parcerias e próximos passos" });
  s.addText("04", { placeholder: "numero" });
  s.addText("Parcerias e próximos passos", { placeholder: "title" });
  s.addText("[Uma ou duas frases de entrada]", { placeholder: "texto" });
  s.addImage({ placeholder: "imagem", path: img("divisor_exposicao-04.jpg"), w: W - 8.6, h: H, altText: "Painéis da exposição «Entre Ruínas e Memórias», 10-10-2026" });
  s.addText("«Entre Ruínas e Memórias» · Museu do Traje, São Brás de Alportel · 10-10-2026. " + credit("divisor_exposicao-04.jpg"), { placeholder: "credito" });
  s.addNotes(notesBase);

  // 16 — Próximos passos
  s = pres.addSlide({ masterName: "MIL_TEXTO_IMAGEM", sectionTitle: "04 Parcerias e próximos passos" });
  s.addText("PRÓXIMOS PASSOS", { placeholder: "eyebrow" });
  s.addText("[O que vem a seguir]", { placeholder: "title" });
  s.addText([
    { text: "[Passo 1 — o quê e quando]", options: { bullet: { type: "number" }, breakLine: true } },
    { text: "[Passo 2 — o quê e quando]", options: { bullet: { type: "number" }, breakLine: true } },
    { text: "[Passo 3 — como participar]", options: { bullet: { type: "number" } } },
  ], { placeholder: "texto" });
  s.addImage({ placeholder: "imagem", path: img("texto_acervo-em-mesa.jpg"), w: 5.6, h: 4.6, altText: "Acervo em mesa, 10-10-2026" });
  s.addText("Acervo em mesa · Museu do Traje, São Brás de Alportel · 10-10-2026. " + credit("texto_acervo-em-mesa.jpg"), { placeholder: "credito" });
  s.addNotes(notesBase);

  // 17 — Parcerias (Faixa de Logos modo A + ficha técnica)
  s = pres.addSlide({ masterName: "MIL_TITULO", sectionTitle: "04 Parcerias e próximos passos" });
  s.addText("APOIO INSTITUCIONAL E PARCERIAS", { placeholder: "eyebrow" });
  s.addText("Quem torna o projecto possível", { placeholder: "title" });
  const ficha = [
    ["INVESTIGAÇÃO, DESIGN E PRODUÇÃO", "Fernando Rodrigues de Jácomo"],
    ["COORDENAÇÃO INSTITUCIONAL", "Meira Pinto\nAssociação dos Amigos do Museu do Lyceu de Faro"],
    ["CURADORIA", "Grupo de voluntários do Projecto Comunitário de Milreu"],
  ];
  ficha.forEach(([k, v], i) => {
    const x = M + i * 4.13, cw = 3.87;
    s.addText(k, { x, y: 1.95, w: cw, h: 0.3, margin: 0, fontFace: LABEL, fontSize: 10, bold: true, color: T.ink600, charSpacing: 1.5, isTextBox: true });
    s.addText(v, { x, y: 2.3, w: cw, h: 0.95, margin: 0, fontFace: THEME.headFontFace, fontSize: 17, color: C.text1, valign: "top", isTextBox: true });
  });
  s.addText("[Parágrafo opcional — papel de cada parceiro nesta apresentação]", { x: M, y: 3.5, w: CW, h: 0.6, margin: 0, fontSize: 14, color: C.text2, valign: "top", isTextBox: true });
  placeOnSlide(s, logoBand({ x: M, y: 4.55, w: CW, trioH: 0, mode: "A" }));
  s.addNotes(notesBase + "\n\nFicha técnica = créditos canónicos das iniciativas 2026 (IDENTITY_2026_MUSEUS_SEM_FRONTEIRAS.md §7): ordem fixa e pesos iguais. Faixa de Logos modo A (distribuída) segundo FAIXA_DE_LOGOS_CANONICA.md: ordem fixa, intervalo único = 0,6 × altura do trio, trio indivisível, sem recolorir. Não acrescentar nem retirar entidades sem decisão do responsável. A menção «Apoiado pela CCDR Algarve, I.P.» é obrigatória (art. 16.º).");

  // 18 — Fecho
  s = pres.addSlide({ masterName: "MIL_FECHO", sectionTitle: "04 Parcerias e próximos passos" });
  s.addText("Obrigado", { placeholder: "title" });
  s.addText([
    { text: "projectomilreu.pt", options: { bold: true, breakLine: true } },
    { text: "[E-mail de contacto]", options: { breakLine: true } },
    { text: "[Próximo encontro — data e local]" },
  ], { placeholder: "texto" });
  s.addText("[URL legível do QR]", { placeholder: "qr_legenda" });
  s.addNotes(notesBase + "\n\nQR: gerar só a partir de um URL real e público (regra qr-requires-public-domain) e testar a leitura no ecrã antes de apresentar. Confirmar o e-mail de contacto com o responsável.");

  // 19 — Anexo: banco de imagens
  pres.addSection({ title: "Anexo" });
  s = pres.addSlide({ masterName: "MIL_TITULO", sectionTitle: "Anexo" });
  s.addText("ANEXO · APAGAR ANTES DE APRESENTAR", { placeholder: "eyebrow" });
  s.addText("Banco de imagens sugeridas", { placeholder: "title" });
  const files = Object.keys(IMGS);
  const cols = 8, box = 1.3, gx = (CW - cols * box) / (cols - 1);
  files.forEach((f, i) => {
    const x = M + (i % cols) * (box + gx), y = 1.85 + Math.floor(i / cols) * 2.15;
    const [pw, ph] = IMGS[f].dimensoes.split("x").map(Number);
    const r = pw / ph, w = r >= 1 ? box : box * r, h = r >= 1 ? box / r : box;
    s.addImage({ path: img(f), x: x + (box - w) / 2, y: y + (box - h), w, h, altText: f });
    s.addText(IMGS[f].fonte_id.replace(".jpg", ""), { x, y: y + box + 0.06, w: box, h: 0.22, margin: 0, fontFace: LABEL, fontSize: 8, bold: true, color: T.red700, isTextBox: true });
    s.addText(IMGS[f].uso_no_template, { x, y: y + box + 0.28, w: box, h: 0.4, margin: 0, fontFace: LABEL, fontSize: 7, color: T.ink600, valign: "top", isTextBox: true });
  });
  s.addText("Ficheiros e créditos: docs/dissemination/template-apresentacao/imagens-sugeridas/ (IMAGENS_SUGERIDAS.csv). Recortes de enquadramento sem alteração tonal nem IA.", { x: M, y: 6.3, w: CW, h: 0.4, margin: 0, fontFace: LABEL, fontSize: 10, color: T.ink500, isTextBox: true });
  s.addNotes("Slide de trabalho: apagar antes de apresentar. Todas as imagens são derivados de enquadramento de imagens já publicadas pelo projecto; a fonte canónica e o crédito obrigatório de cada uma estão no CSV.");

  await pres.writeFile({ fileName: OUT });
  const { applyTheme } = require(path.join(process.env.PPTX_SKILL, "scripts/apply_theme.js"));
  await applyTheme(OUT, THEME);
  console.log("OK", OUT);
}

module.exports = { T, THEME, LABEL, W, H, M, CW, LOGOS, logoBand, placeOnSlide, iconPng, defineLayouts };

if (require.main === module) main().catch((e) => { console.error(e); process.exit(1); });
