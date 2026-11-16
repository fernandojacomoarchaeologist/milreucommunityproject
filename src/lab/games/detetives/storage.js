/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Detetives da Memória — progresso local (só neste browser; sem dados pessoais, sem servidor).
 * Versionado: dados antigos ou inválidos são migrados ou descartados sem partir o jogo.
 * Todas as leituras e escritas estão protegidas (modo privado ou armazenamento bloqueado).
 */

export const STORAGE_KEY = "milreu-lab-detetives";
export const STORAGE_VERSION = 1;

export function emptyProgress() {
  return { version: STORAGE_VERSION, completed: {}, current: null, prefs: { sound: false, calm: false }, metrics: emptyMetrics() };
}

// Medição LOCAL de qualidade (só neste browser; nunca enviada): conclusão, ajudas, descobertas,
// erros de interacção e tempo de resposta. Sem dados pessoais nem tempo total de permanência.
export function emptyMetrics() {
  return { missionsStarted: 0, missionsCompleted: 0, hintsUsed: 0, discoveries: 0, optionalDiscoveries: 0, misses: 0, wrongAnswers: 0, firstDiscoveryMs: [], feedbackMs: [], attention: {} };
}

// Mapa de ATENÇÃO local (para avaliar o jogo, não pessoas): onde o jogador passa a lupa/o rato e toca,
// numa grelha grosseira por fotografia. Só contagens; nunca enviado. Toques valem 3, passagens 1.
export const ATTENTION_GRID = Object.freeze({ cols: 24, rows: 16 });
export function recordAttention(progress, missionId, point, weight = 1) {
  if (!/^[a-z0-9-]+$/.test(missionId || "") || !point || !(point.x >= 0 && point.x <= 1 && point.y >= 0 && point.y <= 1)) return progress;
  const { cols, rows } = ATTENTION_GRID, metrics = { ...(progress.metrics || emptyMetrics()) };
  const attention = { ...(metrics.attention || {}) };
  const bins = Array.isArray(attention[missionId]) && attention[missionId].length === cols * rows ? [...attention[missionId]] : new Array(cols * rows).fill(0);
  const i = Math.min(rows - 1, Math.floor(point.y * rows)) * cols + Math.min(cols - 1, Math.floor(point.x * cols));
  bins[i] = Math.min(1e6, bins[i] + weight);
  attention[missionId] = bins;
  return { ...progress, metrics: { ...metrics, attention } };
}
function migrateMetrics(raw) {
  const m = emptyMetrics();
  if (!raw || typeof raw !== "object") return m;
  for (const key of ["missionsStarted", "missionsCompleted", "hintsUsed", "discoveries", "optionalDiscoveries", "misses", "wrongAnswers"]) m[key] = num(raw[key]);
  for (const key of ["firstDiscoveryMs", "feedbackMs"]) m[key] = (Array.isArray(raw[key]) ? raw[key] : []).map(num).slice(-20);
  const size = ATTENTION_GRID.cols * ATTENTION_GRID.rows;
  for (const [id, bins] of Object.entries(raw.attention && typeof raw.attention === "object" ? raw.attention : {})) {
    if (/^[a-z0-9-]+$/.test(id) && Array.isArray(bins) && bins.length === size) m.attention[id] = bins.map(num);
  }
  return m;
}
export function bumpMetric(progress, key, value) {
  const metrics = { ...(progress.metrics || emptyMetrics()) };
  if (Array.isArray(metrics[key])) metrics[key] = [...metrics[key], Math.round(value)].slice(-20);
  else metrics[key] = (metrics[key] || 0) + (value ?? 1);
  return { ...progress, metrics };
}

const arr = value => (Array.isArray(value) ? value.filter(item => typeof item === "string") : []);
const num = value => (typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : 0);

export function migrate(raw) {
  if (!raw || typeof raw !== "object") return emptyProgress();
  if (raw.version !== STORAGE_VERSION) return emptyProgress(); // sem versões anteriores publicadas
  const out = emptyProgress();
  for (const [id, entry] of Object.entries(raw.completed || {})) {
    if (!/^[a-z0-9-]+$/.test(id) || !entry || typeof entry !== "object") continue;
    out.completed[id] = { bestScore: num(entry.bestScore), lastScore: num(entry.lastScore), found: arr(entry.found), completedAt: typeof entry.completedAt === "string" ? entry.completedAt : null, plays: Math.max(1, num(entry.plays)) };
  }
  const c = raw.current;
  if (c && typeof c === "object" && /^[a-z0-9-]+$/.test(c.missionId || "")) {
    const hints = {}, points = {};
    for (const [k, v] of Object.entries(c.hints || {})) hints[k] = Math.min(2, num(v));
    for (const [k, v] of Object.entries(c.points || {})) points[k] = num(v);
    const attempts = {};
    for (const [k, v] of Object.entries(c.attempts || {})) attempts[k] = num(v);
    out.current = { missionId: c.missionId, found: arr(c.found), hints, points, attempts, score: num(c.score), misses: num(c.misses), steps: arr(c.steps), status: "mission", completedOnce: c.completedOnce === true };
  }
  out.prefs.sound = raw.prefs?.sound === true;
  out.prefs.calm = raw.prefs?.calm === true;
  out.metrics = migrateMetrics(raw.metrics);
  return out;
}

function store(storage) {
  if (storage) return storage;
  try { return globalThis.localStorage || null; } catch { return null; }
}

export function loadProgress(storage) {
  try {
    const raw = store(storage)?.getItem(STORAGE_KEY);
    return migrate(raw ? JSON.parse(raw) : null);
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(progress, storage) {
  try { store(storage)?.setItem(STORAGE_KEY, JSON.stringify(progress)); return true; } catch { return false; }
}

export function clearProgress(storage) {
  try { store(storage)?.removeItem(STORAGE_KEY); } catch { /* sem armazenamento */ }
  return emptyProgress();
}

export function recordCompletion(progress, run, now = new Date(), { keepCurrent = false } = {}) {
  const previous = progress.completed[run.missionId];
  return {
    ...progress,
    current: keepCurrent ? progress.current : null,
    completed: {
      ...progress.completed,
      [run.missionId]: {
        bestScore: Math.max(previous?.bestScore || 0, run.score),
        lastScore: run.score,
        found: [...new Set([...(previous?.found || []), ...run.found])],
        completedAt: previous?.completedAt && keepCurrent ? previous.completedAt : now.toISOString(),
        plays: (previous?.plays || 0) + (keepCurrent ? 0 : 1)
      }
    }
  };
}
