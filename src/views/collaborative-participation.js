/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { collaborativeShell, statusPill } from "../components/collaborative-layout.js";
import { hasPermission } from "../collab/permissions.js";
import { programmesFor, myEnrolments } from "../services/participation-programme-service.js";

const esc = (v) => String(v ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const workspace = (context) => context.participationWorkspace || { programmes: [], myEnrolments: [], canManage: false };

function heading(title, description, actions = "") {
  return `<header class="collab-page-heading collab-page-heading--actions"><div><span>08L · Participação contínua</span><h1>${esc(title)}</h1><p>${esc(description)}</p></div>${actions ? `<div class="collab-heading-actions">${actions}</div>` : ""}</header>`;
}
function empty(m) { return `<div class="participation-empty" role="status">${esc(m)}</div>`; }

export function collaborativeParticipationView(context) {
  if (!hasPermission(context, "participation.view")) {
    return collaborativeShell(context, "/area-colaborativa/participacao", heading("Participação contínua", "Sem permissão para aceder."));
  }
  const ws = workspace(context);
  const programmes = programmesFor(ws);
  const enrolments = myEnrolments(ws);
  const canManage = hasPermission(context, "participation.manage");

  const enrolForm = `
    <form class="participation-form" data-participation-enrol-form>
      <h3>Inscrever-me num percurso</h3>
      <label>Código do programa <input type="text" name="programmeId" required aria-label="Código do programa"></label>
      <button type="submit">Inscrever-me</button>
    </form>`;

  const progressForm = `
    <form class="participation-form" data-participation-progress-form>
      <h3>Atualizar o meu progresso</h3>
      <label>Inscrição <input type="text" name="enrolmentId" required aria-label="Inscrição"></label>
      <label>Passo <input type="text" name="stepId" required aria-label="Passo"></label>
      <label>Estado
        <select name="status" aria-label="Estado do progresso">
          <option value="in-progress">Em curso</option>
          <option value="completed">Concluído</option>
          <option value="blocked">Bloqueado</option>
          <option value="skipped">Ignorado</option>
        </select>
      </label>
      <p class="participation-hint">Não há ranking nem pontuação. A validação por coordenação é registada quando exigida.</p>
      <button type="submit">Registar progresso</button>
    </form>`;

  const manageForm = canManage ? `
    <form class="participation-form" data-participation-programme-form>
      <h3>Novo percurso</h3>
      <label>Código <input type="text" name="code" required aria-label="Código"></label>
      <label>Título <input type="text" name="title" required aria-label="Título"></label>
      <label>Descrição <input type="text" name="description" required aria-label="Descrição"></label>
      <label>Objetivo <input type="text" name="objective" required aria-label="Objetivo"></label>
      <label>Visibilidade
        <select name="visibility" aria-label="Visibilidade">
          <option value="members">Membros</option>
          <option value="public">Público</option>
          <option value="restricted">Restrito</option>
        </select>
      </label>
      <button type="submit">Criar percurso</button>
    </form>` : "";

  return collaborativeShell(context, "/area-colaborativa/participacao", `
    ${heading("Participação contínua", "Percursos, próximos passos e continuidade da participação.")}
    <section class="participation-section" aria-label="Percursos">
      <h2>Percursos disponíveis</h2>
      ${programmes.length ? `<ul class="participation-list">${programmes.map((p) => `<li><strong>${esc(p.title || p.code)}</strong> ${statusPill(p.status || "draft")} <span>${esc(p.visibility || "members")}</span></li>`).join("")}</ul>` : empty("Nenhum percurso disponível. Percursos, responsáveis e regras não são inventados.")}
    </section>
    <section class="participation-section" aria-label="As minhas inscrições">
      <h2>As minhas inscrições</h2>
      ${enrolments.length ? `<ul class="participation-list">${enrolments.map((e) => `<li>${esc(e.programme_id)} ${statusPill(e.status || "enrolled")}</li>`).join("")}</ul>` : empty("Sem inscrições.")}
    </section>
    <section class="participation-section participation-grid" aria-label="Ações">
      ${enrolForm}
      ${progressForm}
      ${manageForm}
    </section>`);
}
