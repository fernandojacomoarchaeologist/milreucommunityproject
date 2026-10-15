// © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu.
// Consultar RIGHTS.md.
//
// L8 — monitorização de disponibilidade do formulário «Quero expor» (Item 2).
// Verifica, sem efeitos: DNS do domínio da Edge Function → TLS → OPTIONS (CORS do site) → GET (a função
// responde 405, prova que o código corre). Nunca faz POST de propostas, nunca envia e-mail.
// Estados: HEALTHY · DEGRADED · DOWN (2 falhas consecutivas) · RECOVERED · UNKNOWN (sem dados).
// Alertas: issue no GitHub ao entrar em DOWN (uma só, sem repetir); comentário + fecho ao recuperar.
// LIMITE: um health check não prova que o Resend entrega e-mails — só que a função está acessível.
// Sem dependências; a rede é injectável para testes (tests/l8-expor-monitor.test.mjs).

import { promises as dnsPromises } from "node:dns";
import tls from "node:tls";
import { readFile, writeFile, appendFile } from "node:fs/promises";

export const SITE_ORIGIN = "https://projectomilreu.pt";
export const SITE_CONFIG_URL = `${SITE_ORIGIN}/public/config/collaborative-area.runtime.json`;
export const ALERT_LABEL = "l8-monitor";
export const HISTORY_MAX = 96; // 48 h a cada 30 min
const TIMEOUT_MS = 10000;

// ---------- sondas (injectáveis) ----------

function withTimeout(promise, ms, kind) {
  let timer;
  return Promise.race([
    promise,
    new Promise((_, reject) => { timer = setTimeout(() => reject(Object.assign(new Error(`${kind} timeout`), { code: "ETIMEOUT" })), ms); }),
  ]).finally(() => clearTimeout(timer));
}

export const realProbes = {
  async dns(host) {
    const resolver = new dnsPromises.Resolver({ timeout: 5000, tries: 2 });
    resolver.setServers(["1.1.1.1", "8.8.8.8"]);
    return withTimeout(resolver.resolve4(host), TIMEOUT_MS, "dns");
  },
  tls(host) {
    return withTimeout(new Promise((resolve, reject) => {
      const socket = tls.connect({ host, port: 443, servername: host, rejectUnauthorized: true }, () => {
        const cert = socket.getPeerCertificate();
        resolve({ authorized: socket.authorized, validTo: cert?.valid_to || null });
        socket.end();
      });
      socket.on("error", reject);
    }), TIMEOUT_MS, "tls");
  },
  async http(url, { method, headers }) {
    const response = await fetch(url, { method, headers, redirect: "manual", signal: AbortSignal.timeout(TIMEOUT_MS) });
    let body = null;
    try { body = (await response.text()).slice(0, 300); } catch { /* corpo opcional */ }
    return { status: response.status, headers: Object.fromEntries(response.headers), body };
  },
  async siteConfig(url) {
    const response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS), headers: { "cache-control": "no-cache" } });
    if (!response.ok) throw Object.assign(new Error(`site config HTTP ${response.status}`), { code: "SITE_CONFIG" });
    return response.json();
  },
};

const errorKind = error => {
  const code = String(error?.code || error?.cause?.code || "");
  if (/ENOTFOUND|ENODATA|NXDOMAIN|ESERVFAIL|EREFUSED/.test(code)) return "dns";
  if (/ETIMEOUT|ETIMEDOUT|TimeoutError|ABORT_ERR/.test(code) || error?.name === "TimeoutError" || /timeout/i.test(error?.message || "")) return "timeout";
  if (/CERT|SSL|TLS|ERR_TLS|UNABLE_TO_VERIFY|DEPTH_ZERO|SELF_SIGNED/.test(code)) return "tls";
  if (/ECONNREFUSED|ECONNRESET|EHOSTUNREACH|ENETUNREACH/.test(code)) return "connection";
  return "unexpected";
};

// ---------- uma verificação ----------

// Resolve o endpoint que o site publicado usa (fonte de verdade para os visitantes); a variável do
// repositório serve de recurso e de comparação (desvio de configuração = aviso, não indisponibilidade).
export async function resolveEndpoint({ probes = realProbes, repoVar = "" } = {}) {
  let live = null, liveError = null;
  try {
    const config = await probes.siteConfig(SITE_CONFIG_URL);
    live = config?.exhibitionProposalEndpoint || null;
  } catch (error) { liveError = error.message; }
  const endpoint = live || repoVar || null;
  const notes = [];
  if (liveError) notes.push("configuração do site publicado ilegível; usada a variável do repositório");
  if (live && repoVar && live !== repoVar) notes.push("o endpoint do site publicado difere da variável MILREU_EXPOR_ENDPOINT");
  if (!live && !liveError) notes.push("o site publicado não tem endpoint (formulário em demonstração)");
  return { endpoint, notes };
}

export async function checkOnce({ probes = realProbes, repoVar = "" } = {}) {
  const { endpoint, notes } = await resolveEndpoint({ probes, repoVar });
  if (!endpoint || !/^https:\/\/[a-z0-9-]+\.supabase\.co\/functions\/v1\/[a-z0-9-]+$/i.test(endpoint)) {
    return { outcome: "unknown", component: "monitor", kind: "no_endpoint", detail: "sem endpoint válido para verificar", notes };
  }
  const host = new URL(endpoint).hostname;
  const steps = [];
  try {
    const addresses = await probes.dns(host);
    steps.push({ step: "dns", ok: true, detail: `${addresses.length} endereço(s)` });
  } catch (error) {
    return { outcome: "fail", component: "dns", kind: errorKind(error) === "timeout" ? "timeout" : "dns", detail: String(error.code || error.message), host, steps, notes };
  }
  try {
    const result = await probes.tls(host);
    if (!result.authorized) return { outcome: "fail", component: "tls", kind: "tls", detail: "certificado não autorizado", host, steps, notes };
    steps.push({ step: "tls", ok: true, detail: result.validTo ? `certificado válido até ${result.validTo}` : "certificado válido" });
  } catch (error) {
    const kind = errorKind(error);
    return { outcome: "fail", component: "tls", kind: kind === "unexpected" ? "tls" : kind, detail: String(error.code || error.message), host, steps, notes };
  }
  // OPTIONS (pré-pedido CORS do browser): esperado 2xx com Access-Control-Allow-Origin = site.
  let options;
  try {
    options = await probes.http(endpoint, { method: "OPTIONS", headers: { Origin: SITE_ORIGIN, "Access-Control-Request-Method": "POST", "Access-Control-Request-Headers": "content-type" } });
  } catch (error) {
    const kind = errorKind(error);
    return { outcome: "fail", component: "http", kind: kind === "unexpected" ? "connection" : kind, detail: String(error.code || error.message), host, steps, notes };
  }
  const allowOrigin = options.headers?.["access-control-allow-origin"] || "";
  if (options.status >= 500) return { outcome: "fail", component: "http", kind: "server_error", detail: `OPTIONS ${options.status}`, host, steps, notes };
  if (options.status === 404) return { outcome: "fail", component: "function", kind: "not_found", detail: "OPTIONS 404 (função inexistente?)", host, steps, notes };
  if (options.status < 200 || options.status > 299) return { outcome: "fail", component: "http", kind: "unexpected_status", detail: `OPTIONS ${options.status}`, host, steps, notes };
  if (allowOrigin !== SITE_ORIGIN) return { outcome: "fail", component: "cors", kind: "cors_mismatch", detail: `Access-Control-Allow-Origin=${allowOrigin || "(vazio)"}`, host, steps, notes };
  steps.push({ step: "options", ok: true, detail: `${options.status}, CORS do site permitido` });
  // GET: a função recusa com 405 method_not_allowed — resposta ESPERADA que prova que o código corre.
  let get;
  try {
    get = await probes.http(endpoint, { method: "GET", headers: { Origin: SITE_ORIGIN } });
  } catch (error) {
    const kind = errorKind(error);
    return { outcome: "fail", component: "http", kind: kind === "unexpected" ? "connection" : kind, detail: String(error.code || error.message), host, steps, notes };
  }
  if (get.status === 405 && /method_not_allowed/.test(get.body || "")) {
    steps.push({ step: "get", ok: true, detail: "405 method_not_allowed (esperado: a função está a correr)" });
    return { outcome: "ok", component: "function", kind: "reachable", detail: "DNS, TLS, CORS e função a responder", host, steps, notes };
  }
  if (get.status >= 500) return { outcome: "fail", component: "function", kind: "server_error", detail: `GET ${get.status}`, host, steps, notes };
  return { outcome: "fail", component: "function", kind: "unexpected_status", detail: `GET ${get.status} (esperado 405)`, host, steps, notes };
}

// ---------- estado ----------

export function emptyState() {
  return { state: "UNKNOWN", failures: 0, unknowns: 0, since: null, openIssue: null, lastFailure: null, history: [] };
}

// Transição pura: (estado anterior, resultado, agora) → novo estado + acção de alerta.
export function nextState(previous, result, now) {
  const prev = { ...emptyState(), ...(previous || {}) };
  const at = new Date(now).toISOString();
  const next = { ...prev, history: [...prev.history, { at, outcome: result.outcome, component: result.component, kind: result.kind }].slice(-HISTORY_MAX) };
  let alert = null;
  if (result.outcome === "unknown") {
    next.unknowns = prev.unknowns + 1;
    // Sem dados não se muda o estado de disponibilidade; só se assinala se o próprio monitor estiver cego há 2 h.
    if (next.unknowns === 4) alert = { type: "monitor_blind" };
    return { state: { ...next, state: prev.state === "UNKNOWN" || next.unknowns >= 4 ? "UNKNOWN" : prev.state }, alert };
  }
  next.unknowns = 0;
  if (result.outcome === "ok") {
    next.failures = 0;
    if (prev.state === "DOWN") { next.state = "RECOVERED"; next.since = at; alert = { type: "recovered" }; }
    else { next.state = "HEALTHY"; if (prev.state !== "HEALTHY") next.since = at; }
    return { state: next, alert };
  }
  next.failures = prev.failures + 1;
  next.lastFailure = { at, component: result.component, kind: result.kind, detail: result.detail };
  if (next.failures >= 2) {
    if (prev.state !== "DOWN") { next.state = "DOWN"; next.since = at; alert = { type: "down" }; }
    else next.state = "DOWN";
  } else {
    next.state = "DEGRADED";
    if (prev.state !== "DEGRADED") next.since = at;
  }
  return { state: next, alert };
}

// ---------- alertas (issues do GitHub) ----------

const shortHost = host => (host ? host.replace(/^([a-z0-9]{4})[a-z0-9]+\./i, "$1….") : "—");

export function alertText(alert, state, result, { runUrl = "" } = {}) {
  const evidence = runUrl ? `[execução do workflow](${runUrl})` : "registo do workflow";
  const failure = state.lastFailure || {};
  if (alert.type === "down") {
    return {
      title: `[L8] Formulário «Quero expor»: endpoint indisponível (${failure.component || "?"} / ${failure.kind || "?"})`,
      body: [
        `**Estado:** DOWN desde ${state.since} (UTC) — ${state.failures} verificações consecutivas com falha.`,
        `**Componente:** ${failure.component} · **tipo de falha:** ${failure.kind} · **detalhe:** ${failure.detail || "—"}`,
        `**Endpoint:** ${shortHost(result.host)}`,
        `**Evidência:** ${evidence}`,
        "",
        "Os visitantes vêem «A proposta não foi enviada» e a alternativa por e-mail (PR #164, quando publicado).",
        "Este alerta é actualizado (não repetido) e fecha-se sozinho quando o serviço recuperar.",
        "Diagnóstico e recuperação: `docs/website/INCIDENTE_2026-10-15_QUERO_EXPOR.md`.",
        "",
        "_Monitorização L8 — sem dados de visitantes; nenhuma proposta foi enviada._",
      ].join("\n"),
    };
  }
  if (alert.type === "recovered") {
    return {
      body: [
        `**Recuperado** em ${state.since} (UTC): DNS, TLS, CORS do site e função a responder.`,
        `**Evidência:** ${evidence}`,
        "",
        "⚠️ Isto prova que a função está acessível, **não** que o e-mail é entregue (Resend). Confirmar com uma proposta de teste autorizada.",
      ].join("\n"),
    };
  }
  return {
    title: "[L8] Monitorização do «Quero expor» sem dados há 2 h",
    body: [`A monitorização não conseguiu verificar o endpoint em 4 execuções seguidas (${result.detail}).`, `**Evidência:** ${evidence}`].join("\n"),
  };
}

export async function deliverAlert(alert, state, result, { github, runUrl }) {
  if (!alert || !github) return { action: "none" };
  const text = alertText(alert, state, result, { runUrl });
  if (alert.type === "recovered") {
    const open = state.openIssue || await github.findOpen(); // a cache pode ter expirado
    if (!open) return { action: "none", note: "sem issue aberta" };
    await github.comment(open, text.body);
    await github.close(open);
    return { action: "closed", issue: open };
  }
  // DOWN ou monitor cego: uma só issue aberta de cada vez (sem duplicados entre execuções).
  const existing = state.openIssue || await github.findOpen();
  if (existing) {
    if (alert.type === "down") await github.comment(existing, `Continua indisponível: ${state.lastFailure?.component}/${state.lastFailure?.kind} — ${runUrl || ""}`);
    return { action: "updated", issue: existing };
  }
  const issue = await github.create(text.title, text.body);
  return { action: "opened", issue };
}

export function githubClient({ token, repository, fetchImpl = fetch }) {
  const api = async (path, init = {}) => {
    const response = await fetchImpl(`https://api.github.com/repos/${repository}${path}`, {
      ...init,
      headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", "Content-Type": "application/json", ...(init.headers || {}) },
    });
    if (!response.ok && response.status !== 422) throw new Error(`GitHub API ${response.status} ${path}`);
    return response.status === 204 ? null : response.json();
  };
  return {
    async findOpen() {
      const issues = await api(`/issues?state=open&labels=${ALERT_LABEL}&per_page=5`);
      return issues?.[0]?.number || null;
    },
    async create(title, body) {
      await api("/labels", { method: "POST", body: JSON.stringify({ name: ALERT_LABEL, color: "b60205", description: "Alertas automáticos da monitorização L8" }) }); // 422 se já existe
      return (await api("/issues", { method: "POST", body: JSON.stringify({ title, body, labels: [ALERT_LABEL] }) })).number;
    },
    comment: (number, body) => api(`/issues/${number}/comments`, { method: "POST", body: JSON.stringify({ body }) }),
    close: number => api(`/issues/${number}`, { method: "PATCH", body: JSON.stringify({ state: "closed", state_reason: "completed" }) }),
  };
}

// ---------- resumo ----------

export function summaryMarkdown(state, result, alertResult) {
  const icon = { HEALTHY: "🟢", RECOVERED: "🟢", DEGRADED: "🟡", DOWN: "🔴", UNKNOWN: "⚪" }[state.state] || "⚪";
  const rows = (result.steps || []).map(s => `| ${s.step} | ${s.ok ? "ok" : "falha"} | ${s.detail} |`);
  if (result.outcome === "fail") rows.push(`| ${result.component} | **falha (${result.kind})** | ${result.detail} |`);
  return [
    `## L8 — «Quero expor»: ${icon} ${state.state}`,
    "",
    `Endpoint: ${shortHost(result.host)} · falhas consecutivas: ${state.failures} · desde: ${state.since || "—"}`,
    "",
    "| Verificação | Resultado | Detalhe |", "|---|---|---|", ...rows,
    "",
    ...(result.notes || []).map(note => `- ⚠️ ${note}`),
    alertResult?.action && alertResult.action !== "none" ? `- Alerta: ${alertResult.action} (issue #${alertResult.issue})` : "- Alerta: nenhum",
    "",
    "_Esta verificação não prova a entrega de e-mails (Resend). Nenhuma proposta foi enviada._",
  ].join("\n");
}

// ---------- execução (GitHub Actions) ----------

export async function main({ env = process.env, probes = realProbes, now = Date.now(), github = null } = {}) {
  const stateFile = env.L8_STATE_FILE || ".l8-state/state.json";
  let previous = emptyState();
  try { previous = JSON.parse(await readFile(stateFile, "utf8")); } catch { /* primeira execução ou cache expirada → UNKNOWN */ }
  let result;
  try {
    result = await checkOnce({ probes, repoVar: env.EXPOR_ENDPOINT_VAR || "" });
  } catch (error) {
    result = { outcome: "unknown", component: "monitor", kind: "monitor_error", detail: error.message, notes: [] };
  }
  const { state, alert: fresh } = nextState(previous, result, now);
  // Alerta que falhou na execução anterior (API do GitHub indisponível) é repetido, se ainda fizer sentido.
  let alert = fresh;
  if (!alert && state.pendingAlert) {
    const stillValid = (state.pendingAlert === "down" && state.state === "DOWN") || (state.pendingAlert === "recovered" && state.state !== "DOWN" && state.state !== "DEGRADED");
    alert = stillValid ? { type: state.pendingAlert } : null;
  }
  delete state.pendingAlert;
  const client = github || (env.GITHUB_TOKEN && env.GITHUB_REPOSITORY ? githubClient({ token: env.GITHUB_TOKEN, repository: env.GITHUB_REPOSITORY }) : null);
  let alertResult = { action: "none" };
  try {
    alertResult = await deliverAlert(alert, state, result, { github: client, runUrl: env.RUN_URL || "" });
    if (alertResult.action === "opened" || alertResult.action === "updated") state.openIssue = alertResult.issue;
    if (alertResult.action === "closed") state.openIssue = null;
  } catch (error) {
    alertResult = { action: "error", detail: error.message }; // o estado mantém-se; tenta de novo na próxima execução
    if (alert) state.pendingAlert = alert.type;
  }
  await writeFile(stateFile, JSON.stringify(state, null, 2) + "\n");
  const summary = summaryMarkdown(state, result, alertResult);
  if (env.GITHUB_STEP_SUMMARY) await appendFile(env.GITHUB_STEP_SUMMARY, summary + "\n");
  console.log(`L8 ${state.state} · ${result.component}/${result.kind} · falhas=${state.failures} · alerta=${alertResult.action}`);
  return { state, result, alertResult };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => { console.error(`L8: erro do monitor: ${error.message}`); process.exitCode = 1; });
}
