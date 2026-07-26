/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
const FORBIDDEN=/(email|phone|telefone|contact|contacto|address|morada|password|secret|token|service_role|apikey|user_id|nif|iban|reviewer)/i;
export function assertTransparencySafe(value,path="$"){
  if(value===null||value===undefined)return;
  if(Array.isArray(value)){value.forEach((v,i)=>assertTransparencySafe(v,`${path}[${i}]`));return;}
  if(typeof value==="object"){for(const[k,val]of Object.entries(value)){if(FORBIDDEN.test(k))throw new Error(`Transparência: campo proibido ${k} (${path})`);assertTransparencySafe(val,`${path}.${k}`);}}
}
