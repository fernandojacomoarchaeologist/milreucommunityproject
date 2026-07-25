/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from"node:test";import assert from"node:assert/strict";import{readFileSync}from"node:fs";
const foundation=readFileSync("supabase/migrations/20260724140000_collaborative_notifications_foundation.sql","utf8");
const rpc=readFileSync("supabase/migrations/20260724140100_collaborative_notifications_rpc.sql","utf8");
const seed=readFileSync("supabase/migrations/20260724140200_collaborative_notifications_seed.sql","utf8");
test("sete tabelas possuem RLS",()=>{for(const table of["collab_notification_channels","collab_notification_event_types","collab_notification_templates","collab_notification_preferences","collab_notifications","collab_notification_outbox","collab_notification_deliveries"])assert.ok(foundation.includes(table));assert.ok((foundation.match(/enable row level security/g)||[]).length>=7);});
test("outbox e deliveries não têm select autenticado",()=>{assert.doesNotMatch(foundation,/grant select on public\.collab_notification_outbox to authenticated/);assert.doesNotMatch(foundation,/grant select on public\.collab_notification_deliveries to authenticated/);});
test("claim e finish são service role only",()=>{assert.match(rpc,/grant execute on function public\.collab_claim_notification_outbox_08h\(text,integer\) to service_role/);assert.doesNotMatch(rpc,/collab_claim_notification_outbox_08h\(text,integer\) to authenticated/);assert.match(rpc,/collab_finish_notification_delivery_08h/);});
test("seed inicia e-mail desativado",()=>{assert.match(seed,/'in-app','active','disabled'/);assert.match(seed,/'email','disabled','disabled'/);});

test("inbox e preferências são self-service",()=>{
  const notificationPolicy=foundation.match(/create policy collab_notifications_read[\s\S]*?\);/)?.[0]||"";
  const preferencePolicy=foundation.match(/create policy collab_notification_preferences_read[\s\S]*?\);/)?.[0]||"";
  assert.match(notificationPolicy,/user_id=auth\.uid\(\)/);
  assert.match(preferencePolicy,/user_id=auth\.uid\(\)/);
  assert.doesNotMatch(notificationPolicy,/notifications\.manage/);
  assert.doesNotMatch(preferencePolicy,/notifications\.manage/);
});
test("preferências validam o fuso horário",()=>assert.match(rpc,/invalid_timezone/));
