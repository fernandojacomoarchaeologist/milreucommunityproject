/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Item 2 (2026-10-15) — Museu: avaliação anónima de 1 a 5 corações e partilha condicionada a direitos.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { detailView } from "../src/views/museum.js";
import { MUSEUM_SHARING, SHARE_EVENTS, RATING_EVENT, isShareable, shareLinks, memoryPublicUrl, validRating } from "../src/lib/museum-engagement.js";

const records = JSON.parse(readFileSync("public/data/memories.json","utf8")).records;
const eligible = records.find(r => isShareable(r));
const blocked = records.find(r => r.id === "MM202617");

test("partilha desligada por omissão até decisão do responsável sobre direitos", () => {
  assert.equal(MUSEUM_SHARING.enabled, false);
  const html = detailView(records, eligible, "pt-PT");
  assert.doesNotMatch(html, /data-memory-share/);
  assert.match(html, /data-memory-rating="MM\d{6}"/);
});

test("elegibilidade: só visível, elegível para lançamento e autorizada; MM202617 nunca", () => {
  assert.ok(eligible);
  assert.equal(isShareable(blocked), false);
  for (const r of records.filter(isShareable)) {
    assert.equal(r.publication.siteVisible, true);
    assert.notEqual(r.publication.publicReleaseEligible, false);
    assert.equal(r.rights.status, "authorized-for-project-publication");
  }
  const html = detailView(records, blocked, "pt-PT", { sharing: { enabled: true } });
  assert.doesNotMatch(html, /data-memory-share/);
});

test("ligações de partilha: página pública estável, sem SDKs nem pixels", () => {
  const l = shareLinks(eligible, "Título");
  assert.equal(l.url, `https://projectomilreu.pt/museu/memorias/${eligible.id}/`);
  assert.equal(memoryPublicUrl(eligible), l.url);
  assert.ok(l.facebook.startsWith("https://www.facebook.com/sharer/sharer.php?u="));
  assert.ok(l.whatsapp.startsWith("https://wa.me/?text="));
  assert.ok(decodeURIComponent(l.whatsapp).includes(l.url));
  const html = detailView(records, eligible, "pt-PT", { sharing: { enabled: true } });
  assert.match(html, /data-memory-share-target="facebook"/);
  assert.match(html, /data-memory-share-target="whatsapp"/);
  assert.match(html, /data-memory-share-native hidden/);
  assert.match(html, /rel="noopener noreferrer"/);
  assert.doesNotMatch(html, /connect\.facebook\.net|fbq\(|<script/);
});

test("eventos separados e de intenção", () => {
  assert.deepEqual({ ...SHARE_EVENTS }, { facebook: "facebook_share_intent", whatsapp: "whatsapp_share_intent", native: "native_share_intent" });
  assert.equal(RATING_EVENT, "museum_rating");
  const main = readFileSync("src/main.js","utf8");
  assert.match(main, /trackEvent\(SHARE_EVENTS\[link\.dataset\.memoryShareTarget\]/);
  assert.match(main, /trackEvent\(SHARE_EVENTS\.native/);
  assert.match(main, /typeof navigator\.share === "function"/);
});

test("avaliação: 1–5, acessível, sem médias, contadores nem promessa de armazenamento", () => {
  assert.equal(validRating("3"), 3);
  for (const bad of ["0","6","2.5","x",null]) assert.equal(validRating(bad), null);
  const html = detailView(records, eligible, "pt-PT");
  assert.equal((html.match(/type="radio" id="memory-rating-\d"/g) || []).length, 5);
  assert.match(html, /<legend>Gostou desta memória\?<\/legend>/);
  assert.match(html, /role="status"/);
  assert.match(html, /1 de 5/);
  const block = html.slice(html.indexOf('class="memory-section memory-engagement"'), html.indexOf("</section>", html.indexOf("memory-engagement")));
  assert.ok(block.length > 100);
  assert.doesNotMatch(block, /média|votos|guardad|registad|armazenad/i);
  assert.doesNotMatch(block, /style="/);
  const i18n = readFileSync("src/lib/i18n.js","utf8");
  assert.doesNotMatch(i18n.match(/ratingThanks:"[^"]*"/g).join(" "), /guardad|registad|stored|saved|guardad|enregistr/i);
  for (const lang of ["en","es","fr"]) assert.match(detailView(records, eligible, lang), /memory-rating__hint/);
});
