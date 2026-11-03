/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Detetives da Memória — interface (laboratório, versão de teste; NÃO publicada em produção).
 * Ecrãs: intro → missões → investigação (tutorial ou missão) → descoberta → conclusão → Caderno de Campo.
 * O palco mantém a proporção da imagem: as pistas usam coordenadas normalizadas e continuam
 * alinhadas com zoom, deslocação e qualquer tamanho de ecrã. Alternativas ao toque: teclado
 * (cursor-lupa) e lista de zonas descritas. Sem rede além dos ficheiros do próprio site.
 */
import {
  validateMission, registerTap, applyHint, markStep, isComplete, pendingTutorialSteps, createRun,
  touchTolerance, shapeCenter, levelFor, unlockedMissions, maxScore, TUTORIAL_STEPS, POINTS_BY_HINT
} from "./engine.js";
import { loadProgress, saveProgress, clearProgress, recordCompletion } from "./storage.js";
import { ICONS } from "./icons.js";

const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
const reduceMotion = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

const OPENING = [
  "Há fotografias que guardam muito mais do que imagens.",
  "Guardam lugares, pessoas, acontecimentos e pequenas histórias que o tempo pode fazer esquecer.",
  "Em Milreu, cada fotografia é uma oportunidade para descobrir algo novo.",
  "Prepara a tua lupa. A próxima descoberta pode estar mesmo à tua frente!"
];

export function createDetetivesGame({ root, catalog, assetUrl, lang = "pt-PT", query = {}, storage }) {
  const valid = [], invalid = [];
  for (const mission of catalog?.missions || []) {
    const check = validateMission(mission);
    (check.ok ? valid : invalid).push(check.ok ? mission : { mission, errors: check.errors });
  }
  valid.sort((a, b) => a.order - b.order);

  const S = {
    screen: "intro", progress: loadProgress(storage), mission: null, run: null,
    zoom: { s: 1, x: 0, y: 0 }, cursor: { x: 0.5, y: 0.5 }, selected: null, dialog: null,
    discovery: null, completion: null, error: null, confirmClear: false, notice: ""
  };
  const timers = new Set();
  const later = (fn, ms) => { const id = setTimeout(() => { timers.delete(id); fn(); }, ms); timers.add(id); return id; };
  let audio = null;
  let resizeObserver = null;
  let returnFocus = null;

  const missionById = id => valid.find(m => m.missionId === id) || null;
  const completedIds = () => Object.keys(S.progress.completed).filter(id => missionById(id));
  const unlocked = () => unlockedMissions(valid, completedIds());
  const save = () => saveProgress(S.progress, storage);

  // ───────────────────────── som (opcional, desligado por omissão) ─────────────────────────
  function chime(kind) {
    if (!S.progress.prefs.sound) return;
    try {
      audio = audio || new (globalThis.AudioContext || globalThis.webkitAudioContext)();
      const notes = kind === "complete" ? [523, 659, 784, 1047] : kind === "found" ? [660, 880] : [330];
      notes.forEach((freq, i) => {
        const osc = audio.createOscillator(), gain = audio.createGain();
        osc.type = "sine"; osc.frequency.value = freq;
        const t = audio.currentTime + i * 0.11;
        gain.gain.setValueAtTime(0.0001, t); gain.gain.exponentialRampToValueAtTime(0.12, t + 0.02); gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
        osc.connect(gain).connect(audio.destination); osc.start(t); osc.stop(t + 0.3);
      });
    } catch { /* sem áudio */ }
  }

  function announce(message) {
    const live = root.querySelector("[data-dm-live]");
    if (live) { live.textContent = ""; later(() => { live.textContent = message; }, 30); }
  }

  // ───────────────────────── modelos de ecrã ─────────────────────────
  const labNotice = `<p class="dm-lab-flag">${ICONS.lupa(16)} Laboratório de jogos · versão de teste, não publicada</p>`;
  const langNotice = lang !== "pt-PT" ? `<p class="dm-note">Este jogo está disponível apenas em português nesta versão de teste.</p>` : "";

  function introHtml() {
    const current = S.progress.current && missionById(S.progress.current.missionId);
    const tutorialDone = Boolean(S.progress.completed["aprende-a-investigar"]);
    const primary = current ? `Continuar a investigação` : `Começar a investigar`;
    const thumbs = valid.slice(0, 3).map((m, i) => `<figure class="dm-intro__card dm-intro__card--${i}"><img src="${assetUrl(m.image.src)}" alt="" loading="lazy" decoding="async"></figure>`).join("");
    return `<section class="dm-intro" aria-labelledby="dm-title">
      <div class="dm-intro__copy">
        ${labNotice}
        <span class="dm-intro__lens">${ICONS.lupa(56)}</span>
        <h1 id="dm-title" class="dm-intro__title">Detetives da Memória</h1>
        <p class="dm-intro__subtitle">Cada fotografia guarda uma história. Consegues descobri-la?</p>
        <div class="dm-intro__text">${OPENING.map(line => `<p>${esc(line)}</p>`).join("")}</div>
        ${langNotice}
        ${current ? `<p class="dm-note">Investigação em curso: <strong>${esc(current.title)}</strong> (${S.progress.current.found.length}/${current.hotspots.length} pistas).</p>` : ""}
        <div class="dm-actions">
          <button type="button" class="dm-btn dm-btn--primary" data-act="start">${ICONS.lupa(22)} ${primary}</button>
          <button type="button" class="dm-btn" data-act="howto">Como jogar</button>
          ${tutorialDone || completedIds().length ? `<button type="button" class="dm-btn" data-act="notebook">${ICONS.caderno(20)} Caderno de Campo</button>` : ""}
        </div>
        <a class="dm-link" href="#/museu">${ICONS.voltar(18)} Voltar ao Museu de Memórias</a>
      </div>
      <div class="dm-intro__art" aria-hidden="true">${thumbs}</div>
    </section>`;
  }

  function howtoHtml() {
    return dialogHtml("dm-howto", "Como jogar", `
      <ol class="dm-steps">
        <li><strong>Observa</strong> a imagem com calma. Não há tempo limite.</li>
        <li><strong>Toca ou clica</strong> no sítio onde achas que está a pista. Os cartões dizem o que procurar.</li>
        <li><strong>Amplia</strong> com os botões + e −, com a roda do rato ou com dois dedos. Arrasta para te deslocares.</li>
        <li><strong>Teclado:</strong> no quadro da imagem, as setas mexem a lupa, Enter investiga, + e − ampliam, 0 repõe.</li>
        <li><strong>Sem ver bem a imagem?</strong> Usa «Explorar por descrição»: escolhe uma zona descrita por palavras.</li>
        <li><strong>Precisas de ajuda?</strong> «Preciso de uma pista» dá primeiro uma dica e depois destaca uma zona. Pistas sem ajuda valem 100 pontos; com ajuda, 75 ou 50. Errar não tira pontos.</li>
        <li>O teu progresso fica guardado <strong>só neste browser</strong>. Podes apagá-lo no Caderno de Campo.</li>
      </ol>`, `<button type="button" class="dm-btn dm-btn--primary" data-act="close-dialog">Percebi</button>`);
  }

  function boardHtml() {
    const done = completedIds(), open = unlocked();
    const level = levelFor(done.length);
    const cards = valid.map(m => {
      const isDone = done.includes(m.missionId), isOpen = open.includes(m.missionId);
      const current = S.progress.current?.missionId === m.missionId ? S.progress.current : null;
      const best = S.progress.completed[m.missionId]?.bestScore;
      const status = isDone ? `${ICONS.selo(18)} Concluída · melhor pontuação ${best}/${maxScore(m)}` : current ? `Em curso · ${current.found.length}/${m.hotspots.length} pistas` : isOpen ? "Por investigar" : `${ICONS.cadeado(18)} Bloqueada — conclui primeiro a missão anterior`;
      const action = !isOpen ? "" : `<button type="button" class="dm-btn ${isDone ? "" : "dm-btn--primary"}" data-act="play" data-mission="${m.missionId}">${current ? "Continuar" : isDone ? "Jogar novamente" : "Investigar"}</button>`;
      return `<article class="dm-mission ${isOpen ? "" : "is-locked"} ${isDone ? "is-done" : ""}">
        <div class="dm-mission__media"><img src="${assetUrl(m.image.src)}" alt="" loading="lazy" decoding="async"></div>
        <div class="dm-mission__body">
          <p class="dm-eyebrow">Missão ${String(m.order).padStart(2, "0")} · ${esc(m.difficulty)}${m.kind === "tutorial" ? " · treino" : ""}</p>
          <h2>${esc(m.title)}</h2>
          <p>${esc(m.description)}</p>
          <p class="dm-mission__status">${status}</p>
          ${action}
        </div>
      </article>`;
    }).join("");
    return `<section class="dm-board" aria-labelledby="dm-board-title">
      <div class="dm-board__head">
        <div>${labNotice}<h1 id="dm-board-title">Escolhe uma investigação</h1>
        <p>Nível: <strong>${esc(level.current.name)}</strong>${level.next && !level.next.future ? ` · faltam ${level.next.minMissions - done.length} missões para <strong>${esc(level.next.name)}</strong>` : ""}</p></div>
        <div class="dm-actions">
          <button type="button" class="dm-btn" data-act="notebook">${ICONS.caderno(20)} Caderno de Campo</button>
          <button type="button" class="dm-btn" data-act="intro">${ICONS.voltar(18)} Início</button>
        </div>
      </div>
      ${S.notice ? `<p class="dm-note" role="status">${esc(S.notice)}</p>` : ""}
      <div class="dm-board__grid">${cards}</div>
      ${invalid.length ? `<p class="dm-note">${invalid.length} missão(ões) ignorada(s) por dados inválidos.</p>` : ""}
    </section>`;
  }

  function playHtml() {
    const m = S.mission, r = S.run;
    const tutorial = m.kind === "tutorial";
    const clues = m.hotspots.map((spot, i) => {
      const found = r.found.includes(spot.id), hint = r.hints[spot.id] || 0;
      return `<li class="dm-clue ${found ? "is-found" : ""} ${S.selected === spot.id ? "is-selected" : ""}">
        <button type="button" class="dm-clue__btn" data-act="select-clue" data-clue="${spot.id}" aria-pressed="${S.selected === spot.id}" ${found ? "disabled" : ""}>
          <span class="dm-clue__n">${found ? ICONS.marca(20) : i + 1}</span>
          <span><strong>${found ? esc(spot.title) : `Pista ${i + 1}`}</strong><span class="dm-clue__text">${esc(spot.clue)}</span>
          <span class="dm-clue__state">${found ? `Descoberta · +${r.points[spot.id] ?? 0} pontos` : hint ? `Por descobrir · ajuda ${hint}/2` : "Por descobrir"}</span>
          ${!found && hint >= 1 ? `<span class="dm-clue__hint">${ICONS.pista(16)} ${esc(spot.hint)}</span>` : ""}</span>
        </button></li>`;
    }).join("");
    const steps = tutorial ? `<section class="dm-coach" aria-labelledby="dm-coach-title"><h2 id="dm-coach-title">Treino</h2><ol>${TUTORIAL_STEPS.map(step => {
      const ok = r.steps.includes(step.id);
      return `<li class="${ok ? "is-done" : ""}"><span aria-hidden="true">${ok ? "✓" : "○"}</span> ${esc(step.label)} <span class="dm-sr">${ok ? "— feito" : "— por fazer"}</span></li>`;
    }).join("")}</ol></section>` : "";
    const zones = (m.zones || []).map(z => `<li><button type="button" class="dm-zone" data-act="zone" data-zone="${z.id}"><strong>${esc(z.label)}</strong> — ${esc(z.description)}</button></li>`).join("");
    return `<section class="dm-play" aria-labelledby="dm-play-title">
      <header class="dm-bar">
        <button type="button" class="dm-icon-btn" data-act="board" aria-label="Sair para as missões (o progresso fica guardado)">${ICONS.voltar(22)}</button>
        <div class="dm-bar__title"><p class="dm-eyebrow">${tutorial ? "Treino" : `Missão ${String(m.order).padStart(2, "0")}`}</p><h1 id="dm-play-title">${esc(m.title)}</h1></div>
        <p class="dm-bar__stat" data-dm-progress><span>${r.found.length}/${m.hotspots.length}</span> pistas</p>
        <p class="dm-bar__stat dm-bar__score" data-dm-score><span>${r.score}</span> pontos</p>
        <button type="button" class="dm-icon-btn" data-act="sound" aria-pressed="${S.progress.prefs.sound}" aria-label="Efeitos sonoros ${S.progress.prefs.sound ? "ligados" : "desligados"}">${S.progress.prefs.sound ? ICONS.som(22) : ICONS.semSom(22)}</button>
        <button type="button" class="dm-icon-btn" data-act="pause" aria-label="Pausa">${ICONS.pausa(22)}</button>
      </header>
      <div class="dm-play__body">
        <div class="dm-stagewrap">
          <div class="dm-stage" data-dm-stage tabindex="0" role="group" aria-roledescription="imagem para investigar" aria-label="${esc(m.image.alt)} Usa as setas para mexer a lupa e Enter para investigar." aria-describedby="dm-stage-help">
            <div class="dm-canvas" data-dm-canvas>
              <img src="${assetUrl(m.image.src)}" alt="" draggable="false" data-dm-image>
              <div class="dm-marks" data-dm-marks></div>
              <div class="dm-hintzone" data-dm-hintzone hidden></div>
              <div class="dm-cursor" data-dm-cursor aria-hidden="true">${ICONS.lupa(30)}</div>
            </div>
            <div class="dm-zoom" role="group" aria-label="Ampliação">
              <button type="button" class="dm-icon-btn" data-act="zoom-in" aria-label="Ampliar">${ICONS.mais(22)}</button>
              <button type="button" class="dm-icon-btn" data-act="zoom-out" aria-label="Reduzir">${ICONS.menos(22)}</button>
              <button type="button" class="dm-icon-btn" data-act="zoom-reset" aria-label="Repor tamanho">${ICONS.repor(22)}</button>
            </div>
          </div>
          <p id="dm-stage-help" class="dm-caption">${esc(m.image.provenance)} <span class="dm-caption__credit">${esc(m.image.credit)}</span></p>
        </div>
        <aside class="dm-side" aria-label="Pistas e ferramentas">
          <p class="dm-opening">${esc(m.opening)}</p>
          ${steps}
          <h2 class="dm-side__title">O que procuramos</h2>
          <ol class="dm-clues" data-dm-clues>${clues}</ol>
          <div class="dm-tools">
            <button type="button" class="dm-btn dm-btn--primary" data-act="hint">${ICONS.pista(20)} Preciso de uma pista</button>
            <button type="button" class="dm-btn" data-act="notebook-overlay">${ICONS.caderno(20)} Caderno de Campo</button>
          </div>
          <details class="dm-describe"><summary>Explorar por descrição (alternativa ao toque)</summary>
            <p>Escolhe uma zona da imagem para a investigar.</p><ul>${zones}</ul></details>
        </aside>
      </div>
    </section>`;
  }

  function dialogHtml(id, title, body, actions, extraClass = "") {
    return `<div class="dm-dialog" data-dm-dialog><div class="dm-dialog__card ${extraClass}" role="dialog" aria-modal="true" aria-labelledby="${id}-t">
      <h2 id="${id}-t">${title}</h2>${body}<div class="dm-actions">${actions}</div></div></div>`;
  }

  function discoveryHtml() {
    const { hotspot, points, index } = S.discovery;
    const m = S.mission;
    return dialogHtml("dm-disc", "Excelente observação!", `
      <p class="dm-eyebrow">Pista ${index} de ${m.hotspots.length} · +${points} pontos</p>
      <p>Encontraste uma nova pista. Vamos descobrir o que ela nos pode contar.</p>
      <div class="dm-file">
        <h3>${esc(hotspot.title)}</h3>
        <p>${esc(hotspot.discovery.text)}</p>
        <dl>
          <dt>Fonte</dt><dd>${esc(hotspot.discovery.source)}</dd>
          <dt>Grau de certeza</dt><dd>${hotspot.discovery.certainty ? esc(hotspot.discovery.certainty) : "Não aplicável (demonstração)"}</dd>
          <dt>Memória original</dt><dd>${m.image.memoryRef ? `<a href="#/museu/memorias/${esc(m.image.memoryRef)}">${esc(m.image.memoryRef)}</a>` : "Sem ligação — ilustração demonstrativa"}</dd>
        </dl>
      </div>`, `<button type="button" class="dm-btn dm-btn--primary" data-act="continue">Continuar a investigação</button>`, "dm-dialog__card--discovery");
  }

  function pausedHtml() {
    return dialogHtml("dm-pause", "Investigação em pausa", `<p>O teu progresso está guardado. Podes voltar quando quiseres.</p>`,
      `<button type="button" class="dm-btn dm-btn--primary" data-act="resume">Retomar</button>
       <button type="button" class="dm-btn" data-act="notebook">${ICONS.caderno(20)} Caderno de Campo</button>
       <button type="button" class="dm-btn" data-act="board">Sair para as missões</button>`);
  }

  function completedHtml() {
    const { mission: m, run: r, before, after, best } = S.completion;
    const next = valid.find(item => item.order > m.order && unlocked().includes(item.missionId));
    const levelUp = after.current.id !== before.current.id;
    const ficha = m.hotspots.map(spot => `<li>${ICONS.marca(18)} <strong>${esc(spot.title)}</strong> — +${r.points[spot.id] ?? 0}</li>`).join("");
    return dialogHtml("dm-done", "Missão concluída!", `
      <div class="dm-stamp" aria-hidden="true">${ICONS.selo(64)}<span>${esc(m.reward?.label || "Selo")}</span></div>
      <p><strong>Caso resolvido!</strong> Observaste a imagem, encontraste pistas e descobriste novas informações. Mas a história de Milreu está longe de terminar…</p>
      <p class="dm-score-final">${r.score} <span>/ ${maxScore(m)} pontos</span>${best > r.score ? ` <small>· melhor: ${best}</small>` : ""}</p>
      <ul class="dm-ficha">${ficha}</ul>
      ${levelUp ? `<p class="dm-levelup">${ICONS.selo(22)} Subiste de nível: <strong>${esc(after.current.name)}</strong>!</p>` : `<p class="dm-note">Nível: ${esc(after.current.name)}</p>`}
      <p class="dm-note">${esc(m.reward?.label || "Selo")} acrescentado ao Caderno de Campo.</p>`,
      `${next ? `<button type="button" class="dm-btn dm-btn--primary" data-act="play" data-mission="${next.missionId}">Próxima missão</button>` : `<button type="button" class="dm-btn dm-btn--primary" data-act="board">Ver missões</button>`}
       <button type="button" class="dm-btn" data-act="notebook">${ICONS.caderno(20)} Ver as minhas descobertas</button>
       <button type="button" class="dm-btn" data-act="play" data-mission="${m.missionId}">Jogar novamente</button>`, "dm-dialog__card--done");
  }

  function notebookBody() {
    const done = completedIds(), level = levelFor(done.length);
    const nextGoal = level.next && !level.next.future ? level.next : null;
    const pct = nextGoal ? Math.round((done.length / nextGoal.minMissions) * 100) : 100;
    const fichas = valid.map(m => {
      const entry = S.progress.completed[m.missionId];
      if (!entry) return `<article class="dm-ficha-card is-empty"><p class="dm-eyebrow">Missão ${String(m.order).padStart(2, "0")}</p><h3>${esc(m.title)}</h3><p>Ainda por investigar.</p></article>`;
      const found = m.hotspots.filter(spot => entry.found.includes(spot.id));
      return `<article class="dm-ficha-card">
        <div class="dm-ficha-card__img"><img src="${assetUrl(m.image.src)}" alt="" loading="lazy"><span class="dm-ficha-card__stamp">${ICONS.selo(34)}</span></div>
        <p class="dm-eyebrow">Missão ${String(m.order).padStart(2, "0")} · ${entry.bestScore}/${maxScore(m)} pontos</p>
        <h3>${esc(m.title)}</h3>
        <ul>${found.map(spot => `<li><strong>${esc(spot.title)}.</strong> ${esc(spot.discovery.text)}</li>`).join("")}</ul>
        <p class="dm-ficha-card__credit">${esc(m.image.credit)} · ${esc(m.image.provenance)}</p>
        <button type="button" class="dm-btn" data-act="play" data-mission="${m.missionId}">Jogar novamente</button>
      </article>`;
    }).join("");
    return `<div class="dm-level"><p>Nível: <strong>${esc(level.current.name)}</strong></p>
      ${nextGoal ? `<div class="dm-level__bar" role="progressbar" aria-valuemin="0" aria-valuemax="${nextGoal.minMissions}" aria-valuenow="${done.length}" aria-label="Progresso para ${esc(nextGoal.name)}"><span data-dm-pct="${pct}"></span></div><p class="dm-note">${done.length} de ${nextGoal.minMissions} missões para chegares a ${esc(nextGoal.name)}.</p>` : `<p class="dm-note">Próximos níveis (Investigador, Guardião da Memória) chegam com novas missões.</p>`}</div>
      <div class="dm-notebook__grid">${fichas}</div>
      <div class="dm-clear">${S.confirmClear
        ? `<p>Apagar todo o progresso guardado neste browser?</p><button type="button" class="dm-btn dm-btn--danger" data-act="clear-confirm">Sim, apagar</button> <button type="button" class="dm-btn" data-act="clear-cancel">Cancelar</button>`
        : `<button type="button" class="dm-btn dm-btn--quiet" data-act="clear">Apagar o meu progresso</button>`}</div>`;
  }

  function notebookHtml() {
    return `<section class="dm-notebook" aria-labelledby="dm-nb-title">
      <div class="dm-board__head"><div>${labNotice}<h1 id="dm-nb-title">${ICONS.caderno(30)} Caderno de Campo</h1><p>As tuas descobertas ficam guardadas só neste browser.</p></div>
      <div class="dm-actions"><button type="button" class="dm-btn dm-btn--primary" data-act="board">Missões</button><button type="button" class="dm-btn" data-act="intro">${ICONS.voltar(18)} Início</button></div></div>
      ${notebookBody()}
    </section>`;
  }

  function errorHtml() {
    return `<section class="dm-error" role="alert"><h1>Não foi possível abrir esta investigação</h1><p>${esc(S.error?.message || "Erro desconhecido.")}</p>
      <div class="dm-actions">${S.error?.retry ? `<button type="button" class="dm-btn dm-btn--primary" data-act="retry">Tentar de novo</button>` : ""}<button type="button" class="dm-btn" data-act="board">Ver missões</button><a class="dm-link" href="#/museu">Voltar ao Museu de Memórias</a></div></section>`;
  }

  // ───────────────────────── render ─────────────────────────
  function render() {
    const screens = { intro: introHtml, board: boardHtml, play: playHtml, notebook: notebookHtml, error: errorHtml };
    const dialogs = { howto: howtoHtml, discovery: discoveryHtml, paused: pausedHtml, completed: completedHtml, notebook: () => dialogHtml("dm-nbo", `${ICONS.caderno(26)} Caderno de Campo`, notebookBody(), `<button type="button" class="dm-btn dm-btn--primary" data-act="close-dialog">Voltar à investigação</button>`, "dm-dialog__card--wide") };
    root.dataset.dmState = S.dialog === "paused" ? "paused" : S.dialog === "discovery" ? "discovery" : S.dialog === "completed" ? "completed" : S.screen === "play" ? (S.mission?.kind === "tutorial" ? "tutorial" : "mission") : S.screen;
    root.classList.toggle("dm--playing", S.screen === "play");
    root.innerHTML = `<div class="dm-live dm-sr" data-dm-live aria-live="polite"></div>${screens[S.screen]()}${S.dialog ? dialogs[S.dialog]() : ""}`;
    root.querySelectorAll("[data-dm-pct]").forEach(el => { el.style.width = `${el.dataset.dmPct}%`; });
    if (S.screen === "play") setupStage();
    if (S.dialog) {
      root.querySelector(".dm-play")?.setAttribute("inert", "");
      (root.querySelector("[data-dm-dialog] .dm-btn--primary") || root.querySelector("[data-dm-dialog] button"))?.focus();
    }
  }

  // ───────────────────────── palco: proporção, zoom, deslocação, toque ─────────────────────────
  let stage, canvas, base = { w: 0, h: 0, left: 0, top: 0 };
  function setupStage() {
    stage = root.querySelector("[data-dm-stage]"); canvas = root.querySelector("[data-dm-canvas]");
    const img = root.querySelector("[data-dm-image]");
    img.addEventListener("error", () => { S.error = { message: "A imagem desta missão não carregou. Verifica a ligação e tenta de novo.", retry: true }; S.screen = "error"; render(); }, { once: true });
    fit(); drawMarks(); drawCursor();
    resizeObserver?.disconnect();
    if (typeof ResizeObserver === "function") { resizeObserver = new ResizeObserver(() => { fit(); }); resizeObserver.observe(stage); }
    bindStage();
  }

  function fit() {
    if (!stage) return;
    const { image } = S.mission;
    // Ecrãs estreitos: o palco toma a proporção da imagem (sem faixas vazias); o painel fica com o resto.
    const narrow = typeof matchMedia === "function" && matchMedia("(max-width: 60rem)").matches;
    stage.style.aspectRatio = narrow ? `${image.width} / ${image.height}` : "";
    const sw = stage.clientWidth, sh = stage.clientHeight, aspect = image.width / image.height;
    const w = sw / sh > aspect ? sh * aspect : sw, h = w / aspect;
    base = { w, h, left: (sw - w) / 2, top: (sh - h) / 2 };
    canvas.style.width = `${w}px`; canvas.style.height = `${h}px`; canvas.style.left = `${base.left}px`; canvas.style.top = `${base.top}px`;
    clampPan(); applyTransform();
  }

  function clampPan() {
    const z = S.zoom;
    z.x = Math.min(0, Math.max(base.w - base.w * z.s, z.x));
    z.y = Math.min(0, Math.max(base.h - base.h * z.s, z.y));
    if (z.s === 1) { z.x = 0; z.y = 0; }
  }
  function applyTransform() { if (canvas) canvas.style.transform = `translate(${S.zoom.x}px, ${S.zoom.y}px) scale(${S.zoom.s})`; }

  // (px, py) em coordenadas do canvas não ampliado; mantém esse ponto fixo no ecrã.
  function zoomAt(factor, px = base.w / 2, py = base.h / 2) {
    const z = S.zoom, s = Math.min(4, Math.max(1, z.s * factor));
    const wx = (px - z.x) / z.s, wy = (py - z.y) / z.s;
    z.x = px - wx * s; z.y = py - wy * s; z.s = s;
    clampPan(); applyTransform();
    if (s > 1) step("zoom");
  }

  function toNormalized(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    return { x: (clientX - rect.left) / rect.width, y: (clientY - rect.top) / rect.height };
  }

  function bindStage() {
    const pointers = new Map();
    let gesture = null;
    stage.addEventListener("pointerdown", event => {
      if (event.target.closest(".dm-zoom")) return;
      stage.setPointerCapture?.(event.pointerId);
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (pointers.size === 1) gesture = { type: "tap", startX: event.clientX, startY: event.clientY, x0: S.zoom.x, y0: S.zoom.y, t: Date.now() };
      if (pointers.size === 2) { const [a, b] = [...pointers.values()]; gesture = { type: "pinch", d0: Math.hypot(a.x - b.x, a.y - b.y), s0: S.zoom.s }; }
    });
    stage.addEventListener("pointermove", event => {
      if (!pointers.has(event.pointerId) || !gesture) return;
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (gesture.type === "pinch" && pointers.size === 2) {
        const [a, b] = [...pointers.values()], rect = stage.getBoundingClientRect();
        const mid = { x: (a.x + b.x) / 2 - rect.left - base.left, y: (a.y + b.y) / 2 - rect.top - base.top };
        zoomAt((gesture.s0 * Math.hypot(a.x - b.x, a.y - b.y) / gesture.d0) / S.zoom.s, mid.x, mid.y);
        return;
      }
      const dx = event.clientX - gesture.startX, dy = event.clientY - gesture.startY;
      if (gesture.type === "tap" && Math.hypot(dx, dy) > 8) gesture.type = "pan";
      if (gesture.type === "pan" && S.zoom.s > 1) { S.zoom.x = gesture.x0 + dx; S.zoom.y = gesture.y0 + dy; clampPan(); applyTransform(); }
    });
    const end = event => {
      if (!pointers.has(event.pointerId)) return;
      pointers.delete(event.pointerId);
      if (gesture?.type === "tap" && pointers.size === 0 && Date.now() - gesture.t < 800) investigate(toNormalized(event.clientX, event.clientY), "pointer");
      if (pointers.size === 0) gesture = null;
    };
    stage.addEventListener("pointerup", end);
    stage.addEventListener("pointercancel", event => { pointers.delete(event.pointerId); gesture = null; });
    stage.addEventListener("wheel", event => {
      event.preventDefault();
      const rect = stage.getBoundingClientRect();
      zoomAt(event.deltaY < 0 ? 1.15 : 1 / 1.15, event.clientX - rect.left - base.left, event.clientY - rect.top - base.top);
    }, { passive: false });
    stage.addEventListener("keydown", event => {
      const big = event.shiftKey ? 0.01 : 0.03, c = S.cursor;
      const moves = { ArrowLeft: [-big, 0], ArrowRight: [big, 0], ArrowUp: [0, -big], ArrowDown: [0, big] };
      if (moves[event.key]) {
        event.preventDefault();
        c.x = Math.min(1, Math.max(0, c.x + moves[event.key][0])); c.y = Math.min(0.95, Math.max(0, c.y + moves[event.key][1]));
        stage.classList.add("is-keyboard"); drawCursor(); followCursor(); return;
      }
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); stage.classList.add("is-keyboard"); investigate({ ...c }, "keyboard"); return; }
      if (event.key === "+" || event.key === "=") { event.preventDefault(); zoomAt(1.25, c.x * base.w * S.zoom.s + S.zoom.x, c.y * base.h * S.zoom.s + S.zoom.y); }
      if (event.key === "-") { event.preventDefault(); zoomAt(1 / 1.25); }
      if (event.key === "0") { event.preventDefault(); S.zoom = { s: 1, x: 0, y: 0 }; applyTransform(); }
    });
    stage.addEventListener("pointerdown", () => stage.classList.remove("is-keyboard"));
  }

  // Quando ampliado, desloca a imagem para manter a lupa do teclado visível.
  function followCursor() {
    const z = S.zoom; if (z.s === 1) return;
    const cx = S.cursor.x * base.w * z.s + z.x, cy = S.cursor.y * base.h * z.s + z.y, m = 40;
    if (cx < m) z.x += m - cx; if (cx > base.w - m) z.x -= cx - (base.w - m);
    if (cy < m) z.y += m - cy; if (cy > base.h - m) z.y -= cy - (base.h - m);
    clampPan(); applyTransform();
  }

  function drawCursor() {
    const el = root.querySelector("[data-dm-cursor]");
    if (el) { el.style.left = `${S.cursor.x * 100}%`; el.style.top = `${S.cursor.y * 100}%`; }
  }

  function drawMarks(newId) {
    const layer = root.querySelector("[data-dm-marks]"); if (!layer) return;
    layer.innerHTML = S.mission.hotspots.filter(spot => S.run.found.includes(spot.id)).map(spot => {
      const index = S.mission.hotspots.indexOf(spot) + 1;
      return `<span class="dm-mark ${spot.id === newId && !reduceMotion() ? "is-new" : ""}" data-mark="${spot.id}" title="${esc(spot.title)}"><span>${index}</span></span>`;
    }).join("");
    layer.querySelectorAll("[data-mark]").forEach(el => {
      const c = shapeCenter(S.mission.hotspots.find(spot => spot.id === el.dataset.mark).shape);
      el.style.left = `${c.x * 100}%`; el.style.top = `${c.y * 100}%`;
    });
  }

  function ripple(point) {
    const layer = root.querySelector("[data-dm-marks]"); if (!layer || reduceMotion()) return;
    const el = document.createElement("span");
    el.className = "dm-ripple"; el.style.left = `${point.x * 100}%`; el.style.top = `${point.y * 100}%`;
    layer.appendChild(el); later(() => el.remove(), 700);
  }

  function showHintZone(spot) {
    const el = root.querySelector("[data-dm-hintzone]"); if (!el || !spot.hintArea) return;
    const a = spot.hintArea, aspect = S.mission.image.width / S.mission.image.height;
    el.style.left = `${(a.cx - a.r) * 100}%`; el.style.top = `${(a.cy - a.r * aspect) * 100}%`;
    el.style.width = `${a.r * 2 * 100}%`; el.style.height = `${a.r * 2 * aspect * 100}%`;
    el.hidden = false; el.classList.remove("is-on"); void el.offsetWidth; el.classList.add("is-on");
    later(() => { el.hidden = true; }, 6000);
  }

  // ───────────────────────── jogo ─────────────────────────
  function step(id) {
    if (!S.run || S.runDone || S.mission?.kind !== "tutorial" || S.run.steps.includes(id)) return;
    S.run = markStep(S.run, id); persistRun();
    if (S.screen === "play" && !S.dialog) refreshSide();
    maybeComplete();
  }

  function persistRun() { if (!S.run || S.runDone) return; S.progress = { ...S.progress, current: { ...S.run } }; save(); }

  function investigate(point, via) {
    if (S.dialog || !S.run || S.runDone) return;
    const rect = canvas.getBoundingClientRect();
    const tol = via === "pointer" ? touchTolerance(S.mission.image, rect.width) : touchTolerance(S.mission.image, rect.width, 6);
    const outcome = registerTap(S.run, S.mission, point, tol);
    S.run = outcome.run;
    if (outcome.result === "found") {
      chime("found");
      if (S.mission.kind === "tutorial") S.run = markStep(S.run, "tap");
      persistRun(); drawMarks(outcome.hotspot.id);
      S.selected = null;
      S.discovery = { hotspot: outcome.hotspot, points: outcome.points, index: S.run.found.length };
      returnFocus = via === "keyboard" ? "stage" : null;
      later(() => { S.dialog = "discovery"; render(); }, reduceMotion() ? 0 : 450);
      updateBar();
    } else if (outcome.result === "already") {
      announce(`Já encontraste: ${outcome.hotspot.title}.`);
    } else {
      ripple(point); chime("miss"); persistRun();
      if (outcome.suggestHelp) toast("Nem todas as pistas são fáceis de encontrar! Experimenta ampliar a imagem ou observar outra parte da imagem.");
      else announce("Aqui não há pista. Continua a procurar.");
    }
  }

  function toast(message) {
    const old = root.querySelector(".dm-toast"); old?.remove();
    const el = document.createElement("p");
    el.className = "dm-toast"; el.setAttribute("role", "status"); el.textContent = message;
    root.querySelector(".dm-play")?.appendChild(el);
    later(() => el.remove(), 6000);
  }

  function updateBar() {
    root.querySelector("[data-dm-progress] span")?.replaceChildren(`${S.run.found.length}/${S.mission.hotspots.length}`);
    root.querySelector("[data-dm-score] span")?.replaceChildren(String(S.run.score));
  }

  function refreshSide() {
    // Re-render só do painel lateral (mantém zoom e posição da imagem).
    const tmp = document.createElement("div"); tmp.innerHTML = playHtml();
    const fresh = tmp.querySelector(".dm-side"), current = root.querySelector(".dm-side");
    const openDetails = current?.querySelector("details")?.open;
    if (fresh && current) { current.replaceWith(fresh); if (openDetails) fresh.querySelector("details").open = true; }
    updateBar();
  }

  function maybeComplete() {
    if (!S.run || S.runDone || !isComplete(S.run, S.mission) || S.dialog) return false;
    const before = levelFor(completedIds().length);
    S.progress = recordCompletion(S.progress, S.run); save();
    const after = levelFor(completedIds().length);
    S.completion = { mission: S.mission, run: S.run, before, after, best: S.progress.completed[S.mission.missionId].bestScore };
    S.runDone = true; // a missão concluída deixa de estar «em curso» (não volta a ser guardada)
    chime("complete");
    root.querySelector("[data-dm-canvas]")?.classList.add("is-solved");
    later(() => { S.dialog = "completed"; render(); }, reduceMotion() ? 0 : 600);
    return true;
  }

  function startMission(id) {
    const m = missionById(id);
    if (!m) { S.error = { message: `A missão «${id}» não existe ou tem dados inválidos.` }; S.screen = "error"; S.dialog = null; render(); return; }
    if (!unlocked().includes(id)) { S.notice = `«${m.title}» abre depois de concluíres a missão anterior.`; S.screen = "board"; S.dialog = null; render(); return; }
    S.mission = m; S.notice = "";
    const saved = S.progress.current?.missionId === id ? S.progress.current : null;
    S.run = saved ? { ...saved, status: "mission" } : createRun(m);
    S.zoom = { s: 1, x: 0, y: 0 }; S.cursor = { x: 0.5, y: 0.5 }; S.selected = null; S.dialog = null; S.screen = "play"; S.runDone = false;
    persistRun(); render();
    announce(`${m.title}. ${m.hotspots.length} pistas por encontrar.`);
  }

  function goStart() {
    const current = S.progress.current && missionById(S.progress.current.missionId);
    if (current) return startMission(current.missionId);
    if (!S.progress.completed["aprende-a-investigar"] && missionById("aprende-a-investigar")) return startMission("aprende-a-investigar");
    S.screen = "board"; S.dialog = null; render();
  }

  function closeDialog() {
    const was = S.dialog;
    S.dialog = null; render();
    if (S.screen === "play") {
      if (was === "discovery") { step("read"); if (!maybeComplete()) { root.querySelector(returnFocus === "stage" ? "[data-dm-stage]" : "[data-act='hint']")?.focus({ preventScroll: true }); pendingHelp(); } }
      else root.querySelector("[data-dm-stage]")?.focus({ preventScroll: true });
    }
  }

  function pendingHelp() {
    if (S.mission?.kind !== "tutorial") return;
    const pending = pendingTutorialSteps(S.run);
    if (S.run.found.length === S.mission.hotspots.length && pending.length) toast(`Encontraste todas as pistas! Para terminar o treino falta: ${pending.map(step => step.label.toLowerCase()).join("; ")}.`);
  }

  // ───────────────────────── acções ─────────────────────────
  const actions = {
    start: goStart,
    howto: () => { S.dialog = "howto"; render(); },
    "close-dialog": () => { const fromNotebook = S.dialog === "notebook"; closeDialog(); if (fromNotebook) step("notebook"); },
    intro: () => { S.screen = "intro"; S.dialog = null; render(); },
    board: () => { S.screen = "board"; S.dialog = null; persistRun(); render(); },
    notebook: () => { S.screen = "notebook"; S.dialog = null; S.confirmClear = false; render(); },
    "notebook-overlay": () => { S.dialog = "notebook"; S.confirmClear = false; render(); },
    play: el => startMission(el.dataset.mission),
    pause: () => { S.dialog = "paused"; render(); },
    resume: () => closeDialog(),
    continue: () => closeDialog(),
    retry: () => (S.mission ? startMission(S.mission.missionId) : goStart()),
    sound: () => { S.progress = { ...S.progress, prefs: { ...S.progress.prefs, sound: !S.progress.prefs.sound } }; save(); refreshBarSound(); chime("found"); },
    "zoom-in": () => zoomAt(1.4),
    "zoom-out": () => zoomAt(1 / 1.4),
    "zoom-reset": () => { S.zoom = { s: 1, x: 0, y: 0 }; applyTransform(); },
    "select-clue": el => { S.selected = S.selected === el.dataset.clue ? null : el.dataset.clue; refreshSide(); root.querySelector(`[data-clue="${el.dataset.clue}"]`)?.focus(); },
    hint: () => {
      if (!S.run || S.runDone) return;
      const { run, hotspot, level } = applyHint(S.run, S.mission, S.selected);
      if (!hotspot) return;
      S.run = run; persistRun(); step("hint");
      S.selected = hotspot.id; refreshSide();
      if (level >= 2) { showHintZone(hotspot); toast(`Ajuda visual: a pista «${hotspot.clue}» está na zona destacada. Agora toca no sítio exacto.`); }
      else toast(`Dica: ${hotspot.hint}`);
    },
    zone: el => {
      const zone = S.mission.zones.find(z => z.id === el.dataset.zone);
      if (zone) { S.cursor = { x: zone.x, y: zone.y }; drawCursor(); investigate({ x: zone.x, y: zone.y }, "zone"); }
    },
    clear: () => { S.confirmClear = true; render(); root.querySelector("[data-act='clear-cancel']")?.focus(); },
    "clear-cancel": () => { S.confirmClear = false; render(); },
    "clear-confirm": () => { S.progress = clearProgress(storage); S.run = null; S.confirmClear = false; S.screen = "intro"; S.dialog = null; render(); announce("Progresso apagado."); }
  };

  function refreshBarSound() {
    const btn = root.querySelector("[data-act='sound']"); if (!btn) return;
    btn.setAttribute("aria-pressed", String(S.progress.prefs.sound));
    btn.setAttribute("aria-label", `Efeitos sonoros ${S.progress.prefs.sound ? "ligados" : "desligados"}`);
    btn.innerHTML = S.progress.prefs.sound ? ICONS.som(22) : ICONS.semSom(22);
  }

  const onClick = event => {
    const el = event.target.closest("[data-act]");
    if (!el || !root.contains(el) || el.disabled) return;
    const fn = actions[el.dataset.act];
    if (fn) { event.preventDefault(); fn(el); }
  };
  const onKey = event => {
    const dialog = root.querySelector("[data-dm-dialog]");
    if (!dialog) return;
    if (event.key === "Escape") { event.preventDefault(); closeDialog(); return; }
    if (event.key !== "Tab") return;
    const items = [...dialog.querySelectorAll("button:not([disabled]),a[href]")];
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (!dialog.contains(document.activeElement)) { event.preventDefault(); first.focus(); }
    else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };
  root.addEventListener("click", onClick);
  document.addEventListener("keydown", onKey);

  // Entrada: erro de catálogo, ligação directa a uma missão, ou introdução.
  if (!valid.length) { S.screen = "error"; S.error = { message: "O catálogo de missões está vazio ou tem dados inválidos." }; render(); }
  else if (query.missao) { const target = valid.find(m => m.missionId === query.missao); if (target) startMission(target.missionId); else { S.screen = "error"; S.error = { message: `A missão «${query.missao}» não existe.` }; render(); } }
  else render();

  return {
    state: S,
    destroy() {
      root.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
      resizeObserver?.disconnect();
      timers.forEach(clearTimeout); timers.clear();
      try { audio?.close(); } catch { /* */ }
      persistRun();
    }
  };
}

export const POINTS_TABLE = POINTS_BY_HINT;
