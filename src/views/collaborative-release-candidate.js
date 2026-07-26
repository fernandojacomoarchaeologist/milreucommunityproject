/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { collaborativeShell, statusPill } from "../components/collaborative-layout.js";
import { hasPermission } from "../collab/permissions.js";

const esc=value=>String(value??"").replace(/[&<>\"]/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[char]));
const heading=(eyebrow,title,description)=>`<header class="collab-page-heading"><span>${esc(eyebrow)}</span><h1>${esc(title)}</h1><p>${esc(description)}</p></header>`;
const gateList=(items,status)=>`<div class="rc-gate-list">${(items||[]).map(item=>`<article><div><strong>${esc(item.code)}</strong><p>${esc(item.reason)}</p></div>${statusPill(status)}</article>`).join("")}</div>`;

function stateCard(title,state,description){
  const status=state?.approved?"ready":"blocked";
  return `<article class="rc-state-card rc-state-card--${status}"><div><span>${esc(title)}</span>${statusPill(status)}</div><strong>${state?.approved?"Aprovada":"Bloqueada"}</strong><p>${esc(description)}</p>${state?.blockers?.length?`<small>${state.blockers.length} gate(s) aberto(s)</small>`:""}</article>`;
}

export function collaborativeReleaseCandidateView(context){
  if(!hasPermission(context,"homologation.view"))return collaborativeShell(context,"",heading("Acesso condicionado","Release candidate","O seu perfil não possui permissão para consultar este estado."));
  const model=context.releaseCandidateModel||{};
  const readiness=context.releaseCandidateReadiness||{};
  const technical=readiness.technicalCandidate||{status:"not-evaluated",approved:false,checks:[],blockers:[]};
  const counts=model.scenarioCounts||{};
  return collaborativeShell(context,"/area-colaborativa/gestao/homologacao",`
    ${heading("Pacote 08J",`Release candidate técnica ${esc(model.candidate||"RC1")}`,"Fecho funcional, acessibilidade, testes E2E e gates de release representados sem inferência.")}
    <section class="rc-notice" role="status"><strong>Separação obrigatória</strong><p>Um resultado técnico local verde não homologa staging e não aprova produção.</p></section>
    <section class="rc-state-grid" aria-label="Camadas da release">
      ${stateCard("Release candidate técnica",technical,"Código, contratos, testes, build e E2E local.")}
      ${stateCard("Homologação de staging",readiness.stagingHomologation,"Supabase, OAuth, RLS, storage, migrations, Edge Functions e perfis reais.")}
      ${stateCard("Aprovação de produção",readiness.productionApproval,"Gates remotos, editoriais, direitos, acessibilidade humana, backup e restauração.")}
    </section>
    <section class="rc-section"><h2>Checks técnicos</h2><div class="rc-check-grid">${(technical.checks||[]).map(item=>`<article><span aria-hidden="true">${item.passed?"✓":"×"}</span><div><strong>${esc(item.code)}</strong><p>${esc(item.detail)}</p></div>${statusPill(item.passed?"passed":"failed")}</article>`).join("")||`<p class="collab-empty-line">Execute <code>npm run rc:evaluate</code> para gerar a evidência técnica.</p>`}</div></section>
    <section class="rc-section"><h2>Matriz de qualidade</h2><dl class="rc-metrics"><div><dt>Módulos preservados</dt><dd>22</dd></div><div><dt>Permissões preservadas</dt><dd>117</dd></div><div><dt>Cenários totais</dt><dd>${esc(counts.total||0)}</dd></div><div><dt>Automáticos</dt><dd>${esc(counts.automated||0)}</dd></div><div><dt>Humanos</dt><dd>${esc(counts.human||0)}</dd></div><div><dt>Externos</dt><dd>${esc(counts.external||0)}</dd></div></dl></section>
    <section class="rc-section"><h2>Gates externos</h2><p>Dependem de credenciais, infraestrutura ou evidência que não pertence ao ZIP.</p>${gateList(model.externalGates,"blocked")}</section>
    <section class="rc-section"><h2>Gates humanos</h2><p>Não podem ser aprovados por automação ou por inferência.</p>${gateList(model.humanGates,"pending")}</section>
    <section class="rc-section rc-command"><h2>Comandos reproduzíveis</h2><pre><code>npm run validate:08j
npm test
npm run e2e:08j
npm run build
npm run smoke
npm run rc:evaluate</code></pre></section>
  `);
}
