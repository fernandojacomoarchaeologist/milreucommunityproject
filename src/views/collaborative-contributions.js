/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { collaborativeShell,statusPill } from "../components/collaborative-layout.js";
import { hasPermission } from "../collab/permissions.js";

const esc=value=>String(value??"").replace(/[&<>"]/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[char]));
const date=value=>value?new Intl.DateTimeFormat("pt-PT",{dateStyle:"medium",timeStyle:"short"}).format(new Date(value)):"—";

function heading(eyebrow,title,description="",actions=""){
  return `<header class="collab-page-heading collab-page-heading--actions"><div><span>${esc(eyebrow)}</span><h1>${esc(title)}</h1>${description?`<p>${esc(description)}</p>`:""}</div>${actions?`<div class="collab-heading-actions">${actions}</div>`:""}</header>`;
}
function workspace(context){return context.contributionWorkspace||{contributions:[],submitters:[],consents:[],files:[],targets:[],assignments:[],events:[],decisions:[],proposals:[],withdrawals:[]};}
function label(context,collection,code){return context.contributionModel?.[collection]?.find(item=>item.code===code)?.name||code||"—";}
function options(items,selected="",empty="Selecione"){return `<option value="">${esc(empty)}</option>${(items||[]).map(item=>`<option value="${esc(item.code)}" ${item.code===selected?"selected":""}>${esc(item.name)}</option>`).join("")}`;}
function contribution(context,id){return workspace(context).contributions.find(item=>item.id===id);}
function submitter(context,row){return workspace(context).submitters.find(item=>item.id===row?.submitter_id);}
function files(context,id){return workspace(context).files.filter(item=>item.contribution_id===id);}
function targets(context,id){return workspace(context).targets.filter(item=>item.contribution_id===id);}
function events(context,id){return workspace(context).events.filter(item=>item.contribution_id===id).sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));}
function decisions(context,id){return workspace(context).decisions.filter(item=>item.contribution_id===id).sort((a,b)=>new Date(b.decided_at)-new Date(a.decided_at));}
function proposals(context,id){return workspace(context).proposals.filter(item=>item.contribution_id===id);}
function withdrawals(context,id){return workspace(context).withdrawals.filter(item=>item.contribution_id===id);}
function ownRows(context){return workspace(context).contributions.filter(item=>item.submitter_user_id===context.session?.user?.id);}
function canModerate(context){return hasPermission(context,"contributions.moderate")||hasPermission(context,"contributions.view-all");}

function contributionCard(context,row,management=false){
  const person=submitter(context,row);
  return `<article class="contribution-card contribution-card--${esc(row.status)}">
    <div class="contribution-card__meta"><span>${esc(label(context,"contributionTypes",row.contribution_type))}</span>${statusPill(row.status)}<time>${esc(date(row.submitted_at))}</time></div>
    <div><h2>${esc(row.title)}</h2><p>${esc(row.summary||row.content?.slice(0,220)||"Sem resumo.")}</p>
      <dl><div><dt>Referência</dt><dd>${esc(row.public_reference)}</dd></div>${management?`<div><dt>Participante</dt><dd>${esc(person?.display_name||"—")}</dd></div><div><dt>Prioridade</dt><dd>${esc(row.priority)}</dd></div>`:""}</dl>
    </div>
    <a href="#${management?`/area-colaborativa/gestao/contributos/${encodeURIComponent(row.id)}`:`/area-colaborativa/contributos/${encodeURIComponent(row.id)}`}">${management?"Rever":"Abrir"}</a>
  </article>`;
}

function contributionForm(context,member=true){
  const profile=context.profile||{};
  return `<form class="collab-form contribution-member-form" data-member-contribution-form>
    <fieldset><legend>Contributo</legend>
      <div class="form-grid-2">
        <label>Tipo<select name="contributionType" required>${options(context.contributionModel?.contributionTypes)}</select></label>
        <label>Título<input name="title" required maxlength="180"></label>
      </div>
      <label>Descrição ou relato<textarea name="content" rows="8" required></textarea></label>
      <label>Resumo<textarea name="summary" rows="3"></textarea></label>
      <div class="form-grid-2"><label>Local relacionado<input name="placeText"></label><label>Data ou período<input name="dateText"></label></div>
      <label>Contexto histórico ou familiar<textarea name="historicalContext" rows="4"></textarea></label>
      <label>Origem da informação<textarea name="sourceContext" rows="3"></textarea></label>
    </fieldset>
    <fieldset><legend>Relação</legend>
      <div class="form-grid-2"><label>Área<select name="targetType">${options(context.contributionModel?.targetTypes,"general","Selecione")}</select></label><label>Identificador<input name="targetIdentifier" placeholder="Ex.: MM202603"></label><label>Relação<select name="relationType">${options(context.contributionModel?.targetRelations,"supports","Selecione")}</select></label></div>
      <label>Nota<textarea name="targetNote" rows="3"></textarea></label>
    </fieldset>
    <fieldset><legend>Ficheiros</legend><label>Fotografias ou documentos<input type="file" name="files" multiple accept=".jpg,.jpeg,.png,.webp,.tif,.tiff,.pdf,.txt,.docx"><small>Até 5 ficheiros, 25 MB cada. Permanecem privados durante a análise.</small></label><label>Direitos dos ficheiros<textarea name="fileRightsNote" rows="3"></textarea></label></fieldset>
    <fieldset><legend>Crédito e utilização</legend>
      <div class="form-grid-2"><label>Crédito<select name="attributionPreference" required>${options(context.contributionModel?.attributionPreferences,"discuss","Selecione")}</select></label><label>Âmbito autorizado<select name="requestedUsageScope" required>${options(context.contributionModel?.usageScopes,"review-only","Selecione")}</select></label></div>
      <label>Declaração de direitos<textarea name="rightsDeclaration" rows="4" required></textarea></label>
      <input type="hidden" name="displayName" value="${esc(profile.display_name||"")}"><input type="hidden" name="email" value="${esc(profile.email||"")}">
      <label class="collab-check"><input type="checkbox" name="privacyAccepted" required>Aceito o tratamento dos dados para análise.</label>
      <label class="collab-check"><input type="checkbox" name="rightsConfirmed" required>Confirmo a legitimidade para partilhar.</label>
      <label class="collab-check"><input type="checkbox" name="projectUseAuthorised" required>Autorizo a análise e conservação no âmbito indicado.</label>
      <label class="collab-check"><input type="checkbox" name="contactAllowed" checked>Autorizo contacto.</label>
      <label class="collab-check"><input type="checkbox" name="publicAttributionAuthorised">Autorizo a forma de crédito indicada, caso exista uso público aprovado.</label>
    </fieldset>
    <button type="submit" class="ml-button ml-button--primary">Submeter contributo</button><p data-collab-feedback aria-live="polite"></p>
  </form>`;
}

export function collaborativeContributionsView(context){
  if(!hasPermission(context,"contributions.view-own")&&!hasPermission(context,"contributions.submit"))return forbidden(context);
  const rows=ownRows(context);
  return collaborativeShell(context,"/area-colaborativa/contributos",`
    ${heading("Contributos","Os meus contributos","Acompanhe submissões, pedidos de informação e decisões comunicadas.",`<a class="ml-button ml-button--primary" href="#/area-colaborativa/contributos/novo">Novo contributo</a>`)}
    <section class="contribution-own-summary"><article><strong>${rows.length}</strong><span>Total</span></article><article><strong>${rows.filter(item=>["submitted","triage","under-review","needs-info"].includes(item.status)).length}</strong><span>Em análise</span></article><article><strong>${rows.filter(item=>["accepted","partially-accepted","incorporated"].includes(item.status)).length}</strong><span>Aceites ou incorporados</span></article></section>
    <div class="contribution-card-list">${rows.length?rows.map(row=>contributionCard(context,row,false)).join(""):`<div class="collab-empty-state"><h2>Ainda não submeteu contributos</h2><p>Pode partilhar uma fotografia, memória, correção, documento ou referência.</p></div>`}</div>
  `);
}

export function collaborativeContributionNewView(context){
  if(!hasPermission(context,"contributions.submit"))return forbidden(context);
  return collaborativeShell(context,"/area-colaborativa/contributos/novo",`${heading("Contributos","Novo contributo","A submissão será analisada antes de qualquer utilização.")}${contributionForm(context,true)}`);
}

export function collaborativeContributionDetailView(context,id,management=false){
  const row=contribution(context,id);
  if(!row)return collaborativeShell(context,"",heading("Contributos","Registo não encontrado"));
  const isOwner=row.submitter_user_id===context.session?.user?.id;
  if(!isOwner&&!canModerate(context))return forbidden(context);
  const person=submitter(context,row),fileRows=files(context,id),targetRows=targets(context,id),eventRows=events(context,id),decisionRows=decisions(context,id),proposalRows=proposals(context,id),withdrawalRows=withdrawals(context,id);
  const route=management?`/area-colaborativa/gestao/contributos/${id}`:`/area-colaborativa/contributos/${id}`;
  return collaborativeShell(context,route,`
    ${heading(management?"Moderação":"Contributo",row.title,row.public_reference,management?`<a class="ml-button ml-button--secondary" href="#/area-colaborativa/gestao/contributos">Voltar à fila</a>`:`<a class="ml-button ml-button--secondary" href="#/area-colaborativa/contributos">Voltar</a>`)}
    <section class="contribution-detail-grid">
      <article class="contribution-detail-main">
        <div class="contribution-detail-status">${statusPill(row.status)}<span>${esc(label(context,"contributionTypes",row.contribution_type))}</span><time>${esc(date(row.submitted_at))}</time></div>
        <h2>Conteúdo</h2><p class="contribution-long-text">${esc(row.content)}</p>
        ${row.historical_context?`<h3>Contexto histórico ou familiar</h3><p>${esc(row.historical_context)}</p>`:""}
        ${row.source_context?`<h3>Origem informada</h3><p>${esc(row.source_context)}</p>`:""}
        <dl class="contribution-facts"><div><dt>Local</dt><dd>${esc(row.place_text||"—")}</dd></div><div><dt>Data ou período</dt><dd>${esc(row.date_text||"—")}</dd></div><div><dt>Crédito</dt><dd>${esc(label(context,"attributionPreferences",row.attribution_preference))}</dd></div><div><dt>Âmbito</dt><dd>${esc(label(context,"usageScopes",row.requested_usage_scope))}</dd></div></dl>
        <h3>Declaração de direitos</h3><p>${esc(row.rights_declaration)}</p>
        ${targetRows.length?`<h3>Relações indicadas</h3><ul>${targetRows.map(item=>`<li>${esc(label(context,"targetTypes",item.target_type))}: ${esc(item.target_identifier||"geral")} — ${esc(label(context,"targetRelations",item.relation_type))}</li>`).join("")}</ul>`:""}
      </article>
      <aside class="contribution-detail-aside">
        <h2>Participante</h2><dl><dt>Nome</dt><dd>${esc(person?.display_name||"—")}</dd><dt>E-mail</dt><dd>${management?esc(person?.email||"—"):"Oculto nesta vista"}</dd><dt>Localidade</dt><dd>${esc(person?.locality||"—")}</dd><dt>Contacto</dt><dd>${esc(person?.preferred_contact||"—")}</dd></dl>
        <h2>Mensagem comunicada</h2><p>${esc(row.public_message||"Sem mensagem adicional.")}</p>
        ${withdrawalRows.length?`<div class="withdrawal-alert"><strong>Pedido de retirada</strong><p>${esc(withdrawalRows[0].reason)}</p>${statusPill(withdrawalRows[0].status)}</div>`:""}
      </aside>
    </section>

    <section class="contribution-files"><h2>Ficheiros</h2>${fileRows.length?`<div class="contribution-file-list">${fileRows.map(file=>`<article><div><strong>${esc(file.original_filename)}</strong><span>${esc(file.mime_type)} · ${Math.round(file.size_bytes/1024)} KB</span></div>${statusPill(file.status)}${management&&hasPermission(context,"contributions.files.review")?`<div><button type="button" data-contribution-file-link="${esc(file.id)}">Abrir temporariamente</button><button type="button" data-contribution-file-review="accepted" data-file-id="${esc(file.id)}">Aceitar</button><button type="button" data-contribution-file-review="rejected" data-file-id="${esc(file.id)}">Rejeitar</button></div>`:""}</article>`).join("")}</div>`:`<p class="collab-empty-line">Sem ficheiros.</p>`}</section>

    ${management?moderationWorkspace(context,row,eventRows,decisionRows,proposalRows,withdrawalRows):submitterHistory(context,eventRows,decisionRows)}
  `);
}

function submitterHistory(context,eventRows,decisionRows){
  const publicEvents=eventRows.filter(item=>item.visible_to_submitter);
  return `<section class="contribution-history"><h2>Histórico comunicado</h2>${publicEvents.length?publicEvents.map(item=>`<article><time>${esc(date(item.created_at))}</time><strong>${esc(item.to_status?label(context,"statuses",item.to_status):item.event_type)}</strong><p>${esc(item.note||"")}</p></article>`).join(""):`<p class="collab-empty-line">Sem atualizações adicionais.</p>`}${decisionRows.length?`<h2>Decisões</h2>${decisionRows.map(item=>`<article><time>${esc(date(item.decided_at))}</time><strong>${esc(label(context,"decisionTypes",item.decision_type))}</strong><p>${esc(item.public_message||"Decisão registada.")}</p></article>`).join("")}`:""}</section>`;
}

function moderationWorkspace(context,row,eventRows,decisionRows,proposalRows,withdrawalRows){
  const reviewers=(context.management?.members||[]).filter(member=>member.membership?.status==="active"&&(member.roles||[]).some(role=>["master","coordinator","reviewer","researcher"].includes(role)));
  return `<section class="contribution-moderation-workspace">
    <div class="moderation-column">
      <h2>Atribuição</h2>
      <form class="collab-form compact-form" data-contribution-assignment-form data-contribution-id="${esc(row.id)}">
        <label>Revisor<select name="reviewerUserId" required><option value="">Selecione</option>${reviewers.map(member=>`<option value="${esc(member.user_id)}" ${member.user_id===row.assigned_to?"selected":""}>${esc(member.display_name||member.email)}</option>`).join("")}</select></label>
        <label>Papel<select name="assignmentRole"><option value="triage">Triagem</option><option value="reviewer">Revisão</option><option value="rights">Direitos</option><option value="editorial">Editorial</option><option value="research">Investigação</option></select></label>
        <label>Nota<textarea name="note" rows="2"></textarea></label><button type="submit">Atribuir</button><p data-collab-feedback></p>
      </form>

      <h2>Decisão ou encaminhamento</h2>
      <form class="collab-form compact-form" data-contribution-moderation-form data-contribution-id="${esc(row.id)}">
        <label>Ação<select name="action" required><option value="">Selecione</option><option value="triage">Colocar em triagem</option><option value="review">Colocar em revisão</option><option value="request-info">Solicitar informação</option><option value="accept">Aceitar</option><option value="partial">Aceitar parcialmente</option><option value="reject">Não aceitar</option><option value="withdraw">Retirar</option><option value="incorporate">Marcar como incorporado</option><option value="archive">Arquivar</option></select></label>
        <label>Justificação interna<textarea name="rationale" rows="4" required></textarea></label>
        <label>Mensagem ao participante<textarea name="publicMessage" rows="3"></textarea></label>
        <button type="submit" class="ml-button ml-button--primary">Registar ação</button><p data-collab-feedback></p>
      </form>

      ${["accepted","partially-accepted"].includes(row.status)?`<h2>Proposta de incorporação</h2><form class="collab-form compact-form" data-incorporation-proposal-form data-contribution-id="${esc(row.id)}"><label>Destino<select name="destination" required>${options(context.contributionModel?.incorporationDestinations)}</select></label><label>Identificador alvo<input name="targetIdentifier" placeholder="Ex.: MM202603"></label><label>Proposta<textarea name="summary" rows="4" required></textarea></label><button type="submit">Criar proposta</button><p data-collab-feedback></p></form>`:""}
    </div>
    <div class="moderation-column">
      <h2>Histórico interno</h2>${eventRows.length?eventRows.map(item=>`<article class="moderation-event"><time>${esc(date(item.created_at))}</time><strong>${esc(item.event_type)}</strong><span>${esc(item.from_status||"—")} → ${esc(item.to_status||"—")}</span><p>${esc(item.note||"")}</p></article>`).join(""):`<p>Sem eventos.</p>`}
      ${decisionRows.length?`<h2>Decisões</h2>${decisionRows.map(item=>`<article class="moderation-event"><strong>${esc(label(context,"decisionTypes",item.decision_type))}</strong><p>${esc(item.rationale)}</p><small>${esc(date(item.decided_at))}</small></article>`).join("")}`:""}
      ${proposalRows.length?`<h2>Propostas</h2>${proposalRows.map(item=>`<article class="moderation-event"><strong>${esc(label(context,"incorporationDestinations",item.destination))}</strong>${statusPill(item.status)}<p>${esc(item.proposal_summary)}</p></article>`).join("")}`:""}
      ${withdrawalRows.length&&hasPermission(context,"withdrawals.manage")?`<h2>Retirada</h2>${withdrawalRows.map(item=>`<article class="withdrawal-review"><p>${esc(item.reason)}</p>${statusPill(item.status)}<div><button type="button" data-withdrawal-resolve="under-review" data-request-id="${esc(item.id)}">Em análise</button><button type="button" data-withdrawal-resolve="approved" data-request-id="${esc(item.id)}">Aprovar</button><button type="button" data-withdrawal-resolve="rejected" data-request-id="${esc(item.id)}">Recusar</button><button type="button" data-withdrawal-resolve="completed" data-request-id="${esc(item.id)}">Concluir</button></div></article>`).join("")}`:""}
    </div>
  </section>`;
}

export function collaborativeContributionModerationView(context,filters={}){
  if(!canModerate(context))return forbidden(context);
  const rows=workspace(context).contributions;
  const query=String(filters.query||"").toLowerCase(),status=filters.status||"",type=filters.type||"",assignee=filters.assignee||"";
  const filtered=rows.filter(row=>{
    const person=submitter(context,row);
    return(!query||`${row.title} ${row.public_reference} ${person?.display_name||""} ${person?.email||""}`.toLowerCase().includes(query))
      &&(!status||row.status===status)&&(!type||row.contribution_type===type)&&(!assignee||row.assigned_to===assignee);
  });
  const open=rows.filter(row=>["submitted","triage","needs-info","under-review"].includes(row.status)).length;
  const rights=rows.filter(row=>row.contribution_type==="rights-credit").length;
  const withdrawalsOpen=workspace(context).withdrawals.filter(item=>["submitted","under-review","approved"].includes(item.status)).length;
  return collaborativeShell(context,"/area-colaborativa/gestao/contributos",`
    ${heading("Moderação","Contributos comunitários","Triagem, revisão, direitos, decisões e encaminhamento sem alteração automática do conteúdo canónico.")}
    <section class="contribution-moderation-metrics"><article><strong>${rows.length}</strong><span>Total</span></article><article><strong>${open}</strong><span>Em análise</span></article><article><strong>${rights}</strong><span>Direitos e créditos</span></article><article><strong>${withdrawalsOpen}</strong><span>Retiradas abertas</span></article></section>
    <form class="moderation-filters" data-contribution-moderation-filters>
      <label>Pesquisar<input type="search" name="query" value="${esc(filters.query||"")}"></label>
      <label>Estado<select name="status">${options(context.contributionModel?.statuses,status,"Todos")}</select></label>
      <label>Tipo<select name="type">${options(context.contributionModel?.contributionTypes,type,"Todos")}</select></label>
      <label>Responsável<select name="assignee"><option value="">Todos</option>${(context.management?.members||[]).filter(member=>member.membership?.status==="active").map(member=>`<option value="${esc(member.user_id)}" ${member.user_id===assignee?"selected":""}>${esc(member.display_name||member.email)}</option>`).join("")}</select></label>
      <button type="submit">Aplicar</button>
    </form>
    <div class="contribution-card-list">${filtered.length?filtered.map(row=>contributionCard(context,row,true)).join(""):`<p class="collab-empty-line">Nenhum contributo corresponde aos filtros.</p>`}</div>
  `);
}

function forbidden(context){return collaborativeShell(context,"",heading("Acesso condicionado","Contributos indisponíveis","O seu perfil não possui permissão para esta área."));}
