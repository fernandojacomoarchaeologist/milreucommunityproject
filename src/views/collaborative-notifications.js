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
  return `<header class="collab-page-heading collab-page-heading--actions"><div><span>08H · Comunicação</span><h1>${esc(title)}</h1><p>${esc(description)}</p></div>${actions?`<div class="collab-heading-actions">${actions}</div>`:""}</header>`;
}
function workspace(context){return context.notificationWorkspace||{notifications:[],preferences:[],channels:[],templates:[],summary:{unreadCount:0,criticalUnreadCount:0,byCategory:{}},operations:{channels:[],outboxCounts:{},recentOutbox:[],deliveryCounts:{},templates:[]}};}
function eventType(context,code){return context.notificationModel?.eventTypes?.find(item=>item.code===code)||{code,name:code,category:"other",severity:"info",mandatoryInApp:false,emailAllowed:false,defaultEmail:false};}
function categoryName(context,code){return context.notificationModel?.categories?.find(item=>item.code===code)?.name||code;}
function preference(context,code){return workspace(context).preferences.find(item=>item.event_type===code&&item.user_id===context.session?.user?.id);}
function optionList(items,selected="",empty=null){
  return `${empty!==null?`<option value="">${esc(empty)}</option>`:""}${(items||[]).map(item=>`<option value="${esc(item.code)}" ${item.code===selected?"selected":""}>${esc(item.name)}</option>`).join("")}`;
}
function severityLabel(severity){return({info:"Informação",success:"Concluído",warning:"Atenção",critical:"Prioritário"})[severity]||severity;}
function statusLabel(status){return({unread:"Não lida",read:"Lida",archived:"Arquivada"})[status]||status;}

function notificationCard(context,item){
  const event=eventType(context,item.event_type);
  return `<article class="notification-card notification-card--${esc(item.severity)} notification-card--${esc(item.status)}">
    <div class="notification-card__icon" aria-hidden="true">${item.severity==="critical"?"!":item.severity==="warning"?"△":item.severity==="success"?"✓":"i"}</div>
    <div class="notification-card__content">
      <div class="notification-card__meta"><span>${esc(categoryName(context,event.category))}</span><span>${esc(severityLabel(item.severity))}</span><time>${esc(date(item.created_at))}</time></div>
      <h2>${esc(item.title)}</h2><p>${esc(item.body)}</p>
      <div class="notification-card__actions">
        ${item.action_url?`<a href="${esc(item.action_url)}">Abrir contexto</a>`:""}
        ${item.status==="unread"?`<button type="button" data-notification-action="read" data-notification-id="${esc(item.id)}">Marcar como lida</button>`:`<button type="button" data-notification-action="unread" data-notification-id="${esc(item.id)}">Marcar como não lida</button>`}
        ${item.status!=="archived"?`<button type="button" data-notification-action="archive" data-notification-id="${esc(item.id)}">Arquivar</button>`:""}
      </div>
    </div>
    <span class="notification-card__status">${esc(statusLabel(item.status))}</span>
  </article>`;
}

export function collaborativeNotificationsView(context,filters={}){
  if(!hasPermission(context,"notifications.view"))return forbidden(context);
  const data=workspace(context),query=String(filters.query||"").toLowerCase(),status=filters.status||"",category=filters.category||"";
  const rows=data.notifications.filter(item=>{
    const event=eventType(context,item.event_type);
    return(!query||`${item.title} ${item.body} ${event.name}`.toLowerCase().includes(query))
      &&(!status||item.status===status)
      &&(!category||event.category===category);
  });
  return collaborativeShell(context,"/area-colaborativa/notificacoes",`
    ${heading("Notificações","Avisos internos relacionados com tarefas, contributos, Museu, formação, agenda, direitos e operação.",`<a class="ml-button ml-button--secondary" href="#/area-colaborativa/notificacoes/preferencias">Preferências</a>${hasPermission(context,"notifications.mark")&&data.summary.unreadCount?`<button type="button" class="ml-button ml-button--primary" data-notification-mark-all>Ler todas</button>`:""}`)}
    <section class="notification-summary">
      <article><span>Não lidas</span><strong>${esc(data.summary.unreadCount||0)}</strong></article>
      <article><span>Prioritárias</span><strong>${esc(data.summary.criticalUnreadCount||0)}</strong></article>
      <article><span>Total visível</span><strong>${esc(data.notifications.length)}</strong></article>
      <article><span>E-mail</span><strong>${workspace(context).channels.find(item=>item.channel==="email")?.status==="active"?"Ativo":"Desativado"}</strong></article>
    </section>
    <form class="notification-filters" data-notification-filters>
      <label>Pesquisar<input type="search" name="query" value="${esc(filters.query||"")}"></label>
      <label>Estado<select name="status"><option value="">Todos</option>${["unread","read","archived"].map(value=>`<option value="${value}" ${value===status?"selected":""}>${statusLabel(value)}</option>`).join("")}</select></label>
      <label>Categoria<select name="category"><option value="">Todas</option>${optionList(context.notificationModel?.categories,category)}</select></label>
      <button type="submit">Aplicar</button>
    </form>
    <div class="notification-list">${rows.length?rows.map(item=>notificationCard(context,item)).join(""):`<p class="collab-empty-line">Nenhuma notificação corresponde aos filtros.</p>`}</div>
    <p class="notification-privacy-note">O centro interno não substitui contactos de emergência nem comunicações legais. Avisos críticos permanecem obrigatórios dentro da Área Colaborativa.</p>
  `);
}

function preferenceRow(context,event){
  const row=preference(context,event.code)||{
    in_app_enabled:true,email_enabled:Boolean(event.defaultEmail)&&false,
    quiet_hours_start:null,quiet_hours_end:null,timezone:"Europe/Lisbon",language:"pt-PT"
  };
  return `<tr>
    <td><strong>${esc(event.name)}</strong><small>${esc(categoryName(context,event.category))}</small></td>
    <td><span class="notification-severity notification-severity--${esc(event.severity)}">${esc(severityLabel(event.severity))}</span></td>
    <td><label class="collab-check"><input type="checkbox" name="inApp:${esc(event.code)}" ${row.in_app_enabled?"checked":""} ${event.mandatoryInApp?"disabled":""}>${event.mandatoryInApp?"Obrigatório":"Ativo"}</label></td>
    <td><label class="collab-check"><input type="checkbox" name="email:${esc(event.code)}" ${row.email_enabled?"checked":""} ${!event.emailAllowed?"disabled":""}>${event.emailAllowed?"Receber":"Indisponível"}</label></td>
  </tr>`;
}

export function collaborativeNotificationPreferencesView(context){
  if(!hasPermission(context,"notifications.preferences"))return forbidden(context);
  const events=context.notificationModel?.eventTypes||[];
  const any=workspace(context).preferences[0]||{quiet_hours_start:null,quiet_hours_end:null,timezone:"Europe/Lisbon",language:"pt-PT"};
  const emailChannel=workspace(context).channels.find(item=>item.channel==="email");
  return collaborativeShell(context,"/area-colaborativa/notificacoes/preferencias",`
    ${heading("Preferências de comunicação","Os avisos internos obrigatórios não podem ser desativados. O e-mail depende de ativação operacional.",`<a class="ml-button ml-button--secondary" href="#/area-colaborativa/notificacoes">Voltar às notificações</a>`)}
    <section class="notification-channel-notice notification-channel-notice--${esc(emailChannel?.status||"disabled")}"><strong>Canal de e-mail: ${esc(emailChannel?.status||"disabled")}</strong><p>${emailChannel?.status==="active"?"As preferências de e-mail podem gerar entregas transacionais.":"As escolhas são guardadas, mas nenhum e-mail será enviado enquanto o canal estiver desativado."}</p></section>
    <form data-notification-preferences-form>
      <section class="notification-quiet-hours"><h2>Configuração comum</h2><div class="form-grid-2"><label>Início do horário silencioso<input type="time" name="quietHoursStart" value="${esc(any.quiet_hours_start||"")}"></label><label>Fim do horário silencioso<input type="time" name="quietHoursEnd" value="${esc(any.quiet_hours_end||"")}"></label><label>Fuso horário<input name="timezone" value="${esc(any.timezone||"Europe/Lisbon")}" required></label><label>Idioma<select name="language"><option value="pt-PT" ${any.language==="pt-PT"?"selected":""}>Português</option><option value="en" ${any.language==="en"?"selected":""}>English</option><option value="es" ${any.language==="es"?"selected":""}>Español</option><option value="fr" ${any.language==="fr"?"selected":""}>Français</option></select></label></div></section>
      <div class="notification-preferences-table-wrap"><table class="notification-preferences-table"><thead><tr><th>Evento</th><th>Prioridade</th><th>Centro interno</th><th>E-mail</th></tr></thead><tbody>${events.map(event=>preferenceRow(context,event)).join("")}</tbody></table></div>
      <button type="submit" class="ml-button ml-button--primary">Guardar preferências</button><p data-collab-feedback></p>
    </form>
  `);
}

function channelCard(context,channel){
  return `<article class="notification-channel-card notification-channel-card--${esc(channel.channel)}">
    <div><span>${esc(channel.channel)}</span><h2>${channel.channel==="in-app"?"Centro interno":"E-mail transacional"}</h2></div>
    ${statusPill(channel.status)}
    <dl><div><dt>Fornecedor</dt><dd>${esc(channel.provider||"disabled")}</dd></div><div><dt>Remetente</dt><dd>${channel.fromEmailConfigured||channel.from_email?"Configurado":"Não configurado"}</dd></div><div><dt>Teste</dt><dd>${esc(date(channel.tested_at))}</dd></div></dl>
  </article>`;
}

function outboxRow(context,row){
  return `<tr><td><code>${esc(row.eventType)}</code></td><td>${esc(row.recipient)}</td><td>${statusPill(row.status)}</td><td>${esc(row.attempts)}/${esc(row.maxAttempts)}</td><td>${esc(date(row.availableAt||row.createdAt))}</td><td>${row.lastError?esc(row.lastError):"—"}</td><td>${["failed","dead-letter"].includes(row.status)&&hasPermission(context,"notifications.outbox.manage")?`<button type="button" data-notification-outbox-retry="${esc(row.id)}">Repetir</button>`:""}${["pending","claimed","failed","dead-letter"].includes(row.status)&&hasPermission(context,"notifications.outbox.manage")?`<button type="button" data-notification-outbox-cancel="${esc(row.id)}">Cancelar</button>`:""}</td></tr>`;
}

function templateEditor(context,template=null){
  const events=(context.notificationModel?.eventTypes||[]).filter(item=>item.emailAllowed);
  return `<form class="collab-form notification-template-form" data-notification-template-form data-template-id="${esc(template&&["draft","review"].includes(template.status)?template.id:"")}">
    <div class="form-grid-2"><label>Evento<select name="eventType" required>${optionList(events,template?.eventType||template?.event_type||"","Selecione")}</select></label><label>Idioma<select name="language"><option value="pt-PT" ${(template?.language||"pt-PT")==="pt-PT"?"selected":""}>pt-PT</option><option value="en" ${template?.language==="en"?"selected":""}>en</option><option value="es" ${template?.language==="es"?"selected":""}>es</option><option value="fr" ${template?.language==="fr"?"selected":""}>fr</option></select></label></div>
    <label>Assunto<input name="subjectTemplate" value="${esc(template?.subjectTemplate||template?.subject_template||"")}" required></label>
    <label>Título<input name="titleTemplate" value="${esc(template?.titleTemplate||template?.title_template||"")}" required></label>
    <label>Corpo em texto simples<textarea name="bodyTextTemplate" rows="5" required>${esc(template?.bodyTextTemplate||template?.body_text_template||"")}</textarea></label>
    <label>Estado<select name="status">${["draft","review","approved"].map(value=>`<option value="${value}" ${(template?.status||"draft")===value?"selected":""}>${value}</option>`).join("")}</select></label>
    <p><small>Tokens permitidos: ${(context.notificationModel?.templateTokens||[]).map(token=>`<code>{{${esc(token)}}}</code>`).join(" ")}</small></p>
    <button type="submit">${template?"Guardar nova versão":"Criar template"}</button><p data-collab-feedback></p>
  </form>`;
}

export function collaborativeNotificationManagementView(context,section="overview"){
  if(!hasPermission(context,"notifications.manage")&&!hasPermission(context,"notifications.outbox.view"))return forbidden(context);
  const data=workspace(context),ops=data.operations||{channels:[],outboxCounts:{},recentOutbox:[],deliveryCounts:{},templates:[]};
  const members=(context.management?.members||[]).filter(item=>item.membership?.status==="active");
  const invitations=(context.management?.invitations||[]).filter(item=>item.status==="pending");
  if(section==="templates"){
    const templates=ops.templates||[];
    return collaborativeShell(context,"/area-colaborativa/gestao/notificacoes/templates",`
      ${heading("Templates transacionais","Templates aprovados são imutáveis; correções criam uma nova versão.",`<a class="ml-button ml-button--secondary" href="#/area-colaborativa/gestao/notificacoes">Voltar à operação</a>`)}
      <section class="notification-template-grid">${templates.map(template=>`<details><summary><span>${esc(template.eventType||template.event_type)}</span>${statusPill(template.status)}<small>v${esc(template.version)} · ${esc(template.language)}</small></summary>${templateEditor(context,template)}</details>`).join("")}</section>
      <section><h2>Novo template</h2>${templateEditor(context)}</section>
    `);
  }
  return collaborativeShell(context,"/area-colaborativa/gestao/notificacoes",`
    ${heading("Gestão de notificações","Canais, templates, testes, fila transacional, falhas e convites explícitos.",`<a class="ml-button ml-button--secondary" href="#/area-colaborativa/gestao/notificacoes/templates">Templates</a>`)}
    <section class="notification-operation-warning"><strong>E-mail desativado por segurança</strong><p>O centro interno funciona sem fornecedor externo. A ativação do e-mail exige webhook, remetente, secrets e confirmação literal.</p></section>
    <div class="notification-channel-grid">${(ops.channels?.length?ops.channels:data.channels).map(channel=>channelCard(context,channel)).join("")}</div>
    ${hasPermission(context,"notifications.channel.manage")?`<section class="notification-channel-settings"><h2>Configurar canal</h2><form class="collab-form compact-form" data-notification-channel-form><label>Canal<select name="channel"><option value="email">E-mail</option><option value="in-app">Centro interno</option></select></label><label>Estado<select name="status"><option value="disabled">Desativado</option><option value="testing">Em teste</option><option value="active">Ativo</option><option value="paused">Pausado</option></select></label><label>Fornecedor<select name="provider"><option value="disabled">Desativado</option><option value="webhook">Webhook</option></select></label><div class="form-grid-2"><label>Nome do remetente<input name="fromName" value="Projeto Comunitário de Milreu"></label><label>E-mail do remetente<input type="email" name="fromEmail" autocomplete="off"></label></div><label>Confirmação <small>Obrigatória para ativar e-mail</small><input name="confirmation" autocomplete="off" placeholder="ACTIVATE_MILREU_TRANSACTIONAL_EMAIL"></label><button type="submit">Guardar canal</button><p data-collab-feedback></p></form></section>`:""}
    ${hasPermission(context,"notifications.test")?`<section class="notification-test-panel"><h2>Teste controlado</h2><form class="collab-form compact-form" data-notification-test-form><label>Membro<select name="targetUserId" required><option value="">Selecione</option>${members.map(item=>`<option value="${esc(item.user_id)}">${esc(item.display_name||item.email)}</option>`).join("")}</select></label><label>Evento<select name="eventType">${optionList(context.notificationModel?.eventTypes,"task.assigned")}</select></label><label class="collab-check"><input type="checkbox" name="includeEmail">Incluir e-mail, somente se o canal estiver ativo</label><button type="submit">Criar teste</button><p data-collab-feedback></p></form></section>`:""}
    ${hasPermission(context,"notifications.invitation-email")?`<section class="notification-invitation-panel"><h2>Convites pendentes</h2><p>O envio nunca é automático. O e-mail fica na outbox e depende do canal ativo.</p>${invitations.length?`<div>${invitations.map(item=>`<article><div><strong>${esc(item.email.replace(/(^.).*(@.*$)/,"$1***$2"))}</strong><span>${esc(item.intended_profile_type)}</span></div><button type="button" data-notification-invitation-email="${esc(item.id)}">Enfileirar e-mail</button></article>`).join("")}</div>`:`<p class="collab-empty-line">Sem convites pendentes.</p>`}</section>`:""}
    <section class="notification-outbox-summary"><h2>Outbox</h2><div>${Object.entries(ops.outboxCounts||{}).map(([status,count])=>`<article><span>${esc(status)}</span><strong>${esc(count)}</strong></article>`).join("")||"<p>Sem itens.</p>"}</div></section>
    <section class="notification-outbox"><div class="section-heading-inline"><h2>Entregas recentes</h2><button type="button" data-notification-refresh>Atualizar</button></div>${ops.recentOutbox?.length?`<div class="notification-outbox-table-wrap"><table><thead><tr><th>Evento</th><th>Destino</th><th>Estado</th><th>Tentativas</th><th>Disponível</th><th>Erro</th><th>Ações</th></tr></thead><tbody>${ops.recentOutbox.map(row=>outboxRow(context,row)).join("")}</tbody></table></div>`:`<p class="collab-empty-line">A outbox está vazia.</p>`}</section>
    <section class="notification-provider-contract"><h2>Contrato do worker</h2><pre>MILREU_NOTIFICATION_PROVIDER=disabled|webhook
MILREU_NOTIFICATION_WEBHOOK_URL=
MILREU_NOTIFICATION_WEBHOOK_TOKEN=
MILREU_NOTIFICATION_WORKER_SECRET=
MILREU_NOTIFICATION_FROM_EMAIL=</pre><p>Secrets permanecem no servidor. O navegador não reclama, resolve ou envia a outbox.</p></section>
  `);
}

function forbidden(context){
  return collaborativeShell(context,"",heading("Acesso condicionado","O seu perfil não possui permissão para esta funcionalidade."));
}
