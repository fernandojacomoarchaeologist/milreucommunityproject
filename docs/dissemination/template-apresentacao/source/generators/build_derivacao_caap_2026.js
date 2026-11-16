// © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu.
// Consultar RIGHTS.md. A atribuição não transfere direitos de terceiros.
//
// Item 18 — DERIVAÇÃO do template: comunicação 7.13 do V Congresso da AAP (Braga, 20-11-2026),
// «Desafio da integração comunitária: o caso das Ruínas Romanas de Milreu (Estoi, Faro)».
// Usa os layouts MIL_* do template (build_template.js) sem os alterar.
// Fonte do conteúdo: texto da comunicação do responsável («Desafios da integração comunitária…»,
// Arqueologia em Portugal / 2026 – Estado da Questão, pp. 1883–1894). Bibliografia verificada
// reaproveitada da derivação ENEP (build_derivacao_arqueologo_memoria.js).
// 8 slides cronometrados (15 min) + bibliografia e fecho (não narrados).
//
// Uso (depois de prepare_images.py e prepare_images_derivacao_caap.py):
//   NODE_PATH=<node_modules: pptxgenjs, react, react-dom, react-icons, sharp, qrcode, jsqr> \
//   PPTX_SKILL=<pasta da skill pptx> node build_derivacao_caap_2026.js

const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");
const QRCode = require("qrcode");
const jsQR = require("jsqr");
const sharp = require("sharp");
const { PiArrowsClockwise, PiHandshake, PiUsersThree } = require("react-icons/pi");
const { T, THEME, LABEL, W, M, CW, iconPng, defineLayouts } = require("./build_template.js");

const ROOT = path.resolve(__dirname, "../../../../..");
const DERIV = path.join(ROOT, "docs/dissemination/template-apresentacao/derivacoes/comunicacao-caap-2026");
const IMGDIR = path.join(DERIV, "imagens");
const VERSION = process.env.CAAP_VERSION || "v0.1";
const OUT = path.join(DERIV, `APRESENTACAO_CAAP2026_Integracao_Comunitaria_Milreu_${VERSION}.pptx`);
const IMGS = JSON.parse(fs.readFileSync(path.join(ROOT, "docs/dissemination/template-apresentacao/_private/build/imagens_derivacao_caap_2026.json")));
const museum = JSON.parse(fs.readFileSync(path.join(ROOT, "public/data/museum-index.json"))).records
  .reduce((a, r) => ((a[r.id] = r), a), {});
const img = (f) => path.join(IMGDIR, f);
const credit = (f) => IMGS[f].credito_obrigatorio;
const mm = (id) => museum[id];
const mmCap = (id, f, withDate = true) =>
  mm(id).title["pt-PT"] + (withDate ? " (" + mm(id).dateDisplay["pt-PT"] + ")" : "") + ". " + credit(f);
const QR_URL = "https://projectomilreu.pt";

function refs(slide, text, { x = M, w = CW, y = 6.6 } = {}) {
  slide.addText(text, { x, y, w, h: 0.3, margin: 0, fontFace: LABEL, fontSize: 9, color: T.ink500, valign: "top", isTextBox: true, objectName: "referencias" });
}
const cap = (slide, text, x, y, w, h = 0.3) =>
  slide.addText(text, { x, y, w, h, margin: 0, fontFace: LABEL, fontSize: 8, color: T.ink500, valign: "top", isTextBox: true });
const label = (slide, text, x, y, w, color = T.ink600, size = 9.5) =>
  slide.addText(text, { x, y, w, h: 0.26, margin: 0, fontFace: LABEL, fontSize: size, bold: true, color, charSpacing: 1.5, isTextBox: true });

async function qrPng(url) {
  const buf = await QRCode.toBuffer(url, { errorCorrectionLevel: "M", margin: 2, width: 800, color: { dark: "#" + T.ink950, light: "#" + T.paper0 } });
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const dec = jsQR(new Uint8ClampedArray(data), info.width, info.height);
  if (!dec || dec.data !== url) throw new Error("QR não validado: leitura falhou");
  return "image/png;base64," + buf.toString("base64");
}

// ---------------- notas do orador (fala + fontes) ----------------
// Valores financeiros das notas do orador: só em ficheiro privado (gitignored), nunca no repositório público.
const PRIVATE_VALUES_FILE = path.join(ROOT, "docs/dissemination/template-apresentacao/_private/notas_privadas_caap_2026.txt");
const PRIVATE_VALUES = fs.existsSync(PRIVATE_VALUES_FILE)
  ? fs.readFileSync(PRIVATE_VALUES_FILE, "utf8").trim()
  : "Valores: ver Relatório de Execução CCDR (documento interno).";

const NOTES = {
  capa: `CAPA (não cronometrada) · V Congresso de Arqueologia da Associação dos Arqueólogos Portugueses — Universidade do Minho, Campus de Gualtar, Braga. Sexta-feira, 20 de Novembro de 2026, Auditório B2 (Complexo Pedagógico II), Bloco 7 — Arqueologia Pública, Comunicação e Didáctica, comunicação 7.13. Debate no fim do bloco (12h30–13h00), não depois de cada comunicação.

Regras da organização: 15 minutos estritos; entregar a apresentação (PowerPoint e PDF) a um responsável da organização até ao fim do intervalo anterior à sessão (intervalo 10h45–11h00). Levar o PDF como salvaguarda: as fontes Fraunces, Spectral e Archivo não estarão instaladas no computador Windows da sala.

Título: segue o Programa («Desafio da integração comunitária…», singular). O texto publicado usa «Desafios…» (plural); escolher um e manter.

Fala de abertura (~15 s): «Bom dia. Vou apresentar os primeiros resultados — e sobretudo as dificuldades — do Projecto Comunitário de Milreu, um projecto de Arqueologia Pública e Comunitária nas Ruínas Romanas de Milreu, em Estoi.»

Imagem: MM202613 (índice do Museu de Memórias), crédito no slide.`,

  s1: `≈ 1 MIN 40 S · CONTEXTO DE MILREU — O QUE É, ONDE É

Milreu é uma villa romana em Estoi, no concelho de Faro. Conserva paredes, pavimentos, tanques e mosaicos, organizados numa pars urbana — residência, peristilo e termas — e numa pars rustica (Hauschild & Teichner, 2002, pp. 8–9, 12; texto: pp. 17, 19–33).

A ocupação é longa: romana, paleocristã, islâmica e moderna. Na fase moderna, uma casa rural foi construída sobre as estruturas antigas e foi habitada até à segunda metade do século XX (Hauschild & Teichner, 2002, pp. 57, 59; Teichner, 2001, pp. 189–191).

A primeira intervenção sistemática é de 1877, com Estácio da Veiga, que levantou a planta do sítio (Teichner, 2001, p. 190). A partir de 1971 vieram as campanhas do Instituto Arqueológico Alemão, com Theodor Hauschild (Hauschild & Teichner, 2002, p. 13; Teichner, 1997, p. 107). Foi nesse contexto que Milreu foi musealizado — progressivamente delimitado e regulado. Hoje é Monumento Nacional, sob tutela do Património Cultural, I.P.

Imagens: MM202608 (edifício de cultos, potencialmente 1910); MM202606 (1897, posterior aos trabalhos de Estácio da Veiga — ilustra o século XIX sem lhe ser atribuída); MM202614 (escavadores sobre os mosaicos, provavelmente 1981, segundo testemunho de Cristina Farias).

Nota: o texto publicado indica «cerca de sete quilómetros de Faro»; a distância não foi posta no slide (a derivação ENEP também a omitiu por não estar conferida). Não se usa a planta de Hauschild (Hauschild & Teichner, 2002, p. 11) no slide: o projecto não reproduz páginas do livro sem autorização.`,

  s2: `≈ 1 MIN 50 S · PROBLEMÁTICA

A musealização permitiu proteger, estudar e valorizar estruturas frágeis (Hauschild & Teichner, 2002, pp. 12–13, 17–19; Wielewski, 2022). Mas pode ter alterado a relação quotidiana entre a população e o espaço (Jácomo, 2024, pp. 94–95).

No diagnóstico de 2024 — inquérito com 532 respostas, 422 do Algarve, e 9 entrevistas — moradores e interlocutores locais contaram que, antes da musealização, parte de Milreu era zona de passagem, de encontro e de brincadeira, integrada nas rotinas de Estoi (Jácomo, 2024, pp. 37, 95, 129).

O diagnóstico não demonstra que a musealização causou o distanciamento. Mostrou, sim, quatro coisas: falhas de comunicação entre a gestão e a população; pouca informação acessível; percepções divergentes sobre a arqueologia; e um sentimento recorrente de que Milreu é valorizado mas não está no dia-a-dia de Estoi (Jácomo, 2024, pp. 71–72, 76–79, 81–88, 94–95).

Frase-chave: «Milreu é valorizado, mas não faz parte do dia-a-dia de Estoi.»

Cuidado: o inquérito de 2024 não é uma amostra representativa da população de Estoi; evitar generalização estatística ou causal. Imagem: MM202602 — grupo de jovens raparigas junto ao edifício de cultos de Milreu, possivelmente durante um passeio, na década de 1950 (índice do Museu); ilustra o uso quotidiano do sítio antes da musealização. Substitui a MM202609 (v0.1), retirada por dúvidas do responsável.`,

  s3: `≈ 1 MIN 50 S · CONTEXTO DO PROJECTO

O Projecto Comunitário de Milreu é a continuação prática dos resultados de 2024: um programa plurianual, de pelo menos três anos, de Arqueologia Pública e Comunitária, integrado no doutoramento na Universidade do Algarve. O objectivo é recuperar o sentimento de pertença.

Partiu de três elementos: os problemas identificados em 2024 (Jácomo, 2024, pp. 71–95); casos de referência noutros sítios (Moser et al., 2002; Tully, 2007; Ripanti, 2022); e as condições práticas de aplicação — o que obrigou a trazer para o projecto a equipa que gere o sítio. Mais do que uma obrigação institucional, a equipa de Milreu era necessária para tornar as acções possíveis e perceber quais eram aplicáveis ao espaço.

A proposta inicial — museu de memórias, actividades educativas, investigação com participação pública, catalogação colaborativa, livro de memórias e encontros regulares — não foi tratada como plano fechado.

O primeiro instrumento foram as reuniões: 7 de Fevereiro de 2026, nas Ruínas («Milreu: Passado, Comunidade e Futuro» — apresentação, resultados de 2024, debate e visita guiada); 11 de Abril, na Junta de Freguesia de Estoi, com menos apresentação e mais diálogo, onde se propôs o Museu de Memórias; e, a 18 de Abril, o encontro do Dia Internacional dos Monumentos e Sítios, organizado pela gestão do sítio (documentário «Memórias Vivas»; Património Cultural, I.P., 2026). Depois de Abril criou-se um grupo de voluntários no WhatsApp e lançou-se o Inquérito 2026, que restringe a amostra aos municípios que fazem fronteira com Faro.

Créditos: fotografia de 07-02-2026 — Património Cultural, I.P., reprodução sob autorização; fotografia de 11-04-2026 — Fernando Rodrigues de Jácomo, consentimento dos participantes confirmado.`,

  s4: `≈ 1 MIN 50 S · REFERÊNCIAS (ENQUADRAMENTO)

A Arqueologia Pública nasce com McGimsey (1972) e consolida-se nos anos 1990, sem consenso sobre o que é «público» (Schadla-Hall, 1999; Matsuda, 2004; Bonacchi, 2014). A arqueologia comunitária surge como recorte, primeiro em contextos indígenas e pós-coloniais (Thomas, 2017, pp. 14–16, 24–26; Tully, 2007).

Três referências organizam a leitura de Milreu:
1. Moshenska (2017, pp. 5–11; fig. 1.1, p. 6) — tipologia de sete arqueologias públicas. Os primeiros encontros foram arqueologia PARA o público, dirigida pelo investigador. A recolha de fotografias, a validação e a curadoria aproximaram-se de arqueologia COM o público. A passagem é parcial e está em curso.
2. Brodie et al. (2011, pp. 7–8, 14–16, 35–50, 60–65) — participação social, pública e individual; percursos não lineares; o que distingue o contacto pontual da participação contínua é a acção; organizações, espaços e pessoas que circulam entre redes criam as condições para o envolvimento.
3. Thomas (2017, pp. 14–16) — o risco de chamar coprodução a qualquer contacto.
E, como referência metodológica, Quseir, no Egipto (Moser et al., 2002, pp. 221–243): uma lista de actividades replicáveis que procuram dar poder à população local.

O diagrama é uma leitura do caso a partir de Moshenska, não uma figura do autor: Moshenska apresenta tipos, não uma escala.`,

  s5: `≈ 1 MIN 50 S · PRIMEIRA ENTREGA — MUSEU DE MEMÓRIAS → «ENTRE RUÍNAS E MEMÓRIAS»

O Museu de Memórias tornou-se o eixo da primeira fase: uma exposição fotográfica itinerante e virtual sobre a relação entre as pessoas e as ruínas.

Quatro etapas: recolha (31 fotografias, 17 em suporte físico, digitalizadas; algumas com restauro digital por estarem danificadas — cada intervenção fica declarada no registo); organização (cada imagem recebeu um identificador e uma ficha, com avaliação visual e histórico-documental — trabalho ainda feito pelo investigador); votação comunitária (12 fotografias seleccionadas); e curadoria — incluindo o nome da exposição, escolhido pela comunidade: «Entre Ruínas e Memórias».

O processo foi híbrido: reuniões presenciais e participação online pelo WhatsApp, com votações e comentários em SurveyMonkey e Google Forms.

A primeira apresentação pública foi a 10 de Outubro de 2026, no Museu do Traje, em São Brás de Alportel, durante o 2.º Encontro do Grupo de Amigos de Museus do Algarve. A componente digital está em projectomilreu.pt.

Antes de apresentar: confirmar se se menciona a paragem na Junta de Freguesia de Estoi (prevista de 30-10 a 6-11-2026). O repositório não regista a sua realização; só mencionar como facto se se realizou.

Nota: o apoio da CCDR Algarve, via AAMLF, foi aprovado por deliberação de 6-07-2026, dias depois do fecho do artigo das actas — ver slide 8.`,

  s6: `≈ 2 MIN · DIFICULDADES I — PARTICIPAÇÃO

Primeiro encontro: 25 inscrições formais, 9 participantes presenciais. Coincidiu com condições meteorológicas adversas: o IPMA classificou Fevereiro de 2026 como extremamente chuvoso, com a primeira quinzena entre as mais chuvosas das últimas décadas (IPMA, 2026a; 2026b). Mesmo assim, todos os presentes participaram no debate.

Grupo de voluntários: 19 membros; nas consultas e votações participaram habitualmente 6 a 7 pessoas — 31,6 % a 36,8 % do grupo. Os restantes acompanharam sem responder ou participaram em momentos específicos. Estar inscrito num grupo e receber mensagens pode não ser o mesmo que participar: segundo Brodie et al. (2011, pp. 14–16), o que distingue é a acção. E a participação não seguiu uma lógica linear de envolvimento crescente (Brodie et al., 2011, pp. 60–65, 69–70): as pessoas entram, contribuem intensamente e depois recuam.

Inquérito 2026: meta de pelo menos 385 respostas válidas; 152 à data de fecho do artigo das actas (início de Julho de 2026). Em 2024 houve 422 respostas válidas do Algarve, mas a amostra de 2026 é mais restrita (municípios que fazem fronteira com Faro) e os critérios mais exigentes. Manter o levantamento anual responde a uma lacuna apontada por Moshenska (2017, pp. 12–13): muitos projectos recolhem poucos dados sobre os seus próprios resultados.

ACTUALIZAR, se houver número mais recente do Inquérito 2026. O slide diz «em Julho»: a data exacta da contagem não está registada; o artigo cita fontes consultadas a 4-07-2026. 385 é a amostra mínima prevista, não uma amostra efectiva.

Imagem: debate do encontro de 07-02-2026 (Património Cultural, I.P., reprodução sob autorização).`,

  s7: `≈ 2 MIN · DIFICULDADES II — ESTRUTURA E SUSTENTAÇÃO

Estrutura. A participação foi real em tarefas específicas, mas dentro de parâmetros definidos antes pelo investigador: a iniciativa, o método, a organização do inventário e a gestão do processo não saíram das suas mãos (Thomas, 2017, pp. 14–16). Ao mesmo tempo, a presença do arqueólogo responsável pelo sítio e do presidente da Junta de Freguesia de Estoi, e a cedência do espaço da Junta, deram legitimidade: pessoas conhecidas localmente funcionaram como pontes (Brodie et al., 2011, pp. 43–46, 49–50, 72–73).

Sustentação. O projecto e o doutoramento não tinham subsídio previsto à partida; procurar apoio faz parte do trabalho e é avaliado na investigação. A CCDR Algarve exigiu uma entidade jurídica elegível, e não a pessoa do investigador — papel assumido pela Associação dos Amigos do Museu do Lyceu de Faro (AAMLF). O Museu Municipal de Faro ofereceu ajuda operacional e a Junta de Estoi proximidade, divulgação e espaço.

ACTUALIZAÇÃO face ao artigo das actas (fechado sem financiamento aprovado): o apoio da CCDR Algarve ao «Projecto Comunitário de Milreu / Museus sem Fronteiras», com a AAMLF como entidade beneficiária, foi aprovado por deliberação de 6-07-2026 (Programa de Apoio a Iniciativas Culturais Regionais de Caráter Não Profissional 2026). ${PRIVATE_VALUES}

Conclusão: apoio institucional ou financeiro não resolve, por si, a participação; e financiamento sem enraizamento territorial também não a garante (Moshenska, 2017, pp. 5–6). A integração comunitária não surge por se abrirem actividades: constrói-se devagar, com ajustes, com recursos que podem não chegar a tempo, com um calendário flexível e negociação permanente. Para ganhar autonomia, certas decisões terão de começar a ser tomadas pela comunidade, em diferentes camadas.

Imagem: MM202623 (trabalhadores das ruínas, ca. anos 1970-1980); crédito no slide.`,

  bib: `BIBLIOGRAFIA (consulta, não narrada). Entradas em formato RPA autor–data, reaproveitadas da derivação ENEP (verificadas: DOI de Moser et al. e Tully na Crossref; capítulos de Moshenska e Thomas com DOI JSTOR; Teichner 2001, volume de 2001 editado em 2003). IPMA (2026a) e Jácomo (2026) seguem o texto da comunicação; completar editora/local da publicação «Arqueologia em Portugal / 2026 – Estado da Questão» quando confirmados. Referências só citadas nas notas (Bonacchi 2014; Matsuda 2004; Schadla-Hall 1999; Tully 2007; Ripanti 2022; Wielewski 2022; Trigger 2011; Hodder 2002) constam da bibliografia do texto publicado.`,

  fecho: `FECHO (não cronometrado). QR gerado para ${QR_URL} e validado por leitura automática no gerador; testar com um telemóvel no ecrã da sala. Perguntas ficam para o debate do bloco (12h30–13h00).`,
};

// Bibliografia — RPA autor–data: [autores (ano), [[texto, itálico?], …]]
const BIB = [
  ["BRODIE, Ellie; HUGHES, Tim; JOCHUM, Véronique; MILLER, Sarah; OCKENDEN, Nick; WARBURTON, Diane (2011)",
    [["Pathways through participation: what creates and sustains active citizenship? Final report", true], [". London: National Council for Voluntary Organisations; Institute for Volunteering Research; Involve.", false]]],
  ["HAUSCHILD, Theodor; TEICHNER, Felix (2002)",
    [["Milreu: ruínas", true], [". Lisboa: Instituto Português do Património Arquitectónico (Roteiros da Arqueologia Portuguesa, 9).", false]]],
  ["INSTITUTO PORTUGUÊS DO MAR E DA ATMOSFERA (2026a)",
    [["Boletim climatológico mensal: fevereiro de 2026 – Portugal continental", true], [". Lisboa: IPMA.", false]]],
  ["JÁCOMO, Fernando Rodrigues de (2024)",
    [["Patrimônio e comunidade: Ruínas Romanas de Milreu, Estoi (Faro)", true], [". Faro: Universidade do Algarve. Dissertação de mestrado em Arqueologia. http://hdl.handle.net/10400.1/27405.", false]]],
  ["JÁCOMO, Fernando Rodrigues de (2026)",
    [["Desafios da integração comunitária: o caso das Ruínas Romanas de Milreu (Estoi, Faro). ", false], ["Arqueologia em Portugal / 2026 – Estado da Questão", true], [", pp. 1883–1894.", false]]],
  ["MOSER, Stephanie; GLAZIER, Darren; PHILLIPS, James Edward; EL NEMR, Lamya Nasser; MOUSA, Mohammed Saleh; AIESH, Rascha Nasr; RICHARDSON, Susan; CONNER, Andrew; SEYMOUR, Michael (2002)",
    [["Transforming archaeology through practice: strategies for collaborative archaeology and the Community Archaeology Project at Quseir, Egypt. ", false], ["World Archaeology", true], [". 34:2, pp. 220–248. DOI: 10.1080/0043824022000007071.", false]]],
  ["MOSHENSKA, Gabriel (2017)",
    [["Introduction: public archaeology as practice and scholarship where archaeology meets the world. In MOSHENSKA, G., ed. – ", false], ["Key concepts in public archaeology", true], [". London: UCL Press, pp. 1–13. DOI: 10.2307/j.ctt1vxm8r7.5.", false]]],
  ["TEICHNER, Felix (2001)",
    [["Uma nova interpretação da área 21, a partir da planta elaborada por Sebastião Philippes Martins Estácio da Veiga, sobre a villa romana de Milreu (Estoi, Algarve): notícia preliminar. ", false], ["O Arqueólogo Português", true], [". Série IV, 19, pp. 187–198.", false]]],
  ["THOMAS, Suzie (2017)",
    [["Community archaeology. In MOSHENSKA, G., ed. – ", false], ["Key concepts in public archaeology", true], [". London: UCL Press, pp. 14–30. DOI: 10.2307/j.ctt1vxm8r7.6.", false]]],
];

async function main() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.title = "Desafio da integração comunitária: o caso das Ruínas Romanas de Milreu — V CAAP 2026";
  pres.author = "Fernando Rodrigues de Jácomo";
  pres.company = "Projecto Comunitário de Milreu";
  pres.subject = `Item 18 — derivação do template, ${VERSION} (V Congresso da AAP, comunicação 7.13)`;
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  const C = pres.SchemeColor;
  defineLayouts(pres);
  const HF = THEME.headFontFace;
  let s;

  // ======== 1 · Capa ========
  pres.addSection({ title: "Abertura" });
  s = pres.addSlide({ masterName: "MIL_CAPA", sectionTitle: "Abertura" });
  s.addText([{ text: "Desafio da integração comunitária: o caso das Ruínas Romanas de Milreu (Estoi, Faro)", options: { fontSize: 30 } }], { placeholder: "title" });
  s.addText("Primeiros resultados e dificuldades do Projecto Comunitário de Milreu", { placeholder: "subtitulo" });
  s.addText("MUSEUS SEM FRONTEIRAS · INICIATIVAS 2026", { placeholder: "identificador" });
  s.addText("Fernando Rodrigues de Jácomo · V CAAP · Braga · 20-11-2026", { placeholder: "meta" });
  s.addImage({ placeholder: "imagem", path: img("c0_MM202613.jpg"), w: W - 6.9, h: 5.45, altText: mm("MM202613").title["pt-PT"] });
  s.addText(mmCap("MM202613", "c0_MM202613.jpg"), { placeholder: "credito" });
  s.addNotes(NOTES.capa);

  pres.addSection({ title: "Comunicação" });

  // ======== 2 · Contexto de Milreu ========
  s = pres.addSlide({ masterName: "MIL_TITULO", sectionTitle: "Comunicação" });
  s.addText("CONTEXTO · O QUE É, ONDE É", { placeholder: "eyebrow" });
  s.addText("Ruínas Romanas de Milreu", { placeholder: "title" });
  s.addImage({ path: img("c1_MM202608.jpg"), x: M, y: 1.75, w: 6.0, h: 3.34, altText: mm("MM202608").title["pt-PT"] });
  cap(s, mmCap("MM202608", "c1_MM202608.jpg", false), M, 5.14, 6.0, 0.3);
  // marcos do percurso de investigação (sob a imagem principal)
  [["1877", "Estácio da Veiga: primeiras escavações e planta"],
   ["1971 →", "Instituto Arqueológico Alemão (Th. Hauschild) e musealização"]].forEach(([yr, t], i) => {
    const x = M + i * 3.05, y = 5.62;
    s.addText(yr, { x, y, w: 1.1, h: 0.42, margin: 0, fontFace: HF, fontSize: 22, color: T.red700, valign: "top", isTextBox: true });
    s.addText(t, { x: x + 1.12, y: y + 0.02, w: 1.8, h: 0.82, margin: 0, fontFace: LABEL, fontSize: 9.5, color: T.ink700, valign: "top", isTextBox: true });
  });
  {
    const x = 7.0, w = W - M - x;
    label(s, "ONDE", x, 1.75, w, T.red700, 10.5);
    s.addText("Estoi · concelho de Faro", { x, y: 2.03, w, h: 0.42, margin: 0, fontFace: HF, fontSize: 20, color: C.text1, valign: "top", isTextBox: true });
    s.addText("Monumento Nacional · tutela do Património Cultural, I.P.", { x, y: 2.47, w, h: 0.25, margin: 0, fontFace: LABEL, fontSize: 10, color: T.ink600, isTextBox: true });
    label(s, "O QUÊ", x, 2.92, w, T.red700, 10.5);
    s.addText([{ text: "Villa", options: { italic: true } }, { text: " romana: " }, { text: "pars urbana", options: { italic: true } }, { text: " e " }, { text: "pars rustica", options: { italic: true } }],
      { x, y: 3.2, w, h: 0.42, margin: 0, fontFace: HF, fontSize: 20, color: C.text1, valign: "top", isTextBox: true });
    label(s, "ATÉ QUANDO", x, 3.82, w, T.red700, 10.5);
    s.addText("Fases romana, paleocristã, islâmica e moderna; casa rural habitada até à 2.ª metade do séc. XX", { x, y: 4.1, w, h: 0.6, margin: 0, fontFace: HF, fontSize: 15, color: C.text1, valign: "top", isTextBox: true });
    const tw = (w - 0.25) / 2, th = tw / 2.1, ty = 4.85;
    [["c1_MM202606.jpg", "MM202606"], ["c1_MM202614.jpg", "MM202614"]].forEach(([f, id], i) => {
      const xi = x + i * (tw + 0.25);
      s.addImage({ path: img(f), x: xi, y: ty, w: tw, h: th, altText: mm(id).title["pt-PT"] });
      cap(s, mm(id).title["pt-PT"] + " (" + mm(id).dateDisplay["pt-PT"] + "). " + credit(f), xi, ty + th + 0.04, tw, 0.62);
    });
  }
  refs(s, "Teichner, 2001; Hauschild & Teichner, 2002.", { w: 6.0 });
  s.addNotes(NOTES.s1);

  // ======== 3 · Problemática ========
  s = pres.addSlide({ masterName: "MIL_TITULO", sectionTitle: "Comunicação" });
  s.addText("PROBLEMÁTICA", { placeholder: "eyebrow" });
  s.addText("Um sítio valorizado, mas distante", { placeholder: "title" });
  {
    const lw = 6.1;
    label(s, "ANTES DA MUSEALIZAÇÃO, SEGUNDO TESTEMUNHOS LOCAIS", M, 1.78, lw);
    s.addText("Passagem · encontro · brincadeira", { x: M, y: 2.08, w: lw, h: 0.5, margin: 0, fontFace: HF, fontSize: 24, color: C.text1, valign: "top", isTextBox: true });
    label(s, "DIAGNÓSTICO DE 2024 · 532 RESPOSTAS A INQUÉRITO E 9 ENTREVISTAS", M, 2.85, lw);
    const probs = ["Falhas de comunicação entre gestão e população", "Pouca informação acessível", "Percepções divergentes sobre a arqueologia", "Valorizado, mas fora do dia-a-dia de Estoi"];
    probs.forEach((t, i) => {
      const cw = (lw - 0.25) / 2, x = M + (i % 2) * (cw + 0.25), y = 3.18 + Math.floor(i / 2) * 1.05;
      const last = i === 3;
      s.addShape("rect", { x, y, w: cw, h: 0.88, fill: { color: last ? T.ink950 : T.paper100 }, line: { color: last ? T.ink950 : T.paper100 } });
      s.addText(t, { x: x + 0.2, y, w: cw - 0.4, h: 0.88, margin: 0, fontFace: HF, fontSize: 15, color: last ? T.paper0 : T.ink950, valign: "middle", isTextBox: true });
    });
    s.addShape("roundRect", { x: M, y: 5.47, w: 1.1, h: 0.32, rectRadius: 0.08, fill: { color: T.stone700 }, line: { color: T.stone700 } });
    s.addText("HIPÓTESE", { x: M, y: 5.47, w: 1.1, h: 0.32, margin: 0, fontFace: LABEL, fontSize: 9, bold: true, color: T.paper0, align: "center", valign: "middle", charSpacing: 1, isTextBox: true });
    s.addText("Musealização e distanciamento: relação causal ainda não demonstrada", { x: M + 1.25, y: 5.45, w: lw - 1.25, h: 0.45, margin: 0, fontFace: LABEL, fontSize: 10.5, color: T.ink700, valign: "top", isTextBox: true });
  }
  s.addImage({ path: img("c2_MM202602.jpg"), x: 7.13, y: 1.75, w: 5.6, h: 4.6, altText: mm("MM202602").title["pt-PT"] });
  cap(s, mmCap("MM202602", "c2_MM202602.jpg", false), 7.13, 6.4, 5.6, 0.3);
  refs(s, "Jácomo, 2024.", { w: 6.0 });
  s.addNotes(NOTES.s2);

  // ======== 4 · Contexto do Projecto ========
  s = pres.addSlide({ masterName: "MIL_TITULO", sectionTitle: "Comunicação" });
  s.addText("CONTEXTO DO PROJECTO", { placeholder: "eyebrow" });
  s.addText("Do diagnóstico à acção", { placeholder: "title" });
  {
    const flow = [["DIAGNÓSTICO DE 2024", "Problemas identificados"], ["REFERÊNCIAS", "Casos aplicados noutros sítios"], ["CONDIÇÕES", "Equipa que gere o sítio"]];
    const fw = 2.3, fg = 0.42, y = 1.75, h = 1.1;
    flow.forEach(([k, v], i) => {
      const x = M + i * (fw + fg);
      s.addShape("rect", { x, y, w: fw, h, fill: { color: T.paper100 }, line: { color: T.paper100 } });
      label(s, k, x + 0.22, y + 0.15, fw - 0.44, T.red700, 9);
      s.addText(v, { x: x + 0.22, y: y + 0.42, w: fw - 0.44, h: 0.6, margin: 0, fontFace: HF, fontSize: 16, color: T.ink950, valign: "top", isTextBox: true });
      s.addText(i < 2 ? "+" : "→", { x: x + fw, y, w: fg, h, margin: 0, fontFace: LABEL, fontSize: 22, color: T.ink500, align: "center", valign: "middle", isTextBox: true });
    });
    const px = M + 3 * (fw + fg), pw = W - M - px;
    s.addShape("rect", { x: px, y, w: pw, h, fill: { color: T.ink950 }, line: { color: T.ink950 } });
    label(s, "≥ 3 ANOS · DOUTORAMENTO NA UALG", px + 0.25, y + 0.15, pw - 0.5, T.red300, 9);
    s.addText("Projecto Comunitário de Milreu", { x: px + 0.25, y: y + 0.42, w: pw - 0.5, h: 0.6, margin: 0, fontFace: HF, fontSize: 16, color: T.paper0, valign: "top", isTextBox: true });
  }
  {
    label(s, "PROPOSTA INICIAL · PLANO ABERTO", M, 3.08, CW);
    const ini = ["Museu de Memórias", "Actividades educativas", "Investigação com participação pública", "Catalogação colaborativa", "Livro de memórias", "Encontros regulares"];
    const ws = [1.75, 1.95, 2.85, 2.05, 1.6, 1.6];
    let x = M;
    ini.forEach((t, i) => {
      const first = i === 0;
      s.addShape("roundRect", { x, y: 3.38, w: ws[i], h: 0.4, rectRadius: 0.1, fill: { color: first ? T.red700 : T.paper50 }, line: { color: first ? T.red700 : T.ink300, width: 1 } });
      s.addText(t, { x, y: 3.38, w: ws[i], h: 0.4, margin: 0, fontFace: LABEL, fontSize: 10.5, bold: first, color: first ? T.paper0 : T.ink700, align: "center", valign: "middle", isTextBox: true });
      x += ws[i] + 0.06;
    });
  }
  [["c3_apresentacao.jpg", "07-02-2026 · Ruínas de Milreu · 1.ª roda de conversas · 25 inscrições, 9 presentes"],
   ["c3_roda-01.jpg", "11-04-2026 · Junta de Freguesia de Estoi · 2.ª roda de conversas · cerca de 15 participantes"]].forEach(([f, t], i) => {
    const w = (CW - 0.33) / 2, x = M + i * (w + 0.33), y = 4.05, h = w / (5.9 / 2.2);
    s.addImage({ path: img(f), x, y, w, h, altText: t });
    cap(s, t + ". " + credit(f), x, y + h + 0.05, w, 0.3);
  });
  refs(s, "Jácomo, 2024; Moser et al., 2002.", { w: 6.0, y: 6.72 });
  s.addNotes(NOTES.s3);

  // ======== 5 · Referências ========
  s = pres.addSlide({ masterName: "MIL_TITULO", sectionTitle: "Comunicação" });
  s.addText("REFERÊNCIAS", { placeholder: "eyebrow" });
  s.addText("Para o público ou com o público?", { placeholder: "title" });
  {
    // leitura do caso a partir da tipologia de Moshenska (2017)
    const y = 1.85, h = 1.0, sw = (CW - 0.2) / 3;
    const st = [["PARA O PÚBLICO", "Divulgação dirigida pelo investigador"], ["COM O PÚBLICO", "Participantes contribuem para a investigação"], ["PELA COMUNIDADE", "A iniciativa nasce e decide-se localmente"]];
    st.forEach(([k, v], i) => {
      const x = M + i * (sw + 0.1);
      const col = [T.paper100, T.paper200, T.ink950][i];
      s.addShape("rect", { x, y, w: sw, h, fill: { color: col }, line: { color: col } });
      label(s, k, x + 0.25, y + 0.16, sw - 0.5, i === 2 ? T.red300 : T.red700, 10.5);
      s.addText(v, { x: x + 0.25, y: y + 0.46, w: sw - 0.5, h: 0.46, margin: 0, fontFace: HF, fontSize: 15, color: i === 2 ? T.paper0 : T.ink950, valign: "top", isTextBox: true });
    });
    // marcador: Milreu entre «para» e «com»
    const mx = M + sw * 0.55, mw = sw + 0.1;
    s.addShape("rect", { x: mx, y: y + h + 0.12, w: mw, h: 0.07, fill: { color: T.red500 }, line: { color: T.red500 } });
    s.addShape("ellipse", { x: mx + mw - 0.11, y: y + h + 0.07, w: 0.17, h: 0.17, fill: { color: T.red500 }, line: { color: T.red500 } });
    s.addText("Milreu 2026: passagem parcial, ainda em curso", { x: mx, y: y + h + 0.26, w: mw + 1.2, h: 0.32, margin: 0, fontFace: HF, italic: true, fontSize: 15, color: T.red700, isTextBox: true });
    label(s, "LEITURA DO CASO A PARTIR DE MOSHENSKA (2017)", M + 2 * (sw + 0.1), y + h + 0.3, sw, T.ink500, 8.5);
  }
  {
    const cards = [
      [PiArrowsClockwise, "Brodie et al., 2011", "Participação social, pública e individual. Os percursos não são lineares: o que distingue é a acção."],
      [PiHandshake, "Thomas, 2017", "Nem todo o contacto com a população é coprodução."],
      [PiUsersThree, "Moser et al., 2002 · Quseir", "Actividades replicáveis para dar poder à população local."],
    ];
    const cw = (CW - 0.5) / 3, y = 3.65, h = 2.75;
    for (let i = 0; i < 3; i++) {
      const [Ic, t, d] = cards[i];
      const x = M + i * (cw + 0.25);
      s.addShape("rect", { x, y, w: cw, h, fill: { color: T.paper100 }, line: { color: T.paper100 }, objectName: "referencia-" + (i + 1) });
      s.addShape("ellipse", { x: x + 0.3, y: y + 0.3, w: 0.7, h: 0.7, fill: { color: C.accent1 }, line: { color: T.red500 } });
      s.addImage({ data: await iconPng(Ic, T.paper0), x: x + 0.44, y: y + 0.44, w: 0.42, h: 0.42, altText: "Ícone " + t });
      s.addText(t, { x: x + 1.15, y: y + 0.3, w: cw - 1.4, h: 0.7, margin: 0, fontFace: LABEL, fontSize: 12, bold: true, color: T.ink950, valign: "middle", isTextBox: true });
      s.addText(d, { x: x + 0.3, y: y + 1.2, w: cw - 0.6, h: 1.4, margin: 0, fontFace: HF, fontSize: 17, color: T.ink950, valign: "top", isTextBox: true });
    }
  }
  refs(s, "Moshenska, 2017; Brodie et al., 2011; Thomas, 2017; Moser et al., 2002.");
  s.addNotes(NOTES.s4);

  // ======== 6 · Primeira entrega ========
  s = pres.addSlide({ masterName: "MIL_TITULO", sectionTitle: "Comunicação" });
  s.addText("PRIMEIRA ENTREGA · MUSEU DE MEMÓRIAS", { placeholder: "eyebrow" });
  s.addText("Exposição «Entre Ruínas e Memórias»", { placeholder: "title" });
  {
    const iw = 6.4, ih = iw / (6.6 / 4.2);
    s.addImage({ path: img("c5_exposicao-02.jpg"), x: M, y: 1.75, w: iw, h: ih, altText: "Exposição «Entre Ruínas e Memórias», Museu do Traje, 10-10-2026" });
    cap(s, "1.ª apresentação pública · Museu do Traje, São Brás de Alportel · 10-10-2026 · 2.º Encontro do Grupo de Amigos de Museus do Algarve. " + credit("c5_exposicao-02.jpg"), M, 1.75 + ih + 0.06, iw, 0.45);
    const x = 7.4, w = W - M - x;
    const steps = [["31", "fotografias recolhidas", "17 em suporte físico, digitalizadas"], ["1 ficha", "por imagem", "identificador + avaliação documental"], ["12", "seleccionadas", "por votação comunitária"], ["1 nome", "escolhido pela comunidade", "«Entre Ruínas e Memórias»"]];
    steps.forEach(([n, a, b], i) => {
      const y = 1.75 + i * 1.0;
      s.addText(n, { x, y, w: 1.75, h: 0.85, margin: 0, fontFace: HF, fontSize: n.length > 3 ? 26 : 40, color: T.red700, valign: "middle", isTextBox: true });
      s.addText([{ text: a, options: { bold: true, breakLine: true } }, { text: b, options: { color: T.ink600 } }],
        { x: x + 1.85, y, w: w - 1.85, h: 0.85, margin: 0, fontFace: LABEL, fontSize: 13, color: T.ink950, valign: "middle", isTextBox: true });
    });
    s.addShape("rect", { x, y: 5.85, w, h: 0.58, fill: { color: T.paper100 }, line: { color: T.paper100 } });
    s.addText("Exposição itinerante e online · projectomilreu.pt", { x: x + 0.22, y: 5.85, w: w - 0.44, h: 0.58, margin: 0, fontFace: LABEL, fontSize: 12, bold: true, color: T.ink950, valign: "middle", isTextBox: true });
  }
  refs(s, "Dados: inventário e registos de curadoria do Projecto Comunitário de Milreu (2026).", { x: 7.4, w: W - M - 7.4 });
  s.addNotes(NOTES.s5);

  // ======== 7 · Dificuldades I ========
  s = pres.addSlide({ masterName: "MIL_TITULO", sectionTitle: "Comunicação" });
  s.addText("DIFICULDADES · PARTICIPAÇÃO", { placeholder: "eyebrow" });
  s.addText("Estar inscrito não é participar", { placeholder: "title" });
  [["9", "de 25", "inscritos estiveram no 1.º encontro, em Fevereiro de 2026, um mês extremamente chuvoso"],
   ["6–7", "de 19", "membros do grupo de voluntários no WhatsApp votam, em média, em cada consulta"],
   ["152", "de 385", "respostas válidas ao inquérito anual de 2026 em Julho, face à meta mínima"]].forEach(([n, d, l], i) => {
    const y = 1.8 + i * 1.5;
    s.addText(n, { x: M, y, w: 1.85, h: 1.0, margin: 0, fontFace: HF, fontSize: 54, color: T.red700, valign: "middle", isTextBox: true });
    s.addText(d, { x: M + 1.9, y: y + 0.08, w: 1.3, h: 0.5, margin: 0, fontFace: HF, fontSize: 22, color: T.ink600, valign: "middle", isTextBox: true });
    s.addText(l, { x: M + 1.9, y: y + 0.55, w: 4.1, h: 0.75, margin: 0, fontFace: LABEL, fontSize: 12, color: T.ink950, valign: "top", isTextBox: true });
  });
  s.addImage({ path: img("c6_debate.jpg"), x: 7.13, y: 1.75, w: 5.6, h: 4.6, altText: "Debate na roda de conversas de 07-02-2026, Ruínas de Milreu" });
  cap(s, "Debate · «Milreu: Passado, Comunidade e Futuro» · Ruínas de Milreu · 07-02-2026. " + credit("c6_debate.jpg"), 7.13, 6.4, 5.6, 0.3);
  refs(s, "Brodie et al., 2011; IPMA, 2026a.", { w: 6.0 });
  s.addNotes(NOTES.s6);

  // ======== 8 · Dificuldades II ========
  s = pres.addSlide({ masterName: "MIL_TITULO", sectionTitle: "Comunicação" });
  s.addText("DIFICULDADES · ESTRUTURA E SUSTENTAÇÃO", { placeholder: "eyebrow" });
  s.addText("Quem decide? Quem sustenta?", { placeholder: "title" });
  {
    const cw = 2.95, y = 1.75, h = 3.1;
    const cols = [
      ["ESTRUTURA", ["Método, inventário e gestão ainda nas mãos do investigador", "Junta de Freguesia, equipa de Milreu e Amigos do Museu do Lyceu de Faro como pontes"]],
      ["SUSTENTAÇÃO", ["Sem bolsa nem subsídio à partida", "Apoio da CCDR Algarve só em Julho de 2026, através dos Amigos do Museu do Lyceu de Faro"]],
    ];
    cols.forEach(([k, items], i) => {
      const x = M + i * (cw + 0.2);
      s.addShape("rect", { x, y, w: cw, h, fill: { color: T.paper100 }, line: { color: T.paper100 } });
      label(s, k, x + 0.25, y + 0.2, cw - 0.5, T.red700, 10.5);
      s.addText(items.map((t, j) => ({ text: t, options: { bullet: true, breakLine: j < items.length - 1 } })),
        { x: x + 0.25, y: y + 0.58, w: cw - 0.5, h: h - 0.7, margin: 0, fontSize: 14, color: T.ink950, valign: "top", paraSpaceAfter: 8, isTextBox: true });
    });
    s.addText("Financiamento ≠ participação.", { x: M, y: 5.0, w: 6.1, h: 0.4, margin: 0, fontFace: LABEL, fontSize: 13, bold: true, color: T.ink700, isTextBox: true });
    s.addText("A integração comunitária constrói-se devagar, com ajustes e negociação permanente.", { x: M, y: 5.42, w: 6.1, h: 0.95, margin: 0, fontFace: HF, italic: true, fontSize: 20, color: T.red700, valign: "top", isTextBox: true });
  }
  s.addImage({ path: img("c7_MM202623.jpg"), x: 7.13, y: 1.75, w: 5.6, h: 4.6, altText: mm("MM202623").title["pt-PT"] });
  cap(s, mmCap("MM202623", "c7_MM202623.jpg"), 7.13, 6.4, 5.6, 0.3);
  refs(s, "Thomas, 2017; Brodie et al., 2011; Moshenska, 2017.", { w: 6.0 });
  s.addNotes(NOTES.s7);

  // ======== Bibliografia (não narrada) ========
  pres.addSection({ title: "Encerramento" });
  s = pres.addSlide({ masterName: "MIL_TITULO", sectionTitle: "Encerramento" });
  s.addText("REFERÊNCIAS", { placeholder: "eyebrow" });
  s.addText("Bibliografia", { placeholder: "title" });
  {
    const half = 5;
    [BIB.slice(0, half), BIB.slice(half)].forEach((col, c) => {
      s.addText(col.flatMap(([a, parts], i) => [
        { text: a, options: { bold: true, fontFace: LABEL, fontSize: 9, color: T.ink950, breakLine: true, ...(i > 0 ? { paraSpaceBefore: 8 } : {}) } },
        ...parts.map(([t, it], j) => ({ text: t, options: { italic: it, fontSize: 11, color: T.ink700, ...(j === parts.length - 1 ? { breakLine: i < col.length - 1 } : {}) } })),
      ]), { x: M + c * 6.2, y: 1.65, w: 5.93, h: 5.1, margin: 0, valign: "top", isTextBox: true, objectName: "bibliografia-" + (c + 1) });
    });
  }
  s.addNotes(NOTES.bib);

  // ======== Fecho ========
  s = pres.addSlide({ masterName: "MIL_FECHO", sectionTitle: "Encerramento" });
  s.addText("Obrigado", { placeholder: "title" });
  s.addText([
    { text: "Fernando Rodrigues de Jácomo", options: { bold: true, breakLine: true } },
    { text: "a78190@ualg.pt", options: { breakLine: true } },
    { text: "projectomilreu.pt" },
  ], { placeholder: "texto" });
  s.addImage({ placeholder: "qr", data: await qrPng(QR_URL), w: 2.4, h: 2.4, altText: "Código QR para " + QR_URL });
  s.addText("projectomilreu.pt", { placeholder: "qr_legenda" });
  s.addNotes(NOTES.fecho);

  await pres.writeFile({ fileName: OUT });
  const { applyTheme } = require(path.join(process.env.PPTX_SKILL, "scripts/apply_theme.js"));
  await applyTheme(OUT, THEME);
  console.log("OK", OUT);
}

main().catch((e) => { console.error(e); process.exit(1); });
