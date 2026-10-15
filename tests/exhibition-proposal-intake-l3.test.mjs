/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Item 2B — L3 «Quero expor»: testes adversariais e de regressão da lógica pura da Edge Function
 * (supabase/functions/exhibition-proposal-intake/lib.ts, importada directamente: Node 22 remove os tipos).
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  MAX_BODY_BYTES, LIMITS, isOriginAllowed, isSafeEmail, parseProposal, readJsonLimited, buildEmail, buildSubject, newReference,
} from "../supabase/functions/exhibition-proposal-intake/lib.ts";

// Payload igual ao que o formulário envia (src/collab/controller.js: opcionais vazios → null).
const valid = () => ({
  action: "submit",
  website: "",
  payload: {
    name: "Maria Silva", email: "maria@example.org", phone: null, organisation: null, spaceType: "biblioteca",
    venue: "Biblioteca Municipal", locality: "Estoi", dates: null, message: "Gostaríamos de acolher a exposição.",
    needs: null, privacyAccepted: true, language: "pt-PT",
  },
});
const withPayload = patch => { const body = valid(); Object.assign(body.payload, patch); return body; };
const req = (body, headers = {}) => new Request("https://fn.example/expor", {
  method: "POST", headers: { "content-type": "application/json", ...headers }, body: typeof body === "string" ? body : JSON.stringify(body),
});

test("regressão: o payload real do formulário continua aceite", () => {
  const r = parseProposal(valid());
  assert.equal(r.ok, true);
  assert.equal(r.value.name, "Maria Silva");
  assert.equal(r.value.phone, "");
  assert.equal(r.value.language, "pt-PT");
});

test("Origin: obrigatório e na lista; sem lista só localhost; pedidos sem Origin recusados", () => {
  const allowed = ["https://projectomilreu.pt"];
  assert.equal(isOriginAllowed("https://projectomilreu.pt", allowed), true);
  assert.equal(isOriginAllowed(null, allowed), false);
  assert.equal(isOriginAllowed("", allowed), false);
  assert.equal(isOriginAllowed("https://projectomilreu.pt.evil.example", allowed), false);
  assert.equal(isOriginAllowed("http://localhost:8080", allowed), false);
  assert.equal(isOriginAllowed("http://localhost:8080", []), true);
  assert.equal(isOriginAllowed(null, []), false);
});

test("tipos: campos não textuais e estruturas inválidas são recusados", () => {
  for (const bad of [null, [], "x", 1, { payload: [] }, { payload: "x" }, {}]) assert.equal(parseProposal(bad).ok, false, JSON.stringify(bad));
  for (const patch of [{ name: { toString: "x" } }, { email: ["a@b.pt"] }, { message: 12345678901 }, { phone: 912345678 }, { language: { x: 1 } }]) {
    assert.equal(parseProposal(withPayload(patch)).ok, false, JSON.stringify(patch));
  }
  assert.equal(parseProposal(withPayload({ privacyAccepted: "true" })).ok, false);
  assert.equal(parseProposal(withPayload({ privacyAccepted: 1 })).ok, false);
});

test("limites: acima do máximo rejeita (não corta em silêncio); mensagem demasiado curta rejeita", () => {
  for (const [key, max] of Object.entries(LIMITS)) {
    if (["email", "spaceType", "language", "phone"].includes(key)) continue;
    assert.equal(parseProposal(withPayload({ [key]: "a".repeat(max + 1) })).error, "payload_too_long", key);
  }
  assert.equal(parseProposal(withPayload({ message: "curta" })).ok, false);
  assert.equal(parseProposal(withPayload({ message: "x".repeat(LIMITS.message) })).ok, true);
});

test("listas fechadas: tipo de espaço, idioma e telefone", () => {
  assert.equal(parseProposal(withPayload({ spaceType: "<script>" })).ok, false);
  assert.equal(parseProposal(withPayload({ spaceType: "" })).ok, true);
  assert.equal(parseProposal(withPayload({ language: "de" })).ok, false);
  for (const lang of ["pt-PT", "en", "es", "fr"]) assert.equal(parseProposal(withPayload({ language: lang })).ok, true, lang);
  assert.equal(parseProposal(withPayload({ phone: "+351 912 345 678" })).ok, true);
  assert.equal(parseProposal(withPayload({ phone: "javascript:alert(1)" })).ok, false);
});

test("e-mail: um só endereço, sem listas, nomes de apresentação nem quebras de linha", () => {
  assert.equal(isSafeEmail("maria@example.org"), true);
  for (const bad of ["a@b", "a b@c.pt", "a@b.pt,c@d.pt", "a@b.pt;c@d.pt", "Maria <a@b.pt>", "a@b.pt\r\nBcc: x@y.pt", "\"x\"@b.pt", "a@-b.pt", `${"a".repeat(250)}@b.pt`]) {
    assert.equal(isSafeEmail(bad), false, bad);
    assert.equal(parseProposal(withPayload({ email: bad })).ok, false, bad);
  }
});

test("injecção nos campos do e-mail: CR/LF, controlos e bidi removidos dos campos de uma linha", () => {
  const r = parseProposal(withPayload({
    name: "Maria\r\nBcc: vitima@example.org", locality: "Estoi\u202E\u0007", venue: "A\tB\u2028C", dates: "\u0000hoje",
  }));
  assert.equal(r.ok, true);
  assert.equal(r.value.name, "Maria Bcc: vitima@example.org");
  assert.equal(r.value.locality, "Estoi");
  assert.equal(r.value.venue, "A BC");
  assert.equal(r.value.dates, "hoje");
  const subject = buildSubject(r.value, "EXPO-1");
  assert.doesNotMatch(subject, /[\r\n\u0000-\u001F\u202A-\u202E]/);
  assert.ok(subject.length < 200);
});

test("campos de várias linhas mantêm \\n mas perdem \\r, controlos e excesso de linhas vazias", () => {
  const r = parseProposal(withPayload({ message: "Linha 1\r\nLinha 2\u0008\n\n\n\n\n\nLinha 3 \u202Etexto" }));
  assert.equal(r.ok, true);
  assert.equal(r.value.message, "Linha 1\nLinha 2\n\n\nLinha 3 texto");
});

test("e-mail gerado: aviso de conteúdo não verificado e sem HTML interpretado (texto simples)", () => {
  const r = parseProposal(withPayload({ message: "<a href='http://phish.example'>clique</a> aqui por favor" }));
  const text = buildEmail(r.value, "EXPO-1");
  assert.match(text, /não verificado/);
  assert.match(text, /<a href='http:\/\/phish\.example'>/); // vai como texto; o envio usa o campo `text`
  const index = readFileSync("supabase/functions/exhibition-proposal-intake/index.ts", "utf8");
  assert.match(index, /text: buildEmail\(p, reference\)/);
  assert.doesNotMatch(index, /\bhtml:/);
});

test("corpo: Content-Type JSON, tecto de tamanho (declarado e real), JSON e UTF-8 válidos", async () => {
  assert.deepEqual((await readJsonLimited(req(valid()))).ok, true);
  assert.equal((await readJsonLimited(req(valid(), { "content-type": "text/plain" }))).status, 415);
  const big = JSON.stringify({ payload: { message: "x".repeat(MAX_BODY_BYTES) } });
  assert.equal((await readJsonLimited(req(big))).status, 413);
  // Content-Length mentiroso: o tecto aplica-se aos bytes lidos.
  const lying = new Request("https://fn.example/expor", { method: "POST", headers: { "content-type": "application/json", "content-length": "10" }, body: big });
  assert.equal((await readJsonLimited(lying)).status, 413);
  assert.equal((await readJsonLimited(req("{not json"))).status, 400);
  const badUtf8 = new Request("https://fn.example/expor", { method: "POST", headers: { "content-type": "application/json" }, body: new Uint8Array([0x7b, 0xff, 0x7d]) });
  assert.equal((await readJsonLimited(badUtf8)).status, 400);
});

test("erros genéricos: a função não devolve detalhes internos nem regista dados pessoais", () => {
  const index = readFileSync("supabase/functions/exhibition-proposal-intake/index.ts", "utf8");
  for (const code of index.matchAll(/error: "([a-z_]+)"/g)) assert.match(code[1], /^[a-z_]+$/);
  // Os logs só podem ter texto fixo e, no máximo, o código HTTP do fornecedor.
  const calls = [...index.matchAll(/console\.(?:log|error|warn|info)\(\s*"[^"]*"\s*(?:,\s*([^)]*))?\)/g)];
  assert.equal(calls.length, (index.match(/console\./g) || []).length, "todas as chamadas de log começam por texto fixo");
  for (const call of calls) assert.ok(!call[1] || call[1].trim() === "res.status", `argumento de log não permitido: ${call[1]}`);
  assert.doesNotMatch(index, /@(ualg|yahoo|gmail)\./, "endereços não devem estar no código da função");
  assert.match(index, /"X-Content-Type-Options": "nosniff"/);
  assert.match(index, /"Cache-Control": "no-store"/);
});

test("referência: formato estável e componente aleatória", () => {
  const a = newReference(() => "abcdef12-3456"), b = newReference(() => "99999999-0000");
  assert.match(a, /^EXPO-[0-9A-Z]+-ABCDEF$/);
  assert.notEqual(a.split("-")[2], b.split("-")[2]);
});
