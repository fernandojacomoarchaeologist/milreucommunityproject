/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
const url = process.env.MILREU_SUPABASE_URL?.replace(/\/+$/,"");
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.MILREU_MASTER_EMAIL?.trim().toLowerCase();
const confirmation=process.env.MILREU_BOOTSTRAP_MASTER_CONFIRM;

if (!url || !serviceKey || !email) {
  throw new Error(
    "Defina MILREU_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY e MILREU_MASTER_EMAIL."
  );
}

if (serviceKey.includes("publishable") || serviceKey.startsWith("sb_publishable_")) {
  throw new Error("Foi fornecida uma chave publicável. O bootstrap exige uma chave administrativa fora do navegador.");
}

if (!email.includes("@")) throw new Error("MILREU_MASTER_EMAIL inválido.");
if(confirmation!=="BOOTSTRAP_MILREU_MASTER")throw new Error("Defina MILREU_BOOTSTRAP_MASTER_CONFIRM=BOOTSTRAP_MILREU_MASTER.");

const response = await fetch(`${url}/rest/v1/rpc/collab_bootstrap_master_by_email`,{
  method:"POST",
  headers:{
    apikey:serviceKey,
    Authorization:`Bearer ${serviceKey}`,
    "Content-Type":"application/json"
  },
  body:JSON.stringify({p_email:email})
});

const body = await response.text();
if (!response.ok) {
  throw new Error(`Bootstrap falhou (${response.status}): ${body}`);
}

const result=JSON.parse(body);
console.log(JSON.stringify({status:"master-configured",userId:result.userId||null,emailExposed:false},null,2));
