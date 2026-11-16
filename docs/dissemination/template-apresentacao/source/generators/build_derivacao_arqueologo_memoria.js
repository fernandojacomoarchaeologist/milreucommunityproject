// © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu.
// Consultar RIGHTS.md. A atribuição não transfere direitos de terceiros.
//
// Item 18 — DERIVAÇÃO do template: comunicação «O arqueólogo e a manutenção da memória».
// Usa os layouts MIL_* do template (build_template.js) sem os alterar; o template mantém-se.
// Talking points e bibliografia fornecidos pelo responsável (2026-10-20): integrais nas notas
// do orador; nos slides só síntese + referências autor–data no rodapé.
//
// Uso (raiz do repositório, depois de prepare_images.py e prepare_images_derivacao.py):
//   NODE_PATH=<node_modules: pptxgenjs, react, react-dom, react-icons, sharp, qrcode, jsqr> \
//   PPTX_SKILL=<pasta da skill pptx> node build_derivacao_arqueologo_memoria.js

const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");
const QRCode = require("qrcode");
const jsQR = require("jsqr");
const sharp = require("sharp");
const { PiArchive, PiGraph, PiMicrophone } = require("react-icons/pi");
const { T, THEME, LABEL, W, H, M, CW, iconPng, defineLayouts } = require("./build_template.js");

const ROOT = path.resolve(__dirname, "../../../../..");
const DERIV = path.join(ROOT, "docs/dissemination/template-apresentacao/derivacoes/comunicacao-arqueologo-memoria");
const IMGDIR = path.join(DERIV, "imagens");
const OUT = path.join(DERIV, "APRESENTACAO_Arqueologo_Manutencao_Memoria_v0.6.pptx");
const IMGS = JSON.parse(fs.readFileSync(path.join(ROOT, "docs/dissemination/template-apresentacao/_private/build/imagens_derivacao_arqueologo_memoria.json")));
const museum = JSON.parse(fs.readFileSync(path.join(ROOT, "public/data/museum-index.json"))).records
  .reduce((a, r) => ((a[r.id] = r), a), {});
const img = (f) => path.join(IMGDIR, f);
const credit = (f) => IMGS[f].credito_obrigatorio;
const mm = (id) => museum[id];
const QR_URL = "https://projectomilreu.pt";

// rodapé de referências (autor–data); páginas ficam nas notas
function refs(slide, text, { x = M, w = CW, y = 6.6 } = {}) {
  slide.addText(text, { x, y, w, h: 0.3, margin: 0, fontFace: LABEL, fontSize: 9, color: T.ink500, valign: "top", isTextBox: true, objectName: "referencias" });
}
const cap = (slide, text, x, y, w, h = 0.3) =>
  slide.addText(text, { x, y, w, h, margin: 0, fontFace: LABEL, fontSize: 8, color: T.ink500, valign: "top", isTextBox: true });
function chip(slide, text, x, y, color, w) {
  slide.addShape("roundRect", { x, y, w, h: 0.32, rectRadius: 0.08, fill: { color }, line: { color } });
  slide.addText(text, { x, y, w, h: 0.32, margin: 0, fontFace: LABEL, fontSize: 9, bold: true, color: T.paper0, align: "center", valign: "middle", isTextBox: true, charSpacing: 1 });
}

async function qrPng(url) {
  const buf = await QRCode.toBuffer(url, { errorCorrectionLevel: "M", margin: 2, width: 800, color: { dark: "#" + T.ink950, light: "#" + T.paper0 } });
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const dec = jsQR(new Uint8ClampedArray(data), info.width, info.height);
  if (!dec || dec.data !== url) throw new Error("QR não validado: leitura falhou");
  return "image/png;base64," + buf.toString("base64");
}

const NOTES = {
  milreu: `CERCA DE 30 SEGUNDOS · ENQUADRAMENTO (slide acrescentado na v0.6)

Milreu é uma villa romana em Estoi, no concelho de Faro, com uma parte residencial (pars urbana), uma parte agrícola (pars rustica) e um edifício religioso. O sítio teve ocupação romana, paleocristã e islâmica; mais tarde, uma casa rural foi construída sobre as ruínas e serviu de habitação e centro agrícola até meados do século XX (Hauschild & Teichner, 2002, pp. 8–9, 12).

O Projecto Comunitário de Milreu é um programa plurianual de Arqueologia Pública e Comunitária associado às Ruínas Romanas de Milreu. Desenvolve várias iniciativas — entre elas o Museu de Memórias, a exposição itinerante «Entre Ruínas e Memórias» e o Circuito Educativo — orientadas por três pilares: comunicação, mutualidade e pertinência social e política.

Fontes: Hauschild & Teichner (2002), pp. 8–9 e 12 (villa, pars urbana / rustica, fases de ocupação, casa rural até meados do século XX); definição do projecto e pilares — documentação canónica do Projecto Comunitário de Milreu; iniciativas 2026 — arquitectura «Museus sem Fronteiras · Iniciativas 2026».

Nota de tempo: este slide acrescenta cerca de 30 s ao total cronometrado (~10 min). Se o tempo for fixo, retirar 15 s aos slides 6 e 7, que estão abaixo das 80 palavras/min.

Imagem: MM202608, «Edifício de cultos, potencialmente em 1910» (índice do Museu); recorte da margem de digitalização, sem alteração tonal.`,
  capa: "Capa (não cronometrada). Título oficial conforme o Programa do III Encontro Nacional de Estudantes de Património (Universidade do Algarve, Campus da Penha, Faro): quinta-feira, 5 de Novembro de 2026, 15h45, Painel 2 — Comunidades locais na gestão do património rural; debate às 16h00. A formulação breve «O arqueólogo e a manutenção da memória» fica como subtítulo.",
  s1: `25 SEGUNDOS · INTRODUÇÃO

A conservação do património arqueológico não se limita necessariamente à preservação da sua materialidade. A Arqueologia Pública e Comunitária tem procurado ampliar a participação das populações na produção e interpretação do conhecimento sobre o passado (Moser & alii, 2002, pp. 221–225; Tully, 2007, pp. 155–160).

Surge, assim, uma questão: qual deve ser a responsabilidade do arqueólogo na salvaguarda das memórias das pessoas que fizeram parte da história de um sítio arqueológico?

Referências para o rodapé: Moser & alii, 2002; Tully, 2007.

Nota de ritmo (revisão v0.2): ~71 palavras em 25 s ≈ 170 palavras/min, acima de um ritmo confortável (~130). Ou alargar para ~35 s (retirando 5 s aos slides 5 e 6, que estão a ~75 palavras/min), ou dizer a versão curta:
«Conservar o património arqueológico não é apenas preservar a sua materialidade. A Arqueologia Pública e Comunitária tem procurado envolver as populações na produção do conhecimento sobre o passado. Que responsabilidade cabe, então, ao arqueólogo na salvaguarda das memórias de quem fez parte da história de um sítio?»

Alternativa v0.4 (~45 palavras): «A preservação de um sítio arqueológico não se esgota na conservação das suas estruturas. A Arqueologia Pública e Comunitária convida a considerar também as pessoas que conviveram com esse espaço. Que responsabilidade tem o arqueólogo na documentação crítica dessas memórias?» Tratar «responsabilidade» como problema de investigação, não como obrigação já demonstrada.`,
  s2: `1 MINUTO E 05 SEGUNDOS · CONTEXTUALIZAÇÃO

As Ruínas Romanas de Milreu possuem uma longa história de investigação e intervenção patrimonial, desde os trabalhos de Estácio da Veiga, nos finais do século XIX (Teichner, 2001, pp. 189–194; Hauschild & Teichner, 2002, p. 12). A partir de 1971 iniciaram-se novas escavações sistemáticas e o restauro dos mosaicos, sob responsabilidade do Instituto Arqueológico Alemão, da Faculdade de Arquitectura da Universidade Técnica de Lisboa e do Museu Monográfico de Conímbriga. Theodor Hauschild dirigiu a investigação do Instituto Arqueológico Alemão em Milreu (Hauschild & Teichner, 2002, p. 13; Teichner, 1997, p. 107).

O diagnóstico realizado em 2024 identificou dificuldades de comunicação entre o sítio e a população local, bem como testemunhos sobre formas anteriores de utilização quotidiana do espaço. A possível influência da musealização nesse distanciamento permanece uma hipótese de investigação, não uma relação causal demonstrada (Jácomo, 2024, pp. 37, 71–72, 76–79, 94–95, 129).

A questão central é compreender como integrar essas memórias pessoais no conhecimento patrimonial sobre Milreu.

Referências para o rodapé: Teichner, 1997; Teichner, 2001; Hauschild & Teichner, 2002; Jácomo, 2024.

Nota v0.5: o slide tem três quadrantes iguais — século XIX, segunda metade do século XX e actualmente (diagnóstico de 2024 e rodas de conversa, com a hipótese sobre a musealização). A fotografia actual é da roda de conversas «Milreu: Passado, Comunidade e Futuro», 07-02-2026, nas Ruínas de Milreu.

Acréscimo v0.4 — ligação ao tema do III ENEP («Patrimónios rurais»; Painel 2 — Comunidades locais na gestão do património rural): «Milreu permite observar duas dimensões do património rural: a história material de uma villa romana e as memórias mais recentes de trabalho, escavação e utilização quotidiana do espaço por pessoas ligadas a Estoi.»

Acréscimo v0.4 — base do diagnóstico de 2024: inquérito online com 532 respostas (422 do Algarve) e 9 entrevistas qualitativas (dados canónicos aprovados pelo responsável em 2026-10-06). Não é uma amostra representativa da população de Estoi; evitar generalização estatística ou causal.

Nota de imagem: a fotografia MM202606 está datada de 1897 no índice do Museu, posterior às escavações de Estácio da Veiga em Milreu (1877); ilustra as intervenções do século XIX, sem lhe ser atribuída. MM202616: presença de Theodor Hauschild «possível» segundo o índice.`,
  s3: `1 MINUTO · OBJECTIVOS E ENQUADRAMENTO

O Projecto Comunitário de Milreu foi concebido a partir do diagnóstico de 2024 e de experiências de Arqueologia Pública e Comunitária que procuram integrar as populações nos processos de investigação e valorização patrimonial (Jácomo, 2024, pp. 71–95; Moser & alii, 2002, pp. 229–233; Tully, 2007, pp. 158–160).

Uma das iniciativas resultantes é o Museu de Memórias, desenvolvido através da recolha de fotografias, testemunhos e informação histórica, conjugando documentação científica e curadoria participativa.

A proposta tem afinidades metodológicas com a experiência de Quseir, no Egipto, particularmente na utilização de arquivos fotográficos, história oral e colaboração comunitária (Moser & alii, 2002, pp. 229–233, 242–243).

Distinção: Quseir é uma referência metodológica, não um modelo que esteja a ser reproduzido integralmente em Milreu.

Acréscimo v0.4: o Museu de Memórias é a iniciativa documental e de devolução pública do projecto (inventário, componente digital); «Entre Ruínas e Memórias» é a exposição itinerante que dela resulta. Não sugerir um museu institucional ou formalmente reconhecido.

Referências para o rodapé: Jácomo, 2024; Moser & alii, 2002; Tully, 2007.`,
  s4: `1 MINUTO E 25 SEGUNDOS · PARTICIPAÇÃO COMUNITÁRIA

O processo de construção da exposição envolveu a recolha e organização de 31 fotografias, seguidas de consultas comunitárias para a selecção dos conteúdos, a interpretação das imagens e a definição do título.

O grupo de voluntários reuniu 19 membros, com uma participação habitual de seis a sete pessoas por consulta. Estes resultados demonstram que a inscrição num grupo não corresponde necessariamente a uma participação activa e continuada, um problema discutido por Brodie & alii (2011, pp. 14–16, 60–65, 69–70).

A experiência também evidencia os limites da coprodução. Embora tenham ocorrido escolhas comunitárias, a estruturação do processo, os critérios técnicos e a organização do inventário permaneceram maioritariamente sob responsabilidade do investigador (Thomas, 2017, pp. 14–16).

Fontes primárias: Anexo D, pp. 1–2; registos de resultados do Projecto Comunitário de Milreu.

Referências para o rodapé: Brodie & alii, 2011; Thomas, 2017.

Acréscimo v0.4 (frase para a fala): «A comunidade participou em escolhas reais, mas a definição da estrutura, do inventário e dos critérios editoriais não foi distribuída de forma simétrica.» Os 19 membros não são 19 participantes activos; 6–7 é uma média por etapa, não uma taxa de participação da população; 31 fotografias não equivalem a 31 memórias representativas de Estoi.

Dados confirmados no Anexo D, p. 2 (revisão v0.3): o grupo tinha 19 membros até Junho de 2026; cada etapa teve uma participação média de 6 a 7 pessoas.

Nota de imagem: roda de conversas de 11-04-2026 (Junta de Freguesia de Estoi); a legenda não a identifica como uma das consultas de selecção.`,
  s5: `1 MINUTO E 40 SEGUNDOS · METODOLOGIA

O inventário foi concebido a partir de três referenciais complementares:

Inventário museológico português. A estrutura das fichas acompanha a tradição das Normas de Inventário, designadamente a identificação, descrição, proveniência, caracterização material e documentação associada (Pinho & Freitas, 2000; Raposo, Martins & Correia, 2000).

CIDOC CRM. A aplicação deste modelo conceptual permite estruturar relações entre objectos, conteúdos visuais, pessoas, lugares, acontecimentos e períodos cronológicos, favorecendo a interoperabilidade documental (ISO 21127:2023).

História oral e Arqueologia Comunitária. Os testemunhos e identificações provenientes da população são incorporados enquanto fontes documentais, considerando a sua proveniência e necessidade de contextualização e confrontação com outras evidências (Moser & alii, 2002, pp. 229–233; Tully, 2007, pp. 155–160).

A aplicação destes referenciais procura distinguir informações documentadas, hipóteses interpretativas e elementos ainda por confirmar.

Precisão v0.4 (para a fala): as fichas inspiram-se nas Normas de Inventário (adaptação a fotografias de famílias, não conformidade formal); o CIDOC CRM é um referencial conceptual — cada ficha regista as classes correspondentes (E22/E84, E36, E73, E52, E53, E39, E30…), sem implementação numa base semântica; os testemunhos orais são tratados como fontes identificadas, contextualizadas e passíveis de confronto, sem invocar um protocolo integral de história oral (gravação, consentimento, depósito) que não está documentado. «Informação documentada / hipótese interpretativa / por confirmar» são categorias editoriais do projecto, não classes da ontologia.

Fontes primárias: Anexo C, pp. 1–2. As obras de inventário e a norma ISO foram também conferidas através dos respectivos registos institucionais (biblioteca.patrimoniocultural.gov.pt).

Referências para o rodapé: Pinho & Freitas, 2000; Raposo, Martins & Correia, 2000; ISO 21127:2023; Moser & alii, 2002; Tully, 2007.`,
  s6: `1 MINUTO E 40 SEGUNDOS · ESTUDO DE CASO

Um exemplo do processo é o registo MM202613, correspondente a uma fotografia de Theodor Hauschild e de uma equipa de escavadores em Milreu.

A documentação reúne observações materiais, informação de proveniência familiar, identificações recolhidas junto de interlocutores locais, digitalização e hipóteses sobre a cronologia e o contexto espacial da fotografia.

As informações não possuem todas o mesmo grau de confirmação. A ficha identifica elementos certos, prováveis e possíveis, bem como necessidades de investigação complementar.

Este procedimento aproxima-se da preocupação metodológica de Moser & alii (2002, pp. 229–233) com a integração da história oral e da documentação fotográfica na investigação colaborativa.

O exemplo permite discutir uma responsabilidade central do arqueólogo: integrar a memória comunitária sem transformar testemunhos ou hipóteses em factos arqueológicos demonstrados.

Fonte primária: Anexo C, pp. 59–60, ficha MM202613.

Referências para o rodapé: Moser & alii, 2002; ISO 21127:2023; Projecto Comunitário de Milreu, Anexo C, MM202613.

Acréscimo v0.4: cada grau (certo · provável · possível) qualifica uma afirmação concreta da ficha, não a fotografia no seu conjunto. O certo (suporte) verifica-se por observação; o provável (proveniência) depende da cadeia documental; o possível (datação) fica separado das hipóteses sobre pessoas e circunstâncias. Identificações de pessoas feitas por reconhecimento oral atribuem-se ao interlocutor e datam-se.

Decisão do responsável de 2026-10-21: o índice público do Museu mantém para a MM202613 «ca. 1981, segundo hipótese de Cristina Farias». O slide cita a ficha do inventário preliminar (Anexo C), que regista «ca. 1970s · possible». A diferença entre a ficha preliminar e o registo curado pode ser referida na fala como exemplo do próprio problema da comunicação.

Nota v0.3: o slide usa o vocabulário da própria ficha do inventário preliminar (certo · provável · possível) e mostra as hipóteses interpretativas como campo separado, tal como no Anexo C. «Possível» não equivale a «hipótese»: o primeiro é um grau de confiança, o segundo uma proposição interpretativa. Os três exemplos vêm da ficha MM202613 (Anexo C): suporte (certo), proveniência (provável), datação ca. década de 1970 (possível). A datação «ca. 1981» atribuída a Cristina Farias pertence, no Anexo C, à ficha MM202614; o índice público do Museu associa-a também à MM202613 — divergência a rever no registo do Museu (não alterado nesta apresentação). O vocabulário do modelo de dados do Museu (confirmed · probable · hypothesis) não muda.`,
  s7: `1 MINUTO E 05 SEGUNDOS · APLICAÇÃO E DEVOLUÇÃO À COMUNIDADE

A construção da exposição representa uma tentativa de devolver à população parte das informações e memórias recolhidas durante a investigação.

Em Quseir, Moser & alii (2002, pp. 229–233, 242–243) destacam a apresentação pública, os arquivos fotográficos e a produção de recursos comunitários entre as componentes da investigação colaborativa.

No caso de Milreu, a iniciativa materializou-se numa exposição itinerante e numa componente digital, conjugando fotografias, testemunhos e interpretação patrimonial.

A montagem experimental realizada em 10 de Outubro de 2026 permitiu testar a apresentação física da exposição. Esta etapa representa um resultado operacional, não sendo ainda suficiente para demonstrar impacto duradouro na relação entre a população e o sítio arqueológico.

Fontes primárias: Anexos C e D; registo operacional da exposição experimental de 10/10/2026, posterior aos anexos preliminares.

Acréscimo v0.4: «devolução» = disponibilização pública de fotografias, contextualizações e testemunhos, sujeita a direitos e a participação. Antes de 5-11-2026, confirmar se a exposição na Junta de Freguesia de Estoi (prevista de 31-10 a 6-11) se realizou; só então a mencionar como facto.

Referências para o rodapé: Moser & alii, 2002; Projecto Comunitário de Milreu, 2026.`,
  s8: `1 MINUTO E 10 SEGUNDOS · DISCUSSÃO E CONCLUSÃO

A experiência de Milreu sugere que a participação comunitária pode contribuir para a recolha, contextualização e interpretação de documentação patrimonial, mas também expõe limitações operacionais e diferenças de autoridade entre participantes e investigadores.

Thomas (2017, pp. 14–16) permite problematizar a diferença entre participação e coprodução. Moshenska (2017, pp. 5–11) enquadra a passagem entre uma arqueologia dirigida ao público e práticas desenvolvidas com a comunidade.

Ripanti (2022, pp. 75–76, 176–184) contribui para a discussão sobre as condições e os limites das práticas participativas em contextos arqueológicos.

Em Milreu, os resultados são ainda preliminares. Contudo, o processo demonstra possibilidades de articulação entre documentação científica, testemunhos comunitários e divulgação patrimonial.

A responsabilidade do arqueólogo poderá, assim, abranger não apenas a conservação e interpretação do património material, mas também a documentação crítica das memórias que ajudam a compreender a sua história social.

Referências para o rodapé: Thomas, 2017; Moshenska, 2017; Ripanti, 2022.

Nota v0.5: texto do slide simplificado (três frases curtas + conclusão). A ligação a Thomas (participação vs. coprodução), Moshenska (da arqueologia para o público às práticas com a comunidade) e Ripanti (condições e limites) fica no rodapé e na fala.

Acréscimo v0.4 — retoma do tema do III ENEP: «No caso de Milreu, salvaguardar a história do sítio inclui também documentar criticamente as memórias das pessoas que trabalharam e viveram em relação com este território.» Três planos: (i) preservação material; (ii) conservação da proveniência e da incerteza dos testemunhos; (iii) devolução interpretativa e negociação dos limites da autoridade científica. As sínteses do slide são leitura do caso apoiada nos autores, não citações literais.

Nota bibliográfica (v0.2): «Moshenska (2017, pp. 5–11)» remete para o capítulo introdutório (pp. 1–13), agora referenciado como capítulo na bibliografia.`,
  bib: "Bibliografia v0.4: slide de consulta, não narrado, dividido em duas páginas com letra maior; DOIs de capítulo (JSTOR/Crossref) para Moshenska (10.2307/j.ctt1vxm8r7.5) e Thomas (10.2307/j.ctt1vxm8r7.6); co-autoria de Virgílio Correia confirmada na ficha técnica (TEXTO: Luís Raposo e Adolfo Silveira Martins, MNA; Virgílio Correia, Museu Monográfico de Conímbriga; 1.ª ed., Dez. 2000). Bibliografia v0.3 (RPA): acrescentada TEICHNER (1997), Madrider Mitteilungen 38, pp. 106–162, conforme o dossiê bibliográfico (p. 107: direcção de Theodor Hauschild); handle da dissertação de Jácomo (2024); Anexos C e D apresentados à parte como dados primários internos. Co-autoria de Virgílio Correia mantida: confirmada no catálogo da biblioteca do Património Cultural e na ficha técnica da obra (informação do responsável). Bibliografia revista (v0.2), formato RPA autor–data. Verificações: DOI de Moser & alii (2002) e Tully (2007) conferidos na Crossref; páginas de Thomas (2017, pp. 14–30) e da Introdução de Moshenska (2017, pp. 1–13) conferidas na Crossref/JSTOR; Teichner (2001): O Arqueólogo Português, IV, 19, pp. 187–198 (volume de 2001, editado em 2003, índice do MNA); Pinho & Freitas: 2.ª ed. revista, Jan. 2000 (1.ª ed. 1999); Ripanti (2022) e Brodie & alii (2011) conferidos nos editores.  Os Anexos C e D são documentação primária interna do projecto: identificados como fontes dos resultados nos slides e nas notas, sem serem convertidos em publicações bibliográficas externas.",
  fecho: `Slide de fecho (não cronometrado). QR gerado para ${QR_URL} e validado por leitura automática no gerador; testar também com um telemóvel no ecrã da sala.`,
};

// Bibliografia revista (v0.2) — RPA autor–data: [autores (ano), [[texto, itálico?], …]]
// Títulos de livros e de revistas em itálico; títulos de artigos e capítulos em redondo.
const BIB = [
  ["BRODIE, Ellie; HUGHES, Tim; JOCHUM, Véronique; MILLER, Sarah; OCKENDEN, Nick; WARBURTON, Diane (2011)",
    [["Pathways through participation: what creates and sustains active citizenship? Final report", true], [". London: National Council for Voluntary Organisations; Institute for Volunteering Research; Involve.", false]]],
  ["HAUSCHILD, Theodor; TEICHNER, Felix (2002)",
    [["Milreu: ruínas", true], [". Lisboa: Instituto Português do Património Arquitectónico (Roteiros da Arqueologia Portuguesa, 9).", false]]],
  ["INTERNATIONAL ORGANIZATION FOR STANDARDIZATION (2023)",
    [["Information and documentation: a reference ontology for the interchange of cultural heritage information", true], [". Geneva: ISO. ISO 21127:2023.", false]]],
  ["JÁCOMO, Fernando Rodrigues de (2024)",
    [["Patrimônio e comunidade: Ruínas Romanas de Milreu, Estoi (Faro)", true], [". Faro: Universidade do Algarve, Faculdade de Ciências Humanas e Sociais. Dissertação de mestrado em Arqueologia. Disponível em: http://hdl.handle.net/10400.1/27405.", false]]],
  ["MOSER, Stephanie; GLAZIER, Darren; PHILLIPS, James Edward; EL NEMR, Lamya Nasser; MOUSA, Mohammed Saleh; AIESH, Rascha Nasr; RICHARDSON, Susan; CONNER, Andrew; SEYMOUR, Michael (2002)",
    [["Transforming archaeology through practice: strategies for collaborative archaeology and the Community Archaeology Project at Quseir, Egypt. ", false], ["World Archaeology", true], [". 34:2, pp. 220–248. DOI: 10.1080/0043824022000007071.", false]]],
  ["MOSHENSKA, Gabriel (2017)",
    [["Introduction: public archaeology as practice and scholarship where archaeology meets the world. In MOSHENSKA, Gabriel, ed. – ", false], ["Key concepts in public archaeology", true], [". London: UCL Press, pp. 1–13. DOI: 10.2307/j.ctt1vxm8r7.5.", false]]],
  ["PINHO, Elsa Garrett; FREITAS, Inês da Cunha (2000)",
    [["Normas gerais: artes plásticas e artes decorativas", true], [". 2.ª ed. revista. Lisboa: Instituto Português de Museus (Normas de Inventário).", false]]],
  ["RAPOSO, Luís; MARTINS, Adolfo Silveira; CORREIA, Virgílio (2000)",
    [["Arqueologia: normas gerais", true], [". Lisboa: Instituto Português de Museus (Normas de Inventário).", false]]],
  ["RIPANTI, Francesco (2022)",
    [["Unforgettable encounters: understanding participation in Italian community archaeology", true], [". Oxford: Archaeopress (Access Archaeology).", false]]],
  ["TEICHNER, Felix (1997)",
    [["Die römischen Villen von Milreu (Algarve/Portugal): ein Beitrag zur Romanisierung der südlichen Provinz Lusitania. ", false], ["Madrider Mitteilungen", true], [". 38, pp. 106–162.", false]]],
  ["TEICHNER, Felix (2001)",
    [["Uma nova interpretação da área 21, a partir da planta elaborada por Sebastião Philippes Martins Estácio da Veiga, sobre a villa romana de Milreu (Estoi, Algarve): notícia preliminar. ", false], ["O Arqueólogo Português", true], [". Lisboa. Série IV, 19, pp. 187–198.", false]]],
  ["THOMAS, Suzie (2017)",
    [["Community archaeology. In MOSHENSKA, Gabriel, ed. – ", false], ["Key concepts in public archaeology", true], [". London: UCL Press, pp. 14–30. DOI: 10.2307/j.ctt1vxm8r7.6.", false]]],
  ["TULLY, Gemma (2007)",
    [["Community archaeology: general methods and standards of practice. ", false], ["Public Archaeology", true], [". 6:3, pp. 155–187. DOI: 10.1179/175355307X243645.", false]]],
];

async function main() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.title = "O processo de construção do Museu de Memórias de Milreu — III ENEP 2026";
  pres.author = "Fernando Rodrigues de Jácomo";
  pres.company = "Projecto Comunitário de Milreu";
  pres.subject = "Item 18 — derivação do template, v0.6 (slide de enquadramento: Milreu e o Projecto)";
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  const C = pres.SchemeColor;
  defineLayouts(pres);
  const HF = THEME.headFontFace;
  let s;

  // ---- Capa ----
  pres.addSection({ title: "Abertura" });
  s = pres.addSlide({ masterName: "MIL_CAPA", sectionTitle: "Abertura" });
  s.addText([{ text: "O processo de construção do Museu de Memórias de Milreu: catalogação, participação comunitária e o papel do arqueólogo na manutenção da memória", options: { fontSize: 25 } }], { placeholder: "title" });
  s.addText("O arqueólogo e a manutenção da memória", { placeholder: "subtitulo" });
  s.addText("Fernando Rodrigues de Jácomo · III ENEP · Faro · 5-11-2026", { placeholder: "meta" });
  s.addImage({ placeholder: "imagem", path: img("s0_MM202614.jpg"), w: W - 6.9, h: 5.45, altText: mm("MM202614").title["pt-PT"] });
  s.addText("MM202614 · " + mm("MM202614").title["pt-PT"] + " (" + mm("MM202614").dateDisplay["pt-PT"] + "). " + credit("s0_MM202614.jpg"), { placeholder: "credito" });
  s.addNotes(NOTES.capa);

  // ---- 1 Introdução ----
  pres.addSection({ title: "Comunicação" });
  // ---- 0 Enquadramento: Milreu e o Projecto ----
  s = pres.addSlide({ masterName: "MIL_TITULO", sectionTitle: "Comunicação" });
  s.addText("ENQUADRAMENTO", { placeholder: "eyebrow" });
  s.addText("Milreu e o Projecto Comunitário de Milreu", { placeholder: "title" });
  {
    const lw = 5.9, rx0 = M + lw + 0.33, rw0 = W - M - rx0, r8 = mm("MM202608");
    s.addImage({ path: img("s0b_MM202608.jpg"), x: M, y: 1.7, w: lw, h: 2.15, altText: r8.title["pt-PT"] });
    cap(s, "MM202608 · " + r8.title["pt-PT"] + ". " + credit("s0b_MM202608.jpg"), M, 3.9, lw, 0.3);
    s.addText("RUÍNAS ROMANAS DE MILREU", { x: M, y: 4.3, w: lw, h: 0.28, margin: 0, fontFace: LABEL, fontSize: 11, bold: true, color: T.red700, charSpacing: 1.5, isTextBox: true });
    s.addText([
      { text: "Villa", options: { bold: true, italic: true } },
      { text: " romana em Estoi (Faro): ", options: { bold: true } },
      { text: "pars urbana", options: { italic: true } },
      { text: ", " },
      { text: "pars rustica", options: { italic: true } },
      { text: " e edifício religioso", options: { breakLine: true } },
      { text: "Ocupação romana, paleocristã e islâmica; casa rural sobre as ruínas, habitada até meados do século XX", options: { breakLine: true } },
      { text: "Monumento Nacional, sob tutela do Património Cultural, I.P." },
    ], { x: M, y: 4.65, w: lw, h: 1.75, margin: 0, fontSize: 14, color: C.text1, valign: "top", paraSpaceAfter: 6, isTextBox: true });
    s.addShape("rect", { x: rx0, y: 1.7, w: rw0, h: 4.75, fill: { color: T.paper100 }, line: { color: T.paper100 }, objectName: "projecto" });
    const px = rx0 + 0.35, pw = rw0 - 0.7;
    s.addText("PROJECTO COMUNITÁRIO DE MILREU", { x: px, y: 2.0, w: pw, h: 0.28, margin: 0, fontFace: LABEL, fontSize: 11, bold: true, color: T.red700, charSpacing: 1.5, isTextBox: true });
    s.addText("Programa plurianual de Arqueologia Pública e Comunitária associado às Ruínas Romanas de Milreu", { x: px, y: 2.35, w: pw, h: 1.05, margin: 0, fontFace: HF, fontSize: 20, color: C.text1, valign: "top", isTextBox: true });
    s.addText("INICIATIVAS", { x: px, y: 3.6, w: pw, h: 0.25, margin: 0, fontFace: LABEL, fontSize: 9.5, bold: true, color: T.ink600, charSpacing: 1.5, isTextBox: true });
    s.addText([
      { text: "Museu de Memórias", options: { bullet: true, bold: true, breakLine: true } },
      { text: "Exposição itinerante «Entre Ruínas e Memórias»", options: { bullet: true, breakLine: true } },
      { text: "Circuito Educativo", options: { bullet: true } },
    ], { x: px, y: 3.9, w: pw, h: 1.25, margin: 0, fontSize: 14, color: C.text1, valign: "top", paraSpaceAfter: 4, isTextBox: true });
    s.addText("PILARES", { x: px, y: 5.3, w: pw, h: 0.25, margin: 0, fontFace: LABEL, fontSize: 9.5, bold: true, color: T.ink600, charSpacing: 1.5, isTextBox: true });
    s.addText("Comunicação · Mutualidade · Pertinência Social e Política", { x: px, y: 5.6, w: pw, h: 0.6, margin: 0, fontSize: 14, color: C.text1, valign: "top", isTextBox: true });
  }
  refs(s, "Hauschild & Teichner, 2002.");
  s.addNotes(NOTES.milreu);

  s = pres.addSlide({ masterName: "MIL_TEXTO_IMAGEM", sectionTitle: "Comunicação" });
  s.addText("INTRODUÇÃO", { placeholder: "eyebrow" });
  s.addText("O arqueólogo e a manutenção da memória", { placeholder: "title" });
  s.addText([
    { text: "Conservar o património arqueológico não se limita necessariamente à preservação da sua materialidade.", options: { breakLine: true } },
    { text: "A Arqueologia Pública e Comunitária tem procurado ampliar a participação das populações na produção e interpretação do conhecimento sobre o passado.", options: { breakLine: true } },
    { text: " ", options: { breakLine: true, fontSize: 8 } },
    { text: "Qual deve ser a responsabilidade do arqueólogo na salvaguarda das memórias das pessoas que fizeram parte da história de um sítio arqueológico?", options: { fontFace: HF, italic: true, fontSize: 21, color: T.red700 } },
  ], { placeholder: "texto" });
  s.addImage({ placeholder: "imagem", path: img("s1_MM202602.jpg"), w: 5.6, h: 4.6, altText: mm("MM202602").title["pt-PT"] });
  s.addText("MM202602 · " + mm("MM202602").title["pt-PT"] + ". " + credit("s1_MM202602.jpg"), { placeholder: "credito" });
  refs(s, "Moser & alii, 2002; Tully, 2007.", { w: 6.0 });
  s.addNotes(NOTES.s1);

  // ---- 2 Contextualização ----
  s = pres.addSlide({ masterName: "MIL_TITULO", sectionTitle: "Comunicação" });
  s.addText("CONTEXTUALIZAÇÃO", { placeholder: "eyebrow" });
  s.addText("Milreu: entre o património arqueológico e a memória social", { placeholder: "title" });
  const colW = 3.7, gap = (CW - 3 * colW) / 2, iy = 1.7, ih = 2.0;
  const cols = [
    ["s2_MM202606.jpg", "SÉCULO XIX", "Estácio da Veiga e as primeiras escavações",
      "MM202606 · " + mm("MM202606").title["pt-PT"] + " (" + mm("MM202606").dateDisplay["pt-PT"] + "), posterior aos trabalhos de Estácio da Veiga (década de 1870). " + credit("s2_MM202606.jpg")],
    ["s2_MM202616.jpg", "SEGUNDA METADE DO SÉCULO XX", "Instituto Arqueológico Alemão · direcção de Theodor Hauschild",
      "MM202616 · " + mm("MM202616").title["pt-PT"] + " (" + mm("MM202616").dateDisplay["pt-PT"] + "). " + credit("s2_MM202616.jpg")],
    ["s2_debate.jpg", "ACTUALMENTE", "Diagnóstico de 2024 e rodas de conversa com a comunidade",
      "Roda de conversas «Milreu: Passado, Comunidade e Futuro» · Ruínas de Milreu · 07-02-2026. " + credit("s2_debate.jpg")],
  ];
  cols.forEach(([f, when, what, caption], i) => {
    const x = M + i * (colW + gap);
    s.addImage({ path: img(f), x, y: iy, w: colW, h: ih, altText: caption.split(". ")[0] });
    cap(s, caption, x, iy + ih + 0.06, colW, 0.5);
    s.addText(when, { x, y: 4.36, w: colW, h: 0.28, margin: 0, fontFace: LABEL, fontSize: 11, bold: true, color: T.red700, charSpacing: 1.5, isTextBox: true });
    s.addText(what, { x, y: 4.64, w: colW, h: 0.62, margin: 0, fontFace: HF, fontSize: 17, color: C.text1, valign: "top", isTextBox: true });
  });
  {
    const x = M + 2 * (colW + gap);
    s.addText("Inquérito (532 respostas) e 9 entrevistas", { x, y: 5.3, w: colW, h: 0.25, margin: 0, fontFace: LABEL, fontSize: 10, color: T.ink600, isTextBox: true });
    chip(s, "HIPÓTESE", x, 5.62, T.stone700, 1.1);
    s.addText("Musealização e distanciamento: relação causal não demonstrada", { x: x + 1.2, y: 5.58, w: colW - 1.2, h: 0.4, margin: 0, fontFace: LABEL, fontSize: 9.5, color: T.ink700, valign: "top", isTextBox: true });
  }
  s.addText("Como integrar estas memórias pessoais no conhecimento patrimonial sobre Milreu?", { x: M, y: 6.08, w: CW, h: 0.42, margin: 0, fontFace: HF, italic: true, fontSize: 19, color: T.red700, isTextBox: true });
  refs(s, "Teichner, 1997; Teichner, 2001; Hauschild & Teichner, 2002; Jácomo, 2024.");
  s.addNotes(NOTES.s2);

  // ---- 3 Objectivos e enquadramento ----
  s = pres.addSlide({ masterName: "MIL_TITULO", sectionTitle: "Comunicação" });
  s.addText("OBJECTIVOS E ENQUADRAMENTO", { placeholder: "eyebrow" });
  s.addText("Do diagnóstico à construção do Museu de Memórias", { placeholder: "title" });
  const flow = [["2024", "Diagnóstico"], ["PROJECTO", "Projecto Comunitário de Milreu"], ["UMA DAS INICIATIVAS", "Museu de Memórias"]];
  const fw = 3.55, fg = (CW - 3 * fw) / 2;
  flow.forEach(([k, v], i) => {
    const x = M + i * (fw + fg), last = i === 2;
    s.addShape("rect", { x, y: 1.8, w: fw, h: 1.15, fill: { color: last ? T.ink950 : T.paper100 }, line: { color: last ? T.ink950 : T.paper100 } });
    s.addText(k, { x: x + 0.25, y: 1.95, w: fw - 0.5, h: 0.25, margin: 0, fontFace: LABEL, fontSize: 9, bold: true, color: last ? T.red300 : T.red700, charSpacing: 1.5, isTextBox: true });
    s.addText(v, { x: x + 0.25, y: 2.22, w: fw - 0.5, h: 0.65, margin: 0, fontFace: HF, fontSize: 18, color: last ? T.paper0 : T.ink950, valign: "top", isTextBox: true });
    if (i < 2) s.addText("→", { x: x + fw, y: 1.8, w: fg, h: 1.15, margin: 0, fontFace: LABEL, fontSize: 22, color: T.ink500, align: "center", valign: "middle", isTextBox: true });
  });
  s.addText([
    { text: "Recolha de fotografias, testemunhos e informação histórica", options: { bullet: true, breakLine: true } },
    { text: "Documentação científica + curadoria participativa", options: { bullet: true } },
  ], { x: M, y: 3.3, w: 5.9, h: 1.0, margin: 0, fontSize: 15, color: C.text1, valign: "top", paraSpaceAfter: 6, isTextBox: true });
  s.addShape("rect", { x: M, y: 4.4, w: 5.9, h: 1.95, fill: { color: T.paper100 }, line: { color: T.paper100 }, objectName: "quseir" });
  s.addText("REFERÊNCIA METODOLÓGICA · QUSEIR (EGIPTO)", { x: M + 0.3, y: 4.55, w: 5.3, h: 0.25, margin: 0, fontFace: LABEL, fontSize: 9, bold: true, color: T.ink600, charSpacing: 1.5, isTextBox: true });
  s.addText("Arquivos fotográficos · história oral · colaboração comunitária", { x: M + 0.3, y: 4.85, w: 5.3, h: 0.62, margin: 0, fontFace: HF, fontSize: 16, valign: "top", color: C.text1, isTextBox: true });
  s.addText("Uma referência metodológica — não um modelo reproduzido integralmente em Milreu.", { x: M + 0.3, y: 5.55, w: 5.3, h: 0.7, margin: 0, fontSize: 14, color: C.text2, valign: "top", isTextBox: true });
  s.addText("EXEMPLOS DO ACERVO · 2 DE 31 FOTOGRAFIAS", { x: 7.33, y: 3.3, w: 5.4, h: 0.25, margin: 0, fontFace: LABEL, fontSize: 9, bold: true, color: T.ink600, charSpacing: 1.2, isTextBox: true });
  [["s3_MM202615.jpg", "MM202615"], ["s3_MM202621.jpg", "MM202621"]].forEach(([f, id], i) => {
    const sz = 2.15, x = 7.33 + i * (sz + 0.6);
    s.addImage({ path: img(f), x, y: 3.62, w: sz, h: sz, altText: mm(id).title["pt-PT"] });
    cap(s, id + " · " + mm(id).title["pt-PT"] + ". " + credit(f), x, 3.62 + sz + 0.06, sz, 0.62);
  });
  refs(s, "Jácomo, 2024; Moser & alii, 2002; Tully, 2007.");
  s.addNotes(NOTES.s3);

  // ---- 4 Curadoria participativa ----
  s = pres.addSlide({ masterName: "MIL_TITULO", sectionTitle: "Comunicação" });
  s.addText("PARTICIPAÇÃO COMUNITÁRIA", { placeholder: "eyebrow" });
  s.addText("Curadoria participativa: quem escolhe a memória?", { placeholder: "title" });
  [["31", "fotografias recolhidas e organizadas"], ["19", "membros no grupo de voluntários (até Junho de 2026)"], ["6–7", "participantes, em média, por etapa de consulta"]].forEach(([n, l], i) => {
    const y = 1.8 + i * 0.95;
    s.addText(n, { x: M, y, w: 1.7, h: 0.85, margin: 0, fontFace: HF, fontSize: 48, color: T.red700, valign: "middle", isTextBox: true });
    s.addText(l, { x: M + 1.6, y, w: 4.4, h: 0.85, margin: 0, fontFace: LABEL, fontSize: 14, bold: true, color: C.text1, valign: "middle", isTextBox: true });
  });
  s.addText([
    { text: "Inscrição num grupo ≠ participação activa e continuada", options: { bullet: true, breakLine: true } },
    { text: "Limites da coprodução: estrutura do processo, critérios técnicos e inventário sob responsabilidade do investigador", options: { bullet: true } },
  ], { x: M, y: 4.8, w: 6.0, h: 1.55, margin: 0, fontSize: 15, color: C.text1, valign: "top", paraSpaceAfter: 6, isTextBox: true });
  s.addImage({ path: img("s4_roda-01.jpg"), x: 7.13, y: 1.8, w: 5.6, h: 4.6, altText: "Roda de conversas, Junta de Freguesia de Estoi, 11-04-2026" });
  cap(s, "Roda de conversas · Junta de Freguesia de Estoi · 11-04-2026. " + credit("s4_roda-01.jpg"), 7.13, 6.45, 5.6, 0.4);
  refs(s, "Brodie & alii, 2011; Thomas, 2017 · Dados: registos de curadoria do Projecto Comunitário de Milreu (2026).", { w: 6.0 });
  s.addNotes(NOTES.s4);

  // ---- 5 Catalogação ----
  s = pres.addSlide({ masterName: "MIL_TITULO", sectionTitle: "Comunicação" });
  s.addText("CATALOGAÇÃO · METODOLOGIA", { placeholder: "eyebrow" });
  s.addText("Da fotografia à documentação patrimonial", { placeholder: "title" });
  const ref3 = [
    [PiArchive, "Inventário museológico", "Fichas inspiradas nas Normas: identificação, descrição, proveniência", "Normas de Inventário · adaptação"],
    [PiGraph, "CIDOC CRM", "Referencial conceptual: relações entre pessoas, objectos e acontecimentos", "ISO 21127:2023"],
    [PiMicrophone, "Testemunhos orais", "Memória comunitária identificada, contextualizada e confrontada", "Arqueologia Comunitária"],
  ];
  for (let i = 0; i < 3; i++) {
    const [Ic, t, d, k] = ref3[i];
    const x = M + i * 4.13, cw = 3.87, y = 1.8;
    s.addShape("rect", { x, y, w: cw, h: 3.45, fill: { color: T.paper100 }, line: { color: T.paper100 }, objectName: "referencial-" + (i + 1) });
    s.addShape("ellipse", { x: x + 0.35, y: y + 0.35, w: 0.8, h: 0.8, fill: { color: C.accent1 }, line: { color: T.red500 } });
    s.addImage({ data: await iconPng(Ic, T.paper0), x: x + 0.51, y: y + 0.51, w: 0.48, h: 0.48, altText: "Ícone " + t });
    s.addText(t, { x: x + 0.35, y: y + 1.25, w: cw - 0.7, h: 0.75, margin: 0, fontFace: HF, fontSize: 22, color: C.text1, valign: "bottom", isTextBox: true });
    s.addText(d, { x: x + 0.35, y: y + 2.08, w: cw - 0.7, h: 0.95, margin: 0, fontSize: 14, color: C.text2, valign: "top", isTextBox: true });
    s.addText(k, { x: x + 0.35, y: y + 3.08, w: cw - 0.7, h: 0.3, margin: 0, fontFace: LABEL, fontSize: 9.5, bold: true, color: T.ink600, charSpacing: 1, isTextBox: true });
  }
  s.addText("Categorias editoriais:", { x: M, y: 5.62, w: 2.6, h: 0.4, margin: 0, fontFace: LABEL, fontSize: 12, bold: true, color: C.text1, valign: "middle", isTextBox: true });
  [["Informação documentada", 2.6], ["Hipótese interpretativa", 2.6], ["Por confirmar", 1.9]].reduce((x, [t, w]) => {
    s.addShape("roundRect", { x, y: 5.62, w, h: 0.4, rectRadius: 0.1, fill: { color: T.paper50 }, line: { color: T.ink300, width: 1 } });
    s.addText(t, { x, y: 5.62, w, h: 0.4, margin: 0, fontFace: LABEL, fontSize: 11, color: T.ink700, align: "center", valign: "middle", isTextBox: true });
    return x + w + 0.25;
  }, M + 2.7);
  refs(s, "Pinho & Freitas, 2000; Raposo, Martins & Correia, 2000; ISO 21127:2023; Moser & alii, 2002; Tully, 2007.");
  s.addNotes(NOTES.s5);

  // ---- 6 Estudo de caso MM202613 ----
  s = pres.addSlide({ masterName: "MIL_TITULO", sectionTitle: "Comunicação" });
  const r13 = mm("MM202613");
  s.addText("ESTUDO DE CASO · MM202613", { placeholder: "eyebrow" });
  s.addText("O cruzamento entre memória e evidência", { placeholder: "title" });
  const [pw, ph] = IMGS["s6_MM202613.jpg"].dimensoes.split("x").map(Number);
  const iw6 = 6.6, ih6 = iw6 * ph / pw;
  s.addImage({ path: img("s6_MM202613.jpg"), x: M, y: 1.8, w: iw6, h: ih6, altText: r13.title["pt-PT"] });
  cap(s, "MM202613 · " + r13.title["pt-PT"] + ". " + r13.credit["pt-PT"], M, 1.8 + ih6 + 0.06, iw6, 0.4);
  const rx = 7.6, rw = W - M - rx;
  s.addText("CAMADAS DE DOCUMENTAÇÃO", { x: rx, y: 1.8, w: rw, h: 0.25, margin: 0, fontFace: LABEL, fontSize: 9.5, bold: true, color: T.ink600, charSpacing: 1.5, isTextBox: true });
  s.addText(["Observação material", "Proveniência familiar", "Identificações por interlocutores locais", "Digitalização", "Hipóteses de cronologia e contexto espacial"]
    .map((t, i, a) => ({ text: t, options: { bullet: true, breakLine: i < a.length - 1 } })),
    { x: rx, y: 2.12, w: rw, h: 1.85, margin: 0, fontSize: 14, color: C.text1, valign: "top", paraSpaceAfter: 3, isTextBox: true });
  s.addText("NA FICHA DE INVENTÁRIO · CERTEZA DE CADA AFIRMAÇÃO", { x: rx, y: 4.1, w: rw, h: 0.25, margin: 0, fontFace: LABEL, fontSize: 9.5, bold: true, color: T.ink600, charSpacing: 1.5, isTextBox: true });
  [["CERTO", "Suporte: prova a preto e branco, 12,5 × 17,5 cm", 4.45],
   ["PROVÁVEL", "Proveniência: colecção fotográfica ligada a D. Noémia Cruz, facultada por Celeste e Branca Pimenta; associada à colecção de Maria de Lurdes Mendes Martins", 4.88],
   ["POSSÍVEL", "Datação: ca. década de 1970", 5.62]].forEach(([k, t, y]) => {
    s.addShape("roundRect", { x: rx, y, w: 1.15, h: 0.32, rectRadius: 0.08, fill: { color: T.paper50 }, line: { color: T.ink500, width: 1 } });
    s.addText(k, { x: rx, y, w: 1.15, h: 0.32, margin: 0, fontFace: LABEL, fontSize: 8.5, bold: true, color: T.ink700, align: "center", valign: "middle", charSpacing: 1, isTextBox: true });
    s.addText(t, { x: rx + 1.3, y: y - 0.04, w: rw - 1.3, h: k === "PROVÁVEL" ? 0.7 : 0.4, margin: 0, fontFace: LABEL, fontSize: 10.5, color: T.ink700, valign: "top", isTextBox: true });
  });
  s.addText("Hipóteses interpretativas: campo próprio da ficha, separado do grau de certeza, a confirmar.", { x: rx, y: 6.05, w: rw, h: 0.4, margin: 0, fontFace: LABEL, fontSize: 9.5, italic: true, color: T.ink600, valign: "top", isTextBox: true });
  refs(s, "Moser & alii, 2002; ISO 21127:2023 · Fonte: inventário do Museu de Memórias (Projecto Comunitário de Milreu, em preparação), ficha MM202613.");
  s.addNotes(NOTES.s6);

  // ---- 7 Exposição ----
  s = pres.addSlide({ masterName: "MIL_TITULO", sectionTitle: "Comunicação" });
  s.addText("APLICAÇÃO E DEVOLUÇÃO À COMUNIDADE", { placeholder: "eyebrow" });
  s.addText("Da documentação à exposição «Entre Ruínas e Memórias»", { placeholder: "title" });
  ["s7_exposicao-01.jpg", "s7_exposicao-02.jpg", "s7_exposicao-03.jpg"].forEach((f, i) => {
    s.addImage({ path: img(f), x: M + i * 4.13, y: 1.8, w: 3.87, h: 2.9, altText: "Exposição «Entre Ruínas e Memórias», 10-10-2026" });
  });
  cap(s, "Montagem experimental · Museu do Traje, São Brás de Alportel · 10-10-2026. " + credit("s7_exposicao-01.jpg"), M, 4.76, CW, 0.28);
  s.addText([
    { text: "Exposição itinerante + componente digital (projectomilreu.pt)", options: { bullet: true, breakLine: true } },
    { text: "Tentativa de devolver à população fotografias, testemunhos e interpretação patrimonial", options: { bullet: true } },
  ], { x: M, y: 5.2, w: 7.4, h: 1.2, margin: 0, fontSize: 15, color: C.text1, valign: "top", paraSpaceAfter: 6, isTextBox: true });
  s.addShape("rect", { x: 8.4, y: 5.2, w: W - M - 8.4, h: 1.15, fill: { color: T.paper100 }, line: { color: T.paper100 } });
  s.addText([
    { text: "RESULTADO OPERACIONAL", options: { fontFace: LABEL, fontSize: 9.5, bold: true, color: T.ink600, charSpacing: 1.5, breakLine: true, paraSpaceAfter: 4 } },
    { text: "Ainda não demonstra impacto duradouro na relação com o sítio.", options: { fontSize: 14, color: T.ink950 } },
  ], { x: 8.65, y: 5.32, w: W - M - 8.9, h: 0.95, margin: 0, valign: "top", isTextBox: true });
  refs(s, "Moser & alii, 2002; Projecto Comunitário de Milreu, 2026 · Dados: inventário e registos de curadoria do projecto; montagem de 10-10-2026.");
  s.addNotes(NOTES.s7);

  // ---- 8 Discussão ----
  s = pres.addSlide({ masterName: "MIL_TEXTO_IMAGEM", sectionTitle: "Comunicação" });
  s.addText("DISCUSSÃO E CONCLUSÃO", { placeholder: "eyebrow" });
  s.addText("Qual é o papel do arqueólogo na manutenção da memória?", { placeholder: "title" });
  s.addText([
    { text: "A participação ajuda a recolher, contextualizar e interpretar memórias.", options: { bullet: true, breakLine: true } },
    { text: "Mas participar não é coproduzir: há limites e diferenças de autoridade.", options: { bullet: true, breakLine: true } },
    { text: "Os resultados são ainda preliminares.", options: { bullet: true, breakLine: true } },
    { text: " ", options: { breakLine: true, fontSize: 8 } },
    { text: "Conservar o património material — e documentar criticamente as memórias da sua história social.", options: { fontFace: HF, italic: true, fontSize: 21, color: T.red700 } },
  ], { placeholder: "texto" });
  s.addImage({ placeholder: "imagem", path: img("s8_MM202624.jpg"), w: 5.6, h: 4.6, altText: mm("MM202624").title["pt-PT"] });
  s.addText("MM202624 · " + mm("MM202624").title["pt-PT"] + " (" + mm("MM202624").dateDisplay["pt-PT"] + "). " + credit("s8_MM202624.jpg"), { placeholder: "credito" });
  refs(s, "Thomas, 2017; Moshenska, 2017; Ripanti, 2022.", { w: 6.0 });
  s.addNotes(NOTES.s8);

  // ---- Bibliografia ----
  pres.addSection({ title: "Encerramento" });
  // duas páginas de bibliografia (consulta, não narradas), tipografia legível em sala
  const bibPages = [BIB.slice(0, 7), BIB.slice(7)];
  bibPages.forEach((list, p) => {
    s = pres.addSlide({ masterName: "MIL_TITULO", sectionTitle: "Encerramento" });
    s.addText("REFERÊNCIAS · " + (p + 1) + "/2", { placeholder: "eyebrow" });
    s.addText("Bibliografia", { placeholder: "title" });
    const half = Math.ceil(list.length / 2);
    [list.slice(0, half), list.slice(half)].forEach((col, c) => {
      s.addText(col.flatMap(([a, parts], i) => [
        { text: a, options: { bold: true, fontFace: LABEL, fontSize: 9.5, color: T.ink950, breakLine: true, ...(i > 0 ? { paraSpaceBefore: 10 } : {}) } },
        ...parts.map(([t, it], j) => ({ text: t, options: { italic: it, fontSize: 12, color: T.ink700, ...(j === parts.length - 1 ? { breakLine: i < col.length - 1 } : {}) } })),
      ]), { x: M + c * 6.2, y: 1.65, w: 5.93, h: p === 1 ? 4.35 : 5.0, margin: 0, valign: "top", isTextBox: true, objectName: "bibliografia-" + (p + 1) + "-" + (c + 1) });
    });
    if (p === 1) {
      s.addShape("rect", { x: M, y: 6.15, w: CW, h: 0.7, fill: { color: T.paper100 }, line: { color: T.paper100 }, objectName: "dados-primarios" });
      s.addText([
        { text: "DADOS PRIMÁRIOS DA INVESTIGAÇÃO — EM PREPARAÇÃO", options: { bold: true, fontSize: 8.5, color: T.ink600, charSpacing: 1.2, breakLine: true } },
        { text: "Projecto Comunitário de Milreu (2026) — Inventário do Museu de Memórias e registos de curadoria. Documentação inédita.", options: { fontSize: 10.5, color: T.ink700 } },
      ], { x: M + 0.2, y: 6.2, w: CW - 0.4, h: 0.6, margin: 0, fontFace: LABEL, valign: "middle", isTextBox: true });
    }
    s.addNotes(NOTES.bib);
  });

  // ---- Fecho ----
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
