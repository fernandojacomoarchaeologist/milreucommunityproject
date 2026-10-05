/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Direitos, créditos e reutilização — página pública (Item 2).
 * Conteúdo canónico (decisão humana 2026-10-05). Mantém gates por asset.
 * A atribuição do projecto NÃO transfere direitos de terceiros.
 */
import { portalHeader, footer } from "../components/layout.js";

export function rightsView(lang = "pt-PT") {
  return `${portalHeader(lang, "")}<main id="main" class="rights-page">
    <section class="page-lead">
      <span>Projecto Comunitário de Milreu</span>
      <h1>Direitos, créditos e reutilização</h1>
      <p>Como estão licenciados os conteúdos próprios do projecto e como se preservam os direitos de terceiros.</p>
    </section>

    <section class="content-section" aria-labelledby="dir-original">
      <div class="section-heading"><h2 id="dir-original">Conteúdo original do projecto</h2></div>
      <p>Os conteúdos originais produzidos pelo Projecto Comunitário de Milreu são disponibilizados sob <strong>CC BY 4.0</strong>, quando expressamente indicado.</p>
    </section>

    <section class="content-section" aria-labelledby="dir-terceiros">
      <div class="section-heading"><h2 id="dir-terceiros">Conteúdos de terceiros</h2></div>
      <p>Fotografias, documentos de arquivo, publicações históricas, logótipos e outros materiais de terceiros mantêm as respectivas autorias, créditos, licenças e autorizações. Não são automaticamente abrangidos pela licença CC BY 4.0 do projecto.</p>
    </section>

    <section class="content-section" aria-labelledby="dir-imprensa">
      <div class="section-heading"><h2 id="dir-imprensa">Imprensa e divulgação</h2></div>
      <p>Os materiais identificados como disponíveis para imprensa podem ser utilizados nas condições indicadas para cada activo, preservando obrigatoriamente os créditos ao Projecto Comunitário de Milreu e ao autor/arquivo/fonte quando conhecido.</p>
      <p class="muted"><a href="#/imprensa">Media / Press</a> · <a href="#/identidade">Identidade visual</a></p>
    </section>

    <section class="content-section" aria-labelledby="dir-pedidos">
      <div class="section-heading"><h2 id="dir-pedidos">Pedidos de crédito, correcção ou remoção</h2></div>
      <p>O Projecto acolhe pedidos fundamentados de crédito, correcção ou remoção apresentados por titulares legítimos de direitos ou seus representantes.</p>
      <p class="muted">Os pedidos podem ser dirigidos através dos <a href="#/imprensa">contactos oficiais do projecto</a>.</p>
    </section>
  </main>${footer(lang)}`;
}
