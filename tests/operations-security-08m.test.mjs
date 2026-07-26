/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const foundation=readFileSync("supabase/migrations/20260726100000_operations_governance_foundation.sql","utf8");
const rpc=readFileSync("supabase/migrations/20260726100100_operations_governance_rpc_rls.sql","utf8");
test("público lê apenas snapshots publicados",()=>{assert.ok(/collab_snapshots_public[\s\S]*to anon[\s\S]*publication_status='published'/.test(foundation));});
test("suporte é próprio ou de gestão (nunca de terceiros)",()=>{assert.ok(/collab_support_select[\s\S]*requested_by=auth.uid\(\)[\s\S]*support.manage/.test(foundation));});
test("moderação é restrita (sujeito sem acesso)",()=>{assert.ok(/collab_moderation_select[\s\S]*moderation.manage/.test(foundation));const mod=foundation.match(/collab_moderation_select[\s\S]*?using\s*\(([\s\S]*?)\);/);assert.ok(!mod[1].includes("auth.uid()"));});
test("decisão de governação e publicação exigem permissões protegidas + literal",()=>{assert.ok(rpc.includes("governance.decide"));assert.ok(rpc.includes("APPROVE_MILREU_PUBLIC_TRANSPARENCY"));});
test("publicação exige privacidade e qualidade aprovadas",()=>{assert.ok(rpc.includes("privacy_not_approved"));assert.ok(rpc.includes("quality_not_approved"));});
test("todas as mutações são security definer",()=>{const code=rpc.split("\n").filter(l=>!l.trim().startsWith("--")).join("\n");assert.equal((code.match(/security definer/g)||[]).length,(code.match(/create or replace function/g)||[]).length);});
test("migrations 08M sem operações destrutivas próprias",()=>{for(const s of [foundation,rpc])assert.ok(!/\b(drop\s+table|truncate|delete\s+from)\b/i.test(s));});
