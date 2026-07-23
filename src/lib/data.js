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
  return (await loadJson("public/data/memories.json")).records;
}

export async function loadPortalContent() {
  return loadJson("public/data/portal-content.json");
}

export async function loadMuseumCollections() {
  return (await loadJson("public/data/museum-collections.json")).collections;
}

export async function loadMuseumIndex() {
  return (await loadJson("public/data/museum-index.json")).records;
}

export async function loadMuseumAudit() {
  return loadJson("public/data/museum-audit.json");
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

export function findCollection(collections, slug) {
  return collections?.find(item => item.slug === slug);
}

export function suggestedMemories(records, record, limit=4) {
  if (!record) return [];
  const explicit = new Set(record.relations || []);
  const tags = new Set((record.classification.tags || []).map(tag => String(tag).casefold()));
  return records
    .filter(candidate =>
      candidate.id !== record.id &&
      candidate.publication.siteVisible &&
      !explicit.has(candidate.id)
    )
    .map(candidate => {
      const score = (candidate.classification.tags || [])
        .map(tag => String(tag).casefold())
        .filter(tag => tags.has(tag)).length;
      return { candidate, score };
    })
    .filter(item => item.score > 0)
    .sort((a,b) => b.score - a.score || a.candidate.id.localeCompare(b.candidate.id))
    .slice(0,limit)
    .map(item => item.candidate);
}
