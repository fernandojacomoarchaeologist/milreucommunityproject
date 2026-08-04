/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { readFile,writeFile,mkdir } from "node:fs/promises";

const model=JSON.parse(await readFile("public/data/collaborative-operational-governance-model.json","utf8"));
const retention=JSON.parse(await readFile("public/data/collaborative-retention-model.json","utf8"));
const runtime=JSON.parse(await readFile("public/config/operations.runtime.json","utf8"));
const readiness=JSON.parse(await readFile("public/data/collaborative-readiness.json","utf8"));
const payload={
  _copyright:"© 2026 Fernando Rodrigues de Jácomo — Projeto Comunitário de Milreu",
  version:"0.37.1",
  generatedAt:new Date().toISOString(),
  environment:runtime.environment,
  modules:model.modules.map(item=>item.code),
  operationalChecks:model.operationalChecks.length,
  retentionPolicies:retention.policies.length,
  automaticRetention:false,
  auditHashChain:model.audit.hashChain,
  auditDirectTableAccess:model.audit.directTableAccess,
  backupProvider:runtime.backup.provider,
  managedBackupConfirmed:runtime.backup.managedBackupConfirmed,
  continuity:{
    primaryResponsibleConfigured:runtime.continuity.primaryResponsibleConfigured,
    secondaryResponsibleConfigured:runtime.continuity.secondaryResponsibleConfigured
  },
  readiness:{
    status:readiness.status,
    operationalGovernanceReady:readiness.operationalGovernanceReady,
    remoteOperationsValidated:readiness.remoteOperationsValidated
  },
  notice:"Relatório estrutural. Não constitui evidência de backup, restauração, Supabase remoto ou produção."
};
await mkdir("releases/operations",{recursive:true});
await writeFile("releases/operations/operations-foundation-report.json",JSON.stringify(payload,null,2)+"\n");
console.log("Relatório estrutural 08I gerado.");
