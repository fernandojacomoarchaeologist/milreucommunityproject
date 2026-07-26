/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */

// Serviço 08M (moderation). Sem operação, responsáveis nem indicadores inventados.
export function moderationItems(workspace) {
  return (workspace && workspace.moderationItems) || [];
}
export function moderationEmpty() {
  return { authenticated: false, moderationItems: [] };
}
