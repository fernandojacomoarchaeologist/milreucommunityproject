/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Formulário «Quero expor» — lógica pura (Item 2, incidente 2026-10-15):
 * - datas com calendário: nunca anteriores a hoje (Europe/Lisbon); fim ≥ início;
 * - composição do campo `dates` (contrato da Edge Function inalterado: texto até 160);
 * - continuidade: texto da proposta e ligação de e-mail para o contacto institucional já
 *   publicado, quando o envio falha (sem guardar dados em serviços novos).
 */

const ISO = /^\d{4}-\d{2}-\d{2}$/;

export function todayLisbon(now = Date.now()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Lisbon", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(now));
}

const isRealDate = iso => {
  if (!ISO.test(iso)) return false;
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
};

const ptDate = iso => iso.split("-").reverse().join("/");

// Devolve { ok: true } ou { ok: false, message } (mensagem já pronta para o visitante).
export function validateProposalDates(from = "", to = "", today = todayLisbon()) {
  if (!from && !to) return { ok: true };
  if (!from) return { ok: false, message: "Indique a data de início (a data de fim é opcional)." };
  if (!isRealDate(from) || (to && !isRealDate(to))) return { ok: false, message: "Escolha as datas no calendário." };
  if (from < today) return { ok: false, message: "A data de início não pode ser anterior a hoje." };
  if (to && to < from) return { ok: false, message: "A data de fim não pode ser anterior à data de início." };
  return { ok: true };
}

// Texto enviado no campo `dates` (o servidor valida que nenhuma data é anterior a hoje).
export function composeProposalDates(from = "", to = "") {
  if (!from) return "";
  if (!to || to === from) return `a partir de ${ptDate(from)}`;
  return `${ptDate(from)} a ${ptDate(to)}`;
}

const SPACE_LABELS = {
  "centro-cultural": "Espaço cultural", escola: "Escola", biblioteca: "Biblioteca", associacao: "Associação ou coletivo",
  autarquia: "Autarquia ou serviço público", museu: "Museu ou centro interpretativo", outro: "Outro",
};
const LANGUAGE_LABELS = { "pt-PT": "Português (pt-PT)", en: "Inglês (en)", es: "Espanhol (es)", fr: "Francês (fr)" };

export const PROPOSAL_SUBJECT = "Proposta de acolhimento — Entre Ruínas e Memórias";
// Comprimento total seguro de um URL mailto: (o limite mais restritivo encontrado é o do Outlook no
// Windows, ~2 000 caracteres; Gmail web, Apple Mail e Android aceitam mais). Acima disto, a mensagem
// leva só um resumo e o visitante cola a proposta completa copiada.
export const MAILTO_SAFE_LENGTH = 1900;

// Os 12 campos do formulário (contrato da Edge Function), pela ordem do formulário.
export const PROPOSAL_FIELDS = [
  ["name", "Nome"], ["email", "E-mail"], ["phone", "Telefone"], ["organisation", "Organização ou coletivo"],
  ["spaceType", "Tipo de espaço"], ["venue", "Nome do espaço ou local"], ["locality", "Localidade"], ["dates", "Datas pretendidas"],
  ["message", "Descrição da proposta"], ["needs", "Condições, dimensões ou necessidades"],
  ["privacyAccepted", "Declaração sobre dados pessoais"], ["language", "Idioma do formulário"],
];

const clean = value => String(value ?? "").replace(/\r\n?/g, "\n").trim();
const accepted = value => value === true || value === "on" || value === "true";

// Texto completo da proposta: todos os campos identificados; opcionais vazios marcados «(não indicado)»
// para que nada pareça ter-se perdido; quebras de linha, acentos e símbolos preservados.
export function proposalPlainText(values = {}, { language = "" } = {}) {
  const dates = clean(values.dates) || composeProposalDates(values.dateFrom, values.dateTo);
  const lang = clean(values.language) || language || "pt-PT";
  const show = value => clean(value) || "(não indicado)";
  return [
    PROPOSAL_SUBJECT,
    "Enviada por e-mail porque o formulário do site não a conseguiu enviar.",
    "",
    "1. QUEM PROPÕE",
    `Nome: ${show(values.name)}`,
    `E-mail: ${show(values.email)}`,
    `Telefone: ${show(values.phone)}`,
    `Organização ou coletivo: ${show(values.organisation)}`,
    "",
    "2. A PROPOSTA",
    `Tipo de espaço: ${show(SPACE_LABELS[values.spaceType] || values.spaceType)}`,
    `Nome do espaço ou local: ${show(values.venue)}`,
    `Localidade: ${show(values.locality)}`,
    `Datas pretendidas: ${dates || "(não indicadas)"}`,
    "",
    "Descrição da proposta:",
    show(values.message),
    "",
    "Condições, dimensões ou necessidades:",
    show(values.needs),
    "",
    "3. CONSENTIMENTO",
    `Declaração sobre dados pessoais: ${accepted(values.privacyAccepted) ? "confirmada (tomou conhecimento da finalidade: análise e acompanhamento da proposta)" : "não confirmada"}`,
    `Idioma do formulário: ${LANGUAGE_LABELS[lang] || lang}`,
  ].join("\n");
}

// mailto: com a proposta completa (CRLF, para clientes que ignoram LF). Se exceder o tamanho seguro,
// leva um resumo com contactos e o pedido para colar a proposta completa copiada; `complete` diz qual.
export function proposalMailto(address, values = {}, { language = "", maxLength = MAILTO_SAFE_LENGTH } = {}) {
  if (!/^[^\s@<>,;"?&]+@[^\s@<>,;"?&]+\.[^\s@<>,;"?&]+$/.test(String(address || ""))) return { href: "", complete: false };
  const name = clean(values.name);
  const subject = name ? `${PROPOSAL_SUBJECT} (${name})` : PROPOSAL_SUBJECT;
  const crlf = text => text.replace(/\n/g, "\r\n");
  const build = body => `mailto:${address}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(crlf(body))}`;
  const full = build(proposalPlainText(values, { language }));
  if (full.length <= maxLength) return { href: full, complete: true };
  const summary = [
    PROPOSAL_SUBJECT,
    "",
    "A proposta completa é demasiado longa para ser incluída automaticamente nesta mensagem.",
    "Cole aqui, por baixo, o texto copiado com o botão «Copiar proposta» antes de enviar.",
    "",
    `Nome: ${clean(values.name) || "(não indicado)"}`,
    `E-mail: ${clean(values.email) || "(não indicado)"}`,
    "",
    "--- cole aqui a proposta completa ---",
  ].join("\n");
  return { href: build(summary), complete: false };
}

// Falhas em que a proposta NÃO chegou à equipa e o visitante deve usar a alternativa.
// Erros de validação (o visitante corrige) não entram aqui.
export function isDeliveryFailure(code = "") {
  return code === "network" || code === "edge_function_not_configured" || code === "email_send_failed" || /^http_5\d\d$/.test(code);
}
