/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */

// Campos proibidos em qualquer payload público (espelha o validador de payload).
const FORBIDDEN_KEYS = /(email|phone|telefone|contact|contacto|address|morada|password|secret|token|service_role|apikey|signed_url|user_id|reviewer|nif|iban)/i;

export function assertPublicSafe(value, path = "$") {
  if (value === null || value === undefined) return;
  if (Array.isArray(value)) { value.forEach((v, i) => assertPublicSafe(v, `${path}[${i}]`)); return; }
  if (typeof value === "object") {
    for (const [key, val] of Object.entries(value)) {
      if (FORBIDDEN_KEYS.test(key)) throw new Error(`Campo público proibido: ${key} (${path})`);
      assertPublicSafe(val, `${path}.${key}`);
    }
  }
}

// Leitura pública: apenas snapshots ativos. Sem snapshots ativos, devolve vazio.
export function readActiveSnapshots(publicView) {
  const snapshots = (publicView && publicView.activeSnapshots) || [];
  snapshots.forEach((s) => assertPublicSafe(s.payload));
  return snapshots;
}

export function publicProgrammes(publicView) {
  return (publicView && publicView.publicProgrammes) || [];
}
