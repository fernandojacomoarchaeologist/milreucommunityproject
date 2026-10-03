# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar RIGHTS.md.
# Item 8 — MASTER/TEMPLATE do cartaz local (A3 master + A4 derivado). STAND BY / TEMPLATE READY.
# Campos locais = placeholders editáveis; slot institucional 2026 incluído. Gera só previews de template (demo).
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Item 8 — CARTAZ LOCAL editável (master A3 + derivado A4). FASE 1: previews + testes de campos + QA.
# Design System Milreu (Fraunces+Spectral). IMAGE CONTEXT FIRST. Campos locais = texto vivo (placeholders).
import os, sys, re
HERE=os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0,os.path.join(HERE,"..","qrpylibs"))
from PIL import Image, ImageDraw, ImageFont
import qrcode, numpy as _np
OUTP=os.path.join(HERE,"previews"); os.makedirs(OUTP,exist_ok=True)
GEN="/Users/fernandojacomo/Desktop/Milreu community Project/public/media/museum/generated"
LOGODIR="/Users/fernandojacomo/Desktop/Milreu community Project/public/media/exhibition/updated/logos"
LOGOS_CANON=["logo-projeto-comunitario-milreu.png","logo-ccdr-algarve.png","logo-associacao-amigos-museu-lyceu-faro.png","Milreu_policromatico.png","logo-ualg-completo.png"]
IMG_PRINCIPAL="/Users/fernandojacomo/Desktop/Milreu community Project/public/media/museum/originals/MM202601.png"  # [IMAGEM_PRINCIPAL] alta-res (substituível): Festa da Pinha
QURL="https://projectomilreu.pt"
MARF=(255,252,247); CAMPO=(251,246,238); CAMPO2=(244,236,221); INK=(30,26,23); INK7=(69,61,54); INK5=(118,109,100); INK3=(181,170,155)
RED=(168,50,39); KEY=(176,164,145); HAIR=(230,220,201); BROWN=(98,70,45)
FP=os.path.expanduser("~/Library/Fonts/")
FF={"d":"Fraunces.ttf","di":"Fraunces-Italic.ttf","s":"Spectral-Regular.ttf","sm":"Spectral-Medium.ttf","si":"Spectral-Italic.ttf"}
_fc={}
def font(k,px,wt=None):
    kk=(k,px,wt)
    if kk in _fc: return _fc[kk]
    f=ImageFont.truetype(FP+FF[k],px)
    if wt and k=="d":
        try: f.set_variation_by_name({600:"SemiBold",700:"Bold",900:"Black"}.get(wt,"SemiBold"))
        except Exception: pass
    _fc[kk]=f; return f
import os as _os
DPI=int(_os.environ.get("ITEM8_DPI","150")); mm=DPI/25.4
def P(v): return round(v*mm)
def PT(v): return round(v*DPI/72)
def _trim(p):
    im=Image.open(p).convert("RGBA"); a=_np.asarray(im); al=a[:,:,3]
    mask=(al>16) if al.min()<250 else (a[:,:,:3].sum(2)<735)
    ys,xs=_np.where(mask)
    if len(xs): im=im.crop((int(xs.min()),int(ys.min()),int(xs.max())+1,int(ys.max())+1))
    return im
class F:
    def __init__(s,W,H,bg=MARF): s.W=W;s.H=H;s.im=Image.new("RGB",(W,H),bg);s.d=ImageDraw.Draw(s.im)
    def rect(s,x,y,w,h,fill,outline=None,ow=1): s.d.rectangle([x,y,x+w,y+h],fill=fill,outline=outline,width=ow)
    def dash(s,x,y,w,h,fill,dash=14,ow=2):  # retângulo tracejado (placeholder)
        for xx in range(int(x),int(x+w),dash*2): s.d.line([(xx,y),(min(xx+dash,x+w),y)],fill=fill,width=ow); s.d.line([(xx,y+h),(min(xx+dash,x+w),y+h)],fill=fill,width=ow)
        for yy in range(int(y),int(y+h),dash*2): s.d.line([(x,yy),(x,min(yy+dash,y+h))],fill=fill,width=ow); s.d.line([(x+w,yy),(x+w,min(yy+dash,y+h))],fill=fill,width=ow)
    def line(s,x1,y1,x2,y2,fill,w=1): s.d.line([(x1,y1),(x2,y2)],fill=fill,width=w)
    def imgcover(s,x,y,w,h,path,ah=0.5,av=0.5):
        im=Image.open(path).convert("RGB");iw,ih=im.size;k=max(w/iw,h/ih)
        nw,nh=max(1,round(iw*k)),max(1,round(ih*k));im=im.resize((nw,nh),Image.LANCZOS)
        l=round((nw-w)*ah);t=round((nh-h)*av);s.im.paste(im.crop((l,t,l+w,t+h)),(round(x),round(y)))
    def tw(s,t,k,px,wt=None): return s.d.textlength(t,font=font(k,px,wt))
    def text(s,x,y,t,k,px,fill=INK,a="l",wt=None,ls=0):
        ft=font(k,px,wt)
        if ls and len(t)>1 and a=="l":
            cx=x
            for ch in t: s.d.text((cx,y),ch,font=ft,fill=fill,anchor="la");cx+=s.d.textlength(ch,font=ft)+ls
        else: s.d.text((x,y),t,font=ft,fill=fill,anchor={"l":"la","m":"ma","r":"ra"}[a])
    def wrap(s,t,k,px,maxw,wt=None):
        out=[]
        for pa in t.split("\n"):
            ln=""
            for w in pa.split():
                tt=(ln+" "+w).strip()
                if s.tw(tt,k,px,wt)<=maxw or not ln: ln=tt
                else: out.append(ln);ln=w
            out.append(ln)
        return out
    def para(s,x,y,t,k,px,maxw,fill=INK7,lh=1.42,a="l",wt=None):
        for ln in s.wrap(t,k,px,maxw,wt):
            xx=x if a=="l" else (x+maxw/2 if a=="m" else x+maxw)
            s.text(xx,y,ln,k,px,fill,a,wt); y+=round(px*lh)
        return y
    def fitpara(s,x,y,t,k,maxpx,minpx,maxw,maxlines,fill=INK,lh=1.08,wt=None,a="l"):
        """Auto-fit: reduz o corpo até caber em <=maxlines (nomes curtos e longos não partem o master)."""
        px=maxpx
        while px>minpx and len(s.wrap(t,k,px,maxw,wt))>maxlines: px-=1
        yy=y
        for ln in s.wrap(t,k,px,maxw,wt):
            xx=x if a=="l" else (x+maxw/2 if a=="m" else x+maxw)
            s.text(xx,yy,ln,k,px,fill,a,wt); yy+=round(px*lh)
        return yy,px
    def qr(s,x,y,size):
        q=qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M,border=0);q.add_data(QURL);q.make(fit=True)
        m=q.get_matrix();n=len(m);s.rect(x,y,size,size,MARF,outline=KEY,ow=max(1,size//180))
        qz=size*0.08;inner=size-2*qz;ms=inner/n
        for r in range(n):
            for c in range(n):
                if m[r][c]: s.d.rectangle([x+qz+c*ms,y+qz+r*ms,x+qz+c*ms+ms+0.6,y+qz+r*ms+ms+0.6],fill=INK)
    def logoband(s,x,y,h,names=LOGOS_CANON,gapf=0.6):
        gap=gapf*h; cx=float(x)
        for fn in names:
            p=os.path.join(LOGODIR,fn)
            if not os.path.exists(p): continue
            im=_trim(p); w=h*im.size[0]/im.size[1]
            s.im.paste(im.resize((max(1,round(w)),max(1,round(h))),Image.LANCZOS),(round(cx),round(y)), im.resize((max(1,round(w)),max(1,round(h))),Image.LANCZOS))
            cx+=w+gap
        return cx-gap-x
    def save(s,name): s.im.save(f"{OUTP}/{name}.png"); return s.im

# ---------------- MASTER DO CARTAZ ----------------
IDENT_EYEBROW="EXPOSIÇÃO ITINERANTE"
IDENT_TITLE="Entre Ruínas e Memórias"
IDENT_LINE="Memórias da população ligadas às Ruínas Romanas de Milreu."
IDENT_SUB="Exposição itinerante do Projecto Comunitário de Milreu"

def render(TW,TH,fields,outname,demo=True,img=IMG_PRINCIPAL,final=False):
    s=TW/297.0  # escala relativa ao A3 (A4 deriva)
    sf=max(s,0.86)  # escala do rodapé/acolhimento (não encolher demasiado no A4)
    # GUARDA — exports finais específicos nunca contêm placeholders nem dados fictícios
    _ph=any(("[" in str(v) or "]" in str(v)) for v in fields.values())
    if final:
        assert not _ph, "EXPORT FINAL bloqueado: campos ainda contêm placeholders []"
        for _k in ["NOME_DO_LOCAL","DATA_INICIO","DATA_FIM","HORARIO","MORADA"]:
            assert fields.get(_k), f"EXPORT FINAL bloqueado: campo obrigatório vazio: {_k}"
        demo=False  # export final nunca mostra marca de demonstração
    BL=3; FW,FH=TW+2*BL,TH+2*BL; Wp,Hp=P(FW),P(FH); bl=P(BL)
    mx=bl+P(15*s); cw=Wp-2*mx
    def pt(v): return PT(v*s)
    def ptf(v): return PT(v*sf)
    f=F(Wp,Hp,MARF)
    # ===== ZONA 1 — imagem + identidade (45–55%) =====
    ih=round(Hp*0.44); f.imgcover(0,0,Wp,ih,img,av=0.42); f.rect(0,ih,Wp,P(1.6*s),RED)
    cred=fields.get("CREDITO_IMAGEM")
    if cred:  # crédito obrigatório da fotografia (editável, ligado à imagem); faixa escura p/ legibilidade
        chh=pt(6.4)*1.7; f.rect(0,ih-chh,Wp,chh,(24,20,18))  # faixa escura p/ legibilidade do crédito
        f.text(Wp-mx,ih-chh+pt(6.4)*0.35,cred,"si",pt(6.4),(236,230,222),"r")
    if demo:
        f.text(mx,ih-chh+pt(6.4)*0.3 if cred else ih-P(5*s),"[IMAGEM_PRINCIPAL] · substituível","si",pt(6.5),(236,230,222),"l")
    y=ih+P(9*s)
    f.text(mx,y,IDENT_EYEBROW,"sm",pt(11),RED,"l",wt=500,ls=pt(1.6)); y+=P(8.5*s)
    y,_=f.fitpara(mx,y,IDENT_TITLE,"d",pt(40),pt(26),cw,2,INK,1.02,600); y+=P(1.5*s)
    y=f.para(mx,y,IDENT_SUB,"sm",pt(11),cw,INK7,1.3)+P(1*s)
    y=f.para(mx,y,IDENT_LINE,"si",pt(10.5),cw,INK5,1.3)+P(6*s)
    f.line(mx,y,Wp-mx,y,HAIR,max(1,P(0.3*s))); y+=P(6*s)
    # ===== ZONA 2 — informação local (25–30%), forte hierarquia =====
    # nome do local — maior; legível a 1–2 m; auto-fit curto/longo
    y,_=f.fitpara(mx,y,fields["NOME_DO_LOCAL"],"d",pt(42),pt(19),cw,2,INK,1.04,600); y+=P(2*s)
    if fields.get("CIDADE_LOCALIDADE"):
        f.rect(mx,y+P(0.5*s),P(1.6*s),pt(13.5)*0.8,RED)  # tique vermelho discreto p/ contraste
        y=f.para(mx+P(4*s),y,fields["CIDADE_LOCALIDADE"],"sm",pt(13.5),cw-P(4*s),INK7,1.2)+P(6*s)
    else: y+=P(3.5*s)
    # datas — grande, vermelho
    y,_=f.fitpara(mx,y,fields["DATA_INICIO"]+"  —  "+fields["DATA_FIM"],"d",pt(25),pt(14),cw,2,RED,1.08,600); y+=P(5*s)
    # horário (pode ter 2 linhas) + morada + entrada — pares rótulo/valor
    def row(y,label,value,vk="sm",vpx=None,vfill=INK7):
        if not value: return y
        f.text(mx,y,label,"sm",pt(8.5),INK3,"l",wt=500,ls=pt(0.5))
        yy=f.para(mx,y+P(5.5*s),value,vk,vpx or pt(11.5),cw,vfill,1.32)
        return yy+P(5*s)
    y=row(y,"HORÁRIO",fields["HORARIO"])
    y=row(y,"MORADA",fields["MORADA"])
    if fields.get("ENTRADA_CONDICOES"):
        y=row(y,"ENTRADA",fields["ENTRADA_CONDICOES"])
    # ===== ZONA 3 — CTA / site / QR (10–15%); escala sf para derivar bem no A4 =====
    z3=Hp-bl-P(76*sf)
    f.rect(bl,z3,Wp-2*bl,P(0.3*s),HAIR)
    qsz=P(24*sf); qx=Wp-mx-qsz; qy=z3+P(5*sf)
    f.qr(qx,qy,qsz)
    f.text(mx,z3+P(7*sf),"Conheça a exposição","d",ptf(15),INK,"l",wt=600)
    f.text(mx,z3+P(16*sf),"projectomilreu.pt","sm",ptf(13),RED,"l",wt=600)
    # ===== ZONA 4 — assinaturas SEPARADAS (8–12%); rodapé legível também no A4 (escala sf) =====
    z4=Hp-bl-P(46*sf)
    f.rect(bl,z4,Wp-2*bl,P(0.3*s),HAIR)
    # Bloco A — Projecto + parcerias institucionais (à esquerda)
    f.text(mx,z4+P(5.5*sf),"Projecto Comunitário de Milreu","sm",ptf(10.5),INK7,"l",wt=600)
    f.text(mx,z4+P(10.2*sf),"Museus sem Fronteiras · Iniciativas 2026","si",ptf(8.5),INK5,"l")
    f.text(mx,z4+P(14.8*sf),"Apoio institucional e parcerias","sm",ptf(7.2),INK5,"l",wt=500,ls=ptf(0.3))
    bh=P(7.8*sf); f.logoband(mx,z4+P(19.3*sf),bh)
    # Bloco C — Acolhimento (à direita), com PAINEL próprio para dar presença e separação
    hostw=P(56*sf); hx=Wp-mx-hostw; py=z4+P(3.5*sf); pbot=Hp-bl-P(3*s)
    f.rect(hx-P(5*sf),py,hostw+P(5*sf),pbot-py,CAMPO,outline=KEY,ow=max(1,round(1*sf)))
    f.rect(hx-P(5*sf),py,P(1.8*sf),pbot-py,RED)  # barra de destaque
    hy=py+P(4.5*sf)
    f.text(hx,hy,"ACOLHIMENTO","sm",ptf(8.5),RED,"l",wt=600,ls=ptf(0.6))
    bxw,bxh=hostw-P(3*sf),P(19*sf); bxy=hy+P(6*sf)
    la=fields.get("LOGO_ANFITRIAO")
    if la and os.path.exists(la):
        im=_trim(la); w=min(bxw, bxh*im.size[0]/im.size[1]); h=w*im.size[1]/im.size[0]
        rim=im.resize((max(1,round(w)),max(1,round(h))),Image.LANCZOS)
        f.im.paste(rim,(round(hx+(bxw-w)/2),round(bxy)),rim)
    else:
        f.rect(hx,bxy,bxw,bxh,MARF); f.dash(hx,bxy,bxw,bxh,KEY,dash=max(6,round(10*sf)),ow=max(1,round(2*sf)))
        f.text(hx+bxw/2,bxy+bxh/2-ptf(5.5),"[LOGÓTIPO DO ANFITRIÃO]","si",ptf(7.5),INK5,"m")
    f.text(hx,bxy+bxh+P(3.5*sf),"Com o apoio de  ·  [LOGOS_LOCAIS_ADICIONAIS]","si",ptf(6.5),INK3,"l")
    # marca de demonstração
    if demo:
        f.text(Wp/2,bl+P(2*s),"EXEMPLO · dados fictícios de demonstração","si",pt(6.5),INK3,"m")
    f.save(outname)
    return f

# ---------------- CAMPOS DE DEMONSTRAÇÃO (fictícios) ----------------
DEMO={"NOME_DO_LOCAL":"Casa das Artes","CIDADE_LOCALIDADE":"Vila Exemplo · Algarve",
      "CREDITO_IMAGEM":"Fotografia: Arquivo Nacional da Torre do Tombo — Foto Artística Samorrinha",
      "DATA_INICIO":"12 de Março","DATA_FIM":"27 de Abril de 2026",
      "HORARIO":"Terça a domingo · 10h00 – 18h00","MORADA":"Rua do Exemplo, 00 · 8000-000 Vila Exemplo",
      "ENTRADA_CONDICOES":"Entrada livre"}
CURTO=dict(DEMO, NOME_DO_LOCAL="Casa da Cultura", MORADA="Praça Central, 1 · 8000-001 Vila Exemplo",
           HORARIO="Terça a domingo · 10h – 18h")
LONGO=dict(DEMO, NOME_DO_LOCAL="Biblioteca Municipal e Centro de Interpretação do Património de São Brás de Exemplo",
           CIDADE_LOCALIDADE="União de Freguesias de Vila Exemplo e Monte Exemplo · Algarve",
           HORARIO="Terça a sexta · 10h00 – 13h00 e 14h00 – 18h00\nSábado, domingo e feriados · 10h00 – 19h00",
           MORADA="Largo da República e Centro Histórico, Edifício dos Antigos Paços do Concelho, 8150-000 Vila Exemplo",
           ENTRADA_CONDICOES="Entrada livre · visitas orientadas mediante marcação")

A3=(297,420); A4=(210,297)
render(*A3, DEMO, "08_A3_master")
render(*A4, DEMO, "08_A4_master")
render(*A3, CURTO, "08_A3_teste_curto")
render(*A3, LONGO, "08_A3_teste_longo")
# prancha A3 master + A4 master
def prancha(names,outname,labs):
    ims=[Image.open(f"{OUTP}/{n}.png") for n in names]; hh=1400
    sc=[im.resize((round(im.size[0]*hh/im.size[1]),hh)) for im in ims]
    pad=30;Wc=sum(i.size[0] for i in sc)+pad*(len(sc)+1);Hc=hh+2*pad+36
    sh=Image.new("RGB",(Wc,Hc),(238,232,222));d=ImageDraw.Draw(sh);x=pad
    for lab,im in zip(labs,sc): sh.paste(im,(x,pad));d.text((x,pad+hh+10),lab,fill=(60,54,48),font=font("sm",22));x+=im.size[0]+pad
    sh.save(f"{OUTP}/{outname}.png")
prancha(["08_A3_master","08_A4_master"],"_PRANCHA_A3_A4",["A3 · master","A4 · derivado"])
prancha(["08_A3_teste_curto","08_A3_teste_longo"],"_PRANCHA_TESTES",["Teste · nome curto","Teste · nome longo + horário 2 linhas + morada extensa"])
print("ok: A3/A4 master + testes + pranchas")
