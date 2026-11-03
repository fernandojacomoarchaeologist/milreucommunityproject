/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Detetives da Memória — adaptador editorial (futuro uso de fotografias reais do Museu).
 * Não altera o esquema das memórias: lê a fonte canónica e um registo próprio de autorizações
 * para uso interactivo (public/data/lab/detetives-authorisations.json, hoje VAZIO).
 * Uma memória só entra no jogo se estiver visível, elegível para lançamento, com direitos
 * autorizados, sem estado contestado ou retirado, sem retoque substantivo por IA, e com uma
 * decisão explícita de uso no jogo. Retirada ou perda de autorização = sai do catálogo.
 */

const BLOCKED_EDITORIAL = new Set(["contested", "withdrawn"]);

export function memoryGameEligibility(record, authorisations = []) {
  const reasons = [];
  if (!record?.publication?.siteVisible) reasons.push("não visível no site");
  if (record?.publication?.publicReleaseEligible === false) reasons.push("não elegível para lançamento público");
  if (record?.rights?.status !== "authorized-for-project-publication") reasons.push("direitos sem autorização de publicação");
  if (BLOCKED_EDITORIAL.has(record?.editorial?.status) || BLOCKED_EDITORIAL.has(record?.publication?.siteStatus)) reasons.push("contestada ou retirada");
  if ((record?.media?.digitalInterventions || []).some(item => item?.substantiveChange === true || /^ai-/.test(item?.type || ""))) reasons.push("retoque digital substantivo (ex.: IA)");
  const decision = authorisations.find(entry => entry.memoryId === record?.id && entry.scope === "interactive-game" && entry.status === "approved");
  if (!decision) reasons.push("sem decisão de uso interactivo no jogo");
  return { eligible: reasons.length === 0, reasons, decision: decision || null };
}

// Filtra o catálogo: missões ligadas a memórias só ficam se a memória continuar elegível.
export function filterMissionCatalog(missions, records = [], authorisations = []) {
  return missions.filter(mission => {
    const ref = mission.image?.memoryRef;
    if (!ref) return true; // ilustrações próprias do laboratório
    const record = records.find(item => item.id === ref);
    return memoryGameEligibility(record, authorisations).eligible;
  });
}
