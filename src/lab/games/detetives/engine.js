/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Detetives da Memória — motor do jogo (laboratório, versão de teste).
 * Funções puras: validação de missões, geometria das pistas (coordenadas normalizadas à imagem
 * original), pontuação, ajudas, conclusão e níveis. Sem DOM, sem rede, sem armazenamento.
 */

export const GAME_STATES = Object.freeze(["intro", "board", "tutorial", "mission", "paused", "discovery", "completed", "notebook", "error"]);

// Pontos por pista, conforme o nível de ajuda usado nessa pista (0 = sem ajuda).
export const POINTS_BY_HINT = Object.freeze([100, 75, 50]);
export const MAX_HINT_LEVEL = 2;
// Depois de quantos toques sem pista o jogo sugere ajuda (sem penalização).
export const MISSES_BEFORE_SUGGESTION = 3;

export const LEVELS = Object.freeze([
  { id: 1, name: "Aprendiz da Memória", minMissions: 0 },
  { id: 2, name: "Explorador", minMissions: 2 },
  // Níveis previstos para versões futuras (ainda sem missões suficientes para os atingir).
  { id: 3, name: "Investigador", minMissions: 5, future: true },
  { id: 4, name: "Guardião da Memória", minMissions: 9, future: true }
]);

export const TUTORIAL_STEPS = Object.freeze([
  { id: "tap", label: "Toca numa pista na imagem" },
  { id: "zoom", label: "Amplia a imagem (botão +, roda do rato ou dois dedos)" },
  { id: "read", label: "Lê uma descoberta e carrega em «Continuar a investigação»" },
  { id: "notebook", label: "Abre o Caderno de Campo" },
  { id: "hint", label: "Pede uma ajuda com «Preciso de uma pista»" }
]);

const isNum = value => typeof value === "number" && Number.isFinite(value);
const inUnit = value => isNum(value) && value >= 0 && value <= 1;

export function validateMission(mission) {
  const errors = [];
  if (!mission || typeof mission !== "object") return { ok: false, errors: ["missão inexistente"] };
  if (!/^[a-z0-9-]+$/.test(mission.missionId || "")) errors.push("missionId inválido");
  if (!mission.title) errors.push("título em falta");
  const image = mission.image || {};
  if (!image.src) errors.push("imagem em falta");
  if (!(isNum(image.width) && image.width > 0 && isNum(image.height) && image.height > 0)) errors.push("dimensões da imagem inválidas");
  if (!image.alt) errors.push("texto alternativo em falta");
  if (!image.credit) errors.push("crédito em falta");
  const hotspots = Array.isArray(mission.hotspots) ? mission.hotspots : [];
  if (!hotspots.length) errors.push("sem pistas");
  const ids = new Set();
  for (const spot of hotspots) {
    if (!spot.id || ids.has(spot.id)) errors.push(`pista com id inválido ou repetido: ${spot.id}`);
    ids.add(spot.id);
    if (!spot.title || !spot.clue || !spot.hint || !spot.discovery?.text) errors.push(`pista ${spot.id}: textos em falta`);
    if (!validShape(spot.shape)) errors.push(`pista ${spot.id}: geometria inválida`);
    if (spot.hintArea && !(inUnit(spot.hintArea.cx) && inUnit(spot.hintArea.cy) && isNum(spot.hintArea.r) && spot.hintArea.r > 0)) errors.push(`pista ${spot.id}: área de ajuda inválida`);
  }
  return { ok: errors.length === 0, errors };
}

function validShape(shape) {
  if (!shape) return false;
  if (shape.type === "circle") return inUnit(shape.cx) && inUnit(shape.cy) && isNum(shape.r) && shape.r > 0 && shape.r < 0.5;
  if (shape.type === "polygon") return Array.isArray(shape.points) && shape.points.length >= 3 && shape.points.every(p => Array.isArray(p) && inUnit(p[0]) && inUnit(p[1]));
  return false;
}

// Centro de uma forma (normalizado), útil para marcas de descoberta e alternativa por teclado.
export function shapeCenter(shape) {
  if (shape.type === "circle") return { x: shape.cx, y: shape.cy };
  const n = shape.points.length;
  return { x: shape.points.reduce((s, p) => s + p[0], 0) / n, y: shape.points.reduce((s, p) => s + p[1], 0) / n };
}

/**
 * Teste de acerto em píxeis da imagem ORIGINAL (para que círculos não fiquem elípticos).
 * point = { x, y } normalizado [0..1]; fora da imagem nunca acerta.
 * tolerancePx = folga em píxeis da imagem original (o ecrã converte a folga táctil).
 */
export function hitTest(shape, point, image, tolerancePx = 0) {
  if (!point || !inUnit(point.x) || !inUnit(point.y)) return false;
  const W = image.width, H = image.height;
  const px = point.x * W, py = point.y * H;
  if (shape.type === "circle") {
    return Math.hypot(px - shape.cx * W, py - shape.cy * H) <= shape.r * W + tolerancePx;
  }
  const pts = shape.points.map(([x, y]) => [x * W, y * H]);
  if (pointInPolygon(px, py, pts)) return true;
  return tolerancePx > 0 && distanceToPolygon(px, py, pts) <= tolerancePx;
}

function pointInPolygon(x, y, pts) {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i], [xj, yj] = pts[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function distanceToPolygon(x, y, pts) {
  let best = Infinity;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [x1, y1] = pts[j], [x2, y2] = pts[i];
    const dx = x2 - x1, dy = y2 - y1;
    const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy || 1)));
    best = Math.min(best, Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy)));
  }
  return best;
}

// Folga táctil: 16 px de ecrã convertidos para a imagem, limitada a 2,5 % da largura original
// (tolerante para o dedo, mas sem permitir resolver a imagem a tocar ao acaso).
export function touchTolerance(image, renderedWidth, screenPx = 16) {
  if (!(renderedWidth > 0)) return 0;
  return Math.min(screenPx * (image.width / renderedWidth), image.width * 0.025);
}

export function createRun(mission) {
  return { missionId: mission.missionId, found: [], hints: {}, points: {}, score: 0, misses: 0, steps: [], status: "mission" };
}

export function remainingHotspots(run, mission) {
  return mission.hotspots.filter(spot => !run.found.includes(spot.id));
}

export function registerTap(run, mission, point, tolerancePx = 0) {
  const hit = mission.hotspots.find(spot => hitTest(spot.shape, point, mission.image, tolerancePx));
  if (hit && run.found.includes(hit.id)) return { run, result: "already", hotspot: hit, points: 0 };
  if (hit) {
    const level = Math.min(run.hints[hit.id] || 0, MAX_HINT_LEVEL);
    const points = POINTS_BY_HINT[level];
    const found = [...run.found, hit.id];
    const next = { ...run, found, points: { ...run.points, [hit.id]: points }, score: run.score + points, misses: 0 };
    next.status = found.length === mission.hotspots.length ? "completed" : "mission";
    return { run: next, result: "found", hotspot: hit, points };
  }
  const misses = run.misses + 1;
  return { run: { ...run, misses }, result: "miss", hotspot: null, points: 0, suggestHelp: misses % MISSES_BEFORE_SUGGESTION === 0 };
}

// Ajuda: sobe um nível na pista indicada (ou na primeira por encontrar). Nunca desce, nunca passa de 2.
export function applyHint(run, mission, hotspotId) {
  const target = mission.hotspots.find(spot => spot.id === hotspotId && !run.found.includes(spot.id)) || remainingHotspots(run, mission)[0];
  if (!target) return { run, hotspot: null, level: 0 };
  const level = Math.min((run.hints[target.id] || 0) + 1, MAX_HINT_LEVEL);
  return { run: { ...run, hints: { ...run.hints, [target.id]: level } }, hotspot: target, level };
}

export function markStep(run, stepId) {
  return run.steps.includes(stepId) ? run : { ...run, steps: [...run.steps, stepId] };
}

export function isComplete(run, mission) {
  const allFound = mission.hotspots.every(spot => run.found.includes(spot.id));
  if (!allFound) return false;
  if (mission.kind === "tutorial") return TUTORIAL_STEPS.every(step => run.steps.includes(step.id));
  return true;
}

export function pendingTutorialSteps(run) {
  return TUTORIAL_STEPS.filter(step => !run.steps.includes(step.id));
}

export function maxScore(mission) {
  return mission.hotspots.length * POINTS_BY_HINT[0];
}

export function levelFor(completedCount) {
  const reached = LEVELS.filter(level => !level.future && completedCount >= level.minMissions);
  const current = reached[reached.length - 1];
  const next = LEVELS.find(level => level.minMissions > completedCount) || null;
  return { current, next };
}

// Missões desbloqueadas em sequência: cada missão abre depois de concluir a anterior.
export function unlockedMissions(missions, completedIds) {
  const ordered = [...missions].sort((a, b) => a.order - b.order);
  return ordered.filter((mission, index) => index === 0 || completedIds.includes(ordered[index - 1].missionId)).map(m => m.missionId);
}
