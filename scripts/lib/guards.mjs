/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md no repositório principal.
 */
export function getEnvironment(env = process.env) {
  return env.MILREU_ENV || "local";
}

export function assertKnownEnvironment(env = process.env) {
  const value = getEnvironment(env);
  if (!["local", "staging", "production"].includes(value)) {
    throw new Error(`MILREU_ENV inválido: ${value}`);
  }
  return value;
}

export function assertProductionWriteGate(env = process.env) {
  const current = assertKnownEnvironment(env);
  if (current !== "production") return true;

  const conditions = {
    allow: env.MILREU_ALLOW_PRODUCTION_WRITE === "true",
    confirmation: env.MILREU_PRODUCTION_CONFIRMATION === "APPLY_APPROVED_MIGRATIONS",
    ticket: Boolean(env.MILREU_CHANGE_TICKET?.trim()),
    ci: env.CI === "true",
    github: env.GITHUB_ACTIONS === "true",
    protectedEnvironment: env.MILREU_GITHUB_ENVIRONMENT === "production"
  };

  const failed = Object.entries(conditions)
    .filter(([, ok]) => !ok)
    .map(([name]) => name);

  if (failed.length) {
    throw new Error(
      `Escrita produtiva bloqueada. Gates em falta: ${failed.join(", ")}`
    );
  }
  return true;
}

export function assertNoForbiddenSnapshotFields(record) {
  const forbidden = [
    "email", "phone", "telephone", "address", "ip", "token",
    "consentDocument", "internalNotes", "service_role", "password"
  ];
  const serialized = JSON.stringify(record).toLowerCase();
  const found = forbidden.filter(key => serialized.includes(key.toLowerCase()));
  if (found.length) {
    throw new Error(`Snapshot contém campos proibidos: ${found.join(", ")}`);
  }
  return true;
}
