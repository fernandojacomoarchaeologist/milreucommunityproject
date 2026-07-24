/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";import assert from "node:assert/strict";import{readFileSync}from"node:fs";
const sql=readFileSync("supabase/migrations/20260723090100_collaborative_member_management_rpc.sql","utf8");
test("último master ativo está protegido",()=>{assert.match(sql,/collab_active_master_count/);assert.match(sql,/last_active_master_protected/);assert.match(sql,/target_is_master/);assert.match(sql,/active_member_requires_role/);});
test("apenas master pode atribuir ou remover master",()=>{assert.match(sql,/master_required/);assert.match(sql,/actor_is_master/);});
test("mudança é transacional e auditada",()=>{assert.match(sql,/membership\.managed/);assert.match(sql,/before_data/);assert.match(sql,/after_data/);});
