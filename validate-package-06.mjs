/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md no repositório principal.
 */
import { spawnSync } from "node:child_process";
for(const args of [
  ["scripts/architecture/validate-architecture.mjs"],
  ["--test","tests/architecture/routes.test.mjs","tests/architecture/prototype.test.mjs","tests/architecture/matrices.test.mjs"]
]){
  const r=spawnSync("node",args,{stdio:"inherit"});
  if(r.status!==0)process.exit(r.status??1);
}
console.log("Pacote 06 validado.");
