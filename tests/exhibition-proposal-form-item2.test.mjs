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
import { todayLisbon, validateProposalDates, composeProposalDates, proposalPlainText, proposalMailto, isDeliveryFailure } from "../src/lib/exhibition-proposal.js";
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

test("alternativa por e-mail: endereço validado, texto completo, corte seguro", () => {
  const values = { name: "Maria Silva", email: "maria@example.org", spaceType: "biblioteca", dateFrom: "2026-11-10", dateTo: "2026-11-20", message: "Gostaríamos de acolher a exposição." };
  const text = proposalPlainText(values);
  assert.match(text, /Tipo de espaço: Biblioteca/);
  assert.match(text, /Datas pretendidas: 10\/11\/2026 a 20\/11\/2026/);
  const href = proposalMailto("a78190@ualg.pt", values);
  assert.match(href, /^mailto:a78190@ualg\.pt\?subject=/);
  assert.ok(decodeURIComponent(href).includes("Gostaríamos de acolher"));
  assert.equal(proposalMailto("x@y.pt?cc=z@w.pt", values), "", "endereço com parâmetros é recusado");
  assert.equal(proposalMailto("", values), "");
  const long = proposalMailto("a78190@ualg.pt", { ...values, message: "x".repeat(5000) });
  assert.ok(decodeURIComponent(long).includes("Texto cortado"));
});

test("vista: obrigatórios assinalados, e-mail obrigatório, calendário com mínimo de hoje, alternativa escondida", () => {
  const html = exhibitionProposalView("pt-PT", null, { contactEmail: "a78190@ualg.pt" });
  assert.match(html, /E-mail <small class="field-required">obrigatório<\/small><input type="email" name="email" required/);
  for (const field of ["Nome", "Descrição da proposta"]) assert.match(html, new RegExp(`${field} <small class="field-required">obrigatório`));
  assert.match(html, new RegExp(`type="date" name="dateFrom" min="${todayLisbon()}"`));
  assert.match(html, /type="date" name="dateTo"/);
  assert.doesNotMatch(html, /name="dates"/);
  assert.match(html, /data-exhibition-proposal-fallback hidden/);
  assert.match(html, /href="mailto:a78190@ualg\.pt"/);
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
});
