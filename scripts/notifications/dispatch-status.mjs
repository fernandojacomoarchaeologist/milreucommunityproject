/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
const url=process.env.MILREU_SUPABASE_URL?.replace(/\/+$/,"");
const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
if(!url||!key){
  console.log("Estado remoto não consultado: configure URL e service role apenas no terminal seguro.");
  process.exit(0);
}
if(key.startsWith("sb_publishable_")||key.toLowerCase().includes("publishable")){
  throw new Error("Foi fornecida uma chave publicável.");
}
const headers={apikey:key,Authorization:`Bearer ${key}`};
async function fetchJson(path){
  const response=await fetch(`${url}/rest/v1/${path}`,{headers});
  const raw=await response.text();
  if(!response.ok)throw new Error(`Consulta falhou (${response.status}): ${raw}`);
  return JSON.parse(raw);
}
const channels=await fetchJson("collab_notification_channels?select=channel,status,provider,tested_at");
const outbox=await fetchJson("collab_notification_outbox?select=status,attempts,max_attempts,created_at&order=created_at.desc&limit=200");
const counts=outbox.reduce((acc,item)=>{acc[item.status]=(acc[item.status]||0)+1;return acc;},{});
console.log(JSON.stringify({
  channels,
  outboxCounts:counts,
  inspectedItems:outbox.length,
  recipientDataExposed:false,
  payloadExposed:false
},null,2));
