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
// Converte coordenadas normalizadas da variante canónica para o recorte de apresentação [x0,y0,x1,y1].
export function toCrop(shape, crop) {
  const [x0, y0, x1, y1] = crop, sx = x1 - x0, sy = y1 - y0;
  // As zonas desenhadas com folga sobre a margem branca do scan ficam presas à borda do derivado (a margem não se vê).
  const clamp = v => Math.min(1, Math.max(0, v));
  const X = x => +clamp((x - x0) / sx).toFixed(5), Y = y => +clamp((y - y0) / sy).toFixed(5);
  if (!shape) return shape;
  if (shape.type === "multi") return { ...shape, shapes: shape.shapes.map(part => toCrop(part, crop)) };
  if (shape.type === "circle") return { ...shape, cx: X(shape.cx), cy: Y(shape.cy), r: +(shape.r / sx).toFixed(5) };
  if (shape.type === "polygon") return { ...shape, points: shape.points.map(([x, y]) => [X(x), Y(y)]) };
  if ("cx" in shape && "cy" in shape) return { ...shape, cx: X(shape.cx), cy: Y(shape.cy), ...(shape.r ? { r: +(shape.r / sx).toFixed(5) } : {}) };
  return shape;
}

export function resolveMissions(catalog, records = [], manifest = { items: [] }, authorisations = [], derivatives = { items: [] }) {
  const derived = new Map((derivatives.items || []).map(item => [item.memoryId, item]));
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
    // Derivado de apresentação (sem margens do scanner): só se existir e tiver sido gerado da mesma variante.
    const pres = mission.presentation && derived.get(record.id);
    const usePres = pres && pres.source === variant.path;
    const shownTasks = usePres ? tasks.map(task => ({
      ...task,
      ...(task.shape ? { shape: toCrop(task.shape, pres.crop) } : {}),
      ...(task.hintArea ? { hintArea: toCrop(task.hintArea, pres.crop) } : {}),
      ...(task.zoomArea ? { zoomArea: { ...toCrop(task.zoomArea, pres.crop), scale: task.zoomArea.scale } } : {}),
      cardImage: pres.tasks?.find(t => t.taskId === task.id)?.output || null
    })) : tasks;
    missions.push({
      ...mission, tasks: shownTasks, related,
      image: {
        src: usePres ? pres.output : variant.path, width: usePres ? pres.width : variant.width, height: usePres ? pres.height : variant.height,
        canonicalSrc: variant.path, presentationCrop: usePres ? pres.crop : null, memoryRef: record.id,
        alt: `${pt(record.title)}. ${pt(record.description?.short) || ""}`.trim(),
        documentTitle: pt(record.title), date: pt(record.date?.display), credit: pt(record.media?.credit),
        provenance: `Fotografia do acervo do Museu de Memórias de Milreu (${record.id}).${usePres ? " Apresentada sem as margens brancas da digitalização (derivado de apresentação; original intacto)." : ""} Uso no jogo só em ambiente de teste.`,
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
