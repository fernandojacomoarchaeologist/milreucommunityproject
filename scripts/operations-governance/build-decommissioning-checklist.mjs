/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { mkdirSync, writeFileSync } from "node:fs";
const checklist={_copyright:"© 2026 Fernando Rodrigues de Jácomo — Projeto Comunitário de Milreu",generatedAt:new Date().toISOString(),mode:"read-only-and-safe-shutdown",steps:["Registar decisão de governação para arquivo/desativação.","Colocar áreas em modo somente leitura.","Exportar snapshots aprovados e auditoria (redigidos).","Confirmar backup e retenção legal.","Suspender efeitos públicos e transparência.","Preservar histórico necessário; não eliminar sem retenção protegida.","Comunicar handover e responsáveis."],productionApproval:"blocked",note:"Desativação segura preserva histórico e não elimina dados sem retenção protegida."};
mkdirSync("reports",{recursive:true});
writeFileSync("reports/decommissioning-checklist.json",JSON.stringify(checklist,null,2)+"\n");
console.log(`Checklist de desativação segura gerado: ${checklist.steps.length} passos, modo ${checklist.mode}.`);
