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

export function rightsView(lang = "pt-PT", { analytics = false } = {}) {
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
    ${analytics ? `<section class="content-section" aria-labelledby="dir-estatistica">
      <div class="section-heading"><h2 id="dir-estatistica">Estatísticas de visita</h2></div>
      <p>Para saber quantas pessoas visitam o site e que páginas lhes são úteis, o projecto usa o Umami, um serviço de estatística que não usa cookies nem cria perfis de visitantes. Os dados são tratados de forma agregada: páginas vistas, site de origem da visita, país ou região aproximada, tipo de dispositivo e navegador, e hora da visita.</p>
      <p>Se o seu navegador pedir para não ser seguido («Do Not Track»), a visita não é contada. A Área Colaborativa não é medida.</p>
    </section>` : ""}
  </main>${footer(lang)}`;
}
