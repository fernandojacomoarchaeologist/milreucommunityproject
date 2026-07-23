/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
export function getRoute() {
  const raw = location.hash.slice(1) || "/";
  const path = raw.split("?")[0].replace(/\/+$/, "") || "/";
  if (path === "/") return { name:"home" };
  if (path === "/museu") return { name:"museum-home" };
  if (path === "/museu/explorar") return { name:"gallery" };
  const detail = path.match(/^\/museu\/memorias\/(MM\d{6})$/);
  if (detail) return { name:"memory", id:detail[1] };
  const immersive = path.match(/^\/museu\/imersivo\/(MM\d{6})$/);
  if (immersive) return { name:"immersive", id:immersive[1] };
  if (["/projeto","/iniciativas","/conhecimento","/participar"].includes(path)) return { name:"placeholder", path };
  return { name:"not-found" };
}
export function go(path) { location.hash = path; }
