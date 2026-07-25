/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const controller=readFileSync("src/collab/controller.js","utf8");

test("workspace carrega todas as entidades",()=>{
  for(const table of [
    "collab_contributions","collab_contribution_submitters","collab_contribution_consents",
    "collab_contribution_files","collab_contribution_targets",
    "collab_contribution_assignments","collab_contribution_events",
    "collab_contribution_decisions","collab_contribution_incorporation_proposals",
    "collab_withdrawal_requests"
  ]) assert.ok(controller.includes(table),table);
});

test("controller cobre submissão, acompanhamento e retirada",()=>{
  for(const method of ["submitContribution","trackContribution","requestContributionWithdrawal"]){
    assert.ok(controller.includes(`async ${method}`),method);
  }
  assert.match(controller,/community-contribution-intake/);
  assert.match(controller,/uploadToSignedUrl/);
});

test("controller cobre moderação sem atualizar Museu",()=>{
  for(const method of [
    "assignContribution","moderateContribution","createIncorporationProposal",
    "reviewContributionFile","resolveWithdrawal","getContributionFileLink"
  ]) assert.ok(controller.includes(`async ${method}`),method);
  assert.doesNotMatch(controller,/memories\.json|updateMemory|publishMemory/);
});

test("demonstração usa dados explicitamente fictícios",()=>{
  assert.match(controller,/createDemoContributionWorkspace/);
  assert.match(controller,/demonstração/);
  assert.match(controller,/@local\.invalid/);
  assert.match(controller,/Não corresponde|fictício|fictícia/);
});
