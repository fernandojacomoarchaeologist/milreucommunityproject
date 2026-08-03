/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { collaborativeShell,statusPill } from "../components/collaborative-layout.js";
import { hasPermission } from "../collab/permissions.js";
import { memoryCard } from "../components/memory-card.js";
import { localised } from "../lib/i18n.js";
import { assetUrl } from "../lib/data.js";

const esc=value=>String(value??"").replace(/[&<>"]/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[char]));
const date=value=>value?new Intl.DateTimeFormat("pt-PT",{dateStyle:"medium",timeStyle:"short"}).format(new Date(value)):"—";

function heading(eyebrow,title,description="",actions=""){
  return `<header class="collab-page-heading collab-page-heading--actions"><div><span>${esc(eyebrow)}</span><h1>${esc(title)}</h1>${description?`<p>${esc(description)}</p>`:""}</div>${actions?`<div class="collab-heading-actions">${actions}</div>`:""}</header>`;
}
function reviewWorkspace(context){return context.museumReviewWorkspace||{cycles:[],records:[],proposals:[],comments:[],assignments:[],checks:[],decisions:[],contributionLinks:[],snapshots:[],effects:[],trainingEnrolments:[],lessonProgress:[],assessments:[]};}
function modelLabel(context,collection,code){return context.museumReviewModel?.[collection]?.find(item=>item.code===code)?.name||code||"—";}
function options(items,selected="",empty="Selecione"){return `<option value="">${esc(empty)}</option>${(items||[]).map(item=>`<option value="${esc(item.code)}" ${item.code===selected?"selected":""}>${esc(item.name)}</option>`).join("")}`;}
function canonical(context,memoryId){return (context.canonicalRecords||[]).find(item=>item.id===memoryId);}
function reviewRecord(context,idOrMemory){return reviewWorkspace(context).records.find(item=>item.id===idOrMemory||item.memory_id===idOrMemory);}
function reviewProposals(context,id){return reviewWorkspace(context).proposals.filter(item=>item.review_record_id===id);}
function reviewComments(context,id){return reviewWorkspace(context).comments.filter(item=>item.review_record_id===id).sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));}
function reviewChecks(context,id){return reviewWorkspace(context).checks.filter(item=>item.review_record_id===id);}
function reviewDecisions(context,id){return reviewWorkspace(context).decisions.filter(item=>item.review_record_id===id).sort((a,b)=>new Date(b.decided_at)-new Date(a.decided_at));}
function reviewLinks(context,id){return reviewWorkspace(context).contributionLinks.filter(item=>item.review_record_id===id);}
function pointerTokens(path){return String(path||"").split("/").slice(1).map(token=>token.replaceAll("~1","/").replaceAll("~0","~"));}
function getPointer(value,path){let current=value;for(const token of pointerTokens(path)){if(current==null)return null;current=current[token];}return current;}
function setPointer(value,path,next){const tokens=pointerTokens(path);let current=value;for(let index=0;index<tokens.length-1;index++){const token=tokens[index];if(current[token]==null||typeof current[token]!=="object")current[token]={};current=current[token];}if(tokens.length)current[tokens.at(-1)]=next;return value;}
function pretty(value){if(value===undefined)return"—";if(typeof value==="string")return value||"—";return JSON.stringify(value,null,2);}
function proposalForField(context,recordId,path,statuses=["accepted","submitted","draft"]){return reviewProposals(context,recordId).find(item=>item.field_path===path&&statuses.includes(item.status));}
function trailEnrolment(context,trailCode,userId=context.session?.user?.id){return reviewWorkspace(context).trainingEnrolments.find(item=>item.trail_code===trailCode&&item.user_id===userId);}
function trailProgress(context,trailCode,userId=context.session?.user?.id){
  const enrolment=trailEnrolment(context,trailCode,userId);
  if(!enrolment)return{status:"not-started",percent:0,completedLessons:[]};
  const completed=reviewWorkspace(context).lessonProgress.filter(item=>item.enrolment_id===enrolment.id&&item.status==="completed").map(item=>item.lesson_code);
  return{status:enrolment.status,percent:enrolment.progress_percent||0,completedLessons:completed,completedAt:enrolment.completed_at};
}
function trainingReady(context,action){
  const required=context.museumReviewModel?.requiredTrainingByAction?.[action]||[];
  const missing=required.filter(code=>trailProgress(context,code).status!=="completed");
  return{required,missing,ready:missing.length===0};
}

function renderReferenceContent(content=""){
  const lines=String(content).split(/\r?\n/),html=[];let listOpen=false;
  const closeList=()=>{if(listOpen){html.push("</ul>");listOpen=false;}};
  for(const raw of lines){
    const line=raw.trim();
    if(!line){closeList();continue;}
    if(line.startsWith("### ")){closeList();html.push(`<h3>${esc(line.slice(4))}</h3>`);continue;}
    if(line.startsWith("## ")){closeList();html.push(`<h2>${esc(line.slice(3))}</h2>`);continue;}
    if(line.startsWith("# ")){closeList();html.push(`<h1>${esc(line.slice(2))}</h1>`);continue;}
    if(line.startsWith("- ")){if(!listOpen){html.push("<ul>");listOpen=true;}html.push(`<li>${esc(line.slice(2))}</li>`);continue;}
    if(/^\d+\.\s/.test(line)){if(!listOpen){html.push("<ol>");listOpen="ol";}html.push(`<li>${esc(line.replace(/^\d+\.\s/,""))}</li>`);continue;}
    if(line.startsWith("```")){closeList();continue;}
    closeList();html.push(`<p>${esc(line)}</p>`);
  }
  if(listOpen)html.push(listOpen==="ol"?"</ol>":"</ul>");
  return html.join("");
}

function activeMembers(context){return (context.management?.members||[]).filter(item=>item.membership?.status==="active");}

export function collaborativeLibraryView(context,filters={}){
  if(!hasPermission(context,"library.view")&&!hasPermission(context,"library.manage"))return forbidden(context);
  const query=String(filters.query||"").toLowerCase(),category=filters.category||"";
  const resources=(context.library?.resources||[]).filter(item=>(!query||`${item.title} ${item.category}`.toLowerCase().includes(query))&&(!category||item.category===category));
  const categories=[...new Set((context.library?.resources||[]).map(item=>item.category))].sort();
  return collaborativeShell(context,"/area-colaborativa/biblioteca",`
    ${heading("Biblioteca","Recursos internos","Guias, procedimentos, formação e documentação de apoio ao trabalho colaborativo.")}
    <form class="collab-library-filters" data-library-filters><label>Pesquisar<input type="search" name="query" value="${esc(filters.query||"")}"></label><label>Categoria<select name="category"><option value="">Todas</option>${categories.map(item=>`<option value="${esc(item)}" ${item===category?"selected":""}>${esc(item)}</option>`).join("")}</select></label><button type="submit">Aplicar</button></form>
    <div class="collab-library-grid">${resources.length?resources.map(item=>`<article><span>${esc(item.category)}</span><h2>${esc(item.title)}</h2>${item.summary?`<p>${esc(item.summary)}</p>`:""}<p class="collab-library-source"><strong>Fonte:</strong> <code>${esc(item.path)}</code></p><div class="collab-library-meta">${statusPill(item.status)}${(item.audience||[]).map(a=>`<span>${esc(a)}</span>`).join("")}</div><a href="#/area-colaborativa/biblioteca/${esc(item.code)}">Abrir recurso</a></article>`).join(""):`<p class="collab-empty-line">Nenhum recurso corresponde aos filtros.</p>`}</div>
  `);
}


export function collaborativeLibraryResourceView(context,resourceCode){
  if(!hasPermission(context,"library.view")&&!hasPermission(context,"library.manage"))return forbidden(context);
  const resource=context.library?.resources?.find(item=>item.code===resourceCode);
  if(!resource)return collaborativeShell(context,"",heading("Biblioteca","Recurso não encontrado"));
  return collaborativeShell(context,`/area-colaborativa/biblioteca/${resource.code}`,`
    ${heading("Biblioteca",resource.title,resource.summary||"",`<a class="ml-button ml-button--secondary" href="#/area-colaborativa/biblioteca">Voltar à biblioteca</a>`)}
    <article class="collab-reference-content">${renderReferenceContent(resource.content||"")}</article>
    <p class="collab-reference-visibility">Referência operacional não confidencial, apresentada dentro da Área Colaborativa. Materiais sensíveis devem usar armazenamento privado e RLS.</p>
  `);
}

// 08N: na UI do voluntário mostra-se apenas o percurso Fundamentos.
// Os restantes permanecem no backend (dados/gates intactos), ocultos só aqui.
const VOLUNTEER_VISIBLE_TRAINING_CODES=["project-foundations"];
export function collaborativeTrainingView(context){
  if(!hasPermission(context,"training.view"))return forbidden(context);
  const allTrails=context.trainingTrails?.trails||[];
  const trails=allTrails.filter(trail=>VOLUNTEER_VISIBLE_TRAINING_CODES.includes(trail.code));
  return collaborativeShell(context,"/area-colaborativa/formacao",`
    ${heading("Formação","Percurso de formação","Nesta fase está visível apenas o percurso Fundamentos do Projeto Comunitário de Milreu. Os restantes percursos permanecem no sistema e serão disponibilizados mais tarde.")}
    <div class="training-trail-grid">${trails.map(trail=>{
      const progress=trailProgress(context,trail.code);
      return `<article class="training-trail-card">
        <div><span>${esc(trail.estimatedMinutes)} min</span>${statusPill(progress.status)}</div>
        <h2>${esc(trail.title)}</h2><p>${esc(trail.summary)}</p>
        <div class="training-progress"><span style="width:${Math.max(0,Math.min(100,progress.percent))}%"></span></div><small>${esc(progress.percent)}% concluído · nota mínima ${esc(trail.assessment?.passingScore||80)}%</small>
        <a href="#/area-colaborativa/formacao/${esc(trail.code)}">Abrir percurso</a>
      </article>`;
    }).join("")}</div>
  `);
}

export function collaborativeTrainingTrailView(context,trailCode){
  if(!hasPermission(context,"training.view"))return forbidden(context);
  const trail=context.trainingTrails?.trails?.find(item=>item.code===trailCode);
  if(!trail)return collaborativeShell(context,"",heading("Formação","Percurso não encontrado"));
  const progress=trailProgress(context,trail.code),enrolment=trailEnrolment(context,trail.code);
  return collaborativeShell(context,`/area-colaborativa/formacao/${trail.code}`,`
    ${heading("Formação",trail.title,trail.summary,`<a class="ml-button ml-button--secondary" href="#/area-colaborativa/formacao">Todos os percursos</a>`)}
    <section class="training-trail-overview"><article><span>Progresso</span><strong>${esc(progress.percent)}%</strong>${statusPill(progress.status)}</article><article><span>Duração estimada</span><strong>${esc(trail.estimatedMinutes)} min</strong></article><article><span>Nota mínima</span><strong>${esc(trail.assessment?.passingScore||80)}%</strong></article></section>
    <section class="training-lessons"><h2>Lições</h2>${trail.lessons.map((lesson,index)=>{
      const complete=progress.completedLessons.includes(lesson.code);
      return `<article class="${complete?"training-lesson--complete":""}"><span>${index+1}</span><div><h3>${esc(lesson.title)}</h3><details><summary>Conteúdo da lição</summary><div class="training-lesson-content">${renderReferenceContent(lesson.content||"")}</div></details><small>${esc(lesson.resource)}</small></div>${complete?statusPill("completed"):`<button type="button" data-training-lesson-complete="${esc(lesson.code)}" data-trail-code="${esc(trail.code)}">Marcar como lida</button>`}</article>`;
    }).join("")}</section>
    ${progress.percent===100&&progress.status!=="completed"?`<section class="training-assessment-pending"><h2>Avaliação pendente</h2><p>Um membro com permissão de avaliação deve registar a nota.</p>${hasPermission(context,"training.assess")||hasPermission(context,"training.manage")?`<form class="collab-form compact-form" data-training-assessment-form><input type="hidden" name="userId" value="${esc(context.session.user.id)}"><input type="hidden" name="trailCode" value="${esc(trail.code)}"><label>Nota<input type="number" min="0" max="100" name="score" required></label><button type="submit">Registar avaliação</button><p data-collab-feedback></p></form>`:""}</section>`:""}
    ${enrolment?.completed_at?`<p class="training-completion-note">Concluído em ${esc(date(enrolment.completed_at))}.</p>`:""}
  `);
}

function reviewCard(context,row,management=false){
  const memory=canonical(context,row.memory_id),title=localised(memory?.title||{},"pt-PT").value||row.memory_id;
  const assignments=reviewWorkspace(context).assignments.filter(item=>item.review_record_id===row.id&&item.status==="active");
  return `<article class="museum-review-card museum-review-card--${esc(row.status)}" data-review-card data-status="${esc(row.status)}" data-search="${esc(`${row.memory_id} ${title}`.toLowerCase())}">
    <div class="museum-review-card__image">${memory?.media?.variants?.thumbnail?`<img src="${assetUrl(memory.media.variants.thumbnail)}" loading="lazy" decoding="async" alt="">`:""}</div>
    <div><span>${esc(row.memory_id)}</span><h2>${esc(title)}</h2><div class="review-card-meta">${statusPill(row.status)}<span>${esc(row.accepted_proposal_count||0)} propostas aceites</span><span>${esc(row.blocking_comment_count||0)} bloqueios</span><span>${esc(row.linked_contribution_count||0)} contributos</span></div>${assignments.length?`<p>${assignments.length} atribuições ativas</p>`:""}</div>
    <a href="#${management?`/area-colaborativa/gestao/revisao-museu/${esc(row.memory_id)}`:`/area-colaborativa/revisao-museu/${esc(row.memory_id)}`}">${management?"Gerir":"Rever"}</a>
  </article>`;
}

export function collaborativeMuseumReviewView(context,filters={},management=false){
  if(!hasPermission(context,"museum.review.view")&&!hasPermission(context,"museum.review"))return forbidden(context);
  const rows=reviewWorkspace(context).records,query=String(filters.query||"").toLowerCase(),status=filters.status||"";
  const filtered=rows.filter(row=>(!query||`${row.memory_id} ${localised(canonical(context,row.memory_id)?.title||{},"pt-PT").value}`.toLowerCase().includes(query))&&(!status||row.status===status));
  const actions=management?`<a class="ml-button ml-button--primary" href="#/area-colaborativa/gestao/revisao-museu/releases">Ciclos e snapshots</a>`:"";
  return collaborativeShell(context,management?"/area-colaborativa/gestao/revisao-museu":"/area-colaborativa/revisao-museu",`
    ${heading(management?"Gestão":"Museu","Revisão editorial e curatorial","Revisão das 31 memórias com propostas por campo, fontes, direitos, relações, traduções e gates.",actions)}
    <section class="museum-review-metrics"><article><strong>${rows.length}</strong><span>Total</span></article><article><strong>${rows.filter(item=>["in-progress","needs-changes","ready-editorial"].includes(item.status)).length}</strong><span>Em revisão</span></article><article><strong>${rows.filter(item=>item.publication_approved_at).length}</strong><span>Publicação aprovada</span></article><article><strong>${rows.reduce((sum,item)=>sum+(item.blocking_comment_count||0),0)}</strong><span>Bloqueios</span></article></section>
    <form class="museum-review-filters" data-museum-review-filters data-management="${management}"><label>Pesquisar<input type="search" name="query" value="${esc(filters.query||"")}"></label><label>Estado<select name="status">${options(context.museumReviewModel?.reviewStatuses,status,"Todos")}</select></label><button type="submit">Aplicar</button></form>
    <div class="museum-review-list">${filtered.length?filtered.map(row=>reviewCard(context,row,management)).join(""):`<p class="collab-empty-line">Nenhuma memória corresponde aos filtros.</p>`}</div>
  `);
}

function fieldEditor(context,row,memory,field){
  const current=getPointer(memory,field.path),proposal=proposalForField(context,row.id,field.path),canEdit=hasPermission(context,"museum.review.edit");
  return `<details class="museum-field-review" ${proposal?"open":""}><summary><span>${esc(field.label)}</span><span>${proposal?statusPill(proposal.status):"Sem proposta"}</span></summary>
    <div class="museum-field-comparison"><div><strong>Valor canónico</strong><pre>${esc(pretty(current))}</pre></div><div><strong>Proposta atual</strong><pre>${esc(proposal?pretty(proposal.proposed_value):"—")}</pre></div></div>
    ${proposal?`<div class="field-proposal-rationale"><strong>Fundamentação</strong><p>${esc(proposal.rationale)}</p>${proposal.source_ids?.length?`<small>Fontes: ${esc(proposal.source_ids.join(", "))}</small>`:""}${proposal.contribution_ids?.length?`<small>Contributos: ${esc(proposal.contribution_ids.join(", "))}</small>`:""}</div>`:""}
    ${canEdit?`<form class="collab-form museum-proposal-form" data-museum-proposal-form data-proposal-id="${esc(proposal?.id||"")}" data-review-record-id="${esc(row.id)}">
      <input type="hidden" name="fieldPath" value="${esc(field.path)}"><input type="hidden" name="baseValue" value="${esc(JSON.stringify(current??null))}">
      <label>Novo valor <small>JSON válido para objetos/listas; texto simples para campos textuais</small><textarea name="proposedValue" rows="${field.type==="textarea"||field.type==="json"?8:4}" required>${esc(proposal?pretty(proposal.proposed_value):pretty(current))}</textarea></label>
      <label>Fundamentação<textarea name="rationale" rows="3" required>${esc(proposal?.rationale||"")}</textarea></label>
      <div class="form-grid-2"><label>IDs de fontes<input name="sourceIds" value="${esc((proposal?.source_ids||[]).join(", "))}"></label><label>IDs de contributos<input name="contributionIds" value="${esc((proposal?.contribution_ids||[]).join(", "))}"></label></div>
      <label class="collab-check"><input type="checkbox" name="submit" ${proposal?.status==="submitted"?"checked":""}>Submeter para decisão</label>
      <button type="submit">Guardar proposta</button><p data-collab-feedback></p>
    </form>`:""}
    ${proposal?.status==="submitted"&&hasPermission(context,"museum.review.check")?`<div class="proposal-review-actions"><button type="button" data-museum-proposal-review="accepted" data-proposal-id="${esc(proposal.id)}">Aceitar proposta</button><button type="button" data-museum-proposal-review="rejected" data-proposal-id="${esc(proposal.id)}">Rejeitar proposta</button></div>`:""}
    ${proposal?.status==="accepted"&&hasPermission(context,"museum.review.check")?`<div class="proposal-review-actions"><button type="button" data-museum-proposal-supersede="${esc(proposal.id)}">Substituir proposta aceite</button></div>`:""}
  </details>`;
}

export function collaborativeMuseumReviewDetailView(context,memoryId,management=false){
  const row=reviewRecord(context,memoryId),memory=canonical(context,memoryId);
  if(!row||!memory)return collaborativeShell(context,"",heading("Museu","Memória não encontrada"));
  if(!hasPermission(context,"museum.review.view")&&!hasPermission(context,"museum.review"))return forbidden(context);
  const comments=reviewComments(context,row.id),checks=reviewChecks(context,row.id),decisions=reviewDecisions(context,row.id),links=reviewLinks(context,row.id);
  const acceptedContributions=(context.contributionWorkspace?.contributions||[]).filter(item=>["accepted","partially-accepted","incorporated"].includes(item.status));
  const previewRoute=management?`/area-colaborativa/gestao/revisao-museu/${memoryId}/preview`:`/area-colaborativa/revisao-museu/${memoryId}/preview`;
  return collaborativeShell(context,management?`/area-colaborativa/gestao/revisao-museu/${memoryId}`:`/area-colaborativa/revisao-museu/${memoryId}`,`
    ${heading("Revisão do Museu",`${row.memory_id} — ${localised(memory.title,"pt-PT").value}`,`Estado: ${modelLabel(context,"reviewStatuses",row.status)}`,`<a class="ml-button ml-button--secondary" href="#${previewRoute}">Pré-visualizar alterações</a><a class="ml-button ml-button--secondary" href="#${management?"/area-colaborativa/gestao/revisao-museu":"/area-colaborativa/revisao-museu"}">Voltar</a>`)}
    <section class="review-record-overview"><div class="review-record-image"><img src="${assetUrl(memory.media.variants.card)}" alt="${esc(localised(memory.title,"pt-PT").value)}">${memory.id==="MM202617"?`<span>Retoque substantivo com IA — divulgação obrigatória</span>`:""}</div><div><dl><div><dt>Hash de base</dt><dd><code>${esc(row.source_record_hash.slice(0,16))}…</code></dd></div><div><dt>Propostas aceites</dt><dd>${esc(row.accepted_proposal_count)}</dd></div><div><dt>Comentários bloqueantes</dt><dd>${esc(row.blocking_comment_count)}</dd></div><div><dt>Contributos ligados</dt><dd>${esc(row.linked_contribution_count)}</dd></div><div><dt>Elegibilidade de origem</dt><dd>${row.public_release_eligible?"Elegível":"Requer decisão e proposta de publicação"}</dd></div><div><dt>Divulgação de IA</dt><dd>${row.requires_ai_disclosure?"Obrigatória":"Não exigida"}</dd></div></dl><p>A versão canónica não será alterada nesta página. Apenas o snapshot aprovado pode gerar uma alteração no Git.</p></div></section>

    <section class="museum-field-groups">${(context.museumReviewModel?.fieldGroups||[]).map(group=>{
      const fields=(context.museumReviewModel?.fields||[]).filter(item=>item.group===group.code);
      return `<section><h2>${esc(group.name)}</h2>${fields.map(field=>fieldEditor(context,row,memory,field)).join("")}</section>`;
    }).join("")}</section>

    <section class="review-checks"><h2>Checks</h2><div class="review-check-grid">${checks.map(check=>`<article><strong>${esc(modelLabel(context,"checkTypes",check.check_type))}</strong>${statusPill(check.status)}<p>${esc(check.note||"Sem nota.")}</p>${hasPermission(context,"museum.review.check")?`<form data-museum-check-form data-review-record-id="${esc(row.id)}" data-check-type="${esc(check.check_type)}"><select name="status"><option value="pending" ${check.status==="pending"?"selected":""}>Pendente</option><option value="in-progress" ${check.status==="in-progress"?"selected":""}>Em curso</option><option value="passed" ${check.status==="passed"?"selected":""}>Aprovado</option><option value="failed" ${check.status==="failed"?"selected":""}>Falhou</option><option value="not-applicable" ${check.status==="not-applicable"?"selected":""}>Não aplicável</option></select><input name="note" value="${esc(check.note||"")}" placeholder="Nota"><button type="submit">Guardar</button></form>`:""}</article>`).join("")}</div></section>

    <section class="review-comments"><div class="section-heading-inline"><h2>Comentários</h2><span>${comments.filter(item=>item.blocking&&!item.resolved).length} bloqueantes abertos</span></div>
      ${comments.length?comments.map(item=>`<article class="${item.blocking&&!item.resolved?"review-comment--blocking":""}"><div><span>${esc(modelLabel(context,"commentTypes",item.comment_type))}</span><time>${esc(date(item.created_at))}</time></div><p>${esc(item.body)}</p>${item.field_path?`<code>${esc(item.field_path)}</code>`:""}${!item.resolved&&hasPermission(context,"museum.review.comment")?`<button type="button" data-museum-comment-resolve="${esc(item.id)}">Resolver</button>`:statusPill("completed")}</article>`).join(""):`<p class="collab-empty-line">Sem comentários.</p>`}
      ${hasPermission(context,"museum.review.comment")?`<form class="collab-form compact-form" data-museum-comment-form data-review-record-id="${esc(row.id)}"><div class="form-grid-2"><label>Campo<input name="fieldPath" placeholder="/description/short/pt-PT"></label><label>Tipo<select name="commentType">${options(context.museumReviewModel?.commentTypes,"note","Selecione")}</select></label></div><label>Comentário<textarea name="body" rows="3" required></textarea></label><label class="collab-check"><input type="checkbox" name="blocking">Bloqueante</label><button type="submit">Adicionar comentário</button><p data-collab-feedback></p></form>`:""}
    </section>

    ${management?`<section class="review-management-panel">
      <div><h2>Atribuições</h2><form class="collab-form compact-form" data-museum-assignment-form data-review-record-id="${esc(row.id)}"><label>Membro<select name="userId" required><option value="">Selecione</option>${activeMembers(context).map(member=>`<option value="${esc(member.user_id)}">${esc(member.display_name||member.email)}</option>`).join("")}</select></label><label>Papel<select name="assignmentRole">${options(context.museumReviewModel?.assignmentRoles)}</select></label><button type="submit">Atribuir</button><p data-collab-feedback></p></form></div>
      <div><h2>Ligar contributo aceite</h2><form class="collab-form compact-form" data-museum-contribution-link-form data-review-record-id="${esc(row.id)}"><label>Contributo<select name="contributionId" required><option value="">Selecione</option>${acceptedContributions.map(item=>`<option value="${esc(item.id)}">${esc(item.public_reference)} — ${esc(item.title)}</option>`).join("")}</select></label><label>Relação<select name="linkType"><option value="supports">Apoia</option><option value="corrects">Corrige</option><option value="identifies">Identifica</option><option value="rights">Direitos</option><option value="source">Fonte</option><option value="contextualises">Contextualiza</option></select></label><label>Nota<textarea name="note" rows="2"></textarea></label><button type="submit">Ligar</button><p data-collab-feedback></p></form>${links.length?`<ul>${links.map(link=>`<li>${esc(link.link_type)} — ${esc(link.contribution_id)}</li>`).join("")}</ul>`:""}</div>
      <div><h2>Decisão</h2>${["editorial-approve","rights-approve","publication-approve"].map(action=>{const training=trainingReady(context,action);return `<p><strong>${esc(modelLabel(context,"decisionTypes",action))}:</strong> ${training.ready?"formação concluída":`faltam ${training.missing.join(", ")}`}</p>`;}).join("")}<form class="collab-form compact-form" data-museum-decision-form data-review-record-id="${esc(row.id)}"><label>Decisão<select name="decisionType">${options(context.museumReviewModel?.decisionTypes)}</select></label><label>Fundamentação<textarea name="rationale" rows="4" required></textarea></label><button type="submit" class="ml-button ml-button--primary">Registar decisão</button><p data-collab-feedback></p></form></div>
    </section>`:""}

    <section class="review-history"><h2>Histórico de decisões</h2>${decisions.length?decisions.map(item=>`<article><time>${esc(date(item.decided_at))}</time><strong>${esc(modelLabel(context,"decisionTypes",item.decision_type))}</strong><p>${esc(item.rationale)}</p></article>`).join(""):`<p class="collab-empty-line">Sem decisões.</p>`}</section>
  `);
}

export function collaborativeMuseumReviewPreviewView(context,memoryId,management=false){
  const row=reviewRecord(context,memoryId),source=canonical(context,memoryId);
  if(!row||!source)return collaborativeShell(context,"",heading("Pré-visualização","Memória não encontrada"));
  if(!hasPermission(context,"museum.review.preview")&&!hasPermission(context,"museum.review.view"))return forbidden(context);
  const candidate=structuredClone(source),proposals=reviewProposals(context,row.id).filter(item=>["accepted","submitted","draft"].includes(item.status));
  for(const proposal of proposals)setPointer(candidate,proposal.field_path,proposal.proposed_value);
  const changed=proposals.map(item=>item.field_path);
  return collaborativeShell(context,"",`
    ${heading("Pré-visualização",`${memoryId} — comparação editorial`,"A pré-visualização não altera o ficheiro canónico.",`<a class="ml-button ml-button--secondary" href="#${management?`/area-colaborativa/gestao/revisao-museu/${memoryId}`:`/area-colaborativa/revisao-museu/${memoryId}`}">Voltar à revisão</a>`)}
    <section class="museum-preview-warning"><strong>Pré-visualização interna</strong><p>${proposals.length} propostas aplicadas apenas nesta comparação. Campos: ${esc(changed.join(", ")||"nenhum")}.</p></section>
    <section class="museum-preview-comparison"><article><span>Canónico atual</span>${memoryCard(source,"pt-PT")}<h3>Descrição</h3><p>${esc(localised(source.description.objective,"pt-PT").value)}</p></article><article><span>Candidato</span>${memoryCard(candidate,"pt-PT")}<h3>Descrição</h3><p>${esc(localised(candidate.description.objective,"pt-PT").value)}</p></article></section>
    <details class="museum-preview-json"><summary>Comparar JSON</summary><div><pre>${esc(JSON.stringify(source,null,2))}</pre><pre>${esc(JSON.stringify(candidate,null,2))}</pre></div></details>
  `);
}

export function collaborativeMuseumReviewManagementView(context,section="overview"){
  if(!hasPermission(context,"museum.review.manage"))return forbidden(context);
  const workspace=reviewWorkspace(context),cycle=workspace.cycles[0];
  if(section==="releases"){
    return collaborativeShell(context,"/area-colaborativa/gestao/revisao-museu/releases",`
      ${heading("Gestão editorial","Ciclos, snapshots e efeitos públicos","A aplicação no Git permanece separada da aprovação no banco.",`<a class="ml-button ml-button--secondary" href="#/area-colaborativa/gestao/revisao-museu">Voltar à fila</a>`)}
      <section class="review-cycle-summary"><article><span>Ciclo</span><strong>${esc(cycle?.title||"Sem ciclo")}</strong>${cycle?statusPill(cycle.status):""}</article><article><span>Publicação aprovada</span><strong>${workspace.records.filter(item=>item.publication_approved_at).length}/31</strong></article><article><span>Snapshots</span><strong>${workspace.snapshots.length}</strong></article><article><span>Efeitos</span><strong>${workspace.effects.length}</strong></article></section>
      ${cycle&&hasPermission(context,"museum.review.export")?`<form class="collab-form compact-form snapshot-generator" data-museum-snapshot-form data-cycle-id="${esc(cycle.id)}"><label>Versão<input name="version" value="0.36.0" required></label><button type="submit">Gerar snapshot validado</button><p data-collab-feedback></p></form>`:""}
      <section class="snapshot-list"><h2>Snapshots</h2>${workspace.snapshots.length?workspace.snapshots.map(item=>`<article><div><strong>${esc(item.version)}</strong><code>${esc(item.payload_hash||"")}</code><time>${esc(date(item.generated_at))}</time></div>${statusPill(item.status)}${item.status==="validated"&&hasPermission(context,"museum.review.apply")?`<button type="button" data-museum-snapshot-approve="${esc(item.id)}">Aprovar snapshot</button>`:""}</article>`).join(""):`<p class="collab-empty-line">Ainda não existem snapshots.</p>`}</section>
      <section class="public-effect-management"><h2>Efeitos nas páginas principais</h2><p>Os efeitos são registados por slot e só podem referenciar memórias com aprovação de publicação.</p>
      ${workspace.effects.length?workspace.effects.map(item=>`<article><strong>${esc(item.effect_code)}</strong><span>${esc(item.slot_code)}</span>${statusPill(item.status)}<span>${item.enabled?"Ativo":"Inativo"}</span></article>`).join(""):""}
      <form class="collab-form compact-form" data-public-effect-form><input type="hidden" name="cycleId" value="${esc(cycle?.id||"")}"><label>Código<input name="effectCode" required placeholder="museum-review-highlights"></label><label>Slot<select name="slotCode"><option value="portal.home.after-featured">Portal — após memórias em destaque</option><option value="museum.home.after-opening">Museu — após abertura</option></select></label><label>Tipo<select name="effectType"><option value="memory-highlight">Memórias em destaque</option><option value="editorial-update">Atualização editorial</option></select></label><div class="form-grid-2"><label>Título PT<input name="titlePt" required></label><label>Descrição PT<input name="descriptionPt"></label></div><label>IDs das memórias <small>máximo 3</small><input name="memoryIds" placeholder="MM202601, MM202602"></label><label>Estado<select name="status"><option value="draft">Rascunho</option><option value="review">Em revisão</option><option value="approved">Aprovado</option><option value="published">Publicado</option></select></label><label class="collab-check"><input type="checkbox" name="enabled">Ativar quando exportado</label><button type="submit">Guardar efeito</button><p data-collab-feedback></p></form></section>
    `);
  }
  return collaborativeMuseumReviewView(context,{},true);
}

function forbidden(context){return collaborativeShell(context,"",heading("Acesso condicionado","Módulo indisponível","O seu perfil não possui permissão para esta funcionalidade."));}
