# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar RIGHTS.md.
# Item 8 — TIPO CANÓNICO 3/3: POST DE REDE SOCIAL (Facebook, Instagram e stories). Ver README.md desta pasta.
# Decisão do responsável (2026-10-14): peça INFORMATIVA, tipografia legível, SEM QR (o link vai no corpo do post).
# Formatos: 1080×1350 (feed Instagram/Facebook, 4:5) · 1080×1080 (quadrado) · 1080×1920 (stories, com zonas seguras).
# Composição: fotografia principal do evento (com crédito) + bloco de informação + rodapé institucional
# (site, identidade MSF 2026, Faixa de Logos canónica, «Apoiado pela CCDR Algarve, I.P.»).
# Tamanhos mínimos a 1080 px de largura: corpo ≥ 30 px, rótulos ≥ 19 px, crédito ≥ 19 px.
# Uso: python3 post_social.py <pasta do evento>
import os, sys
from PIL import Image, ImageDraw, ImageFont
HERE=os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0,HERE)
import evento_lib as L

MARF=(255,252,247); CAMPO2=(244,236,221); INK=(30,26,23); INK7=(69,61,54); INK5=(118,109,100)
RED=(168,50,39); HAIR=(230,220,201); CRED=(24,20,18)
FONTS=os.path.expanduser("~/Library/Fonts/")
_fc={}
def font(name,px,var=None):
    key=(name,px,var)
    if key not in _fc:
        f=ImageFont.truetype(FONTS+name,max(8,round(px)))
        if var:
            try: f.set_variation_by_name(var)
            except Exception: pass
        _fc[key]=f
    return _fc[key]

# nome: (W, H, escala inicial, foto mínima (fracção de H), margem segura topo/base em px)
FORMATOS={
  "post_1080x1350":(1080,1350,1.10,0.27,(0,0)),
  "post_1080x1080":(1080,1080,1.00,0.22,(0,0)),
  "stories_1080x1920":(1080,1920,1.30,0.24,(0,250)),
}

def wrap(d,t,f,maxw):
    out=[]
    for pa in t.split("\n"):
        ln=""
        for w in pa.split():
            tt=(ln+" "+w).strip()
            if d.textlength(tt,font=f)<=maxw or not ln: ln=tt
            else: out.append(ln); ln=w
        out.append(ln)
    return out

def ajusta(d,t,nome,px,var,maxw,minpx):
    """Reduz o corpo até o texto caber numa linha (títulos, datas)."""
    f=font(nome,px,var)
    while px>minpx and d.textlength(t,font=f)>maxw: px-=1; f=font(nome,px,var)
    return f

def blocos(ev,d,k,cw,colunas=2):
    """Lista de blocos (altura, função de desenho) do conteúdo informativo, à escala k."""
    B=[]
    def txt(s,f,col,ls=0,lh=1.18):
        lines=wrap(d,s,f,cw); h=round(f.size*lh)*len(lines)
        def draw(dr,x,y):
            for ln in lines:
                if ls:
                    cx=x
                    for ch in ln: dr.text((cx,y),ch,font=f,fill=col); cx+=dr.textlength(ch,font=f)+ls
                else: dr.text((x,y),ln,font=f,fill=col)
                y+=round(f.size*lh)
        return h,draw
    gap=lambda px:(round(px*k),None)
    B.append(txt(L.EYEBROW,font("Archivo.ttf",24*k,"Bold"),RED,ls=round(4*k))); B.append(gap(10))
    B.append(txt(L.TITULO,ajusta(d,L.TITULO,"Fraunces.ttf",round(72*k),"SemiBold",cw,40),INK,lh=1.08)); B.append(gap(24))
    def fio(dr,x,y): dr.line([(x,y),(x+cw,y)],fill=HAIR,width=max(2,round(2*k)))
    B.append((max(2,round(2*k)),fio)); B.append(gap(24))
    nome=ev["local"]["nome"]
    fn=font("Fraunces.ttf",round(52*k),"SemiBold")
    if d.textlength(nome,font=fn)>cw: fn=ajusta(d,nome,"Fraunces.ttf",round(52*k),"SemiBold",cw,round(40*k))
    B.append(txt(nome,fn,INK,lh=1.08)); B.append(gap(6))
    if ev["local"].get("localidade"): B.append(txt(ev["local"]["localidade"],font("Spectral-Medium.ttf",30*k),INK7)); B.append(gap(20))
    dt=L.datas_longas(ev)
    B.append(txt(dt,ajusta(d,dt,"Fraunces.ttf",round(46*k),"SemiBold",cw,round(30*k)),RED,lh=1.12)); B.append(gap(22))
    dst=ev.get("destaque")
    if dst:
        fl=font("Archivo.ttf",21*k,"Bold"); q=L.destaque_quando(ev); pad=round(20*k); barra=round(8*k)
        fq=ajusta(d,q,"Fraunces.ttf",round(38*k),"SemiBold",cw-2*pad-barra,round(28*k))
        h=pad+round(fl.size*1.3)+round(6*k)+round(fq.size*1.15)+pad
        def caixa(dr,x,y,fl=fl,fq=fq,h=h,q=q):
            dr.rectangle([x,y,x+cw,y+h],fill=CAMPO2); dr.rectangle([x,y,x+barra,y+h],fill=RED)
            cx=x+barra+pad; yy=y+pad
            for ch in dst.get("rotulo","").upper(): dr.text((cx,yy),ch,font=fl,fill=RED); cx+=dr.textlength(ch,font=fl)+round(3*k)
            dr.text((x+barra+pad,yy+round(fl.size*1.3)+round(6*k)),q,font=fq,fill=INK)
        B.append((h,caixa)); B.append(gap(24))
    # informação prática: rótulo pequeno + valor legível.
    # Em 2 colunas (horário | morada + entrada) nos formatos de feed; numa coluna nas stories (colunas=1).
    fr=font("Archivo.ttf",19*k,"Bold"); fv=font("Spectral-Regular.ttf",31*k)
    g=round(32*k)
    if colunas==1: c1=c2=cw
    else: c1=round((cw-g)*0.54); c2=cw-g-c1
    def bloco_info(rot,val,largura):
        lines=wrap(d,val,fv,largura); return lines,round(fr.size*1.4)+round(fv.size*1.25)*len(lines)
    col1=[("HORÁRIO",)+bloco_info("HORÁRIO","\n".join(ev["horario"]),c1)]
    col2=[(r,)+bloco_info(r,v,c2) for r,v in [("MORADA",ev["local"]["morada"]),("ENTRADA",ev["entrada"])]]
    sep=round(14*k)
    h1=sum(h for _,_,h in col1); h2=sum(h for _,_,h in col2)+sep*(len(col2)-1)
    pos=[(0,0,col1),(0,h1+sep,col2)] if colunas==1 else [(0,0,col1),(c1+g,0,col2)]
    def info(dr,x,y):
        for dx,dy,col in pos:
            xx=x+dx; yy=y+dy
            for rot,lines,h in col:
                cx=xx
                for ch in rot: dr.text((cx,yy),ch,font=fr,fill=INK5); cx+=dr.textlength(ch,font=fr)+round(2*k)
                ly=yy+round(fr.size*1.4)
                for ln in lines: dr.text((xx,ly),ln,font=fv,fill=INK); ly+=round(fv.size*1.25)
                yy+=h+sep
    B.append((h1+sep+h2 if colunas==1 else max(h1,h2),info))
    return B

def rodape(ev,d,k,cw):
    """Rodapé institucional: convite ao site + identidade + Faixa de Logos canónica + art. 16.º."""
    fs=font("Spectral-Italic.ttf",27*k); fu=font("Fraunces.ttf",round(42*k),"SemiBold")
    fm=font("Spectral-Medium.ttf",25*k); fmsf=font("Archivo.ttf",17*k,"Medium"); fcc=font("Spectral-Italic.ttf",20*k)
    band=L.logo_band(round(46*k),cw)
    esq=max(d.textlength("Saiba mais e acompanhe a agenda em",font=fs),d.textlength(L.SITE,font=fu))
    dirr=max(d.textlength(L.MARCA,font=fm),sum(d.textlength(ch,font=fmsf)+round(1.5*k) for ch in L.MSF))
    lado=esq+dirr+round(40*k)<=cw
    hesq=round(fs.size*1.25)+round(fu.size*1.15); hdir=round(fm.size*1.3)+round(fmsf.size*1.6)
    topo=max(hesq,hdir) if lado else hesq+round(14*k)+hdir
    h=round(20*k)+topo+round(16*k)+band.size[1]+round(10*k)+round(fcc.size*1.3)
    def draw(img,dr,x,y):
        dr.line([(x,y),(x+cw,y)],fill=HAIR,width=max(2,round(2*k))); y+=round(20*k)
        dr.text((x,y),"Saiba mais e acompanhe a agenda em",font=fs,fill=INK5)
        dr.text((x,y+round(fs.size*1.25)),L.SITE,font=fu,fill=RED)
        tw=sum(dr.textlength(ch,font=fmsf)+round(1.5*k) for ch in L.MSF)-round(1.5*k)
        if lado: xr=x+cw; yi=y+round(4*k); dr.text((xr,yi),L.MARCA,font=fm,fill=INK,anchor="ra"); cx=xr-tw
        else: yi=y+hesq+round(14*k); dr.text((x,yi),L.MARCA,font=fm,fill=INK); cx=x
        for ch in L.MSF: dr.text((cx,yi+round(fm.size*1.3)),ch,font=fmsf,fill=INK5); cx+=dr.textlength(ch,font=fmsf)+round(1.5*k)
        y+=topo+round(16*k)
        img.alpha_composite(band,(x,y)); y+=band.size[1]+round(10*k)
        dr.text((x,y),L.CCDR,font=fcc,fill=INK5)
    return h,draw

def foto(ev,W,ph,k):
    ip=ev["imagem_principal"]; im=L.apara_moldura(Image.open(L.repo_path(ip["ficheiro"])).convert("RGB"))
    s=max(W/im.size[0],ph/im.size[1]); im=im.resize((round(im.size[0]*s)+1,round(im.size[1]*s)+1),Image.LANCZOS)
    av=ip.get("enquadramento_vertical",0.5); x0=(im.size[0]-W)//2; y0=round((im.size[1]-ph)*av)
    return im.crop((x0,y0,x0+W,y0+ph))

def render(ev,nome):
    W,H,k0,fmin,(stop,sbot)=FORMATOS[nome]
    mx=round(72*W/1080); cw=W-2*mx
    d=ImageDraw.Draw(Image.new("RGB",(1,1)))
    k=k0
    while True:
        B=blocos(ev,d,k,cw,colunas=1 if H/W>1.5 else 2); hc=sum(h for h,_ in B); hr,draw_r=rodape(ev,d,k,cw)
        pad=round(40*k); ph=H-sbot-hr-hc-3*pad-round(8*k)
        if ph>=fmin*H or k<=0.72: break
        k-=0.02
    img=Image.new("RGBA",(W,H),MARF+(255,)); dr=ImageDraw.Draw(img)
    img.paste(foto(ev,W,ph,k),(0,0))
    # crédito obrigatório da fotografia (faixa escura chapada no fundo da imagem)
    fc=font("Spectral-Italic.ttf",19*W/1080 if H>W else 17*W/1080); cl=wrap(dr,ev["imagem_principal"]["credito"],fc,W-2*mx)[:2]
    ch=round(fc.size*1.3)*len(cl)+round(16*W/1080)
    dr.rectangle([0,ph-ch,W,ph],fill=CRED); yy=ph-ch+round(8*W/1080)
    for ln in cl: dr.text((W-mx,yy),ln,font=fc,fill=(236,230,222),anchor="ra"); yy+=round(fc.size*1.3)
    dr.rectangle([0,ph,W,ph+round(8*k)],fill=RED)
    y=ph+round(8*k)+pad
    for h,fn in B:
        if fn: fn(dr,mx,y)
        y+=h
    draw_r(img,dr,mx,H-sbot-hr-pad)
    return img.convert("RGB"),k

def gerar(pasta):
    ev=L.carregar(pasta); OUT=L.saida(ev,"social"); pre=ev["prefixo_ficheiros"]
    for nome in FORMATOS:
        im,k=render(ev,nome)
        base=os.path.join(OUT,f"{pre}_{nome}")
        im.save(base+".png",optimize=True); im.save(base+".jpg",quality=92,optimize=True,progressive=True)
        print(f"OK {os.path.basename(base)} escala={k:.2f}")

if __name__=="__main__":
    if len(sys.argv)<2: raise SystemExit("uso: python3 post_social.py <pasta do evento>")
    gerar(sys.argv[1])
