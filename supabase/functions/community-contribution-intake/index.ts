/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.110.8?bundle";

const SUPABASE_URL=Deno.env.get("SUPABASE_URL")||"";
const ANON_KEY=Deno.env.get("SUPABASE_ANON_KEY")||"";
const SERVICE_KEY=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")||"";
const RATE_LIMIT_SALT=Deno.env.get("RATE_LIMIT_SALT")||"";
const TURNSTILE_SECRET=Deno.env.get("TURNSTILE_SECRET_KEY")||"";
const ALLOWED_ORIGINS=(Deno.env.get("ALLOWED_ORIGINS")||"")
  .split(",").map(value=>value.trim()).filter(Boolean);
const BUCKET="community-contributions-private";

function isOriginAllowed(request:Request){
  const origin=request.headers.get("origin")||"";
  if(!origin)return true;
  if(ALLOWED_ORIGINS.includes(origin))return true;
  if(!ALLOWED_ORIGINS.length&&/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin))return true;
  return false;
}

function corsHeaders(request:Request){
  const origin=request.headers.get("origin")||"";
  const allowed=isOriginAllowed(request);
  return{
    "Access-Control-Allow-Origin":allowed?(origin||"*"):"null",
    "Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods":"POST, OPTIONS",
    "Vary":"Origin",
    "Content-Type":"application/json"
  };
}

function response(request:Request,status:number,payload:unknown){
  return new Response(JSON.stringify(payload),{status,headers:corsHeaders(request)});
}

async function sha256(value:string){
  const bytes=new TextEncoder().encode(value);
  const digest=await crypto.subtle.digest("SHA-256",bytes);
  return [...new Uint8Array(digest)].map(byte=>byte.toString(16).padStart(2,"0")).join("");
}

function bearer(request:Request){
  const value=request.headers.get("authorization")||"";
  return value.toLowerCase().startsWith("bearer ")?value.slice(7):null;
}

function serviceClient(){
  if(!SUPABASE_URL||!SERVICE_KEY)throw new Error("edge_function_not_configured");
  return createClient(SUPABASE_URL,SERVICE_KEY,{
    auth:{persistSession:false,autoRefreshToken:false}
  });
}

function userClient(request:Request){
  if(!SUPABASE_URL||!ANON_KEY)return null;
  const token=bearer(request);
  if(!token)return null;
  return createClient(SUPABASE_URL,ANON_KEY,{
    global:{headers:{Authorization:`Bearer ${token}`}},
    auth:{persistSession:false,autoRefreshToken:false}
  });
}

async function verifyTurnstile(token:string|undefined,request:Request){
  if(!TURNSTILE_SECRET)return true;
  if(!token)return false;
  const form=new FormData();
  form.set("secret",TURNSTILE_SECRET);
  form.set("response",token);
  const ip=request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if(ip)form.set("remoteip",ip);
  const result=await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify",{
    method:"POST",body:form
  });
  const payload=await result.json();
  return payload.success===true;
}

async function enforceRateLimit(request:Request,action:string,limit:number){
  if(!RATE_LIMIT_SALT)throw new Error("rate_limit_salt_missing");
  const ip=request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ||request.headers.get("cf-connecting-ip")
    ||"unknown";
  const agent=request.headers.get("user-agent")||"unknown";
  const fingerprint=await sha256(`${RATE_LIMIT_SALT}|${action}|${ip}|${agent}`);
  const now=new Date();
  now.setMinutes(0,0,0);
  const client=serviceClient();
  const {data,error}=await client.rpc("collab_consume_public_rate_limit_08e",{
    p_fingerprint_hash:fingerprint,
    p_window_started_at:now.toISOString(),
    p_limit:limit
  });
  if(error)throw error;
  if(!data?.allowed)throw new Error("rate_limit_exceeded");
}

async function signedUploads(result:any){
  const client=serviceClient();
  const uploads=[];
  for(const file of result.files||[]){
    const {data,error}=await client.storage
      .from(BUCKET)
      .createSignedUploadUrl(file.path);
    if(error)throw error;
    uploads.push({
      fileId:file.fileId,
      path:file.path,
      name:file.name,
      mimeType:file.mimeType,
      token:data.token
    });
  }
  return uploads;
}

async function submitContribution(request:Request,body:any){
  if(body.website)throw new Error("spam_detected");
  await enforceRateLimit(request,"submit",8);
  if(!(await verifyTurnstile(body.turnstileToken,request)))throw new Error("challenge_failed");

  const user=userClient(request);
  let result;
  if(user){
    const {data:userData}=await user.auth.getUser();
    if(userData?.user){
      const {data,error}=await user.rpc("collab_create_member_contribution_08e",{
        p_payload:body.payload
      });
      if(error)throw error;
      result=data;
    }
  }
  if(!result){
    const client=serviceClient();
    const {data,error}=await client.rpc("collab_create_public_contribution_08e",{
      p_payload:{...body.payload,submissionSource:"public-portal"}
    });
    if(error)throw error;
    result=data;
  }
  return{...result,uploads:await signedUploads(result)};
}

async function completeFile(request:Request,body:any){
  await enforceRateLimit(request,"complete-file",30);
  const client=serviceClient();
  const {data:file,error:fileError}=await client
    .from("collab_contribution_files")
    .select("id,contribution_id,status,collab_contributions!inner(tracking_token_hash,submitter_id,collab_contribution_submitters!inner(email))")
    .eq("id",body.fileId)
    .maybeSingle();
  if(fileError)throw fileError;
  if(!file)throw new Error("file_not_found");
  const contribution=(file as any).collab_contributions;
  const submitter=contribution.collab_contribution_submitters;
  const tokenHash=await sha256(String(body.trackingCode||"").trim().toUpperCase());
  if(tokenHash!==contribution.tracking_token_hash||String(body.email||"").trim().toLowerCase()!==submitter.email){
    throw new Error("file_completion_denied");
  }

  const {data,error}=await client.rpc("collab_mark_contribution_file_uploaded_08e",{
    p_file_id:body.fileId,
    p_sha256:body.sha256||null
  });
  if(error)throw error;
  return data;
}

async function trackContribution(request:Request,body:any){
  await enforceRateLimit(request,"track",30);
  const client=serviceClient();
  const {data,error}=await client.rpc("collab_track_public_contribution_08e",{
    p_tracking_code:body.trackingCode,
    p_email:body.email
  });
  if(error)throw error;
  return data;
}

async function requestWithdrawal(request:Request,body:any){
  await enforceRateLimit(request,"withdraw",8);
  if(!(await verifyTurnstile(body.turnstileToken,request)))throw new Error("challenge_failed");
  const client=serviceClient();
  const {data,error}=await client.rpc("collab_submit_withdrawal_request_08e",{
    p_tracking_code:body.trackingCode,
    p_email:body.email,
    p_name:body.name,
    p_reason:body.reason
  });
  if(error)throw error;
  return data;
}

async function fileLink(request:Request,body:any){
  const user=userClient(request);
  if(!user)throw new Error("authentication_required");
  const {data:userData,error:userError}=await user.auth.getUser();
  if(userError||!userData.user)throw new Error("authentication_required");

  const {data:access,error:accessError}=await user.rpc(
    "collab_can_access_contribution_file_08e",
    {p_file_id:body.fileId}
  );
  if(accessError)throw accessError;

  const client=serviceClient();
  const {data,error}=await client.storage
    .from(access.bucket)
    .createSignedUrl(access.path,300,{download:access.filename});
  if(error)throw error;
  return{url:data.signedUrl,expiresIn:300,filename:access.filename,mimeType:access.mimeType};
}

Deno.serve(async(request)=>{
  if(request.method==="OPTIONS")return new Response(null,{status:204,headers:corsHeaders(request)});
  if(!isOriginAllowed(request))return response(request,403,{error:"origin_not_allowed"});
  if(request.method!=="POST")return response(request,405,{error:"method_not_allowed"});

  try{
    const body=await request.json();
    let data;
    switch(body.action){
      case"submit":data=await submitContribution(request,body);break;
      case"complete-file":data=await completeFile(request,body);break;
      case"track":data=await trackContribution(request,body);break;
      case"withdraw":data=await requestWithdrawal(request,body);break;
      case"file-link":data=await fileLink(request,body);break;
      default:throw new Error("invalid_action");
    }
    return response(request,200,{ok:true,data});
  }catch(error){
    console.error(error);
    const code=String(error?.message||"unknown_error");
    const status=code.includes("rate_limit")?429
      :code.includes("authentication")?401
      :code.includes("permission")||code.includes("denied")?403
      :400;
    return response(request,status,{ok:false,error:code});
  }
});
