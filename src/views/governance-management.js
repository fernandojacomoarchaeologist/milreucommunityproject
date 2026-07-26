/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { collaborativeShell, statusPill } from "../components/collaborative-layout.js";
import { hasPermission } from "../collab/permissions.js";

const esc=(v)=>String(v??"").replace(/[&<>"]/g,(c)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const workspace=(context)=>context.operationsGovernanceWorkspace||{governanceDecisions:[]};

function heading(title,description,actions=""){return `<header class="collab-page-heading collab-page-heading--actions"><div><span>08M · Governação e transparência</span><h1>${esc(title)}</h1><p>${esc(description)}</p></div>${actions?`<div class="collab-heading-actions">${actions}</div>`:""}</header>`;}
function empty(m){return `<div class="opgov-empty" role="status">${esc(m)}</div>`;}

export function governanceManagementView(context){
  if(!hasPermission(context,"governance.view")){
    return collaborativeShell(context,"/area-colaborativa/gestao/governanca",heading("Governação","Sem permissão para aceder à governação."));
  }
  const ws=workspace(context);
  const decisions=ws.governanceDecisions||[];
  const canDecide=hasPermission(context,"governance.decide");
  const canManage=hasPermission(context,"governance.manage");

  const decisionForm=canManage?`
    <form class="opgov-form" data-governance-form>
      <h3>Preparar decisão de governação</h3>
      <label>Tipo <input type="text" name="decisionType" required aria-label="Tipo"></label>
      <label>Título <input type="text" name="title" required aria-label="Título"></label>
      <label>Contexto <input type="text" name="context" required aria-label="Contexto"></label>
      <label>Autoridade <input type="text" name="authority" required aria-label="Autoridade"></label>
      <button type="submit">Registar</button>
    </form>`:"";

  const decideForm=canDecide?`
    <form class="opgov-form opgov-form--approve" data-governance-decide-form>
      <h3>Decisão final</h3>
      <label>Decisão <input type="text" name="decisionId" required aria-label="Identificador da decisão"></label>
      <label>Resultado <input type="text" name="decision" required aria-label="Resultado"></label>
      <label>Fundamento <textarea name="rationale" required aria-label="Fundamento"></textarea></label>
      <button type="submit" class="ml-button">Registar decisão</button>
    </form>`:`<div class="opgov-note">A decisão final de governação exige a função <code>governance.decide</code> (master).</div>`;

  const transparencyForm=hasPermission(context,"impact.manage")?`
    <form class="opgov-form opgov-form--approve" data-transparency-publish-form>
      <h3>Publicar indicador na transparência pública</h3>
      <p>Exige privacidade e qualidade aprovadas e a confirmação literal.</p>
      <label>Snapshot <input type="text" name="snapshotId" required aria-label="Snapshot"></label>
      <label>Confirmação literal <input type="text" name="confirmation" placeholder="APPROVE_MILREU_PUBLIC_TRANSPARENCY" required aria-label="Confirmação literal"></label>
      <button type="submit" class="ml-button">Publicar</button>
    </form>`:"";

  return collaborativeShell(context,"/area-colaborativa/gestao/governanca",`
    ${heading("Governação e transparência","Decisões, autoridade, indicadores e transparência pública.",`<a class="ml-button ml-button--secondary" href="#/area-colaborativa/gestao/operacao">Operação</a>`)}
    <div class="opgov-banner" role="status" aria-live="polite"><strong>Transparência pública desativada.</strong> Só snapshots com privacidade e qualidade aprovadas, e a confirmação literal <code>APPROVE_MILREU_PUBLIC_TRANSPARENCY</code>, são publicados. Sem dados individuais. Produção bloqueada.</div>
    <section class="opgov-section" aria-label="Decisões de governação">
      <h2>Decisões</h2>
      ${decisions.length?`<ul class="opgov-list">${decisions.map((d)=>`<li><strong>${esc(d.title||d.decision_type)}</strong> ${statusPill(d.status||"draft")}</li>`).join("")}</ul>`:empty("Nenhuma decisão registada.")}
    </section>
    <section class="opgov-section opgov-grid" aria-label="Ações de governação">
      ${decisionForm}
      ${decideForm}
      ${transparencyForm}
    </section>`);
}
