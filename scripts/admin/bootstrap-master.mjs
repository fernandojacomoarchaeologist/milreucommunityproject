/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
const url = process.env.MILREU_SUPABASE_URL?.replace(/\/+$/,"");
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.MILREU_MASTER_EMAIL?.trim().toLowerCase();

if (!url || !serviceKey || !email) {
  throw new Error(
    "Defina MILREU_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY e MILREU_MASTER_EMAIL."
  );
}

if (serviceKey.includes("publishable") || serviceKey.startsWith("sb_publishable_")) {
  throw new Error("Foi fornecida uma chave publicável. O bootstrap exige uma chave administrativa fora do navegador.");
}

if (!email.includes("@")) throw new Error("MILREU_MASTER_EMAIL inválido.");

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

console.log("Master configurado com sucesso.");
console.log(body);
