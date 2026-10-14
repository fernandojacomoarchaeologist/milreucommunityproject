# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar RIGHTS.md.
# Item 8 — biblioteca comum dos 3 tipos canónicos (cartaz impresso · animação · post social).
# Lê o evento.json de uma paragem e devolve os textos derivados, para que os 3 geradores digam o mesmo.
# Os dados do evento NUNCA vivem nos geradores: só no evento.json (datas e local mudam a cada paragem).
import os, json

HERE=os.path.dirname(os.path.abspath(__file__))
REPO=HERE
while REPO!="/" and not os.path.exists(os.path.join(REPO,"CLAUDE.md")): REPO=os.path.dirname(REPO)

# Identidade fixa da exposição (não muda entre paragens)
EYEBROW="EXPOSIÇÃO ITINERANTE"
TITULO="Entre Ruínas e Memórias"
SUBTITULO="Exposição itinerante do Projecto Comunitário de Milreu"
LINHA="Memórias da população ligadas às Ruínas Romanas de Milreu."
SITE="projectomilreu.pt"
MSF="MUSEUS SEM FRONTEIRAS · INICIATIVAS 2026"
MARCA="Projecto Comunitário de Milreu"
CCDR="Apoiado pela CCDR Algarve, I.P."

OBRIGATORIOS=["id","prefixo_ficheiros","local.nome","local.morada","datas.inicio","datas.fim","datas.inicio_texto",
              "datas.fim_texto","datas.ano","horario","entrada","imagem_principal.ficheiro","imagem_principal.credito"]

def repo_path(p): return p if os.path.isabs(p) else os.path.join(REPO,p)

def carregar(pasta_evento):
    with open(os.path.join(pasta_evento,"evento.json"),encoding="utf-8") as f: ev=json.load(f)
    for chave in OBRIGATORIOS:
        v=ev
        for k in chave.split("."): v=(v or {}).get(k) if isinstance(v,dict) else None
        if not v: raise SystemExit(f"evento.json: campo obrigatório em falta: {chave}")
        if isinstance(v,str) and ("[" in v or "]" in v): raise SystemExit(f"evento.json: placeholder em {chave}")
    ev["_pasta"]=os.path.abspath(pasta_evento)
    return ev

def cap(s): return s[:1].upper()+s[1:] if s else s

def datas_longas(ev):
    d=ev["datas"]; return f'{d["inicio_texto"]} — {d["fim_texto"]} de {d["ano"]}'

def destaque_linha(ev):
    """«Inauguração · sexta-feira, 30 de Outubro · 21h00» (ou None)."""
    d=ev.get("destaque")
    if not d: return None
    return " · ".join(x for x in [d.get("rotulo"),d.get("dia"),d.get("hora")] if x)

def destaque_quando(ev):
    """«Sexta-feira, 30 de Outubro · 21h00» (sem rótulo)."""
    d=ev.get("destaque") or {}
    return " · ".join(x for x in [cap(d.get("dia","")),d.get("hora")] if x) or None

def campos_cartaz(ev):
    """Campos do gerador do cartaz impresso (contrato do master do Item 8)."""
    ip=ev["imagem_principal"]
    f={"NOME_DO_LOCAL":ev["local"]["nome"],"CIDADE_LOCALIDADE":ev["local"].get("localidade",""),
       "CREDITO_IMAGEM":ip["credito"],"DATA_INICIO":ev["datas"]["inicio_texto"],
       "DATA_FIM":f'{ev["datas"]["fim_texto"]} de {ev["datas"]["ano"]}',
       "HORARIO":"\n".join(ev["horario"]),"MORADA":ev["local"]["morada"],
       "ENTRADA_CONDICOES":ev["entrada"],"IMG_AV":ip.get("enquadramento_vertical",0.5)}
    if destaque_linha(ev): f["DESTAQUE"]=destaque_linha(ev)
    if ev["local"].get("logo_anfitriao"): f["LOGO_ANFITRIAO"]=repo_path(ev["local"]["logo_anfitriao"])
    return f

def saida(ev,*partes):
    p=os.path.join(ev["_pasta"],*partes); os.makedirs(p,exist_ok=True); return p

# ---------------- utilitários gráficos partilhados ----------------
import numpy as np
from PIL import Image
LOGODIR=os.path.join(REPO,"public","media","exhibition","updated","logos")
# Faixa de Logos canónica (docs/governance/FAIXA_DE_LOGOS_CANONICA.md): ordem fixa + alturas ópticas relativas ao trio
LOGOS=[("logo-projeto-comunitario-milreu.png",0.92),("logo-ccdr-algarve.png",0.99),("logo-associacao-amigos-museu-lyceu-faro.png",0.92),
       ("logo-junta-freguesia-estoi.png",0.92),("Milreu_policromatico.png",1.00),("logo-ualg-completo.png",0.78)]

def apara_moldura(im):
    """Remove só a moldura branca/uniforme do scan: linhas/colunas de borda quase brancas (<= 12 % por lado)."""
    a=np.asarray(im.convert("L")).astype(np.float32); H,W=a.shape
    def borda(v,lim):
        # tolera uma linha escura de 1-3 px no limite do scan antes da moldura branca
        k=0
        while k<min(4,lim) and v[k]<=232: k+=1
        if k>=min(4,lim) or v[k]<=232: return 0
        n=k
        while n<lim and v[n]>232: n+=1
        return n
    rows=a.mean(1); cols=a.mean(0)
    t=borda(rows,int(H*.12)); b=borda(rows[::-1],int(H*.12)); l=borda(cols,int(W*.12)); r=borda(cols[::-1],int(W*.12))
    m=max(4,int(min(W,H)*0.004))  # folga para o fio cinzento da margem
    return im.crop((l+m if l else 0,t+m if t else 0,W-(r+m if r else 0),H-(b+m if b else 0)))

def logo_band(H_trio,maxw):
    ims=[]
    for fn,k in LOGOS:
        im=Image.open(os.path.join(LOGODIR,fn)).convert("RGBA"); a=np.asarray(im)[:,:,3]
        ys,xs=np.where(a>16); im=im.crop((xs.min(),ys.min(),xs.max()+1,ys.max()+1)); ims.append((im,k))
    def lay(Hh):
        it=[(im,Hh*k*im.size[0]/im.size[1],Hh*k) for im,k in ims]; g=0.6*Hh
        return it,g,sum(w for _,w,_ in it)+g*(len(it)-1)
    it,g,tot=lay(H_trio)
    if tot>maxw: H_trio*=maxw/tot; it,g,tot=lay(H_trio)
    band=Image.new("RGBA",(round(tot)+2,round(H_trio)+2),(0,0,0,0)); x=0.0
    for im,w,h in it:
        r=im.resize((max(1,round(w)),max(1,round(h))),Image.LANCZOS); band.alpha_composite(r,(round(x),round((H_trio-h)/2))); x+=w+g
    return band

