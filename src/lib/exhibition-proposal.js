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

export function proposalPlainText(values = {}) {
  const line = (label, value) => (String(value || "").trim() ? `${label}: ${String(value).trim()}\n` : "");
  return (
    "Proposta «Quero expor» — Entre Ruínas e Memórias\n\n" +
    line("Nome", values.name) +
    line("E-mail", values.email) +
    line("Telefone", values.phone) +
    line("Organização ou coletivo", values.organisation) +
    line("Tipo de espaço", SPACE_LABELS[values.spaceType] || values.spaceType) +
    line("Espaço ou local", values.venue) +
    line("Localidade", values.locality) +
    line("Datas pretendidas", values.dates || composeProposalDates(values.dateFrom, values.dateTo)) +
    `\nDescrição da proposta:\n${String(values.message || "").trim()}\n` +
    (String(values.needs || "").trim() ? `\nCondições ou necessidades:\n${String(values.needs).trim()}\n` : "")
  );
}

// mailto: com o texto da proposta (cortado para caber nos clientes de e-mail; o texto completo
// pode ser copiado com o botão «Copiar texto da proposta»).
export function proposalMailto(address, values = {}, maxBody = 1800) {
  if (!/^[^\s@<>,;"]+@[^\s@<>,;"]+\.[^\s@<>,;"]+$/.test(String(address || ""))) return "";
  const full = proposalPlainText(values);
  const body = full.length > maxBody ? `${full.slice(0, maxBody)}…\n\n(Texto cortado: cole aqui o texto completo copiado no formulário.)` : full;
  const subject = `Quero expor — ${String(values.name || "").trim() || "proposta"}`;
  return `mailto:${address}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// Falhas em que a proposta NÃO chegou à equipa e o visitante deve usar a alternativa.
// Erros de validação (o visitante corrige) não entram aqui.
export function isDeliveryFailure(code = "") {
  return code === "network" || code === "edge_function_not_configured" || code === "email_send_failed" || /^http_5\d\d$/.test(code);
}
