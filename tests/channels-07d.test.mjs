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

test("31 perfis e 30 públicos",()=>{assert.equal(records.length,31);assert.equal(records.filter(r=>r.publication.siteVisible).length,30)});
test("canais físicos inativos",()=>{assert.ok(records.every(r=>!r.totem.enabled&&!r.panel.enabled));assert.equal(config.channels.totem.printReady,false)});
test("domínio e QR pendentes",()=>{assert.equal(config.publicBaseUrl,null);assert.equal(qr.publicBaseUrl,null);assert.ok(qr.targets.every(t=>t.absoluteUrl===null))});
test("MM202617 bloqueado",()=>{const r=records.find(x=>x.id==="MM202617");assert.equal(r.totem.eligibility,"blocked");assert.equal(r.panel.eligibility,"blocked")});
