/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from"node:test";import assert from"node:assert/strict";import{readFileSync}from"node:fs";
const rpc=readFileSync("supabase/migrations/20260724140100_collaborative_notifications_rpc.sql","utf8");
test("triggers cobrem membros e tarefas",()=>{assert.match(rpc,/create trigger collab_notify_membership_change_08h/);assert.match(rpc,/create trigger collab_notify_task_assignment_08h/);});
test("triggers cobrem contributos e Museu",()=>{assert.match(rpc,/create trigger collab_notify_contribution_assignment_08h/);assert.match(rpc,/create trigger collab_notify_contribution_status_08h/);assert.match(rpc,/create trigger collab_notify_museum_assignment_08h/);assert.match(rpc,/create trigger collab_notify_museum_blocking_comment_08h/);});
test("triggers cobrem formação, agenda e exposição",()=>{assert.match(rpc,/create trigger collab_notify_training_status_08h/);assert.match(rpc,/create trigger collab_notify_agenda_change_08h/);assert.match(rpc,/create trigger collab_notify_exhibition_logistics_08h/);});
test("triggers cobrem retirada e homologação",()=>{assert.match(rpc,/create trigger collab_notify_withdrawal_08h/);assert.match(rpc,/create trigger collab_notify_homologation_blocked_08h/);});

test("atribuição de tarefa usa estado assigned",()=>{
  assert.match(rpc,/new\.status='assigned'/);
  assert.doesNotMatch(rpc,/new\.status='invited'/);
});
