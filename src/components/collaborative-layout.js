/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { assetUrl } from "../lib/data.js";
import { hasPermission } from "../collab/permissions.js";

const esc = value => String(value ?? "").replace(/[&<>"]/g,char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[char]));

export function collaborativeHeader(context) {
  const profile = context.profile || {};
  const modeLabel = context.mode === "demo" ? "Demonstração" : "Ligado ao Supabase";
  return `<header class="collab-header">
    <a class="collab-brand" href="#/area-colaborativa">
      <img src="${assetUrl("public/brand/symbol.webp")}" alt="">
      <span><strong>Área Colaborativa</strong><small>Projeto Comunitário de Milreu</small></span>
    </a>
    <div class="collab-header__actions">
      <span class="collab-mode collab-mode--${esc(context.mode)}">${modeLabel}</span>
      ${context.authenticated ? `
        <span class="collab-user">
          ${profile.avatar_url ? `<img src="${esc(profile.avatar_url)}" alt="">` : `<span>${esc((profile.display_name || profile.email || "?").slice(0,1).toUpperCase())}</span>`}
          <b>${esc(profile.display_name || profile.email || "Membro")}</b>
        </span>
        <button type="button" class="collab-logout" data-collab-logout>Sair</button>
      ` : ""}
      <a class="collab-return" href="#/">Voltar ao Portal</a>
    </div>
  </header>`;
}

export function collaborativeShell(context,currentRoute,content) {
  const modules = context.modules || [];
  const nav = modules.map(module => `
    <a href="#${esc(module.route)}" class="collab-nav__item" ${module.route===currentRoute?'aria-current="page"':""}>
      <span>${esc(module.name)}</span>
      ${module.status !== "active" ? `<small>${module.status === "foundation" ? "Fundação" : "Em preparação"}</small>` : ""}
    </a>
  `).join("");

  return `<div class="collab-app">
    ${collaborativeHeader(context)}
    ${context.notice ? `<div class="collab-demo-notice">${esc(context.notice)}</div>` : ""}
    <div class="collab-layout">
      <aside class="collab-sidebar">
        <nav class="collab-nav" aria-label="Área Colaborativa">${nav}</nav>
        ${hasPermission(context,"memberships.manage") ? `<div class="collab-sidebar__admin"><span>Gestão</span><a href="#/area-colaborativa/gestao/perfis">Perfis e acessos</a><a href="#/area-colaborativa/gestao/exposicoes">Exposições</a></div>` : ""}
      </aside>
      <main id="main" class="collab-main">${content}</main>
    </div>
  </div>`;
}

export function collaborativePublicFrame(context,content) {
  return `<div class="collab-app collab-app--public">${collaborativeHeader(context)}<main id="main" class="collab-public-main">${content}</main></div>`;
}

export function statusPill(status) {
  const labels = {
    pending:"Pendente",active:"Ativo",suspended:"Suspenso",archived:"Arquivado",
    rejected:"Recusado",approved:"Aprovado",foundation:"Fundação",skeleton:"Em preparação"
  };
  return `<span class="collab-status collab-status--${esc(status)}">${esc(labels[status] || status || "—")}</span>`;
}
