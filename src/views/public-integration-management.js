/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { collaborativeShell, statusPill } from "../components/collaborative-layout.js";
import { hasPermission } from "../collab/permissions.js";

const esc = (v) => String(v ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const workspace = (context) => context.publicIntegrationWorkspace || { proposals: [], snapshots: [], evolutionProposals: [] };

function heading(title, description, actions = "") {
  return `<header class="collab-page-heading collab-page-heading--actions"><div><span>08L · Integração pública e evolução</span><h1>${esc(title)}</h1><p>${esc(description)}</p></div>${actions ? `<div class="collab-heading-actions">${actions}</div>` : ""}</header>`;
}
function empty(m) { return `<div class="public-integration-empty" role="status">${esc(m)}</div>`; }

function blockedBanner() {
  return `<div class="public-integration-banner" role="status" aria-live="polite"><strong>Nenhum efeito público está ativo.</strong> A leitura pública é apenas de snapshots aprovados. A ativação exige proposta revista (editorial, direitos, privacidade, tradução, acessibilidade, técnica), snapshot com checksum e a confirmação literal <code>ACTIVATE_MILREU_PUBLIC_EFFECT</code>. Produção permanece bloqueada.</div>`;
}

export function collaborativePublicIntegrationView(context) {
  if (!hasPermission(context, "public-integration.view")) {
    return collaborativeShell(context, "/area-colaborativa/gestao/integracao-publica", heading("Integração pública", "Sem permissão para gerir a integração pública."));
  }
  const ws = workspace(context);
  const proposals = ws.proposals || [];
  const canActivate = hasPermission(context, "public-integration.activate");
  const canDecideEvolution = hasPermission(context, "evolution.decide");

  const proposalForm = hasPermission(context, "public-integration.propose") ? `
    <form class="public-integration-form" data-public-proposal-form>
      <h3>Propor efeito público</h3>
      <label>Código <input type="text" name="code" required aria-label="Código"></label>
      <label>Título <input type="text" name="title" required aria-label="Título"></label>
      <label>Finalidade <input type="text" name="purpose" required aria-label="Finalidade"></label>
      <label>Superfície
        <select name="targetSurface" aria-label="Superfície">
          <option value="portal">Portal</option>
          <option value="museum">Museu</option>
        </select>
      </label>
      <label>Slot
        <select name="targetSlot" aria-label="Slot">
          <option value="portal.home.after-featured">portal.home.after-featured</option>
          <option value="museum.home.after-opening">museum.home.after-opening</option>
        </select>
      </label>
      <p class="public-integration-hint">A proposta não ativa nada. Passa por revisão de seis dimensões e aprovação humana.</p>
      <button type="submit">Criar proposta</button>
    </form>` : "";

  const activationForm = canActivate ? `
    <form class="public-integration-form public-integration-form--approve" data-public-activation-form>
      <h3>Ativação pública (staging)</h3>
      <label>Snapshot <input type="text" name="snapshotId" required aria-label="Snapshot"></label>
      <label>Ação
        <select name="action" aria-label="Ação">
          <option value="preview">Pré-visualizar</option>
          <option value="activate">Ativar</option>
          <option value="suspend">Suspender</option>
          <option value="expire">Expirar</option>
        </select>
      </label>
      <label>Confirmação literal (só ativação) <input type="text" name="confirmation" placeholder="ACTIVATE_MILREU_PUBLIC_EFFECT" aria-label="Confirmação literal"></label>
      <label>Motivo <input type="text" name="reason" required aria-label="Motivo"></label>
      <button type="submit" class="ml-button">Executar ação</button>
    </form>` : `<div class="public-integration-note">A ativação e o rollback públicos exigem a função <code>public-integration.activate</code>/<code>rollback</code> (master).</div>`;

  const evolutionForm = `
    <form class="public-integration-form" data-evolution-proposal-form>
      <h3>Proposta de evolução (orientada pelo piloto)</h3>
      <label>Código <input type="text" name="code" required aria-label="Código"></label>
      <label>Título <input type="text" name="title" required aria-label="Título"></label>
      <label>Achado <input type="text" name="findingSummary" required aria-label="Achado"></label>
      <label>Mudança proposta <input type="text" name="proposedChange" required aria-label="Mudança proposta"></label>
      <p class="public-integration-hint">Sem evidência real do piloto, as propostas não podem ser confirmadas.</p>
      <button type="submit">Registar proposta</button>
    </form>`;

  return collaborativeShell(context, "/area-colaborativa/gestao/integracao-publica", `
    ${heading("Integração pública e evolução", "Propostas, revisão, snapshots, ativação e evolução orientada pelo piloto.", `<a class="ml-button ml-button--secondary" href="#/area-colaborativa/gestao/piloto">Piloto</a>`)}
    ${blockedBanner()}
    <section class="public-integration-section" aria-label="Propostas de publicação">
      <h2>Propostas de publicação</h2>
      ${proposals.length ? `<ul class="public-integration-list">${proposals.map((p) => `<li><strong>${esc(p.code || p.title)}</strong> ${statusPill(p.status || "draft")} <span>${esc(p.target_surface || p.targetSurface)}</span></li>`).join("")}</ul>` : empty("Nenhuma proposta. Nenhum efeito público está ativo.")}
    </section>
    <section class="public-integration-section public-integration-grid" aria-label="Ações de integração pública">
      ${proposalForm}
      ${activationForm}
    </section>
    <section class="public-integration-section" aria-label="Evolução">
      <h2>Evolução orientada pelo piloto</h2>
      ${evolutionForm}
      ${canDecideEvolution ? "" : `<div class="public-integration-note">A decisão de evolução exige a função <code>evolution.decide</code> (master).</div>`}
    </section>`);
}
