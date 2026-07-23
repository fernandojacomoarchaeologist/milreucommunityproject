/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { loadCollaborativeConfig, loadCollaborativeFoundationData, callbackUrl } from "./config.js";
import { createCollaborativeSupabaseClient } from "./supabase-client.js";
import { expandRolePermissions, visibleModules, hasPermission } from "./permissions.js";

const DEMO_KEY = "milreu-collaborative-demo-context-v1";

function emptyContext() {
  return {
    ready:false,
    mode:"demo",
    authenticated:false,
    session:null,
    profile:null,
    membership:null,
    accessRequest:null,
    roles:[],
    permissions:[],
    modules:[],
    profileTypes:[],
    moduleRegistry:[],
    roleRegistry:[],
    management:{members:[],requests:[]},
    tasks:[],
    exhibitions:[],
    error:null,
    notice:null
  };
}

class CollaborativeController {
  constructor() {
    this.state = emptyContext();
    this.listeners = new Set();
    this.config = null;
    this.foundation = null;
    this.client = null;
    this.authSubscription = null;
  }

  getState() {
    return structuredClone(this.state);
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  emit() {
    const snapshot = this.getState();
    for (const listener of this.listeners) listener(snapshot);
  }

  async init() {
    this.config = await loadCollaborativeConfig();
    this.foundation = await loadCollaborativeFoundationData();
    this.state = {
      ...emptyContext(),
      ready:false,
      mode:this.config.mode,
      profileTypes:this.foundation.profileTypes,
      moduleRegistry:this.foundation.modules,
      roleRegistry:this.foundation.roles
    };

    if (this.config.mode === "supabase") {
      this.client = await createCollaborativeSupabaseClient(this.config);
      const { data, error } = await this.client.auth.getSession();
      if (error) this.state.error = error.message;
      if (data?.session) await this.loadRemoteContext(data.session);

      const { data:subscription } = this.client.auth.onAuthStateChange(async (_event,session) => {
        if (session) await this.loadRemoteContext(session);
        else this.resetAuthentication();
        this.emit();
      });
      this.authSubscription = subscription?.subscription || null;
    } else {
      this.loadDemoContext();
    }

    this.state.ready = true;
    this.emit();
    return this.getState();
  }

  resetAuthentication() {
    this.state.authenticated = false;
    this.state.session = null;
    this.state.profile = null;
    this.state.membership = null;
    this.state.accessRequest = null;
    this.state.roles = [];
    this.state.permissions = [];
    this.state.modules = [];
    this.state.management = {members:[],requests:[]};
    this.state.tasks = [];
    this.state.exhibitions = [];
    this.state.error = null;
  }

  async loadRemoteContext(session) {
    this.state.session = {
      user:{
        id:session.user.id,
        email:session.user.email,
        user_metadata:session.user.user_metadata || {}
      }
    };
    this.state.authenticated = true;
    const { data, error } = await this.client.rpc("collab_get_my_context");
    if (error) {
      this.state.error = error.message;
      return;
    }

    this.state.profile = data.profile || {
      user_id:session.user.id,
      email:session.user.email,
      display_name:session.user.user_metadata?.full_name || session.user.user_metadata?.name || "",
      avatar_url:session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || null,
      primary_profile_type:null,
      locale:"pt-PT"
    };
    this.state.membership = data.membership || {status:"pending"};
    this.state.accessRequest = data.accessRequest || null;
    this.state.roles = data.roles || [];
    this.state.permissions = data.permissions || [];
    this.state.modules = data.modules || visibleModules(this.state,this.foundation.modules);
    this.state.error = null;

    if (hasPermission(this.state,"memberships.view") || hasPermission(this.state,"memberships.manage")) {
      await this.loadRemoteManagement();
    }
    if (hasPermission(this.state,"tasks.view")) await this.loadRemoteTasks();
    if (hasPermission(this.state,"agenda.view")) await this.loadRemoteExhibitions();
  }

  async loadRemoteManagement() {
    const [profilesResult,membershipsResult,requestsResult,rolesResult] = await Promise.all([
      this.client.from("collab_profiles").select("user_id,email,display_name,primary_profile_type,avatar_url,updated_at").order("display_name"),
      this.client.from("collab_project_memberships").select("project_id,user_id,status,primary_profile_type,requested_at,approved_at,notes"),
      this.client.from("collab_access_requests").select("id,user_id,requested_profile_type,motivation,status,submitted_at,reviewer_notes").order("submitted_at",{ascending:false}),
      this.client.from("collab_member_roles").select("user_id,role_code")
    ]);
    const error = profilesResult.error || membershipsResult.error || requestsResult.error || rolesResult.error;
    if (error) {
      this.state.error = error.message;
      return;
    }

    const memberships = new Map((membershipsResult.data || []).map(item => [item.user_id,item]));
    const roles = new Map();
    for (const item of rolesResult.data || []) {
      const list = roles.get(item.user_id) || [];
      list.push(item.role_code);
      roles.set(item.user_id,list);
    }

    this.state.management = {
      members:(profilesResult.data || []).map(profile => ({
        ...profile,
        membership:memberships.get(profile.user_id) || null,
        roles:roles.get(profile.user_id) || []
      })),
      requests:requestsResult.data || []
    };
  }

  async loadRemoteTasks() {
    const { data, error } = await this.client
      .from("collab_tasks")
      .select("id,title,description,category,status,priority,due_at,capacity")
      .order("due_at",{ascending:true});
    if (!error) this.state.tasks = data || [];
  }

  async loadRemoteExhibitions() {
    const { data, error } = await this.client
      .from("collab_exhibition_schedule")
      .select("id,starts_on,ends_on,status,public_notes,collab_exhibitions(title,exhibition_type),collab_venues(name,municipality,locality)")
      .order("starts_on",{ascending:true});
    if (!error) this.state.exhibitions = data || [];
  }

  loadDemoContext() {
    const stored = localStorage.getItem(DEMO_KEY);
    if (!stored) return;
    try {
      const demo = JSON.parse(stored);
      this.applyDemoContext(demo);
    } catch {
      localStorage.removeItem(DEMO_KEY);
    }
  }

  applyDemoContext(demo) {
    const roleCodes = demo.roles || [];
    const permissions = expandRolePermissions(
      roleCodes,
      this.foundation.rolePermissions,
      this.foundation.permissions
    );
    this.state.authenticated = true;
    this.state.session = {user:{id:demo.userId,email:demo.email,user_metadata:{full_name:demo.displayName}}};
    this.state.profile = {
      user_id:demo.userId,
      email:demo.email,
      display_name:demo.displayName,
      avatar_url:null,
      primary_profile_type:demo.primaryProfileType || null,
      locale:"pt-PT",
      bio:demo.bio || "",
      phone:"",
      public_recognition_opt_in:false
    };
    this.state.membership = {status:demo.status || "pending",primary_profile_type:demo.primaryProfileType || null};
    this.state.accessRequest = demo.accessRequest || null;
    this.state.roles = roleCodes;
    this.state.permissions = permissions;
    this.state.modules = visibleModules(this.state,this.foundation.modules);
    this.state.tasks = demo.tasks || [];
    this.state.exhibitions = demo.exhibitions || [];
    this.state.management = demo.management || {members:[],requests:[]};
    this.state.notice = "Modo de demonstração local — não utiliza contas, membros ou dados reais.";
  }

  persistDemo(partial) {
    const current = this.state.session?.user ? {
      userId:this.state.session.user.id,
      email:this.state.session.user.email,
      displayName:this.state.profile?.display_name || "",
      primaryProfileType:this.state.profile?.primary_profile_type || null,
      status:this.state.membership?.status || "pending",
      roles:this.state.roles,
      accessRequest:this.state.accessRequest,
      bio:this.state.profile?.bio || "",
      tasks:this.state.tasks,
      exhibitions:this.state.exhibitions,
      management:this.state.management
    } : {};
    const next = {...current,...partial};
    localStorage.setItem(DEMO_KEY,JSON.stringify(next));
    this.applyDemoContext(next);
    this.emit();
  }

  async signInGoogle() {
    if (this.config.mode !== "supabase" || !this.client) {
      throw new Error("Configure o Supabase e o Google OAuth para utilizar este botão.");
    }
    const { error } = await this.client.auth.signInWithOAuth({
      provider:this.config.googleProvider || "google",
      options:{
        redirectTo:callbackUrl(this.config),
        scopes:"openid email profile"
      }
    });
    if (error) throw error;
  }

  demoSignIn(kind="pending") {
    if (!this.config.allowDemo) throw new Error("Modo de demonstração desativado.");
    const master = kind === "master";
    const demo = {
      userId:master ? "demo-master" : "demo-pending",
      email:master ? "demo.master@local.invalid" : "demo.user@local.invalid",
      displayName:master ? "Master de demonstração" : "Utilizador de demonstração",
      primaryProfileType:master ? "coordinator" : null,
      status:master ? "active" : "pending",
      roles:master ? ["master"] : [],
      accessRequest:master ? {status:"approved"} : null,
      tasks:[],
      exhibitions:[],
      management:master ? {
        members:[{
          user_id:"demo-master",
          email:"demo.master@local.invalid",
          display_name:"Master de demonstração",
          primary_profile_type:"coordinator",
          membership:{status:"active"},
          roles:["master"]
        },{
          user_id:"demo-request",
          email:"demo.request@local.invalid",
          display_name:"Pedido de demonstração",
          primary_profile_type:"volunteer",
          membership:{status:"pending"},
          roles:[]
        }],
        requests:[{
          id:"demo-request-id",
          user_id:"demo-request",
          requested_profile_type:"volunteer",
          motivation:"Quero apoiar a recolha e digitalização de fotografias.",
          status:"pending",
          submitted_at:new Date().toISOString()
        }]
      } : {members:[],requests:[]}
    };
    localStorage.setItem(DEMO_KEY,JSON.stringify(demo));
    this.applyDemoContext(demo);
    this.emit();
  }

  async submitAccessRequest({displayName,primaryProfileType,motivation}) {
    if (!displayName?.trim() || !primaryProfileType) {
      throw new Error("Nome e perfil principal são obrigatórios.");
    }

    if (this.config.mode === "demo") {
      this.persistDemo({
        displayName:displayName.trim(),
        primaryProfileType,
        status:"pending",
        accessRequest:{status:"pending",requested_profile_type:primaryProfileType,motivation:motivation || ""}
      });
      return;
    }

    const { error } = await this.client.rpc("collab_submit_access_request",{
      p_display_name:displayName.trim(),
      p_primary_profile_type:primaryProfileType,
      p_motivation:motivation || null
    });
    if (error) throw error;
    const { data:sessionData } = await this.client.auth.getSession();
    await this.loadRemoteContext(sessionData.session);
    this.emit();
  }

  async updateMyProfile(values) {
    if (this.config.mode === "demo") {
      this.persistDemo({
        displayName:values.displayName?.trim() || this.state.profile.display_name,
        primaryProfileType:values.primaryProfileType || this.state.profile.primary_profile_type,
        bio:values.bio || ""
      });
      return;
    }

    const { error } = await this.client.rpc("collab_update_my_profile",{
      p_display_name:values.displayName,
      p_primary_profile_type:values.primaryProfileType || null,
      p_locale:values.locale || "pt-PT",
      p_bio:values.bio || null,
      p_phone:values.phone || null,
      p_public_recognition_opt_in:Boolean(values.publicRecognitionOptIn)
    });
    if (error) throw error;
    const { data:sessionData } = await this.client.auth.getSession();
    await this.loadRemoteContext(sessionData.session);
    this.emit();
  }

  async approveAccess(userId,roleCodes=["volunteer"],notes="") {
    if (!hasPermission(this.state,"memberships.manage")) throw new Error("Permissão insuficiente.");

    if (this.config.mode === "demo") {
      const management = structuredClone(this.state.management);
      const member = management.members.find(item => item.user_id === userId);
      if (member) {
        member.membership = {...member.membership,status:"active"};
        member.roles = roleCodes;
      }
      const request = management.requests.find(item => item.user_id === userId);
      if (request) request.status = "approved";
      this.persistDemo({management});
      return;
    }

    const { error } = await this.client.rpc("collab_approve_access_request",{
      p_user_id:userId,
      p_role_codes:roleCodes,
      p_notes:notes || null
    });
    if (error) throw error;
    await this.loadRemoteManagement();
    this.emit();
  }

  async signOut() {
    if (this.config.mode === "demo") {
      localStorage.removeItem(DEMO_KEY);
      this.resetAuthentication();
      this.emit();
      return;
    }
    const { error } = await this.client.auth.signOut();
    if (error) throw error;
    this.resetAuthentication();
    this.emit();
  }
}

export const collaborative = new CollaborativeController();
