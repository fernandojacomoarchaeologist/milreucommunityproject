/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
export function getRoute() {
  const raw = location.hash.slice(1) || "/";
  const path = raw.split("?")[0].replace(/\/+$/, "") || "/";

  if (path === "/") return { name:"home" };
  if (path === "/projeto") return { name:"project" };
  if (path === "/metodologia") return { name:"methodology" };
  if (path === "/iniciativas") return { name:"initiatives" };
  const initiative = path.match(/^\/iniciativas\/([a-z0-9-]+)$/);
  if (initiative) return { name:"initiative", slug:initiative[1] };
  if (path === "/conhecimento") return { name:"knowledge" };
  if (path === "/participar") return { name:"participate" };
  if (path === "/sobre") return { name:"about" };

  if (path === "/museu") return { name:"museum-home" };
  if (path === "/museu/explorar") return { name:"gallery" };
  if (path === "/museu/linha-do-tempo") return { name:"timeline" };
  const detail = path.match(/^\/museu\/memorias\/(MM\d{6})$/);
  if (detail) return { name:"memory", id:detail[1] };
  const immersive = path.match(/^\/museu\/imersivo\/(MM\d{6})$/);
  if (immersive) return { name:"immersive", id:immersive[1] };

  return { name:"not-found", path };
}

export function go(path) {
  location.hash = path;
}
