/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
const rootUrl = new URL("../../", import.meta.url);
export const assetUrl = path => new URL(path, rootUrl).href;

async function loadJson(path) {
  const response = await fetch(assetUrl(path));
  if (!response.ok) throw new Error(`Falha ao carregar ${path}: ${response.status}`);
  return response.json();
}

export async function loadMemories() {
  const payload = await loadJson("public/data/memories.json");
  return payload.records;
}

export async function loadPortalContent() {
  return loadJson("public/data/portal-content.json");
}

export function publicMemories(records) {
  return records.filter(record => record.publication.siteVisible);
}

export function findMemory(records, id) {
  return records.find(record => record.id === id);
}

export function findInitiative(content, slug) {
  return content?.initiatives?.find(item => item.slug === slug);
}
