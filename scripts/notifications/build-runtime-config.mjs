/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { writeFile,readFile } from "node:fs/promises";

const environment=(process.env.MILREU_ENVIRONMENT||"local").trim().toLowerCase();
const provider=(process.env.MILREU_NOTIFICATION_PROVIDER||"disabled").trim().toLowerCase();
const webhookConfigured=Boolean((process.env.MILREU_NOTIFICATION_WEBHOOK_URL||"").trim());
const tokenConfigured=Boolean((process.env.MILREU_NOTIFICATION_WEBHOOK_TOKEN||"").trim());
const workerSecretConfigured=Boolean((process.env.MILREU_NOTIFICATION_WORKER_SECRET||"").trim());
const fromName=(process.env.MILREU_NOTIFICATION_FROM_NAME||"Projeto Comunitário de Milreu").trim();
const fromEmailConfigured=Boolean((process.env.MILREU_NOTIFICATION_FROM_EMAIL||"").trim());
const automaticScheduleEnabled=process.env.MILREU_NOTIFICATION_AUTOMATIC_SCHEDULE==="true";
const maxBatch=Math.max(1,Math.min(Number(process.env.MILREU_NOTIFICATION_MAX_BATCH||25),100));

if(!["local","staging","production"].includes(environment))throw new Error("Ambiente inválido.");
if(!["disabled","webhook"].includes(provider))throw new Error("Fornecedor de notificações inválido.");
if(provider==="webhook"&&!(webhookConfigured&&tokenConfigured&&workerSecretConfigured&&fromEmailConfigured)){
  if(process.env.MILREU_NOTIFICATIONS_STRICT==="true"){
    throw new Error("Fornecedor webhook incompleto.");
  }
}
if(environment==="production"&&automaticScheduleEnabled&&process.env.MILREU_NOTIFICATION_SCHEDULE_CONFIRM!=="ENABLE_MILREU_NOTIFICATION_SCHEDULE"){
  throw new Error("Agendamento automático de produção exige confirmação literal.");
}
if(process.env.SUPABASE_SERVICE_ROLE_KEY){
  console.warn("SUPABASE_SERVICE_ROLE_KEY foi detetada, mas não será gravada no runtime público.");
}

const existing=JSON.parse(await readFile("public/config/notifications.example.json","utf8"));
const enabled=provider==="webhook"&&webhookConfigured&&tokenConfigured&&workerSecretConfigured&&fromEmailConfigured;
const runtime={
  ...existing,
  version:"0.27.0",
  environment,
  email:{
    ...existing.email,
    provider,
    enabled,
    webhookConfigured,
    fromName,
    fromEmailConfigured,
    automaticScheduleEnabled,
    maxBatch
  },
  notice:enabled
    ?"O e-mail transacional possui configuração de servidor. A ativação lógica ainda depende do canal no Supabase."
    :"O centro interno está ativo. O e-mail permanece desativado ou incompleto."
};
await writeFile("public/config/notifications.runtime.json",JSON.stringify(runtime,null,2)+"\n");
console.log(`Notificações ${environment}: in-app ativo; e-mail ${enabled?"configurado":"desativado"}.`);
