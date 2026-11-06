/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Detetives da Memória — motor do jogo (laboratório, versão de teste).
 * Funções puras: validação de missões (2 a 5 descobertas: encontrar na fotografia ou responder a
 * perguntas de comparação, ampliação, legenda ou testemunho), geometria das pistas (coordenadas
 * normalizadas à imagem), pontuação, ajudas, conclusão e níveis. Sem DOM, sem rede, sem armazenamento.
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
  { id: "tap", label: "Toca num elemento da fotografia" },
  { id: "zoom", label: "Amplia a imagem (botão +, roda do rato ou dois dedos)" },
  { id: "read", label: "Lê uma descoberta e carrega em «Continuar a investigação»" },
  { id: "notebook", label: "Abre o Caderno de Campo" },
  { id: "hint", label: "Pede uma ajuda com «Preciso de uma pista»" }
]);

const isNum = value => typeof value === "number" && Number.isFinite(value);
const inUnit = value => isNum(value) && value >= 0 && value <= 1;

// Camadas de descoberta: observação → investigação (opcional) → história; a colecção é o selo/página do álbum.
export const LAYERS = Object.freeze({
  observacao: { id: "observacao", label: "Observação" },
  investigacao: { id: "investigacao", label: "Investigação" },
  historia: { id: "historia", label: "História" }
});
export const CERTAINTY = Object.freeze(["confirmed", "probable", "hypothesis"]);
export const MIN_TASKS = 2;
export const MAX_TASKS = 5;

export const tasksOf = mission => (Array.isArray(mission?.tasks) ? mission.tasks : []);
export const findTasks = mission => tasksOf(mission).filter(task => task.type === "find");
export const requiredTasks = mission => tasksOf(mission).filter(task => !task.optional);

// Valida uma missão JÁ resolvida pelo adaptador editorial (imagem vinda da ficha do Museu).
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
  const tasks = tasksOf(mission);
  if (tasks.length < MIN_TASKS || tasks.length > MAX_TASKS) errors.push(`a missão deve ter entre ${MIN_TASKS} e ${MAX_TASKS} descobertas`);
  if (!requiredTasks(mission).length) errors.push("sem descobertas obrigatórias");
  const ids = new Set();
  for (const task of tasks) {
    if (!task.id || ids.has(task.id)) errors.push(`descoberta com id inválido ou repetido: ${task.id}`);
    ids.add(task.id);
    if (!LAYERS[task.layer]) errors.push(`${task.id}: camada inválida`);
    if (!task.title || !task.clue || !task.hint || !task.discovery?.text || !task.discovery?.source) errors.push(`${task.id}: textos ou fonte em falta`);
    if (task.discovery && !CERTAINTY.includes(task.discovery.certainty)) errors.push(`${task.id}: grau de certeza inválido`);
    if (task.type === "find") {
      if (!validShape(task.shape)) errors.push(`${task.id}: geometria inválida`);
      if (task.hintArea && !(inUnit(task.hintArea.cx) && inUnit(task.hintArea.cy) && isNum(task.hintArea.r) && task.hintArea.r > 0)) errors.push(`${task.id}: área de ajuda inválida`);
    } else if (task.type === "question") {
      const options = Array.isArray(task.options) ? task.options : [];
      if (!task.prompt || options.length < 2 || !options.some(o => o.id === task.answer)) errors.push(`${task.id}: pergunta inválida`);
      if (task.zoomArea && !(inUnit(task.zoomArea.cx) && inUnit(task.zoomArea.cy) && task.zoomArea.scale > 1)) errors.push(`${task.id}: ampliação inválida`);
    } else errors.push(`${task.id}: tipo desconhecido`);
  }
  return { ok: errors.length === 0, errors };
}

function validShape(shape) {
  if (!shape) return false;
  // Várias zonas para o mesmo elemento (ex.: duas pessoas na mesma tarefa).
  if (shape.type === "multi") return Array.isArray(shape.shapes) && shape.shapes.length >= 1 && shape.shapes.every(part => part.type !== "multi" && validShape(part));
  if (shape.type === "circle") return inUnit(shape.cx) && inUnit(shape.cy) && isNum(shape.r) && shape.r > 0 && shape.r < 0.5;
  if (shape.type === "polygon") return Array.isArray(shape.points) && shape.points.length >= 3 && shape.points.every(p => Array.isArray(p) && inUnit(p[0]) && inUnit(p[1]));
  return false;
}

// Centro de uma forma (normalizado), útil para marcas de descoberta e alternativa por teclado.
export function shapeCenter(shape) {
  if (shape.type === "multi") return shapeCenter(shape.shapes[0]);
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
  if (shape.type === "multi") return shape.shapes.some(part => hitTest(part, point, image, tolerancePx));
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

// Folga táctil: 28 px de ecrã convertidos para a imagem, limitada a 4,5 % da largura original
// (0.3.2: mais tolerante — o responsável achou difícil acertar —, mas sem permitir resolver a imagem a tocar ao acaso).
export const NEAR_FRACTION = 0.08;

export function touchTolerance(image, renderedWidth, screenPx = 28) {
  if (!(renderedWidth > 0)) return 0;
  return Math.min(screenPx * (image.width / renderedWidth), image.width * 0.045);
}

export function createRun(mission) {
  return { missionId: mission.missionId, found: [], hints: {}, points: {}, attempts: {}, score: 0, misses: 0, steps: [], status: "mission", completedOnce: false };
}

export function remainingHotspots(run, mission) {
  return findTasks(mission).filter(spot => !run.found.includes(spot.id));
}

export function remainingTasks(run, mission) {
  return tasksOf(mission).filter(task => !run.found.includes(task.id));
}

function pointsFor(level) { return POINTS_BY_HINT[Math.min(Math.max(level, 0), MAX_HINT_LEVEL)]; }

function award(run, mission, task, level) {
  const points = pointsFor(level);
  const found = [...run.found, task.id];
  const next = { ...run, found, points: { ...run.points, [task.id]: points }, score: run.score + points, misses: 0 };
  next.status = requiredTasks(mission).every(t => found.includes(t.id)) ? "completed" : "mission";
  return { run: next, points };
}

// Toque na imagem: acerta primeiro numa pista ainda por encontrar; só depois avisa «já encontrada».
export function registerTap(run, mission, point, tolerancePx = 0) {
  const spots = findTasks(mission).filter(spot => hitTest(spot.shape, point, mission.image, tolerancePx));
  const hit = spots.find(spot => !run.found.includes(spot.id));
  if (hit) {
    const { run: next, points } = award(run, mission, hit, run.hints[hit.id] || 0);
    return { run: next, result: "found", hotspot: hit, points };
  }
  if (spots.length) return { run, result: "already", hotspot: spots[0], points: 0 };
  const misses = run.misses + 1;
  // «Estás perto»: o toque falhou por pouco (até 8 % da largura além da folga) uma pista ainda por encontrar.
  const nearPx = tolerancePx + mission.image.width * NEAR_FRACTION;
  const near = findTasks(mission).find(spot => !run.found.includes(spot.id) && hitTest(spot.shape, point, mission.image, nearPx)) || null;
  return { run: { ...run, misses }, result: "miss", hotspot: null, near, points: 0, suggestHelp: misses % MISSES_BEFORE_SUGGESTION === 0 };
}

// Resposta a uma pergunta: sem penalização; cada tentativa falhada conta como um nível de ajuda.
export function answerQuestion(run, mission, questionId, optionId) {
  const task = tasksOf(mission).find(t => t.id === questionId && t.type === "question");
  if (!task || run.found.includes(task.id)) return { run, result: "ignored", task: task || null, points: 0 };
  if (optionId !== task.answer) {
    return { run: { ...run, attempts: { ...run.attempts, [task.id]: (run.attempts[task.id] || 0) + 1 } }, result: "retry", task, points: 0 };
  }
  const level = Math.max(run.hints[task.id] || 0, run.attempts[task.id] || 0);
  const { run: next, points } = award(run, mission, task, level);
  return { run: next, result: "found", task, points };
}

// Ajuda: sobe um nível na descoberta indicada (ou na primeira obrigatória por fazer). Nunca passa de 2.
export function applyHint(run, mission, taskId) {
  const pending = remainingTasks(run, mission);
  const target = pending.find(t => t.id === taskId) || pending.find(t => !t.optional) || pending[0];
  if (!target) return { run, hotspot: null, task: null, level: 0 };
  const level = Math.min((run.hints[target.id] || 0) + 1, MAX_HINT_LEVEL);
  return { run: { ...run, hints: { ...run.hints, [target.id]: level } }, hotspot: target, task: target, level };
}

export function markStep(run, stepId) {
  return run.steps.includes(stepId) ? run : { ...run, steps: [...run.steps, stepId] };
}

// Concluída quando todas as descobertas OBRIGATÓRIAS estão feitas (as de investigação são opcionais).
export function isComplete(run, mission) {
  if (!requiredTasks(mission).every(task => run.found.includes(task.id))) return false;
  if (mission.kind === "tutorial") return TUTORIAL_STEPS.every(step => run.steps.includes(step.id));
  return true;
}

export function pendingTutorialSteps(run) {
  return TUTORIAL_STEPS.filter(step => !run.steps.includes(step.id));
}

export function maxScore(mission) {
  return tasksOf(mission).length * POINTS_BY_HINT[0];
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
