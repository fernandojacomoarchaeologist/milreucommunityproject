/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Item 2 — agenda pública (#/exposicoes): classificação pela hora do servidor, ordem,
 * local/Google Maps, partilha só em eventos futuros, media com crédito e sem EXIF.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { classifyAgenda, findAgendaEntry, googleMapsUrl, clockNow, lisbonDay } from "../src/lib/agenda.js";

const snapshot = JSON.parse(readFileSync("public/data/exhibitions-public.json", "utf8"));
const view = readFileSync("src/views/exhibitions-public.js", "utf8");
const router = readFileSync("src/lib/router.js", "utf8");
const ids = group => group.map(entry => entry.id);

test("13-10-2026: 10/10, abril e fevereiro realizados; Estoi e inauguração próximos", () => {
  const g = classifyAgenda(snapshot, Date.parse("2026-10-13T12:00:00Z"));
  assert.deepEqual(ids(g.past), ["2026-10-10-sao-bras-de-alportel-museu-do-traje", "2026-04-11-estoi-roda-de-conversas", "2026-02-07-milreu-roda-de-conversas"]);
  assert.deepEqual(ids(g.upcoming), ["2026-10-30-estoi-junta-de-freguesia", "2026-10-30-estoi-inauguracao"]);
  assert.equal(g.current.length, 0);
});

test("durante a paragem de Estoi fica «em exibição»; depois de 06-11 passa a realizada", () => {
  const during = classifyAgenda(snapshot, Date.parse("2026-11-02T10:00:00Z"));
  assert.ok(ids(during.current).includes("2026-10-30-estoi-junta-de-freguesia"));
  assert.ok(ids(during.past).includes("2026-10-30-estoi-inauguracao"));
  const after = classifyAgenda(snapshot, Date.parse("2026-11-07T10:00:00Z"));
  assert.equal(ids(after.past)[0], "2026-10-30-estoi-junta-de-freguesia");
});

test("o dia conta em Portugal e a hora do servidor tem prioridade sobre o dispositivo", () => {
  assert.equal(lisbonDay(Date.parse("2026-10-29T23:30:00Z")), "2026-10-29");
  assert.equal(clockNow({ ms: 1000, fetchedAt: 500 }, 700), 1200);
  assert.equal(clockNow(null, 42), 42);
});

test("cada entrada tem id, período, freguesia, município e pesquisa para o Google Maps", () => {
  for (const id of ["2026-10-30-estoi-junta-de-freguesia", "2026-10-10-sao-bras-de-alportel-museu-do-traje", "2026-04-11-estoi-roda-de-conversas", "2026-02-07-milreu-roda-de-conversas", "2026-10-30-estoi-inauguracao"]) {
    const entry = findAgendaEntry(snapshot, id);
    assert.ok(entry, id);
    assert.ok(entry.parish && entry.municipality, `${id}: freguesia/município`);
    assert.match(googleMapsUrl(entry.mapsQuery), /^https:\/\/www\.google\.com\/maps\/search\/\?api=1&query=/);
  }
  assert.match(view, /target="_blank" rel="noopener noreferrer external"/);
});

test("partilha Facebook/WhatsApp só em eventos não realizados", () => {
  assert.match(view, /facebook\.com\/sharer\/sharer\.php\?u=/);
  assert.match(view, /wa\.me\/\?text=/);
  assert.match(view, /status!=="past"\?shareBlock\(entry\)/);
});

test("realizados são clicáveis e há rota de detalhe", () => {
  assert.match(view, /class="agenda-past" href="#\/exposicoes\//);
  assert.match(router, /public-exhibition-entry/);
  assert.match(view, /Os próximos locais serão anunciados em breve/);
});

test("todas as imagens existem, com dimensões, texto alternativo, crédito e sem EXIF", () => {
  const media = ["current", "upcoming", "past", "events"].flatMap(k => snapshot[k]).flatMap(entry => entry.media || []);
  assert.ok(media.length >= 14);
  for (const item of media) {
    for (const file of [item.src, item.thumb]) {
      assert.ok(existsSync(file), file);
      assert.ok(!readFileSync(file).includes(Buffer.from("Exif")), `EXIF presente: ${file}`);
    }
    assert.ok(item.width > 0 && item.height > 0 && item.thumbWidth > 0 && item.thumbHeight > 0, item.src);
    assert.ok(item.alt && item.alt.length > 20, `alt: ${item.src}`);
    assert.match(item.credit, /^(Fotografia|Cartaz):/, `crédito: ${item.src}`);
  }
});

test("dados reais têm aprovação registada e nenhum exemplo misturado", () => {
  assert.equal(snapshot.isExample, false);
  assert.ok(existsSync(snapshot.approval.ref), "registo da decisão em falta");
  for (const k of ["current", "upcoming", "past", "events"]) for (const row of snapshot[k]) assert.notEqual(row.example, true);
});
