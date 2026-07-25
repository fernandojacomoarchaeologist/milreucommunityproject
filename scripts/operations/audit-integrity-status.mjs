/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
const url=process.env.MILREU_SUPABASE_URL?.replace(/\/+$/,"");
const publishableKey=process.env.MILREU_SUPABASE_PUBLISHABLE_KEY;
const userJwt=process.env.MILREU_ADMIN_USER_JWT;
if(!url||!publishableKey||!userJwt){
  console.log("Integridade remota não consultada: configure URL, chave publicável e JWT de um utilizador com audit.integrity.");
  process.exit(0);
}
const response=await fetch(`${url}/rest/v1/rpc/collab_verify_audit_chain_08i`,{
  method:"POST",
  headers:{
    apikey:publishableKey,
    Authorization:`Bearer ${userJwt}`,
    "Content-Type":"application/json"
  },
  body:JSON.stringify({p_from_id:null,p_to_id:null})
});
const raw=await response.text();
if(!response.ok)throw new Error(`Verificação falhou (${response.status}): ${raw}`);
const result=JSON.parse(raw);
console.log(JSON.stringify({
  valid:result.valid,
  checkedCount:result.checkedCount,
  firstBreakId:result.firstBreakId,
  verifiedAt:result.verifiedAt,
  userJwtExposed:false,
  personalDataExposed:false
},null,2));
if(process.env.MILREU_AUDIT_STRICT==="true"&&result.valid!==true)throw new Error("Cadeia de auditoria inválida.");
