/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Laboratório de jogos — Detetives da Memória: motor, pontuação, estados, persistência, pistas,
 * conclusão, adaptador editorial e isolamento em relação à produção.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import {
  validateMission, hitTest, registerTap, applyHint, isComplete, markStep, createRun, levelFor,
  unlockedMissions, touchTolerance, shapeCenter, POINTS_BY_HINT, TUTORIAL_STEPS, MISSES_BEFORE_SUGGESTION
} from "../src/lab/games/detetives/engine.js";
import { loadProgress, saveProgress, clearProgress, recordCompletion, migrate, STORAGE_KEY, STORAGE_VERSION } from "../src/lab/games/detetives/storage.js";
import { memoryGameEligibility, filterMissionCatalog } from "../src/lab/games/detetives/editorial-adapter.js";

const catalog = JSON.parse(readFileSync("public/data/lab/detetives-missions.json", "utf8"));
const [tutorial, m1, m2] = catalog.missions;
const memStore = () => { const data = new Map(); return { getItem: k => data.get(k) ?? null, setItem: (k, v) => data.set(k, String(v)), removeItem: k => data.delete(k), data }; };

test("catálogo: 3 missões válidas (treino + 2), 3 pistas cada, ilustrações demonstrativas existentes", () => {
  assert.equal(catalog.isExample, true);
  assert.equal(catalog.missions.length, 3);
  assert.equal(tutorial.kind, "tutorial");
  for (const mission of catalog.missions) {
    assert.deepEqual(validateMission(mission), { ok: true, errors: [] }, mission.missionId);
    assert.equal(mission.hotspots.length, 3);
    assert.equal(mission.image.memoryRef, null);
    assert.equal(mission.image.demo, true);
    assert.match(mission.image.provenance, /não pertence ao acervo histórico de Milreu/);
    assert.ok(existsSync(mission.image.src), mission.image.src);
    assert.match(readFileSync(mission.image.src, "utf8"), /Ilustração demonstrativa — não pertence ao acervo histórico de Milreu\./);
    for (const spot of mission.hotspots) {
      const words = spot.discovery.text.split(/\s+/).length;
      assert.ok(words >= 30 && words <= 60, `${spot.id}: ${words} palavras`);
      assert.equal(spot.discovery.certainty, null);
      assert.ok(shapeCenter(spot.shape).y < 0.95, "pista fora da faixa do aviso");
    }
  }
});

test("validação rejeita dados inválidos", () => {
  assert.equal(validateMission(null).ok, false);
  assert.equal(validateMission({ ...m1, hotspots: [] }).ok, false);
  assert.equal(validateMission({ ...m1, image: { ...m1.image, width: 0 } }).ok, false);
  const bad = { ...m1, hotspots: [{ ...m1.hotspots[0], shape: { type: "circle", cx: 1.2, cy: 0.5, r: 0.1 } }] };
  assert.equal(validateMission(bad).ok, false);
});

test("geometria normalizada: acerta no centro de cada pista, falha longe e fora da imagem", () => {
  for (const mission of catalog.missions) for (const spot of mission.hotspots) {
    assert.ok(hitTest(spot.shape, shapeCenter(spot.shape), mission.image), `${spot.id} centro`);
    for (const other of mission.hotspots.filter(o => o !== spot)) assert.ok(!hitTest(spot.shape, shapeCenter(other.shape), mission.image), `${spot.id} vs ${other.id}`);
  }
  const lupa = tutorial.hotspots[0];
  assert.equal(hitTest(lupa.shape, { x: -0.01, y: 0.3 }, tutorial.image, 1000), false);
  assert.equal(hitTest(lupa.shape, { x: 0.5, y: 1.2 }, tutorial.image, 1000), false);
});

test("a geometria não depende do tamanho do ecrã (mesmo ponto normalizado, qualquer escala)", () => {
  const spot = m1.hotspots[0], c = shapeCenter(spot.shape);
  for (const renderedWidth of [320, 768, 1280, 4000]) {
    // ponto convertido para ecrã e de volta: continua a acertar
    const px = c.x * renderedWidth, back = { x: px / renderedWidth, y: c.y };
    assert.ok(hitTest(spot.shape, back, m1.image, touchTolerance(m1.image, renderedWidth)));
  }
});

test("folga táctil limitada: tocar ao acaso não resolve a imagem", () => {
  assert.ok(touchTolerance(m1.image, 320) <= m1.image.width * 0.025 + 1e-9);
  let hits = 0, total = 0;
  for (let x = 0.025; x < 1; x += 0.05) for (let y = 0.025; y < 0.95; y += 0.05) {
    total++; if (m1.hotspots.some(s => hitTest(s.shape, { x, y }, m1.image, touchTolerance(m1.image, 375)))) hits++;
  }
  assert.ok(hits / total < 0.12, `cobertura ${(hits / total * 100).toFixed(1)} %`);
});

test("pontuação: 100 / 75 / 50 por nível de ajuda; sem penalização; sem pontos repetidos", () => {
  assert.deepEqual([...POINTS_BY_HINT], [100, 75, 50]);
  let run = createRun(m1);
  const [a, b, c] = m1.hotspots;
  let out = registerTap(run, m1, { x: 0.02, y: 0.9 }); run = out.run;
  assert.equal(out.result, "miss"); assert.equal(run.score, 0);
  out = registerTap(run, m1, shapeCenter(a.shape)); run = out.run;
  assert.equal(out.points, 100);
  out = registerTap(run, m1, shapeCenter(a.shape));
  assert.equal(out.result, "already"); assert.equal(out.run.score, 100);
  run = applyHint(run, m1, b.id).run;
  out = registerTap(run, m1, shapeCenter(b.shape)); run = out.run; assert.equal(out.points, 75);
  run = applyHint(run, m1, c.id).run; run = applyHint(run, m1, c.id).run; run = applyHint(run, m1, c.id).run;
  assert.equal(run.hints[c.id], 2, "ajuda não passa de 2");
  out = registerTap(run, m1, shapeCenter(c.shape)); run = out.run; assert.equal(out.points, 50);
  assert.equal(run.score, 225);
  assert.equal(run.status, "completed");
  assert.ok(isComplete(run, m1));
});

test("ajuda aponta para a primeira pista por encontrar quando nenhuma está seleccionada", () => {
  let run = createRun(m2);
  run = registerTap(run, m2, shapeCenter(m2.hotspots[0].shape)).run;
  const { hotspot, level } = applyHint(run, m2, null);
  assert.equal(hotspot.id, m2.hotspots[1].id); assert.equal(level, 1);
});

test("sugestão de ajuda após toques falhados (sem penalização)", () => {
  let run = createRun(m1), suggestions = 0;
  for (let i = 0; i < MISSES_BEFORE_SUGGESTION * 2; i++) { const out = registerTap(run, m1, { x: 0.01, y: 0.01 }); run = out.run; if (out.suggestHelp) suggestions++; }
  assert.equal(suggestions, 2); assert.equal(run.score, 0);
});

test("treino só termina com as 3 pistas e as 5 acções executadas", () => {
  let run = createRun(tutorial);
  for (const spot of tutorial.hotspots) run = registerTap(run, tutorial, shapeCenter(spot.shape)).run;
  assert.equal(isComplete(run, tutorial), false);
  for (const step of TUTORIAL_STEPS) run = markStep(run, step.id);
  assert.equal(isComplete(run, tutorial), true);
});

test("progressão: desbloqueio sequencial e níveis", () => {
  const ids = catalog.missions.map(m => m.missionId);
  assert.deepEqual(unlockedMissions(catalog.missions, []), [ids[0]]);
  assert.deepEqual(unlockedMissions(catalog.missions, [ids[0]]), [ids[0], ids[1]]);
  assert.deepEqual(unlockedMissions(catalog.missions, [ids[0], ids[1]]), ids);
  assert.equal(levelFor(0).current.name, "Aprendiz da Memória");
  assert.equal(levelFor(1).current.name, "Aprendiz da Memória");
  assert.equal(levelFor(2).current.name, "Explorador");
  assert.equal(levelFor(3).current.name, "Explorador");
});

test("persistência local versionada: guarda, recupera, migra, apaga", () => {
  const store = memStore();
  let progress = loadProgress(store);
  assert.equal(progress.version, STORAGE_VERSION);
  let run = createRun(m1);
  run = registerTap(run, m1, shapeCenter(m1.hotspots[0].shape)).run;
  progress = { ...progress, current: run };
  assert.ok(saveProgress(progress, store));
  const back = loadProgress(store);
  assert.deepEqual(back.current.found, [m1.hotspots[0].id]); assert.equal(back.current.score, 100);
  for (const spot of m1.hotspots.slice(1)) run = registerTap(run, m1, shapeCenter(spot.shape)).run;
  progress = recordCompletion(progress, run, new Date("2026-11-03T10:00:00Z"));
  assert.equal(progress.current, null); assert.equal(progress.completed[m1.missionId].bestScore, 300);
  const replay = recordCompletion(progress, { ...run, score: 150 });
  assert.equal(replay.completed[m1.missionId].bestScore, 300); assert.equal(replay.completed[m1.missionId].lastScore, 150); assert.equal(replay.completed[m1.missionId].plays, 2);
  store.setItem(STORAGE_KEY, "{ isto não é JSON");
  assert.deepEqual(loadProgress(store).completed, {});
  assert.deepEqual(migrate({ version: 99, completed: { x: {} } }).completed, {});
  assert.deepEqual(migrate({ version: 1, completed: { "../mau": { bestScore: 5 } } }).completed, {});
  clearProgress(store); assert.equal(store.getItem(STORAGE_KEY), null);
  const broken = { getItem() { throw new Error("bloqueado"); }, setItem() { throw new Error("bloqueado"); }, removeItem() { throw new Error("bloqueado"); } };
  assert.equal(loadProgress(broken).version, STORAGE_VERSION); assert.equal(saveProgress(progress, broken), false);
});

test("adaptador editorial: nenhuma memória entra sem decisão de uso interactivo; MM202617 nunca", () => {
  const records = JSON.parse(readFileSync("public/data/memories.json", "utf8")).records;
  const authorisations = JSON.parse(readFileSync("public/data/lab/detetives-authorisations.json", "utf8")).authorisations;
  assert.deepEqual(authorisations, []);
  assert.equal(records.filter(r => memoryGameEligibility(r, authorisations).eligible).length, 0);
  const mm17 = records.find(r => r.id === "MM202617");
  const fake = [{ memoryId: "MM202617", scope: "interactive-game", status: "approved" }];
  assert.equal(memoryGameEligibility(mm17, fake).eligible, false);
  assert.ok(memoryGameEligibility(mm17, fake).reasons.some(r => /IA/.test(r)));
  const ok = records.find(r => r.id === "MM202601");
  assert.equal(memoryGameEligibility(ok, [{ memoryId: "MM202601", scope: "interactive-game", status: "approved" }]).eligible, true);
  const withRef = [{ missionId: "x", image: { memoryRef: "MM202601" } }, { missionId: "y", image: { memoryRef: null } }];
  assert.deepEqual(filterMissionCatalog(withRef, records, []).map(m => m.missionId), ["y"]);
});

test("isolamento: produção não carrega nem empacota o laboratório", () => {
  const config = JSON.parse(readFileSync("public/config/lab.runtime.json", "utf8"));
  assert.equal(config.enabled, false);
  const main = readFileSync("src/main.js", "utf8");
  assert.match(main, /PRODUCTION_HOSTS = new Set\(\["projectomilreu\.pt","www\.projectomilreu\.pt"\]\)/);
  assert.match(main, /await import\("\.\/lab\/lab-boot\.js"\)/);
  assert.doesNotMatch(main, /^import .*\.\/lab\//m, "o laboratório só pode ser importado dinamicamente");
  const build = readFileSync("scripts/build.mjs", "utf8");
  assert.match(build, /MILREU_LAB_ENABLED==="true"&&labEnvironment!=="production"/);
  assert.match(build, /"dist\/src\/lab","dist\/public\/data\/lab","dist\/public\/media\/lab"/);
  const index = readFileSync("index.html", "utf8");
  assert.doesNotMatch(index, /lab\.css|lab-boot/);
  const views = ["src/components/layout.js", "src/lib/router.js"].map(f => readFileSync(f, "utf8")).join("");
  assert.doesNotMatch(views, /from "\.\.\/lab\//);
});

test("sem estilos inline, sem rede externa, sem armazenamento de dados pessoais no jogo", () => {
  for (const file of ["src/lab/games/detetives/game.js", "src/lab/lab-boot.js"]) {
    const src = readFileSync(file, "utf8");
    assert.doesNotMatch(src, / style="/, file);
    assert.doesNotMatch(src, /https?:\/\//, file);
  }
  const storage = readFileSync("src/lab/games/detetives/storage.js", "utf8");
  assert.doesNotMatch(storage, /email|nome|name:/i);
});
