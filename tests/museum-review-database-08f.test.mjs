/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from"node:test";import assert from"node:assert/strict";import{readFileSync}from"node:fs";
const foundation=readFileSync("supabase/migrations/20260724120000_collaborative_museum_review_foundation.sql","utf8");
const rpc=readFileSync("supabase/migrations/20260724120100_collaborative_museum_review_rpc.sql","utf8");
const seed=readFileSync("supabase/migrations/20260724120200_collaborative_museum_review_seed.sql","utf8");
test("banco separa revisão, propostas, checks e snapshots",()=>{for(const table of["collab_museum_review_records","collab_museum_review_field_proposals","collab_museum_review_comments","collab_museum_review_checks","collab_museum_review_snapshots"])assert.ok(foundation.includes(table));});
test("RLS protege dezasseis tabelas",()=>{assert.ok((foundation.match(/enable row level security/g)||[]).length>=16);});
test("sequência de aprovação é obrigatória",()=>{for(const gate of["editorial_approval_required","rights_approval_required","publication_approval_required","review_gates_failed"])assert.ok(rpc.includes(gate));});
test("aplicação canónica não ocorre no banco",()=>{assert.doesNotMatch(rpc,/update public\.memories|update public\.museum/);assert.match(rpc,/collab_generate_museum_review_snapshot_08f/);});
test("seed possui 31 IDs e trilhas",()=>{assert.equal((seed.match(/'MM2026\d{2}'/g)||[]).length,31);assert.match(seed,/rights-credits-ai/);assert.match(seed,/accessible-public-writing/);});

test("propostas aceites são imutáveis e substituíveis por ação auditada",()=>{
  assert.match(rpc,/proposal_locked/);
  assert.match(rpc,/collab_supersede_museum_proposal_08f/);
  assert.match(rpc,/accepted_proposal_not_found/);
  assert.match(foundation,/where status in \('draft','submitted','accepted'\)/);
});

test("publicação exige elegibilidade e preserva divulgação de IA",()=>{
  assert.match(foundation,/requires_ai_disclosure boolean not null default false/);
  assert.match(rpc,/collab_museum_review_publication_eligibility_08f/);
  assert.match(rpc,/public_release_eligibility_required/);
  assert.match(rpc,/ai-substantive-intervention/);
  assert.match(seed,/'MM202617'[\s\S]*?true,false,true,0/);
});

test("progresso de formação só é escrito por RPC auditada",()=>{
  assert.doesNotMatch(foundation,/grant select,insert,update on public\.collab_training_enrolments/);
  assert.doesNotMatch(foundation,/grant select,insert,update on public\.collab_training_lesson_progress/);
  assert.doesNotMatch(foundation,/grant select,insert on public\.collab_training_assessments/);
  assert.doesNotMatch(foundation,/collab_training_enrolments_self_write/);
  assert.doesNotMatch(foundation,/collab_training_lesson_progress_self_write/);
  assert.match(rpc,/collab_complete_training_lesson_08f/);
  assert.match(rpc,/collab_record_training_assessment_08f/);
});

test("propostas aceitam somente campos registados e contributos elegíveis",()=>{
  assert.match(rpc,/collab_museum_review_field_allowed_08f/);
  assert.match(rpc,/field_path_not_allowed/);
  assert.match(rpc,/proposal_links_must_be_arrays/);
  assert.match(rpc,/invalid_contribution_id:%/);
  assert.match(rpc,/contribution_not_eligible:%/);
});
