/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from"node:test";import assert from"node:assert/strict";import{readFileSync}from"node:fs";
const router=readFileSync("src/lib/router.js","utf8"),view=readFileSync("src/views/collaborative-operations.js","utf8"),main=readFileSync("src/main.js","utf8"),layout=readFileSync("src/components/collaborative-layout.js","utf8");
test("rotas operacionais existem",()=>{for(const name of["collab-system-administration","collab-audit-governance","collab-incidents-continuity","collab-incident-detail"])assert.ok(router.includes(name));});
test("views cobrem sistema, auditoria e incidentes",()=>{for(const fn of["collaborativeSystemAdministrationView","collaborativeAuditGovernanceView","collaborativeIncidentsContinuityView","collaborativeIncidentDetailView"])assert.ok(view.includes(fn));});
test("bindings cobrem checks, retenção, incidentes e backups",()=>{for(const marker of["data-operation-result-form","data-audit-integrity","data-retention-preview-form","data-legal-hold-form","data-incident-create-form","data-backup-verification-form","data-continuity-exercise-form"])assert.ok(main.includes(marker));});
test("menu apresenta os três módulos",()=>{for(const label of["Administração do sistema","Auditoria e retenção","Incidentes e continuidade"])assert.ok(layout.includes(label));});
