/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Detetives da Memória — interface (laboratório, versão de teste; NÃO publicada em produção).
 * Missões com FOTOGRAFIAS REAIS do Museu de Memórias (imagem, crédito e data vêm da ficha canónica).
 * Ecrãs: entrada → fotografias → investigação → álbum. Descobertas em camadas (observação,
 * investigação opcional, história) e colecção (selo + página do álbum). Recompensas imediatas e
 * discretas, sem sorte, sem contagens decrescentes, sem penalização e sem mensagens de fracasso.
 * O palco mantém a proporção da imagem: as pistas usam coordenadas normalizadas e continuam alinhadas
 * com zoom, deslocação e qualquer ecrã. Alternativas ao toque: teclado (cursor-lupa) e zonas descritas.
 */
import {
  validateMission, registerTap, answerQuestion, applyHint, markStep, isComplete, pendingTutorialSteps, createRun,
  touchTolerance, shapeCenter, levelFor, unlockedMissions, maxScore, tasksOf, requiredTasks, remainingTasks,
  TUTORIAL_STEPS, POINTS_BY_HINT, LAYERS
} from "./engine.js";
import { loadProgress, saveProgress, clearProgress, recordCompletion, bumpMetric } from "./storage.js";
import { ICONS } from "./icons.js";

const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
const now = () => (typeof performance !== "undefined" ? performance.now() : Date.now());
const CERTAINTY_LABEL = { confirmed: "Confirmado", probable: "Provável", hypothesis: "Hipótese" };
const LAYER_ORDER = ["observacao", "investigacao", "historia"];

const OPENING = [
  "Há fotografias que guardam muito mais do que imagens.",
  "Guardam lugares, pessoas, acontecimentos e pequenas histórias que o tempo pode fazer esquecer.",
  "Em Milreu, cada fotografia é uma oportunidade para descobrir algo novo.",
  "Prepara a tua lupa. A próxima descoberta pode estar mesmo à tua frente!"
];

export function createDetetivesGame({ root, missions: resolved = [], blocked = [], assetUrl, lang = "pt-PT", query = {}, storage }) {
  const valid = [], invalid = [];
  for (const mission of resolved) {
    const check = validateMission(mission);
    (check.ok ? valid : invalid).push(check.ok ? mission : { mission, errors: check.errors });
  }
  valid.sort((a, b) => a.order - b.order);

  const S = {
    screen: "intro", progress: loadProgress(storage), mission: null, run: null, runDone: false,
    zoom: { s: 1, x: 0, y: 0 }, cursor: { x: 0.5, y: 0.5 }, selected: null, dialog: null,
    question: null, questionNote: "", completion: null, error: null, confirmClear: false, notice: "",
    albumPage: 0, startedAt: 0, firstFound: false
  };
  const timers = new Set();
  const later = (fn, ms) => { const id = setTimeout(() => { timers.delete(id); fn(); }, ms); timers.add(id); return id; };
  let audio = null, resizeObserver = null;

  const missionById = id => valid.find(m => m.missionId === id) || null;
  const completedIds = () => Object.keys(S.progress.completed).filter(id => missionById(id));
  const unlocked = () => unlockedMissions(valid, completedIds());
  const save = () => saveProgress(S.progress, storage);
  const metric = (key, value) => { S.progress = bumpMetric(S.progress, key, value); save(); };
  const calm = () => S.progress.prefs.calm === true || (typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches);
  const taskById = id => tasksOf(S.mission).find(t => t.id === id);
  const certaintyText = c => (c ? CERTAINTY_LABEL[c] || c : "Não aplicável");

  // ───────────────────────── som opcional (desligado por omissão): papel e pequenos sinos ─────────────────────────
  function sound(kind) {
    if (!S.progress.prefs.sound) return;
    try {
      audio = audio || new (globalThis.AudioContext || globalThis.webkitAudioContext)();
      if (kind === "paper") {
        const len = Math.floor(audio.sampleRate * 0.12), buffer = audio.createBuffer(1, len, audio.sampleRate), data = buffer.getChannelData(0);
        for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len) * 0.4;
        const src = audio.createBufferSource(), filter = audio.createBiquadFilter(), gain = audio.createGain();
        filter.type = "bandpass"; filter.frequency.value = 2400; gain.gain.value = 0.18;
        src.buffer = buffer; src.connect(filter).connect(gain).connect(audio.destination); src.start();
        return;
      }
      const notes = kind === "complete" ? [784, 988, 1175, 1568] : [1175, 1568];
      notes.forEach((freq, i) => {
        const osc = audio.createOscillator(), gain = audio.createGain();
        osc.type = "sine"; osc.frequency.value = freq;
        const t = audio.currentTime + i * 0.09;
        gain.gain.setValueAtTime(0.0001, t); gain.gain.exponentialRampToValueAtTime(0.09, t + 0.01); gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
        osc.connect(gain).connect(audio.destination); osc.start(t); osc.stop(t + 0.65);
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
  const img = (src, alt = "", cls = "") => `<img src="${assetUrl(src)}" alt="${esc(alt)}" ${cls ? `class="${cls}"` : ""} loading="lazy" decoding="async">`;
  const museumLink = (id, label = "Ver a ficha no Museu") => `<a class="dm-link" href="#/museu/memorias/${esc(id)}">${ICONS.voltar(16)} ${esc(label)} (${esc(id)})</a>`;

  function introHtml() {
    const current = S.progress.current && missionById(S.progress.current.missionId);
    const primary = current ? "Continuar a investigação" : completedIds().length ? "Escolher uma fotografia" : "Começar a investigar";
    const thumbs = valid.slice(0, 3).map((m, i) => `<figure class="dm-intro__card dm-intro__card--${i}">${img(m.image.src)}<figcaption>${esc(m.image.memoryRef)}</figcaption></figure>`).join("");
    return `<section class="dm-intro" aria-labelledby="dm-title">
      <div class="dm-intro__copy">
        ${labNotice}
        <span class="dm-intro__lens">${ICONS.lupa(56)}</span>
        <h1 id="dm-title" class="dm-intro__title">Detetives da Memória</h1>
        <p class="dm-intro__subtitle">Cada fotografia guarda uma história. Consegues descobri-la?</p>
        <div class="dm-intro__text">${OPENING.map(line => `<p>${esc(line)}</p>`).join("")}</div>
        <p class="dm-note">As fotografias deste jogo pertencem ao acervo do Museu de Memórias de Milreu e foram cedidas por pessoas da comunidade.</p>
        ${langNotice}
        ${current ? `<p class="dm-note">Investigação em curso: <strong>${esc(current.title)}</strong> (${S.progress.current.found.length}/${tasksOf(current).length} descobertas).</p>` : ""}
        <div class="dm-actions">
          <button type="button" class="dm-btn dm-btn--primary" data-act="start">${ICONS.lupa(22)} ${primary}</button>
          <button type="button" class="dm-btn" data-act="howto">Como jogar</button>
          ${completedIds().length ? `<button type="button" class="dm-btn" data-act="album">${ICONS.caderno(20)} O meu álbum</button>` : ""}
        </div>
        <a class="dm-link" href="#/museu">${ICONS.voltar(18)} Voltar ao Museu de Memórias</a>
      </div>
      <div class="dm-intro__art" aria-hidden="true">${thumbs}</div>
    </section>`;
  }

  function howtoHtml() {
    return dialogHtml("dm-howto", "Como jogar", `
      <ol class="dm-steps">
        <li><strong>Observa</strong> a fotografia com calma. Não há tempo limite e errar não tira pontos.</li>
        <li><strong>Toca ou clica</strong> no sítio da fotografia que corresponde a cada pista. Algumas descobertas são perguntas: comparar fotografias, ampliar um pormenor ou ler um testemunho.</li>
        <li><strong>Amplia</strong> com + e −, com a roda do rato ou com dois dedos. Arrasta para te deslocares.</li>
        <li><strong>Teclado:</strong> no quadro da fotografia, as setas mexem a lupa, Enter investiga, + e − ampliam, 0 repõe.</li>
        <li><strong>Sem ver bem a imagem?</strong> Usa «Explorar por descrição».</li>
        <li><strong>Camadas:</strong> Observação e História concluem a missão; as descobertas de Investigação são extra, para quem quiser ir mais longe.</li>
        <li><strong>Ajuda:</strong> «Preciso de uma pista» dá uma dica e depois mostra uma zona. Cada descoberta vale 100 pontos, ou 75 e 50 com ajuda.</li>
        <li>O teu álbum fica guardado <strong>só neste browser</strong>. Podes apagá-lo quando quiseres.</li>
      </ol>`, `<button type="button" class="dm-btn dm-btn--primary" data-act="close-dialog">Percebi</button>`);
  }

  function boardHtml() {
    const done = completedIds(), open = unlocked();
    const level = levelFor(done.length);
    const cards = valid.map(m => {
      const isDone = done.includes(m.missionId), isOpen = open.includes(m.missionId);
      const current = S.progress.current?.missionId === m.missionId ? S.progress.current : null;
      const best = S.progress.completed[m.missionId]?.bestScore;
      const status = isDone ? `${ICONS.selo(18)} No álbum · ${best}/${maxScore(m)} pontos` : current ? `Em curso · ${current.found.length}/${tasksOf(m).length} descobertas` : isOpen ? `${tasksOf(m).length} descobertas por fazer` : `${ICONS.cadeado(18)} Abre depois da fotografia anterior`;
      const action = !isOpen ? "" : `<button type="button" class="dm-btn ${isDone ? "" : "dm-btn--primary"}" data-act="play" data-mission="${m.missionId}">${current ? "Continuar" : isDone ? "Investigar de novo" : "Investigar"}</button>`;
      return `<article class="dm-mission ${isOpen ? "" : "is-locked"} ${isDone ? "is-done" : ""}">
        <div class="dm-mission__media">${img(m.image.src)}<span class="dm-mission__id">${esc(m.image.memoryRef)}</span></div>
        <div class="dm-mission__body">
          <p class="dm-eyebrow">Fotografia ${m.order} · ${esc(m.difficulty)}${m.kind === "tutorial" ? " · com treino" : ""}</p>
          <h2>${esc(m.title)}</h2>
          <p class="dm-mission__doc">«${esc(m.image.documentTitle)}» · ${esc(m.image.date || "data por determinar")}</p>
          <p>${esc(m.description)}</p>
          <p class="dm-mission__status">${status}</p>
          ${action}
        </div>
      </article>`;
    }).join("");
    return `<section class="dm-board" aria-labelledby="dm-board-title">
      <div class="dm-board__head">
        <div>${labNotice}<h1 id="dm-board-title">Escolhe uma fotografia</h1>
        <p>Nível: <strong>${esc(level.current.name)}</strong>${level.next && !level.next.future ? ` · faltam ${level.next.minMissions - done.length} fotografias para <strong>${esc(level.next.name)}</strong>` : ""}</p></div>
        <div class="dm-actions">
          <button type="button" class="dm-btn" data-act="album">${ICONS.caderno(20)} O meu álbum</button>
          <button type="button" class="dm-btn" data-act="intro">${ICONS.voltar(18)} Início</button>
        </div>
      </div>
      ${S.notice ? `<p class="dm-note" role="status">${esc(S.notice)}</p>` : ""}
      <div class="dm-board__grid">${cards}</div>
      ${blocked.length ? `<p class="dm-note">${blocked.length} fotografia(s) indisponível(is) no jogo por falta de autorização de uso interactivo.</p>` : ""}
      ${invalid.length ? `<p class="dm-note">${invalid.length} missão(ões) ignorada(s) por dados inválidos.</p>` : ""}
    </section>`;
  }

  function progressHtml() {
    const segs = tasksOf(S.mission).map(task => `<span class="dm-seg ${S.run.found.includes(task.id) ? "is-done" : ""} ${task.optional ? "is-optional" : ""}" title="${esc(LAYERS[task.layer].label)}${task.optional ? " (extra)" : ""}"></span>`).join("");
    const req = requiredTasks(S.mission), reqDone = req.filter(t => S.run.found.includes(t.id)).length;
    return `<div class="dm-bar__progress" role="img" aria-label="${S.run.found.length} de ${tasksOf(S.mission).length} descobertas; ${reqDone} de ${req.length} para concluir" data-dm-progress><span class="dm-segs">${segs}</span><span class="dm-bar__count"><b>${reqDone}/${req.length}</b> para concluir</span></div>`;
  }

  function tasksHtml() {
    const m = S.mission, r = S.run;
    return LAYER_ORDER.map(layerId => {
      const group = tasksOf(m).filter(t => t.layer === layerId);
      if (!group.length) return "";
      const items = group.map(task => {
        const found = r.found.includes(task.id), hint = r.hints[task.id] || 0, n = tasksOf(m).indexOf(task) + 1;
        const icon = found ? ICONS.marca(20) : task.type === "question" ? "?" : n;
        const label = { compare: "Comparar fotografias", zoom: "Ampliar e responder", caption: "Ler e responder" }[task.kind] || "Responder";
        const action = task.type === "question" && !found ? `<button type="button" class="dm-btn dm-btn--small" data-act="ask" data-task="${task.id}">${label}</button>` : "";
        return `<li class="dm-clue ${found ? "is-found" : ""} ${S.selected === task.id ? "is-selected" : ""}">
          <button type="button" class="dm-clue__btn" data-act="select-clue" data-clue="${task.id}" aria-pressed="${S.selected === task.id}" ${found ? "disabled" : ""}>
            <span class="dm-clue__n">${icon}</span>
            <span><strong>${found ? esc(task.title) : esc(task.clue)}</strong>
            <span class="dm-clue__state">${found ? `Descoberta · +${r.points[task.id] ?? 0}` : task.optional ? "Extra · por descobrir" : "Por descobrir"}${!found && hint ? ` · ajuda ${hint}/2` : ""}</span>
            ${!found && hint >= 1 ? `<span class="dm-clue__hint">${ICONS.pista(16)} ${esc(task.hint)}</span>` : ""}</span>
          </button>${action}</li>`;
      }).join("");
      return `<section class="dm-layer dm-layer--${layerId}"><h3>${esc(LAYERS[layerId].label)}${layerId === "investigacao" ? " <small>(extra)</small>" : ""}</h3><ol class="dm-clues">${items}</ol></section>`;
    }).join("");
  }

  function sideHtml() {
    const m = S.mission, r = S.run;
    const steps = m.kind === "tutorial" ? `<section class="dm-coach" aria-labelledby="dm-coach-title"><h2 id="dm-coach-title">Treino</h2><ol>${TUTORIAL_STEPS.map(step => {
      const ok = r.steps.includes(step.id);
      return `<li class="${ok ? "is-done" : ""}"><span aria-hidden="true">${ok ? "✓" : "○"}</span> ${esc(step.label)} <span class="dm-sr">${ok ? "— feito" : "— por fazer"}</span></li>`;
    }).join("")}</ol></section>` : "";
    const zones = findZones(m).map(z => `<li><button type="button" class="dm-zone" data-act="zone" data-zone="${z.id}">${esc(z.label)}</button></li>`).join("");
    return `<aside class="dm-side" aria-label="Descobertas e ferramentas" data-dm-side>
          <p class="dm-opening">${esc(m.opening)}</p>
          ${steps}
          ${tasksHtml()}
          <div class="dm-tools">
            <button type="button" class="dm-btn dm-btn--primary" data-act="hint">${ICONS.pista(20)} Preciso de uma pista</button>
            <button type="button" class="dm-btn" data-act="album-overlay">${ICONS.caderno(20)} O meu álbum</button>
          </div>
          <details class="dm-describe"><summary>Explorar por descrição (alternativa ao toque)</summary>
            <p>Escolhe uma zona da fotografia para a investigar.</p><ul>${zones}</ul></details>
        </aside>`;
  }

  function playHtml() {
    const m = S.mission, r = S.run;
    return `<section class="dm-play" aria-labelledby="dm-play-title">
      <header class="dm-bar">
        <button type="button" class="dm-icon-btn" data-act="board" aria-label="Sair para as fotografias (o progresso fica guardado)">${ICONS.voltar(22)}</button>
        <div class="dm-bar__title"><p class="dm-eyebrow">${esc(m.image.memoryRef)} · ${m.kind === "tutorial" ? "com treino" : `fotografia ${m.order}`}</p><h1 id="dm-play-title">${esc(m.title)}</h1></div>
        ${progressHtml()}
        <p class="dm-bar__stat dm-bar__score" data-dm-score><span data-dm-score-value>${r.score}</span> pontos</p>
        <button type="button" class="dm-icon-btn" data-act="sound" aria-pressed="${S.progress.prefs.sound}" aria-label="Sons ${S.progress.prefs.sound ? "ligados" : "desligados"}">${S.progress.prefs.sound ? ICONS.som(22) : ICONS.semSom(22)}</button>
        <button type="button" class="dm-icon-btn" data-act="pause" aria-label="Pausa e definições">${ICONS.pausa(22)}</button>
      </header>
      <div class="dm-play__body">
        <div class="dm-stagewrap">
          <div class="dm-stage" data-dm-stage tabindex="0" role="group" aria-roledescription="fotografia para investigar" aria-label="${esc(m.image.alt)} Usa as setas para mexer a lupa e Enter para investigar." aria-describedby="dm-stage-help">
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
            <div class="dm-found-card" data-dm-found-card role="status" hidden></div>
          </div>
          <p id="dm-stage-help" class="dm-caption"><strong>«${esc(m.image.documentTitle)}»</strong> · ${esc(m.image.date || "")} · ${esc(m.image.credit)} · <a href="#/museu/memorias/${esc(m.image.memoryRef)}">${esc(m.image.memoryRef)}</a></p>
        </div>
        ${sideHtml()}
      </div>
    </section>`;
  }

  // Zonas descritas: as pistas (descrição visual confirmada) + dois pontos neutros (distractores).
  function findZones(m) {
    const spots = tasksOf(m).filter(t => t.type === "find").map(t => ({ id: t.id, label: t.visualCheck || t.title, ...shapeCenter(t.shape) }));
    const neutral = [{ id: "z-cima-esq", label: "Canto superior esquerdo da fotografia", x: 0.12, y: 0.12 }, { id: "z-baixo-dir", label: "Canto inferior direito da fotografia", x: 0.88, y: 0.92 }];
    return [...spots, ...neutral].sort((a, b) => a.y - b.y || a.x - b.x);
  }

  function dialogHtml(id, title, body, actions, extraClass = "") {
    return `<div class="dm-dialog" data-dm-dialog><div class="dm-dialog__card ${extraClass}" role="dialog" aria-modal="true" aria-labelledby="${id}-t">
      <h2 id="${id}-t">${title}</h2>${body}<div class="dm-actions">${actions}</div></div></div>`;
  }

  function questionHtml() {
    const task = taskById(S.question);
    const compare = task.compare ? `<figure class="dm-compare">${img(task.compare.src, `${task.compare.title} (${task.compare.id})`)}<figcaption><strong>«${esc(task.compare.title)}»</strong> · ${esc(task.compare.id)}<br><span>${esc(task.compare.credit || "")}</span></figcaption></figure>` : "";
    const zoom = task.zoomArea ? `<div class="dm-zoombox" data-dm-zoombox>${img(S.mission.image.src, "Pormenor ampliado da fotografia")}</div>` : "";
    const opts = task.options.map(o => `<button type="button" class="dm-option" data-act="answer" data-option="${o.id}">${esc(o.text)}</button>`).join("");
    return dialogHtml("dm-q", esc(task.title), `
      <p class="dm-eyebrow">${esc(LAYERS[task.layer].label)}${task.optional ? " · extra" : ""}</p>
      ${compare}${zoom}
      <p>${esc(task.prompt)}</p>
      <div class="dm-options" role="group" aria-label="Respostas">${opts}</div>
      <p class="dm-qnote" role="status" data-dm-qnote>${esc(S.questionNote)}</p>`,
      `<button type="button" class="dm-btn" data-act="close-dialog">Voltar à fotografia</button>`, "dm-dialog__card--question");
  }

  function pausedHtml() {
    return dialogHtml("dm-pause", "Pausa", `<p>O teu progresso está guardado. Podes voltar quando quiseres.</p>
      <div class="dm-prefs">
        <label class="dm-toggle"><input type="checkbox" id="dm-pref-sound" data-pref="sound" ${S.progress.prefs.sound ? "checked" : ""}> Sons delicados (papel e sinos)</label>
        <label class="dm-toggle"><input type="checkbox" id="dm-pref-calm" data-pref="calm" ${S.progress.prefs.calm ? "checked" : ""}> Modo calmo (sem animações extra)</label>
      </div>`,
      `<button type="button" class="dm-btn dm-btn--primary" data-act="resume">Retomar</button>
       <button type="button" class="dm-btn" data-act="album">${ICONS.caderno(20)} O meu álbum</button>
       <button type="button" class="dm-btn" data-act="board">Sair para as fotografias</button>`);
  }

  function completedHtml() {
    const { mission: m, run: r, before, after } = S.completion;
    const done = completedIds(), open = unlocked();
    const next = valid.find(item => item.order > m.order && open.includes(item.missionId) && !done.includes(item.missionId))
      || valid.find(item => open.includes(item.missionId) && !done.includes(item.missionId));
    const levelUp = after.current.id !== before.current.id;
    const optionalLeft = remainingTasks(r, m).filter(t => t.optional).length;
    const related = (m.related || []).map(rel => `<a class="dm-related" href="#/museu/memorias/${esc(rel.id)}">${img(rel.src)}<span><strong>«${esc(rel.title)}»</strong> ${esc(rel.id)}</span></a>`).join("");
    return dialogHtml("dm-done", "Caso resolvido!", `
      <div class="dm-reward">
        <div class="dm-stamp" aria-hidden="true">${ICONS.selo(56)}<span>${esc(m.reward?.label || "Selo")}</span></div>
        <div><p class="dm-eyebrow">Nova página no teu álbum</p><p class="dm-reward__page">«${esc(m.reward?.page || m.title)}»</p>
        <p class="dm-score-final">${r.score} <span>/ ${maxScore(m)} pontos</span></p></div>
      </div>
      <p class="dm-reward__message">${esc(m.reward?.message || "")}</p>
      ${levelUp ? `<p class="dm-levelup">${ICONS.selo(22)} Subiste de nível: <strong>${esc(after.current.name)}</strong>!</p>` : ""}
      ${related ? `<div class="dm-surprise"><p class="dm-eyebrow">Ligação a outra memória</p>${related}</div>` : ""}
      ${next ? `<div class="dm-next"><p class="dm-eyebrow">A próxima memória</p><div class="dm-next__card">${img(next.image.src, "", "dm-next__img")}<div><strong>${esc(next.title)}</strong><span>«${esc(next.image.documentTitle)}» · ${esc(next.image.memoryRef)}</span><span>${esc(next.description)}</span></div></div></div>` : `<p class="dm-note">Investigaste todas as fotografias disponíveis nesta versão.</p>`}
      <p class="dm-small">${museumLink(m.image.memoryRef, "Ver a ficha desta fotografia no Museu")}${optionalLeft ? ` <button type="button" class="dm-linkbtn" data-act="close-dialog">Continuar a explorar esta fotografia (${optionalLeft} extra)</button>` : ""}</p>`,
      `${next ? `<button type="button" class="dm-btn dm-btn--primary dm-btn--even" data-act="play" data-mission="${next.missionId}">Descobrir a próxima memória</button>` : ""}
       <button type="button" class="dm-btn ${next ? "" : "dm-btn--primary"} dm-btn--even" data-act="album" data-page="${valid.indexOf(m)}">${ICONS.caderno(20)} Voltar ao meu álbum</button>`, "dm-dialog__card--done");
  }

  // ───────────────────────── álbum vivo ─────────────────────────
  function albumPageHtml(index) {
    const m = valid[index]; if (!m) return "";
    const entry = S.progress.completed[m.missionId];
    if (!entry) return `<article class="dm-page is-empty"><p class="dm-eyebrow">Página ${index + 1} de ${valid.length}</p><h2>${esc(m.title)}</h2><div class="dm-page__ghost">${ICONS.lupa(48)}</div><p>Esta página ainda está por descobrir. Investiga a fotografia ${esc(m.image.memoryRef)} para a preencher.</p>${unlocked().includes(m.missionId) ? `<button type="button" class="dm-btn dm-btn--primary" data-act="play" data-mission="${m.missionId}">Investigar</button>` : ""}</article>`;
    const found = tasksOf(m).filter(t => entry.found.includes(t.id));
    return `<article class="dm-page">
      <p class="dm-eyebrow">Página ${index + 1} de ${valid.length} · ${esc(m.reward?.page || m.title)}</p>
      <div class="dm-page__grid">
        <figure class="dm-page__photo">${img(m.image.src, m.image.alt)}<span class="dm-page__stamp">${ICONS.selo(40)}<small>${esc(m.reward?.label || "")}</small></span>
          <figcaption>«${esc(m.image.documentTitle)}» · ${esc(m.image.date || "")}<br>${esc(m.image.credit)}</figcaption></figure>
        <div class="dm-page__text">
          <h2>${esc(m.title)}</h2>
          <p class="dm-reward__message">${esc(m.reward?.message || "")}</p>
          <ul class="dm-page__finds">${found.map(t => `<li><strong>${esc(t.title)}</strong> <span class="dm-cert dm-cert--${t.discovery.certainty}">${certaintyText(t.discovery.certainty)}</span><br>${esc(t.discovery.text)}</li>`).join("")}</ul>
          <p class="dm-small">${found.length} de ${tasksOf(m).length} descobertas · melhor pontuação ${entry.bestScore}/${maxScore(m)}</p>
          <div class="dm-page__links">${museumLink(m.image.memoryRef)}${(m.related || []).map(rel => museumLink(rel.id, `Ligação: ${rel.title}`)).join("")}</div>
          <button type="button" class="dm-btn" data-act="play" data-mission="${m.missionId}">Investigar de novo</button>
        </div>
      </div>
    </article>`;
  }

  function albumBody() {
    const done = completedIds(), level = levelFor(done.length);
    const nextGoal = level.next && !level.next.future ? level.next : null;
    const pct = nextGoal ? Math.round((done.length / nextGoal.minMissions) * 100) : 100;
    const page = Math.max(0, Math.min(S.albumPage, valid.length - 1));
    const tabs = valid.map((m, i) => `<button type="button" class="dm-tab ${i === page ? "is-current" : ""} ${S.progress.completed[m.missionId] ? "is-done" : ""}" data-act="album-page" data-page="${i}" aria-current="${i === page}">${S.progress.completed[m.missionId] ? img(m.image.src) : `<span>${ICONS.lupa(20)}</span>`}<small>${esc(m.title)}</small></button>`).join("");
    const mt = S.progress.metrics || {};
    const avg = (list, div, digits) => (list && list.length ? (list.reduce((a, b) => a + b, 0) / list.length / div).toFixed(digits) : "—");
    return `<div class="dm-level"><p>Nível: <strong>${esc(level.current.name)}</strong> · ${done.length} de ${valid.length} página(s) preenchida(s)</p>
      ${nextGoal ? `<div class="dm-level__bar" role="progressbar" aria-valuemin="0" aria-valuemax="${nextGoal.minMissions}" aria-valuenow="${done.length}" aria-label="Progresso para ${esc(nextGoal.name)}"><span data-dm-pct="${pct}"></span></div>` : ""}</div>
      <nav class="dm-album__tabs" aria-label="Páginas do álbum">${tabs}</nav>
      <div class="dm-album__book" data-dm-page>${albumPageHtml(page)}</div>
      <div class="dm-album__nav">
        <button type="button" class="dm-btn" data-act="album-page" data-page="${page - 1}" ${page <= 0 ? "disabled" : ""}>${ICONS.voltar(18)} Página anterior</button>
        <button type="button" class="dm-btn" data-act="album-page" data-page="${page + 1}" ${page >= valid.length - 1 ? "disabled" : ""}>Página seguinte</button>
      </div>
      <details class="dm-metrics"><summary>Medição local desta versão de teste</summary>
        <p class="dm-note">Guardada só neste browser e nunca enviada. Serve para avaliar o protótipo, não para medir pessoas.</p>
        <dl><dt>Fotografias iniciadas</dt><dd>${mt.missionsStarted || 0}</dd><dt>Fotografias concluídas</dt><dd>${mt.missionsCompleted || 0}</dd>
        <dt>Descobertas (das quais extra)</dt><dd>${mt.discoveries || 0} (${mt.optionalDiscoveries || 0})</dd><dt>Ajudas pedidas</dt><dd>${mt.hintsUsed || 0}</dd>
        <dt>Toques sem pista / respostas a rever</dt><dd>${mt.misses || 0} / ${mt.wrongAnswers || 0}</dd>
        <dt>Tempo médio até à 1.ª descoberta</dt><dd>${avg(mt.firstDiscoveryMs, 1000, 1)} s</dd><dt>Resposta do interface ao toque</dt><dd>${avg(mt.feedbackMs, 1, 0)} ms</dd></dl></details>
      <div class="dm-clear">${S.confirmClear
        ? `<p>Apagar o álbum e o progresso guardados neste browser?</p><button type="button" class="dm-btn dm-btn--danger" data-act="clear-confirm">Sim, apagar</button> <button type="button" class="dm-btn" data-act="clear-cancel">Cancelar</button>`
        : `<button type="button" class="dm-btn dm-btn--quiet" data-act="clear">Apagar o meu álbum</button>`}</div>`;
  }

  function albumHtml() {
    return `<section class="dm-album" aria-labelledby="dm-al-title">
      <div class="dm-board__head"><div>${labNotice}<h1 id="dm-al-title">${ICONS.caderno(30)} O meu álbum</h1><p>Uma página por fotografia investigada, com as tuas descobertas.</p></div>
      <div class="dm-actions"><button type="button" class="dm-btn dm-btn--primary" data-act="board">Fotografias</button><button type="button" class="dm-btn" data-act="intro">${ICONS.voltar(18)} Início</button></div></div>
      ${albumBody()}
    </section>`;
  }

  function errorHtml() {
    return `<section class="dm-error" role="alert"><h1>Não foi possível abrir esta investigação</h1><p>${esc(S.error?.message || "Erro desconhecido.")}</p>
      <div class="dm-actions">${S.error?.retry ? `<button type="button" class="dm-btn dm-btn--primary" data-act="retry">Tentar de novo</button>` : ""}<button type="button" class="dm-btn" data-act="board">Ver fotografias</button><a class="dm-link" href="#/museu">Voltar ao Museu de Memórias</a></div></section>`;
  }

  // ───────────────────────── render ─────────────────────────
  function render() {
    const screens = { intro: introHtml, board: boardHtml, play: playHtml, album: albumHtml, error: errorHtml };
    const dialogs = { howto: howtoHtml, question: questionHtml, paused: pausedHtml, completed: completedHtml, album: () => dialogHtml("dm-alo", `${ICONS.caderno(26)} O meu álbum`, albumBody(), `<button type="button" class="dm-btn dm-btn--primary" data-act="close-dialog">Voltar à fotografia</button>`, "dm-dialog__card--wide") };
    root.dataset.dmState = S.dialog === "paused" ? "paused" : S.dialog === "completed" ? "completed" : S.screen === "play" ? (S.mission?.kind === "tutorial" ? "tutorial" : "mission") : S.screen;
    root.classList.toggle("dm--playing", S.screen === "play");
    root.classList.toggle("dm--calm", calm());
    root.innerHTML = `<div class="dm-live dm-sr" data-dm-live aria-live="polite"></div>${screens[S.screen]()}${S.dialog ? dialogs[S.dialog]() : ""}`;
    root.querySelectorAll("[data-dm-pct]").forEach(el => { el.style.width = `${el.dataset.dmPct}%`; });
    if (S.screen === "play") setupStage();
    if (S.dialog === "question") placeZoomPreview();
    if (S.dialog) {
      root.querySelector(".dm-play")?.setAttribute("inert", "");
      // Diálogos longos (conclusão, álbum): o foco vai para o título, para a leitura começar no topo.
      const heading = ["completed", "album"].includes(S.dialog) ? root.querySelector("[data-dm-dialog] h2") : null;
      if (heading) { heading.setAttribute("tabindex", "-1"); heading.focus({ preventScroll: true }); root.querySelector(".dm-dialog__card").scrollTop = 0; }
      else (root.querySelector("[data-dm-dialog] .dm-option") || root.querySelector("[data-dm-dialog] .dm-btn--primary") || root.querySelector("[data-dm-dialog] button"))?.focus();
    }
  }

  // Pré-visualização ampliada (caixa 16:9): centra o ponto (cx, cy) da fotografia com a escala pedida.
  function placeZoomPreview() {
    const task = taskById(S.question); const box = root.querySelector("[data-dm-zoombox] img");
    if (!task?.zoomArea || !box) return;
    const { cx, cy, scale } = task.zoomArea, ratio = S.mission.image.height / S.mission.image.width;
    box.style.width = `${scale * 100}%`;
    box.style.left = `${(0.5 - cx * scale) * 100}%`;
    box.style.top = `${(0.5 - cy * scale * ratio * (16 / 9)) * 100}%`;
  }

  // ───────────────────────── palco: proporção, zoom, deslocação, toque ─────────────────────────
  let stage, canvas, base = { w: 0, h: 0, left: 0, top: 0 };
  function setupStage() {
    stage = root.querySelector("[data-dm-stage]"); canvas = root.querySelector("[data-dm-canvas]");
    const image = root.querySelector("[data-dm-image]");
    image.addEventListener("error", () => { S.error = { message: "A fotografia desta missão não carregou. Verifica a ligação e tenta de novo.", retry: true }; S.screen = "error"; render(); }, { once: true });
    fit(); drawMarks(); drawCursor();
    resizeObserver?.disconnect();
    if (typeof ResizeObserver === "function") { resizeObserver = new ResizeObserver(() => { fit(); }); resizeObserver.observe(stage); }
    bindStage();
  }

  function fit() {
    if (!stage) return;
    const { image } = S.mission;
    // Ecrãs estreitos: o palco toma a proporção da fotografia (sem faixas vazias); o painel fica com o resto.
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

  function zoomAt(factor, px = base.w / 2, py = base.h / 2) {
    const z = S.zoom, s = Math.min(5, Math.max(1, z.s * factor));
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
      if (event.target.closest(".dm-zoom,.dm-found-card")) return;
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
      if (event.target !== stage) return;
      const big = event.shiftKey ? 0.01 : 0.03, c = S.cursor;
      const moves = { ArrowLeft: [-big, 0], ArrowRight: [big, 0], ArrowUp: [0, -big], ArrowDown: [0, big] };
      if (moves[event.key]) {
        event.preventDefault();
        c.x = Math.min(1, Math.max(0, c.x + moves[event.key][0])); c.y = Math.min(1, Math.max(0, c.y + moves[event.key][1]));
        stage.classList.add("is-keyboard"); drawCursor(); followCursor(); return;
      }
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); stage.classList.add("is-keyboard"); investigate({ ...c }, "keyboard"); return; }
      if (event.key === "+" || event.key === "=") { event.preventDefault(); zoomAt(1.25, c.x * base.w * S.zoom.s + S.zoom.x, c.y * base.h * S.zoom.s + S.zoom.y); }
      if (event.key === "-") { event.preventDefault(); zoomAt(1 / 1.25); }
      if (event.key === "0") { event.preventDefault(); S.zoom = { s: 1, x: 0, y: 0 }; applyTransform(); }
    });
    stage.addEventListener("pointerdown", () => stage.classList.remove("is-keyboard"));
  }

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

  // Marca de descoberta: aparece no PONTO TOCADO (resposta imediata) ou no centro da pista (retoma).
  function drawMarks(newId, at) {
    const layer = root.querySelector("[data-dm-marks]"); if (!layer) return;
    layer.innerHTML = tasksOf(S.mission).filter(t => t.type === "find" && S.run.found.includes(t.id)).map(spot => {
      const index = tasksOf(S.mission).indexOf(spot) + 1;
      return `<span class="dm-mark ${spot.id === newId ? "is-new" : ""}" data-mark="${spot.id}" title="${esc(spot.title)}"><span>${index}</span>${spot.id === newId && !calm() ? `<i class="dm-burst" aria-hidden="true">${"<b></b>".repeat(8)}</i>` : ""}</span>`;
    }).join("");
    layer.querySelectorAll("[data-mark]").forEach(el => {
      const spot = taskById(el.dataset.mark);
      const c = el.dataset.mark === newId && at ? at : shapeCenter(spot.shape);
      el.style.left = `${c.x * 100}%`; el.style.top = `${c.y * 100}%`;
    });
  }

  function ripple(point) {
    const layer = root.querySelector("[data-dm-marks]"); if (!layer || calm()) return;
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

  // Missão em curso: guardada até ser concluída; depois, os extra entram directamente no álbum.
  function persistRun() {
    if (!S.run || S.runDone || S.run.completedOnce) return;
    S.progress = { ...S.progress, current: { ...S.run } }; save();
  }

  // Recompensas em três tempos: imediata (marca no ponto tocado, brilho, som), breve (pontos e
  // progresso animados) e educativa (cartão de descoberta que NÃO bloqueia a próxima acção).
  function rewardDiscovery(task, points, at) {
    const t0 = now();
    if (task.type === "find") drawMarks(task.id, at);
    sound("found");
    S.progress = bumpMetric(S.progress, "feedbackMs", now() - t0);
    if (!S.firstFound) { S.firstFound = true; S.progress = bumpMetric(S.progress, "firstDiscoveryMs", Date.now() - S.startedAt); }
    S.progress = bumpMetric(S.progress, "discoveries"); if (task.optional) S.progress = bumpMetric(S.progress, "optionalDiscoveries");
    save();
    animateScore(points);
    refreshSide();
    showFoundCard(task, points);
    announce(`Descoberta: ${task.title}. Mais ${points} pontos.`);
    if (S.run.completedOnce) { S.progress = recordCompletion(S.progress, S.run, new Date(), { keepCurrent: true }); save(); }
  }

  function animateScore(points) {
    const el = root.querySelector("[data-dm-score-value]"); if (!el) return;
    const target = S.run.score, from = target - points;
    const box = root.querySelector("[data-dm-score]");
    box?.classList.remove("is-bump"); void box?.offsetWidth; box?.classList.add("is-bump");
    if (calm()) { el.textContent = String(target); return; }
    const t0 = now(), dur = 500;
    const tick = () => { const k = Math.min(1, (now() - t0) / dur); el.textContent = String(Math.round(from + (target - from) * (1 - Math.pow(1 - k, 3)))); if (k < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }

  function showFoundCard(task, points) {
    const card = root.querySelector("[data-dm-found-card]"); if (!card) return;
    const memory = task.compare?.id || S.mission.image.memoryRef;
    card.innerHTML = `<p class="dm-eyebrow">${esc(LAYERS[task.layer].label)} · +${points} pontos</p>
      <h3>${esc(task.title)}</h3>
      <p>${esc(task.discovery.text)}</p>
      <p class="dm-found-card__meta"><span class="dm-cert dm-cert--${task.discovery.certainty}">${certaintyText(task.discovery.certainty)}</span> Fonte: ${esc(task.discovery.source)} · <a href="#/museu/memorias/${esc(memory)}">${esc(memory)}</a></p>
      <p class="dm-found-card__album">${ICONS.caderno(16)} Guardado no teu álbum</p>
      <button type="button" class="dm-btn dm-btn--small dm-btn--primary" data-act="ack">Continuar a investigação</button>`;
    card.hidden = false; card.classList.remove("is-in"); void card.offsetWidth; card.classList.add("is-in");
    sound("paper");
  }

  function investigate(point, via) {
    if (S.dialog || !S.run || S.runDone) return;
    const rect = canvas.getBoundingClientRect();
    const tol = via === "pointer" ? touchTolerance(S.mission.image, rect.width) : touchTolerance(S.mission.image, rect.width, 6);
    const outcome = registerTap(S.run, S.mission, point, tol);
    S.run = outcome.run;
    if (outcome.result === "found") {
      if (S.mission.kind === "tutorial") S.run = markStep(S.run, "tap");
      S.selected = null; persistRun();
      rewardDiscovery(outcome.hotspot, outcome.points, via === "pointer" ? point : null);
      if (!pendingRequired()) maybeCompleteSoon();
    } else if (outcome.result === "already") {
      announce(`Já encontraste: ${outcome.hotspot.title}.`);
    } else {
      ripple(point); persistRun(); metric("misses");
      if (outcome.suggestHelp) toast("Nem todas as pistas são fáceis de encontrar! Experimenta ampliar a fotografia ou observar outra parte da imagem.");
      else announce("Aqui ainda não há pista. Continua a observar.");
    }
  }

  const pendingRequired = () => requiredTasks(S.mission).some(t => !S.run.found.includes(t.id));
  // A celebração espera pelo cartão (~1,4 s ou ao carregar em «Continuar»): nunca corta a leitura.
  function maybeCompleteSoon() { later(() => { if (!S.dialog && !maybeComplete()) pendingHelp(); }, calm() ? 400 : 1400); }

  function answer(optionId) {
    const res = answerQuestion(S.run, S.mission, S.question, optionId);
    S.run = res.run;
    if (res.result === "retry") {
      metric("wrongAnswers"); persistRun();
      S.questionNote = "Vamos olhar outra vez. Observa com calma e escolhe outra resposta.";
      const note = root.querySelector("[data-dm-qnote]"); if (note) note.textContent = S.questionNote;
      root.querySelector(`[data-option="${optionId}"]`)?.setAttribute("disabled", "");
      return;
    }
    if (res.result !== "found") return;
    S.dialog = null; S.question = null; S.questionNote = ""; persistRun();
    render();
    if (S.mission.kind === "tutorial") S.run = markStep(S.run, "tap");
    rewardDiscovery(res.task, res.points, null);
    if (!pendingRequired()) maybeCompleteSoon();
  }

  function toast(message) {
    root.querySelector(".dm-toast")?.remove();
    const el = document.createElement("p");
    el.className = "dm-toast"; el.setAttribute("role", "status"); el.textContent = message;
    root.querySelector(".dm-play")?.appendChild(el);
    later(() => el.remove(), 6000);
  }

  function refreshSide() {
    const current = root.querySelector("[data-dm-side]"); if (!current) return;
    const tmp = document.createElement("div"); tmp.innerHTML = sideHtml();
    const fresh = tmp.firstElementChild, openDetails = current.querySelector("details")?.open, scroll = current.scrollTop;
    current.replaceWith(fresh); if (openDetails) fresh.querySelector("details").open = true; fresh.scrollTop = scroll;
    const prog = root.querySelector("[data-dm-progress]"); const tmp2 = document.createElement("div"); tmp2.innerHTML = progressHtml();
    if (prog) prog.replaceWith(tmp2.firstElementChild);
  }

  function maybeComplete() {
    if (!S.run || S.runDone || S.run.completedOnce || !isComplete(S.run, S.mission) || S.dialog) return false;
    const before = levelFor(completedIds().length);
    S.run = { ...S.run, completedOnce: true };
    S.progress = recordCompletion(S.progress, S.run, new Date());
    S.progress = bumpMetric(S.progress, "missionsCompleted"); save();
    const after = levelFor(completedIds().length);
    S.completion = { mission: S.mission, run: S.run, before, after };
    sound("complete");
    root.querySelector("[data-dm-canvas]")?.classList.add("is-solved");
    later(() => { S.dialog = "completed"; render(); }, calm() ? 0 : 500);
    return true;
  }

  function startMission(id) {
    const m = missionById(id);
    if (!m) { S.error = { message: `A missão «${id}» não existe ou não está disponível.` }; S.screen = "error"; S.dialog = null; render(); return; }
    if (!unlocked().includes(id)) { S.notice = `«${m.title}» abre depois de concluíres a fotografia anterior.`; S.screen = "board"; S.dialog = null; render(); return; }
    S.mission = m; S.notice = ""; S.completion = null;
    const saved = S.progress.current?.missionId === id ? S.progress.current : null;
    S.run = saved ? { ...createRun(m), ...saved, status: "mission" } : createRun(m);
    S.runDone = false; S.firstFound = S.run.found.length > 0; S.startedAt = Date.now();
    S.zoom = { s: 1, x: 0, y: 0 }; S.cursor = { x: 0.5, y: 0.5 }; S.selected = null; S.dialog = null; S.screen = "play";
    if (!saved) S.progress = bumpMetric(S.progress, "missionsStarted");
    persistRun(); render();
    announce(`${m.title}. ${requiredTasks(m).length} descobertas para concluir.`);
  }

  function goStart() {
    const current = S.progress.current && missionById(S.progress.current.missionId);
    if (current) return startMission(current.missionId);
    if (!completedIds().length && valid[0]) return startMission(valid[0].missionId);
    S.screen = "board"; S.dialog = null; render();
  }

  function closeDialog() {
    const was = S.dialog;
    S.dialog = null; S.question = null; S.questionNote = ""; render();
    if (S.screen === "play") {
      if (was === "album") step("notebook");
      root.querySelector("[data-dm-stage]")?.focus({ preventScroll: true });
      pendingHelp();
    }
  }

  function pendingHelp() {
    if (S.mission?.kind !== "tutorial" || !S.run || S.run.completedOnce) return;
    const pending = pendingTutorialSteps(S.run);
    if (!pendingRequired() && pending.length) toast(`Fizeste todas as descobertas! Para terminar o treino falta: ${pending.map(step => step.label.toLowerCase()).join("; ")}.`);
  }

  // ───────────────────────── acções ─────────────────────────
  const actions = {
    start: goStart,
    howto: () => { S.dialog = "howto"; render(); },
    "close-dialog": () => closeDialog(),
    intro: () => { S.screen = "intro"; S.dialog = null; render(); },
    board: () => { persistRun(); S.screen = "board"; S.dialog = null; render(); },
    album: el => { persistRun(); if (el?.dataset.page) S.albumPage = Number(el.dataset.page); S.screen = "album"; S.dialog = null; S.confirmClear = false; render(); },
    "album-overlay": () => { S.dialog = "album"; S.confirmClear = false; render(); },
    "album-page": el => {
      const page = Number(el.dataset.page); if (!(page >= 0 && page < valid.length)) return;
      S.albumPage = page;
      const book = root.querySelector("[data-dm-page]");
      if (!book) return;
      book.innerHTML = albumPageHtml(page);
      book.classList.remove("is-turn"); void book.offsetWidth; if (!calm()) book.classList.add("is-turn");
      root.querySelectorAll(".dm-tab").forEach((tab, i) => { tab.classList.toggle("is-current", i === page); tab.setAttribute("aria-current", String(i === page)); });
      root.querySelectorAll(".dm-album__nav [data-act='album-page']").forEach((btn, i) => { const target = i === 0 ? page - 1 : page + 1; btn.dataset.page = String(target); btn.disabled = target < 0 || target >= valid.length; });
      sound("paper");
    },
    play: el => startMission(el.dataset.mission),
    pause: () => { S.dialog = "paused"; render(); },
    resume: () => closeDialog(),
    ack: () => { root.querySelector("[data-dm-found-card]")?.setAttribute("hidden", ""); step("read"); if (!pendingRequired()) maybeComplete(); root.querySelector("[data-dm-stage]")?.focus({ preventScroll: true }); },
    ask: el => { S.question = el.dataset.task; S.questionNote = ""; S.dialog = "question"; render(); sound("paper"); },
    answer: el => answer(el.dataset.option),
    retry: () => (S.mission ? startMission(S.mission.missionId) : goStart()),
    sound: () => { S.progress = { ...S.progress, prefs: { ...S.progress.prefs, sound: !S.progress.prefs.sound } }; save(); refreshBarSound(); sound("found"); },
    "zoom-in": () => zoomAt(1.4),
    "zoom-out": () => zoomAt(1 / 1.4),
    "zoom-reset": () => { S.zoom = { s: 1, x: 0, y: 0 }; applyTransform(); },
    "select-clue": el => { S.selected = S.selected === el.dataset.clue ? null : el.dataset.clue; refreshSide(); root.querySelector(`[data-clue="${el.dataset.clue}"]`)?.focus(); },
    hint: () => {
      if (!S.run || S.runDone) return;
      const { run, task, level } = applyHint(S.run, S.mission, S.selected);
      if (!task) return;
      S.run = run; persistRun(); metric("hintsUsed"); step("hint");
      S.selected = task.id; refreshSide();
      if (level >= 2 && task.type === "find") { showHintZone(task); toast(`Ajuda visual: «${task.clue}» está na zona destacada. Agora toca no sítio exacto.`); }
      else if (level >= 2) toast(`Ajuda: ${task.hint} Abre a pergunta para responderes.`);
      else toast(`Dica: ${task.hint}`);
    },
    zone: el => {
      const zone = findZones(S.mission).find(z => z.id === el.dataset.zone);
      if (zone) { S.cursor = { x: zone.x, y: zone.y }; drawCursor(); investigate({ x: zone.x, y: zone.y }, "zone"); }
    },
    clear: () => { S.confirmClear = true; render(); root.querySelector("[data-act='clear-cancel']")?.focus(); },
    "clear-cancel": () => { S.confirmClear = false; render(); },
    "clear-confirm": () => { S.progress = clearProgress(storage); S.run = null; S.confirmClear = false; S.screen = "intro"; S.dialog = null; render(); announce("Álbum apagado."); }
  };

  function refreshBarSound() {
    const btn = root.querySelector("[data-act='sound']"); if (!btn) return;
    btn.setAttribute("aria-pressed", String(S.progress.prefs.sound));
    btn.setAttribute("aria-label", `Sons ${S.progress.prefs.sound ? "ligados" : "desligados"}`);
    btn.innerHTML = S.progress.prefs.sound ? ICONS.som(22) : ICONS.semSom(22);
  }

  const onClick = event => {
    const el = event.target.closest("[data-act]");
    if (!el || !root.contains(el) || el.disabled) return;
    const fn = actions[el.dataset.act];
    if (fn) { event.preventDefault(); fn(el); }
  };
  const onChange = event => {
    const pref = event.target?.dataset?.pref; if (!pref) return;
    S.progress = { ...S.progress, prefs: { ...S.progress.prefs, [pref]: event.target.checked } }; save();
    root.classList.toggle("dm--calm", calm());
  };
  const onKey = event => {
    const dialog = root.querySelector("[data-dm-dialog]");
    if (!dialog) return;
    if (event.key === "Escape") { event.preventDefault(); closeDialog(); return; }
    if (event.key !== "Tab") return;
    const items = [...dialog.querySelectorAll("button:not([disabled]),a[href],input")];
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (!dialog.contains(document.activeElement)) { event.preventDefault(); first.focus(); }
    else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };
  root.addEventListener("click", onClick);
  root.addEventListener("change", onChange);
  document.addEventListener("keydown", onKey);

  if (!valid.length) { S.screen = "error"; S.error = { message: blocked.length ? "Nenhuma fotografia está autorizada para o jogo neste ambiente." : "O catálogo de missões está vazio ou tem dados inválidos." }; render(); }
  else if (query.missao) { const target = valid.find(m => m.missionId === query.missao); if (target) startMission(target.missionId); else { S.screen = "error"; S.error = { message: `A missão «${query.missao}» não existe.` }; render(); } }
  else render();

  return {
    state: S,
    destroy() {
      root.removeEventListener("click", onClick);
      root.removeEventListener("change", onChange);
      document.removeEventListener("keydown", onKey);
      resizeObserver?.disconnect();
      timers.forEach(clearTimeout); timers.clear();
      try { audio?.close(); } catch { /* */ }
      persistRun();
    }
  };
}

export const POINTS_TABLE = POINTS_BY_HINT;
