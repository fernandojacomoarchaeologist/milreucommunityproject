/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.110.8?bundle";

const SUPABASE_URL=Deno.env.get("SUPABASE_URL")||"";
const SERVICE_KEY=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")||"";
const WORKER_SECRET=Deno.env.get("MILREU_NOTIFICATION_WORKER_SECRET")||"";
const PROVIDER=(Deno.env.get("MILREU_NOTIFICATION_PROVIDER")||"disabled").trim();
const WEBHOOK_URL=(Deno.env.get("MILREU_NOTIFICATION_WEBHOOK_URL")||"").trim();
const WEBHOOK_TOKEN=(Deno.env.get("MILREU_NOTIFICATION_WEBHOOK_TOKEN")||"").trim();
const FROM_NAME=(Deno.env.get("MILREU_NOTIFICATION_FROM_NAME")||"Projeto Comunitário de Milreu").trim();
const FROM_EMAIL=(Deno.env.get("MILREU_NOTIFICATION_FROM_EMAIL")||"").trim().toLowerCase();
const PUBLIC_SITE_URL=(Deno.env.get("MILREU_PUBLIC_SITE_URL")||"").trim().replace(/\/+$/,"");
const MAX_BATCH=Math.max(1,Math.min(Number(Deno.env.get("MILREU_NOTIFICATION_MAX_BATCH")||25),100));

function json(status:number,payload:unknown){
  return new Response(JSON.stringify(payload),{
    status,
    headers:{"Content-Type":"application/json","Cache-Control":"no-store"}
  });
}

function authorized(request:Request){
  if(!WORKER_SECRET)return false;
  const supplied=request.headers.get("x-milreu-worker-secret")||"";
  return supplied.length===WORKER_SECRET.length&&supplied===WORKER_SECRET;
}

function client(){
  if(!SUPABASE_URL||!SERVICE_KEY)throw new Error("supabase_service_configuration_missing");
  return createClient(SUPABASE_URL,SERVICE_KEY,{
    auth:{persistSession:false,autoRefreshToken:false}
  });
}

function escapeHtml(value:string){
  return value.replace(/[&<>"']/g,char=>({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[char]||char));
}

function actionUrl(value:unknown){
  const raw=String(value||"");
  if(raw.startsWith("#/")&&PUBLIC_SITE_URL)return`${PUBLIC_SITE_URL}/${raw}`;
  return raw;
}

function render(template:string,payload:Record<string,unknown>){
  return String(template||"")
    .replace(/\{\{([a-z_][a-z0-9_]*)\}\}/g,(_,token)=>{
      if(token==="action_url")return actionUrl(payload[token]);
      const value=payload[token];
      if(value===null||value===undefined)return"";
      if(typeof value==="string")return value;
      return JSON.stringify(value);
    })
    .replace(/\{\{[^{}]+\}\}/g,"");
}

function htmlFromText(title:string,text:string,link:string){
  const paragraphs=text.split(/\n{2,}/).filter(Boolean)
    .map(value=>`<p>${escapeHtml(value).replaceAll("\n","<br>")}</p>`).join("");
  const action=link?`<p><a href="${escapeHtml(link)}">Abrir na Área Colaborativa</a></p>`:"";
  return`<!doctype html><html lang="pt-PT"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><main><h1>${escapeHtml(title)}</h1>${paragraphs}${action}<hr><p>Mensagem transacional do Projeto Comunitário de Milreu.</p></main></body></html>`;
}

async function recipientEmail(supabase:ReturnType<typeof client>,row:any){
  if(row.recipient_kind==="email")return{email:String(row.recipient_email||"").toLowerCase(),name:""};
  const{data,error}=await supabase.auth.admin.getUserById(row.recipient_user_id);
  if(error)throw error;
  const user=data.user;
  if(!user?.email)throw new Error("recipient_email_not_found");
  return{
    email:user.email.toLowerCase(),
    name:String(user.user_metadata?.full_name||user.user_metadata?.name||"")
  };
}

async function deliver(row:any){
  const supabase=client();
  const recipient=await recipientEmail(supabase,row);
  const payload={...(row.payload||{})};
  payload.display_name=payload.display_name||recipient.name||"Membro";
  payload.action_url=actionUrl(payload.action_url);

  const subject=render(row.subject_template,payload).slice(0,240);
  const title=render(row.title_template,payload).slice(0,300);
  const text=render(row.body_text_template,payload).slice(0,20000);
  const link=String(payload.action_url||"");
  const html=htmlFromText(title,text,link);

  const providerPayload={
    from:{name:FROM_NAME,email:FROM_EMAIL},
    to:[{email:recipient.email,name:recipient.name||undefined}],
    subject,
    text,
    html,
    metadata:{
      outboxId:row.outbox_id,
      eventType:row.event_type,
      attemptNumber:row.attempt_number
    }
  };

  const response=await fetch(WEBHOOK_URL,{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      ...(WEBHOOK_TOKEN?{"Authorization":`Bearer ${WEBHOOK_TOKEN}`}:{})
    },
    body:JSON.stringify(providerPayload)
  });
  const responseText=(await response.text()).slice(0,1000);
  let externalId="";
  try{
    const parsed=JSON.parse(responseText);
    externalId=String(parsed.id||parsed.messageId||parsed.externalId||"");
  }catch{/* response may be plain text */}

  if(!response.ok){
    const error=new Error(`provider_http_${response.status}`);
    (error as any).providerStatus=response.status;
    (error as any).responseExcerpt=responseText;
    throw error;
  }

  return{externalId,statusCode:response.status,responseExcerpt:null};
}

Deno.serve(async(request)=>{
  if(request.method!=="POST")return json(405,{error:"method_not_allowed"});
  if(!authorized(request))return json(401,{error:"worker_authentication_required"});
  if(PROVIDER==="disabled")return json(200,{status:"disabled",claimed:0,delivered:0,failed:0});
  if(PROVIDER!=="webhook")return json(500,{error:"unsupported_provider"});
  if(!WEBHOOK_URL||!FROM_EMAIL)return json(500,{error:"provider_configuration_missing"});

  const supabase=client();
  const workerId=`edge:${crypto.randomUUID()}`;
  const{data:claimed,error:claimError}=await supabase.rpc(
    "collab_claim_notification_outbox_08h",
    {p_worker_id:workerId,p_batch_size:MAX_BATCH}
  );
  if(claimError)return json(500,{error:"claim_failed",detail:claimError.message});

  let delivered=0,failed=0;
  for(const row of claimed||[]){
    try{
      const result=await deliver(row);
      const{error}=await supabase.rpc("collab_finish_notification_delivery_08h",{
        p_outbox_id:row.outbox_id,
        p_status:"delivered",
        p_provider:"webhook",
        p_external_id:result.externalId||null,
        p_provider_status_code:result.statusCode,
        p_response_excerpt:result.responseExcerpt||null,
        p_error_code:null,
        p_error_message:null
      });
      if(error)throw error;
      delivered++;
    }catch(error){
      const providerStatus=Number((error as any).providerStatus||0)||null;
      const excerpt=null;
      await supabase.rpc("collab_finish_notification_delivery_08h",{
        p_outbox_id:row.outbox_id,
        p_status:"failed",
        p_provider:"webhook",
        p_external_id:null,
        p_provider_status_code:providerStatus,
        p_response_excerpt:excerpt,
        p_error_code:error instanceof Error?error.name:"delivery_error",
        p_error_message:error instanceof Error?error.message:"delivery_error"
      });
      failed++;
    }
  }

  return json(200,{
    status:"completed",
    claimed:(claimed||[]).length,
    delivered,
    failed
  });
});
