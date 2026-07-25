/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from"node:test";import assert from"node:assert/strict";import{readFileSync}from"node:fs";
const model=JSON.parse(readFileSync("public/data/collaborative-notification-model.json","utf8"));
const registry=JSON.parse(readFileSync("public/data/collaborative-notification-templates.json","utf8"));
const rpc=readFileSync("supabase/migrations/20260724140100_collaborative_notifications_rpc.sql","utf8");
test("templates usam apenas tokens permitidos",()=>{for(const template of registry.templates){const used=[...`${template.subjectTemplate} ${template.titleTemplate} ${template.bodyTextTemplate}`.matchAll(/\{\{([a-z_][a-z0-9_]*)\}\}/g)].map(x=>x[1]);for(const token of used)assert.ok(model.templateTokens.includes(token),`${template.eventType}:${token}`);}});
test("HTML arbitrário não faz parte do registry",()=>{assert.equal(registry.rules.arbitraryHtmlAllowed,false);assert.ok(registry.templates.every(x=>!x.htmlTemplate));});
test("templates aprovados são imutáveis",()=>{assert.match(rpc,/published_template_is_immutable/);assert.match(rpc,/status='retired'/);});
test("ativação de e-mail exige literal",()=>assert.match(rpc,/ACTIVATE_MILREU_TRANSACTIONAL_EMAIL/));
