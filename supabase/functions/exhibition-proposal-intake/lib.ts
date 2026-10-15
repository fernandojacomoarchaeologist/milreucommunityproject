/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Lógica pura do formulário "Quero expor" (Item 2B — L3): validação de input, limites de
 * payload, normalização segura dos campos usados no e-mail. Sem dependências de Deno, para
 * poder ser testada em Node (tests/exhibition-proposal-intake-l3.test.mjs).
 */

export const MAX_BODY_BYTES = 32 * 1024;

export const LIMITS = {
  name: 160, email: 254, phone: 60, organisation: 180, spaceType: 40, venue: 180,
  locality: 120, dates: 160, message: 5000, needs: 2000, language: 10,
} as const;

export const SPACE_TYPES = ["centro-cultural", "escola", "biblioteca", "associacao", "autarquia", "museu", "outro"];
export const LANGUAGES = ["pt-PT", "en", "es", "fr"];
const MULTI_LINE = ["message", "needs"] as const;

export type Proposal = Record<keyof typeof LIMITS, string>;
export type ParseResult = { ok: true; value: Proposal } | { ok: false; error: string };

// Caracteres de controlo (excepto \n e \t nos campos de várias linhas), controlos bidireccionais
// (usados para disfarçar texto) e separadores de linha/parágrafo Unicode.
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F\u200E\u200F\u202A-\u202E\u2066-\u2069\u2028\u2029]/g;

export function cleanSingleLine(value: string): string {
  return value.replace(/[\r\n\t]+/g, " ").replace(CONTROL, "").replace(/\s{2,}/g, " ").trim();
}

export function cleanMultiLine(value: string): string {
  return value.replace(/\r\n?/g, "\n").replace(CONTROL, "").replace(/\n{4,}/g, "\n\n\n").trim();
}

// Um único endereço, sem nomes de apresentação, listas ou caracteres que mudem a interpretação.
export function isSafeEmail(value: string): boolean {
  return value.length <= LIMITS.email && /^[A-Za-z0-9.!#$%&'*+\/=?^_\x60{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/.test(value);
}

export function isOriginAllowed(origin: string | null, allowed: string[]): boolean {
  if (allowed.length) return Boolean(origin) && allowed.includes(origin as string);
  // Sem lista configurada só se aceita desenvolvimento local (e nunca pedidos sem Origin).
  return Boolean(origin) && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin as string);
}

export function parseProposal(body: unknown): ParseResult {
  if (!body || typeof body !== "object" || Array.isArray(body)) return { ok: false, error: "invalid_payload" };
  const raw = (body as Record<string, unknown>).payload;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return { ok: false, error: "invalid_payload" };
  const input = raw as Record<string, unknown>;
  const value = {} as Proposal;
  for (const key of Object.keys(LIMITS) as (keyof typeof LIMITS)[]) {
    const field = input[key];
    if (field !== undefined && field !== null && typeof field !== "string") return { ok: false, error: "invalid_payload" };
    const text = typeof field === "string" ? field : "";
    const cleaned = (MULTI_LINE as readonly string[]).includes(key) ? cleanMultiLine(text) : cleanSingleLine(text);
    // Acima do limite rejeita-se em vez de cortar em silêncio (o formulário já impõe os limites).
    if (cleaned.length > LIMITS[key]) return { ok: false, error: "payload_too_long" };
    value[key] = cleaned;
  }
  value.language = value.language || "pt-PT";
  if (!value.name || !isSafeEmail(value.email) || value.message.length < 10) return { ok: false, error: "invalid_payload" };
  if (input.privacyAccepted !== true) return { ok: false, error: "invalid_payload" };
  if (value.spaceType && !SPACE_TYPES.includes(value.spaceType)) return { ok: false, error: "invalid_payload" };
  if (!LANGUAGES.includes(value.language)) return { ok: false, error: "invalid_payload" };
  if (value.phone && !/^[0-9+().\s-]{6,60}$/.test(value.phone)) return { ok: false, error: "invalid_payload" };
  return { ok: true, value };
}

// Lê o corpo com tecto de tamanho, sem confiar só no Content-Length.
export async function readJsonLimited(request: Request, maxBytes = MAX_BODY_BYTES): Promise<{ ok: true; body: unknown } | { ok: false; status: number; error: string }> {
  const type = (request.headers.get("content-type") || "").toLowerCase();
  if (!type.startsWith("application/json")) return { ok: false, status: 415, error: "unsupported_media_type" };
  const declared = Number(request.headers.get("content-length") || "0");
  if (declared > maxBytes) return { ok: false, status: 413, error: "payload_too_large" };
  if (!request.body) return { ok: false, status: 400, error: "invalid_json" };
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) { await reader.cancel(); return { ok: false, status: 413, error: "payload_too_large" }; }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  try {
    return { ok: true, body: JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)) };
  } catch {
    return { ok: false, status: 400, error: "invalid_json" };
  }
}

export function buildSubject(p: Proposal, reference: string): string {
  const name = p.name.slice(0, 80);
  const locality = p.locality ? ` (${p.locality.slice(0, 60)})` : "";
  return `Quero expor — ${name}${locality} · ${reference}`;
}

export function buildEmail(p: Proposal, reference: string): string {
  const line = (label: string, value: string) => (value ? `${label}: ${value}\n` : "");
  return (
    `Nova proposta "Quero expor" — ${reference}\n` +
    `Conteúdo enviado por formulário público e não verificado: confirme os contactos e não abra ligações desconhecidas.\n\n` +
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
    `\n— Enviado pelo formulário público de projectomilreu.pt. Responder diretamente a ${p.email}.`
  );
}

export function newReference(random: () => string = () => crypto.randomUUID()): string {
  return `EXPO-${Date.now().toString(36).toUpperCase()}-${random().replace(/-/g, "").slice(0, 6).toUpperCase()}`;
}
