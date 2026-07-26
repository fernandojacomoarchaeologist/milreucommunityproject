/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */

// Não há ranking, gamificação nem concessão automática de função.
export function programmesFor(workspace) {
  return (workspace && workspace.programmes) || [];
}
export function myEnrolments(workspace) {
  return (workspace && workspace.myEnrolments) || [];
}
export function isEnrolled(workspace, programmeId) {
  return myEnrolments(workspace).some((e) => e.programme_id === programmeId && ["enrolled", "active", "paused", "completed"].includes(e.status));
}
export function progressStatuses() {
  return ["not-started", "available", "in-progress", "completed", "blocked", "skipped", "not-applicable"];
}
