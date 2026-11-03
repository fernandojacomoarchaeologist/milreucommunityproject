/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Laboratório de jogos — Detetives da Memória (v0.2, fotografias reais do acervo): catálogo,
 * resolução contra a fonte canónica, motor (pistas, perguntas, camadas, pontuação, conclusão),
 * persistência e métricas locais, adaptador editorial e isolamento em relação à produção.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import {
  validateMission, hitTest, registerTap, answerQuestion, applyHint, isComplete, markStep, createRun, levelFor,
  unlockedMissions, touchTolerance, shapeCenter, maxScore, tasksOf, requiredTasks, POINTS_BY_HINT, TUTORIAL_STEPS,
  MISSES_BEFORE_SUGGESTION, MIN_TASKS, MAX_TASKS
} from "../src/lab/games/detetives/engine.js";
import { loadProgress, saveProgress, clearProgress, recordCompletion, migrate, bumpMetric, STORAGE_KEY, STORAGE_VERSION } from "../src/lab/games/detetives/storage.js";
import { memoryGameEligibility, resolveMissions, toCrop } from "../src/lab/games/detetives/editorial-adapter.js";
import { createHash } from "node:crypto";

const read = path => JSON.parse(readFileSync(path, "utf8"));
const catalog = read("public/data/lab/detetives-missions.json");
const records = read("public/data/memories.json").records;
const manifest = read("public/data/media-manifest.json");
const authorisations = read("public/data/lab/detetives-authorisations.json").authorisations;
const { missions, blocked } = resolveMissions(catalog, records, manifest, authorisations);
const [m1, m2, m3] = missions;
const finds = m => tasksOf(m).filter(t => t.type === "find");
const questions = m => tasksOf(m).filter(t => t.type === "question");
const memStore = () => { const data = new Map(); return { getItem: k => data.get(k) ?? null, setItem: (k, v) => data.set(k, String(v)), removeItem: k => data.delete(k), data }; };
const finish = (run, mission) => {
  for (const t of finds(mission)) run = registerTap(run, mission, shapeCenter(t.shape)).run;
  for (const q of questions(mission)) run = answerQuestion(run, mission, q.id, q.answer).run;
  return run;
};

test("catálogo: só fotografias reais do acervo, prioridades MM202615, MM202621 e MM202614; sem MM202617 nem ilustrações", () => {
  assert.deepEqual(catalog.missions.map(m => m.memoryRef), ["MM202615", "MM202621", "MM202614"]);
  assert.equal(blocked.length, 0);
  assert.equal(missions.length, 3);
  const raw = JSON.stringify(catalog);
  assert.doesNotMatch(raw, /MM202617|\.svg|ilustração demonstrativa/i);
  // public/media/lab só guarda os derivados de APRESENTAÇÃO (recortes .webp das fotografias reais), nunca ilustrações.
  const derivados = read("public/data/lab/detetives-derivados.json");
  const listed = derivados.items.flatMap(item => [item.output, ...item.tasks.map(t => t.output)]);
  assert.ok(listed.every(path => path.startsWith("public/media/lab/detetives/derivados/") && path.endsWith(".webp")));
  for (const mission of missions) {
    assert.deepEqual(validateMission(mission), { ok: true, errors: [] }, mission.missionId);
    const n = tasksOf(mission).length;
    assert.ok(n >= MIN_TASKS && n <= MAX_TASKS, `${mission.missionId}: ${n} descobertas`);
  }
});

test("imagem, dimensões, título e crédito vêm da ficha canónica e do manifesto (sem arquivo paralelo)", () => {
  for (const mission of missions) {
    const record = records.find(r => r.id === mission.memoryRef);
    const variant = manifest.items.find(i => i.id === mission.memoryRef).variants.immersive;
    assert.equal(mission.image.src, record.media.variants.immersive);
    assert.equal(mission.image.width, variant.width); assert.equal(mission.image.height, variant.height);
    assert.equal(mission.image.documentTitle, record.title["pt-PT"]);
    assert.equal(mission.image.credit, record.media.credit["pt-PT"]);
    assert.ok(existsSync(mission.image.src));
    const rawMission = catalog.missions.find(m => m.missionId === mission.missionId);
    assert.equal(rawMission.image, undefined, "o catálogo de jogo não duplica dados da ficha");
  }
});

test("cada pista tem verificação visual, fonte e grau de certeza da taxonomia; textos sem identificação de pessoas", () => {
  for (const mission of missions) for (const task of tasksOf(mission)) {
    assert.ok(["confirmed", "probable", "hypothesis"].includes(task.discovery.certainty), task.id);
    assert.ok(task.discovery.source.length > 10);
    if (task.type === "find") assert.ok(task.visualCheck && task.visualCheck.length > 15, `${task.id}: falta descrição visual confirmada`);
    const text = `${task.discovery.text} ${task.prompt || ""} ${task.clue}`;
    assert.doesNotMatch(text, /Hauschild|Alzira/, "identificações hipotéticas não entram no jogo");
  }
});

test("geometria: acerta no centro de cada pista, não acerta nas outras nem fora da imagem", () => {
  for (const mission of missions) {
    for (const spot of finds(mission)) {
      assert.ok(hitTest(spot.shape, shapeCenter(spot.shape), mission.image), `${spot.id} centro`);
      for (const other of finds(mission).filter(o => o !== spot)) assert.ok(!hitTest(spot.shape, shapeCenter(other.shape), mission.image), `${spot.id} vs ${other.id}`);
      assert.equal(hitTest(spot.shape, { x: -0.01, y: 0.5 }, mission.image, 1000), false);
    }
  }
});

test("folga táctil limitada: cada pista ocupa < 15 % da fotografia e as obrigatórias, juntas, < 20 %", () => {
  const cover = (mission, tasks) => { let hits = 0, total = 0;
    for (let x = 0.0125; x < 1; x += 0.025) for (let y = 0.0125; y < 1; y += 0.025) { total++; if (tasks.some(s => hitTest(s.shape, { x, y }, mission.image, touchTolerance(mission.image, 375)))) hits++; }
    return hits / total; };
  for (const mission of missions) {
    for (const spot of finds(mission)) assert.ok(cover(mission, [spot]) < 0.15, `${mission.missionId}/${spot.id}`);
    assert.ok(cover(mission, finds(mission).filter(t => !t.optional)) < 0.2, mission.missionId);
  }
});

test("toque prefere a pista por encontrar quando duas zonas se tocam", () => {
  const mission = { ...m2, tasks: tasksOf(m2) };
  let run = createRun(mission);
  const pessoas = finds(mission).find(t => t.id === "pessoas");
  run = registerTap(run, mission, shapeCenter(pessoas.shape)).run;
  const fragmentos = finds(mission).find(t => t.id === "fragmentos");
  const out = registerTap(run, mission, shapeCenter(fragmentos.shape));
  assert.equal(out.result, "found"); assert.equal(out.hotspot.id, "fragmentos");
});

test("perguntas: sem penalização, tentativas e ajudas baixam para 75/50; não dão pontos duas vezes", () => {
  const q = questions(m3).find(t => t.id === "contagem");
  let run = createRun(m3);
  let out = answerQuestion(run, m3, q.id, "a"); run = out.run;
  assert.equal(out.result, "retry"); assert.equal(run.score, 0);
  out = answerQuestion(run, m3, q.id, q.answer); run = out.run;
  assert.equal(out.points, 75);
  assert.equal(answerQuestion(run, m3, q.id, q.answer).result, "ignored");
  const t = questions(m3).find(t => t.id === "testemunho");
  run = applyHint(run, m3, t.id).run; run = applyHint(run, m3, t.id).run; run = applyHint(run, m3, t.id).run;
  out = answerQuestion(run, m3, t.id, t.answer); assert.equal(out.points, 50);
});

test("camadas: conclui com as obrigatórias; as de investigação são extra; pontuação 100/75/50", () => {
  assert.deepEqual([...POINTS_BY_HINT], [100, 75, 50]);
  for (const mission of [m2, m3]) {
    let run = createRun(mission);
    for (const task of requiredTasks(mission)) run = task.type === "find" ? registerTap(run, mission, shapeCenter(task.shape)).run : answerQuestion(run, mission, task.id, task.answer).run;
    assert.ok(isComplete(run, mission), mission.missionId);
    assert.ok(tasksOf(mission).some(t => t.optional && !run.found.includes(t.id)), "ficam extra por descobrir");
    run = finish(run, mission);
    assert.equal(run.score, maxScore(mission));
  }
});

test("missão 1 (MM202615): quatro objectos concretos, sem objectivos vagos; o treino continua suportado pelo motor", () => {
  assert.equal(m1.memoryRef ?? m1.image.memoryRef, "MM202615");
  assert.equal(m1.kind, "mission");
  assert.deepEqual(requiredTasks(m1).map(t => t.id), ["bolsa", "flores", "recipiente", "latas"]);
  assert.ok(requiredTasks(m1).every(t => t.type === "find" && t.discovery.short));
  assert.doesNotMatch(JSON.stringify(m1.tasks), /encontra o grupo|encontra a mesa/i);
  assert.equal(m1.opening, "Há algo curioso nesta fotografia... Consegues encontrar?");
  const tut = { ...m1, kind: "tutorial" };
  let run = finish(createRun(tut), tut);
  assert.equal(isComplete(run, tut), false);
  for (const step of TUTORIAL_STEPS) run = markStep(run, step.id);
  assert.equal(isComplete(run, tut), true);
});

test("derivado de apresentação: sem margens do scan, master intacto e pistas realinhadas pelo recorte", () => {
  const derivados = read("public/data/lab/detetives-derivados.json");
  const sha = path => createHash("sha256").update(readFileSync(path)).digest("hex");
  const resolved = resolveMissions(catalog, records, manifest, authorisations, derivados).missions;
  for (const item of derivados.items) {
    assert.equal(sha(item.source), item.sourceSha256, `${item.memoryId}: variante de origem alterada`);
    assert.equal(sha(item.output), item.sha256, `${item.memoryId}: derivado alterado`);
    assert.ok(item.crop[0] > 0 && item.crop[2] < 1 && item.crop[1] > 0 && item.crop[3] < 1, "o recorte só tira margens");
    for (const t of item.tasks) assert.ok(existsSync(t.output), t.output);
  }
  for (const [i, canonical] of missions.entries()) {
    const shown = resolved[i], item = derivados.items.find(d => d.memoryId === canonical.image.memoryRef);
    assert.equal(shown.image.src, item.output);
    assert.equal(shown.image.canonicalSrc, canonical.image.src);
    assert.deepEqual(shown.image.presentationCrop, item.crop);
    assert.deepEqual(validateMission(shown), { ok: true, errors: [] }, `${shown.missionId} com derivado`);
    const [x0, y0, x1, y1] = item.crop;
    for (const task of finds(canonical)) {
      const a = shapeCenter(task.shape), b = shapeCenter(tasksOf(shown).find(t => t.id === task.id).shape);
      // centro realinhado (as zonas cortadas na margem do scan deslocam o centro no máximo 1 %)
      assert.ok(Math.abs(x0 + b.x * (x1 - x0) - a.x) < 0.01 && Math.abs(y0 + b.y * (y1 - y0) - a.y) < 0.01, task.id);
      assert.ok(b.x > 0 && b.x < 1 && b.y > 0 && b.y < 1, `${task.id} fica dentro do derivado`);
    }
  }
  const crop = [0.1, 0.2, 0.9, 0.8];
  assert.deepEqual(toCrop({ type: "circle", cx: 0.5, cy: 0.5, r: 0.08 }, crop), { type: "circle", cx: 0.5, cy: 0.5, r: 0.1 });
  const multi = toCrop({ type: "multi", shapes: [{ type: "polygon", points: [[0.1, 0.2], [0.9, 0.8], [0.5, 0.5]] }] }, crop);
  assert.deepEqual(multi.shapes[0].points.map(p => p.map(v => Math.round(v * 1e6) / 1e6)), [[0, 0], [1, 1], [0.5, 0.5]]);
  assert.deepEqual(toCrop({ type: "polygon", points: [[0.05, 0.1], [0.5, 0.5], [0.95, 0.9]] }, crop).points, [[0, 0], [0.5, 0.5], [1, 1]]);
});

test("sugestão de ajuda após toques falhados (sem penalização)", () => {
  let run = createRun(m3), suggestions = 0;
  for (let i = 0; i < MISSES_BEFORE_SUGGESTION * 2; i++) { const out = registerTap(run, m3, { x: 0.02, y: 0.02 }); run = out.run; if (out.suggestHelp) suggestions++; }
  assert.equal(suggestions, 2); assert.equal(run.score, 0);
});

test("progressão: desbloqueio sequencial e níveis", () => {
  const ids = missions.map(m => m.missionId);
  assert.deepEqual(unlockedMissions(missions, []), [ids[0]]);
  assert.deepEqual(unlockedMissions(missions, ids.slice(0, 2)), ids);
  assert.equal(levelFor(1).current.name, "Aprendiz da Memória");
  assert.equal(levelFor(2).current.name, "Explorador");
});

test("persistência local versionada, extra depois de concluir e métricas locais", () => {
  const store = memStore();
  let progress = loadProgress(store);
  assert.equal(progress.version, STORAGE_VERSION);
  let run = finish(createRun(m2), m2);
  progress = recordCompletion(progress, run, new Date("2026-11-03T10:00:00Z"));
  assert.equal(progress.current, null); assert.equal(progress.completed[m2.missionId].bestScore, maxScore(m2));
  const again = recordCompletion(progress, { ...run, score: 100, found: ["pessoas"] }, new Date(), { keepCurrent: true });
  assert.equal(again.completed[m2.missionId].plays, 1, "extra depois de concluir não conta como nova partida");
  assert.ok(again.completed[m2.missionId].found.length >= tasksOf(m2).length);
  progress = bumpMetric(bumpMetric(progress, "hintsUsed"), "feedbackMs", 12.4);
  assert.ok(saveProgress(progress, store));
  const back = loadProgress(store);
  assert.equal(back.metrics.hintsUsed, 1); assert.deepEqual(back.metrics.feedbackMs, [12]);
  assert.doesNotMatch(store.data.get(STORAGE_KEY), /@|email|nome/i, "sem dados pessoais");
  store.setItem(STORAGE_KEY, "{ inválido");
  assert.deepEqual(loadProgress(store).completed, {});
  assert.deepEqual(migrate({ version: 99 }).completed, {});
  clearProgress(store); assert.equal(store.getItem(STORAGE_KEY), null);
  const broken = { getItem() { throw new Error("x"); }, setItem() { throw new Error("x"); }, removeItem() { throw new Error("x"); } };
  assert.equal(loadProgress(broken).version, STORAGE_VERSION); assert.equal(saveProgress(progress, broken), false);
});

test("direitos: autorizações só de TESTE; MM202617 e MM202618 (retoque por IA) nunca entram", () => {
  for (const entry of authorisations) { assert.equal(entry.status, "approved-for-testing"); assert.deepEqual(entry.environments, ["hml"]); }
  for (const id of ["MM202617", "MM202618"]) {
    const record = records.find(r => r.id === id);
    const forced = [{ memoryId: id, scope: "interactive-game", status: "approved" }];
    const check = memoryGameEligibility(record, forced);
    assert.equal(check.eligible, false); assert.ok(check.reasons.some(r => /IA/.test(r)));
  }
  const without = resolveMissions(catalog, records, manifest, []);
  assert.equal(without.missions.length, 0); assert.equal(without.blocked.length, 3);
  const noCompare = resolveMissions(catalog, records, manifest, authorisations.filter(a => a.memoryId !== "MM202622"));
  assert.ok(!tasksOf(noCompare.missions[0]).some(t => t.compareMemory === "MM202622"), "comparação retirada sem autorização");
});

test("isolamento: produção não carrega nem empacota o laboratório", () => {
  assert.equal(read("public/config/lab.runtime.json").enabled, false);
  const main = readFileSync("src/main.js", "utf8");
  assert.match(main, /PRODUCTION_HOSTS = new Set\(\["projectomilreu\.pt","www\.projectomilreu\.pt"\]\)/);
  assert.match(main, /await import\("\.\/lab\/lab-boot\.js"\)/);
  assert.doesNotMatch(main, /^import .*\.\/lab\//m);
  const build = readFileSync("scripts/build.mjs", "utf8");
  assert.match(build, /MILREU_LAB_ENABLED==="true"&&labEnvironment!=="production"/);
  assert.match(build, /"dist\/src\/lab","dist\/public\/data\/lab","dist\/public\/media\/lab"/);
  assert.doesNotMatch(readFileSync("index.html", "utf8"), /lab\.css|lab-boot/);
});

test("sem estilos inline, sem rede externa, sem mecânicas de sorte ou pressão", () => {
  for (const file of ["src/lab/games/detetives/game.js", "src/lab/games/detetives/art.js", "src/lab/lab-boot.js"]) {
    const src = readFileSync(file, "utf8");
    assert.doesNotMatch(src, / style="/, file);
    assert.doesNotMatch(src, /https?:\/\//, file);
    assert.doesNotMatch(src, /Math\.random\(\)\s*[<>]|lootbox|countdown|setInterval/i, file);
  }
});

test("revisão visual: pistas invisíveis, guia com as quatro mensagens, peças SVG só com tokens", async () => {
  const game = readFileSync("src/lab/games/detetives/game.js", "utf8");
  const art = readFileSync("src/lab/games/detetives/art.js", "utf8");
  const css = readFileSync("src/lab/lab.css", "utf8");
  const { GUIDE } = await import("../src/lab/games/detetives/game.js");
  assert.deepEqual(GUIDE, {
    start: "Há algo curioso nesta fotografia... Consegues encontrar?",
    idle: "Experimenta usar a lupa!",
    found: "Boa descoberta! Queres saber mais?",
    done: "Excelente investigação! Vou guardar esta memória no teu caderno."
  });
  // os contornos só se desenham para pistas ENCONTRADAS
  assert.match(game, /filter\(t => t\.type === "find" && S\.run\.found\.includes\(t\.id\)\)/);
  for (const src of [art, css]) assert.doesNotMatch(src, /#[0-9a-f]{3,8}\b|gradient\(/i);
  assert.doesNotMatch(game + css, /confetti|coin|moeda/i);
  // a missão seguinte só começa por escolha do jogador
  assert.doesNotMatch(game, /later\(\(\) => startMission/);
});
