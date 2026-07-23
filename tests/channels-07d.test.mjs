/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const config = JSON.parse(readFileSync("public/data/channels/channel-config.json","utf8"));
const records = JSON.parse(readFileSync("public/data/channels/channel-records.json","utf8")).records;
const qr = JSON.parse(readFileSync("public/data/channels/qr-targets.json","utf8"));

test("31 perfis visíveis e 30 elegíveis para lançamento",()=>{
  assert.equal(records.length,31);
  assert.equal(records.filter(record=>record.publication.siteVisible).length,31);
  assert.equal(records.filter(record=>record.publication.publicReleaseEligible !== false).length,30);
});

test("canais físicos inativos",()=>{
  assert.ok(records.every(record=>!record.totem.enabled&&!record.panel.enabled));
  assert.equal(config.channels.totem.printReady,false);
});

test("domínio e 30 QR permanecem pendentes",()=>{
  assert.equal(config.publicBaseUrl,null);
  assert.equal(qr.publicBaseUrl,null);
  assert.equal(qr.targets.length,30);
  assert.ok(qr.targets.every(target=>target.absoluteUrl===null));
  assert.ok(!qr.targets.some(target=>target.id==="MM202617"));
});

test("MM202617 é review-only nos canais físicos",()=>{
  const record=records.find(item=>item.id==="MM202617");
  assert.equal(record.publication.siteVisible,true);
  assert.equal(record.publication.publicReleaseEligible,false);
  assert.equal(record.totem.eligibility,"review-only");
  assert.equal(record.panel.eligibility,"review-only");
});
