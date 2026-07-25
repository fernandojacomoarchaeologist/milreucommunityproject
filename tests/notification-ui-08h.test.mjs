/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from"node:test";import assert from"node:assert/strict";import{readFileSync}from"node:fs";
const router=readFileSync("src/lib/router.js","utf8"),view=readFileSync("src/views/collaborative-notifications.js","utf8"),main=readFileSync("src/main.js","utf8"),layout=readFileSync("src/components/collaborative-layout.js","utf8");
test("rotas de inbox, preferências e gestão existem",()=>{for(const name of["collab-notifications","collab-notification-preferences","collab-notification-management","collab-notification-templates"])assert.ok(router.includes(name));});
test("inbox possui ações de leitura e arquivo",()=>{for(const marker of["data-notification-action","data-notification-mark-all","data-notification-filters"])assert.ok(view.includes(marker));});
test("preferências e operação possuem bindings",()=>{for(const marker of["data-notification-preferences-form","data-notification-channel-form","data-notification-test-form","data-notification-outbox-retry"])assert.ok(main.includes(marker));});
test("cabeçalho possui badge",()=>assert.match(layout,/collab-notification-bell/));
