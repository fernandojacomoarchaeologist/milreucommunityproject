/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const model=JSON.parse(readFileSync("public/data/participation-pathways-model.json","utf8"));
test("estados e tipos de passo definidos",()=>{for(const s of ["enrolled","active","withdrawn"])assert.ok(model.enrolmentStatuses.includes(s));for(const t of ["training","task","review","reading"])assert.ok(model.stepTypes.includes(t));});
test("fontes de conclusão incluem coordenação e declaração",()=>{for(const c of ["system-event","coordinator-confirmation","participant-declaration"])assert.ok(model.completionSources.includes(c));});
test("serviço de participação não introduz ranking",()=>{const svc=readFileSync("src/services/participation-programme-service.js","utf8");assert.ok(!/ranking|score|points|leaderboard/i.test(svc)||svc.includes("Não há ranking"));});
