/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";import assert from "node:assert/strict";import{readFileSync}from"node:fs";
const sql=readFileSync("supabase/migrations/20260723090100_collaborative_member_management_rpc.sql","utf8");const views=readFileSync("src/views/collaborative.js","utf8");
test("pré-autorização usa e-mail e login Google",()=>{assert.match(sql,/collab_access_invitations/);assert.match(sql,/email_confirmed_at is not null/);assert.match(sql,/collab_claim_access_invitation/);});
test("pré-autorização não afirma enviar e-mail",()=>{assert.match(views,/Este módulo não envia e-mail/);assert.match(views,/continua a entrar com Google/);});
test("convite pode ser revogado",()=>{assert.match(sql,/collab_revoke_access_invitation/);assert.match(views,/data-collab-revoke-invitation/);});
