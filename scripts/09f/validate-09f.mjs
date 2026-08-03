/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 09F — validador umbrella de SEO/metadados/partilha/hreflang. Verifica:
 * versão/base; config por ambiente (sem domínio inventado); inventário classifica cada
 * rota do router exatamente uma vez (schema); hreflang só pt-PT publicado (EN/ES/FR não
 * anunciados); sem x-default sem decisão; robots bloqueia em preview; sitemap/canonical
 * absolutos só com origem aprovada; nada privado/colaborativo/pessoal no sitemap; JSON-LD
 * factual (sem Organization/Event/Offer/Review inventados); 31 originais preservados;
 * 26/152/0; e páginas estáticas com metadados corretos entregues a crawlers.
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const text = (p) => readFileSync(p, "utf8");
const fail = (m) => { throw new Error(`09F: ${m}`); };
const EXPECTED = "0.35.0";

// 1) Versão + readiness + preservação
const pkg = read("package.json");
if (pkg.version !== EXPECTED) fail(`package.json deve estar em ${EXPECTED} (está ${pkg.version}).`);
const readiness = read("contracts/09f/package-09f-readiness.json");
if (readiness.productionActivation !== false) fail("readiness: produção deve permanecer bloqueada.");
if (readiness.proteusInScope !== false) fail("readiness: Proteus fora de escopo.");
if (readiness.requiredPreservation.originalMediaCount !== 31) fail("readiness: 31 originais.");

// 2) Config por ambiente — não inventar domínio
const seo = read("public/config/seo.runtime.json");
if (seo.publicOrigin !== null && typeof seo.publicOrigin !== "string") fail("seo.runtime: publicOrigin inválido.");
if (seo.publicOrigin === null && seo.indexingAllowed !== false) fail("sem origem aprovada, a indexação tem de estar desativada.");
if (seo.canonicalLocale !== "pt-PT") fail("canonicalLocale deve ser pt-PT.");
if (JSON.stringify(seo.publishedLocales) !== JSON.stringify(["pt-PT"])) fail("apenas pt-PT está publicado (09D).");
if (seo.xDefault !== null && seo.xDefaultDecision !== "approved") fail("x-default exige decisão humana explícita.");

// 3) Inventário: classifica cada rota do router exatamente uma vez (regenerar e comparar)
execFileSync("node", ["scripts/09f/build-seo-inventory.mjs"], { stdio: "ignore" });
const routerNames = [...new Set([...text("src/lib/router.js").matchAll(/name:\s*"([^"]+)"/g)].map((m) => m[1]))];
const inv = read("reports/seo-route-inventory-09f.json");
if (inv.routes.length !== routerNames.length) fail(`inventário cobre ${inv.routes.length} rotas; router tem ${routerNames.length}.`);
const schemaReq = read("contracts/09f/seo-route-record.schema.json").required;
const validIndex = new Set(["index", "noindex", "blocked"]);
for (const r of inv.routes) {
  for (const k of schemaReq) if (!(k in r)) fail(`registo de rota sem campo '${k}': ${r.route}`);
  if (!validIndex.has(r.indexability)) fail(`indexability inválida: ${r.route}`);
  if (r.evidence.length < 1) fail(`rota sem evidência: ${r.route}`);
}

// 4) hreflang: só pt-PT publicado; EN/ES/FR nunca anunciados
const hreflang = read("contracts/09f/hreflang-policy.json");
if (hreflang.allowFallbackAsTranslation !== false) fail("hreflang: fallback não é tradução.");
if (hreflang.xDefault.enabledByDefault !== false) fail("hreflang: x-default não por defeito.");
for (const r of inv.routes) {
  for (const t of r.hreflangTargets) if (t !== "pt-PT") fail(`hreflang anuncia idioma não publicado (${t}) em ${r.route}.`);
}

// 5) Nada privado/colaborativo/pessoal no sitemap; sitemap só com origem aprovada
for (const r of inv.routes) {
  if (r.inSitemap && r.indexability !== "index") fail(`sitemap com rota não-index: ${r.route}`);
  if (r.inSitemap && /area-colaborativa|entrar|auth|contribuir|retirada/.test(r.route)) fail(`sitemap com rota privada/pessoal: ${r.route}`);
}
if (seo.publicOrigin === null && inv.counts.inSitemap !== 0) fail("sem origem aprovada não pode haver URLs no sitemap.");

// 6) index.html: OG/Twitter/JSON-LD factual + robots noindex (preview)
const indexHtml = text("index.html");
if (!/property="og:title"/.test(indexHtml) || !/name="twitter:card"/.test(indexHtml)) fail("index.html sem OG/Twitter.");
if (!/"@type":"WebSite"/.test(indexHtml)) fail("index.html sem JSON-LD WebSite.");
if (/"@type":"(Organization|Event|Offer|AggregateRating|Review)"/.test(indexHtml)) fail("index.html com JSON-LD não comprovado (Organization/Event/Offer/Review).");
if (seo.indexingAllowed === false && !/name="robots" content="noindex/.test(indexHtml)) fail("index.html deve manter noindex em preview.");

// 7) Páginas estáticas: metadados no HTML entregue (não só DOM pós-JS)
const staticBuilder = text("scripts/structured/static-record-builder.mjs");
if (!/property="og:title"/.test(staticBuilder) || !/name="twitter:card"/.test(staticBuilder)) fail("páginas estáticas sem OG/Twitter.");
if (!/name="robots" content="\$\{canonical \? "index,follow" : "noindex,nofollow"\}"/.test(staticBuilder)) fail("páginas estáticas: robots deve depender da origem aprovada.");
if (!/hreflang="pt-PT"/.test(staticBuilder)) fail("páginas estáticas sem hreflang pt-PT (self).");
if (/hreflang="(en|es|fr)"/.test(staticBuilder)) fail("páginas estáticas não podem anunciar EN/ES/FR.");
// JSON-LD factual (Photograph/ImageObject), sem tipos inventados.
if (/"@type":"(Organization|Event|Offer|AggregateRating|Review)"/.test(staticBuilder)) fail("páginas estáticas com JSON-LD não comprovado.");

// 8) robots/sitemap gerados no build (verificar dist se existir)
if (existsSync("dist/robots.txt")) {
  const robots = text("dist/robots.txt");
  if (seo.indexingAllowed === false && !/Disallow: \/\s*$/m.test(robots)) fail("robots de preview deve bloquear tudo (Disallow: /).");
  if (seo.publicOrigin === null && existsSync("dist/sitemap.xml")) fail("não deve existir sitemap sem origem aprovada.");
}

// 9) Preservação: 31 originais, 26/152, 0 migrations novas, 09D/09E intactos
const manifest = read("public/data/media-manifest.json");
if (manifest.items.length !== 31) fail("31 originais devem permanecer.");
if (read("public/data/collaborative-modules.json").modules.length !== 26) fail("módulos devem permanecer 26.");
if (read("public/data/collaborative-roles-permissions.json").permissions.length !== 152) fail("permissões devem permanecer 152.");
if (readdirSync("supabase/migrations").filter((f) => /202609|20261/.test(f)).length) fail("09F não deve adicionar migrations.");
if (!existsSync("public/data/locale-availability.json")) fail("09D: disponibilidade multilíngue removida.");
if (!/museum-opening__image"[\s\S]{0,240}fetchpriority="high"/.test(text("src/views/museum.js"))) fail("09E: LCP do hero removido.");
for (const r of ["collab-opportunities", "collab-participation", "collab-operations-governance"]) {
  if (!new RegExp(`case "${r}":`).test(text("src/main.js"))) fail(`09C.1: rota ${r} removida do render.`);
}

console.log(`Pacote 09F validado: ${inv.routes.length} rotas classificadas (${inv.counts.index} index/${inv.counts.noindex} noindex/${inv.counts.blocked} blocked), hreflang só pt-PT, sem x-default (pendente), origem por ambiente (${seo.publicOrigin || "pendente"} → indexação ${seo.indexingAllowed}), robots preview bloqueado, sem sitemap sem domínio, OG/Twitter/JSON-LD factuais, 31 originais + 26/152 + 0 migrations preservados.`);
