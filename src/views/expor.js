/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { portalHeader, footer } from "../components/layout.js";
import { text } from "../lib/i18n.js";

const esc = value => String(value ?? "").replace(/[&<>"]/g, char => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[char]));

// Formulário "Quero expor": proposta de acolhimento da exposição itinerante.
// Submissão por Edge Function + email (produção); fallback de demonstração local sem envio.
export function exhibitionProposalView(lang = "pt-PT", result = null) {
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
            <label>Nome<input name="name" required maxlength="160" autocomplete="name"></label>
            <label>E-mail<input type="email" name="email" required autocomplete="email"></label>
            <label>Telefone <small>opcional</small><input name="phone" autocomplete="tel"></label>
            <label>Organização ou coletivo <small>opcional</small><input name="organisation" maxlength="180"></label>
          </div>
        </fieldset>

        <fieldset><legend>2. A proposta</legend>
          <div class="form-grid-2">
            <label>Tipo de espaço<select name="spaceType">
              <option value="">Selecione</option>
              <option value="centro-cultural">Espaço cultural</option>
              <option value="escola">Escola</option>
              <option value="biblioteca">Biblioteca</option>
              <option value="associacao">Associação ou coletivo</option>
              <option value="autarquia">Autarquia ou serviço público</option>
              <option value="museu">Museu ou centro interpretativo</option>
              <option value="outro">Outro</option>
            </select></label>
            <label>Nome do espaço ou local<input name="venue" maxlength="180"></label>
            <label>Localidade<input name="locality" maxlength="120"></label>
            <label>Datas ou período pretendido <small>opcional</small><input name="dates" placeholder="Ex.: 2.º trimestre de 2026 ou a combinar"></label>
          </div>
          <label>Descrição da proposta<textarea name="message" rows="7" required placeholder="Descreva o espaço, o público, a motivação e o que gostaria de acolher ou propor."></textarea></label>
          <label>Condições, dimensões ou necessidades <small>opcional</small><textarea name="needs" rows="3" placeholder="Ex.: área disponível, acessibilidade, apoio técnico, transporte."></textarea></label>
        </fieldset>

        <fieldset><legend>3. Consentimento</legend>
          <label class="collab-check"><input type="checkbox" name="privacyAccepted" required>${text(lang,"exporPrivacyLabel")}</label>
          <p class="contribution-consent-note">${text(lang,"exporConsentNote")}</p>
        </fieldset>

        <button class="ml-button ml-button--primary" type="submit">${text(lang,"exporSubmit")}</button>
        <p data-exhibition-proposal-feedback aria-live="polite"></p>
      </form>
      <aside class="contribution-public-aside">
        <article><strong>Entre Ruínas e Memórias</strong><p>Uma exposição comunitária itinerante sobre as relações entre a população e as Ruínas Romanas de Milreu.</p></article>
        <article><strong>Depois do envio</strong><p>A equipa do projecto avalia a viabilidade, datas e condições e responde através do email indicado.</p></article>
      </aside>
    </section>
  </main>${footer(lang)}`;
}
