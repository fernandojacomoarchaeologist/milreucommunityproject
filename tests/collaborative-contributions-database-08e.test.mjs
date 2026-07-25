/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const foundation=readFileSync("supabase/migrations/20260724110000_collaborative_contributions_foundation.sql","utf8");
const rpc=readFileSync("supabase/migrations/20260724110100_collaborative_contributions_rpc.sql","utf8");
const seed=readFileSync("supabase/migrations/20260724110200_collaborative_contributions_seed.sql","utf8");

test("dados pessoais, contributos, ficheiros e decisões são separados",()=>{
  for(const table of [
    "collab_contribution_submitters","collab_contributions","collab_contribution_files",
    "collab_contribution_events","collab_contribution_decisions",
    "collab_contribution_incorporation_proposals","collab_withdrawal_requests"
  ]) assert.ok(foundation.includes(table),table);
});

test("bucket é privado e anon não possui insert direto",()=>{
  assert.match(foundation,/community-contributions-private/);
  assert.match(foundation,/public=false/);
  assert.doesNotMatch(foundation,/grant\s+insert[\s\S]{0,80}to\s+anon/i);
});

test("RLS protege dados e histórico",()=>{
  assert.ok((foundation.match(/enable row level security/g)||[]).length>=12);
  assert.match(foundation,/visible_to_submitter/);
  assert.match(foundation,/contributions\.files\.review/);
  assert.match(foundation,/withdrawals\.manage/);
});

test("entrada pública passa por função de serviço",()=>{
  assert.match(rpc,/collab_create_public_contribution_08e/);
  assert.match(rpc,/grant execute .* to service_role/);
  assert.doesNotMatch(rpc,/grant execute on function public\.collab_create_public_contribution_08e\(jsonb\) to anon/);
  assert.match(rpc,/collab_track_public_contribution_08e\(text,text\) to service_role/);
  assert.match(rpc,/collab_submit_withdrawal_request_08e\(text,text,text,text\) to service_role/);
  assert.match(rpc,/collab_consume_public_rate_limit_08e/);
});

test("incorporação é proposta e não escrita canónica",()=>{
  assert.match(rpc,/collab_create_incorporation_proposal_08e/);
  assert.match(rpc,/contribution_not_accepted/);
  assert.doesNotMatch(rpc,/update public\.memories|update public\.museum/);
});

test("seed ativa consentimento e master",()=>{
  assert.match(seed,/2026-08E-v1/);
  assert.match(seed,/select 'master',code/);
  assert.match(seed,/contribution-moderation/);
});

test("submissor não escolhe estado editorial",()=>{
  const insertSection=rpc.split("insert into public.collab_contributions",2)[1];
  assert.match(insertSection,/'submitted',\s*'normal'/);
  assert.doesNotMatch(insertSection,/p_payload->>'status'/);
});
