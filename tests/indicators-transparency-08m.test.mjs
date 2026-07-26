/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const rpc=readFileSync("supabase/migrations/20260726100100_operations_governance_rpc_rls.sql","utf8");
const ind=JSON.parse(readFileSync("public/data/impact-indicators-model.json","utf8"));
test("indicador exige definição e fonte",()=>{assert.ok(rpc.includes("definition_and_source_required"));});
test("publicação de transparência é gated por literal + aprovações",()=>{assert.ok(rpc.includes("APPROVE_MILREU_PUBLIC_TRANSPARENCY"));assert.ok(/privacy_not_approved|quality_not_approved/.test(rpc));});
test("modelo não publica dados individuais",()=>{assert.equal(ind.publishesIndividualData,false);});
test("guarda de transparência rejeita PII",async()=>{const{assertTransparencySafe}=await import("../scripts/operations-governance/transparency-guard.mjs");assert.throws(()=>assertTransparencySafe({email:"a@b.invalid"}));assert.doesNotThrow(()=>assertTransparencySafe({name:"x",value:1}));});
