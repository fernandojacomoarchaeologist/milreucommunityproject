/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Gera um esqueleto de bundle de evidências APENAS com metadados redigidos.
 * Nunca inclui tokens, secrets, URLs assinadas ativas, e-mails completos,
 * ficheiros pessoais nem conteúdo privado integral.
 */
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const readiness = JSON.parse(readFileSync("public/data/pilot-readiness.json", "utf8"));

const bundle = {
  _copyright: "© 2026 Fernando Rodrigues de Jácomo — Projeto Comunitário de Milreu",
  version: pkg.version,
  generatedAt: new Date().toISOString(),
  release: { version: pkg.version, commit: "recorded-at-runtime" },
  environment: { code: "staging", secretsIncluded: false },
  cycle: null,
  coverageMatrix: [],
  results: [],
  gates: { pilotReadiness: readiness.pilotReadiness, stagingHomologation: readiness.stagingHomologation, productionApproval: "blocked" },
  referencedIncidents: [],
  referencedTasks: [],
  metricsSummary: {},
  approvals: [],
  gaps: readiness.blockingItems || [],
  excluded: ["tokens", "secrets", "signed-urls", "full-emails", "personal-files", "private-content", "unauthorized-recordings"]
};

// Guarda de segurança: nunca serializar chaves sensíveis.
const forbidden = /(token|secret|password|service_role|signed_url|apikey)/i;
const serialized = JSON.stringify(bundle);
for (const key of Object.keys(bundle)) {
  if (forbidden.test(key)) throw new Error(`08K bundle: chave proibida ${key}.`);
}

mkdirSync("reports", { recursive: true });
writeFileSync("reports/pilot-evidence-bundle.json", serialized.length ? JSON.stringify(bundle, null, 2) + "\n" : "");
console.log("Bundle de evidências do piloto gerado (metadados redigidos, sem secrets).");
console.log(`Lacunas registadas: ${bundle.gaps.length}.`);
