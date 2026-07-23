/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";import assert from "node:assert/strict";import {readFileSync} from "node:fs";
const records=JSON.parse(readFileSync("public/data/memories.json","utf8")).records;
test("31 registos",()=>assert.equal(records.length,31));
test("30 visíveis",()=>assert.equal(records.filter(x=>x.publication.siteVisible).length,30));
test("MM202617 bloqueado",()=>{const x=records.find(x=>x.id==="MM202617");assert.equal(x.publication.siteVisible,false);assert.equal(x.publication.blockReason,"ai-substantive-intervention")});
test("estrutura multicanal",()=>{for(const x of records)for(const c of ["portal","museum","totem","panel"])assert.ok(x.channels[c])});
test("direitos registados",()=>{for(const x of records)assert.equal(x.rights.status,"authorized-for-project-publication")});
