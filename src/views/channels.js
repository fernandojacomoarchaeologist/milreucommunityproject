/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { portalHeader, footer } from "../components/layout.js";
import { assetUrl } from "../lib/data.js";
import { localised } from "../lib/i18n.js";

const escape = value => String(value ?? "").replace(/[&<>"]/g,char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[char]));

function qrPlaceholder(record) {
  return `<div class="qr-pending" role="img" aria-label="Código QR pendente de domínio público">
    <div class="qr-pending__pattern" aria-hidden="true"></div>
    <strong>QR pendente</strong>
    <span>${escape(record.totem.qrTargetPath)}</span>
  </div>`;
}

export function channelLabView(records,config,lang) {
  const eligible = records.filter(record => record.publication.siteVisible);
  return `${portalHeader(lang)}
  <main id="main" class="channel-lab">
    <header class="channel-lab__header">
      <span class="eyebrow">Laboratório editorial · não é arte final</span>
      <h1>Portal, Museu, totem e painel a partir da mesma entidade</h1>
      <p>Os canais reutilizam título, data, fotografia, crédito, direitos, fontes e identificador. A composição e a extensão do texto mudam conforme o contexto.</p>
    </header>
    <section class="channel-status-grid">
      ${Object.entries(config.channels).map(([id,channel]) => `<article><span>${escape(id)}</span><h2>${escape(channel.purpose)}</h2><p>Estado: ${escape(channel.status)}</p></article>`).join("")}
    </section>
    <section class="channel-record-list">
      <h2>Pré-visualizar um registo</h2>
      <div class="channel-record-grid">
        ${eligible.map(record => `<article>
          <img src="${assetUrl(record.media.webPreview)}" alt="">
          <div><small>${record.id}</small><h3>${escape(localised(record.canonicalData.title,lang).value)}</h3>
          <p><a href="#/laboratorio/totem/${record.id}">Totem</a> · <a href="#/laboratorio/painel/${record.id}">Painel</a> · <a href="#/museu/memorias/${record.id}">Museu</a></p></div>
        </article>`).join("")}
      </div>
    </section>
    <section class="channel-blockers">
      <h2>Bloqueios antes da produção física</h2>
      <ul>
        <li>dimensões e suporte físico;</li>
        <li>seleção curatorial;</li>
        <li>texto editorial final;</li>
        <li>domínio público e geração dos QR;</li>
        <li>perfil de cor, resolução, sangria e prova de impressão;</li>
        <li>revisão final de créditos e direitos.</li>
      </ul>
    </section>
  </main>${footer(lang)}`;
}

export function totemPreviewView(record,config,lang) {
  if (!record?.publication.siteVisible) return unavailableChannel();
  const title = localised(record.canonicalData.title,lang);
  const short = localised(record.totem.shortText,lang);
  const date = localised(record.canonicalData.dateDisplay,lang);
  const credit = localised(record.canonicalData.credit,lang);
  return `<main id="main" class="physical-preview-page">
    <div class="physical-preview-toolbar">
      <a href="#/laboratorio/canais">← Laboratório</a>
      <span>Totem técnico · proporção provisória ${escape(config.channels.totem.previewAspectRatio)}</span>
      <button type="button" onclick="window.print()">Imprimir pré-visualização</button>
    </div>
    <article class="totem-preview">
      <header><img src="${assetUrl("public/brand/symbol.webp")}" alt=""><span>Entre Ruínas e Memórias</span></header>
      <figure><img src="${assetUrl(record.media.webPreview)}" alt="${escape(title.value)}"></figure>
      <section>
        <p class="totem-id">${record.id} · ${escape(date.value)}</p>
        <h1>${escape(title.value)}</h1>
        <p>${escape(short.value)}</p>
        <p class="totem-credit">${escape(credit.value)}</p>
      </section>
      <footer>
        ${qrPlaceholder(record)}
        <div><strong>Continue no Museu digital</strong><p>${escape(record.totem.qrTargetPath)}</p></div>
      </footer>
      <div class="preview-watermark">PRÉ-VISUALIZAÇÃO · NÃO PRODUZIR</div>
    </article>
  </main>`;
}

export function panelPreviewView(record,config,lang) {
  if (!record?.publication.siteVisible) return unavailableChannel();
  const title = localised(record.canonicalData.title,lang);
  const body = localised(record.panel.technicalPreviewText,lang);
  const date = localised(record.canonicalData.dateDisplay,lang);
  const credit = localised(record.canonicalData.credit,lang);
  return `<main id="main" class="physical-preview-page">
    <div class="physical-preview-toolbar">
      <a href="#/laboratorio/canais">← Laboratório</a>
      <span>Painel técnico · proporção provisória ${escape(config.channels.panel.previewAspectRatio)}</span>
      <button type="button" onclick="window.print()">Imprimir pré-visualização</button>
    </div>
    <article class="panel-preview">
      <div class="panel-preview__image"><img src="${assetUrl(record.media.webPreview)}" alt="${escape(title.value)}"></div>
      <div class="panel-preview__copy">
        <span class="eyebrow">${record.id} · ${escape(date.value)}</span>
        <h1>${escape(title.value)}</h1>
        <p>${escape(body.value)}</p>
        ${record.panel.technicalPreviewTextDerived ? `<div class="panel-derived-warning">Texto técnico derivado da descrição curta. Ainda não é texto editorial de painel.</div>` : ""}
        <p class="panel-credit">${escape(credit.value)}</p>
        <div class="panel-preview__footer">
          ${qrPlaceholder(record)}
          <div><img src="${assetUrl("public/brand/logo-light.webp")}" alt="Projeto Comunitário de Milreu"><p>Conheça o registo completo no Museu digital.</p></div>
        </div>
      </div>
      <div class="preview-watermark">PRÉ-VISUALIZAÇÃO · NÃO PRODUZIR</div>
    </article>
  </main>`;
}

function unavailableChannel() {
  return `<main id="main" class="physical-preview-page"><div class="channel-blockers"><h1>Registo indisponível neste canal</h1><a href="#/laboratorio/canais">Regressar</a></div></main>`;
}
