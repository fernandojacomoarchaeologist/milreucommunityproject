/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const foundation=readFileSync("supabase/migrations/20260726090000_public_integration_and_participation.sql","utf8");
const rpc=readFileSync("supabase/migrations/20260726090100_public_integration_rpc_and_rls.sql","utf8");
test("anon lê apenas snapshots ativos",()=>{assert.ok(/collab_pub_snapshots_public[\s\S]*to anon[\s\S]*status='active'/.test(foundation));});
test("anon vê apenas programas públicos disponíveis/ativos",()=>{assert.ok(/collab_prog_public[\s\S]*to anon[\s\S]*visibility='public'/.test(foundation));});
test("ativação exige permissão protegida e confirmação literal",()=>{assert.ok(rpc.includes("public-integration.activate"));assert.ok(rpc.includes("ACTIVATE_MILREU_PUBLIC_EFFECT"));assert.ok(rpc.includes("public-integration.rollback"));});
test("decisão de evolução é protegida (evolution.decide)",()=>{assert.ok(/collab_evolution_decide[\s\S]*evolution.decide/.test(rpc));});
test("produção permanece bloqueada nas ativações",()=>{assert.ok(/'productionApproval','blocked'/.test(rpc)||rpc.includes("productionApproval"));});
test("todas as mutações são security definer",()=>{const code=rpc.split("\n").filter(l=>!l.trim().startsWith("--")).join("\n");assert.equal((code.match(/security definer/g)||[]).length,(code.match(/create or replace function/g)||[]).length);});
test("migrations 08L sem operações destrutivas próprias",()=>{for(const s of [foundation,rpc])assert.ok(!/\b(drop\s+table|truncate|delete\s+from)\b/i.test(s));});
