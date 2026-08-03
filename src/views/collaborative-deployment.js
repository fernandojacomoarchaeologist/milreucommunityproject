/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { collaborativeShell,statusPill } from "../components/collaborative-layout.js";
import { hasPermission } from "../collab/permissions.js";

const esc=value=>String(value??"").replace(/[&<>"]/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[char]));
const date=value=>value?new Intl.DateTimeFormat("pt-PT",{dateStyle:"medium",timeStyle:"short"}).format(new Date(value)):"—";

function heading(title,description,actions=""){
  return `<header class="collab-page-heading collab-page-heading--actions"><div><span>08G · Operação</span><h1>${esc(title)}</h1><p>${esc(description)}</p></div>${actions?`<div class="collab-heading-actions">${actions}</div>`:""}</header>`;
}

function workspace(context){
  return context.deploymentWorkspace||{environments:[],authPolicy:null,runs:[],checks:[],catalog:[],readiness:null};
}

function environmentName(context,code){
  return context.homologationModel?.environments?.find(item=>item.code===code)?.name||code;
}

function environmentForRun(context,run){
  return workspace(context).environments.find(item=>item.id===run.environment_id);
}

function checksForRun(context,runId){
  return workspace(context).checks.filter(item=>item.run_id===runId)
    .sort((a,b)=>(a.category||"").localeCompare(b.category||"")||(a.check_code||"").localeCompare(b.check_code||""));
}

function latestRun(context,environmentId){
  return workspace(context).runs
    .filter(item=>item.environment_id===environmentId)
    .sort((a,b)=>new Date(b.created_at)-new Date(a.created_at))[0]||null;
}

function readinessRows(readiness){
  const checks=readiness?.checks||{};
  const labels={
    supabaseConfigured:"Supabase configurado",
    siteUrlConfigured:"URL da aplicação",
    googleOAuthConfigured:"Google OAuth",
    masterEmailConfigured:"E-mail master configurado",
    stagingProjectConfigured:"Projeto de staging",
    productionProjectConfigured:"Projeto de produção",
    separateRemoteProjects:"Staging separado de produção",
    serviceRoleInFrontend:"Service role no frontend",
    demoDisabledForStaging:"Demo desativada em staging",
    demoDisabledForProduction:"Demo desativada em produção",
    httpsValid:"HTTPS",
    productionWritesDisabled:"Escritas de produção desativadas"
  };
  return Object.entries(checks).map(([code,value])=>{
    const good=code==="serviceRoleInFrontend"?!value:Boolean(value);
    return `<li class="${good?"readiness-pass":"readiness-block"}"><span>${good?"✓":"!"}</span><strong>${esc(labels[code]||code)}</strong><small>${good?"Conforme":"Pendente"}</small></li>`;
  }).join("");
}

function environmentCard(context,environment){
  const run=latestRun(context,environment.id);
  return `<article class="deployment-environment deployment-environment--${esc(environment.code)}">
    <div class="deployment-environment__head"><div><span>${esc(environment.code)}</span><h2>${esc(environment.name)}</h2></div>${statusPill(environment.status)}</div>
    <dl>
      <div><dt>Site</dt><dd>${esc(environment.site_url||"Não configurado")}</dd></div>
      <div><dt>Projeto Supabase</dt><dd>${esc(environment.supabase_project_ref?"Configurado":"Não configurado")}</dd></div>
      <div><dt>Callback</dt><dd>${esc(environment.auth_callback_url||"Não configurado")}</dd></div>
      <div><dt>Reset</dt><dd>${environment.allows_reset?"Permitido":"Proibido"}</dd></div>
      <div><dt>Demonstração</dt><dd>${environment.allows_demo?"Permitida":"Desativada"}</dd></div>
      <div><dt>Última verificação</dt><dd>${esc(date(environment.last_verified_at))}</dd></div>
    </dl>
    ${run?`<div class="deployment-latest-run"><span>Última execução</span><strong>${esc(run.version)}</strong>${statusPill(run.status)}<a href="#/area-colaborativa/gestao/homologacao/${esc(run.id)}">Abrir</a></div>`:`<p>Sem execução de homologação.</p>`}
  </article>`;
}

function environmentEditor(context,environment){
  if(!hasPermission(context,"deployment.manage"))return"";
  return `<details class="deployment-editor"><summary>Configurar ${esc(environment.name)}</summary>
    <form class="collab-form compact-form" data-deployment-environment-form>
      <input type="hidden" name="code" value="${esc(environment.code)}">
      <label>Nome<input name="name" value="${esc(environment.name)}" required></label>
      <label>Estado<select name="status">
        ${["unconfigured","configured","testing","blocked","homologated","retired"].map(status=>`<option value="${status}" ${environment.status===status?"selected":""}>${status}</option>`).join("")}
      </select></label>
      <label>URL do site<input name="siteUrl" value="${esc(environment.site_url||"")}" placeholder="${environment.code==="local"?"http://localhost:4173/":"https://..."}"></label>
      <label>Referência do projeto Supabase<input name="projectRef" value="${esc(environment.supabase_project_ref||"")}" autocomplete="off"></label>
      <label>Callback da aplicação<input name="authCallbackUrl" value="${esc(environment.auth_callback_url||"")}" placeholder="${environment.code==="local"?"http://localhost:4173/auth/callback/":"https://.../auth/callback/"}"></label>
      <button type="submit">Guardar ambiente</button><p data-collab-feedback></p>
    </form>
  </details>`;
}

function authPolicy(context){
  const policy=workspace(context).authPolicy||{};
  const profile=context.deploymentProfile||{};
  return `<section class="deployment-auth-policy">
    <div class="section-heading-inline"><div><span>Autenticação</span><h2>Google OAuth e acesso</h2></div>${statusPill(policy.policy_status||"draft")}</div>
    <div class="deployment-auth-contract">
      <article><strong>Provider</strong><span>Google</span></article>
      <article><strong>Pré-autorização</strong><span>${policy.require_preauthorization!==false?"Obrigatória":"Desativada"}</span></article>
      <article><strong>Tokens do Google</strong><span>${policy.store_provider_tokens?"Armazenados":"Não armazenados"}</span></article>
      <article><strong>Master mínimo</strong><span>${esc(policy.minimum_active_masters||1)}</span></article>
      <article><strong>OAuth no perfil local</strong><span>${profile.googleOAuth?.enabled?"Marcado como configurado":"Pendente"}</span></article>
      <article><strong>Domínios permitidos</strong><span>${esc((policy.allowed_email_domains||[]).join(", ")||"Qualquer domínio, sujeito a aprovação")}</span></article>
    </div>
    ${hasPermission(context,"auth.policy.manage")?`<form class="collab-form compact-form deployment-auth-form" data-auth-policy-form>
      <label class="collab-check"><input type="checkbox" name="googleEnabled" ${policy.google_enabled?"checked":""}>Google OAuth configurado no ambiente</label>
      <label>Domínios permitidos <small>Separados por vírgula. Vazio mantém qualquer conta Google sujeita a pré-autorização.</small><input name="allowedEmailDomains" value="${esc((policy.allowed_email_domains||[]).join(", "))}"></label>
      <label>Expiração da sessão em minutos<input type="number" min="15" max="1440" name="sessionExpiryMinutes" value="${esc(policy.session_expiry_minutes||60)}"></label>
      <label>Estado<select name="policyStatus">${["draft","testing","approved","suspended"].map(status=>`<option value="${status}" ${policy.policy_status===status?"selected":""}>${status}</option>`).join("")}</select></label>
      <button type="submit">Guardar política</button><p data-collab-feedback></p>
    </form>`:""}
  </section>`;
}

function startRunForm(context){
  if(!hasPermission(context,"homologation.run"))return"";
  const environments=workspace(context).environments.filter(item=>item.status!=="retired");
  return `<section class="homologation-start"><h2>Nova execução</h2>
    <form class="collab-form compact-form" data-homologation-start-form>
      <label>Ambiente<select name="environmentCode" required><option value="">Selecione</option>${environments.map(item=>`<option value="${esc(item.code)}">${esc(item.name)}</option>`).join("")}</select></label>
      <label>Versão<input name="version" value="0.31.0" required></label>
      <label>Commit SHA<input name="commitSha" pattern="[0-9a-fA-F]{7,64}" placeholder="Opcional"></label>
      <button type="submit">Iniciar homologação</button><p data-collab-feedback></p>
    </form>
  </section>`;
}

function runsTable(context){
  const rows=[...workspace(context).runs].sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
  return `<section class="homologation-history"><h2>Execuções</h2>${rows.length?`<div class="homologation-run-list">${rows.map(run=>{
    const environment=environmentForRun(context,run);
    const checks=checksForRun(context,run.id),passed=checks.filter(item=>item.status==="passed").length;
    return `<article><div><span>${esc(environment?.name||"Ambiente")}</span><strong>${esc(run.version)}</strong><small>${esc(run.commit_sha||"Sem SHA")}</small></div><div>${statusPill(run.status)}<span>${passed}/${checks.length} checks aprovados</span><time>${esc(date(run.created_at))}</time></div><a href="#/area-colaborativa/gestao/homologacao/${esc(run.id)}">Abrir execução</a></article>`;
  }).join("")}</div>`:`<p class="collab-empty-line">Ainda não existem execuções.</p>`}</section>`;
}

export function collaborativeDeploymentHomologationView(context){
  if(!hasPermission(context,"homologation.view")&&!hasPermission(context,"deployment.view"))return forbidden(context);
  const profile=context.deploymentProfile||{},readiness=context.deploymentReadiness||{};
  return collaborativeShell(context,"/area-colaborativa/gestao/homologacao",`
    ${heading("Implantação e homologação","Validação dos ambientes, Google OAuth, master, migrations, RLS, storage e fluxos antes de qualquer publicação.")}
    <section class="deployment-preflight deployment-preflight--${esc(readiness.status||"configuration-pending")}">
      <div><span>Preflight local</span><h2>${esc(readiness.status||"Pendente")}</h2><p>Ambiente: ${esc(profile.environment||"local")}. O relatório não contém tokens nem o e-mail master.</p></div>
      <ul>${readinessRows(readiness)}</ul>
      ${readiness.blockingItems?.length?`<details><summary>${readiness.blockingItems.length} bloqueios de configuração</summary><ol>${readiness.blockingItems.map(item=>`<li>${esc(item)}</li>`).join("")}</ol></details>`:""}
    </section>
    <section class="deployment-environments"><div class="section-heading-inline"><div><span>Ambientes</span><h2>Local → staging → produção</h2></div><p>Produção nunca é homologada sem staging aprovado para a mesma versão.</p></div>
      <div class="deployment-environment-grid">${workspace(context).environments.map(environment=>environmentCard(context,environment)).join("")}</div>
      <div class="deployment-editors">${workspace(context).environments.map(environment=>environmentEditor(context,environment)).join("")}</div>
    </section>
    ${authPolicy(context)}
    ${startRunForm(context)}
    ${runsTable(context)}
    <section class="deployment-command-guide"><h2>Sequência técnica</h2><ol><li><code>npm run deploy:profile</code></li><li><code>npm run deploy:preflight</code></li><li><code>npm run deploy:oauth-check</code></li><li>Supabase local e testes SQL</li><li>Staging e homologação por perfil</li><li>Produção somente após aprovação literal</li></ol></section>
  `);
}

function checkEditor(context,run,check){
  if(!hasPermission(context,"homologation.check"))return"";
  return `<form class="homologation-check-form" data-homologation-check-form data-run-id="${esc(run.id)}" data-check-code="${esc(check.check_code)}">
    <select name="status">${["pending","running","passed","failed","blocked","not-applicable"].map(status=>`<option value="${status}" ${check.status===status?"selected":""}>${status}</option>`).join("")}</select>
    <input name="evidence" value="${esc(check.evidence||"")}" placeholder="Evidência, comando ou referência">
    <input name="note" value="${esc(check.note||"")}" placeholder="Nota">
    <button type="submit">Guardar</button><p data-collab-feedback></p>
  </form>`;
}

export function collaborativeHomologationRunView(context,runId){
  if(!hasPermission(context,"homologation.view"))return forbidden(context);
  const run=workspace(context).runs.find(item=>item.id===runId);
  if(!run)return collaborativeShell(context,"",heading("Execução não encontrada","A referência solicitada não está disponível."));
  const environment=environmentForRun(context,run),checks=checksForRun(context,run.id);
  const grouped=new Map();
  for(const check of checks){const list=grouped.get(check.category)||[];list.push(check);grouped.set(check.category,list);}
  const blockingOpen=checks.filter(item=>item.blocking&&["pending","running"].includes(item.status)).length;
  const blockingFailed=checks.filter(item=>item.blocking&&["failed","blocked"].includes(item.status)).length;
  return collaborativeShell(context,"",`
    ${heading(`${environment?.name||"Ambiente"} — ${run.version}`,`Execução criada em ${date(run.created_at)}.`, `<a class="ml-button ml-button--secondary" href="#/area-colaborativa/gestao/homologacao">Voltar</a>`)}
    <section class="homologation-run-summary"><article><span>Estado</span>${statusPill(run.status)}</article><article><span>Checks</span><strong>${checks.length}</strong></article><article><span>Bloqueantes abertos</span><strong>${blockingOpen}</strong></article><article><span>Bloqueantes falhados</span><strong>${blockingFailed}</strong></article></section>
    ${[...grouped.entries()].map(([category,items])=>`<section class="homologation-check-group"><h2>${esc(context.homologationModel?.checkCategories?.find(item=>item.code===category)?.name||category)}</h2>${items.map(check=>`<article class="homologation-check homologation-check--${esc(check.status)}"><div><span>${check.blocking?"Bloqueante":"Recomendado"}</span><h3>${esc(check.title)}</h3>${statusPill(check.status)}</div>${check.evidence?`<p><strong>Evidência:</strong> ${esc(check.evidence)}</p>`:""}${check.note?`<p><strong>Nota:</strong> ${esc(check.note)}</p>`:""}${checkEditor(context,run,check)}</article>`).join("")}</section>`).join("")}
    ${hasPermission(context,"homologation.run")&&["in-progress","blocked"].includes(run.status)?`<form class="collab-form compact-form homologation-complete-form" data-homologation-complete-form data-run-id="${esc(run.id)}"><label>Resumo da execução<textarea name="summary" rows="4" required></textarea></label><button type="submit">Concluir execução</button><p data-collab-feedback></p></form>`:""}
    ${hasPermission(context,"homologation.approve")&&run.status==="passed"?`<section class="homologation-approval"><h2>Aprovação humana</h2><p>${environment?.code==="production"?"Exige staging aprovado para a mesma versão e confirmação de produção.":"Confirma que a execução foi revista e homologada."}</p><button type="button" data-homologation-approve="${esc(run.id)}" data-environment-code="${esc(environment?.code||"")}">Aprovar homologação</button></section>`:""}
    ${hasPermission(context,"homologation.cancel")&&["planned","in-progress","blocked","passed"].includes(run.status)?`<button type="button" class="homologation-cancel" data-homologation-cancel="${esc(run.id)}">Cancelar execução</button>`:""}
  `);
}

function forbidden(context){
  return collaborativeShell(context,"",heading("Acesso condicionado","O seu perfil não possui permissão para consultar a homologação."));
}
