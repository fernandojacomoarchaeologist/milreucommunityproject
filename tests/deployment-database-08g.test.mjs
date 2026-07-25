/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from"node:test";import assert from"node:assert/strict";import{readFileSync}from"node:fs";
const foundation=readFileSync("supabase/migrations/20260724130000_collaborative_deployment_homologation.sql","utf8");
const rpc=readFileSync("supabase/migrations/20260724130100_collaborative_deployment_homologation_rpc.sql","utf8");
const seed=readFileSync("supabase/migrations/20260724130200_collaborative_deployment_homologation_seed.sql","utf8");
test("cinco tabelas com RLS",()=>{for(const table of["collab_deployment_environments","collab_auth_policies","collab_homologation_check_catalog","collab_homologation_runs","collab_homologation_checks"])assert.ok(foundation.includes(table),table);assert.ok((foundation.match(/enable row level security/g)||[]).length>=5);});
test("escrita ocorre por RPC",()=>{assert.doesNotMatch(foundation,/grant\s+(insert|update|delete|all)[\s\S]{0,80}to authenticated/i);for(const fn of["collab_start_homologation_08g","collab_record_homologation_check_08g","collab_approve_homologation_08g"])assert.ok(rpc.includes(fn),fn);});
test("produção exige staging e literal",()=>{assert.match(rpc,/approved_staging_run_required/);assert.match(rpc,/APPROVE_MILREU_PRODUCTION_RELEASE/);assert.match(rpc,/literal_production_confirmation_required/);});
test("seed contém 24 checks e master",()=>{assert.equal((seed.match(/\('(?:env-config|separate-staging|migration-dry-run|database-tests|google-provider|google-callback|app-callback|preauthorization|master-bootstrap|last-master-protection|role-matrix|cross-user-isolation|private-contribution-files|signed-links|collaborative-flows|session-expiry|mobile-375|tablet-768|desktop-1280|keyboard-screen-reader|performance-budget|rollback-tested|backup-tested|consent-privacy-review)'/g)||[]).length,24);assert.match(seed,/select 'master',code/);});
