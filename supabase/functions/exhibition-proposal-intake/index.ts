/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Edge Function: recebe propostas do formulário "Quero expor" e notifica a equipa por e-mail.
 * - Não grava em base de dados (apenas notificação).
 * - Destinatários, remetente e credenciais do fornecedor vêm de variáveis de ambiente (secrets);
 *   nunca são hardcoded nem registados em logs (regras 08h / 08e / secrets).
 * - E-mail desativado por omissão: sem secrets configurados a função falha fechada.
 */

const ALLOWED_ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") || "")
  .split(",").map(v => v.trim()).filter(Boolean);
// Destinatários internos (secret). Default esperado em produção:
// a78190@ualg.pt,fernando.jacomo@yahoo.com — definido via secret, não aqui.
const RECIPIENTS = (Deno.env.get("EXPOR_NOTIFY_RECIPIENTS") || "")
  .split(",").map(v => v.trim()).filter(Boolean);
const EMAIL_FROM = Deno.env.get("EXPOR_EMAIL_FROM") || "";
const RESEND_API_KEY = Deno.env.get("EXPOR_RESEND_API_KEY") || "";

function isOriginAllowed(request: Request) {
  const origin = request.headers.get("origin") || "";
  if (!origin) return true;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  if (!ALLOWED_ORIGINS.length && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return true;
  return false;
}
function corsHeaders(request: Request) {
  const origin = request.headers.get("origin") || "";
  return {
    "Access-Control-Allow-Origin": isOriginAllowed(request) ? (origin || "*") : "null",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
    "Content-Type": "application/json",
  };
}
function reply(request: Request, status: number, payload: unknown) {
  return new Response(JSON.stringify(payload), { status, headers: corsHeaders(request) });
}
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const clip = (v: unknown, n: number) => String(v ?? "").trim().slice(0, n);

function buildEmail(p: Record<string, string>, reference: string) {
  const line = (label: string, value: string) => (value ? `${label}: ${value}\n` : "");
  const text =
    `Nova proposta "Quero expor" — ${reference}\n\n` +
    line("Nome", p.name) +
    line("E-mail", p.email) +
    line("Telefone", p.phone) +
    line("Organização/coletivo", p.organisation) +
    line("Tipo de espaço", p.spaceType) +
    line("Espaço/local", p.venue) +
    line("Localidade", p.locality) +
    line("Datas pretendidas", p.dates) +
    line("Idioma do formulário", p.language) +
    `\nDescrição da proposta:\n${p.message}\n` +
    (p.needs ? `\nCondições/necessidades:\n${p.needs}\n` : "") +
    `\n— Enviado pelo formulário público de projectomilreu.pt. Responder diretamente a ${p.email}.`;
  return text;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(request) });
  if (request.method !== "POST") return reply(request, 405, { ok: false, error: "method_not_allowed" });
  if (!isOriginAllowed(request)) return reply(request, 403, { ok: false, error: "origin_not_allowed" });

  let body: any;
  try { body = await request.json(); } catch { return reply(request, 400, { ok: false, error: "invalid_json" }); }

  // Honeypot: submissões automáticas preenchem "website" — aceitar silenciosamente sem notificar.
  if (clip(body?.website, 200)) return reply(request, 200, { ok: true, data: { reference: null } });

  const raw = body?.payload || {};
  const p: Record<string, string> = {
    name: clip(raw.name, 160),
    email: clip(raw.email, 180),
    phone: clip(raw.phone, 60),
    organisation: clip(raw.organisation, 180),
    spaceType: clip(raw.spaceType, 60),
    venue: clip(raw.venue, 180),
    locality: clip(raw.locality, 120),
    dates: clip(raw.dates, 160),
    message: clip(raw.message, 5000),
    needs: clip(raw.needs, 2000),
    language: clip(raw.language, 10) || "pt-PT",
  };
  if (!p.name || !isEmail(p.email) || p.message.length < 10 || raw.privacyAccepted !== true) {
    return reply(request, 422, { ok: false, error: "invalid_payload" });
  }

  if (!RESEND_API_KEY || !EMAIL_FROM || !RECIPIENTS.length) {
    // E-mail não ativado neste ambiente (sem secrets). Falha fechada, sem revelar config.
    return reply(request, 503, { ok: false, error: "edge_function_not_configured" });
  }

  const reference = `EXPO-${Date.now().toString(36).toUpperCase()}`;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: RECIPIENTS,
        reply_to: p.email,
        subject: `Quero expor — ${p.name}${p.locality ? " (" + p.locality + ")" : ""} · ${reference}`,
        text: buildEmail(p, reference),
      }),
    });
    if (!res.ok) {
      // Não registar corpo/destinatários; apenas o estado.
      console.error("exhibition-proposal email send failed", res.status);
      return reply(request, 502, { ok: false, error: "email_send_failed" });
    }
  } catch (_e) {
    console.error("exhibition-proposal email send error");
    return reply(request, 502, { ok: false, error: "email_send_failed" });
  }

  return reply(request, 200, { ok: true, data: { reference } });
});
