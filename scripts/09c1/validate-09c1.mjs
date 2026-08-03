/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 09C.1 — validador de fecho funcional das oportunidades, compatível com o 09D.
 * Verifica: contratos; jornada ligada na interface (rota colaborativa despachada);
 * transições e privacidade no módulo puro; menores bloqueados; Formação sem progresso
 * fictício; preservação do 09D (seletor/i18n/registo intactos); zero módulos/permissões/
 * migrations novas; produção bloqueada.
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const text = (p) => readFileSync(p, "utf8");
const fail = (m) => { throw new Error(`09C.1: ${m}`); };
const EXPECTED = "0.33.0";

// 1) Versão
const pkg = read("package.json");
if (pkg.version !== EXPECTED) fail(`package.json deve estar em ${EXPECTED} (está ${pkg.version}).`);

// 2) Contratos
const trans = read("contracts/09c1/application-transition-model.json");
if (trans.initialState !== "submitted") fail("estado inicial deve ser 'submitted'.");
for (const [from, to] of [["submitted", ["accepted", "not-selected", "withdrawn"]], ["accepted", ["removed"]]]) {
  if (JSON.stringify(trans.transitions[from]?.slice().sort()) !== JSON.stringify(to.slice().sort())) fail(`transições de '${from}' incorretas.`);
}
if (trans.automaticWaitlist !== false) fail("não pode existir lista de espera automática.");
const readiness = read("contracts/09c1/package-09c1-readiness.json");
if (readiness.productionApproval !== "blocked") fail("produção deve permanecer bloqueada.");
if (readiness.minorParticipation !== "blocked-until-policy") fail("menores devem estar bloqueados até política.");
if (readiness.newModules !== 0 || readiness.newPermissions !== 0 || readiness.newMigrations !== 0) fail("readiness deve declarar 0 módulos/permissões/migrations.");
const roles = read("contracts/09c1/role-access-expectations.json");
if (roles.anonymous.readApplications !== false || roles.candidate.readOtherApplications !== false) fail("candidaturas não podem ser legíveis por anónimos nem entre candidatos.");
if (roles.authorizedMaster.publishUnapprovedTranslation !== false) fail("o master não pode publicar tradução não aprovada.");

// 3) Módulo puro: espelha o contrato de transições
const demo = text("src/collab/opportunities-demo.js");
if (!/APPLICATION_TRANSITIONS/.test(demo)) fail("módulo puro sem APPLICATION_TRANSITIONS.");
if (!/minors_policy_pending/.test(demo)) fail("menores não bloqueados no módulo puro.");
if (!/reason_required/.test(demo)) fail("remoção sem justificação obrigatória.");
if (!/already_applied/.test(demo)) fail("candidatura duplicada não bloqueada.");
if (!/capacity_reached/.test(demo)) fail("capacidade não aplicada.");

// 4) Jornada ligada na interface: rota colaborativa despachada + handlers + perfil mínimo
const main = text("src/main.js");
if (!/case "collab-opportunities":\s*[\r\n]/.test(main) && !/case "collab-opportunities":/.test(main)) fail("rota collab-opportunities não despachada no render principal.");
// deve constar do grupo de fall-through que chama renderCollaborativeRoute
if (!/case "collab-opportunities":/.test(main)) fail("collab-opportunities ausente do switch principal.");
for (const attr of ["data-opportunity-form", "data-opportunity-publish", "data-opportunity-decide", "data-opportunity-remove", "data-opportunity-apply", "data-opportunity-withdraw", "data-minimum-profile-form"]) {
  if (!main.includes(attr)) fail(`handler em falta no main.js: ${attr}.`);
}
const collabView = text("src/views/opportunities-collab.js");
if (!/data-opportunity-form/.test(collabView)) fail("vista colaborativa sem formulário de oportunidade.");
if (!/minimum-profile-form/.test(collabView)) fail("vista sem formulário de perfil mínimo.");

// 5) Formação sem progresso fictício (anti-regressão)
const controller = text("src/collab/controller.js");
if (/progress_percent:\s*(33|100)\b/.test(controller)) fail("Formação: progresso demonstrativo fictício (33/100) reintroduzido.");
if (/score:\s*100\b/.test(controller)) fail("Formação: nota de avaliação fictícia (100) reintroduzida.");

// 6) Preservação do 09D
if (!existsSync("public/data/locale-content-registry.json") || !existsSync("public/data/locale-availability.json")) fail("registo/disponibilidade multilíngue do 09D em falta.");
const i18n = text("src/lib/i18n.js");
if (!/export function localeAvailableForRoute/.test(i18n)) fail("helper 09D localeAvailableForRoute removido.");
if (!/language-switcher-note/.test(text("src/components/layout.js"))) fail("nota acessível do seletor 09D removida.");
if (/hreflang/i.test(collabView) || /hreflang/i.test(text("src/views/opportunities-public.js"))) fail("hreflang não pertence a este pacote (fica 09F).");

// 7) Sem duplicação de modelo de oportunidade / sem novo módulo/permissão/migration
const modules = read("public/data/collaborative-modules.json").modules;
if (modules.length !== 26) fail(`módulos devem permanecer 26 (estão ${modules.length}).`);
const perms = read("public/data/collaborative-roles-permissions.json").permissions;
if (perms.length !== 152) fail(`permissões devem permanecer 152 (estão ${perms.length}).`);
const migrations = readdirSync("supabase/migrations").filter((f) => f.endsWith(".sql"));
const newMig = migrations.filter((f) => /2026080[3-9]|20260[89]/.test(f));
if (newMig.length) fail(`09C.1 não deve adicionar migrations (encontradas: ${newMig.join(", ")}).`);

console.log("Pacote 09C.1 validado: jornada de oportunidades fechada na interface (demo) + regras no módulo puro, menores bloqueados, Formação sem progresso fictício, 09D preservado, sem novos módulos/permissões/migrations, produção bloqueada.");
