/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Identidade visual — página pública curada do Design System (não expõe o interno/técnico).
 */
import { portalHeader, footer } from "../components/layout.js";
import { assetUrl } from "../lib/data.js";

const esc = v => String(v ?? "").replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));

function dl(url, label, format) {
  return `<a class="ml-button ml-button--primary" href="${esc(assetUrl(url))}" download data-analytics="logo_download">${esc(label)}${format?` <span aria-hidden="true">· ${esc(format)}</span>`:""}</a>`;
}
function dlPending(label) {
  return `<span class="brand-dl--pending" role="note"><span aria-hidden="true">🔒 </span>${esc(label)} · em preparação</span>`;
}

export function visualIdentityView(brand, lang = "pt-PT") {
  const b = brand || {};
  const logo = b.logo || {};
  const colors = b.colors || [];
  const typo = b.typography || [];
  return `${portalHeader(lang, "")}<main id="main" class="visual-identity">
    <section class="page-lead">
      <span>Projeto Comunitário de Milreu</span>
      <h1>Identidade visual</h1>
      <p>Recursos e regras para utilizar correctamente a identidade do Projecto Comunitário de Milreu.</p>
      <div class="page-lead__actions"><a class="ml-button ml-button--secondary" href="#/imprensa">Media / Press</a></div>
    </section>

    <section class="content-section" aria-labelledby="vi-logo">
      <div class="section-heading"><h2 id="vi-logo">Logótipo</h2></div>
      <div class="brand-logo-show">
        <div class="brand-logo-show__preview"><img src="${esc(assetUrl(logo.png))}" alt="Logótipo do Projecto Comunitário de Milreu" width="220"></div>
        <div class="brand-logo-show__info">
          <p><strong>${esc(logo.name)}</strong></p>
          <p class="muted">Fundos permitidos: ${(logo.backgrounds||[]).map(esc).join(" · ")}.</p>
          <div class="brand-dl-row">
            ${logo.png ? dl(logo.png, "Descarregar logótipo", "PNG") : ""}
            ${logo.svg ? dl(logo.svg, "Descarregar", "SVG") : dlPending("SVG")}
            ${logo.pdf ? dl(logo.pdf, "Descarregar", "PDF") : dlPending("PDF vectorial")}
          </div>
        </div>
      </div>
    </section>

    <section class="content-section content-section--muted" aria-labelledby="vi-regras">
      <div class="section-heading"><h2 id="vi-regras">Regras de uso</h2></div>
      <div class="brand-rules">
        <div><h3>Fazer</h3><ul>${(b.rulesDo||[]).map(r=>`<li>${esc(r)}</li>`).join("")}</ul></div>
        <div><h3>Não fazer</h3><ul class="brand-rules__dont">${(b.rulesDont||[]).map(r=>`<li>${esc(r)}</li>`).join("")}</ul></div>
      </div>
      <p class="muted">Tamanho mínimo: ${esc(b.minSize?.note || "a definir.")}</p>
    </section>

    <section class="content-section" aria-labelledby="vi-cores">
      <div class="section-heading"><h2 id="vi-cores">Cores</h2></div>
      <ul class="color-grid">
        ${colors.map(c=>`<li class="color-swatch"><span class="color-swatch__chip" style="background:${esc(c.hex)}" aria-hidden="true"></span><strong>${esc(c.name)}</strong><span class="color-swatch__val">HEX ${esc(c.hex)}</span><span class="color-swatch__val">RGB ${esc(c.rgb)}</span></li>`).join("")}
      </ul>
      <p class="muted">${esc(b.cmyk?.note || "CMYK em validação.")}</p>
    </section>

    <section class="content-section content-section--muted" aria-labelledby="vi-tipo">
      <div class="section-heading"><h2 id="vi-tipo">Tipografia</h2></div>
      <ul class="type-list">
        ${typo.map(t=>`<li><strong>${esc(t.family)}</strong><span>${esc(t.role)}</span><small>${esc(t.weights||"")}</small></li>`).join("")}
      </ul>
      <p class="muted">${esc(b.typographyNote || "Ficheiros de fonte não são disponibilizados para download.")}</p>
    </section>

    <section class="content-section" aria-labelledby="vi-ex">
      <div class="section-heading"><h2 id="vi-ex">Exemplos</h2></div>
      <div class="logo-examples">
        <figure class="logo-example logo-example--ok"><div class="logo-example__box" style="background:#FFFCF7"><img src="${esc(assetUrl(logo.png))}" alt="Aplicação correcta em fundo claro" width="120"></div><figcaption><span aria-hidden="true">✔ </span>Fundo claro, proporção e respiro respeitados.</figcaption></figure>
        <figure class="logo-example logo-example--bad"><div class="logo-example__box logo-example__box--stretch" style="background:#5E7267"><img src="${esc(assetUrl(logo.png))}" alt="Aplicação incorrecta: distorção e fundo inadequado" width="170" height="90"></div><figcaption><span aria-hidden="true">✘ </span>Não distorcer nem usar sobre fundos inadequados.</figcaption></figure>
      </div>
    </section>

    <section class="content-section content-section--muted" aria-labelledby="vi-dl">
      <div class="section-heading"><h2 id="vi-dl">Downloads</h2></div>
      <div class="brand-dl-row">${logo.png ? dl(logo.png, "Logótipo (PNG)", "") : ""}<a class="ml-button ml-button--secondary" href="#/imprensa">Media / Press</a></div>
    </section>
  </main>${footer(lang)}`;
}
