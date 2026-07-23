/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { collaborativePublicFrame, collaborativeShell, statusPill } from "../components/collaborative-layout.js";
import { hasPermission } from "../collab/permissions.js";

const esc = value => String(value ?? "").replace(/[&<>"]/g,char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[char]));

function profileTypeOptions(context,selected="") {
  return (context.profileTypes || []).map(item =>
    `<option value="${esc(item.code)}" ${item.code===selected?"selected":""}>${esc(item.name)}</option>`
  ).join("");
}

function pageHeading(eyebrow,title,description="") {
  return `<header class="collab-page-heading"><span>${esc(eyebrow)}</span><h1>${esc(title)}</h1>${description ? `<p>${esc(description)}</p>` : ""}</header>`;
}

export function collaborativeLoginView(context) {
  const configured = context.mode === "supabase";
  return collaborativePublicFrame(context,`
    <section class="collab-login">
      <div class="collab-login__copy">
        <span class="eyebrow">Espaço interno do projeto</span>
        <h1>Colaborar, acompanhar e construir em conjunto</h1>
        <p>A Área Colaborativa reunirá perfis, tarefas, contributos, agenda, formação, revisão do Museu e gestão da exposição itinerante.</p>
        <div class="collab-login__actions">
          <button type="button" class="ml-button ml-button--primary" data-collab-google-login ${configured?"":"disabled"}>
            Entrar com Google
          </button>
          ${!configured ? `<p class="collab-config-warning">O Google OAuth ainda não está configurado neste ambiente. Utilize o modo de demonstração para avaliar a estrutura.</p>` : ""}
          ${context.mode === "demo" ? `
            <div class="collab-demo-actions">
              <button type="button" data-collab-demo-login="pending">Demonstração: pedido de acesso</button>
              <button type="button" data-collab-demo-login="master">Demonstração: master</button>
            </div>
          ` : ""}
        </div>
      </div>
      <aside class="collab-login__principles">
        <article><strong>Identidade Google</strong><p>O login confirma nome e e-mail, sem solicitar acesso a Gmail, Drive ou Calendar.</p></article>
        <article><strong>Acesso aprovado</strong><p>Entrar com Google não concede automaticamente acesso aos módulos internos.</p></article>
        <article><strong>Perfis e permissões</strong><p>O vínculo principal e as permissões são geridos separadamente.</p></article>
      </aside>
    </section>
  `);
}

export function collaborativeOnboardingView(context) {
  const profile = context.profile || {};
  const request = context.accessRequest;
  if (request?.status === "pending") {
    return collaborativePublicFrame(context,`
      <section class="collab-pending">
        ${pageHeading("Pedido recebido","O seu acesso está em análise","A coordenação deverá confirmar o vínculo e atribuir as funções adequadas.")}
        <div class="collab-pending__card">
          ${statusPill("pending")}
          <dl>
            <dt>Nome</dt><dd>${esc(profile.display_name)}</dd>
            <dt>E-mail</dt><dd>${esc(profile.email)}</dd>
            <dt>Perfil solicitado</dt><dd>${esc(request.requested_profile_type || profile.primary_profile_type || "—")}</dd>
          </dl>
          <p>Pode atualizar os dados do pedido enquanto este permanecer pendente.</p>
          <button type="button" data-collab-edit-request>Editar pedido</button>
        </div>
        <div class="collab-onboarding-form collab-onboarding-form--hidden" data-collab-request-editor>
          ${accessRequestForm(context)}
        </div>
      </section>
    `);
  }

  return collaborativePublicFrame(context,`
    <section class="collab-onboarding">
      ${pageHeading("Primeiro acesso","Complete o pedido de acesso","O nome, o e-mail da conta Google e o perfil principal são obrigatórios.")}
      ${accessRequestForm(context)}
    </section>
  `);
}

function accessRequestForm(context) {
  const profile = context.profile || {};
  return `<form class="collab-form" data-collab-access-form>
    <label>Nome
      <input type="text" name="displayName" required value="${esc(profile.display_name || "")}" autocomplete="name">
    </label>
    <label>E-mail
      <input type="email" name="email" value="${esc(profile.email || context.session?.user?.email || "")}" readonly>
      <small>O e-mail vem da conta Google e não pode ser alterado aqui.</small>
    </label>
    <label>Perfil principal
      <select name="primaryProfileType" required>
        <option value="">Selecione</option>
        ${profileTypeOptions(context,profile.primary_profile_type)}
      </select>
      <small>Este campo descreve o vínculo predominante. As permissões serão atribuídas depois.</small>
    </label>
    <label>Como pretende colaborar?
      <textarea name="motivation" rows="5">${esc(context.accessRequest?.motivation || "")}</textarea>
    </label>
    <button type="submit" class="ml-button ml-button--primary">Enviar pedido de acesso</button>
    <p class="collab-form__feedback" data-collab-feedback aria-live="polite"></p>
  </form>`;
}

export function collaborativeDashboardView(context) {
  const profile = context.profile || {};
  const roleLabels = (context.roles || []).map(role => context.roleRegistry.find(item => item.code===role)?.name || role);
  const available = context.modules || [];
  return collaborativeShell(context,"/area-colaborativa",`
    ${pageHeading("Área Colaborativa",`Olá, ${profile.display_name || "membro"}`,"Esta fundação permite testar autenticação, perfil, permissões e a estrutura dos módulos futuros.")}
    <section class="collab-summary-grid">
      <article><span>Estado</span>${statusPill(context.membership?.status)}<p>O acesso a cada módulo depende das permissões atribuídas.</p></article>
      <article><span>Perfil principal</span><strong>${esc(context.profileTypes.find(item => item.code===profile.primary_profile_type)?.name || "Por definir")}</strong><p>Pode ser atualizado no seu perfil.</p></article>
      <article><span>Funções</span><strong>${esc(roleLabels.join(", ") || "Sem função atribuída")}</strong><p>Uma pessoa pode acumular mais de uma função.</p></article>
    </section>
    <section class="collab-module-section">
      <h2>Módulos disponíveis</h2>
      <div class="collab-module-grid">
        ${available.map(module => `<a class="collab-module-card" href="#${esc(module.route)}">
          <span>${esc(module.status === "active" ? "Disponível" : module.status === "foundation" ? "Fundação" : "Em preparação")}</span>
          <h3>${esc(module.name)}</h3>
          <p>${esc(module.description)}</p>
        </a>`).join("")}
      </div>
    </section>
  `);
}

export function collaborativeProfileView(context) {
  const profile = context.profile || {};
  return collaborativeShell(context,"/area-colaborativa/perfil",`
    ${pageHeading("Perfil","O meu perfil","Dados mínimos para colaboração, atribuição de atividades e reconhecimento opcional.")}
    <form class="collab-form collab-form--profile" data-collab-profile-form>
      <label>Nome
        <input type="text" name="displayName" required value="${esc(profile.display_name || "")}">
      </label>
      <label>E-mail
        <input type="email" value="${esc(profile.email || "")}" readonly>
      </label>
      <label>Perfil principal
        <select name="primaryProfileType" required>${profileTypeOptions(context,profile.primary_profile_type)}</select>
      </label>
      <label>Apresentação breve
        <textarea name="bio" rows="5">${esc(profile.bio || "")}</textarea>
      </label>
      <label>Telefone <small>opcional e apenas para gestão interna futura</small>
        <input type="tel" name="phone" value="${esc(profile.phone || "")}">
      </label>
      <label class="collab-check">
        <input type="checkbox" name="publicRecognitionOptIn" ${profile.public_recognition_opt_in?"checked":""}>
        Autorizo que a minha colaboração possa ser reconhecida publicamente, mediante validação prévia.
      </label>
      <button type="submit" class="ml-button ml-button--primary">Guardar perfil</button>
      <p class="collab-form__feedback" data-collab-feedback aria-live="polite"></p>
    </form>
  `);
}

export function collaborativeSkeletonView(context,moduleCode) {
  const module = context.moduleRegistry.find(item => item.code===moduleCode);
  if (!module || !hasPermission(context,module.permission)) return collaborativeForbiddenView(context);
  const examples = {
    tasks:["Digitalizar fotografias","Rever uma legenda","Apoiar a montagem de uma exposição","Transcrever uma entrevista"],
    contributions:["Fotografias","Testemunhos","Correções","Referências","Documentos"],
    agenda:["Reuniões","Visitas","Sessões de recolha","Exposição itinerante","Montagem e desmontagem"],
    library:["Guias","Consentimentos","Procedimentos","Apresentações","Critérios de catalogação"],
    training:["Introdução ao projeto","Ética e consentimento","História oral","Descrição de fotografias","Uso responsável de IA"],
    "museum-review":["31 memórias","Decisões por campo","Fontes e créditos","Relações","Histórico editorial"]
  };
  return collaborativeShell(context,module.route,`
    ${pageHeading("Módulo previsto",module.name,module.description)}
    <section class="collab-skeleton">
      ${statusPill(module.status)}
      <h2>Estrutura preparada para os próximos pacotes</h2>
      <div class="collab-skeleton__items">
        ${(examples[moduleCode] || []).map(item => `<span>${esc(item)}</span>`).join("")}
      </div>
      <p>O Pacote 08A cria a rota, o contrato de permissão e o lugar deste módulo no modelo de dados. A funcionalidade completa será entregue incrementalmente.</p>
    </section>
  `);
}

export function collaborativeAgendaView(context) {
  if (!hasPermission(context,"agenda.view")) return collaborativeForbiddenView(context);
  const items = context.exhibitions || [];
  return collaborativeShell(context,"/area-colaborativa/agenda",`
    ${pageHeading("Agenda","Atividades e exposição itinerante","Aqui será possível acompanhar onde a exposição física estará e em que período.")}
    <section class="collab-agenda">
      ${items.length ? `<div class="collab-agenda-list">${items.map(item => `
        <article>
          <time>${esc(item.starts_on)} — ${esc(item.ends_on)}</time>
          <h2>${esc(item.collab_exhibitions?.title || "Exposição")}</h2>
          <p>${esc(item.collab_venues?.name || "Local por definir")}</p>
          ${statusPill(item.status)}
        </article>`).join("")}</div>` : `
        <div class="collab-empty-state">
          <span>Calendário de exposições</span>
          <h2>Ainda não existem locais ou datas registados</h2>
          <p>O esquema já suporta exposições fixas, itinerantes, temporárias e digitais, com local, período, instalação, desmontagem e estado.</p>
        </div>
      `}
    </section>
  `);
}

export function collaborativeProfileManagementView(context) {
  if (!hasPermission(context,"memberships.manage")) return collaborativeForbiddenView(context);
  const members = context.management?.members || [];
  const requests = context.management?.requests || [];
  return collaborativeShell(context,"/area-colaborativa/gestao/perfis",`
    ${pageHeading("Gestão","Perfis e acessos","Aprovar pedidos, acompanhar estados e preparar a atribuição de funções.")}
    <section class="collab-management">
      <h2>Pedidos pendentes</h2>
      ${requests.filter(request => request.status==="pending").length ? `
        <div class="collab-request-list">${requests.filter(request => request.status==="pending").map(request => {
          const member = members.find(item => item.user_id===request.user_id);
          return `<article>
            <div><strong>${esc(member?.display_name || member?.email || request.user_id)}</strong><span>${esc(member?.email || "")}</span></div>
            <p>${esc(request.motivation || "Sem mensagem.")}</p>
            <div>${statusPill(request.status)} <span>${esc(request.requested_profile_type || "perfil por definir")}</span></div>
            <button type="button" data-collab-approve="${esc(request.user_id)}">Aprovar como voluntário</button>
          </article>`;
        }).join("")}</div>
      ` : `<p class="collab-empty-line">Não existem pedidos pendentes.</p>`}
      <h2>Membros e perfis</h2>
      <div class="collab-table-wrap">
        <table class="collab-table">
          <thead><tr><th>Nome</th><th>E-mail</th><th>Perfil</th><th>Estado</th><th>Funções</th></tr></thead>
          <tbody>${members.map(member => `<tr>
            <td>${esc(member.display_name || "—")}</td>
            <td>${esc(member.email || "—")}</td>
            <td>${esc(member.primary_profile_type || "—")}</td>
            <td>${statusPill(member.membership?.status)}</td>
            <td>${esc((member.roles || []).join(", ") || "—")}</td>
          </tr>`).join("")}</tbody>
        </table>
      </div>
    </section>
  `);
}

export function collaborativeExhibitionManagementView(context) {
  if (!hasPermission(context,"exhibitions.manage")) return collaborativeForbiddenView(context);
  return collaborativeShell(context,"/area-colaborativa/gestao/exposicoes",`
    ${pageHeading("Gestão","Exposições físicas","Fundação para registar exposições, locais e períodos da itinerância.")}
    <section class="collab-exhibition-foundation">
      <div class="collab-foundation-flow">
        <article><span>1</span><h2>Exposição</h2><p>Título, tipo e estado geral.</p></article>
        <article><span>2</span><h2>Local</h2><p>Museu, escola, biblioteca ou espaço público.</p></article>
        <article><span>3</span><h2>Agendamento</h2><p>Datas, instalação, desmontagem e estado.</p></article>
      </div>
      <p>O CRUD completo, notificações, conflitos de datas e calendário visual serão tratados num pacote próprio.</p>
    </section>
  `);
}

export function collaborativeForbiddenView(context) {
  return collaborativeShell(context,"",`
    ${pageHeading("Acesso condicionado","Este módulo não está disponível para o seu perfil","A coordenação pode atribuir outras funções quando necessário.")}
  `);
}
