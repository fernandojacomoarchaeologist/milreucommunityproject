/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { readFileSync } from "node:fs";
const readiness = JSON.parse(readFileSync("public/data/release-readiness.json","utf8"));
console.log(JSON.stringify(readiness,null,2));
console.log(readiness.publicLaunch.approved
  ? "Release pública aprovada."
  : `Release pública bloqueada por ${readiness.publicLaunch.blockers.length} itens.`);
