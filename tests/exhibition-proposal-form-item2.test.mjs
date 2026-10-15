/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Item 2 — «Quero expor» (incidente 2026-10-15): obrigatórios assinalados, datas com calendário ≥ hoje
 * (Lisboa), nunca sucesso quando a proposta não chega, alternativa por e-mail sem perder o texto.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { todayLisbon, validateProposalDates, composeProposalDates, proposalPlainText, proposalMailto, isDeliveryFailure, PROPOSAL_FIELDS, PROPOSAL_SUBJECT, MAILTO_SAFE_LENGTH } from "../src/lib/exhibition-proposal.js";
import { exhibitionProposalView } from "../src/views/expor.js";

test("hoje é o dia de Lisboa (não o UTC nem o do dispositivo)", () => {
  assert.equal(todayLisbon(Date.parse("2026-10-14T23:30:00Z")), "2026-10-15"); // 00:30 em Lisboa (UTC+1)
  assert.equal(todayLisbon(Date.parse("2026-12-31T23:30:00Z")), "2026-12-31"); // inverno: UTC+0
});

test("datas: início ≥ hoje, fim ≥ início, só datas reais, vazio permitido", () => {
  const today = "2026-10-15";
  assert.equal(validateProposalDates("", "", today).ok, true);
  assert.equal(validateProposalDates("2026-10-15", "", today).ok, true);
  assert.equal(validateProposalDates("2026-10-20", "2026-11-05", today).ok, true);
  assert.match(validateProposalDates("2026-10-14", "", today).message, /anterior a hoje/);
  assert.match(validateProposalDates("2026-10-20", "2026-10-19", today).message, /fim não pode ser anterior/);
  assert.match(validateProposalDates("", "2026-11-01", today).message, /data de início/);
  assert.equal(validateProposalDates("2026-02-31", "", today).ok, false);
  assert.equal(validateProposalDates("amanhã", "", today).ok, false);
});

test("composição do campo dates (contrato da função inalterado)", () => {
  assert.equal(composeProposalDates("", ""), "");
  assert.equal(composeProposalDates("2026-11-10", ""), "a partir de 10/11/2026");
  assert.equal(composeProposalDates("2026-11-10", "2026-11-10"), "a partir de 10/11/2026");
  assert.equal(composeProposalDates("2026-11-10", "2026-11-20"), "10/11/2026 a 20/11/2026");
});

test("só falhas de entrega abrem a alternativa (não erros de validação)", () => {
  for (const code of ["network", "edge_function_not_configured", "email_send_failed", "http_502", "http_503"]) assert.equal(isDeliveryFailure(code), true, code);
  for (const code of ["invalid_payload", "invalid_dates", "payload_too_long", "origin_not_allowed", "http_422", ""]) assert.equal(isDeliveryFailure(code), false, code);
});

// Dados fictícios com os 12 campos preenchidos (acentos, aspas angulares, símbolos e várias linhas).
const FULL = {
  name: "Maria João Antunes", email: "maria.joao@example.org", phone: "+351 912 345 678", organisation: "Associação «Amigos de Estoi»",
  spaceType: "associacao", venue: "Salão Nobre da Junta", locality: "Estoi", dateFrom: "2027-05-10", dateTo: "2027-05-20",
  message: "Linha 1 — acentos: ç ã é ô ü\nLinha 2 & símbolos: <b>%</b> # € 100%\n\nLinha 4 depois de linha vazia.",
  needs: "Rampa de acesso\nTomada eléctrica", privacyAccepted: "on", language: "pt-PT",
};

test("os 12 campos do contrato aparecem identificados no texto", () => {
  assert.equal(PROPOSAL_FIELDS.length, 12);
  assert.deepEqual(PROPOSAL_FIELDS.map(([key]) => key), ["name", "email", "phone", "organisation", "spaceType", "venue", "locality", "dates", "message", "needs", "privacyAccepted", "language"]);
  const text = proposalPlainText(FULL);
  for (const label of ["Nome: Maria João Antunes", "E-mail: maria.joao@example.org", "Telefone: +351 912 345 678", "Organização ou coletivo: Associação «Amigos de Estoi»",
    "Tipo de espaço: Associação ou coletivo", "Nome do espaço ou local: Salão Nobre da Junta", "Localidade: Estoi", "Datas pretendidas: 10/05/2027 a 20/05/2027",
    "Descrição da proposta:\nLinha 1 — acentos: ç ã é ô ü\nLinha 2 & símbolos: <b>%</b> # € 100%\n\nLinha 4", "Condições, dimensões ou necessidades:\nRampa de acesso\nTomada eléctrica",
    "Informação de privacidade: lida e aceite", "Idioma do formulário: Português (pt-PT)"]) assert.ok(text.includes(label), label);
});

test("opcionais vazios ficam assinalados (nada parece perdido); opcionais preenchidos nunca são omitidos", () => {
  const minimal = { name: "Ana", email: "ana@example.org", message: "Proposta com o mínimo de campos.", privacyAccepted: true };
  const text = proposalPlainText(minimal, { language: "en" });
  for (const label of ["Telefone: (não indicado)", "Organização ou coletivo: (não indicado)", "Tipo de espaço: (não indicado)", "Datas pretendidas: (não indicadas)", "Idioma do formulário: Inglês (en)"]) assert.ok(text.includes(label), label);
  assert.match(proposalPlainText({ ...minimal, phone: "123456" }), /Telefone: 123456/);
  assert.match(proposalPlainText({ ...minimal, privacyAccepted: false }), /privacidade: não aceite/);
  assert.match(proposalPlainText({ ...minimal, dates: "a partir de 01/12/2026" }), /Datas pretendidas: a partir de 01\/12\/2026/);
});

test("mailto: assunto identificável, contacto validado, CRLF, acentos e símbolos preservados", () => {
  const { href, complete } = proposalMailto("a78190@ualg.pt", FULL);
  assert.equal(complete, true);
  assert.ok(href.length <= MAILTO_SAFE_LENGTH);
  assert.match(href, /^mailto:a78190@ualg\.pt\?subject=/);
  const subject = decodeURIComponent(href.match(/subject=([^&]+)/)[1]);
  assert.equal(subject, `${PROPOSAL_SUBJECT} (Maria João Antunes)`);
  const body = decodeURIComponent(href.match(/body=(.+)$/)[1]);
  assert.ok(body.includes("\r\nNome: Maria João Antunes\r\n"), "CRLF");
  assert.equal(body.replace(/\r\n/g, "\n"), proposalPlainText(FULL), "o e-mail tem exactamente o texto de «Copiar proposta»");
  for (const bad of ["x@y.pt?cc=z@w.pt", "x@y.pt&bcc=z@w.pt", "", "não é e-mail"]) assert.equal(proposalMailto(bad, FULL).href, "", bad);
});

test("descrição longa: mailto com resumo (sem cortar a meio) e indicação para colar o texto copiado", () => {
  const long = { ...FULL, message: "Descrição longa com acentos ção ã é. ".repeat(140) };
  const { href, complete } = proposalMailto("a78190@ualg.pt", long);
  assert.equal(complete, false);
  assert.ok(href.length <= MAILTO_SAFE_LENGTH, `resumo com ${href.length}`);
  const body = decodeURIComponent(href.match(/body=(.+)$/)[1]);
  assert.match(body, /demasiado longa/); assert.match(body, /Copiar proposta/); assert.match(body, /Nome: Maria João Antunes/);
  // O texto para copiar continua íntegro.
  assert.ok(proposalPlainText(long).includes(long.message.trim()));
});

test("vista: obrigatórios assinalados, e-mail obrigatório, calendário com mínimo de hoje, alternativa escondida", () => {
  const html = exhibitionProposalView("pt-PT", null, { contactEmail: "a78190@ualg.pt" });
  assert.match(html, /E-mail <small class="field-required">obrigatório<\/small><input type="email" name="email" required/);
  for (const field of ["Nome", "Descrição da proposta"]) assert.match(html, new RegExp(`${field} <small class="field-required">obrigatório`));
  assert.match(html, new RegExp(`type="date" name="dateFrom" min="${todayLisbon()}"`));
  assert.match(html, /type="date" name="dateTo"/);
  assert.doesNotMatch(html, /name="dates"/);
  assert.match(html, /data-exhibition-proposal-fallback role="alert" hidden/);
  assert.match(html, /data-exhibition-proposal-mailto href="mailto:a78190@ualg\.pt"/);
  assert.match(html, /<h2[^>]*>A proposta não foi enviada<\/h2>/);
  assert.match(html, /Estamos com uma instabilidade no serviço\. Podes enviar a tua proposta por e-mail, clicando abaixo\. Os dados que preencheste serão incluídos na mensagem\./);
  assert.match(html, />Copiar proposta</);
  assert.doesNotMatch(html, /Supabase|Edge Function|endpoint|HTTP/i);
  assert.doesNotMatch(html.match(/data-exhibition-proposal-fallback[\s\S]*?<\/div>\s*<\/div>/)[0], /Obrigad|enviada com sucesso/i);
});

test("vista: rascunho mantido e escapado (sem injecção de HTML)", () => {
  const html = exhibitionProposalView("pt-PT", null, { draft: { name: "\"><script>alert(1)</script>", message: "</textarea><img src=x onerror=alert(1)>", spaceType: "escola", privacyAccepted: true } });
  assert.doesNotMatch(html, /<script>alert|<img src=x/);
  assert.match(html, /value="&quot;&gt;&lt;script&gt;/);
  assert.match(html, /<option value="escola" selected>/);
  assert.match(html, /name="privacyAccepted" required checked/);
});

test("envio: botão desactivado durante o envio (sem duplicados) e sucesso só após resposta ok", () => {
  const main = readFileSync("src/main.js", "utf8");
  assert.match(main, /submit\.disabled=true/);
  assert.match(main, /state\.exhibitionProposalResult=await collaborative\.submitExhibitionProposal\(values\);\s*state\.exhibitionProposalDraft=\{\};/);
  const controller = readFileSync("src/collab/controller.js", "utf8");
  assert.match(controller, /"network"\)/);
  assert.match(controller, /if\(!res\.ok\|\|!data\?\.ok\)\{const code=/);
  // Falha de entrega: sem mensagem técnica; e-mail e cópia gerados dos valores actuais; abrir o correio não é «enviado».
  assert.match(main, /isDeliveryFailure\(error\.code\)&&fallback\)\{[\s\S]*?feedback\(""\)/);
  assert.match(main, /proposalMailto\(link\.dataset\.contact,currentValues\(\)\)/);
  assert.match(main, /proposalPlainText\(currentValues\(\)\)/);
  assert.doesNotMatch(main, /e-mail (foi )?enviado|mensagem enviada/i);
});
