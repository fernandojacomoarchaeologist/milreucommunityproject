/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { collaborativeShell, statusPill } from "../components/collaborative-layout.js";
import { hasPermission } from "../collab/permissions.js";

const esc=value=>String(value??"").replace(/[&<>\"]/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[char]));
const dateTime=value=>value?new Intl.DateTimeFormat("pt-PT",{dateStyle:"medium",timeStyle:"short"}).format(new Date(value)):"A combinar";
const dateOnly=value=>value?new Intl.DateTimeFormat("pt-PT",{dateStyle:"medium"}).format(new Date(value)):"—";
const minutesLabel=value=>{const total=Number(value||0);if(!total)return "Não estimado";const h=Math.floor(total/60),m=total%60;return [h?`${h} h`:"",m?`${m} min`:""].filter(Boolean).join(" ");};

function heading(eyebrow,title,description="",actions=""){
  return `<header class="collab-page-heading collab-page-heading--actions"><div><span>${esc(eyebrow)}</span><h1>${esc(title)}</h1>${description?`<p>${esc(description)}</p>`:""}</div>${actions?`<div class="collab-heading-actions">${actions}</div>`:""}</header>`;
}
function modelItem(context,collection,code){return context.taskModel?.[collection]?.find(item=>String(item.code)===String(code));}
function modelLabel(context,collection,code){return modelItem(context,collection,code)?.name||code||"—";}
function workspace(context){return context.taskWorkspace||{tasks:[],assignments:[],availability:[],preferences:null,timeEntries:[],updates:[]};}
function myUserId(context){return context.session?.user?.id;}
function myAssignment(context,taskId){return workspace(context).assignments.find(item=>item.task_id===taskId&&item.user_id===myUserId(context));}
function taskAssignments(context,taskId){return workspace(context).assignments.filter(item=>item.task_id===taskId);}
function activeAssignments(context,taskId){return taskAssignments(context,taskId).filter(item=>["accepted","in-progress","submitted","completed"].includes(item.status));}
function memberName(context,userId){const member=context.management?.members?.find(item=>item.user_id===userId);return member?.display_name||member?.email||userId;}
function category(context,task){return modelLabel(context,"categories",task.category_code||task.category);}
function skillsFor(context,taskId){return workspace(context).requiredSkills?.filter(item=>item.task_id===taskId)||[];}
function skillName(context,code){return context.memberCatalog?.skills?.find(item=>item.code===code)?.name||code;}
function skillMatch(context,taskId){const requirements=skillsFor(context,taskId);if(!requirements.length)return null;const own=new Set(context.profile?.skills||[]);const matched=requirements.filter(item=>own.has(item.skill_code)).length;return {matched,total:requirements.length,requiredMissing:requirements.filter(item=>item.required&&!own.has(item.skill_code)).length};}
function taskSearch(task){return [task.title,task.summary,task.description,task.location_name,task.municipality,task.category_code].filter(Boolean).join(" ").toLowerCase();}
function assignmentLabel(context,status){return modelLabel(context,"assignmentStatuses",status);}
function taskStatus(context,status){return modelLabel(context,"taskStatuses",status);}
function taskCapacity(context,task){const active=activeAssignments(context,task.id).length;return task.capacity?`${active}/${task.capacity}`:`${active} participante${active===1?"":"s"}`;}
function locationLabel(context,task){const mode=modelLabel(context,"locationModes",task.location_mode);const place=[task.location_name,task.municipality].filter(Boolean).join(" · ");return place?`${mode} · ${place}`:mode;}
function assignmentBadge(context,assignment){return assignment?`<span class="task-assignment-badge task-assignment-badge--${esc(assignment.status)}">${esc(assignmentLabel(context,assignment.status))}</span>`:"";}

function taskCard(context,task){
  const assignment=myAssignment(context,task.id),match=skillMatch(context,task.id);
  return `<article class="task-card" data-task-card data-search="${esc(taskSearch(task))}" data-category="${esc(task.category_code||"")}" data-location="${esc(task.location_mode||"")}" data-scope="${assignment?"mine":"available"}">
    <div class="task-card__top"><span>${esc(category(context,task))}</span>${statusPill(task.status)}</div>
    <h2><a href="#/area-colaborativa/tarefas/${esc(task.id)}">${esc(task.title)}</a></h2>
    <p>${esc(task.summary||task.description||"Sem resumo.")}</p>
    <dl class="task-card__meta"><div><dt>Modalidade</dt><dd>${esc(locationLabel(context,task))}</dd></div><div><dt>Prazo</dt><dd>${esc(dateTime(task.due_at))}</dd></div><div><dt>Participação</dt><dd>${esc(taskCapacity(context,task))}</dd></div><div><dt>Tempo</dt><dd>${esc(minutesLabel(task.estimated_minutes))}</dd></div></dl>
    <div class="task-card__footer">${assignmentBadge(context,assignment)}${match?`<span class="task-match ${match.requiredMissing?"task-match--warning":""}">${match.matched}/${match.total} competências</span>`:""}</div>
  </article>`;
}

export function collaborativeTasksView(context,filters={}){
  if(!hasPermission(context,"tasks.view"))return collaborativeTaskForbidden(context);
  const data=workspace(context),scope=filters.scope||"available";
  const tasks=data.tasks.filter(task=>{
    const assignment=myAssignment(context,task.id),blocking=assignment&&!["declined","withdrawn","cancelled"].includes(assignment.status);
    if(scope==="available")return task.status==="open"&&!blocking&&task.assignment_mode!=="direct";
    if(scope==="mine")return Boolean(assignment)&&!["completed","declined","withdrawn","cancelled"].includes(assignment.status);
    if(scope==="completed")return assignment?.status==="completed";
    return true;
  });
  const actions=`<a class="ml-button ml-button--secondary" href="#/area-colaborativa/disponibilidade">A minha disponibilidade</a>${hasPermission(context,"tasks.manage")?`<a class="ml-button ml-button--primary" href="#/area-colaborativa/gestao/tarefas">Gerir tarefas</a>`:""}`;
  return collaborativeShell(context,"/area-colaborativa/tarefas",`
    ${heading("Voluntariado","Tarefas e oportunidades","Consulte atividades abertas, acompanhe compromissos e registe o trabalho realizado.",actions)}
    <section class="task-board">
      <nav class="task-tabs" aria-label="Filtrar tarefas">
        <a href="#/area-colaborativa/tarefas?scope=available" aria-current="${scope==="available"?"page":"false"}">Disponíveis</a>
        <a href="#/area-colaborativa/tarefas?scope=mine" aria-current="${scope==="mine"?"page":"false"}">As minhas</a>
        <a href="#/area-colaborativa/tarefas?scope=completed" aria-current="${scope==="completed"?"page":"false"}">Concluídas</a>
      </nav>
      <form class="task-filters" data-task-filters>
        <label>Pesquisar<input type="search" name="query" value="${esc(filters.query||"")}" placeholder="Título, local ou categoria"></label>
        <label>Categoria<select name="category"><option value="">Todas</option>${(context.taskModel?.categories||[]).map(item=>`<option value="${esc(item.code)}" ${filters.category===item.code?"selected":""}>${esc(item.name)}</option>`).join("")}</select></label>
        <label>Modalidade<select name="location"><option value="">Todas</option>${(context.taskModel?.locationModes||[]).map(item=>`<option value="${esc(item.code)}" ${filters.location===item.code?"selected":""}>${esc(item.name)}</option>`).join("")}</select></label>
      </form>
      <div class="task-grid" data-task-grid>${tasks.length?tasks.map(task=>taskCard(context,task)).join(""):`<div class="task-empty"><h2>Nenhuma tarefa neste grupo</h2><p>Novas oportunidades aparecerão aqui quando forem publicadas.</p></div>`}</div>
      <div class="task-empty" data-task-filter-empty hidden><h2>Nenhum resultado</h2><p>Altere os filtros para consultar outras tarefas.</p></div>
    </section>
  `);
}

function taskActionPanel(context,task,assignment){
  if(assignment&&["declined","withdrawn","cancelled"].includes(assignment.status))assignment=null;
  if(task.status==="cancelled")return `<div class="task-action-notice">Esta tarefa foi cancelada.</div>`;
  if(task.status==="completed")return `<div class="task-action-notice">Esta tarefa foi concluída.</div>`;
  if(!assignment&&task.status==="open"&&task.assignment_mode!=="direct"){
    const label=task.assignment_mode==="open"?"Aceitar tarefa":"Enviar candidatura";
    return `<form class="task-action-form" data-task-join-form data-task-id="${esc(task.id)}"><label>Mensagem <small>opcional</small><textarea name="note" rows="3" placeholder="Indique disponibilidade ou informação relevante."></textarea></label><button class="ml-button ml-button--primary" type="submit">${label}</button><p data-collab-feedback aria-live="polite"></p></form>`;
  }
  if(!assignment&&task.assignment_mode==="direct")return `<div class="task-action-notice">Esta tarefa é atribuída por convite da coordenação.</div>`;
  if(!assignment)return "";
  if(assignment.status==="invited")return `<div class="task-action-box"><p>Recebeu um convite para esta tarefa.</p><label>Resposta <small>opcional</small><textarea data-task-response-note rows="2"></textarea></label><div><button type="button" data-task-invitation-response="accept" data-task-id="${esc(task.id)}">Aceitar</button><button type="button" data-task-invitation-response="decline" data-task-id="${esc(task.id)}">Recusar</button></div></div>`;
  if(assignment.status==="applied")return `<div class="task-action-box"><p>A candidatura está a aguardar decisão.</p><button type="button" data-task-withdraw data-task-id="${esc(task.id)}">Retirar candidatura</button></div>`;
  if(assignment.status==="accepted")return `<div class="task-action-box"><p>A participação está confirmada.</p><div><button type="button" data-task-start data-task-id="${esc(task.id)}">Iniciar tarefa</button><button type="button" data-task-withdraw data-task-id="${esc(task.id)}">Desistir</button></div>${timeLogForm(task.id)}</div>`;
  if(assignment.status==="in-progress")return `<div class="task-action-box"><p>A tarefa está em execução.</p>${timeLogForm(task.id)}<form data-task-submit-form data-task-id="${esc(task.id)}"><label>Resumo da conclusão<textarea name="note" rows="4" required></textarea></label><label>Minutos adicionais <small>opcional</small><input type="number" name="minutes" min="1" max="1440"></label><button type="submit">Submeter para validação</button></form><button type="button" data-task-withdraw data-task-id="${esc(task.id)}">Desistir</button></div>`;
  if(assignment.status==="submitted")return `<div class="task-action-notice">A conclusão foi submetida e aguarda validação da coordenação.</div>`;
  if(assignment.status==="completed")return `<div class="task-action-notice task-action-notice--success">Participação concluída e validada.</div>`;
  return `<div class="task-action-notice">Estado: ${esc(assignmentLabel(context,assignment.status))}</div>`;
}
function timeLogForm(taskId){return `<form class="task-time-form" data-task-time-form data-task-id="${esc(taskId)}"><h3>Registar tempo</h3><div><label>Data<input type="date" name="activityDate" required value="${new Date().toISOString().slice(0,10)}"></label><label>Minutos<input type="number" name="minutes" min="1" max="1440" required></label></div><label>Nota <small>opcional</small><input type="text" name="note"></label><button type="submit">Adicionar registo</button><p data-collab-feedback aria-live="polite"></p></form>`;}

function managerTaskPanel(context,task){
  if(!hasPermission(context,"tasks.manage"))return "";
  const assignments=taskAssignments(context,task.id),members=(context.management?.members||[]).filter(item=>item.membership?.status==="active");
  const applications=assignments.filter(item=>item.status==="applied"),submissions=assignments.filter(item=>item.status==="submitted");
  return `<section class="task-manager-panel">
    <header><span>Coordenação</span><h2>Gestão desta tarefa</h2></header>
    <div class="task-manager-actions">${task.status==="draft"?`<button type="button" data-task-publish data-task-id="${esc(task.id)}">Publicar</button>`:""}${["open","in-progress"].includes(task.status)?`<a href="#/area-colaborativa/gestao/tarefas/${esc(task.id)}/editar">Editar</a><button type="button" data-task-complete data-task-id="${esc(task.id)}">Concluir tarefa</button><button type="button" data-task-cancel data-task-id="${esc(task.id)}">Cancelar</button>`:""}</div>
    <form class="task-invite-form" data-task-invite-form data-task-id="${esc(task.id)}"><label>Convidar membro<select name="userId" required><option value="">Selecione</option>${members.map(item=>`<option value="${esc(item.user_id)}">${esc(item.display_name||item.email)}</option>`).join("")}</select></label><label>Nota<input type="text" name="note"></label><button type="submit">Enviar convite interno</button></form>
    <div class="task-manager-columns">
      <section><h3>Candidaturas</h3>${applications.length?applications.map(item=>`<article><strong>${esc(memberName(context,item.user_id))}</strong><p>${esc(item.application_note||"Sem mensagem.")}</p><button type="button" data-task-review-application="accept" data-task-id="${esc(task.id)}" data-user-id="${esc(item.user_id)}">Aceitar</button><button type="button" data-task-review-application="decline" data-task-id="${esc(task.id)}" data-user-id="${esc(item.user_id)}">Recusar</button></article>`).join(""):`<p>Sem candidaturas pendentes.</p>`}</section>
      <section><h3>Conclusões para validar</h3>${submissions.length?submissions.map(item=>`<article><strong>${esc(memberName(context,item.user_id))}</strong><p>${esc(item.completion_note||"Sem resumo.")}</p><button type="button" data-task-verify="accept" data-task-id="${esc(task.id)}" data-user-id="${esc(item.user_id)}">Validar</button><button type="button" data-task-verify="decline" data-task-id="${esc(task.id)}" data-user-id="${esc(item.user_id)}">Pedir correção</button></article>`).join(""):`<p>Sem conclusões pendentes.</p>`}</section>
    </div>
    <div class="task-assignee-list"><h3>Participantes</h3>${assignments.length?assignments.map(item=>`<article><span>${esc(memberName(context,item.user_id))}</span>${assignmentBadge(context,item)}</article>`).join(""):`<p>Ainda não existem participantes.</p>`}</div>
  </section>`;
}

export function collaborativeTaskDetailView(context,taskId,managerMode=false){
  if(!hasPermission(context,"tasks.view")&&!hasPermission(context,"tasks.manage"))return collaborativeTaskForbidden(context);
  const task=workspace(context).tasks.find(item=>item.id===taskId);
  if(!task)return collaborativeShell(context,"",heading("Tarefas","Tarefa não encontrada","O registo pode ter sido arquivado ou não estar disponível para o seu perfil."));
  const assignment=myAssignment(context,task.id),requirements=skillsFor(context,task.id),updates=workspace(context).updates.filter(item=>item.task_id===task.id),timeEntries=workspace(context).timeEntries.filter(item=>item.task_id===task.id&&item.user_id===myUserId(context));
  const back=managerMode?"/area-colaborativa/gestao/tarefas":"/area-colaborativa/tarefas";
  return collaborativeShell(context,managerMode?"/area-colaborativa/gestao/tarefas":"/area-colaborativa/tarefas",`
    <a class="collab-back-link" href="#${back}">← Voltar às tarefas</a>
    <article class="task-detail">
      <header class="task-detail__header"><div><span>${esc(category(context,task))}</span><h1>${esc(task.title)}</h1><p>${esc(task.summary||"")}</p></div><div>${statusPill(task.status)}${assignmentBadge(context,assignment)}</div></header>
      <div class="task-detail__layout"><div class="task-detail__content"><section><h2>Descrição</h2><p>${esc(task.description||"Sem descrição adicional.")}</p></section>${task.instructions?`<section><h2>Instruções</h2><p>${esc(task.instructions)}</p></section>`:""}<section><h2>Competências</h2>${requirements.length?`<div class="task-skill-list">${requirements.map(item=>`<span class="${item.required?"required":""}">${esc(skillName(context,item.skill_code))}${item.required?" · necessária":""}</span>`).join("")}</div>`:`<p>Não foram indicadas competências específicas.</p>`}</section>${timeEntries.length?`<section><h2>Tempo registado</h2><div class="task-time-list">${timeEntries.map(item=>`<article><time>${esc(dateOnly(item.activity_date))}</time><strong>${esc(minutesLabel(item.minutes))}</strong>${statusPill(item.status)}<p>${esc(item.note||"")}</p></article>`).join("")}</div></section>`:""}</div>
      <aside class="task-detail__aside"><dl><dt>Modalidade</dt><dd>${esc(locationLabel(context,task))}</dd><dt>Início</dt><dd>${esc(dateTime(task.starts_at))}</dd><dt>Prazo</dt><dd>${esc(dateTime(task.due_at))}</dd><dt>Candidaturas</dt><dd>${esc(dateTime(task.application_deadline))}</dd><dt>Tempo estimado</dt><dd>${esc(minutesLabel(task.estimated_minutes))}</dd><dt>Participação</dt><dd>${esc(taskCapacity(context,task))}</dd><dt>Adesão</dt><dd>${esc(modelLabel(context,"assignmentModes",task.assignment_mode))}</dd></dl>${taskActionPanel(context,task,assignment)}</aside></div>
    </article>
    ${managerTaskPanel(context,task)}
    ${updates.length?`<section class="task-history"><h2>Histórico da tarefa</h2>${updates.map(item=>`<article><time>${esc(dateTime(item.created_at))}</time><strong>${esc(item.update_type)}</strong><span>${esc(memberName(context,item.user_id))}</span><p>${esc(item.note||"")}</p></article>`).join("")}</section>`:""}
  `);
}

export function collaborativeAvailabilityView(context){
  if(!hasPermission(context,"availability.self.manage"))return collaborativeTaskForbidden(context);
  const data=workspace(context),preferences=data.preferences||{},slots=data.availability||[];
  const rows=slots.length?slots:[{day_of_week:1,starts_at:"09:00",ends_at:"12:00",mode:"hybrid"}];
  return collaborativeShell(context,"/area-colaborativa/disponibilidade",`
    ${heading("Voluntariado","A minha disponibilidade","Registe horários indicativos. A disponibilidade não cria uma obrigação automática.",`<a class="ml-button ml-button--secondary" href="#/area-colaborativa/tarefas">Voltar às tarefas</a>`)}
    <form class="availability-form" data-availability-form>
      <section><h2>Preferências gerais</h2><fieldset><legend>Modos preferidos</legend><div class="collab-check-grid">${(context.taskModel?.availabilityModes||[]).map(item=>`<label><input type="checkbox" name="preferredModes" value="${esc(item.code)}" ${(preferences.preferred_modes||["remote","on-site"]).includes(item.code)?"checked":""}>${esc(item.name)}</label>`).join("")}</div></fieldset><label>Máximo de horas por semana <small>opcional</small><input type="number" name="maximumWeeklyHours" min="1" max="40" value="${preferences.maximum_weekly_minutes?Math.round(preferences.maximum_weekly_minutes/60):""}"></label><label>Fuso horário<input type="text" name="timezone" value="${esc(preferences.timezone||"Europe/Lisbon")}"></label><label>Notas<textarea name="notes" rows="4">${esc(preferences.availability_notes||"")}</textarea></label></section>
      <section><div class="availability-section-heading"><div><h2>Horários recorrentes</h2><p>Pode adicionar mais de um período no mesmo dia.</p></div><button type="button" data-availability-add>Adicionar horário</button></div><div class="availability-slots" data-availability-slots>${rows.map(availabilityRow).join("")}</div><template data-availability-template>${availabilityRow({day_of_week:1,starts_at:"09:00",ends_at:"12:00",mode:"hybrid"})}</template></section>
      <button type="submit" class="ml-button ml-button--primary">Guardar disponibilidade</button><p data-collab-feedback aria-live="polite"></p>
    </form>
  `);
}
function availabilityRow(slot){const start=String(slot.starts_at||"09:00").slice(0,5),end=String(slot.ends_at||"12:00").slice(0,5);return `<div class="availability-row" data-availability-row><label>Dia<select name="dayOfWeek">${[1,2,3,4,5,6,0].map(code=>`<option value="${code}" ${Number(slot.day_of_week)===code?"selected":""}>${["Domingo","Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira","Sábado"][code]}</option>`).join("")}</select></label><label>Início<input type="time" name="startsAt" value="${esc(start)}" required></label><label>Fim<input type="time" name="endsAt" value="${esc(end)}" required></label><label>Modo<select name="mode"><option value="remote" ${slot.mode==="remote"?"selected":""}>Remoto</option><option value="on-site" ${slot.mode==="on-site"?"selected":""}>Presencial</option><option value="hybrid" ${slot.mode==="hybrid"?"selected":""}>Ambos</option></select></label><button type="button" data-availability-remove aria-label="Remover horário">×</button></div>`;}

export function collaborativeTaskManagementView(context){
  if(!hasPermission(context,"tasks.manage"))return collaborativeTaskForbidden(context);
  const tasks=workspace(context).tasks,assignments=workspace(context).assignments;
  const metrics={draft:tasks.filter(x=>x.status==="draft").length,open:tasks.filter(x=>x.status==="open").length,progress:tasks.filter(x=>x.status==="in-progress").length,pending:assignments.filter(x=>["applied","submitted"].includes(x.status)).length};
  return collaborativeShell(context,"/area-colaborativa/gestao/tarefas",`
    ${heading("Gestão","Voluntariado e tarefas","Crie oportunidades, atribua participantes e valide conclusões.",`<a class="ml-button ml-button--primary" href="#/area-colaborativa/gestao/tarefas/nova">Criar tarefa</a>`)}
    <section class="task-management-metrics"><article><strong>${metrics.draft}</strong><span>Rascunhos</span></article><article><strong>${metrics.open}</strong><span>Abertas</span></article><article><strong>${metrics.progress}</strong><span>Em curso</span></article><article><strong>${metrics.pending}</strong><span>Decisões pendentes</span></article></section>
    <section class="task-management-list"><div class="task-management-list__header"><h2>Tarefas</h2><a href="#/area-colaborativa/disponibilidade">Consultar a própria disponibilidade</a></div>${tasks.length?tasks.map(task=>`<article><div><span>${esc(category(context,task))}</span><h3><a href="#/area-colaborativa/gestao/tarefas/${esc(task.id)}">${esc(task.title)}</a></h3><p>${esc(locationLabel(context,task))} · ${esc(dateTime(task.due_at))}</p></div><div>${statusPill(task.status)}<strong>${esc(taskCapacity(context,task))}</strong><a href="#/area-colaborativa/gestao/tarefas/${esc(task.id)}/editar">Editar</a></div></article>`).join(""):`<div class="task-empty"><h2>Ainda não existem tarefas</h2><p>Crie um rascunho para começar.</p></div>`}</section>
  `);
}

export function collaborativeTaskEditorView(context,taskId=null){
  if(!hasPermission(context,"tasks.manage"))return collaborativeTaskForbidden(context);
  const task=taskId?workspace(context).tasks.find(item=>item.id===taskId):null;
  if(taskId&&!task)return collaborativeTaskForbidden(context);
  const selectedSkills=new Map(skillsFor(context,taskId).map(item=>[item.skill_code,item]));
  return collaborativeShell(context,"/area-colaborativa/gestao/tarefas",`
    <a class="collab-back-link" href="#/area-colaborativa/gestao/tarefas">← Gestão de tarefas</a>
    ${heading("Gestão",task?"Editar tarefa":"Criar tarefa",task?"As alterações ficam registadas na auditoria.":"A tarefa será guardada como rascunho.")}
    <form class="task-editor" data-task-editor-form ${task?`data-task-id="${esc(task.id)}"`:""}>
      <section><h2>Identificação</h2><label>Título<input type="text" name="title" required value="${esc(task?.title||"")}"></label><label>Resumo<input type="text" name="summary" value="${esc(task?.summary||"")}"></label><label>Descrição<textarea name="description" rows="5">${esc(task?.description||"")}</textarea></label><label>Instruções internas<textarea name="instructions" rows="5">${esc(task?.instructions||"")}</textarea></label></section>
      <section><h2>Organização</h2><div class="task-editor-grid"><label>Categoria<select name="categoryCode" required>${(context.taskModel?.categories||[]).map(item=>`<option value="${esc(item.code)}" ${(task?.category_code||"other")===item.code?"selected":""}>${esc(item.name)}</option>`).join("")}</select></label><label>Prioridade<select name="priority">${(context.taskModel?.priorities||[]).map(item=>`<option value="${esc(item.code)}" ${(task?.priority||"normal")===item.code?"selected":""}>${esc(item.name)}</option>`).join("")}</select></label><label>Modo de adesão<select name="assignmentMode">${(context.taskModel?.assignmentModes||[]).map(item=>`<option value="${esc(item.code)}" ${(task?.assignment_mode||"approval")===item.code?"selected":""}>${esc(item.name)}</option>`).join("")}</select></label><label>Modalidade<select name="locationMode">${(context.taskModel?.locationModes||[]).map(item=>`<option value="${esc(item.code)}" ${(task?.location_mode||"flexible")===item.code?"selected":""}>${esc(item.name)}</option>`).join("")}</select></label><label>Local<input type="text" name="locationName" value="${esc(task?.location_name||"")}"></label><label>Município<input type="text" name="municipality" value="${esc(task?.municipality||"")}"></label></div></section>
      <section><h2>Datas e capacidade</h2><div class="task-editor-grid"><label>Início<input type="datetime-local" name="startsAt" value="${inputDate(task?.starts_at)}"></label><label>Prazo<input type="datetime-local" name="dueAt" value="${inputDate(task?.due_at)}"></label><label>Limite para candidatura<input type="datetime-local" name="applicationDeadline" value="${inputDate(task?.application_deadline)}"></label><label>Tempo estimado em minutos<input type="number" name="estimatedMinutes" min="1" value="${esc(task?.estimated_minutes||"")}"></label><label>Capacidade<input type="number" name="capacity" min="1" value="${esc(task?.capacity||"")}"></label><label>Mínimo de participantes<input type="number" name="minimumParticipants" min="1" value="${esc(task?.minimum_participants||1)}"></label></div><label class="collab-check"><input type="checkbox" name="recognitionEligible" ${task?.recognition_eligible?"checked":""}>A atividade pode ser considerada para reconhecimento da participação, após validação.</label></section>
      <section><h2>Competências</h2><div class="task-skill-editor">${(context.memberCatalog?.skills||[]).map(item=>{const selected=selectedSkills.get(item.code);return `<label><input type="checkbox" name="skills" value="${esc(item.code)}" ${selected?"checked":""}>${esc(item.name)}<select name="skillRequirement:${esc(item.code)}"><option value="recommended" ${!selected?.required?"selected":""}>Recomendada</option><option value="required" ${selected?.required?"selected":""}>Necessária</option></select></label>`;}).join("")}</div></section>
      <button class="ml-button ml-button--primary" type="submit">${task?"Guardar alterações":"Criar rascunho"}</button><p data-collab-feedback aria-live="polite"></p>
    </form>
  `);
}
function inputDate(value){if(!value)return "";const d=new Date(value);const local=new Date(d.getTime()-d.getTimezoneOffset()*60000);return local.toISOString().slice(0,16);}

function collaborativeTaskForbidden(context){return collaborativeShell(context,"",heading("Acesso condicionado","Tarefas indisponíveis","Este módulo não está disponível para o seu perfil ou a tarefa não pode ser consultada."));}
