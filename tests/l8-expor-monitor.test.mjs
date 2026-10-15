/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * L8 — monitorização do «Quero expor»: testes determinísticos sem rede (sondas e GitHub simulados).
 */
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { checkOnce, nextState, emptyState, deliverAlert, alertText, main, SITE_ORIGIN } from "../scripts/monitor/expor-health.mjs";

const ENDPOINT = "https://abcdefghijklmnopqrst.supabase.co/functions/v1/exhibition-proposal-intake";
const err = (code, message = code) => Object.assign(new Error(message), { code });

// Sondas simuladas: por omissão, tudo saudável (como a função publicada a 05-10).
function probes(overrides = {}) {
  return {
    siteConfig: async () => ({ exhibitionProposalEndpoint: ENDPOINT }),
    dns: async () => ["104.18.0.1"],
    tls: async () => ({ authorized: true, validTo: "Jan 1 2027" }),
    http: async (_url, { method }) => method === "OPTIONS"
      ? { status: 204, headers: { "access-control-allow-origin": SITE_ORIGIN }, body: "" }
      : { status: 405, headers: {}, body: '{"ok":false,"error":"method_not_allowed"}' },
    ...overrides,
  };
}

function fakeGithub() {
  const calls = [];
  let open = null, next = 100;
  return {
    calls,
    findOpen: async () => open,
    create: async (title, body) => { calls.push(["create", title, body]); open = next++; return open; },
    comment: async (number, body) => { calls.push(["comment", number, body]); },
    close: async number => { calls.push(["close", number]); open = null; },
  };
}

const T0 = Date.parse("2026-10-15T12:00:00Z"), STEP = 30 * 60 * 1000;

test("endpoint disponível → ok (o 405 do GET é resposta esperada, não falha)", async () => {
  const r = await checkOnce({ probes: probes() });
  assert.equal(r.outcome, "ok");
  assert.deepEqual(r.steps.map(s => s.step), ["dns", "tls", "options", "get"]);
});

test("DNS NXDOMAIN (incidente de 2026-10-15) → falha dns", async () => {
  const r = await checkOnce({ probes: probes({ dns: async () => { throw err("ENOTFOUND", "queryA ENOTFOUND"); } }) });
  assert.equal(r.outcome, "fail"); assert.equal(r.component, "dns"); assert.equal(r.kind, "dns");
});

test("timeout (DNS, TLS ou HTTP) → falha timeout", async () => {
  for (const o of [{ dns: async () => { throw err("ETIMEOUT"); } }, { tls: async () => { throw err("ETIMEOUT", "tls timeout"); } },
    { http: async () => { throw Object.assign(new Error("The operation was aborted due to timeout"), { name: "TimeoutError" }); } }]) {
    const r = await checkOnce({ probes: probes(o) });
    assert.equal(r.outcome, "fail"); assert.equal(r.kind, "timeout", JSON.stringify(r));
  }
});

test("falha TLS (certificado inválido ou expirado) → falha tls", async () => {
  for (const o of [{ tls: async () => { throw err("CERT_HAS_EXPIRED"); } }, { tls: async () => ({ authorized: false }) }]) {
    const r = await checkOnce({ probes: probes(o) });
    assert.equal(r.component, "tls"); assert.equal(r.kind, "tls");
  }
});

test("respostas HTTP inesperadas distinguem-se das esperadas", async () => {
  const cases = [
    [{ status: 503, headers: {}, body: "" }, "server_error"],
    [{ status: 540, headers: {}, body: "project paused" }, "server_error"],
    [{ status: 404, headers: {}, body: "" }, "not_found"],
    [{ status: 204, headers: { "access-control-allow-origin": "null" }, body: "" }, "cors_mismatch"],
    [{ status: 301, headers: {}, body: "" }, "unexpected_status"],
  ];
  for (const [options, kind] of cases) {
    const r = await checkOnce({ probes: probes({ http: async (_u, { method }) => method === "OPTIONS" ? options : { status: 405, body: "method_not_allowed" } }) });
    assert.equal(r.kind, kind, `OPTIONS ${options.status}`);
  }
  // GET 200 (esperado 405) também é inesperado.
  const r = await checkOnce({ probes: probes({ http: async (_u, { method }) => method === "OPTIONS" ? { status: 204, headers: { "access-control-allow-origin": SITE_ORIGIN } } : { status: 200, body: "ok" } }) });
  assert.equal(r.kind, "unexpected_status");
});

test("máquina de estados: 1 falha DEGRADED, 2 consecutivas DOWN (alerta só uma vez), recuperação RECOVERED", () => {
  const fail = { outcome: "fail", component: "dns", kind: "dns", detail: "ENOTFOUND" }, ok = { outcome: "ok", component: "function", kind: "reachable" };
  let s = emptyState(), a;
  ({ state: s, alert: a } = nextState(s, ok, T0)); assert.equal(s.state, "HEALTHY"); assert.equal(a, null);
  ({ state: s, alert: a } = nextState(s, fail, T0 + STEP)); assert.equal(s.state, "DEGRADED"); assert.equal(a, null);
  ({ state: s, alert: a } = nextState(s, fail, T0 + 2 * STEP)); assert.equal(s.state, "DOWN"); assert.equal(a.type, "down");
  ({ state: s, alert: a } = nextState(s, fail, T0 + 3 * STEP)); assert.equal(s.state, "DOWN"); assert.equal(a, null, "sem alerta repetido");
  ({ state: s, alert: a } = nextState(s, ok, T0 + 4 * STEP)); assert.equal(s.state, "RECOVERED"); assert.equal(a.type, "recovered");
  ({ state: s, alert: a } = nextState(s, ok, T0 + 5 * STEP)); assert.equal(s.state, "HEALTHY"); assert.equal(a, null);
  // Falha transitória: DEGRADED e volta a HEALTHY sem alerta.
  ({ state: s, alert: a } = nextState(s, fail, T0 + 6 * STEP)); assert.equal(s.state, "DEGRADED");
  ({ state: s, alert: a } = nextState(s, ok, T0 + 7 * STEP)); assert.equal(s.state, "HEALTHY"); assert.equal(a, null);
  assert.ok(s.history.length <= 96);
});

test("UNKNOWN: sem dados não muda a disponibilidade; monitor cego 2 h → um alerta próprio", () => {
  const unknown = { outcome: "unknown", component: "monitor", kind: "no_endpoint", detail: "sem endpoint" };
  let s = emptyState(); let alerts = [];
  for (let i = 0; i < 6; i++) { const r = nextState(s, unknown, T0 + i * STEP); s = r.state; if (r.alert) alerts.push(r.alert.type); }
  assert.equal(s.state, "UNKNOWN"); assert.deepEqual(alerts, ["monitor_blind"]);
  // Depois de HEALTHY, 1 UNKNOWN mantém HEALTHY (não declara falha sem prova).
  let h = nextState(emptyState(), { outcome: "ok" }, T0).state;
  h = nextState(h, unknown, T0 + STEP).state; assert.equal(h.state, "HEALTHY");
});

test("alertas: uma issue em DOWN, sem duplicados, fecho com comentário na recuperação", async () => {
  const gh = fakeGithub();
  const down = { ...emptyState(), state: "DOWN", failures: 2, since: "2026-10-15T13:00:00.000Z", lastFailure: { component: "dns", kind: "dns", detail: "ENOTFOUND" } };
  const r1 = await deliverAlert({ type: "down" }, down, { host: "abcdefghijklmnopqrst.supabase.co" }, { github: gh, runUrl: "https://github.com/x/y/actions/runs/1" });
  assert.equal(r1.action, "opened");
  // Estado perdido (cache expirada) e nova transição para DOWN: comenta a issue existente, não abre outra.
  const r2 = await deliverAlert({ type: "down" }, { ...down, openIssue: null }, {}, { github: gh, runUrl: "" });
  assert.equal(r2.action, "updated"); assert.equal(gh.calls.filter(c => c[0] === "create").length, 1);
  const r3 = await deliverAlert({ type: "recovered" }, { ...down, state: "RECOVERED", openIssue: null }, {}, { github: gh, runUrl: "" });
  assert.equal(r3.action, "closed"); assert.ok(gh.calls.some(c => c[0] === "close"));
  // Conteúdo: data UTC, componente, tipo, evidência; sem host completo, sem segredos nem dados pessoais.
  const text = alertText({ type: "down" }, down, { host: "abcdefghijklmnopqrst.supabase.co" }, { runUrl: "https://github.com/x/y/actions/runs/1" });
  assert.match(text.body, /2026-10-15T13:00:00\.000Z \(UTC\)/); assert.match(text.title, /dns \/ dns/); assert.match(text.body, /actions\/runs\/1/);
  assert.doesNotMatch(text.body, /abcdefghijklmnopqrst|token|@[a-z]+\.[a-z]/i);
  assert.match(alertText({ type: "recovered" }, { since: "x" }, {}).body, /não.*que o e-mail é entregue/);
});

test("monitor: configuração do site ilegível usa a variável; sem nenhuma → UNKNOWN; desvio assinalado", async () => {
  const noSite = probes({ siteConfig: async () => { throw new Error("HTTP 500"); } });
  assert.equal((await checkOnce({ probes: noSite, repoVar: ENDPOINT })).outcome, "ok");
  assert.equal((await checkOnce({ probes: noSite, repoVar: "" })).outcome, "unknown");
  const drift = await checkOnce({ probes: probes(), repoVar: ENDPOINT.replace("abcd", "zzzz") });
  assert.ok(drift.notes.some(n => /difere/.test(n)));
  assert.equal((await checkOnce({ probes: probes({ siteConfig: async () => ({ exhibitionProposalEndpoint: "https://evil.example/x" }) }) })).outcome, "unknown");
});

test("main: estado persiste entre execuções; erro da API do GitHub não perde o alerta (repete na seguinte)", async () => {
  const dir = mkdtempSync(join(tmpdir(), "l8-")); const env = { L8_STATE_FILE: join(dir, "state.json"), GITHUB_STEP_SUMMARY: join(dir, "summary.md") };
  const failing = probes({ dns: async () => { throw err("ENOTFOUND"); } });
  const broken = { findOpen: async () => null, create: async () => { throw new Error("GitHub API 502"); }, comment: async () => {}, close: async () => {} };
  await main({ env, probes: failing, now: T0, github: broken });
  const second = await main({ env, probes: failing, now: T0 + STEP, github: broken });
  assert.equal(second.state.state, "DOWN"); assert.equal(second.alertResult.action, "error");
  assert.equal(JSON.parse(readFileSync(env.L8_STATE_FILE, "utf8")).pendingAlert, "down");
  const gh = fakeGithub();
  const third = await main({ env, probes: failing, now: T0 + 2 * STEP, github: gh });
  assert.equal(third.alertResult.action, "opened", "alerta pendente entregue");
  assert.match(readFileSync(env.GITHUB_STEP_SUMMARY, "utf8"), /🔴 DOWN/);
  const fourth = await main({ env, probes: probes(), now: T0 + 3 * STEP, github: gh });
  assert.equal(fourth.state.state, "RECOVERED"); assert.equal(fourth.alertResult.action, "closed");
  // Excepção inesperada numa sonda → UNKNOWN, sem rebentar.
  const exploded = await main({ env, probes: probes({ siteConfig: async () => { throw new Error("x"); }, dns: async () => { throw new TypeError("bug"); } }), now: T0 + 4 * STEP, github: gh });
  assert.ok(["RECOVERED", "HEALTHY", "DEGRADED", "UNKNOWN"].includes(exploded.state.state));
});

test("workflow: 30 em 30 min, permissões mínimas, Actions por SHA, sem POST nem secrets", () => {
  const wf = readFileSync(".github/workflows/l8-expor-monitor.yml", "utf8");
  assert.match(wf, /cron: "7,37 \* \* \* \*"/);
  assert.match(wf, /^permissions: \{\}$/m);
  assert.match(wf, /contents: read\n\s+issues: write/);
  assert.doesNotMatch(wf, /secrets\./);
  for (const [, ref] of wf.matchAll(/uses: (\S+)/g)) assert.match(ref, /@[0-9a-f]{40}$/, ref);
  const script = readFileSync("scripts/monitor/expor-health.mjs", "utf8");
  // Ao endpoint só se fazem OPTIONS e GET (nunca POST de propostas); POST só existe para a API de issues.
  const endpointCalls = [...script.matchAll(/probes\.http\(endpoint, \{ method: "([A-Z]+)"/g)].map(m => m[1]);
  assert.deepEqual(endpointCalls.sort(), ["GET", "OPTIONS"]);
});
