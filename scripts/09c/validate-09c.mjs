/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 09C — valida oportunidades públicas + candidaturas: contratos, módulo,
 * permissões, snapshot público vazio/honesto, migrations com RLS anon-published,
 * candidatos privados, menores bloqueados e RPCs por permissão.
 */
import { readFileSync, existsSync } from "node:fs";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const text = (p) => readFileSync(p, "utf8");
const fail = (m) => { throw new Error(`09C: ${m}`); };

const EXPECTED = "0.37.0";

// Contratos
const opp = read("public/data/opportunity-model.json");
if (opp.version !== EXPECTED) fail("versão do opportunity-model incorreta.");
if (opp.publicApplicantDataAllowed !== false) fail("dados de candidatos não podem ser públicos.");
if (opp.minorApplicationsDefault !== "blocked-until-policy") fail("menores devem estar bloqueados até política.");
const app = read("public/data/opportunity-application-model.json");
if (app.decisionOwner !== "project-owner-master") fail("a decisão deve pertencer ao dono do projeto.");
if (app.automaticWaitlist !== false) fail("não pode haver lista de espera automática.");
if (app.internalNotesVisibleToApplicant !== false) fail("notas internas não podem ser visíveis ao candidato.");
const sharing = read("public/data/opportunity-sharing-model.json");
if (sharing.socialOAuthRequired !== false || sharing.automaticSocialPosting !== false) fail("não pode haver OAuth nem publicação automática nas redes.");
if (sharing.transactionalEmailEnabled !== false) fail("e-mail transacional deve permanecer desativado.");
const readiness = read("public/data/package-09c-readiness.json");
if (readiness.minorParticipation !== "blocked-until-policy") fail("readiness: menores devem estar bloqueados.");
if (readiness.productionApproval !== "blocked") fail("produção deve permanecer bloqueada.");

// Módulo + permissões
const modules = read("public/data/collaborative-modules.json").modules;
if (!modules.some((m) => m.code === "opportunities" && m.permission === "opportunities.view")) fail("módulo opportunities ausente.");
const perms = read("public/data/collaborative-roles-permissions.json");
for (const p of ["opportunities.view", "opportunities.apply", "opportunities.manage"]) if (!perms.permissions.includes(p)) fail(`permissão em falta: ${p}`);
if (perms.rolePermissions.master?.[0] !== "*") fail("master deve manter '*'.");
if (!perms.rolePermissions.volunteer.includes("opportunities.apply")) fail("voluntário deve poder candidatar-se.");

// Snapshot público vazio e honesto (sem oportunidades inventadas).
const snap = read("public/data/opportunities-public.json");
if (snap.version !== EXPECTED) fail("versão do snapshot incorreta.");
if (!Array.isArray(snap.opportunities) || snap.opportunities.length !== 0) fail("o snapshot público deve começar vazio (sem oportunidades inventadas).");
if (!snap.notice) fail("o snapshot deve declarar um estado vazio honesto.");

// Migrations: tabelas, RLS anon só de public+published, candidatos não anon, menores bloqueados.
const foundation = text("supabase/migrations/20260730100000_opportunities_foundation.sql");
if (!/create table if not exists public\.collab_opportunities/.test(foundation)) fail("tabela collab_opportunities ausente.");
if (!/create table if not exists public\.collab_opportunity_applications/.test(foundation)) fail("tabela collab_opportunity_applications ausente.");
if (!/enable row level security/.test(foundation)) fail("RLS não ativada.");
if (!/for select to anon\s+using \(visibility='public' and status='published'\)/.test(foundation)) fail("política anon deve ler apenas public+published.");
if (/grant select on public\.collab_opportunity_applications to [^;]*anon/.test(foundation)) fail("candidaturas não podem ser legíveis por anon.");
if (!/minors_allowed boolean not null default false/.test(foundation)) fail("menores: campo deve existir e ser false por defeito.");
const rpc = text("supabase/migrations/20260730100100_opportunities_rpc.sql");
for (const fn of ["collab_opportunity_apply", "collab_opportunity_withdraw", "collab_opportunity_decide", "collab_opportunity_add_participant", "collab_opportunity_remove_participant", "collab_opportunity_upsert", "collab_opportunity_set_status"]) {
  if (!new RegExp(`create or replace function public\\.${fn}`).test(rpc)) fail(`RPC em falta: ${fn}`);
}
if (!/minors_policy_pending/.test(rpc)) fail("a candidatura deve bloquear menores (minors_policy_pending).");
if (!/reason_required/.test(rpc)) fail("a remoção deve exigir razão interna.");
if (!/collab_has_permission\('opportunities\.manage'/.test(rpc)) fail("a gestão deve verificar opportunities.manage.");

// Rotas públicas + partilha sem OAuth.
const router = text("src/lib/router.js");
if (!/public-opportunities/.test(router) || !/public-opportunity/.test(router)) fail("rotas públicas de oportunidades ausentes.");
const main = text("src/main.js");
if (!/bindOpportunityShare/.test(main)) fail("partilha de oportunidade não ligada.");
if (/oauth|api\.facebook|graph\.facebook/i.test(text("src/views/opportunities-public.js"))) fail("a partilha não pode usar OAuth/API social.");

console.log("Pacote 09C validado: descoberta pública, perfil mínimo, candidaturas privadas, decisão do master, partilha sem OAuth, menores bloqueados, RLS anon só de public+published.");
