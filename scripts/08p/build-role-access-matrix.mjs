/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 08P — constrói a matriz de acesso por perfil a partir das permissões
 * REAIS do repositório (sem inventar). A visibilidade de menu de cada módulo
 * deriva de o papel possuir a permissão do módulo (master = "*").
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const modules = read("public/data/collaborative-modules.json").modules;
const roles = read("public/data/collaborative-roles-permissions.json");
const contract = read("public/data/role-access-matrix.json");

// Mapeia os perfis do contrato para os estados/papéis reais do repositório.
const PROFILE_MAP = {
  "anonymous": { kind: "unauthenticated" },
  "authenticated-without-membership": { kind: "no-membership" },
  "pending": { kind: "membership", status: "pending" },
  "volunteer": { kind: "role", role: "volunteer" },
  "reviewer": { kind: "role", role: "reviewer" },
  "translator": { kind: "role", role: "translator" },
  "researcher": { kind: "role", role: "researcher" },
  "partner": { kind: "role", role: "partner" },
  "coordinator": { kind: "role", role: "coordinator" },
  "project-owner": { kind: "role", role: "master" },
  "optional-validator": { kind: "role", role: "volunteer", note: "Parecer sobre proposta é concedido por atribuição pontual, não por papel; a base é a de membro." },
  "suspended": { kind: "membership", status: "suspended" },
  "removed": { kind: "membership", status: "archived" },
};

const hasPermission = (role, permission) => {
  const perms = roles.rolePermissions[role] || [];
  return perms.includes("*") || perms.includes(permission);
};

function profileMatrix(profileCode) {
  const map = PROFILE_MAP[profileCode];
  const active = map.kind === "role";
  const visibleModules = active
    ? modules.filter((m) => hasPermission(map.role, m.permission)).map((m) => m.code)
    : [];
  // Perfis não-ativos não veem módulos internos: menu vazio, gate no router.
  let gate;
  if (map.kind === "unauthenticated") gate = "login";
  else if (map.kind === "no-membership") gate = "onboarding-request";
  else if (map.status === "pending") gate = "onboarding-pending";
  else if (map.status === "suspended") gate = "blocked-suspended";
  else if (map.status === "archived") gate = "blocked-archived";
  else gate = "modules";
  return {
    profile: profileCode,
    mappedTo: map.role ? `role:${map.role}` : map.status ? `membership:${map.status}` : map.kind,
    gate,
    menuModuleCount: visibleModules.length,
    menuModules: visibleModules,
    note: map.note || null,
  };
}

const matrix = contract.profilesToMap.map(profileMatrix);

const report = {
  _copyright: "© 2026 Fernando Rodrigues de Jácomo — Projeto Comunitário de Milreu",
  package: "08P",
  version: "0.33.0",
  generatedFrom: ["public/data/collaborative-modules.json", "public/data/collaborative-roles-permissions.json"],
  layers: contract.layers,
  layerEnforcement: {
    menu: "src/components/collaborative-layout.js filtra módulos por hasPermission.",
    route: "src/main.js renderCollaborativeRoute exige sessão + membership active; cada vista chama hasPermission/forbidden.",
    action: "handlers em src/main.js e RPCs verificam permissão antes de mutar.",
    api: "RPCs security definer verificam permissão dentro da transação.",
    rls: "políticas RLS nas migrations são a fonte final; a UI escondida não substitui RLS.",
    storage: "bucket privado community-contributions-private via URL assinada; service_role fora do browser.",
    "deep-link": "abrir uma notificação/URL passa pelo mesmo gate + hasPermission; entidade removida mostra estado 'não encontrado'.",
    "denial-message": "forbidden()/collaborativeForbiddenView e estados bloqueados de membership sem expor notas internas.",
  },
  totals: { profiles: matrix.length, modules: modules.length, permissions: roles.permissions.length },
  matrix,
};

mkdirSync("reports", { recursive: true });
writeFileSync("reports/role-access-matrix-08p.json", JSON.stringify(report, null, 2) + "\n");
console.log(`Matriz por perfil 08P: ${matrix.length} perfis, ${modules.length} módulos, ${roles.permissions.length} permissões (visibilidade derivada de permissões reais).`);
