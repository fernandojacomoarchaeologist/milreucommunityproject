/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { collaborativeShell, statusPill } from "../components/collaborative-layout.js";
import { hasPermission } from "../collab/permissions.js";

const esc = (value) => String(value ?? "").replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
const date = (value) => (value ? new Intl.DateTimeFormat("pt-PT", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "—");
const workspace = (context) => context.pilotWorkspace || { cycles: [], myParticipation: [], myObservations: [], gates: [], canManage: false };

function heading(title, description, actions = "") {
  return `<header class="collab-page-heading collab-page-heading--actions"><div><span>08K · Piloto controlado</span><h1>${esc(title)}</h1><p>${esc(description)}</p></div>${actions ? `<div class="collab-heading-actions">${actions}</div>` : ""}</header>`;
}

function blockedBanner() {
  return `<div class="pilot-gate-banner" role="status" aria-live="polite"><strong>Homologação de staging bloqueada.</strong> O piloto opera apenas em staging; produção e efeitos públicos permanecem desativados. A aprovação exige gates com evidência real e a confirmação literal <code>APPROVE_MILREU_STAGING_HOMOLOGATION</code>.</div>`;
}

function participationCard(participation) {
  return `<article class="pilot-participation-card"><header><h2>${esc(participation.cycleId || "Ciclo")}</h2>${statusPill(participation.status || "invited")}</header>
    <dl>
      <div><dt>Perfil no piloto</dt><dd>${esc(participation.participant_role || participation.participantRole || "participant")}</dd></div>
      <div><dt>Onboarding</dt><dd>${esc(participation.onboarding_status || participation.onboardingStatus || "pending")}</dd></div>
      <div><dt>Confirmado</dt><dd>${esc(date(participation.confirmed_at || participation.confirmedAt))}</dd></div>
    </dl></article>`;
}

function emptyState(message) {
  return `<div class="pilot-empty" role="status">${esc(message)}</div>`;
}

// Vista de participação (membros inscritos veem apenas o próprio contexto).
export function collaborativePilotView(context) {
  if (!hasPermission(context, "pilot.view")) {
    return collaborativeShell(context, "/area-colaborativa/piloto", heading("Piloto", "Sem permissão para aceder ao piloto."));
  }
  const ws = workspace(context);
  const participation = ws.myParticipation || [];
  const observations = ws.myObservations || [];

  const confirmForm = `
    <form class="pilot-form" data-pilot-confirm-form>
      <h3>Confirmar participação</h3>
      <p>Li e aceito o aviso de participação do piloto.</p>
      <label>Versão do aviso <input type="text" name="noticeVersion" required aria-label="Versão do aviso"></label>
      <button type="submit">Confirmar participação</button>
    </form>`;

  const feedbackForm = `
    <form class="pilot-form" data-pilot-feedback-form>
      <h3>Submeter feedback</h3>
      <label>Tipo
        <select name="observationType" aria-label="Tipo de observação" required>
          <option value="functional">Falha funcional</option>
          <option value="usability">Usabilidade</option>
          <option value="accessibility">Acessibilidade</option>
          <option value="content">Conteúdo</option>
          <option value="rights">Direitos</option>
          <option value="privacy">Privacidade</option>
          <option value="performance">Desempenho</option>
          <option value="support">Suporte</option>
          <option value="other">Outro</option>
        </select>
      </label>
      <label>Resumo <input type="text" name="summary" required aria-label="Resumo"></label>
      <label>Descrição <textarea name="description" required aria-label="Descrição"></textarea></label>
      <button type="submit">Enviar feedback</button>
    </form>`;

  const withdrawForm = `
    <form class="pilot-form pilot-form--danger" data-pilot-withdraw-form>
      <h3>Retirar-me do piloto</h3>
      <p>A retirada preserva o histórico necessário e não afeta o vínculo geral.</p>
      <button type="submit" class="ml-button ml-button--danger">Pedir retirada do piloto</button>
    </form>`;

  return collaborativeShell(context, "/area-colaborativa/piloto", `
    ${heading("Piloto controlado", "Participação, sessões, feedback e acompanhamento próprios.")}
    ${blockedBanner()}
    <section class="pilot-section" aria-label="A minha participação">
      <h2>A minha participação</h2>
      ${participation.length ? participation.map(participationCard).join("") : emptyState("Ainda não está inscrito num ciclo de piloto. A inscrição é feita pela coordenação.")}
    </section>
    <section class="pilot-section pilot-grid" aria-label="Ações do participante">
      ${confirmForm}
      ${feedbackForm}
      ${withdrawForm}
    </section>
    <section class="pilot-section" aria-label="O meu feedback">
      <h2>O meu feedback</h2>
      ${observations.length ? `<ul class="pilot-observation-list">${observations.map((o) => `<li><span>${esc(o.observation_type || o.observationType)}</span> ${esc(o.summary)} ${statusPill(o.status || "new")}</li>`).join("")}</ul>` : emptyState("Sem feedback submetido.")}
    </section>`);
}

// Vista de gestão (coordenação/master; conforme permissões).
export function collaborativePilotManagementView(context) {
  if (!hasPermission(context, "pilot.manage")) {
    return collaborativeShell(context, "/area-colaborativa/gestao/piloto", heading("Gestão do piloto", "Sem permissão para gerir o piloto."));
  }
  const ws = workspace(context);
  const cycles = ws.cycles || [];
  const gates = ws.gates || [];
  const canApprove = hasPermission(context, "pilot.approve");

  const cycleForm = `
    <form class="pilot-form" data-pilot-cycle-form>
      <h3>Novo ciclo de piloto (staging)</h3>
      <label>Código <input type="text" name="code" required aria-label="Código"></label>
      <label>Título <input type="text" name="title" required aria-label="Título"></label>
      <label>Objetivo <input type="text" name="objective" required aria-label="Objetivo"></label>
      <label>Release base <input type="text" name="baselineRelease" required aria-label="Release base"></label>
      <p class="pilot-hint">O ambiente é sempre <code>staging</code>. Produção permanece bloqueada.</p>
      <button type="submit">Criar ciclo</button>
    </form>`;

  const enrolForm = `
    <form class="pilot-form" data-pilot-enrol-form>
      <h3>Inscrever participante</h3>
      <p>Só membros ativos podem ser inscritos. A auto-inscrição é proibida.</p>
      <label>Identificador do membro <input type="text" name="userId" required aria-label="Identificador do membro"></label>
      <label>Papel
        <select name="participantRole" aria-label="Papel no piloto">
          <option value="participant">Participante</option>
          <option value="facilitator">Facilitador</option>
          <option value="observer">Observador</option>
        </select>
      </label>
      <button type="submit">Inscrever na coorte</button>
    </form>`;

  const gateForm = `
    <form class="pilot-form" data-pilot-gate-form>
      <h3>Registar resultado de gate</h3>
      <label>Gate <input type="text" name="gateCode" required aria-label="Código do gate"></label>
      <label>Estado
        <select name="status" aria-label="Estado do gate">
          <option value="pending">Pendente</option>
          <option value="passed">Aprovado</option>
          <option value="failed">Falhado</option>
          <option value="blocked">Bloqueado</option>
        </select>
      </label>
      <button type="submit">Registar gate</button>
    </form>`;

  const approveForm = canApprove ? `
    <form class="pilot-form pilot-form--approve" data-pilot-approve-form>
      <h3>Aprovar homologação de staging</h3>
      <p>Requer todos os gates bloqueadores aprovados e zero observações críticas abertas.</p>
      <label>Confirmação literal <input type="text" name="confirmation" placeholder="APPROVE_MILREU_STAGING_HOMOLOGATION" required aria-label="Confirmação literal"></label>
      <button type="submit" class="ml-button">Aprovar homologação de staging</button>
    </form>` : `<div class="pilot-note">A aprovação final da homologação exige a função <code>pilot.approve</code> (master).</div>`;

  return collaborativeShell(context, "/area-colaborativa/gestao/piloto", `
    ${heading("Gestão do piloto", "Ciclos, coorte, cenários, sessões, observações, métricas e gates.", `<a class="ml-button ml-button--secondary" href="#/area-colaborativa/gestao/homologacao">Homologação</a>`)}
    ${blockedBanner()}
    <section class="pilot-section" aria-label="Ciclos">
      <h2>Ciclos de piloto</h2>
      ${cycles.length ? `<ul class="pilot-cycle-list">${cycles.map((c) => `<li><strong>${esc(c.code || c.title)}</strong> ${statusPill(c.status || "draft")} <span>${esc(c.phase || "preparation")}</span></li>`).join("")}</ul>` : emptyState("Nenhum ciclo criado. Os ciclos, datas e coorte não são inventados.")}
    </section>
    <section class="pilot-section pilot-grid" aria-label="Operação do piloto">
      ${cycleForm}
      ${enrolForm}
      ${gateForm}
    </section>
    <section class="pilot-section" aria-label="Gates">
      <h2>Gates</h2>
      ${gates.length ? `<table class="pilot-gate-table"><thead><tr><th>Gate</th><th>Estado</th><th>Bloqueador</th></tr></thead><tbody>${gates.map((g) => `<tr><td>${esc(g.gate_code || g.gateCode)}</td><td>${statusPill(g.status || "pending")}</td><td>${g.blocking === false ? "não" : "sim"}</td></tr>`).join("")}</tbody></table>` : emptyState("Sem gates avaliados.")}
      ${approveForm}
    </section>`);
}
