/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
const url=process.env.MILREU_SUPABASE_URL?.replace(/\/+$/,"");
const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
if(!url||!key){
  console.log("Estado do master não consultado: configure MILREU_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY apenas no terminal seguro.");
  process.exit(0);
}
if(key.startsWith("sb_publishable_")||key.includes("publishable")){
  throw new Error("Foi fornecida uma chave publicável.");
}
const response=await fetch(`${url}/rest/v1/rpc/collab_active_master_count`,{
  method:"POST",
  headers:{apikey:key,Authorization:`Bearer ${key}`,"Content-Type":"application/json"},
  body:"{}"
});
const raw=await response.text();
if(!response.ok)throw new Error(`Consulta falhou (${response.status}): ${raw}`);
const count=Number(JSON.parse(raw));
console.log(JSON.stringify({
  activeMasterCount:count,
  ready:count>=1,
  emailExposed:false
},null,2));
