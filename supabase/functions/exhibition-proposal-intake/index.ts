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
 * - L3 (Item 2B, 2026-10-15): Origin obrigatório; JSON até 32 KB; campos só texto, com limites
 *   e listas fechadas; caracteres de controlo removidos antes do e-mail; erros genéricos.
 *   Lógica testável em ./lib.ts.
 */
import { buildEmail, buildSubject, isOriginAllowed, newReference, parseProposal, readJsonLimited } from "./lib.ts";

const ALLOWED_ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") || "")
  .split(",").map(v => v.trim()).filter(Boolean);
const RECIPIENTS = (Deno.env.get("EXPOR_NOTIFY_RECIPIENTS") || "")
  .split(",").map(v => v.trim()).filter(Boolean);
const EMAIL_FROM = Deno.env.get("EXPOR_EMAIL_FROM") || "";
const RESEND_API_KEY = Deno.env.get("EXPOR_RESEND_API_KEY") || "";

function corsHeaders(request: Request) {
  const origin = request.headers.get("origin");
  return {
    "Access-Control-Allow-Origin": isOriginAllowed(origin, ALLOWED_ORIGINS) ? (origin as string) : "null",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "600",
    "Vary": "Origin",
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  };
}
function reply(request: Request, status: number, payload: unknown) {
  return new Response(JSON.stringify(payload), { status, headers: corsHeaders(request) });
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(request) });
  if (request.method !== "POST") return reply(request, 405, { ok: false, error: "method_not_allowed" });
  // Sem Origin (pedidos fora do browser) ou de origem não permitida: recusar.
  if (!isOriginAllowed(request.headers.get("origin"), ALLOWED_ORIGINS)) return reply(request, 403, { ok: false, error: "origin_not_allowed" });

  const read = await readJsonLimited(request);
  if (!read.ok) return reply(request, read.status, { ok: false, error: read.error });
  const body = read.body as Record<string, unknown> | null;

  // Honeypot: submissões automáticas preenchem "website" — aceitar silenciosamente sem notificar.
  if (body && typeof body === "object" && typeof body.website === "string" && body.website.trim()) {
    return reply(request, 200, { ok: true, data: { reference: null } });
  }

  const parsed = parseProposal(body);
  if (!parsed.ok) return reply(request, 422, { ok: false, error: parsed.error });
  const p = parsed.value;

  if (!RESEND_API_KEY || !EMAIL_FROM || !RECIPIENTS.length) {
    // E-mail não ativado neste ambiente (sem secrets). Falha fechada, sem revelar config.
    return reply(request, 503, { ok: false, error: "edge_function_not_configured" });
  }

  const reference = newReference();
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: RECIPIENTS,
        reply_to: p.email,
        subject: buildSubject(p, reference),
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
