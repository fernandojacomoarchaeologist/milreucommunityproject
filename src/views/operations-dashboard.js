/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { collaborativeShell, statusPill } from "../components/collaborative-layout.js";
import { hasPermission } from "../collab/permissions.js";

const esc = (v) => String(v ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const workspace = (context) => context.operationsGovernanceWorkspace || { operatingCycles: [], mySupport: [], governanceDecisions: [], canManage: false };

function heading(title, description, actions = "") {
  return `<header class="collab-page-heading collab-page-heading--actions"><div><span>08M · Operação e governação</span><h1>${esc(title)}</h1><p>${esc(description)}</p></div>${actions ? `<div class="collab-heading-actions">${actions}</div>` : ""}</header>`;
}
function empty(m) { return `<div class="opgov-empty" role="status">${esc(m)}</div>`; }
function banner() {
  return `<div class="opgov-banner" role="status" aria-live="polite"><strong>Nenhum ciclo operacional real, responsável ou indicador foi definido.</strong> A transparência pública está desativada; o público lê apenas snapshots aprovados. Produção permanece bloqueada.</div>`;
}

export function operationsGovernanceDashboardView(context) {
  if (!hasPermission(context, "operations.view")) {
    return collaborativeShell(context, "/area-colaborativa/gestao/operacao", heading("Operação e governação", "Sem permissão para aceder."));
  }
  const ws = workspace(context);
  const cycles = ws.operatingCycles || [];
  const support = ws.mySupport || [];
  const canManage = hasPermission(context, "operations.manage");

  const supportForm = hasPermission(context, "support.submit") ? `
    <form class="opgov-form" data-support-submit-form>
      <h3>Abrir pedido de suporte</h3>
      <label>Categoria <input type="text" name="category" required aria-label="Categoria"></label>
      <label>Resumo <input type="text" name="summary" required aria-label="Resumo"></label>
      <label>Descrição <textarea name="description" required aria-label="Descrição"></textarea></label>
      <button type="submit">Enviar pedido</button>
    </form>` : "";

  const cycleForm = canManage ? `
    <form class="opgov-form" data-operating-cycle-form>
      <h3>Novo ciclo operacional</h3>
      <label>Código <input type="text" name="code" required aria-label="Código"></label>
      <label>Título <input type="text" name="title" required aria-label="Título"></label>
      <button type="submit">Criar ciclo</button>
    </form>` : "";

  const continuityForm = hasPermission(context, "continuity.manage") ? `
    <form class="opgov-form" data-continuity-form>
      <h3>Revisão de continuidade</h3>
      <label>Tipo <input type="text" name="reviewType" required aria-label="Tipo de revisão"></label>
      <label>Estado
        <select name="status" aria-label="Estado">
          <option value="in-review">Em revisão</option>
          <option value="at-risk">Em risco</option>
          <option value="adequate">Adequada</option>
        </select>
      </label>
      <label><input type="checkbox" name="singlePersonRisk"> Risco de pessoa única</label>
      <button type="submit">Registar revisão</button>
    </form>` : "";

  return collaborativeShell(context, "/area-colaborativa/gestao/operacao", `
    ${heading("Operação e governação", "Ciclos, suporte, moderação, indicadores e continuidade.", `<a class="ml-button ml-button--secondary" href="#/area-colaborativa/gestao/governanca">Governação</a>`)}
    ${banner()}
    <section class="opgov-section" aria-label="Ciclos operacionais">
      <h2>Ciclos operacionais</h2>
      ${cycles.length ? `<ul class="opgov-list">${cycles.map((c) => `<li><strong>${esc(c.code || c.title)}</strong> ${statusPill(c.status || "draft")}</li>`).join("")}</ul>` : empty("Nenhum ciclo. Ciclos, datas e responsáveis não são inventados.")}
    </section>
    <section class="opgov-section" aria-label="Os meus pedidos de suporte">
      <h2>Os meus pedidos de suporte</h2>
      ${support.length ? `<ul class="opgov-list">${support.map((s) => `<li>${esc(s.public_reference || "")} ${statusPill(s.status || "new")}</li>`).join("")}</ul>` : empty("Sem pedidos de suporte.")}
    </section>
    <section class="opgov-section opgov-grid" aria-label="Ações">
      ${supportForm}
      ${cycleForm}
      ${continuityForm}
    </section>`);
}
