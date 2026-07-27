/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { collaborativeShell,statusPill } from "../components/collaborative-layout.js";
import { hasPermission } from "../collab/permissions.js";

const esc=value=>String(value??"").replace(/[&<>"]/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[char]));
const date=value=>value?new Intl.DateTimeFormat("pt-PT",{dateStyle:"medium",timeStyle:"short"}).format(new Date(value)):"—";
const isoInput=value=>value?new Date(value).toISOString().slice(0,16):"";
const workspace=context=>context.operationalWorkspace||{};
const members=context=>(context.management?.members||[]).filter(item=>item.membership?.status==="active");

function heading(title,description,actions=""){
  return `<header class="collab-page-heading collab-page-heading--actions"><div><span>08I · Governação operacional</span><h1>${esc(title)}</h1><p>${esc(description)}</p></div>${actions?`<div class="collab-heading-actions">${actions}</div>`:""}</header>`;
}
function optionList(values,selected="",labels={}){
  return (values||[]).map(value=>`<option value="${esc(value)}" ${value===selected?"selected":""}>${esc(labels[value]||value)}</option>`).join("");
}
function memberOptions(context,selected=null,empty="Sem atribuição"){
  return `<option value="">${esc(empty)}</option>${members(context).map(item=>`<option value="${esc(item.user_id)}" ${item.user_id===selected?"selected":""}>${esc(item.display_name||item.email)}</option>`).join("")}`;
}
function summaryCards(data){
  const summary=data.summary||{};
  return `<section class="operations-summary">
    <article><span>Incidentes críticos abertos</span><strong>${esc(summary.openCriticalIncidents||0)}</strong></article>
    <article><span>Legal holds ativos</span><strong>${esc(summary.activeLegalHolds||0)}</strong></article>
    <article><span>Verificações de backup falhadas</span><strong>${esc(summary.failedBackupVerifications||0)}</strong></article>
    <article><span>Saúde operacional</span><strong>${esc(summary.latestOperationalStatus||"not-run")}</strong></article>
    <article><span>Eventos de auditoria · 30 dias</span><strong>${esc(summary.auditEvents30Days||0)}</strong></article>
  </section>`;
}

function latestRun(context){
  const data=workspace(context),run=data.operationalRuns?.[0];
  if(!run)return `<p class="collab-empty-line">Ainda não existe uma execução operacional.</p>`;
  const results=(data.operationalResults||[]).filter(item=>item.runId===run.id);
  const catalog=new Map((data.checkCatalog||[]).map(item=>[item.code,item]));
  return `<article class="operations-run operations-run--${esc(run.status)}">
    <header><div><span>${esc(run.environment)} · ${esc(run.version||"sem versão")}</span><h2>Execução ${esc(run.id)}</h2><time>${esc(date(run.startedAt))}</time></div>${statusPill(run.status)}</header>
    <div class="operations-check-list">${results.map(result=>{
      const check=catalog.get(result.checkCode)||{name:result.checkCode,evidence_required:false,blocking:false};
      return `<form class="operations-check operations-check--${esc(result.status)}" data-operation-result-form data-run-id="${esc(run.id)}" data-check-code="${esc(result.checkCode)}">
        <div><span>${check.blocking?"Bloqueante":"Recomendado"}</span><h3>${esc(check.name)}</h3>${statusPill(result.status)}</div>
        <select name="status" aria-label="Estado de ${esc(check.name)}">${optionList(context.operationalGovernanceModel?.checkStatuses||[],result.status)}</select>
        <input name="evidenceReference" aria-label="Evidência de ${esc(check.name)}" value="${esc(result.evidenceReference||"")}" placeholder="${check.evidence_required?"Evidência obrigatória":"Referência de evidência"}">
        <input name="notes" aria-label="Notas de ${esc(check.name)}" value="${esc(result.notes||"")}" placeholder="Notas">
        ${hasPermission(context,"health.check")&&run.status==="running"?`<button type="submit">Guardar</button>`:""}
        <p data-collab-feedback></p>
      </form>`;
    }).join("")}</div>
    ${hasPermission(context,"health.run")&&run.status==="running"?`<form class="collab-form compact-form operations-complete-form" data-operation-complete-form data-run-id="${esc(run.id)}"><label>Resumo<textarea name="summary" rows="3"></textarea></label><button type="submit">Concluir execução</button><p data-collab-feedback></p></form>`:""}
  </article>`;
}

function settingsSection(context){
  const data=workspace(context);
  if(!hasPermission(context,"operations.view"))return"";
  return `<section class="operations-section"><h2>Configurações não sensíveis</h2><p>Secrets, passwords, tokens e chaves não são aceites.</p>
    <div class="operations-settings">${(data.settings||[]).map(setting=>`<form class="operations-setting" data-operation-setting-form data-setting-code="${esc(setting.code)}">
      <header><div><span>${esc(setting.category)}</span><h3>${esc(setting.code)}</h3></div>${statusPill(setting.status)}</header>
      <p>${esc(setting.description||"")}</p>
      <label>Valor JSON<textarea name="valueJson" rows="4">${esc(JSON.stringify(setting.value||{},null,2))}</textarea></label>
      <div class="form-grid-2"><label>Categoria<input name="category" value="${esc(setting.category)}" required></label><label>Estado<select name="status">${optionList(["draft","active","deprecated"],setting.status)}</select></label></div>
      <label>Descrição<input name="description" value="${esc(setting.description||"")}"></label>
      ${hasPermission(context,"operations.settings.manage")?`<button type="submit">Guardar configuração</button>`:""}<p data-collab-feedback></p>
    </form>`).join("")}</div>
  </section>`;
}

function backupSection(context){
  const data=workspace(context);
  if(!hasPermission(context,"backups.view"))return"";
  const model=context.operationalGovernanceModel?.backup||{};
  return `<section class="operations-section"><div class="section-heading-inline"><div><h2>Backups e verificações</h2><p>O registo de um plano não prova que existe um backup. A evidência deve ser verificada.</p></div></div>
    <div class="backup-plan-grid">${(data.backupPlans||[]).map(plan=>{
      const verifications=(data.backupVerifications||[]).filter(item=>item.planId===plan.id);
      const latest=verifications[0];
      return `<article class="backup-plan backup-plan--${esc(plan.status)}">
        <header><div><span>${esc(plan.backupType)} · ${esc(plan.provider)}</span><h3>${esc(plan.name)}</h3><small>${esc(plan.code)}</small></div>${statusPill(plan.status)}</header>
        <dl><div><dt>Frequência</dt><dd>${esc(plan.frequency)}</dd></div><div><dt>Retenção</dt><dd>${esc(plan.retentionDays)} dias</dd></div><div><dt>RPO</dt><dd>${plan.targetRpoMinutes??"—"} min</dd></div><div><dt>RTO</dt><dd>${plan.targetRtoMinutes??"—"} min</dd></div><div><dt>Último sucesso</dt><dd>${esc(date(plan.lastSuccessfulAt))}</dd></div><div><dt>Última verificação</dt><dd>${latest?`${esc(latest.status)} · ${esc(date(latest.verifiedAt))}`:"—"}</dd></div></dl>
        ${hasPermission(context,"backups.verify")?`<details><summary>Registar verificação</summary><form class="collab-form compact-form" data-backup-verification-form data-plan-id="${esc(plan.id)}"><label>Estado<select name="status">${optionList(model.verificationStatuses||[],"pending")}</select></label><label>Backup observado em<input type="datetime-local" name="backupObservedAt"></label><label class="collab-check"><input type="checkbox" name="restoreTested">Restauração testada</label><label>Evidência<input name="evidenceReference"></label><label>Notas<textarea name="notes" rows="3"></textarea></label><button type="submit">Guardar verificação</button><p data-collab-feedback></p></form></details>`:""}
        ${hasPermission(context,"backups.manage")?`<details><summary>Editar plano</summary>${backupPlanForm(context,plan)}</details>`:""}
      </article>`;
    }).join("")}</div>
    ${hasPermission(context,"backups.manage")?`<details class="operations-create-panel"><summary>Criar plano de backup</summary>${backupPlanForm(context)}</details>`:""}
  </section>`;
}
function backupPlanForm(context,plan=null){
  const model=context.operationalGovernanceModel?.backup||{};
  return `<form class="collab-form" data-backup-plan-form data-plan-id="${esc(plan?.id||"")}">
    <div class="form-grid-2"><label>Código<input name="code" value="${esc(plan?.code||"")}" required></label><label>Nome<input name="name" value="${esc(plan?.name||"")}" required></label></div>
    <div class="form-grid-3"><label>Tipo<select name="backupType">${optionList(model.types||[],plan?.backupType||"database")}</select></label><label>Fornecedor<select name="provider">${optionList(model.providers||[],plan?.provider||"unconfigured")}</select></label><label>Frequência<select name="frequency">${optionList(model.frequencies||[],plan?.frequency||"manual")}</select></label></div>
    <div class="form-grid-3"><label>Retenção em dias<input type="number" min="1" name="retentionDays" value="${esc(plan?.retentionDays||30)}"></label><label>RPO em minutos<input type="number" min="0" name="targetRpoMinutes" value="${esc(plan?.targetRpoMinutes??"")}"></label><label>RTO em minutos<input type="number" min="1" name="targetRtoMinutes" value="${esc(plan?.targetRtoMinutes??"")}"></label></div>
    <div class="form-grid-2"><label>Responsável<select name="responsibleUserId">${memberOptions(context,plan?.responsibleUserId)}</select></label><label>Responsável secundário<select name="secondaryUserId">${memberOptions(context,plan?.secondaryUserId)}</select></label></div>
    <label>Procedimento<input name="instructionsReference" value="${esc(plan?.instructionsReference||"")}"></label><div class="form-grid-2"><label>Próxima verificação<input type="datetime-local" name="nextDueAt" value="${esc(isoInput(plan?.nextDueAt))}"></label><label>Estado<select name="status">${optionList(["draft","active","paused","retired"],plan?.status||"draft")}</select></label></div>
    <button type="submit">Guardar plano</button><p data-collab-feedback></p>
  </form>`;
}

export function collaborativeSystemAdministrationView(context){
  if(!hasPermission(context,"operations.view")&&!hasPermission(context,"health.view")&&!hasPermission(context,"backups.view"))return forbidden(context);
  const data=workspace(context);
  return collaborativeShell(context,"/area-colaborativa/gestao/sistema",`
    ${heading("Administração do sistema","Saúde operacional, configurações não sensíveis, backups e evidências.",`<button type="button" class="ml-button ml-button--secondary" data-operations-refresh>Atualizar</button>`)}
    ${summaryCards(data)}
    ${hasPermission(context,"health.view")?`<section class="operations-section"><div class="section-heading-inline"><div><h2>Saúde operacional</h2><p>Os checks exigem evidência humana; não simulam a configuração remota.</p></div>${hasPermission(context,"health.run")?`<form class="operations-run-start" data-operation-run-start-form><select name="environment" aria-label="Ambiente da execução">${optionList(["local","staging","production"],context.operationsRuntime?.environment||"local")}</select><input name="version" value="0.27.0" aria-label="Versão"><input name="commitSha" placeholder="Commit SHA" aria-label="Commit SHA"><button type="submit">Iniciar execução</button><p data-collab-feedback></p></form>`:""}</div>${latestRun(context)}</section>`:""}
    ${settingsSection(context)}
    ${backupSection(context)}
    <section class="operations-safety"><h2>Fronteiras preservadas</h2><ul><li>Sem secrets nas configurações.</li><li>Sem exclusão automática.</li><li>Sem afirmação de backup sem evidência.</li><li>Sem escrita de produção pelo navegador.</li></ul></section>
  `);
}

function auditRows(context){
  const audit=workspace(context).audit||{rows:[],total:0};
  return `<div class="audit-table-wrap"><table class="audit-table"><thead><tr><th>Data</th><th>Ator</th><th>Ação</th><th>Entidade</th><th>Categoria</th><th>Prioridade</th><th>Alterações</th><th>Hash</th></tr></thead><tbody>${audit.rows?.map(row=>`<tr><td>${esc(date(row.createdAt))}</td><td>${esc(row.actorName||"Sistema")}</td><td><code>${esc(row.action)}</code></td><td>${esc(row.entityType)}<small>${esc(row.entityId||"")}</small></td><td>${esc(row.category)}</td><td>${esc(row.severity)}</td><td>${esc((row.changedKeys||[]).join(", ")||"—")}</td><td><code title="${esc(row.eventHash||"")}">${esc((row.eventHash||"").slice(0,12))}</code></td></tr>`).join("")||`<tr><td colspan="8">Sem eventos.</td></tr>`}</tbody></table></div><p><strong>${esc(audit.total||0)}</strong> eventos encontrados.</p>`;
}
function retentionPolicyCard(context,policy){
  return `<article class="retention-policy retention-policy--${esc(policy.risk)}"><header><div><span>${esc(policy.resource_type)}</span><h3>${esc(policy.name)}</h3><small>${esc(policy.code)}</small></div>${statusPill(policy.status)}</header><dl><div><dt>Prazo</dt><dd>${policy.retention_days===0?"Sem prazo automático":`${esc(policy.retention_days)} dias`}</dd></div><div><dt>Ação</dt><dd>${esc(policy.action)}</dd></div><div><dt>Risco</dt><dd>${esc(policy.risk)}</dd></div><div><dt>Automático</dt><dd>Não</dd></div></dl><p>${esc(policy.scope_description)}</p>${hasPermission(context,"retention.manage")&&["delete","anonymize"].includes(policy.action)&&policy.status==="active"?`<form class="retention-preview-form" data-retention-preview-form data-policy-code="${esc(policy.code)}"><label>Ambiente<select name="environment" aria-label="Ambiente da execução">${optionList(["local","staging","production"],context.operationsRuntime?.environment||"local")}</select></label><button type="submit">Gerar preview</button><p data-collab-feedback></p></form>`:""}</article>`;
}
function lifecycleRun(context,run){
  return `<article class="lifecycle-run lifecycle-run--${esc(run.status)}"><header><div><span>${esc(run.environment)} · ${esc(run.policyCode)}</span><h3>${esc(run.id)}</h3><time>${esc(date(run.previewedAt))}</time></div>${statusPill(run.status)}</header><dl><div><dt>Candidatos</dt><dd>${esc(run.candidateCount)}</dd></div><div><dt>Protegidos</dt><dd>${esc(run.excludedByHoldCount)}</dd></div><div><dt>Elegíveis</dt><dd>${esc((run.candidateCount||0)-(run.excludedByHoldCount||0))}</dd></div><div><dt>Afetados</dt><dd>${esc(run.affectedCount||0)}</dd></div></dl><code>${esc((run.candidateHash||"").slice(0,24))}</code>${run.status==="previewed"&&hasPermission(context,"retention.approve")?`<button type="button" data-retention-approve="${esc(run.id)}">Aprovar preview</button>`:""}${["previewed","approved"].includes(run.status)&&hasPermission(context,"retention.manage")?`<button type="button" data-retention-cancel="${esc(run.id)}">Cancelar</button>`:""}${run.status==="approved"?`<p class="retention-protected-action">A aplicação ocorre somente por workflow protegido e service role.</p>`:""}</article>`;
}
export function collaborativeAuditGovernanceView(context,filters={}){
  if(!hasPermission(context,"audit.search")&&!hasPermission(context,"retention.view"))return forbidden(context);
  const data=workspace(context),integrity=data.integrity;
  return collaborativeShell(context,"/area-colaborativa/gestao/auditoria",`
    ${heading("Auditoria e retenção","Pesquisa redigida, cadeia de integridade, legal holds e ciclo protegido de retenção.",`${hasPermission(context,"audit.export")?`<button type="button" class="ml-button ml-button--secondary" data-audit-export>Exportar CSV redigido</button>`:""}${hasPermission(context,"audit.integrity")?`<button type="button" class="ml-button ml-button--primary" data-audit-integrity>Verificar integridade</button>`:""}`)}
    ${hasPermission(context,"audit.integrity")?`<section class="audit-integrity audit-integrity--${integrity?.valid===false?"failed":integrity?.valid?"passed":"pending"}"><div><span>Cadeia de auditoria</span><h2>${integrity?integrity.valid?"Íntegra":"Inconsistente":"Ainda não verificada"}</h2><p>${integrity?`${integrity.checkedCount} eventos verificados · ${date(integrity.verifiedAt)}`:"A verificação recalcula os hashes sem revelar os dados redigidos."}</p></div>${integrity?.firstBreakId?`<strong>Primeira divergência: ${esc(integrity.firstBreakId)}</strong>`:""}</section>`:""}
    ${hasPermission(context,"audit.search")?`<section class="operations-section"><h2>Pesquisa de auditoria</h2><form class="audit-filters" data-audit-search-form><label>Pesquisa<input name="query" value="${esc(filters.query||"")}"></label><label>Ação<input name="action" value="${esc(filters.action||"")}"></label><label>Entidade<input name="entityType" value="${esc(filters.entityType||"")}"></label><label>Categoria<select name="category"><option value="">Todas</option>${optionList(context.operationalGovernanceModel?.audit?.categories||[],filters.category||"")}</select></label><label>Prioridade<select name="severity"><option value="">Todas</option>${optionList(context.operationalGovernanceModel?.audit?.severities||[],filters.severity||"")}</select></label><label>Desde<input type="datetime-local" name="from" value="${esc(filters.from||"")}"></label><label>Até<input type="datetime-local" name="to" value="${esc(filters.to||"")}"></label><button type="submit">Pesquisar</button></form>${auditRows(context)}</section>`:""}
    ${hasPermission(context,"retention.view")?`<section class="operations-section"><h2>Políticas de retenção</h2><div class="retention-grid">${(data.retentionPolicies||[]).map(policy=>retentionPolicyCard(context,policy)).join("")}</div></section>
    <section class="operations-section"><h2>Execuções de retenção</h2><div class="lifecycle-grid">${(data.lifecycleRuns||[]).map(run=>lifecycleRun(context,run)).join("")||`<p class="collab-empty-line">Sem previews.</p>`}</div></section>
    <section class="operations-section"><h2>Legal holds</h2><div class="legal-hold-list">${(data.legalHolds||[]).map(hold=>`<article><div><span>${esc(hold.resourceType)}${hold.entityId?` · ${esc(hold.entityId)}`:" · todos"}</span><h3>${esc(hold.reason)}</h3><time>${esc(date(hold.startsAt))}</time></div>${statusPill(hold.status)}${hold.status==="active"&&hasPermission(context,"legal-holds.manage")?`<button type="button" data-legal-hold-release="${esc(hold.id)}">Libertar</button>`:""}</article>`).join("")||`<p class="collab-empty-line">Sem legal holds.</p>`}</div>${hasPermission(context,"legal-holds.manage")?`<details class="operations-create-panel"><summary>Criar legal hold</summary><form class="collab-form" data-legal-hold-form><div class="form-grid-2"><label>Recurso<input name="resourceType" required></label><label>ID específico <small>Vazio protege todo o recurso</small><input name="entityId"></label></div><label>Fundamentação<textarea name="reason" rows="4" required></textarea></label><label>Termina em<input type="datetime-local" name="endsAt"></label><button type="submit">Criar legal hold</button><p data-collab-feedback></p></form></details>`:""}</section>`:""}
    <section class="operations-safety"><h2>Aplicação de retenção</h2><p>O navegador apenas cria previews, aprova ou cancela. A eliminação real exige service role, conjunto de candidatos inalterado, legal holds revistos e confirmações literais.</p><pre>APPLY_MILREU_RETENTION_POLICY
APPLY_MILREU_PRODUCTION_RETENTION</pre></section>
  `);
}

function incidentCard(incident){
  return `<article class="incident-card incident-card--${esc(incident.severity)}"><header><div><span>${esc(incident.reference)} · ${esc(incident.environment)}</span><h2>${esc(incident.title)}</h2></div>${statusPill(incident.status)}</header><p>${esc(incident.impactSummary||incident.description)}</p><dl><div><dt>Categoria</dt><dd>${esc(incident.category)}</dd></div><div><dt>Severidade</dt><dd>${esc(incident.severity)}</dd></div><div><dt>Detetado</dt><dd>${esc(date(incident.detectedAt))}</dd></div><div><dt>Atualizado</dt><dd>${esc(date(incident.updatedAt))}</dd></div></dl><a href="#/area-colaborativa/gestao/incidentes/${esc(incident.id)}">Abrir incidente</a></article>`;
}
function continuityForm(context,exercise=null){
  const model=context.operationalGovernanceModel?.continuity||{};
  return `<form class="collab-form" data-continuity-exercise-form data-exercise-id="${esc(exercise?.id||"")}"><div class="form-grid-2"><label>Título<input name="title" value="${esc(exercise?.title||"")}" required></label><label>Cenário<select name="scenario">${optionList(model.scenarios||[],exercise?.scenario||"other")}</select></label></div><label>Objetivos<textarea name="objectives" rows="3" required>${esc(exercise?.objectives||"")}</textarea></label><div class="form-grid-3"><label>Estado<select name="status">${optionList(model.statuses||[],exercise?.status||"planned")}</select></label><label>Agendado<input type="datetime-local" name="scheduledAt" value="${esc(isoInput(exercise?.scheduledAt))}"></label><label>Coordenador<select name="coordinatorUserId">${memberOptions(context,exercise?.coordinatorUserId)}</select></label></div><div class="form-grid-3"><label>RTO alvo<input type="number" min="1" name="targetRtoMinutes" value="${esc(exercise?.targetRtoMinutes??"")}"></label><label>RPO alvo<input type="number" min="0" name="targetRpoMinutes" value="${esc(exercise?.targetRpoMinutes??"")}"></label><label>Recuperação real<input type="number" min="0" name="actualRecoveryMinutes" value="${esc(exercise?.actualRecoveryMinutes??"")}"></label></div><label>Resultado<textarea name="resultSummary" rows="3">${esc(exercise?.resultSummary||"")}</textarea></label><label>Evidência<input name="evidenceReference" value="${esc(exercise?.evidenceReference||"")}"></label><button type="submit">Guardar exercício</button><p data-collab-feedback></p></form>`;
}
export function collaborativeIncidentsContinuityView(context){
  if(!hasPermission(context,"incidents.view")&&!hasPermission(context,"continuity.view"))return forbidden(context);
  const data=workspace(context),model=context.operationalGovernanceModel?.incident||{};
  return collaborativeShell(context,"/area-colaborativa/gestao/incidentes",`
    ${heading("Incidentes e continuidade","Registo, resposta, ações corretivas, exercícios e recuperação.",`<button type="button" class="ml-button ml-button--secondary" data-operations-refresh>Atualizar</button>`)}
    ${hasPermission(context,"incidents.view")?`<section class="operations-section"><h2>Incidentes</h2><div class="incident-grid">${(data.incidents||[]).map(incidentCard).join("")||`<p class="collab-empty-line">Sem incidentes.</p>`}</div>${hasPermission(context,"incidents.manage")?`<details class="operations-create-panel"><summary>Abrir incidente</summary><form class="collab-form" data-incident-create-form><label>Título<input name="title" required></label><label>Descrição<textarea name="description" rows="4" required></textarea></label><div class="form-grid-3"><label>Categoria<select name="category">${optionList(model.categories||[],"other")}</select></label><label>Severidade<select name="severity">${optionList(model.severities||[],"sev-3")}</select></label><label>Ambiente<select name="environment">${optionList(["local","staging","production","external"],context.operationsRuntime?.environment||"local")}</select></label></div><label>Impacto<textarea name="impactSummary" rows="3"></textarea></label><label>Responsável<select name="ownerUserId">${memberOptions(context)}</select></label><button type="submit">Abrir incidente</button><p data-collab-feedback></p></form></details>`:""}</section>`:""}
    ${hasPermission(context,"continuity.view")?`<section class="operations-section"><h2>Exercícios de continuidade</h2><div class="continuity-grid">${(data.continuityExercises||[]).map(exercise=>`<details class="continuity-exercise"><summary><div><span>${esc(exercise.scenario)}</span><h3>${esc(exercise.title)}</h3><small>${esc(date(exercise.scheduledAt))}</small></div>${statusPill(exercise.status)}</summary><dl><div><dt>RTO alvo</dt><dd>${exercise.targetRtoMinutes??"—"} min</dd></div><div><dt>RPO alvo</dt><dd>${exercise.targetRpoMinutes??"—"} min</dd></div><div><dt>Recuperação real</dt><dd>${exercise.actualRecoveryMinutes??"—"} min</dd></div></dl><p>${esc(exercise.objectives)}</p>${hasPermission(context,"continuity.manage")?continuityForm(context,exercise):""}</details>`).join("")||`<p class="collab-empty-line">Sem exercícios.</p>`}</div>${hasPermission(context,"continuity.manage")?`<details class="operations-create-panel"><summary>Criar exercício</summary>${continuityForm(context)}</details>`:""}</section>`:""}
  `);
}

function incidentActionForm(context,incidentId,action=null){
  return `<form class="collab-form compact-form" data-incident-action-form data-incident-id="${esc(incidentId)}" data-action-id="${esc(action?.id||"")}"><label>Título<input name="title" value="${esc(action?.title||"")}" required></label><label>Descrição<textarea name="description" rows="2">${esc(action?.description||"")}</textarea></label><div class="form-grid-3"><label>Estado<select name="status">${optionList(context.operationalGovernanceModel?.incident?.actionStatuses||[],action?.status||"pending")}</select></label><label>Prioridade<select name="priority">${optionList(["low","normal","high","urgent"],action?.priority||"normal")}</select></label><label>Prazo<input type="datetime-local" name="dueAt" value="${esc(isoInput(action?.dueAt))}"></label></div><label>Responsável<select name="assignedTo">${memberOptions(context,action?.assignedTo)}</select></label><button type="submit">Guardar ação</button><p data-collab-feedback></p></form>`;
}
export function collaborativeIncidentDetailView(context,incidentId){
  if(!hasPermission(context,"incidents.view"))return forbidden(context);
  const data=workspace(context),incident=(data.incidents||[]).find(item=>item.id===incidentId);
  if(!incident)return collaborativeShell(context,"/area-colaborativa/gestao/incidentes",heading("Incidente não encontrado","O registo não existe ou não está acessível."));
  const updates=(data.incidentUpdates||[]).filter(item=>item.incidentId===incidentId);
  const actions=(data.incidentActions||[]).filter(item=>item.incidentId===incidentId);
  const model=context.operationalGovernanceModel?.incident||{};
  return collaborativeShell(context,"/area-colaborativa/gestao/incidentes",`
    ${heading(`${incident.reference} — ${incident.title}`,incident.description,`<a class="ml-button ml-button--secondary" href="#/area-colaborativa/gestao/incidentes">Voltar</a>`)}
    <section class="incident-detail incident-detail--${esc(incident.severity)}"><div><span>${esc(incident.environment)} · ${esc(incident.category)}</span><strong>${esc(incident.severity)}</strong></div>${statusPill(incident.status)}<p>${esc(incident.impactSummary||"Impacto ainda por consolidar.")}</p></section>
    ${hasPermission(context,"incidents.manage")?`<section class="operations-section"><h2>Atualizar incidente</h2><form class="collab-form" data-incident-update-form data-incident-id="${esc(incidentId)}"><div class="form-grid-2"><label>Estado<select name="status">${optionList(model.statuses||[],incident.status)}</select></label><label>Responsável<select name="ownerUserId">${memberOptions(context,incident.ownerUserId)}</select></label></div><label>Impacto<textarea name="impactSummary" rows="3">${esc(incident.impactSummary||"")}</textarea></label><label>Resumo público opcional<textarea name="publicSummary" rows="3">${esc(incident.publicSummary||"")}</textarea></label><label>Atualização obrigatória<textarea name="updateBody" rows="4" required></textarea></label><button type="submit">Guardar atualização</button><p data-collab-feedback></p></form></section>`:""}
    <section class="operations-section"><h2>Linha temporal</h2><div class="incident-timeline">${updates.map(update=>`<article><span>${esc(update.updateType)}</span><time>${esc(date(update.createdAt))}</time><p>${esc(update.body)}</p>${update.statusAfter?statusPill(update.statusAfter):""}</article>`).join("")||`<p class="collab-empty-line">Sem atualizações.</p>`}</div>${hasPermission(context,"incidents.manage")?`<details class="operations-create-panel"><summary>Adicionar nota</summary><form class="collab-form compact-form" data-incident-note-form data-incident-id="${esc(incidentId)}"><label>Tipo<select name="updateType">${optionList(model.updateTypes||[],"analysis")}</select></label><label>Nota<textarea name="body" rows="4" required></textarea></label><button type="submit">Adicionar</button><p data-collab-feedback></p></form></details>`:""}</section>
    <section class="operations-section"><h2>Ações corretivas</h2><div class="incident-action-grid">${actions.map(action=>`<details><summary><div><span>${esc(action.priority)}</span><h3>${esc(action.title)}</h3></div>${statusPill(action.status)}</summary>${incidentActionForm(context,incidentId,action)}</details>`).join("")||`<p class="collab-empty-line">Sem ações.</p>`}</div>${hasPermission(context,"incidents.manage")?`<details class="operations-create-panel"><summary>Criar ação</summary>${incidentActionForm(context,incidentId)}</details>`:""}</section>
  `);
}
function forbidden(context){
  return collaborativeShell(context,"",heading("Acesso condicionado","O seu perfil não possui permissão para esta funcionalidade."));
}
