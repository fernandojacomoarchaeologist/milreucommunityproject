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
  return { version: STORAGE_VERSION, completed: {}, current: null, prefs: { sound: false } };
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
    out.current = { missionId: c.missionId, found: arr(c.found), hints, points, score: num(c.score), misses: num(c.misses), steps: arr(c.steps), status: "mission" };
  }
  out.prefs.sound = raw.prefs?.sound === true;
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

export function recordCompletion(progress, run, now = new Date()) {
  const previous = progress.completed[run.missionId];
  return {
    ...progress,
    current: null,
    completed: {
      ...progress.completed,
      [run.missionId]: {
        bestScore: Math.max(previous?.bestScore || 0, run.score),
        lastScore: run.score,
        found: [...run.found],
        completedAt: now.toISOString(),
        plays: (previous?.plays || 0) + 1
      }
    }
  };
}
