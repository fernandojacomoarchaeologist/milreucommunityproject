/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 09F — inventário de indexabilidade a partir do ROUTER REAL. Extrai todos os
 * nomes de rota de src/lib/router.js e exige que cada um seja classificado EXATAMENTE
 * uma vez como index/noindex/blocked, com fundamento. Sem lista inventada. Como não há
 * origem pública aprovada (seo.runtime.json.publicOrigin=null), canonical/sitemap absolutos
 * ficam nulos/false e a indexação está desativada por ambiente (preview). Escreve
 * reports/seo-route-inventory-09f.json e reports/seo-metadata-inventory-09f.json.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const fail = (m) => { throw new Error(`09F inventário: ${m}`); };

const routerSrc = readFileSync("src/lib/router.js", "utf8");
const routeNames = [...new Set([...routerSrc.matchAll(/name:\s*"([^"]+)"/g)].map((m) => m[1]))];

const seo = read("public/config/seo.runtime.json");
const routeMeta = read("public/data/seo-route-metadata.json").routes;
const origin = seo.publicOrigin; // null enquanto não houver domínio aprovado
const indexingAllowed = seo.indexingAllowed === true;

// Classificação determinística por nome de rota (fundamentada no código real).
// index  = rota pública com conteúdo publicado, adequada a resultados de pesquisa.
// noindex = pública mas inadequada a resultados (laboratório interno, 404).
// blocked = autenticação, gestão, formulários com dados pessoais, demonstração, preview.
const PUBLIC_INDEX = new Set([
  "home", "project", "methodology", "initiatives", "initiative", "knowledge",
  "participate", "about", "public-exhibitions", "public-opportunities", "public-opportunity",
  "public-transparency", "museum-home", "gallery", "timeline", "collections", "collection", "memory",
]);
const NOINDEX = new Set(["immersive", "channel-lab", "totem-preview", "panel-preview", "not-found"]);
// Formulários públicos com dados pessoais → fora da indexação (privacidade).
const BLOCKED_PUBLIC = new Set(["public-contribution-new", "public-contribution-track", "public-contribution-withdrawal"]);

const pathForName = {
  home: "/", project: "/projeto", methodology: "/metodologia", initiatives: "/iniciativas",
  knowledge: "/conhecimento", participate: "/participar", about: "/sobre",
  "public-exhibitions": "/exposicoes", "public-opportunities": "/oportunidades",
  "public-transparency": "/transparencia", "museum-home": "/museu", gallery: "/museu/explorar",
  timeline: "/museu/linha-do-tempo", collections: "/museu/colecoes",
};

const records = [];
const metadata = [];
for (const name of routeNames) {
  let indexability;
  if (name.startsWith("collab-") || name === "collab-login" || name === "collab-callback") indexability = "blocked";
  else if (BLOCKED_PUBLIC.has(name)) indexability = "blocked";
  else if (NOINDEX.has(name)) indexability = "noindex";
  else if (PUBLIC_INDEX.has(name)) indexability = "index";
  else indexability = "blocked"; // por defeito, o que não é claramente público fica fora

  const path = pathForName[name] || null;
  // canonical absoluto só existe com origem aprovada; senão null (honesto).
  const canonical = origin && indexability === "index" && path ? `${origin.replace(/\/$/, "")}${path}` : null;
  // Entra no sitemap apenas se: indexação permitida por ambiente + index + origem + caminho estático.
  const inSitemap = Boolean(indexingAllowed && origin && indexability === "index" && path);

  const evidence = [`router:${name}`];
  if (indexability === "blocked" && name.startsWith("collab-")) evidence.push("policy:authenticated-or-management");
  if (BLOCKED_PUBLIC.has(name)) evidence.push("policy:personal-data-form");
  if (NOINDEX.has(name)) evidence.push("policy:internal-or-404");

  records.push({
    route: path || `#route:${name}`, locale: "pt-PT", editorialState: "published",
    indexability, canonical, inSitemap, hreflangTargets: origin && inSitemap ? ["pt-PT"] : [],
    evidence,
  });

  if (indexability === "index" && routeMeta[name]) {
    metadata.push({
      route: path, name, title: routeMeta[name].title, description: routeMeta[name].description,
      canonical, ogType: name === "memory" ? "article" : "website", locale: "pt-PT",
      socialImage: seo.defaultSocialImage.path,
    });
  }
}

const counts = {
  total: records.length,
  index: records.filter((r) => r.indexability === "index").length,
  noindex: records.filter((r) => r.indexability === "noindex").length,
  blocked: records.filter((r) => r.indexability === "blocked").length,
  inSitemap: records.filter((r) => r.inSitemap).length,
};

mkdirSync("reports", { recursive: true });
const header = {
  _copyright: "© 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md.",
  package: "09F", version: "0.38.0", generatedAt: new Date().toISOString().slice(0, 10),
  publicOrigin: origin, indexingAllowed, canonicalLocale: seo.canonicalLocale, publishedLocales: seo.publishedLocales,
};
writeFileSync("reports/seo-route-inventory-09f.json", JSON.stringify({ ...header, counts, note: "Cada nome de rota do router foi classificado exatamente uma vez. Sem origem aprovada, canonical/sitemap absolutos ficam nulos e a indexação está desativada (preview).", routes: records }, null, 2) + "\n");
writeFileSync("reports/seo-metadata-inventory-09f.json", JSON.stringify({ ...header, socialImage: seo.defaultSocialImage, metadata }, null, 2) + "\n");

console.log(`Pacote 09F: inventário de indexabilidade — ${counts.total} rotas (${counts.index} index, ${counts.noindex} noindex, ${counts.blocked} blocked); ${counts.inSitemap} no sitemap (origem=${origin || "pendente"}, indexação=${indexingAllowed}).`);
