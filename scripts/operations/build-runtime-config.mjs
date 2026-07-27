/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { readFile,writeFile } from "node:fs/promises";

const environment=(process.env.MILREU_OPERATIONS_ENVIRONMENT||process.env.MILREU_ENVIRONMENT||"local").trim().toLowerCase();
const pollIntervalSeconds=Math.max(60,Math.min(Number(process.env.MILREU_OPERATIONS_POLL_SECONDS||120),3600));
const maxExportRows=Math.max(1,Math.min(Number(process.env.MILREU_AUDIT_EXPORT_MAX_ROWS||5000),5000));
const backupProvider=(process.env.MILREU_BACKUP_PROVIDER||"unconfigured").trim();
const managedBackupConfirmed=process.env.MILREU_MANAGED_BACKUP_CONFIRMED==="true";
const primaryResponsibleConfigured=process.env.MILREU_CONTINUITY_PRIMARY_CONFIGURED==="true";
const secondaryResponsibleConfigured=process.env.MILREU_CONTINUITY_SECONDARY_CONFIGURED==="true";
const automaticApply=process.env.MILREU_RETENTION_AUTOMATIC_APPLY==="true";
const automaticScheduleEnabled=process.env.MILREU_RETENTION_AUTOMATIC_SCHEDULE==="true";

if(!["local","staging","production"].includes(environment))throw new Error("Ambiente operacional inválido.");
if(!["managed","github","manual-export","external","unconfigured"].includes(backupProvider))throw new Error("Fornecedor de backup inválido.");
if(automaticApply||automaticScheduleEnabled)throw new Error("A retenção automática não é suportada pelo Pacote 08I.");
if(process.env.SUPABASE_SERVICE_ROLE_KEY)console.warn("SUPABASE_SERVICE_ROLE_KEY foi detetada, mas não será gravada no runtime público.");
if(process.env.MILREU_ADMIN_USER_JWT)console.warn("MILREU_ADMIN_USER_JWT foi detetado, mas não será gravado no runtime público.");

const existing=JSON.parse(await readFile("public/config/operations.example.json","utf8"));
const runtime={
  ...existing,
  version:"0.25.0",
  environment,
  dashboard:{...existing.dashboard,pollIntervalSeconds},
  audit:{...existing.audit,maxExportRows},
  retention:{...existing.retention,automaticApply:false,automaticScheduleEnabled:false,applyFromBrowser:false},
  backup:{...existing.backup,provider:backupProvider,managedBackupConfirmed},
  continuity:{
    ...existing.continuity,
    primaryResponsibleConfigured,
    secondaryResponsibleConfigured
  },
  notice:environment==="local"
    ?"Operação local. Retenção e produção permanecem bloqueadas."
    :"Configuração operacional preparada; evidências remotas continuam obrigatórias."
};
await writeFile("public/config/operations.runtime.json",JSON.stringify(runtime,null,2)+"\n");
console.log(`Operações ${environment}: retenção automática desativada; backup ${backupProvider}.`);
