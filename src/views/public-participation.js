/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Renderizador público de participação contínua. Lê APENAS snapshots
 * aprovados e programas com visibilidade pública. Por omissão não há efeitos
 * ativos, pelo que apresenta um estado vazio honesto. Não altera o Portal
 * nem o Museu; integra-se por slots quando (e se) um efeito for aprovado.
 */
import { readActiveSnapshots, publicProgrammes, assertPublicSafe } from "../services/public-snapshot-service.js";

const esc = (v) => String(v ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

export function publicParticipationView(publicView = {}) {
  const snapshots = readActiveSnapshots(publicView);
  const programmes = publicProgrammes(publicView);
  snapshots.forEach((s) => assertPublicSafe(s.payload));

  if (!snapshots.length && !programmes.length) {
    return `<section class="public-participation public-participation--empty" aria-label="Participação contínua">
      <h2>Participação contínua</h2>
      <p>De momento não há percursos públicos ativos. Quando existirem, serão apresentados aqui após aprovação editorial, de direitos, privacidade, tradução e acessibilidade.</p>
    </section>`;
  }

  return `<section class="public-participation" aria-label="Participação contínua">
    <h2>Participação contínua</h2>
    <ul class="public-participation__list">
      ${programmes.map((p) => `<li><h3>${esc(p.title)}</h3><p>${esc(p.description || p.objective || "")}</p></li>`).join("")}
    </ul>
  </section>`;
}
