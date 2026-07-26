/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */

// Propostas de evolução exigem evidência real; sem piloto concluído ficam bloqueadas.
export function evolutionProposals(workspace) {
  return (workspace && workspace.evolutionProposals) || [];
}
export function canDecide(context, hasPermission) {
  return hasPermission(context, "evolution.decide");
}
export function decisionOptions() {
  return ["accept", "reject", "defer", "plan", "request-changes"];
}
