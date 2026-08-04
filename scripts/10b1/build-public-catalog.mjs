/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 10B.1 — deriva o SNAPSHOT PÚBLICO do catálogo Proteus a partir dos dados
 * editoriais repo-internos (data/proteus/pilot-records.json + pilot-agents.json).
 * Regras: só entram registos com public_metadata=true; texto integral NUNCA é alojado
 * (só ligação externa autorizada); registos privados (manuscrito, Anexo A) ficam de fora;
 * a página institucional dinâmica (bilheteira) entra como recurso externo com verified_at
 * e aviso de conteúdo dinâmico. Não inventa licença, resumo, DOI, ORCID nem afiliação.
 * Escreve public/data/proteus-catalog-public.json (servido/estático).
 */
import { readFileSync, writeFileSync } from "node:fs";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const records = read("data/proteus/pilot-records.json").records;
const agents = read("data/proteus/pilot-agents.json").agents;
const agentById = Object.fromEntries(agents.map((a) => [a.id, a]));

const WORK_TYPE = { scholarly_article: "article", book: "book", book_chapter: "book-chapter", conference_manuscript: "conference-paper", project_report: "report" };
const ACCESS = { open: "open", restricted_or_unknown: "restricted", externally_accessible_license_unknown: "restricted", private_project_document: "restricted", public_web_page: "external" };
const slug = (id) => id.replace(/^(work|person|org|resource)-/, "");

const isWork = (r) => r.record_type !== "institutional_dynamic_page";
const publicWorks = records.filter((r) => isWork(r) && r.public_metadata === true);
const publicResources = records.filter((r) => !isWork(r) && r.public_metadata === true);

// Autores públicos: pessoas com public_profile=true que assinam uma obra pública.
const authorIdsInPublic = new Set(publicWorks.flatMap((w) => w.authors || []));
const publicAuthors = agents.filter((a) => a.type === "person" && a.public_profile === true && authorIdsInPublic.has(a.id));

function mapWork(w) {
  return {
    id: w.id,
    slug: slug(w.id),
    title: w.title,
    subtitle: w.subtitle || null,
    authors: (w.authors || []).map((aid) => ({ slug: slug(aid), preferredName: agentById[aid]?.preferred_name || aid, public: agentById[aid]?.public_profile === true })),
    workType: WORK_TYPE[w.record_type] || "other",
    issued: w.year ? { year: w.year } : null,
    publication: { containerTitle: w.container_title || null, publisher: w.publisher || null, series: w.series || null, seriesNumber: w.series_number || null, issue: w.issue || null, pages: w.pages || null },
    languages: [],
    identifiers: { doi: null, url: w.persistent_id || w.source_record_url || null },
    accessStatus: ACCESS[w.access_status] || "unknown",
    reuseLicense: { label: w.reuse_license_label || "unknown", uri: w.reuse_license_uri || null, verificationRequired: Boolean(w.license_verification_required) },
    // Só o artigo aberto (RUN) recebe ligação de texto integral; obras restritas ligam apenas
    // à página externa autorizada, sem alojar texto e sem afirmar abertura.
    openAccess: w.access_status === "open",
    legalAccessUrl: w.access_status === "open" ? (w.external_full_text_url || w.source_record_url || null) : (w.source_record_url || null),
    externalAccessLabelUnknownLicense: w.access_status === "externally_accessible_license_unknown",
    publicSummary: null,
    sources: (w.provenance || []).map((p) => ({ note: p })),
    lastReviewedAt: w.verified_at || null,
    editorialStatus: "published",
  };
}

function mapAuthor(a) {
  return {
    id: a.id, slug: slug(a.id), preferredName: a.preferred_name, orcid: a.orcid || null,
    affiliations: [], publicBio: null,
    sources: [{ note: "Perfil mínimo derivado das obras catalogadas no Proteus; sem biografia gerada." }],
    editorialStatus: "published",
  };
}

function mapResource(r) {
  const provider = agentById[r.provider];
  return {
    id: r.id, title: r.title, type: "institutional_dynamic_page",
    provider: provider?.preferred_name || r.provider,
    providerUrl: provider?.official_url || null,
    publicUrl: r.source_record_url,
    rightsStatus: "restricted", rightsLabel: r.reuse_license_label || "all_rights_reserved_unless_stated",
    dynamic: r.dynamic_content === true,
    stalenessNotice: r.staleness_notice_required === true,
    lastVerified: r.verified_at || null,
  };
}

const snapshot = {
  _copyright: "© 2026 Fernando Rodrigues de Jácomo — Projeto Comunitário de Milreu",
  package: "10B.1",
  version: "0.38.0",
  status: "pilot-controlled",
  generatedBy: "scripts/10b1/build-public-catalog.mjs",
  generatedAt: new Date().toISOString().slice(0, 10),
  note: "Snapshot público derivado dos dados editoriais do piloto. Só entram registos com metadados aprovados; o texto integral nunca é alojado. Manuscrito e Anexo A permanecem privados (fora deste snapshot) até decisão editorial. A bilheteira é um recurso institucional dinâmico com data de verificação.",
  works: publicWorks.map(mapWork),
  authors: publicAuthors.map(mapAuthor),
  externalResources: publicResources.map(mapResource),
  notice: "O catálogo apresenta fichas bibliográficas com fonte, direitos e estado de acesso. As obras restritas não têm texto integral aqui; apenas ligação externa quando autorizada.",
  filters: {
    workTypes: ["article", "book", "book-chapter", "report", "thesis", "conference-paper", "dataset", "other"],
    accessStatuses: ["open", "restricted", "metadata_only", "unknown"],
    languages: ["pt-PT", "en", "es", "fr", "de"],
  },
};
writeFileSync("public/data/proteus-catalog-public.json", JSON.stringify(snapshot, null, 2) + "\n");
console.log(`Pacote 10B.1: snapshot público derivado — ${snapshot.works.length} obras publicadas (${snapshot.works.filter((w) => w.openAccess).length} aberta), ${snapshot.authors.length} autores públicos, ${snapshot.externalResources.length} recurso institucional. Privados (manuscrito, Anexo A) fora do snapshot.`);
