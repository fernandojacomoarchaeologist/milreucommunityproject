/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 10D — testes da rota /conhecimento/api, do despacho no render e dos três estados
 * distintos da vista (carregamento, erro, disponível). Não usa browser: injeta location e lê
 * o texto de src/main.js para confirmar o despacho.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { proteusApiView } from "../src/views/proteus-api.js";

globalThis.location = globalThis.location || { hash: "#/" };
const { getRoute } = await import("../src/lib/router.js");

const index = JSON.parse(readFileSync("public/api/proteus/v1/index.json", "utf8"));

test("a rota canónica /conhecimento/api resolve para proteus-api", () => {
  globalThis.location.hash = "#/conhecimento/api";
  assert.equal(getRoute().name, "proteus-api");
});

test("as rotas Proteus preexistentes não regridem", () => {
  globalThis.location.hash = "#/conhecimento/biblioteca";
  assert.equal(getRoute().name, "proteus-library");
  globalThis.location.hash = "#/conhecimento/afirmacoes";
  assert.equal(getRoute().name, "proteus-knowledge");
});

test("o render de src/main.js despacha a rota proteus-api", () => {
  const main = readFileSync("src/main.js", "utf8");
  assert.ok(/case "proteus-api":/.test(main), "case proteus-api ausente");
  assert.ok(/proteusApiView\(state\.publicProteusApi/.test(main), "vista não recebe o índice da API");
  assert.ok(/loadProteusApiIndex\(\)/.test(main), "índice da API não é carregado no arranque");
});

test("estado de CARREGAMENTO é distinto (índice undefined)", () => {
  const html = proteusApiView(undefined, "pt-PT");
  assert.ok(/A carregar/i.test(html));
  assert.ok(/role="status"/.test(html));
});

test("estado de ERRO é distinto (índice null)", () => {
  const html = proteusApiView(null, "pt-PT");
  assert.ok(/indisponível/i.test(html));
  assert.ok(/role="alert"/.test(html));
});

test("estado DISPONÍVEL mostra versão, recursos e política de direitos", () => {
  const html = proteusApiView(index, "pt-PT");
  assert.ok(/API pública/.test(html));
  assert.ok(/somente leitura/i.test(html));
  assert.ok(/\/api\/proteus\/v1\//.test(html));
  assert.ok(/nega/i.test(html), "política de direitos default deny visível");
  // coleções vazias comunicadas honestamente
  assert.ok(/vazia/i.test(html));
  // não inventa itens
  assert.ok(!/SEGREDO|Título Secreto/i.test(html));
});

test("a Biblioteca liga discretamente à documentação da API", () => {
  const lib = readFileSync("src/views/proteus-library.js", "utf8");
  assert.ok(/#\/conhecimento\/api/.test(lib), "ligação à API ausente da Biblioteca");
});
