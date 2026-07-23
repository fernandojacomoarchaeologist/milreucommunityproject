/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
const rootUrl = new URL("../../", import.meta.url);
export const assetUrl = path => new URL(path, rootUrl).href;
export async function loadMemories() {
  const response = await fetch(assetUrl("public/data/memories.json"));
  if (!response.ok) throw new Error(`Falha ao carregar dados: ${response.status}`);
  const payload = await response.json();
  return payload.records;
}
export function publicMemories(records) { return records.filter(record => record.publication.siteVisible); }
export function findMemory(records, id) { return records.find(record => record.id === id); }
