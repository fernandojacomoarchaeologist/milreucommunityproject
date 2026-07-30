/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { readFileSync } from "node:fs";

const readiness = JSON.parse(readFileSync("public/data/pilot-readiness.json", "utf8"));

// Gates de entrada/homologação. Sem evidência real, todos permanecem bloqueados.
const entryGates = [
  "rc-tecnica-08j-ready", "staging-separado-https", "migrations-aplicadas-testadas",
  "oauth-e-callbacks", "master-ativo-protegido", "rls-por-perfil",
  "storage-privado-links-assinados", "demo-desativada", "production-writes-desativadas",
  "backup-inicial", "notice-revisto", "coorte-explicita", "cenarios-obrigatorios",
  "canal-de-suporte", "acessibilidade-revisao-humana-inicial"
];
const homologationGates = [
  "todos-gates-entrada", "cobertura-perfis", "cenarios-obrigatorios-executados",
  "falhas-bloqueadoras-resolvidas", "zero-critico-aberto", "zero-falha-rls-storage",
  "teclado-e-leitor-de-ecra", "backup-restauracao-evidencia", "incident-response-ensaiado",
  "metricas-e-relatorio", "efeitos-publicos-desativados", "producao-bloqueada",
  "confirmacao-literal-master"
];

const evaluate = (codes) => codes.map((code) => ({ code, status: "blocked", blocking: true, evidence: "requires-real-execution" }));

const report = {
  version: "0.30.0",
  pilotReadiness: readiness.pilotReadiness,
  stagingHomologation: readiness.stagingHomologation,
  productionApproval: "blocked",
  literalConfirmation: "APPROVE_MILREU_STAGING_HOMOLOGATION",
  entryGates: evaluate(entryGates),
  homologationGates: evaluate(homologationGates),
  note: "A confirmação literal é necessária, mas nunca suficiente sem evidência real dos gates."
};

const open = [...report.entryGates, ...report.homologationGates].filter((g) => g.status !== "passed" && g.blocking).length;
console.log(`Gates do piloto avaliados: ${open} bloqueadores por resolver (esperado enquanto não há execução real).`);
console.log(`pilot=${report.pilotReadiness}, staging=${report.stagingHomologation}, produção=${report.productionApproval}.`);
process.stdout.write(JSON.stringify(report).length > 0 ? "" : "");
