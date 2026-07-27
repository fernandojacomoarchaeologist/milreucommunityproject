/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { portalHeader,footer } from "../components/layout.js";

const esc=value=>String(value??"").replace(/[&<>"]/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[char]));

function options(items,selected="",empty="Selecione"){
  return `<option value="">${esc(empty)}</option>${(items||[]).map(item=>`<option value="${esc(item.code)}" ${item.code===selected?"selected":""}>${esc(item.name)}</option>`).join("")}`;
}

function contributionLead(title,description){
  return `<section class="page-lead page-lead--contributions"><span>Participação comunitária</span><h1>${esc(title)}</h1><p>${esc(description)}</p></section>`;
}

export function publicContributionFormView(model,lang="pt-PT",result=null){
  if(result){
    return `${portalHeader(lang,"/participar")}<main id="main">
      ${contributionLead("Contributo recebido","Guarde o código de acompanhamento. Ele não poderá ser recuperado automaticamente.")}
      <section class="content-section"><div class="contribution-success">
        <span>Referência</span><strong>${esc(result.publicReference)}</strong>
        <span>Código de acompanhamento</span><code>${esc(result.trackingCode)}</code>
        <p>Use este código juntamente com o mesmo e-mail para acompanhar o estado ou solicitar retirada.</p>
        <div><a class="ml-button ml-button--primary" href="#/participar/contribuir/acompanhar">Acompanhar contributo</a><a class="ml-button ml-button--secondary" href="#/participar">Voltar a Participar</a></div>
      </div></section>
    </main>${footer(lang)}`;
  }

  return `${portalHeader(lang,"/participar")}<main id="main">
    ${contributionLead("Partilhe uma memória, fotografia ou correção","O contributo será analisado antes de qualquer utilização. Submeter não significa publicar.")}
    <section class="content-section contribution-public-layout">
      <form class="public-contribution-form" data-public-contribution-form>
        <input class="contribution-honeypot" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
        <fieldset><legend>1. O contributo</legend>
          <div class="form-grid-2">
            <label>Tipo<select name="contributionType" required>${options(model?.contributionTypes)}</select></label>
            <label>Título<input name="title" required maxlength="180"></label>
          </div>
          <label>Descrição ou relato<textarea name="content" rows="8" required placeholder="Conte o que sabe, recorda ou deseja corrigir."></textarea></label>
          <label>Resumo breve <small>opcional</small><textarea name="summary" rows="3"></textarea></label>
          <div class="form-grid-2">
            <label>Local relacionado<input name="placeText"></label>
            <label>Data ou período<input name="dateText" placeholder="Ex.: década de 1960 ou data incerta"></label>
          </div>
          <label>Contexto histórico ou familiar<textarea name="historicalContext" rows="4"></textarea></label>
          <label>Como obteve esta informação?<textarea name="sourceContext" rows="3" placeholder="Memória pessoal, arquivo familiar, publicação, testemunho de outra pessoa…"></textarea></label>
        </fieldset>

        <fieldset><legend>2. Relação com o projeto</legend>
          <div class="form-grid-2">
            <label>Área relacionada<select name="targetType">${options(model?.targetTypes,"","Projeto em geral")}</select></label>
            <label>Identificador <small>quando existir</small><input name="targetIdentifier" placeholder="Ex.: MM202603"></label>
            <label>Tipo de relação<select name="relationType">${options(model?.targetRelations,"supports","Selecione")}</select></label>
          </div>
          <label>Nota sobre a relação<textarea name="targetNote" rows="3"></textarea></label>
        </fieldset>

        <fieldset><legend>3. Ficheiros</legend>
          <label>Fotografias ou documentos
            <input type="file" name="files" multiple accept=".jpg,.jpeg,.png,.webp,.tif,.tiff,.pdf,.txt,.docx">
            <small>Até ${esc(model?.limits?.maxFiles||5)} ficheiros, com máximo de 10 MB cada. Os ficheiros permanecem privados durante a análise.</small>
          </label>
          <label>Direitos dos ficheiros<textarea name="fileRightsNote" rows="3" placeholder="Indique autoria, origem, proprietário ou autorização conhecida."></textarea></label>
        </fieldset>

        <fieldset><legend>4. Identificação e contacto</legend>
          <div class="form-grid-2">
            <label>Nome<input name="displayName" required autocomplete="name"></label>
            <label>E-mail<input type="email" name="email" required autocomplete="email"></label>
            <label>Telefone <small>opcional</small><input name="phone" autocomplete="tel"></label>
            <label>Localidade <small>opcional</small><input name="locality"></label>
            <label>Forma preferida de contacto<select name="preferredContact"><option value="email">E-mail</option><option value="phone">Telefone</option><option value="none">Não contactar, salvo questões essenciais</option></select></label>
            <label>Crédito pretendido<select name="attributionPreference" required>${options(model?.attributionPreferences,"discuss","Selecione")}</select></label>
            <label>Âmbito inicialmente autorizado<select name="requestedUsageScope" required>${options(model?.usageScopes,"review-only","Selecione")}</select></label>
          </div>
        </fieldset>

        <fieldset><legend>5. Direitos e consentimento</legend>
          <label>Declaração de direitos<textarea name="rightsDeclaration" rows="4" required placeholder="Explique por que possui legitimidade para partilhar o material ou a informação."></textarea></label>
          <label class="collab-check"><input type="checkbox" name="privacyAccepted" required>Li a informação de privacidade e aceito o tratamento destes dados para análise do contributo.</label>
          <label class="collab-check"><input type="checkbox" name="rightsConfirmed" required>Confirmo, tanto quanto sei, que tenho legitimidade para partilhar este conteúdo e que informei a sua origem.</label>
          <label class="collab-check"><input type="checkbox" name="projectUseAuthorised" required>Autorizo a equipa do projeto a analisar e conservar o contributo no âmbito indicado.</label>
          <label class="collab-check"><input type="checkbox" name="contactAllowed" checked>Autorizo contacto para esclarecimentos.</label>
          <label class="collab-check"><input type="checkbox" name="publicAttributionAuthorised">Autorizo a forma de crédito indicada caso o contributo venha a ser utilizado publicamente.</label>
          <p class="contribution-consent-note">A submissão não transfere automaticamente direitos de autor, não garante publicação e pode ser objeto de correção ou retirada.</p>
        </fieldset>

        <button class="ml-button ml-button--primary" type="submit">Submeter contributo</button>
        <p data-public-contribution-feedback aria-live="polite"></p>
      </form>
      <aside class="contribution-public-aside">
        <article><strong>Antes de enviar</strong><p>Descreva a origem, identifique dúvidas e não apresente reconstruções como factos.</p></article>
        <article><strong>Depois da submissão</strong><p>Receberá uma referência e um código. A equipa poderá solicitar informação adicional.</p></article>
        <article><strong>Publicação</strong><p>Nenhum contributo entra automaticamente no Museu, no Portal, na Experiência Proteus ou numa exposição.</p></article>
        <nav><a href="#/participar/contribuir/acompanhar">Acompanhar contributo</a><a href="#/participar/retirada">Pedir correção ou retirada</a></nav>
      </aside>
    </section>
  </main>${footer(lang)}`;
}

export function publicContributionTrackingView(model,lang="pt-PT",result=null){
  return `${portalHeader(lang,"/participar")}<main id="main">
    ${contributionLead("Acompanhe o seu contributo","Utilize o código recebido e o mesmo e-mail indicado na submissão.")}
    <section class="content-section contribution-tracking-layout">
      <form class="public-tracking-form" data-public-contribution-track-form>
        <label>Código de acompanhamento<input name="trackingCode" required autocomplete="off"></label>
        <label>E-mail<input type="email" name="email" required autocomplete="email"></label>
        <button class="ml-button ml-button--primary" type="submit">Consultar estado</button>
        <p data-public-contribution-feedback aria-live="polite"></p>
      </form>
      ${result?`<article class="contribution-tracking-result">
        <span>${esc(result.publicReference)}</span>
        <h2>${esc(result.title)}</h2>
        <strong>${esc(model?.statuses?.find(item=>item.code===result.status)?.name||result.status)}</strong>
        <p>${esc(result.publicMessage||"Sem mensagem adicional.")}</p>
        <dl><div><dt>Submetido</dt><dd>${esc(result.submittedAt?new Intl.DateTimeFormat("pt-PT",{dateStyle:"medium"}).format(new Date(result.submittedAt)):"—")}</dd></div>${result.withdrawalStatus?`<div><dt>Retirada</dt><dd>${esc(result.withdrawalStatus)}</dd></div>`:""}</dl>
      </article>`:`<div class="public-tracking-empty"><h2>Estado privado</h2><p>A consulta não apresenta ficheiros, notas internas, responsáveis ou decisões ainda não comunicadas.</p></div>`}
    </section>
  </main>${footer(lang)}`;
}

export function publicWithdrawalView(model,lang="pt-PT",result=null){
  return `${portalHeader(lang,"/participar")}<main id="main">
    ${contributionLead("Pedir correção ou retirada","O pedido será analisado e ficará associado ao contributo original.")}
    <section class="content-section">
      ${result?`<div class="contribution-success"><span>Pedido</span><strong>${esc(result.publicReference)}</strong><p>Pedido recebido com estado ${esc(result.status)}.</p><a class="ml-button ml-button--secondary" href="#/participar/contribuir/acompanhar">Acompanhar contributo</a></div>`:
      `<form class="public-withdrawal-form" data-public-withdrawal-form>
        <div class="form-grid-2"><label>Código de acompanhamento<input name="trackingCode" required></label><label>E-mail<input type="email" name="email" required></label><label>Nome<input name="name" required></label></div>
        <label>Motivo e ação pretendida<textarea name="reason" rows="7" required placeholder="Explique o que deve ser corrigido, restringido ou retirado."></textarea></label>
        <p>Pedidos de retirada não eliminam imediatamente o histórico interno necessário para auditoria, direitos e cumprimento das obrigações do projeto.</p>
        <button class="ml-button ml-button--primary" type="submit">Enviar pedido</button><p data-public-contribution-feedback aria-live="polite"></p>
      </form>`}
    </section>
  </main>${footer(lang)}`;
}
