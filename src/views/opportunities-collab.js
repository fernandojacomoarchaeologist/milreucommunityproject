/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 09C — Área Colaborativa: oportunidades e candidaturas.
 * Como participação contínua e operação, as oportunidades operam com dados reais
 * em staging; a demonstração não cria oportunidades nem candidaturas. As RPCs
 * (security definer) e a RLS estão prontas para o ambiente real.
 */
import { collaborativeShell } from "../components/collaborative-layout.js";
import { hasPermission } from "../collab/permissions.js";

function forbidden(context) {
  return collaborativeShell(context, "", `<header class="collab-page-heading"><div><span>Acesso condicionado</span><h1>Oportunidades indisponíveis</h1><p>O seu perfil não possui permissão para esta área.</p></div></header>`);
}

export function collaborativeOpportunitiesView(context) {
  if (!hasPermission(context, "opportunities.view")) return forbidden(context);
  const canManage = hasPermission(context, "opportunities.manage");
  const workspace = context.opportunitiesWorkspace || { opportunities: [], applications: [] };
  const demo = context.mode === "demo";
  return collaborativeShell(context, "/area-colaborativa/oportunidades", `
    <header class="collab-page-heading collab-page-heading--actions">
      <div><span>Participação</span><h1>Oportunidades</h1>
        <p>Cursos, eventos, voluntariado, oficinas e outras formas de participar. A leitura pública está em <a href="#/oportunidades">/oportunidades</a>; as candidaturas são sempre privadas.</p></div>
      ${canManage ? `<div class="collab-heading-actions"><a class="ml-button ml-button--secondary" href="#/oportunidades">Ver página pública</a></div>` : ""}
    </header>
    <section class="collab-summary-grid">
      <article><span>As minhas candidaturas</span><strong>${(workspace.applications || []).length}</strong><p>Estados: submetida, aceite, não selecionada, retirada.</p></article>
      ${canManage ? `<article><span>Oportunidades</span><strong>${(workspace.opportunities || []).length}</strong><p>Decisão do dono do projeto. Candidatos nunca aparecem publicamente.</p></article>` : ""}
      <article><span>Menores</span><strong>Bloqueado</strong><p>A participação de menores está bloqueada até existir política institucional.</p></article>
    </section>
    ${demo ? `<section class="collab-skeleton"><h2>Ambiente de demonstração</h2><p>As oportunidades e candidaturas operam com dados reais em <strong>staging</strong>. A demonstração não cria oportunidades nem candidaturas. A leitura pública e a partilha estão disponíveis em <a href="#/oportunidades">/oportunidades</a>.</p></section>`
      : `<section class="collab-empty-state"><span>Oportunidades</span><h2>Sem oportunidades${canManage ? "" : " a que se possa candidatar"} de momento</h2><p>${canManage ? "Crie e publique uma oportunidade para a tornar visível na página pública." : "Quando existirem oportunidades para membros, aparecem aqui."}</p></section>`}
  `);
}
