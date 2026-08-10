/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 10D — página humana de documentação da API pública Proteus v1 (somente leitura).
 * Consome o index.json público. Distingue três estados: carregamento (índice ainda undefined),
 * erro (índice null, ex.: falha de rede) e disponível (índice carregado, mesmo com coleções
 * vazias). Não inventa contagens nem apresenta itens filtrados por direitos.
 */
import { portalHeader, footer } from "../components/layout.js";

const esc = (v) => String(v ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const RESOURCE_LABELS = { works: "Obras", authors: "Autores", assertions: "Afirmações", entities: "Entidades", relations: "Relações" };

function shell(lang, inner) {
  return `${portalHeader(lang, "/conhecimento")}<main id="main" class="portal-main proteus-api">
    <nav class="collab-back-link"><a href="#/conhecimento/biblioteca">← Biblioteca</a></nav>
    ${inner}
  </main>${footer(lang)}`;
}

function heading(sub) {
  return `<header class="page-heading"><span class="eyebrow">Experiência Proteus</span>
    <h1 class="page-title">API pública</h1><p>${sub}</p></header>`;
}

export function proteusApiView(apiIndex, lang) {
  // Estado de carregamento: dados ainda não chegaram.
  if (apiIndex === undefined) {
    return shell(lang, `${heading("A carregar a documentação da API…")}
      <section class="portal-section"><p class="proteus-api-loading" role="status" aria-live="polite">A carregar…</p></section>`);
  }
  // Estado de erro: índice indisponível.
  if (apiIndex === null || typeof apiIndex !== "object" || !Array.isArray(apiIndex.resources)) {
    return shell(lang, `${heading("Documentação da API")}
      <section class="portal-section"><div class="collab-empty-state proteus-api-error" role="alert">
        <span>API pública</span><h2>Documentação indisponível de momento</h2>
        <p>Não foi possível carregar o índice da API. Tente novamente mais tarde.</p></div></section>`);
  }

  const resources = apiIndex.resources || [];
  const rightsNote = apiIndex.rights?.note || "Exposição por API exige decisão explícita, além de estado publicado.";
  const rows = resources.map((r) => `<tr>
    <th scope="row">${esc(RESOURCE_LABELS[r.resource] || r.resource)}</th>
    <td><code>${esc(r.path)}</code></td>
    <td class="proteus-api-count">${esc(r.count)}</td></tr>`).join("");
  const allEmpty = resources.every((r) => Number(r.count) === 0);

  return shell(lang, `${heading("Contrato público v1, uniforme, versionado e somente de leitura, para pessoas, motores de pesquisa e agentes.")}
    <section class="portal-section proteus-api-overview">
      <dl class="opportunity-detail__facts">
        <div><dt>Versão do contrato</dt><dd>${esc(apiIndex.contractVersion)}</dd></div>
        <div><dt>Versão da API</dt><dd>${esc(apiIndex.apiVersion)}</dd></div>
        <div><dt>Versão do repositório</dt><dd>${esc(apiIndex.repositoryVersion ?? "—")}</dd></div>
        <div><dt>Raiz</dt><dd><code>${esc(apiIndex.root)}</code></dd></div>
        <div><dt>Transporte</dt><dd>${esc(apiIndex.transport)} (somente leitura)</dd></div>
      </dl>
      <p class="fallback-note">Sem servidor, base de dados, autenticação, escrita ou execução. Os exports são gerados a partir de snapshots públicos e nunca editados à mão.</p>
    </section>
    <section class="portal-section">
      <h2>Recursos</h2>
      <div class="proteus-api-table-wrap" style="overflow-x:auto;max-width:100%">
        <table class="proteus-api-table">
          <thead><tr><th scope="col">Recurso</th><th scope="col">Caminho</th><th scope="col">Itens</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      ${allEmpty ? `<p class="collab-empty-inline proteus-api-empty">As coleções estão vazias nesta fase: a exposição por API é uma dimensão de direitos independente da publicação e exige autorização explícita, ainda não comprovada. Uma coleção vazia é um resultado honesto, não um erro. Itens filtrados por direitos ou estado editorial não são identificados nem contabilizados.</p>` : ""}
    </section>
    <section class="portal-section proteus-api-rights">
      <h2>Política de direitos</h2>
      <p>Por omissão, a API <strong>nega</strong>. ${esc(rightsNote)}</p>
      <p class="fallback-note">Um registo só entra quando está publicado, tem fonte pública e data de revisão, e possui permissão explícita de exposição por API. Ausência, «unknown» ou «deny» excluem.</p>
    </section>`);
}
