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
  // «approved-for-testing» vale só no laboratório (que nunca é publicado); produção exigirá «approved».
  const decision = authorisations.find(entry => entry.memoryId === record?.id && entry.scope === "interactive-game" && ["approved", "approved-for-testing"].includes(entry.status));
  if (!decision) reasons.push("sem decisão de uso interactivo no jogo");
  return { eligible: reasons.length === 0, reasons, decision: decision || null };
}

const pt = value => (value && typeof value === "object" ? value["pt-PT"] ?? null : value ?? null);

/**
 * Resolve o catálogo de jogabilidade contra a FONTE CANÓNICA: imagem, dimensões, título, crédito,
 * data e direitos vêm sempre da ficha da memória e do manifesto de imagens (sem arquivo paralelo).
 * Missões cuja memória não é elegível ficam em «blocked», com os motivos. Perguntas de comparação
 * com uma memória não elegível são retiradas.
 */
export function resolveMissions(catalog, records = [], manifest = { items: [] }, authorisations = []) {
  const byId = new Map(records.map(record => [record.id, record]));
  const media = new Map((manifest.items || []).map(item => [item.id, item]));
  const missions = [], blocked = [];
  for (const mission of catalog?.missions || []) {
    const record = byId.get(mission.memoryRef);
    const check = memoryGameEligibility(record, authorisations);
    if (!check.eligible) { blocked.push({ missionId: mission.missionId, memoryRef: mission.memoryRef, reasons: check.reasons }); continue; }
    const variant = media.get(record.id)?.variants?.[mission.variant || "immersive"];
    if (!variant) { blocked.push({ missionId: mission.missionId, memoryRef: mission.memoryRef, reasons: ["variante de imagem em falta no manifesto"] }); continue; }
    const tasks = [];
    for (const task of mission.tasks || []) {
      if (task.compareMemory) {
        const other = byId.get(task.compareMemory);
        if (!memoryGameEligibility(other, authorisations).eligible) continue;
        const otherVariant = media.get(other.id)?.variants?.card;
        tasks.push({ ...task, compare: { id: other.id, title: pt(other.title), credit: pt(other.media?.credit), src: otherVariant?.path || other.media?.variants?.card } });
      } else tasks.push(task);
    }
    const related = (mission.related || []).map(id => byId.get(id)).filter(other => memoryGameEligibility(other, authorisations).eligible)
      .map(other => ({ id: other.id, title: pt(other.title), src: media.get(other.id)?.variants?.card?.path || other.media?.variants?.card }));
    missions.push({
      ...mission, tasks, related,
      image: {
        src: variant.path, width: variant.width, height: variant.height, memoryRef: record.id,
        alt: `${pt(record.title)}. ${pt(record.description?.short) || ""}`.trim(),
        documentTitle: pt(record.title), date: pt(record.date?.display), credit: pt(record.media?.credit),
        provenance: `Fotografia do acervo do Museu de Memórias de Milreu (${record.id}). Uso no jogo só em ambiente de teste.`,
        rightsStatus: record.rights?.status, gameDecision: check.decision
      }
    });
  }
  return { missions, blocked };
}

// Compatibilidade: filtra missões já resolvidas pela elegibilidade da memória.
export function filterMissionCatalog(missions, records = [], authorisations = []) {
  return missions.filter(mission => {
    const ref = mission.image?.memoryRef || mission.memoryRef;
    if (!ref) return true;
    const record = records.find(item => item.id === ref);
    return memoryGameEligibility(record, authorisations).eligible;
  });
}
