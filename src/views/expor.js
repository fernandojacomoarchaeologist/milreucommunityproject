/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { portalHeader, footer } from "../components/layout.js";
import { text } from "../lib/i18n.js";
import { todayLisbon } from "../lib/exhibition-proposal.js";

const esc = value => String(value ?? "").replace(/[&<>"]/g, char => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[char]));

// Formulário "Quero expor": proposta de acolhimento da exposição itinerante.
// Submissão por Edge Function + email (produção); fallback de demonstração local sem envio.
// draft: valores já escritos (mantidos em memória entre re-renders, p. ex. ao mudar o tema; nunca guardados).
// contactEmail: contacto institucional já publicado (media-assets.json → contacts.email1), usado só como alternativa.
export function exhibitionProposalView(lang = "pt-PT", result = null, { draft = {}, contactEmail = "" } = {}) {
  const v = name => esc(draft[name] || "");
  const req = `<small class="field-required">obrigatório</small>`;
  const today = todayLisbon();
  if (result) {
    const demo = result.mode === "demo";
    return `${portalHeader(lang,"/participar")}<main id="main">
      <section class="page-lead page-lead--contributions"><span>Participação comunitária</span><h1>${text(lang,"exporSuccessTitle")}</h1><p>${text(lang,"exporSuccessText")}</p></section>
      <section class="content-section"><div class="contribution-success">
        ${result.reference ? `<span>Referência</span><strong>${esc(result.reference)}</strong>` : ""}
        ${demo ? `<p class="contribution-consent-note">${text(lang,"exporDemoNote")}</p>` : ""}
        <div><a class="ml-button ml-button--primary" href="#/exposicoes">${text(lang,"exhibitionCardCta")}</a><a class="ml-button ml-button--secondary" href="#/">${text(lang,"backProject")}</a></div>
      </div></section>
    </main>${footer(lang)}`;
  }

  return `${portalHeader(lang,"/participar")}<main id="main">
    <section class="page-lead page-lead--contributions"><span>Participação comunitária</span><h1>${text(lang,"exporTitle")}</h1><p>${text(lang,"exporLead")}</p></section>
    <section class="content-section contribution-public-layout">
      <form class="public-contribution-form" data-exhibition-proposal-form novalidate>
        <input class="contribution-honeypot" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
        <fieldset><legend>1. Quem propõe</legend>
          <div class="form-grid-2">
            <label>Nome ${req}<input name="name" required maxlength="160" autocomplete="name" value="${v("name")}"></label>
            <label>E-mail ${req}<input type="email" name="email" required maxlength="254" autocomplete="email" value="${v("email")}"></label>
            <label>Telefone <small>opcional</small><input name="phone" maxlength="60" autocomplete="tel" value="${v("phone")}"></label>
            <label>Organização ou coletivo <small>opcional</small><input name="organisation" maxlength="180" value="${v("organisation")}"></label>
          </div>
        </fieldset>

        <fieldset><legend>2. A proposta</legend>
          <div class="form-grid-2">
            <label>Tipo de espaço<select name="spaceType">
              <option value="">Selecione</option>
              <option value="centro-cultural"${draft.spaceType==="centro-cultural"?" selected":""}>Espaço cultural</option>
              <option value="escola"${draft.spaceType==="escola"?" selected":""}>Escola</option>
              <option value="biblioteca"${draft.spaceType==="biblioteca"?" selected":""}>Biblioteca</option>
              <option value="associacao"${draft.spaceType==="associacao"?" selected":""}>Associação ou coletivo</option>
              <option value="autarquia"${draft.spaceType==="autarquia"?" selected":""}>Autarquia ou serviço público</option>
              <option value="museu"${draft.spaceType==="museu"?" selected":""}>Museu ou centro interpretativo</option>
              <option value="outro"${draft.spaceType==="outro"?" selected":""}>Outro</option>
            </select></label>
            <label>Nome do espaço ou local<input name="venue" maxlength="180" value="${v("venue")}"></label>
            <label>Localidade<input name="locality" maxlength="120" value="${v("locality")}"></label>
            <fieldset class="proposal-dates"><legend>Datas pretendidas <small>opcional</small></legend>
              <label>Início<input type="date" name="dateFrom" min="${today}" value="${v("dateFrom")}" data-proposal-date-from></label>
              <label>Fim <small>opcional</small><input type="date" name="dateTo" min="${esc(draft.dateFrom || today)}" value="${v("dateTo")}" data-proposal-date-to></label>
              <p class="contribution-consent-note">Escolha no calendário; não são aceites datas anteriores a hoje. Se as datas estiverem em aberto, deixe em branco e indique-o na descrição.</p>
            </fieldset>
          </div>
          <label>Descrição da proposta ${req}<textarea name="message" rows="7" required minlength="10" maxlength="5000" placeholder="Descreva o espaço, o público, a motivação e o que gostaria de acolher ou propor.">${v("message")}</textarea></label>
          <label>Condições, dimensões ou necessidades <small>opcional</small><textarea name="needs" rows="3" maxlength="2000" placeholder="Ex.: área disponível, acessibilidade, apoio técnico, transporte.">${v("needs")}</textarea></label>
        </fieldset>

        <fieldset><legend>3. Consentimento</legend>
          <label class="collab-check"><input type="checkbox" name="privacyAccepted" required${draft.privacyAccepted ? " checked" : ""}>${text(lang,"exporPrivacyLabel")} ${req}</label>
          <p class="contribution-consent-note">${text(lang,"exporConsentNote")}</p>
        </fieldset>

        <button class="ml-button ml-button--primary" type="submit">${text(lang,"exporSubmit")}</button>
        <p data-exhibition-proposal-feedback aria-live="polite"></p>
        <div class="proposal-fallback" data-exhibition-proposal-fallback hidden>
          <strong>A proposta não foi enviada.</strong>
          <p>O texto que escreveu continua neste formulário. Pode tentar de novo mais tarde${contactEmail ? ` ou enviá-lo por e-mail para <a href="mailto:${esc(contactEmail)}">${esc(contactEmail)}</a>` : ""}.</p>
          <div>
            ${contactEmail ? `<a class="ml-button ml-button--primary" data-exhibition-proposal-mailto href="mailto:${esc(contactEmail)}" data-contact="${esc(contactEmail)}">Enviar por e-mail</a>` : ""}
            <button class="ml-button ml-button--secondary" type="button" data-exhibition-proposal-copy>Copiar texto da proposta</button>
          </div>
        </div>
      </form>
      <aside class="contribution-public-aside">
        <article><strong>Entre Ruínas e Memórias</strong><p>Uma exposição comunitária itinerante sobre as relações entre a população e as Ruínas Romanas de Milreu.</p></article>
        <article><strong>Depois do envio</strong><p>A equipa do projecto avalia a viabilidade, datas e condições e responde através do email indicado.</p></article>
      </aside>
    </section>
  </main>${footer(lang)}`;
}
