/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { readFile,writeFile,mkdir } from "node:fs/promises";

const model=JSON.parse(await readFile("public/data/collaborative-retention-model.json","utf8"));
const payload={
  _copyright:"© 2026 Fernando Rodrigues de Jácomo — Projeto Comunitário de Milreu",
  version:"0.35.0",
  generatedAt:new Date().toISOString(),
  policies:model.policies.map(item=>({
    code:item.code,
    resourceType:item.resourceType,
    action:item.action,
    retentionDays:item.retentionDays,
    automaticAllowed:false,
    legalHoldSupported:item.legalHoldSupported,
    risk:item.risk,
    nextStep:["delete","anonymize"].includes(item.action)
      ?"Criar preview no ambiente correto; não aplicar."
      :"Revisão humana obrigatória."
  })),
  gates:{
    previewBeforeApproval:true,
    approvalLiteral:model.rules.approvalBeforeApply,
    serviceRoleApplyOnly:model.rules.serviceRoleApplyOnly,
    productionConfirmationRequired:model.rules.productionConfirmationRequired,
    automaticScheduleEnabled:false
  },
  notice:"Este plano não seleciona candidatos e não executa qualquer eliminação."
};
await mkdir("releases/operations",{recursive:true});
await writeFile("releases/operations/retention-plan.json",JSON.stringify(payload,null,2)+"\n");
console.log("Plano de retenção estrutural gerado sem candidatos.");
