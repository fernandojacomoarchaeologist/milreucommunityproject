/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.110.8?bundle";

const SUPABASE_URL=Deno.env.get("SUPABASE_URL")||"";
const PUBLISHABLE_KEY=Deno.env.get("SUPABASE_ANON_KEY")||Deno.env.get("SUPABASE_PUBLISHABLE_KEY")||"";
const MAX_ROWS=Math.max(1,Math.min(Number(Deno.env.get("MILREU_AUDIT_EXPORT_MAX_ROWS")||5000),5000));

function json(status:number,payload:unknown){
  return new Response(JSON.stringify(payload),{
    status,
    headers:{"Content-Type":"application/json","Cache-Control":"no-store"}
  });
}
function csvCell(value:unknown){
  const normalized=Array.isArray(value)?value.join("|"):value===null||value===undefined?"":String(value);
  return `"${normalized.replaceAll('"','""').replaceAll(/\r?\n/g," ")}"`;
}
function safeDate(value:unknown){
  if(!value)return null;
  const parsed=new Date(String(value));
  return Number.isNaN(parsed.valueOf())?null:parsed.toISOString();
}
function safeText(value:unknown,max=200){
  return typeof value==="string"?value.trim().slice(0,max):null;
}

Deno.serve(async request=>{
  if(request.method!=="POST")return json(405,{error:"method_not_allowed"});
  const authorization=request.headers.get("authorization")||"";
  if(!authorization.toLowerCase().startsWith("bearer "))return json(401,{error:"authentication_required"});
  if(!SUPABASE_URL||!PUBLISHABLE_KEY)return json(500,{error:"supabase_configuration_missing"});

  let body:Record<string,unknown>={};
  try{body=await request.json();}catch{/* filtros são opcionais */}

  const requestedLimit=Math.max(1,Math.min(Number(body.limit||MAX_ROWS),MAX_ROWS));
  const client=createClient(SUPABASE_URL,PUBLISHABLE_KEY,{
    global:{headers:{Authorization:authorization}},
    auth:{persistSession:false,autoRefreshToken:false}
  });

  const{data:sessionData,error:userError}=await client.auth.getUser();
  if(userError||!sessionData?.user)return json(401,{error:"invalid_session"});

  const{data,error}=await client.rpc("collab_search_audit_08i",{
    p_query:safeText(body.query),
    p_action:safeText(body.action),
    p_entity_type:safeText(body.entityType),
    p_severity:safeText(body.severity,30),
    p_category:safeText(body.category,40),
    p_actor_user_id:typeof body.actorUserId==="string"?body.actorUserId:null,
    p_from:safeDate(body.from),
    p_to:safeDate(body.to),
    p_limit:requestedLimit,
    p_offset:Math.max(0,Number(body.offset||0))
  });
  if(error){
    const status=error.message?.includes("permission_denied")?403:400;
    return json(status,{error:"audit_export_failed",detail:error.message});
  }

  const rows=Array.isArray(data?.rows)?data.rows:[];
  const headers=[
    "id","createdAt","actorName","action","entityType","entityId",
    "category","severity","changedKeys","correlationId","eventHash","previousHash"
  ];
  const csv=[
    headers.map(csvCell).join(","),
    ...rows.map((row:Record<string,unknown>)=>headers.map(key=>csvCell(row[key])).join(","))
  ].join("\r\n");

  const stamp=new Date().toISOString().slice(0,10);
  const filename=`milreu-auditoria-redigida-${stamp}.csv`;
  return new Response(csv,{
    status:200,
    headers:{
      "Content-Type":"text/csv; charset=utf-8",
      "Content-Disposition":`attachment; filename="${filename}"`,
      "X-Milreu-Filename":filename,
      "X-Milreu-Export-Rows":String(rows.length),
      "Cache-Control":"no-store, max-age=0",
      "Pragma":"no-cache"
    }
  });
});
