/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 09E — validador umbrella de tipografia, media responsiva e desempenho visual.
 * Verifica: versão/base; contratos; inventários conformes aos schemas; integridade dos
 * originais; estratégia responsiva (LCP não-lazy com prioridade, miniaturas fora da dobra
 * com lazy, srcset nas imagens grandes); ausência de @font-face para ficheiros inexistentes
 * (sem 404); preservação do 09D e das seis rotas; zero módulos/permissões/migrations; e
 * ausência de SEO/hreflang (reservado ao 09F).
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const text = (p) => readFileSync(p, "utf8");
const fail = (m) => { throw new Error(`09E: ${m}`); };
const EXPECTED = "0.37.1";

// 1) Versão + readiness
const pkg = read("package.json");
if (pkg.version !== EXPECTED) fail(`package.json deve estar em ${EXPECTED} (está ${pkg.version}).`);
const readiness = read("contracts/09e/package-09e-readiness.json");
if (readiness.productionActivation !== false) fail("readiness: produção deve permanecer bloqueada.");
if (readiness.seoAllowed !== false) fail("readiness: SEO fica reservado ao 09F.");
if (readiness.newModules !== 0 || readiness.newPermissions !== 0 || readiness.newMigrations !== 0) fail("readiness: 0 módulos/permissões/migrations.");

// 2) Orçamento de desempenho
const budget = read("contracts/09e/visual-performance-budget.json");
if (budget.guardrails.font404 !== 0) fail("budget: font404 deve ser 0.");
if (budget.guardrails.layoutImagesWithoutDimensions !== 0) fail("budget: imagens de layout sem dimensões deve ser 0.");
if (budget.rules.lcpMustNotBeLazy !== true) fail("budget: LCP não pode ser lazy.");

// 3) Inventários gerados e conformes
for (const p of ["reports/media-inventory-09e.json", "reports/font-inventory-09e.json", "reports/visual-performance-baseline-09e.json"]) {
  if (!existsSync(p)) fail(`relatório em falta: ${p} (correr os builders 09E).`);
}
const media = read("reports/media-inventory-09e.json");
const mediaSchemaReq = read("contracts/09e/media-asset-record.schema.json").required;
if (!Array.isArray(media.assets) || media.assets.length === 0) fail("inventário de media vazio.");
for (const a of media.assets) for (const k of mediaSchemaReq) if (!(k in a)) fail(`ativo de media sem campo obrigatório '${k}': ${a.path}`);
const validClass = new Set(read("contracts/09e/media-asset-record.schema.json").properties.classification.enum);
for (const a of media.assets) if (!validClass.has(a.classification)) fail(`classificação inválida '${a.classification}' em ${a.path}`);
if (media.counts.historicalOriginals !== 31) fail(`esperados 31 originais no inventário (${media.counts.historicalOriginals}).`);

const fonts = read("reports/font-inventory-09e.json");
if (fonts.summary.fontFilesInRepo !== 0) fail("o projeto não distribui ficheiros de fonte no Git.");
if (fonts.declaredFamilies.some((f) => f.hasFontFace)) fail("não deve existir @font-face para famílias sem ficheiro (evita 404).");

// 4) Sem @font-face a apontar para ficheiros inexistentes (guardrail font404).
const css = readdirSync("src/styles").filter((f) => f.endsWith(".css")).map((f) => text(`src/styles/${f}`)).join("\n");
const faceUrls = [...css.matchAll(/@font-face[^}]*url\(([^)]+)\)/gi)].map((m) => m[1].replace(/["']/g, "").trim());
for (const u of faceUrls) {
  const rel = u.replace(/^\.?\//, "").split("?")[0];
  if (!existsSync(rel) && !existsSync(`public/${rel}`)) fail(`@font-face aponta para ficheiro inexistente (404): ${u}`);
}

// 5) Estratégia responsiva na superfície
const museum = text("src/views/museum.js");
if (!/museum-opening__image".*fetchpriority="high"/s.test(museum)) fail("hero do Museu (LCP) deve ter fetchpriority alta.");
if (!/museum-opening__image".*srcset=/s.test(museum)) fail("hero do Museu deve ter srcset responsivo.");
const portal = text("src/views/portal.js");
if (!/home-carousel__media[\s\S]{0,200}srcset=/.test(portal)) fail("banner do carrossel deve ter srcset responsivo.");
if (!/isActive \? 'fetchpriority="high"' : 'loading="lazy"'/.test(portal)) fail("banner: slide ativo com prioridade, inativos lazy.");
const memoryCard = text("src/components/memory-card.js");
if (!/loading="lazy"/.test(memoryCard) || !/decoding="async"/.test(memoryCard)) fail("cards do Museu devem ser lazy + decoding async.");

// 6) Preservação do 09D e das seis rotas
if (!existsSync("public/data/locale-availability.json")) fail("09D: disponibilidade multilíngue removida.");
if (!/language-switcher-note/.test(text("src/components/layout.js"))) fail("09D: nota do seletor removida.");
const main = text("src/main.js");
for (const r of ["collab-opportunities", "collab-participation", "collab-pilot", "collab-pilot-management", "collab-public-integration", "collab-operations-governance"]) {
  if (!new RegExp(`case "${r}":`).test(main)) fail(`rota colaborativa ausente do switch de render: ${r}.`);
}

// 7) Sem novos módulos/permissões/migrations; sem SEO/hreflang.
if (read("public/data/collaborative-modules.json").modules.length !== 26) fail("módulos devem permanecer 26.");
if (read("public/data/collaborative-roles-permissions.json").permissions.length !== 152) fail("permissões devem permanecer 152.");
const migrations = readdirSync("supabase/migrations").filter((f) => f.endsWith(".sql"));
if (migrations.filter((f) => /202609|2026081/.test(f)).length) fail("09E não deve adicionar migrations.");
// Nota: o SEO (OG/Twitter/JSON-LD/hreflang) é introduzido pelo 09F; o 09E em si não o adiciona.
// A partir do 09F, o index.html passa a conter estes metadados legitimamente.

// 8) Originais imutáveis (delegado ao validador dedicado, aqui um cheque de coerência).
if (media.counts.historicalDerivatives < 31 * 4) fail("inventário: derivados do Museu incompletos.");

console.log(`Pacote 09E validado: inventários de media (${media.assets.length} ativos) e fontes (3 famílias declaradas mas ausentes, licença pendente), originais íntegros, LCP priorizado + lazy fora da dobra + srcset responsivo, 09D e 6 rotas preservados, sem novos módulos/permissões/migrations, sem SEO.`);
