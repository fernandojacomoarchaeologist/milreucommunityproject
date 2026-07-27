/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { readFileSync } from "node:fs";
const ev = JSON.parse(readFileSync("public/data/evolution-readiness.json", "utf8"));
const gates = [
  "08j-integrado", "08k-integrado", "staging-homologado", "evidencia-do-piloto",
  "percursos-e-regras-definidos", "conteudo-institucional-participar-aprovado",
  "revisao-editorial", "revisao-direitos", "revisao-privacidade", "revisao-traducao",
  "revisao-acessibilidade", "processo-de-ativacao-aprovado"
];
const report = {
  version: "0.27.0",
  pilotEvidence: ev.pilotEvidence,
  publicIntegrationCandidate: ev.publicIntegrationCandidate,
  stagingPreview: ev.stagingPreview,
  productionApproval: "blocked",
  activePublicEffects: 0,
  literalConfirmation: "ACTIVATE_MILREU_PUBLIC_EFFECT",
  gates: gates.map((code) => ({ code, status: "blocked", blocking: true, evidence: "requires-real-execution" })),
  note: "A confirmação literal é necessária mas nunca suficiente sem evidência real e aprovação humana."
};
const open = report.gates.filter((g) => g.status !== "passed" && g.blocking).length;
console.log(`Gates de integração pública avaliados: ${open} bloqueadores por resolver (esperado sem execução real).`);
console.log(`publicIntegration=${report.publicIntegrationCandidate}, produção=${report.productionApproval}, efeitos ativos=${report.activePublicEffects}.`);
