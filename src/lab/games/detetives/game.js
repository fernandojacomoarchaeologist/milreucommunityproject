/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Detetives da Memória — interface (laboratório, versão de teste; NÃO publicada em produção).
 * v0.3 «mesa de investigação»: a fotografia real é a protagonista (derivado de apresentação sem as
 * margens do scan), as pistas são INVISÍVEIS até serem descobertas, a lupa amplia de verdade, os
 * objectivos são cartões com o recorte do objecto, um guia comenta sem interromper e o Caderno de
 * Campo é um objecto pousado na mesa. Sem sorte, sem contagens decrescentes, sem penalização.
 * As pistas usam coordenadas normalizadas e continuam alinhadas com zoom, deslocação, lupa e ecrã.
 * Alternativas ao toque: teclado (cursor-lupa) e «Explorar por descrição».
 */
import {
  validateMission, registerTap, answerQuestion, applyHint, markStep, isComplete, pendingTutorialSteps, createRun,
  touchTolerance, shapeCenter, levelFor, unlockedMissions, maxScore, tasksOf, requiredTasks, remainingTasks,
  POINTS_BY_HINT, LAYERS
} from "./engine.js";
import { loadProgress, saveProgress, clearProgress, recordCompletion, bumpMetric, recordAttention, ATTENTION_GRID } from "./storage.js";
import { ICONS } from "./icons.js";
import { LOUPE_FRAME, TOOL, NOTEBOOK, stampSvg, TAPE, GUIDE_BADGE } from "./art.js";

const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
const now = () => (typeof performance !== "undefined" ? performance.now() : Date.now());
const CERTAINTY_LABEL = { confirmed: "Confirmado", probable: "Provável", hypothesis: "Hipótese" };
const LOUPE_ZOOM = 2.6;
const IDLE_MS = 20000;

const OPENING = [
  "Há fotografias que guardam muito mais do que imagens.",
  "Guardam lugares, pessoas, acontecimentos e pequenas histórias que o tempo pode fazer esquecer.",
  "Em Milreu, cada fotografia é uma oportunidade para descobrir algo novo.",
  "Prepara a tua lupa. A próxima descoberta pode estar mesmo à tua frente!"
];

// Mensagens do guia (avatar futuro). Curtas, nunca bloqueiam o jogo.
export const GUIDE = Object.freeze({
  start: "Há algo curioso nesta fotografia... Consegues encontrar?",
  idle: "Experimenta usar a lupa!",
  found: "Boa descoberta!",
  done: "Excelente investigação! Vou guardar esta memória no teu caderno."
});

export function createDetetivesGame({ root, missions: resolved = [], blocked = [], assetUrl, lang = "pt-PT", query = {}, storage }) {
  const valid = [], invalid = [];
  for (const mission of resolved) {
    const check = validateMission(mission);
    (check.ok ? valid : invalid).push(check.ok ? mission : { mission, errors: check.errors });
  }
  valid.sort((a, b) => a.order - b.order);

  const S = {
    screen: "intro", progress: loadProgress(storage), mission: null, run: null, runDone: false,
    zoom: { s: 1, x: 0, y: 0 }, cursor: { x: 0.5, y: 0.5 }, selected: null, dialog: null, briefing: false,
    question: null, questionNote: "", completion: null, error: null, confirmClear: false, notice: "",
    albumPage: 0, startedAt: 0, firstFound: false, loupe: false, lastFound: null, objectivesOpen: false, heat: false
  };
  const timers = new Set();
  const later = (fn, ms) => { const id = setTimeout(() => { timers.delete(id); fn(); }, ms); timers.add(id); return id; };
  let audio = null, resizeObserver = null, idleTimer = null, guideTimer = null;

  const missionById = id => valid.find(m => m.missionId === id) || null;
  const completedIds = () => Object.keys(S.progress.completed).filter(id => missionById(id));
  const unlocked = () => unlockedMissions(valid, completedIds());
  const save = () => saveProgress(S.progress, storage);
  const metric = (key, value) => { S.progress = bumpMetric(S.progress, key, value); save(); };
  const calm = () => S.progress.prefs.calm === true || (typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches);
  const finePointer = () => typeof matchMedia === "function" && matchMedia("(hover: hover) and (pointer: fine)").matches;
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
  const objPic = task => (task.cardImage ? `<img src="${assetUrl(task.cardImage)}" alt="" decoding="async">` : `<span class="dm-obj__icon">${task.type === "question" ? "?" : ICONS.lupa(22)}</span>`);

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
          ${completedIds().length ? `<button type="button" class="dm-btn" data-act="album">${ICONS.caderno(20)} O meu caderno</button>` : ""}
        </div>
        <a class="dm-link" href="#/museu">${ICONS.voltar(18)} Voltar ao Museu de Memórias</a>
      </div>
      <div class="dm-intro__art" aria-hidden="true">${thumbs}</div>
    </section>`;
  }

  function howtoHtml() {
    return dialogHtml("dm-howto", "Como jogar", `
      <ol class="dm-steps">
        <li><strong>Procura</strong> na fotografia os objectos dos cartões. Não há tempo limite e errar não tira pontos.</li>
        <li><strong>Clica ou toca</strong> no objecto quando o encontrares. As pistas estão escondidas: só aparecem quando as descobres.</li>
        <li><strong>Lupa:</strong> liga-a na barra de ferramentas e passa-a sobre a fotografia para ver os pormenores. Clica para investigar.</li>
        <li><strong>Ampliar:</strong> roda do rato, dois dedos ou os botões + e −. Arrasta para te deslocares.</li>
        <li><strong>Teclado:</strong> na fotografia, as setas mexem a lupa, Enter investiga, + e − ampliam, 0 repõe.</li>
        <li><strong>Sem ver bem a imagem?</strong> Usa «Explorar por descrição».</li>
        <li><strong>Pista:</strong> dá uma dica e depois mostra uma zona. Cada descoberta vale 100 pontos, ou 75 e 50 com ajuda.</li>
        <li>O teu Caderno de Campo fica guardado <strong>só neste browser</strong>. Podes apagá-lo quando quiseres.</li>
      </ol>`, `<button type="button" class="dm-btn dm-btn--primary" data-act="close-dialog">Percebi</button>`);
  }

  function boardHtml() {
    const done = completedIds(), open = unlocked();
    const level = levelFor(done.length);
    const cards = valid.map(m => {
      const isDone = done.includes(m.missionId), isOpen = open.includes(m.missionId);
      const current = S.progress.current?.missionId === m.missionId ? S.progress.current : null;
      const best = S.progress.completed[m.missionId]?.bestScore;
      const status = isDone ? `${ICONS.selo(18)} No caderno · ${best}/${maxScore(m)} pontos` : current ? `Em curso · ${current.found.length}/${tasksOf(m).length} descobertas` : isOpen ? `${tasksOf(m).length} descobertas por fazer` : `${ICONS.cadeado(18)} Abre depois da fotografia anterior`;
      const action = !isOpen ? "" : `<button type="button" class="dm-btn ${isDone ? "" : "dm-btn--primary"}" data-act="play" data-mission="${m.missionId}">${current ? "Continuar" : isDone ? "Investigar de novo" : "Investigar"}</button>`;
      return `<article class="dm-mission ${isOpen ? "" : "is-locked"} ${isDone ? "is-done" : ""}">
        <div class="dm-mission__media">${img(m.image.src)}<span class="dm-mission__id">${esc(m.image.memoryRef)}</span></div>
        <div class="dm-mission__body">
          <p class="dm-eyebrow">Fotografia ${m.order} · ${esc(m.difficulty)}</p>
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
          <button type="button" class="dm-btn" data-act="album">${ICONS.caderno(20)} O meu caderno</button>
          <button type="button" class="dm-btn" data-act="intro">${ICONS.voltar(18)} Início</button>
        </div>
      </div>
      ${S.notice ? `<p class="dm-note" role="status">${esc(S.notice)}</p>` : ""}
      <div class="dm-board__grid">${cards}</div>
      ${blocked.length ? `<p class="dm-note">${blocked.length} fotografia(s) indisponível(is) no jogo por falta de autorização de uso interactivo.</p>` : ""}
      ${invalid.length ? `<p class="dm-note">${invalid.length} missão(ões) ignorada(s) por dados inválidos.</p>` : ""}
    </section>`;
  }

  // ───────────────────────── mesa de investigação ─────────────────────────
  // Cartão de objectivo: recorte do objecto (ou ícone, nas perguntas), título curto e estado.
  function objectiveHtml(task) {
    const r = S.run, found = r.found.includes(task.id), hint = r.hints[task.id] || 0;
    const label = found ? task.title : task.clue;
    const state = found ? `+${r.points[task.id] ?? 0}` : task.optional ? "extra" : task.type === "question" ? "responder" : "";
    const act = task.type === "question" && !found ? "ask" : "select-clue";
    const aria = `${label}${found ? " — descoberto, ver mais" : task.optional ? " — extra, por descobrir" : " — por descobrir"}${!found && hint ? ` — ajuda ${hint} de 2` : ""}`;
    return `<li class="dm-obj ${found ? "is-found" : ""} ${task.optional ? "is-optional" : ""} ${S.selected === task.id ? "is-selected" : ""} ${S.lastFound === task.id ? "is-new" : ""}" data-obj="${task.id}">
      <button type="button" class="dm-obj__btn" data-act="${act}" data-clue="${task.id}" data-task="${task.id}" ${found ? "" : `aria-pressed="${S.selected === task.id}"`} aria-label="${esc(aria)}">
        <span class="dm-obj__pic">${objPic(task)}${found ? `<span class="dm-obj__tick">${TOOL.certo}</span>` : ""}</span>
        <span class="dm-obj__txt">${esc(label)}</span>
        ${state ? `<span class="dm-obj__state">${esc(state)}</span>` : ""}
      </button>
      ${!found && hint >= 1 ? `<p class="dm-obj__hint">${esc(task.hint)}</p>` : ""}
    </li>`;
  }

  function objectivesHtml() {
    const req = requiredTasks(S.mission), done = req.filter(t => S.run.found.includes(t.id)).length;
    return `<aside class="dm-objectives ${S.objectivesOpen ? "is-open" : ""}" aria-label="Objectivos da investigação" data-dm-objectives>
      <button type="button" class="dm-objectives__head" data-act="objectives" aria-expanded="${S.objectivesOpen}">
        <span>Encontra na fotografia</span><b data-dm-progress aria-label="${done} de ${req.length} encontrados">${done}/${req.length}</b>
      </button>
      <ol class="dm-objectives__list">${tasksOf(S.mission).map(objectiveHtml).join("")}</ol>
    </aside>`;
  }

  function notebookObjHtml() {
    const n = completedIds().length;
    return `<button type="button" class="dm-notebook-obj" data-act="notebook" aria-label="Abrir o Caderno de Campo (${n} ${n === 1 ? "selo" : "selos"})" data-dm-notebook>
      ${NOTEBOOK}<span class="dm-notebook-obj__label">Caderno</span>${n ? `<span class="dm-notebook-obj__count">${n}</span>` : ""}
    </button>`;
  }

  function toolsHtml() {
    const sound = S.progress.prefs.sound;
    return `<div class="dm-tools" role="toolbar" aria-label="Ferramentas" data-dm-tools>
      <button type="button" class="dm-tool dm-tool--lupa" data-act="loupe" aria-pressed="${S.loupe}" title="Lupa">${TOOL.lupa}<span>Lupa</span></button>
      <button type="button" class="dm-tool" data-act="hint" title="Pista">${TOOL.pista}<span>Pista</span></button>
      <span class="dm-tools__sep" aria-hidden="true"></span>
      <button type="button" class="dm-tool" data-act="zoom-in" title="Ampliar">${TOOL.mais}<span class="dm-sr">Ampliar</span></button>
      <button type="button" class="dm-tool" data-act="zoom-out" title="Reduzir">${TOOL.menos}<span class="dm-sr">Reduzir</span></button>
      <button type="button" class="dm-tool" data-act="zoom-reset" title="Ver a fotografia inteira">${TOOL.ajustar}<span class="dm-sr">Ver a fotografia inteira</span></button>
      <button type="button" class="dm-tool" data-act="sound" aria-pressed="${sound}" title="Sons">${sound ? TOOL.som : TOOL.semSom}<span class="dm-sr">Sons ${sound ? "ligados" : "desligados"}</span></button>
    </div>`;
  }

  function playHtml() {
    const m = S.mission, r = S.run;
    return `<section class="dm-play" aria-labelledby="dm-play-title">
      <header class="dm-hud">
        <button type="button" class="dm-tool" data-act="board" title="Sair (o progresso fica guardado)">${TOOL.voltar}<span class="dm-sr">Sair para as fotografias (o progresso fica guardado)</span></button>
        <div class="dm-hud__title"><p class="dm-eyebrow">${esc(m.image.memoryRef)} · fotografia ${m.order}</p><h1 id="dm-play-title">${esc(m.title)}</h1></div>
        <p class="dm-hud__score" data-dm-score><span data-dm-score-value>${r.score}</span> <small>pontos</small></p>
        <button type="button" class="dm-tool" data-act="pause" title="Pausa e definições">${TOOL.pausa}<span class="dm-sr">Pausa e definições</span></button>
      </header>
      <div class="dm-table" data-dm-table>
        <div class="dm-stage ${S.loupe ? "is-loupe" : ""}" data-dm-stage tabindex="0" role="group" aria-roledescription="fotografia para investigar" aria-label="${esc(m.image.alt)} Usa as setas para mexer a lupa e Enter para investigar." aria-describedby="dm-credit">
          <div class="dm-canvas" data-dm-canvas>
            <img src="${assetUrl(m.image.src)}" alt="" draggable="false" data-dm-image>
            <span class="dm-tape-slot dm-tape-slot--l">${TAPE}</span><span class="dm-tape-slot dm-tape-slot--r">${TAPE}</span>
            <canvas class="dm-heat" data-dm-heat aria-hidden="true" ${S.heat ? "" : "hidden"}></canvas>
            <svg class="dm-outlines" data-dm-outlines viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden="true"></svg>
            <div class="dm-hintzone" data-dm-hintzone hidden></div>
            <div class="dm-cursor" data-dm-cursor aria-hidden="true">${TOOL.lupa}</div>
          </div>
          <div class="dm-loupe" data-dm-loupe aria-hidden="true" hidden><div class="dm-loupe__lens"><img src="${assetUrl(m.image.src)}" alt="" draggable="false" data-dm-loupe-img></div>${LOUPE_FRAME}</div>
        </div>
        <p id="dm-credit" class="dm-credit">«${esc(m.image.documentTitle)}»${m.image.date ? ` · ${esc(m.image.date)}` : ""} · ${esc(m.image.credit)} · <a href="#/museu/memorias/${esc(m.image.memoryRef)}">${esc(m.image.memoryRef)}</a></p>
        ${objectivesHtml()}
        ${notebookObjHtml()}
        ${toolsHtml()}
        <div class="dm-guide" data-dm-guide data-mood="neutral" hidden>
          <span class="dm-guide__avatar" aria-hidden="true">${GUIDE_BADGE}</span>
          <div class="dm-guide__bubble" role="status"><p data-dm-guide-text></p><div class="dm-guide__actions" data-dm-guide-actions></div></div>
        </div>
        <div class="dm-discovery" data-dm-discovery hidden></div>
        <div class="dm-describe" data-dm-describe hidden></div>
        ${S.briefing ? briefingHtml() : ""}
      </div>
    </section>`;
  }

  // Ecrã inicial da missão: o que procurar, sem textos longos.
  function briefingHtml() {
    const m = S.mission, finds = tasksOf(m).filter(t => !t.optional);
    return `<div class="dm-brief" data-dm-brief role="dialog" aria-modal="false" aria-labelledby="dm-brief-t">
      <p class="dm-eyebrow">Missão ${m.order} · ${esc(m.image.memoryRef)}</p>
      <h2 id="dm-brief-t">${esc(m.title)}</h2>
      <p class="dm-brief__lead">${esc(m.description)}</p>
      <ul class="dm-brief__objs">${finds.map(t => `<li><span class="dm-obj__pic">${objPic(t)}</span><span>${esc(t.clue)}</span></li>`).join("")}</ul>
      <button type="button" class="dm-btn dm-btn--primary" data-act="begin">${TOOL.lupa} Começar a investigar</button>
    </div>`;
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
      ${task.facts?.length ? `<div class="dm-facts"><p class="dm-eyebrow">O que a ficha regista</p><ul>${task.facts.map(f => `<li>${esc(f)}</li>`).join("")}</ul><p class="dm-facts__src">${esc(task.factsSource || "")}</p></div>` : ""}
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
       <button type="button" class="dm-btn" data-act="describe-open">${TOOL.lista} Explorar por descrição (sem rato nem toque)</button>
       <button type="button" class="dm-btn" data-act="heat" aria-pressed="${S.heat}">${S.heat ? "Esconder" : "Mostrar"} o mapa de atenção (equipa)</button>
       <button type="button" class="dm-btn" data-act="howto">Como jogar</button>
       <button type="button" class="dm-btn" data-act="board">Sair para as fotografias</button>`);
  }

  // Conclusão: selo no caderno + próxima fotografia relacionada, à escolha do jogador (nunca automática).
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
        <div class="dm-reward__stamp" aria-hidden="true">${stampSvg(m.reward?.label || "Investigação concluída")}</div>
        <div><p class="dm-eyebrow">Selo guardado no Caderno de Campo</p><p class="dm-reward__page">«${esc(m.reward?.page || m.title)}»</p>
        <p class="dm-score-final">${r.score} <span>/ ${maxScore(m)} pontos</span></p></div>
      </div>
      <p class="dm-reward__message">${esc(m.reward?.message || "")}</p>
      ${m.reward?.story ? `<p class="dm-reward__story">${esc(m.reward.story)}</p>` : ""}
      ${levelUp ? `<p class="dm-levelup">${ICONS.selo(22)} Subiste de nível: <strong>${esc(after.current.name)}</strong>!</p>` : ""}
      ${related ? `<div class="dm-surprise"><p class="dm-eyebrow">Ligação a outra memória</p>${related}</div>` : ""}
      ${next ? `<div class="dm-next"><p class="dm-eyebrow">A próxima memória</p><div class="dm-next__card">${img(next.image.src, "", "dm-next__img")}<div><strong>${esc(next.title)}</strong><span>«${esc(next.image.documentTitle)}» · ${esc(next.image.memoryRef)}</span><span>${esc(next.description)}</span></div></div></div>` : `<p class="dm-note">Investigaste todas as fotografias disponíveis nesta versão.</p>`}
      <p class="dm-small">${museumLink(m.image.memoryRef, "Ver a ficha desta fotografia no Museu")}</p>`,
      `${next ? `<button type="button" class="dm-btn dm-btn--primary dm-btn--even" data-act="play" data-mission="${next.missionId}">Investigar a próxima</button>` : ""}
       <button type="button" class="dm-btn ${next ? "" : "dm-btn--primary"} dm-btn--even" data-act="notebook" data-page="${valid.indexOf(m)}">${ICONS.caderno(20)} Abrir o caderno</button>
       <button type="button" class="dm-btn dm-btn--even" data-act="close-dialog">${optionalLeft ? `Continuar a explorar (${optionalLeft} extra)` : "Ficar nesta fotografia"}</button>`, "dm-dialog__card--done");
  }

  // ───────────────────────── Caderno de Campo ─────────────────────────
  function albumPageHtml(index) {
    const m = valid[index]; if (!m) return "";
    const entry = S.progress.completed[m.missionId];
    if (!entry) return `<article class="dm-page is-empty"><p class="dm-eyebrow">Página ${index + 1} de ${valid.length}</p><h2>${esc(m.title)}</h2><div class="dm-page__ghost">${ICONS.lupa(48)}</div><p>Esta página ainda está por descobrir. Investiga a fotografia ${esc(m.image.memoryRef)} para a preencher.</p>${unlocked().includes(m.missionId) ? `<button type="button" class="dm-btn dm-btn--primary" data-act="play" data-mission="${m.missionId}">Investigar</button>` : ""}</article>`;
    const found = tasksOf(m).filter(t => entry.found.includes(t.id));
    return `<article class="dm-page">
      <p class="dm-eyebrow">Página ${index + 1} de ${valid.length} · ${esc(m.reward?.page || m.title)}</p>
      <div class="dm-page__grid">
        <figure class="dm-page__photo">${img(m.image.src, m.image.alt)}<span class="dm-page__stamp">${stampSvg(m.reward?.label || "Investigação concluída")}</span>
          <figcaption>«${esc(m.image.documentTitle)}» · ${esc(m.image.date || "")}<br>${esc(m.image.credit)}</figcaption></figure>
        <div class="dm-page__text">
          <h2>${esc(m.title)}</h2>
          <p class="dm-reward__message">${esc(m.reward?.message || "")}</p>
          <ul class="dm-page__finds">${found.map(t => `<li><span class="dm-obj__pic">${objPic(t)}</span><div><strong>${esc(t.title)}</strong> <span class="dm-cert dm-cert--${t.discovery.certainty}">${certaintyText(t.discovery.certainty)}</span><br>${esc(t.discovery.text)}</div></li>`).join("")}</ul>
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
    return `<div class="dm-level"><p>Nível: <strong>${esc(level.current.name)}</strong> · ${done.length} de ${valid.length} selo(s)</p>
      ${nextGoal ? `<div class="dm-level__bar" role="progressbar" aria-valuemin="0" aria-valuemax="${nextGoal.minMissions}" aria-valuenow="${done.length}" aria-label="Progresso para ${esc(nextGoal.name)}"><span data-dm-pct="${pct}"></span></div>` : ""}</div>
      <nav class="dm-album__tabs" aria-label="Páginas do caderno">${tabs}</nav>
      <div class="dm-album__book" data-dm-page>${albumPageHtml(page)}</div>
      <div class="dm-album__nav">
        <button type="button" class="dm-btn" data-act="album-page" data-page="${page - 1}" ${page <= 0 ? "disabled" : ""}>${ICONS.voltar(18)} Página anterior</button>
        <button type="button" class="dm-btn" data-act="album-page" data-page="${page + 1}" ${page >= valid.length - 1 ? "disabled" : ""}>Página seguinte</button>
      </div>
      <details class="dm-metrics"><summary>Medição local desta versão de teste</summary>
        <p class="dm-note">Guardada só neste browser e nunca enviada. Serve para avaliar o protótipo, não para medir pessoas.</p>
        <div class="dm-heatgrid">${valid.map(m => `<figure class="dm-heatfig"><span class="dm-heatfig__box">${img(m.image.src, "")}<canvas data-dm-heatmap="${m.missionId}" aria-hidden="true"></canvas></span><figcaption>Mapa de atenção · ${esc(m.image.memoryRef)}</figcaption></figure>`).join("")}</div>
        <p class="dm-note">Zonas mais escuras = onde a lupa/o rato passou mais e onde se tocou (toques valem 3). Ajuda a ver para onde os olhos vão e que pistas passam despercebidas.</p>
        <dl><dt>Fotografias iniciadas</dt><dd>${mt.missionsStarted || 0}</dd><dt>Fotografias concluídas</dt><dd>${mt.missionsCompleted || 0}</dd>
        <dt>Descobertas (das quais extra)</dt><dd>${mt.discoveries || 0} (${mt.optionalDiscoveries || 0})</dd><dt>Ajudas pedidas</dt><dd>${mt.hintsUsed || 0}</dd>
        <dt>Toques sem pista / respostas a rever</dt><dd>${mt.misses || 0} / ${mt.wrongAnswers || 0}</dd>
        <dt>Tempo médio até à 1.ª descoberta</dt><dd>${avg(mt.firstDiscoveryMs, 1000, 1)} s</dd><dt>Resposta do interface ao toque</dt><dd>${avg(mt.feedbackMs, 1, 0)} ms</dd></dl></details>
      <div class="dm-clear">${S.confirmClear
        ? `<p>Apagar o caderno e o progresso guardados neste browser?</p><button type="button" class="dm-btn dm-btn--danger" data-act="clear-confirm">Sim, apagar</button> <button type="button" class="dm-btn" data-act="clear-cancel">Cancelar</button>`
        : `<button type="button" class="dm-btn dm-btn--quiet" data-act="clear">Apagar o meu caderno</button>`}</div>`;
  }

  // Caderno aberto por cima da mesa: abre como um livro (animação curta) e fecha de imediato.
  function notebookHtml() {
    return `<div class="dm-dialog dm-dialog--book" data-dm-dialog><div class="dm-book" role="dialog" aria-modal="true" aria-labelledby="dm-book-t">
      <div class="dm-book__cover" aria-hidden="true"></div>
      <div class="dm-book__paper">
        <div class="dm-book__head"><h2 id="dm-book-t">${ICONS.caderno(26)} Caderno de Campo</h2>
          <button type="button" class="dm-tool" data-act="close-dialog" title="Fechar e voltar ao jogo">${TOOL.fechar}<span class="dm-sr">Fechar e voltar ao jogo</span></button></div>
        ${albumBody()}
      </div>
    </div></div>`;
  }

  function albumHtml() {
    return `<section class="dm-album" aria-labelledby="dm-al-title">
      <div class="dm-board__head"><div>${labNotice}<h1 id="dm-al-title">${ICONS.caderno(30)} Caderno de Campo</h1><p>Uma página por fotografia investigada, com as tuas descobertas.</p></div>
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
    const dialogs = { howto: howtoHtml, question: questionHtml, paused: pausedHtml, completed: completedHtml, notebook: notebookHtml };
    root.dataset.dmState = S.dialog === "paused" ? "paused" : S.dialog === "completed" ? "completed" : S.dialog === "notebook" ? "notebook" : S.screen === "play" ? "mission" : S.screen;
    root.classList.toggle("dm--playing", S.screen === "play");
    root.classList.toggle("dm--calm", calm());
    root.innerHTML = `<div class="dm-live dm-sr" data-dm-live aria-live="polite"></div>${screens[S.screen]()}${S.dialog ? dialogs[S.dialog]() : ""}`;
    root.querySelectorAll("[data-dm-pct]").forEach(el => { el.style.width = `${el.dataset.dmPct}%`; });
    if (S.screen === "play") setupStage();
    drawAlbumHeat();
    if (S.dialog === "question") placeZoomPreview();
    if (S.dialog) {
      root.querySelector(".dm-play")?.setAttribute("inert", "");
      // Diálogos longos (conclusão, caderno): o foco vai para o título, para a leitura começar no topo.
      const heading = ["completed", "notebook"].includes(S.dialog) ? root.querySelector("[data-dm-dialog] h2") : null;
      if (heading) { heading.setAttribute("tabindex", "-1"); heading.focus({ preventScroll: true }); }
      else (root.querySelector("[data-dm-dialog] .dm-option") || root.querySelector("[data-dm-dialog] .dm-btn--primary") || root.querySelector("[data-dm-dialog] button"))?.focus();
    } else if (S.screen === "play" && S.briefing) root.querySelector("[data-dm-brief] .dm-btn")?.focus({ preventScroll: true });
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

  // ───────────────────────── palco: proporção, zoom, deslocação, toque, lupa ─────────────────────────
  let stage, canvas, loupe, loupeImg, base = { w: 0, h: 0, left: 0, top: 0 }, loupeFrame = 0, loupeAt = null;
  function setupStage() {
    stage = root.querySelector("[data-dm-stage]"); canvas = root.querySelector("[data-dm-canvas]");
    loupe = root.querySelector("[data-dm-loupe]"); loupeImg = root.querySelector("[data-dm-loupe-img]");
    const image = root.querySelector("[data-dm-image]");
    image.addEventListener("error", () => { S.error = { message: "A fotografia desta missão não carregou. Verifica a ligação e tenta de novo.", retry: true }; S.screen = "error"; render(); }, { once: true });
    fit(); drawOutlines(); drawCursor();
    if (S.heat) drawHeat(root.querySelector("[data-dm-heat]"), S.progress.metrics?.attention?.[S.mission.missionId]);
    resizeObserver?.disconnect();
    if (typeof ResizeObserver === "function") { resizeObserver = new ResizeObserver(() => { fit(); }); resizeObserver.observe(stage); }
    bindStage();
  }

  function fit() {
    if (!stage) return;
    const { image } = S.mission;
    stage.style.setProperty("--dm-ar", `${image.width} / ${image.height}`);
    // A moldura de papel fica dentro do palco: a fotografia ocupa o resto, inteira e sem cortes.
    const pad = stage.clientWidth < 520 ? 8 : 18;
    const sw = stage.clientWidth - pad * 2, sh = stage.clientHeight - pad * 2, aspect = image.width / image.height;
    const w = sw / sh > aspect ? sh * aspect : sw, h = w / aspect;
    base = { w, h, left: pad + (sw - w) / 2, top: pad + (sh - h) / 2 };
    canvas.style.width = `${w}px`; canvas.style.height = `${h}px`; canvas.style.left = `${base.left}px`; canvas.style.top = `${base.top}px`;
    clampPan(); applyTransform();
  }

  function clampPan() {
    const z = S.zoom;
    z.x = Math.min(0, Math.max(base.w - base.w * z.s, z.x));
    z.y = Math.min(0, Math.max(base.h - base.h * z.s, z.y));
    if (z.s === 1) { z.x = 0; z.y = 0; }
  }
  function applyTransform() {
    if (!canvas) return;
    canvas.style.transform = `translate(${S.zoom.x}px, ${S.zoom.y}px) scale(${S.zoom.s})`;
    canvas.classList.toggle("is-zoomed", S.zoom.s > 1);
  }

  function zoomAt(factor, px = base.w / 2, py = base.h / 2) {
    const z = S.zoom, s = Math.min(5, Math.max(1, z.s * factor));
    const wx = (px - z.x) / z.s, wy = (py - z.y) / z.s;
    z.x = px - wx * s; z.y = py - wy * s; z.s = s;
    clampPan(); applyTransform(); hideLoupe();
    if (s > 1) step("zoom");
  }

  function toNormalized(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    return { x: (clientX - rect.left) / rect.width, y: (clientY - rect.top) / rect.height };
  }

  // Lupa real: lente circular com a MESMA fotografia ampliada LOUPE_ZOOM vezes em relação ao que se vê
  // (funciona também com zoom). Só transforms, uma actualização por frame.
  function moveLoupe(clientX, clientY, touch = false) {
    if (!S.loupe || !loupe) return;
    loupeAt = { clientX, clientY, touch };
    if (loupeFrame) return;
    loupeFrame = requestAnimationFrame(() => {
      loupeFrame = 0; if (!loupeAt || !S.loupe) return;
      const rect = canvas.getBoundingClientRect(), srect = stage.getBoundingClientRect();
      const lift = loupeAt.touch ? loupe.offsetWidth * 0.75 : 0;
      const cx = loupeAt.clientX, cy = loupeAt.clientY - lift;
      const p = { x: (cx - rect.left) / rect.width, y: (cy - rect.top) / rect.height };
      if (p.x < 0 || p.y < 0 || p.x > 1 || p.y > 1) { loupe.hidden = true; return; }
      loupe.hidden = false;
      const d = loupe.offsetWidth;
      loupe.style.transform = `translate3d(${cx - srect.left - d / 2}px, ${cy - srect.top - d / 2}px, 0)`;
      const W = rect.width * LOUPE_ZOOM, H = rect.height * LOUPE_ZOOM;
      loupeImg.style.width = `${W}px`; loupeImg.style.height = `${H}px`;
      loupeImg.style.transform = `translate3d(${d / 2 - p.x * W}px, ${d / 2 - p.y * H}px, 0)`;
    });
  }
  function hideLoupe() { if (loupe) loupe.hidden = true; loupeAt = null; }

  function bindStage() {
    const pointers = new Map();
    let gesture = null;
    stage.addEventListener("pointerdown", event => {
      stage.setPointerCapture?.(event.pointerId);
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      const touch = event.pointerType !== "mouse";
      if (pointers.size === 1) gesture = { type: S.loupe && touch ? "lens" : "tap", startX: event.clientX, startY: event.clientY, x0: S.zoom.x, y0: S.zoom.y, t: Date.now() };
      if (pointers.size === 2) { const [a, b] = [...pointers.values()]; gesture = { type: "pinch", d0: Math.hypot(a.x - b.x, a.y - b.y), s0: S.zoom.s }; hideLoupe(); }
      if (gesture?.type === "lens") moveLoupe(event.clientX, event.clientY, true);
      poke();
    });
    let lastSample = 0;
    stage.addEventListener("pointermove", event => {
      if (event.pointerType === "mouse") moveLoupe(event.clientX, event.clientY);
      const t = Date.now();
      if (t - lastSample > 150 && (event.pointerType === "mouse" || gesture?.type === "lens")) { lastSample = t; attend(toNormalized(event.clientX, event.clientY - (gesture?.type === "lens" ? loupe.offsetWidth * 0.75 : 0)), 1); }
      if (!pointers.has(event.pointerId) || !gesture) return;
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (gesture.type === "pinch" && pointers.size === 2) {
        const [a, b] = [...pointers.values()], rect = stage.getBoundingClientRect();
        const mid = { x: (a.x + b.x) / 2 - rect.left - base.left, y: (a.y + b.y) / 2 - rect.top - base.top };
        zoomAt((gesture.s0 * Math.hypot(a.x - b.x, a.y - b.y) / gesture.d0) / S.zoom.s, mid.x, mid.y);
        return;
      }
      if (gesture.type === "lens") { moveLoupe(event.clientX, event.clientY, true); return; }
      const dx = event.clientX - gesture.startX, dy = event.clientY - gesture.startY;
      if (gesture.type === "tap" && Math.hypot(dx, dy) > 8) gesture.type = "pan";
      if (gesture.type === "pan" && S.zoom.s > 1) { S.zoom.x = gesture.x0 + dx; S.zoom.y = gesture.y0 + dy; clampPan(); applyTransform(); }
    });
    const end = event => {
      if (!pointers.has(event.pointerId)) return;
      pointers.delete(event.pointerId);
      // Lupa no toque: investiga-se o ponto no CENTRO da lente (acima do dedo), ao levantar.
      if (gesture?.type === "lens" && pointers.size === 0) {
        const lift = loupe.offsetWidth * 0.75; hideLoupe();
        investigate(toNormalized(event.clientX, event.clientY - lift), "pointer");
      } else if (gesture?.type === "tap" && pointers.size === 0 && Date.now() - gesture.t < 800) investigate(toNormalized(event.clientX, event.clientY), "pointer");
      if (pointers.size === 0) gesture = null;
    };
    stage.addEventListener("pointerup", end);
    stage.addEventListener("pointercancel", event => { pointers.delete(event.pointerId); gesture = null; hideLoupe(); });
    stage.addEventListener("pointerleave", event => { if (event.pointerType === "mouse") hideLoupe(); });
    stage.addEventListener("wheel", event => {
      event.preventDefault();
      const rect = stage.getBoundingClientRect();
      zoomAt(event.deltaY < 0 ? 1.15 : 1 / 1.15, event.clientX - rect.left - base.left, event.clientY - rect.top - base.top);
      moveLoupe(event.clientX, event.clientY);
    }, { passive: false });
    stage.addEventListener("keydown", event => {
      if (event.target !== stage) return;
      poke();
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

  // Contorno da descoberta: desenhado sobre a forma REAL da pista, só depois de encontrada.
  // viewBox 0..1 + traço sem escala: fica alinhado com qualquer zoom e ecrã.
  function outlineSvg(shape, aspect) {
    if (shape.type === "multi") return shape.shapes.map(part => outlineSvg(part, aspect)).join("");
    if (shape.type === "circle") return `<ellipse cx="${shape.cx}" cy="${shape.cy}" rx="${shape.r}" ry="${shape.r * aspect}" pathLength="1"/>`;
    const xs = shape.points.map(p => p[0]), ys = shape.points.map(p => p[1]);
    const box = shape.points.length === 4 && shape.points.every(([x, y]) => (x === Math.min(...xs) || x === Math.max(...xs)) && (y === Math.min(...ys) || y === Math.max(...ys)));
    if (box) return `<rect x="${Math.min(...xs)}" y="${Math.min(...ys)}" width="${Math.max(...xs) - Math.min(...xs)}" height="${Math.max(...ys) - Math.min(...ys)}" rx="0.008" ry="${0.008 * aspect}" pathLength="1"/>`;
    return `<polygon points="${shape.points.map(p => p.join(",")).join(" ")}" pathLength="1"/>`;
  }
  function drawOutlines(newId) {
    const layer = root.querySelector("[data-dm-outlines]"); if (!layer) return;
    const aspect = S.mission.image.width / S.mission.image.height;
    layer.innerHTML = tasksOf(S.mission).filter(t => t.type === "find" && S.run.found.includes(t.id))
      .map(t => `<g class="dm-outline ${t.id === newId ? "is-new" : ""}" data-outline="${t.id}">${outlineSvg(t.shape, aspect)}</g>`).join("");
  }

  function ripple(point) {
    const host = root.querySelector("[data-dm-canvas]"); if (!host || calm()) return;
    const el = document.createElement("span");
    el.className = "dm-ripple"; el.style.left = `${point.x * 100}%`; el.style.top = `${point.y * 100}%`;
    host.appendChild(el); later(() => el.remove(), 700);
  }

  // Zona da pista (0.3.2): nível 1 mostra uma zona larga (raio × 1,8), nível 2 a zona exacta da ficha de missão.
  // Fica visível até a pista ser encontrada (ou até se pedir outra), em vez de desaparecer ao fim de 7 s.
  function showHintZone(spot, level = 2) {
    const el = root.querySelector("[data-dm-hintzone]"); if (!el || !spot.hintArea) return;
    const k = level >= 2 ? 1.15 : 1.8, aspect = S.mission.image.width / S.mission.image.height;
    const a = { ...spot.hintArea, r: spot.hintArea.r * k };
    el.style.left = `${(a.cx - a.r) * 100}%`; el.style.top = `${(a.cy - a.r * aspect) * 100}%`;
    el.style.width = `${a.r * 2 * 100}%`; el.style.height = `${a.r * 2 * aspect * 100}%`;
    el.dataset.task = spot.id; el.classList.toggle("is-wide", level < 2);
    el.hidden = false; el.classList.remove("is-on"); void el.offsetWidth; el.classList.add("is-on");
  }

  // ───────────────────────── mapa de atenção (local, para a equipa avaliar o jogo) ─────────────────────────
  let attentionDirty = false, attentionTimer = null;
  function attend(point, weight) {
    if (!S.mission || !point) return;
    S.progress = recordAttention(S.progress, S.mission.missionId, point, weight);
    attentionDirty = true;
    if (!attentionTimer) attentionTimer = later(() => { attentionTimer = null; if (attentionDirty) { attentionDirty = false; save(); } }, 2000);
  }
  // Grelha suavizada desenhada em canvas, cor de dados (não a cor de marca), opacidade proporcional à atenção.
  function drawHeat(el, bins) {
    if (!el) return;
    const { cols, rows } = ATTENTION_GRID, W = el.width = cols * 8, H = el.height = rows * 8, ctx = el.getContext("2d");
    ctx.clearRect(0, 0, W, H);
    const max = bins ? Math.max(...bins) : 0;
    if (!max) return;
    ctx.fillStyle = getComputedStyle(root).getPropertyValue("--ml-color-info-300").trim() || "currentColor";
    bins.forEach((v, i) => { if (!v) return; ctx.globalAlpha = 0.15 + 0.65 * (v / max); ctx.fillRect((i % cols) * 8, Math.floor(i / cols) * 8, 8, 8); });
    ctx.globalAlpha = 1;
  }
  function drawAlbumHeat() {
    root.querySelectorAll("[data-dm-heatmap]").forEach(el => drawHeat(el, S.progress.metrics?.attention?.[el.dataset.dmHeatmap]));
  }

  // ───────────────────────── guia (avatar futuro) ─────────────────────────
  // guide(mood, texto, acções, ms) — mood: neutral | curious | discovery | celebrate. Nunca rouba o foco.
  function guide(mood, text, buttons = [], ms = 9000) {
    const el = root.querySelector("[data-dm-guide]"); if (!el) return;
    clearTimeout(guideTimer);
    el.dataset.mood = mood;
    el.querySelector("[data-dm-guide-text]").textContent = text;
    el.querySelector("[data-dm-guide-actions]").innerHTML = buttons.map(b => `<button type="button" class="dm-btn dm-btn--small ${b.primary ? "dm-btn--primary" : ""}" data-act="${b.act}" ${b.task ? `data-task="${b.task}"` : ""}>${esc(b.label)}</button>`).join("");
    el.hidden = false; el.classList.remove("is-in"); void el.offsetWidth; el.classList.add("is-in");
    if (ms) guideTimer = later(() => { el.hidden = true; }, ms);
  }
  function hideGuide() { const el = root.querySelector("[data-dm-guide]"); if (el) el.hidden = true; }

  // Inactividade: uma sugestão curta, sem insistência.
  function poke() {
    clearTimeout(idleTimer);
    if (S.screen !== "play" || S.runDone || S.run?.completedOnce) return;
    idleTimer = later(() => {
      if (S.dialog || S.briefing || S.screen !== "play") return;
      if (!S.loupe) guide("curious", GUIDE.idle, [{ act: "loupe", label: "Usar a lupa", primary: true }], 12000);
      else guide("curious", "Experimenta pedir uma pista!", [{ act: "hint", label: "Pista", primary: true }], 12000);
    }, IDLE_MS);
  }

  // ───────────────────────── jogo ─────────────────────────
  function step(id) {
    if (!S.run || S.runDone || S.mission?.kind !== "tutorial" || S.run.steps.includes(id)) return;
    S.run = markStep(S.run, id); persistRun();
    maybeComplete();
  }

  // Missão em curso: guardada até ser concluída; depois, os extra entram directamente no caderno.
  function persistRun() {
    if (!S.run || S.runDone || S.run.completedOnce) return;
    S.progress = { ...S.progress, current: { ...S.run } }; save();
  }

  // Recompensas em três tempos: imediata (contorno do objecto, som), breve (cartão do objectivo e pontos)
  // e educativa (o guia oferece «saber mais», sem bloquear a próxima acção).
  function rewardDiscovery(task, points) {
    const t0 = now();
    S.lastFound = task.id;
    if (task.type === "find") drawOutlines(task.id);
    const zone = root.querySelector("[data-dm-hintzone]"); if (zone && (!zone.dataset.task || zone.dataset.task === task.id)) zone.hidden = true;
    refreshObjectives();
    sound("found");
    S.progress = bumpMetric(S.progress, "feedbackMs", now() - t0);
    if (!S.firstFound) { S.firstFound = true; S.progress = bumpMetric(S.progress, "firstDiscoveryMs", Date.now() - S.startedAt); }
    S.progress = bumpMetric(S.progress, "discoveries"); if (task.optional) S.progress = bumpMetric(S.progress, "optionalDiscoveries");
    save();
    animateScore(points);
    guide("discovery", GUIDE.found, [], 2500);
    showDiscovery(task, { auto: true });
    announce(`Descoberta: ${task.title}. Mais ${points} pontos.`);
    poke();
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

  // «Saber mais»: cartão breve com o texto completo, certeza e fonte. Fecha-se e o jogo continua.
  function showDiscovery(task, { auto = false } = {}) {
    const card = root.querySelector("[data-dm-discovery]"); if (!card || !task) return;
    const memory = task.compare?.id || S.mission.image.memoryRef;
    card.innerHTML = `<span class="dm-obj__pic">${objPic(task)}</span>
      <div><p class="dm-eyebrow">${esc(LAYERS[task.layer].label)} · +${S.run.points[task.id] ?? 0} pontos</p>
      <h3>${esc(task.title)}</h3>
      <p>${esc(task.discovery.text)}</p>
      <p class="dm-discovery__meta"><span class="dm-cert dm-cert--${task.discovery.certainty}">${certaintyText(task.discovery.certainty)}</span> Fonte: ${esc(task.discovery.source)} · <a href="#/museu/memorias/${esc(memory)}">${esc(memory)}</a></p>
      <button type="button" class="dm-btn dm-btn--small dm-btn--primary" data-act="ack">Continuar a investigar</button></div>`;
    card.hidden = false; card.classList.remove("is-in"); void card.offsetWidth; card.classList.add("is-in");
    if (!auto) hideGuide();
    sound("paper"); step("read");
    if (!auto) card.querySelector(".dm-btn")?.focus({ preventScroll: true });
  }
  function hideDiscovery() { const card = root.querySelector("[data-dm-discovery]"); if (card) card.hidden = true; }

  function investigate(point, via) {
    if (S.dialog || S.briefing || !S.run || S.runDone) return;
    hideDiscovery();
    attend(point, 3);
    const rect = canvas.getBoundingClientRect();
    const tol = via === "pointer" ? touchTolerance(S.mission.image, rect.width) : touchTolerance(S.mission.image, rect.width, 6);
    const outcome = registerTap(S.run, S.mission, point, tol);
    S.run = outcome.run;
    if (outcome.result === "found") {
      if (S.mission.kind === "tutorial") S.run = markStep(S.run, "tap");
      S.selected = null; persistRun();
      rewardDiscovery(outcome.hotspot, outcome.points);
      if (!pendingRequired()) maybeCompleteSoon();
    } else if (outcome.result === "already") {
      announce(`Já encontraste: ${outcome.hotspot.title}.`);
    } else {
      ripple(point); persistRun(); metric("misses");
      if (outcome.near) guide("curious", outcome.near.id === S.selected ? "Estás muito perto! Procura mesmo à volta deste ponto." : "Estás perto de uma pista! Olha com atenção à volta.", [], 4500);
      else if (outcome.suggestHelp) guide("curious", "Nem todas as pistas são fáceis de encontrar! Experimenta a lupa ou observa outra parte da fotografia.", [{ act: "hint", label: "Dá-me uma pista" }], 9000);
      else announce("Aqui ainda não há pista. Continua a observar.");
    }
  }

  const pendingRequired = () => requiredTasks(S.mission).some(t => !S.run.found.includes(t.id));
  // A celebração dá tempo para ler o resultado da última descoberta (~2,6 s); nunca começa outra missão sozinha.
  function maybeCompleteSoon() { later(() => { if (!S.dialog && !maybeComplete()) pendingHelp(); }, calm() ? 400 : 2600); }

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
    rewardDiscovery(res.task, res.points);
    if (!pendingRequired()) maybeCompleteSoon();
  }

  function refreshObjectives() {
    const current = root.querySelector("[data-dm-objectives]"); if (!current) return;
    const tmp = document.createElement("div"); tmp.innerHTML = objectivesHtml();
    const scroll = current.querySelector("ol")?.scrollTop || 0;
    current.replaceWith(tmp.firstElementChild);
    const list = root.querySelector("[data-dm-objectives] ol"); if (list) list.scrollTop = scroll;
  }

  // Selo: carimba-se sobre a fotografia e voa até ao Caderno pousado na mesa.
  function stampToNotebook(label, done) {
    const table = root.querySelector("[data-dm-table]"), book = root.querySelector("[data-dm-notebook]");
    if (!table || !book || calm()) { done(); return; }
    const el = document.createElement("div");
    el.className = "dm-flystamp"; el.innerHTML = stampSvg(label);
    table.appendChild(el);
    const s = el.getBoundingClientRect(), b = book.getBoundingClientRect();
    el.style.setProperty("--dx", `${Math.round(b.left + b.width / 2 - (s.left + s.width / 2))}px`);
    el.style.setProperty("--dy", `${Math.round(b.top + b.height / 2 - (s.top + s.height / 2))}px`);
    el.classList.add("is-on");
    later(() => { el.remove(); done(); }, 1500);
  }

  function maybeComplete() {
    if (!S.run || S.runDone || S.run.completedOnce || !isComplete(S.run, S.mission) || S.dialog) return false;
    const before = levelFor(completedIds().length);
    S.run = { ...S.run, completedOnce: true };
    S.progress = recordCompletion(S.progress, S.run, new Date());
    S.progress = bumpMetric(S.progress, "missionsCompleted"); save();
    const after = levelFor(completedIds().length);
    S.completion = { mission: S.mission, run: S.run, before, after };
    clearTimeout(idleTimer); hideDiscovery();
    sound("complete");
    guide("celebrate", GUIDE.done, [], 0);
    root.querySelector("[data-dm-canvas]")?.classList.add("is-solved");
    later(() => stampToNotebook(S.mission.reward?.label || "Investigação concluída", () => {
      const book = root.querySelector("[data-dm-notebook]");
      if (book) { const tmp = document.createElement("div"); tmp.innerHTML = notebookObjHtml(); const fresh = tmp.firstElementChild; book.replaceWith(fresh); fresh.classList.add("is-bump"); }
      later(() => { S.dialog = "completed"; render(); }, calm() ? 0 : 400);
    }), calm() ? 0 : 500);
    return true;
  }

  function startMission(id) {
    const m = missionById(id);
    if (!m) { S.error = { message: `A missão «${id}» não existe ou não está disponível.` }; S.screen = "error"; S.dialog = null; render(); return; }
    if (!unlocked().includes(id)) { S.notice = `«${m.title}» abre depois de concluíres a fotografia anterior.`; S.screen = "board"; S.dialog = null; render(); return; }
    S.mission = m; S.notice = ""; S.completion = null; S.lastFound = null; S.objectivesOpen = false;
    const saved = S.progress.current?.missionId === id ? S.progress.current : null;
    S.run = saved ? { ...createRun(m), ...saved, status: "mission" } : createRun(m);
    S.runDone = false; S.firstFound = S.run.found.length > 0; S.startedAt = Date.now();
    S.zoom = { s: 1, x: 0, y: 0 }; S.cursor = { x: 0.5, y: 0.5 }; S.selected = null; S.dialog = null; S.screen = "play";
    S.briefing = S.run.found.length === 0;
    if (!saved) S.progress = bumpMetric(S.progress, "missionsStarted");
    persistRun(); render();
    announce(`${m.title}. ${requiredTasks(m).length} objectos para encontrar.`);
    if (!S.briefing) { guide("curious", `Continuamos: faltam ${requiredTasks(m).filter(t => !S.run.found.includes(t.id)).length} objectos.`, [], 5000); poke(); }
  }

  function begin() {
    S.briefing = false; S.startedAt = Date.now();
    root.querySelector("[data-dm-brief]")?.remove();
    root.querySelector("[data-dm-stage]")?.focus({ preventScroll: true });
    guide("curious", S.mission.opening || GUIDE.start, [], 7000);
    poke();
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
      if (was === "notebook") step("notebook");
      root.querySelector("[data-dm-stage]")?.focus({ preventScroll: true });
      pendingHelp(); poke();
    }
  }

  function pendingHelp() {
    if (S.mission?.kind !== "tutorial" || !S.run || S.run.completedOnce) return;
    const pending = pendingTutorialSteps(S.run);
    if (!pendingRequired() && pending.length) guide("curious", `Fizeste todas as descobertas! Para terminar o treino falta: ${pending.map(item => item.label.toLowerCase()).join("; ")}.`, [], 10000);
  }

  function describePanel() {
    const panel = root.querySelector("[data-dm-describe]"); if (!panel) return;
    if (!panel.hidden) { panel.hidden = true; return; }
    panel.innerHTML = `<p class="dm-eyebrow">Explorar por descrição</p><p>Escolhe uma zona da fotografia para a investigar.</p>
      <ul>${findZones(S.mission).map(z => `<li><button type="button" class="dm-zone" data-act="zone" data-zone="${z.id}">${esc(z.label)}</button></li>`).join("")}</ul>
      <button type="button" class="dm-btn dm-btn--small" data-act="describe">Fechar</button>`;
    panel.hidden = false; panel.querySelector(".dm-zone")?.focus();
  }

  function refreshTools() {
    const current = root.querySelector("[data-dm-tools]"); if (!current) return;
    const tmp = document.createElement("div"); tmp.innerHTML = toolsHtml();
    current.replaceWith(tmp.firstElementChild);
  }

  // ───────────────────────── acções ─────────────────────────
  const actions = {
    start: goStart,
    begin,
    howto: () => { S.dialog = "howto"; render(); },
    "close-dialog": () => closeDialog(),
    intro: () => { S.screen = "intro"; S.dialog = null; render(); },
    board: () => { persistRun(); S.screen = "board"; S.dialog = null; render(); },
    album: el => { persistRun(); if (el?.dataset.page) S.albumPage = Number(el.dataset.page); S.screen = "album"; S.dialog = null; S.confirmClear = false; render(); },
    notebook: el => {
      persistRun(); if (el?.dataset.page) S.albumPage = Number(el.dataset.page); S.confirmClear = false; sound("paper");
      if (S.screen === "play") S.dialog = "notebook"; else { S.screen = "album"; S.dialog = null; }
      render();
    },
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
      drawAlbumHeat();
    },
    play: el => startMission(el.dataset.mission),
    pause: () => { S.dialog = "paused"; render(); },
    resume: () => closeDialog(),
    more: el => showDiscovery(taskById(el.dataset.task)),
    ack: () => { hideDiscovery(); if (!pendingRequired()) maybeComplete(); root.querySelector("[data-dm-stage]")?.focus({ preventScroll: true }); },
    ask: el => { S.question = el.dataset.task; S.questionNote = ""; S.dialog = "question"; render(); sound("paper"); },
    answer: el => answer(el.dataset.option),
    retry: () => (S.mission ? startMission(S.mission.missionId) : goStart()),
    sound: () => { S.progress = { ...S.progress, prefs: { ...S.progress.prefs, sound: !S.progress.prefs.sound } }; save(); refreshTools(); sound("found"); },
    loupe: () => {
      S.loupe = !S.loupe; hideLoupe(); refreshTools();
      root.querySelector("[data-dm-stage]")?.classList.toggle("is-loupe", S.loupe);
      if (S.loupe) guide("neutral", finePointer() ? "Passa a lupa sobre a fotografia e clica quando encontrares." : "Arrasta o dedo: a lupa mostra o pormenor acima dele. Levanta para investigar.", [], 5000);
      else hideGuide();
      step("zoom"); poke();
    },
    objectives: () => { S.objectivesOpen = !S.objectivesOpen; refreshObjectives(); },
    describe: describePanel,
    "describe-open": () => { closeDialog(); describePanel(); },
    heat: () => { S.heat = !S.heat; closeDialog(); },
    "zoom-in": () => zoomAt(1.4),
    "zoom-out": () => zoomAt(1 / 1.4),
    "zoom-reset": () => { S.zoom = { s: 1, x: 0, y: 0 }; applyTransform(); },
    "select-clue": el => {
      const id = el.dataset.clue;
      if (S.run?.found.includes(id)) { showDiscovery(taskById(id)); return; }
      S.selected = S.selected === id ? null : id; refreshObjectives();
      root.querySelector(`[data-obj="${id}"] button`)?.focus();
    },
    hint: () => {
      if (!S.run || S.runDone) return;
      const { run, task, level } = applyHint(S.run, S.mission, S.selected);
      if (!task) return;
      S.run = run; persistRun(); metric("hintsUsed"); step("hint");
      S.selected = task.id; refreshObjectives();
      if (level >= 2 && task.type === "find") { showHintZone(task, 2); guide("curious", `Está mesmo aqui dentro: «${task.clue}». Toca no objecto.`, [], 8000); }
      else if (task.type === "find") { showHintZone(task, 1); guide("curious", `${task.hint} Procura dentro do círculo.`, [{ act: "hint", label: "Aproxima a zona" }], 10000); }
      else if (level >= 2) guide("curious", `${task.hint} Abre o cartão para responderes.`, [{ act: "ask", task: task.id, label: "Responder", primary: true }], 10000);
      else guide("curious", task.hint, [{ act: "hint", label: "Mostra-me a zona" }], 10000);
      poke();
    },
    zone: el => {
      const zone = findZones(S.mission).find(z => z.id === el.dataset.zone);
      if (zone) { S.cursor = { x: zone.x, y: zone.y }; drawCursor(); investigate({ x: zone.x, y: zone.y }, "zone"); }
    },
    clear: () => { S.confirmClear = true; render(); root.querySelector("[data-act='clear-cancel']")?.focus(); },
    "clear-cancel": () => { S.confirmClear = false; render(); },
    "clear-confirm": () => { S.progress = clearProgress(storage); S.run = null; S.confirmClear = false; S.screen = "intro"; S.dialog = null; render(); announce("Caderno apagado."); }
  };

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
    if (!dialog) {
      if (event.key === "Escape" && S.screen === "play") {
        hideDiscovery(); hideGuide();
        const panel = root.querySelector("[data-dm-describe]"); if (panel) panel.hidden = true;
        if (S.loupe) actions.loupe();
      }
      return;
    }
    if (event.key === "Escape") { event.preventDefault(); closeDialog(); return; }
    if (event.key !== "Tab") return;
    const items = [...dialog.querySelectorAll("button:not([disabled]),a[href],input,summary")];
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
      if (loupeFrame) cancelAnimationFrame(loupeFrame);
      if (attentionDirty) save();
      timers.forEach(clearTimeout); timers.clear();
      try { audio?.close(); } catch { /* */ }
      persistRun();
    }
  };
}

export const POINTS_TABLE = POINTS_BY_HINT;
