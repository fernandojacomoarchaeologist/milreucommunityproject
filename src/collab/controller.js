/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { loadCollaborativeConfig, loadCollaborativeFoundationData, callbackUrl } from "./config.js";
import { createCollaborativeSupabaseClient } from "./supabase-client.js";
import { expandRolePermissions, visibleModules, hasPermission } from "./permissions.js";

const DEMO_KEY = "milreu-collaborative-demo-context-v2";

function emptyManagement() {
  return {members:[],requests:[],invitations:[],notes:[],audit:[]};
}

function emptyContext() {
  return {
    ready:false, mode:"demo", authenticated:false, session:null, profile:null,
    membership:null, accessRequest:null, roles:[], permissions:[], modules:[],
    profileTypes:[], moduleRegistry:[], roleRegistry:[], permissionRegistry:[],
    memberCatalog:{interestAreas:[],skills:[],languages:[]},
    management:emptyManagement(), tasks:[], exhibitions:[], error:null, notice:null
  };
}

function demoAudit(action,userId,actor="demo-master",metadata={}) {
  return {id:`demo-audit-${Date.now()}-${Math.random()}`,actor_user_id:actor,action,entity_type:"membership",entity_id:userId,metadata,created_at:new Date().toISOString()};
}

class CollaborativeController {
  constructor() { this.state=emptyContext(); this.listeners=new Set(); this.config=null; this.foundation=null; this.client=null; this.authSubscription=null; }
  getState() { return structuredClone(this.state); }
  subscribe(listener) { this.listeners.add(listener); return ()=>this.listeners.delete(listener); }
  emit() { const snapshot=this.getState(); for(const listener of this.listeners) listener(snapshot); }

  async init() {
    this.config=await loadCollaborativeConfig();
    this.foundation=await loadCollaborativeFoundationData();
    this.state={...emptyContext(),ready:false,mode:this.config.mode,profileTypes:this.foundation.profileTypes,moduleRegistry:this.foundation.modules,roleRegistry:this.foundation.roles,permissionRegistry:this.foundation.permissions,memberCatalog:this.foundation.memberCatalog};
    if(this.config.mode==="supabase") {
      this.client=await createCollaborativeSupabaseClient(this.config);
      const {data,error}=await this.client.auth.getSession();
      if(error) this.state.error=error.message;
      if(data?.session) await this.loadRemoteContext(data.session);
      const {data:subscription}=this.client.auth.onAuthStateChange(async(_event,session)=>{ if(session) await this.loadRemoteContext(session); else this.resetAuthentication(); this.emit(); });
      this.authSubscription=subscription?.subscription||null;
    } else this.loadDemoContext();
    this.state.ready=true; this.emit(); return this.getState();
  }

  resetAuthentication() {
    Object.assign(this.state,{authenticated:false,session:null,profile:null,membership:null,accessRequest:null,roles:[],permissions:[],modules:[],management:emptyManagement(),tasks:[],exhibitions:[],error:null});
  }

  async loadRemoteContext(session) {
    this.state.session={user:{id:session.user.id,email:session.user.email,user_metadata:session.user.user_metadata||{}}}; this.state.authenticated=true;
    const {data,error}=await this.client.rpc("collab_get_my_context");
    if(error){this.state.error=error.message;return;}
    this.state.profile=data.profile||{user_id:session.user.id,email:session.user.email,display_name:session.user.user_metadata?.full_name||session.user.user_metadata?.name||"",avatar_url:session.user.user_metadata?.avatar_url||session.user.user_metadata?.picture||null,primary_profile_type:null,locale:"pt-PT"};
    this.state.membership=data.membership||{status:"pending"}; this.state.accessRequest=data.accessRequest||null; this.state.roles=data.roles||[]; this.state.permissions=data.permissions||[]; this.state.modules=data.modules||visibleModules(this.state,this.foundation.modules); this.state.error=null;
    await this.loadRemoteOwnPreferences();
    if(hasPermission(this.state,"memberships.view")||hasPermission(this.state,"memberships.manage")) await this.loadRemoteManagement();
    if(hasPermission(this.state,"tasks.view")) await this.loadRemoteTasks();
    if(hasPermission(this.state,"agenda.view")) await this.loadRemoteExhibitions();
  }

  async loadRemoteOwnPreferences() {
    const userId=this.state.session?.user?.id; if(!userId) return;
    const [interests,skills]=await Promise.all([
      this.client.from("collab_member_interests").select("interest_code").eq("user_id",userId),
      this.client.from("collab_member_skills").select("skill_code,level").eq("user_id",userId)
    ]);
    if(!interests.error) this.state.profile.interests=(interests.data||[]).map(x=>x.interest_code);
    if(!skills.error) this.state.profile.skills=(skills.data||[]).map(x=>x.skill_code);
  }

  async loadRemoteManagement() {
    const jobs=[
      this.client.from("collab_profiles").select("user_id,email,display_name,preferred_name,primary_profile_type,avatar_url,organization_name,languages,profile_completed_at,updated_at").order("display_name"),
      this.client.from("collab_project_memberships").select("project_id,user_id,status,primary_profile_type,requested_at,approved_at,approved_by,suspended_at,notes"),
      this.client.from("collab_access_requests").select("id,user_id,requested_profile_type,motivation,status,submitted_at,reviewed_at,reviewer_notes").order("submitted_at",{ascending:false}),
      this.client.from("collab_member_roles").select("user_id,role_code,assigned_at,assigned_by"),
      this.client.from("collab_access_invitations").select("id,email,intended_profile_type,role_codes,status,expires_at,internal_notes,created_by,created_at,claimed_by,claimed_at,revoked_at").order("created_at",{ascending:false}),
      this.client.from("collab_membership_notes").select("id,user_id,note,visibility,created_by,created_at").order("created_at",{ascending:false}),
      this.client.from("collab_audit_log").select("id,actor_user_id,action,entity_type,entity_id,metadata,created_at").order("created_at",{ascending:false}).limit(300),
      this.client.from("collab_member_interests").select("user_id,interest_code"),
      this.client.from("collab_member_skills").select("user_id,skill_code,level")
    ];
    const [profiles,memberships,requests,roles,invitations,notes,audit,interests,skills]=await Promise.all(jobs);
    const error=[profiles,memberships,requests,roles,invitations,notes,audit,interests,skills].find(x=>x.error)?.error;
    if(error){this.state.error=error.message;return;}
    const membershipMap=new Map((memberships.data||[]).map(x=>[x.user_id,x]));
    const rolesMap=new Map(); for(const x of roles.data||[]){const a=rolesMap.get(x.user_id)||[];a.push(x.role_code);rolesMap.set(x.user_id,a);}
    const interestMap=new Map(); for(const x of interests.data||[]){const a=interestMap.get(x.user_id)||[];a.push(x.interest_code);interestMap.set(x.user_id,a);}
    const skillMap=new Map(); for(const x of skills.data||[]){const a=skillMap.get(x.user_id)||[];a.push(x.skill_code);skillMap.set(x.user_id,a);}
    this.state.management={
      members:(profiles.data||[]).map(profile=>({...profile,membership:membershipMap.get(profile.user_id)||null,roles:rolesMap.get(profile.user_id)||[],interests:interestMap.get(profile.user_id)||[],skills:skillMap.get(profile.user_id)||[]})),
      requests:requests.data||[], invitations:invitations.data||[], notes:notes.data||[], audit:audit.data||[]
    };
  }

  async loadRemoteTasks(){const {data,error}=await this.client.from("collab_tasks").select("id,title,description,category,status,priority,due_at,capacity").order("due_at",{ascending:true});if(!error)this.state.tasks=data||[];}
  async loadRemoteExhibitions(){const {data,error}=await this.client.from("collab_exhibition_schedule").select("id,starts_on,ends_on,status,public_notes,collab_exhibitions(title,exhibition_type),collab_venues(name,municipality,locality)").order("starts_on",{ascending:true});if(!error)this.state.exhibitions=data||[];}

  loadDemoContext(){const stored=localStorage.getItem(DEMO_KEY);if(stored){try{this.applyDemoContext(JSON.parse(stored));return;}catch{localStorage.removeItem(DEMO_KEY);}}}
  applyDemoContext(demo){
    const roleCodes=demo.roles||[]; const permissions=expandRolePermissions(roleCodes,this.foundation.rolePermissions,this.foundation.permissions);
    this.state.authenticated=true; this.state.session={user:{id:demo.userId,email:demo.email,user_metadata:{full_name:demo.displayName}}};
    this.state.profile={user_id:demo.userId,email:demo.email,display_name:demo.displayName,avatar_url:null,primary_profile_type:demo.primaryProfileType||null,locale:"pt-PT",bio:demo.bio||"",phone:"",organization_name:demo.organizationName||"",languages:demo.languages||["pt-PT"],interests:demo.interests||[],skills:demo.skills||[],public_recognition_opt_in:false};
    this.state.membership={status:demo.status||"pending",primary_profile_type:demo.primaryProfileType||null}; this.state.accessRequest=demo.accessRequest||null; this.state.roles=roleCodes; this.state.permissions=permissions; this.state.modules=visibleModules(this.state,this.foundation.modules); this.state.tasks=demo.tasks||[]; this.state.exhibitions=demo.exhibitions||[]; this.state.management=demo.management||emptyManagement(); this.state.notice="Modo de demonstração local — não utiliza contas, membros ou dados reais.";
  }
  persistDemo(partial){const current=this.state.session?.user?{userId:this.state.session.user.id,email:this.state.session.user.email,displayName:this.state.profile?.display_name||"",primaryProfileType:this.state.profile?.primary_profile_type||null,status:this.state.membership?.status||"pending",roles:this.state.roles,accessRequest:this.state.accessRequest,bio:this.state.profile?.bio||"",organizationName:this.state.profile?.organization_name||"",languages:this.state.profile?.languages||["pt-PT"],interests:this.state.profile?.interests||[],skills:this.state.profile?.skills||[],tasks:this.state.tasks,exhibitions:this.state.exhibitions,management:this.state.management}:{};const next={...current,...partial};localStorage.setItem(DEMO_KEY,JSON.stringify(next));this.applyDemoContext(next);this.emit();}

  async signInGoogle(){if(this.config.mode!=="supabase"||!this.client)throw new Error("Configure o Supabase e o Google OAuth para utilizar este botão.");const {error}=await this.client.auth.signInWithOAuth({provider:this.config.googleProvider||"google",options:{redirectTo:callbackUrl(this.config),scopes:"openid email profile"}});if(error)throw error;}

  demoSignIn(kind="pending"){
    if(!this.config.allowDemo)throw new Error("Modo de demonstração desativado."); const master=kind==="master"; const now=new Date().toISOString();
    const members=[
      {user_id:"demo-master",email:"demo.master@local.invalid",display_name:"Master de demonstração",primary_profile_type:"coordinator",organization_name:"Projeto Comunitário de Milreu",languages:["pt-PT"],membership:{status:"active",approved_at:now},roles:["master"],interests:["museum-memories","events"],skills:["cataloguing"]},
      {user_id:"demo-volunteer",email:"voluntario@local.invalid",display_name:"Voluntário de demonstração",primary_profile_type:"volunteer",languages:["pt-PT"],membership:{status:"active",approved_at:now},roles:["volunteer"],interests:["photography","events"],skills:["digitisation","event-support"]},
      {user_id:"demo-request",email:"pedido@local.invalid",display_name:"Pedido de demonstração",primary_profile_type:"volunteer",languages:["pt-PT"],membership:{status:"pending",requested_at:now},roles:[],interests:[],skills:[]},
      {user_id:"demo-suspended",email:"investigador@local.invalid",display_name:"Investigador suspenso",primary_profile_type:"researcher",languages:["pt-PT","en"],membership:{status:"suspended",suspended_at:now},roles:["researcher"],interests:["research"],skills:["historical-research"]}
    ];
    const management=master?{members,requests:[{id:"demo-request-id",user_id:"demo-request",requested_profile_type:"volunteer",motivation:"Quero apoiar a recolha e digitalização de fotografias.",status:"pending",submitted_at:now}],invitations:[{id:"demo-invite",email:"convidado@local.invalid",intended_profile_type:"reviewer",role_codes:["reviewer"],status:"pending",created_at:now,expires_at:null}],notes:[],audit:[demoAudit("system.master_bootstrapped","demo-master"),demoAudit("membership.suspended","demo-suspended")]}:emptyManagement();
    const demo={userId:master?"demo-master":"demo-pending",email:master?"demo.master@local.invalid":"demo.user@local.invalid",displayName:master?"Master de demonstração":"Utilizador de demonstração",primaryProfileType:master?"coordinator":null,status:master?"active":"pending",roles:master?["master"]:[],accessRequest:master?{status:"approved"}:null,tasks:[],exhibitions:[],management,languages:["pt-PT"],interests:master?["museum-memories","events"]:[],skills:master?["cataloguing"]:[]};
    localStorage.setItem(DEMO_KEY,JSON.stringify(demo));this.applyDemoContext(demo);this.emit();
  }

  async submitAccessRequest({displayName,primaryProfileType,motivation}){if(!displayName?.trim()||!primaryProfileType)throw new Error("Nome e perfil principal são obrigatórios.");if(this.config.mode==="demo"){this.persistDemo({displayName:displayName.trim(),primaryProfileType,status:"pending",accessRequest:{status:"pending",requested_profile_type:primaryProfileType,motivation:motivation||""}});return;}const {error}=await this.client.rpc("collab_submit_access_request",{p_display_name:displayName.trim(),p_primary_profile_type:primaryProfileType,p_motivation:motivation||null});if(error)throw error;const {data:s}=await this.client.auth.getSession();await this.loadRemoteContext(s.session);this.emit();}

  async updateMyProfile(values){
    const interests=values.interests||[],skills=values.skills||[],languages=values.languages?.length?values.languages:["pt-PT"];
    if(this.config.mode==="demo"){this.persistDemo({displayName:values.displayName?.trim()||this.state.profile.display_name,primaryProfileType:values.primaryProfileType||this.state.profile.primary_profile_type,bio:values.bio||"",organizationName:values.organizationName||"",languages,interests,skills});return;}
    const {error}=await this.client.rpc("collab_update_my_profile_08b",{p_display_name:values.displayName,p_primary_profile_type:values.primaryProfileType||null,p_locale:values.locale||"pt-PT",p_bio:values.bio||null,p_phone:values.phone||null,p_public_recognition_opt_in:Boolean(values.publicRecognitionOptIn),p_organization_name:values.organizationName||null,p_languages:languages,p_interests:interests,p_skills:skills});if(error)throw error;const {data:s}=await this.client.auth.getSession();await this.loadRemoteContext(s.session);this.emit();
  }

  async manageMember(values){
    if(!hasPermission(this.state,"memberships.manage"))throw new Error("Permissão insuficiente."); const roleCodes=values.roleCodes||[];
    if(this.config.mode==="demo"){
      const management=structuredClone(this.state.management);const member=management.members.find(x=>x.user_id===values.userId);if(!member)throw new Error("Membro não encontrado.");
      const currentMasters=management.members.filter(x=>x.membership?.status==="active"&&x.roles?.includes("master"));if(member.roles?.includes("master")&&(!roleCodes.includes("master")||values.status!=="active")&&currentMasters.length<=1)throw new Error("O último master ativo não pode ser removido ou suspenso.");
      member.primary_profile_type=values.primaryProfileType;member.membership={...member.membership,status:values.status,primary_profile_type:values.primaryProfileType,notes:values.note||member.membership?.notes};member.roles=roleCodes;
      const request=management.requests.find(x=>x.user_id===values.userId&&x.status==="pending");if(request&&values.status==="active")request.status="approved";if(request&&values.status==="rejected")request.status="rejected";
      if(values.note)management.notes.unshift({id:`demo-note-${Date.now()}`,user_id:values.userId,note:values.note,created_by:this.state.session.user.id,created_at:new Date().toISOString()});management.audit.unshift(demoAudit("membership.managed",values.userId,this.state.session.user.id,{status:values.status,roles:roleCodes}));this.persistDemo({management});return;
    }
    const {error}=await this.client.rpc("collab_manage_member",{p_user_id:values.userId,p_primary_profile_type:values.primaryProfileType,p_role_codes:roleCodes,p_status:values.status,p_note:values.note||null});if(error)throw error;await this.loadRemoteManagement();this.emit();
  }

  async createInvitation(values){
    if(!hasPermission(this.state,"invitations.manage"))throw new Error("Permissão insuficiente.");
    if(this.config.mode==="demo"){const management=structuredClone(this.state.management);management.invitations.unshift({id:`demo-invite-${Date.now()}`,email:values.email.toLowerCase(),intended_profile_type:values.primaryProfileType,role_codes:values.roleCodes||["volunteer"],status:"pending",created_at:new Date().toISOString(),expires_at:values.expiresAt||null,internal_notes:values.notes||null});management.audit.unshift(demoAudit("invitation.created",values.email,this.state.session.user.id));this.persistDemo({management});return;}
    const {error}=await this.client.rpc("collab_create_access_invitation",{p_email:values.email,p_profile_type:values.primaryProfileType,p_role_codes:values.roleCodes||["volunteer"],p_expires_at:values.expiresAt||null,p_notes:values.notes||null});if(error)throw error;await this.loadRemoteManagement();this.emit();
  }

  async revokeInvitation(invitationId,reason=""){
    if(this.config.mode==="demo"){const management=structuredClone(this.state.management);const inv=management.invitations.find(x=>x.id===invitationId);if(inv){inv.status="revoked";inv.revoked_at=new Date().toISOString();}management.audit.unshift(demoAudit("invitation.revoked",invitationId,this.state.session.user.id));this.persistDemo({management});return;}
    const {error}=await this.client.rpc("collab_revoke_access_invitation",{p_invitation_id:invitationId,p_reason:reason||null});if(error)throw error;await this.loadRemoteManagement();this.emit();
  }

  async approveAccess(userId,roleCodes=["volunteer"],notes=""){const member=this.state.management.members.find(x=>x.user_id===userId);return this.manageMember({userId,primaryProfileType:member?.primary_profile_type||"volunteer",roleCodes,status:"active",note:notes});}
  async signOut(){if(this.config.mode==="demo"){localStorage.removeItem(DEMO_KEY);this.resetAuthentication();this.emit();return;}const {error}=await this.client.auth.signOut();if(error)throw error;this.resetAuthentication();this.emit();}
}
export const collaborative=new CollaborativeController();
