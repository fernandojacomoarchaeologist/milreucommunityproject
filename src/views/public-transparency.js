/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
// Renderizador público de transparência. Lê APENAS snapshots aprovados
// (publication_status='published'), agregados e sem dados individuais.
// Por omissão não há indicadores publicados: estado vazio honesto.
const esc=(v)=>String(v??"").replace(/[&<>"]/g,(c)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

export function publicTransparencyView(publicView={}){
  const indicators=(publicView&&publicView.publishedIndicators)||[];
  if(!indicators.length){
    return `<section class="public-transparency public-transparency--empty" aria-label="Transparência">
      <h2>Transparência</h2>
      <p>De momento não há indicadores públicos publicados. Quando existirem, serão apresentados aqui, agregados e após aprovação de qualidade e privacidade.</p>
    </section>`;
  }
  return `<section class="public-transparency" aria-label="Transparência">
    <h2>Transparência</h2>
    <table class="public-transparency__table"><thead><tr><th>Indicador</th><th>Valor</th><th>Período</th></tr></thead><tbody>
    ${indicators.map((i)=>`<tr><td>${esc(i.name)}</td><td>${esc(i.value??"—")} ${esc(i.unit||"")}</td><td>${esc(i.periodEnd||"—")}</td></tr>`).join("")}
    </tbody></table>
  </section>`;
}
