/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 09C.1 — Área Colaborativa: jornada funcional de oportunidades e candidaturas.
 * Master: criar/editar rascunho, pré-visualizar, publicar, encerrar, cancelar, decidir,
 * remover participante (com justificação interna), capacidade, duplicar e exportar.
 * Candidato: candidatar-se, consultar resultado e retirar. Candidatos são sempre privados.
 * Em demonstração usa dados locais fictícios; em staging opera com as RPCs/RLS do 09C.
 * pt-PT é a fonte; nenhuma tradução é publicada aqui (usa o i18n do 09D).
 */
import { collaborativeShell } from "../components/collaborative-layout.js";
import { hasPermission } from "../collab/permissions.js";

const esc = (v) => String(v ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const TYPES = [
  ["community-activity", "Atividade comunitária"], ["course", "Curso"], ["event", "Evento"],
  ["volunteering", "Voluntariado"], ["fieldwork", "Trabalho de campo"], ["workshop", "Oficina"],
  ["documentation-support", "Apoio documental"], ["research-participation", "Investigação participativa"], ["other", "Outra"],
];
const typeLabel = (t) => (TYPES.find(([c]) => c === t) || [null, "Oportunidade"])[1];
const STATUS_LABELS = { draft: "Rascunho", published: "Publicada", cancelled: "Cancelada" };
const APP_STATUS_LABELS = { submitted: "Submetida", accepted: "Aceite", "not-selected": "Não selecionada", withdrawn: "Retirada", removed: "Removida" };

function forbidden(context) {
  return collaborativeShell(context, "", `<header class="collab-page-heading"><div><span>Acesso condicionado</span><h1>Oportunidades indisponíveis</h1><p>O seu perfil não possui permissão para esta área.</p></div></header>`);
}

function typeOptions(selected) {
  return TYPES.map(([c, l]) => `<option value="${c}"${c === selected ? " selected" : ""}>${esc(l)}</option>`).join("");
}

function opportunityForm(o = {}) {
  const editing = Boolean(o.id);
  return `<form class="collab-form opportunity-form" data-opportunity-form ${editing ? `data-opportunity-id="${esc(o.id)}"` : ""}>
    <h3>${editing ? "Editar oportunidade" : "Nova oportunidade"}</h3>
    <label>Título<input name="title" required value="${esc(o.title || "")}" maxlength="140"></label>
    <label>Resumo<input name="summary" required value="${esc(o.summary || "")}" maxlength="240"></label>
    <label>Descrição<textarea name="description" rows="3">${esc(o.description || "")}</textarea></label>
    <label>Tipo<select name="opportunityType">${typeOptions(o.opportunityType || "community-activity")}</select></label>
    <label>Visibilidade<select name="visibility">
      <option value="public"${o.visibility !== "members" ? " selected" : ""}>Pública</option>
      <option value="members"${o.visibility === "members" ? " selected" : ""}>Só membros</option></select></label>
    <label>Local<input name="locationText" value="${esc(o.locationText || "")}"></label>
    <div class="collab-form__row">
      <label>Início<input type="date" name="startsAt" value="${esc((o.startsAt || "").slice(0, 10))}"></label>
      <label>Fim<input type="date" name="endsAt" value="${esc((o.endsAt || "").slice(0, 10))}"></label>
      <label>Prazo<input type="date" name="applicationDeadline" value="${esc((o.applicationDeadline || "").slice(0, 10))}"></label>
    </div>
    <div class="collab-form__row">
      <label>Capacidade<select name="capacityMode">
        <option value="unlimited"${o.capacityMode !== "limited" ? " selected" : ""}>Sem limite</option>
        <option value="limited"${o.capacityMode === "limited" ? " selected" : ""}>Limitada</option></select></label>
      <label>Máximo<input type="number" name="capacity" min="1" value="${esc(o.capacity ?? "")}"></label>
    </div>
    <p class="collab-form__hint">Os dados operacionais (datas, capacidade, custo, remuneração, estado) são únicos e não são alterados por traduções.</p>
    <button type="submit">${editing ? "Guardar" : "Criar rascunho"}</button>
    <p data-collab-feedback></p>
  </form>`;
}

function managerApplications(apps, opportunityId) {
  const rows = apps.filter((a) => (a.opportunityId || a.opportunity_id) === opportunityId);
  if (!rows.length) return `<p class="collab-empty-inline">Sem candidaturas. Os candidatos são sempre privados.</p>`;
  return `<table class="collab-table opportunity-applications"><thead><tr><th>Candidato</th><th>Estado</th><th>Ações</th></tr></thead><tbody>${
    rows.map((a) => {
      const st = a.status;
      const actions = st === "submitted"
        ? `<button type="button" data-opportunity-decide="${esc(a.id)}" data-decision="accepted">Aceitar</button>
           <button type="button" data-opportunity-decide="${esc(a.id)}" data-decision="not-selected">Não selecionar</button>`
        : st === "accepted"
          ? `<button type="button" data-opportunity-remove="${esc(a.id)}">Remover…</button>`
          : "—";
      return `<tr><td>${esc(a.displayName || a.display_name || "(sem nome)")}</td><td>${esc(APP_STATUS_LABELS[st] || st)}</td><td class="opportunity-applications__actions">${actions}</td></tr>`;
    }).join("")
  }</tbody></table>`;
}

function managerCard(o, apps) {
  return `<article class="opportunity-manage-card" data-opportunity-card="${esc(o.id)}">
    <header><h3>${esc(o.title)} <span class="pill pill--${esc(o.status)}">${esc(STATUS_LABELS[o.status] || o.status)}</span></h3>
      <p>${esc(typeLabel(o.opportunityType))} · ${o.visibility === "members" ? "Só membros" : "Pública"} · ${o.capacityMode === "limited" ? `máx. ${esc(o.capacity ?? "—")}` : "sem limite"}${o.applicationsClosed ? " · candidaturas encerradas" : ""}</p></header>
    <div class="opportunity-manage-card__actions">
      <a class="ml-button ml-button--secondary" href="#/oportunidades/${esc(o.slug)}" data-opportunity-preview>Pré-visualizar</a>
      ${o.status === "draft" ? `<button type="button" data-opportunity-publish="${esc(o.id)}">Publicar</button>` : ""}
      ${o.status === "published" && !o.applicationsClosed ? `<button type="button" data-opportunity-close="${esc(o.id)}">Encerrar candidaturas</button>` : ""}
      ${o.status !== "cancelled" ? `<button type="button" data-opportunity-cancel="${esc(o.id)}">Cancelar…</button>` : ""}
      <button type="button" data-opportunity-duplicate="${esc(o.id)}">Duplicar</button>
      <button type="button" data-opportunity-export="${esc(o.id)}">Exportar lista</button>
    </div>
    <details class="opportunity-manage-card__apps"><summary>Candidaturas</summary>${managerApplications(apps, o.id)}
      <p class="collab-form__hint">Notas e justificações internas nunca aparecem na página pública nem para o candidato.</p></details>
  </article>`;
}

function minimumProfileForm(context) {
  const p = context.profile || {};
  return `<form class="collab-form minimum-profile-form" data-minimum-profile-form>
    <h3>Perfil mínimo</h3>
    <p class="collab-form__hint">Pedimos apenas o indispensável para tratar a candidatura. O e-mail validado pelo provedor não é pedido novamente.</p>
    <label>Nome<input name="displayName" required value="${esc(p.display_name || "")}"></label>
    ${p.email ? `<p class="collab-form__hint">E-mail validado: ${esc(p.email)}</p>` : ""}
    <label>Forma de contacto preferida<select name="preferredContact">
      <option value="email">E-mail</option><option value="phone">Telefone</option><option value="either">Indiferente</option></select></label>
    <label>Interesses de participação<input name="interests" placeholder="ex.: fotografia, eventos" value="${esc((p.interests || []).join(", "))}"></label>
    <label>Disponibilidade básica<input name="availabilityNote" placeholder="ex.: fins de semana"></label>
    <label class="collab-checkbox"><input type="checkbox" name="consent"> Li e aceito a política de privacidade e o consentimento de participação.</label>
    <button type="submit">Guardar perfil mínimo</button>
    <p data-collab-feedback></p>
  </form>`;
}

function candidateSection(context, ws) {
  const uid = ws.viewerId;
  const mine = ws.applications.filter((a) => (a.userId || a.user_id) === uid);
  const published = ws.opportunities.filter((o) => o.status === "published");
  const needsProfile = context.profile && !context.profile.minimum_profile_confirmed;
  const openList = published.map((o) => {
    const has = mine.find((a) => (a.opportunityId || a.opportunity_id) === o.id && ["submitted", "accepted"].includes(a.status));
    return `<li><div><strong>${esc(o.title)}</strong><span>${esc(typeLabel(o.opportunityType))}${o.applicationsClosed ? " · encerrada" : ""}</span></div>
      ${has ? `<span class="pill">${esc(APP_STATUS_LABELS[has.status])}</span>`
        : o.applicationsClosed ? `<span class="collab-empty-inline">Candidaturas encerradas</span>`
        : needsProfile ? `<a class="ml-button ml-button--secondary" href="#/area-colaborativa/perfil">Completar perfil</a>`
        : `<button type="button" data-opportunity-apply="${esc(o.id)}">Candidatar-me</button>`}</li>`;
  }).join("");
  return `<section class="collab-section">
    <h2>Candidatar-me</h2>
    ${needsProfile ? minimumProfileForm(context) : ""}
    ${published.length ? `<ul class="opportunity-open-list">${openList}</ul>` : `<p class="collab-empty-inline">Não há oportunidades publicadas de momento.</p>`}
    <h2>As minhas candidaturas</h2>
    ${mine.length ? `<ul class="opportunity-my-apps">${mine.map((a) => {
      const o = ws.opportunities.find((x) => x.id === (a.opportunityId || a.opportunity_id));
      return `<li><div><strong>${esc(o?.title || "Oportunidade")}</strong> <span class="pill">${esc(APP_STATUS_LABELS[a.status] || a.status)}</span></div>
        ${a.status === "submitted" ? `<button type="button" data-opportunity-withdraw="${esc(a.id)}">Retirar candidatura</button>` : ""}</li>`;
    }).join("")}</ul>` : `<p class="collab-empty-inline">Ainda não tem candidaturas.</p>`}
  </section>`;
}

export function collaborativeOpportunitiesView(context) {
  if (!hasPermission(context, "opportunities.view")) return forbidden(context);
  const canManage = hasPermission(context, "opportunities.manage");
  const ws = context.opportunitiesWorkspace || { opportunities: [], applications: [], viewerId: null };
  const demo = context.mode === "demo";
  const managerBody = canManage ? `
    <section class="collab-section">
      <div class="section-heading-inline"><div><h2>Gestão de oportunidades</h2><p>A decisão pertence ao dono do projeto. A pré-visualização não torna o rascunho público.</p></div></div>
      ${opportunityForm()}
      <div class="opportunity-manage-list">${ws.opportunities.length ? ws.opportunities.map((o) => managerCard(o, ws.applications)).join("") : `<p class="collab-empty-inline">Ainda não criou oportunidades. Crie um rascunho acima.</p>`}</div>
    </section>` : "";
  return collaborativeShell(context, "/area-colaborativa/oportunidades", `
    <header class="collab-page-heading collab-page-heading--actions">
      <div><span>Participação</span><h1>Oportunidades</h1>
        <p>Leitura pública em <a href="#/oportunidades">/oportunidades</a>; as candidaturas são sempre privadas. A participação de menores está bloqueada até existir política institucional.</p></div>
      ${canManage ? `<div class="collab-heading-actions"><a class="ml-button ml-button--secondary" href="#/oportunidades">Ver página pública</a></div>` : ""}
    </header>
    ${demo ? `<p class="collab-inline-note" data-opportunity-demo-note>${esc(ws.notice || "Dados de demonstração locais — não representam oportunidades reais.")}</p>` : ""}
    ${managerBody}
    ${candidateSection(context, ws)}
  `);
}
