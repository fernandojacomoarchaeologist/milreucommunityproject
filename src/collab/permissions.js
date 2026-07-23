/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
export function expandRolePermissions(roleCodes, rolePermissions, allPermissions=[]) {
  const result = new Set();
  for (const role of roleCodes || []) {
    const permissions = rolePermissions?.[role] || [];
    if (permissions.includes("*")) {
      allPermissions.forEach(permission => result.add(permission));
    } else {
      permissions.forEach(permission => result.add(permission));
    }
  }
  return [...result].sort();
}

export function hasPermission(context, permission) {
  if (!permission) return true;
  return Boolean(context?.permissions?.includes(permission));
}

export function visibleModules(context, registry) {
  if (context?.membership?.status !== "active") return [];
  return (registry || []).filter(module => hasPermission(context,module.permission));
}

export function isMaster(context) {
  return Boolean(context?.roles?.includes("master"));
}
