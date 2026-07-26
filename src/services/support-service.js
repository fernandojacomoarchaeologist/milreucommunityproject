/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */

// Serviço 08M (support). Sem operação, responsáveis nem indicadores inventados.
export function supportItems(workspace) {
  return (workspace && workspace.supportItems) || [];
}
export function supportEmpty() {
  return { authenticated: false, supportItems: [] };
}
