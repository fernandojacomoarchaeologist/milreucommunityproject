# -*- coding: utf-8 -*-
# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar RIGHTS.md.
# FONTE DE EDITORAÇÃO CANÓNICA (portada para caminhos relativos ao repositório).
import os as _os
def _repo_root(p):
    p=_os.path.abspath(p)
    while p!="/" and not _os.path.exists(_os.path.join(p,"CLAUDE.md")): p=_os.path.dirname(p)
    return p
_REPO=_repo_root(_os.path.dirname(__file__))
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Item 6 — ARTE-FINAL. Mesma composição/tipografia/hierarquia/copy APROVADAS (v6); só exportação.
Dual PIL + SVG editável (grupos separados, não achatado) @300dpi. PDFs print A6/A4/A3 (sangria 3mm + marcas).
Digitais PNG/JPG. QR real. QA técnico. NÃO alterar layout."""
import os,sys,io,base64,re
HERE=os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0,os.path.join(HERE,"..","qrpylibs"))
from PIL import Image, ImageDraw, ImageFont
import qrcode
import numpy as _np
LOGODIR=_os.path.join(_REPO,"public","media","exhibition","updated","logos")
LOGOS_CANON=["logo-projeto-comunitario-milreu.png","logo-ccdr-algarve.png","logo-associacao-amigos-museu-lyceu-faro.png","Milreu_policromatico.png","logo-ualg-completo.png"]
def _trimlogo(p):
    im=Image.open(p).convert("RGBA"); a=_np.asarray(im); al=a[:,:,3]
    mask=(al>16) if al.min()<250 else (a[:,:,:3].sum(2)<735)
    ys,xs=_np.where(mask)
    if len(xs): im=im.crop((int(xs.min()),int(ys.min()),int(xs.max())+1,int(ys.max())+1))
    return im
OUTF=os.path.join(HERE,"arte_final"); os.makedirs(OUTF,exist_ok=True)
PHOTO=os.path.join(_REPO,"docs","dissemination","_SOURCES_SHARED","assets","production-derivatives","MM202608_contexto.png")  # FASE A2: derivado canónico (= antigo MM202608.png)
QURL="https://pt.surveymonkey.com/r/3CFG2MQ"
MARF=(255,252,247); CAMPO=(251,246,238); INK=(30,26,23); INK7=(69,61,54); INK5=(118,109,100); INK3=(181,170,155)
RED=(168,50,39); KEY=(176,164,145); HAIR=(230,220,201); BROWN=(98,70,45)
FP=os.path.expanduser("~/Library/Fonts/")
FF={"d":"Fraunces.ttf","di":"Fraunces-Italic.ttf","s":"Spectral-Regular.ttf","sm":"Spectral-Medium.ttf","si":"Spectral-Italic.ttf","u":"Archivo.ttf"}
FAM={"d":"Fraunces","di":"Fraunces","s":"Spectral","sm":"Spectral","si":"Spectral","u":"Archivo"}
def hexof(c): return "#%02x%02x%02x"%(c[0],c[1],c[2])
def esc(t): return t.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")
_fc={}
def font(k,px,wt=None):
    kk=(k,px,wt)
    if kk in _fc: return _fc[kk]
    f=ImageFont.truetype(FP+FF[k],px)
    if wt and k in("d","u"):
        try: f.set_variation_by_name({600:"SemiBold",700:"Bold",900:"Black"}.get(wt,"SemiBold"))
        except Exception: pass
    _fc[kk]=f; return f
CHAMADA="Milreu também se constrói com a sua opinião."
EXPL1="Partilhe a sua experiência, percepção e relação com Milreu."
CONTEXT="A sua resposta ajuda-nos a compreender melhor como Milreu é conhecido, vivido e pensado por quem com ele se relaciona."
URL="pt.surveymonkey.com/r/3CFG2MQ"
SIG="Projecto Comunitário de Milreu"

class F:
    def __init__(s,W,H,bg=MARF,phys=True):
        s.W=W; s.H=H; s.phys=phys; s.im=Image.new("RGB",(W,H),bg); s.d=ImageDraw.Draw(s.im)
        s.groups={}; s.order=[]; s.cur="misc"; s.bg=bg
    def group(s,name):
        s.cur=name
        if name not in s.groups: s.groups[name]=[]; s.order.append(name)
    def _svg(s,el): s.groups.setdefault(s.cur,[]); (s.order.append(s.cur) if s.cur not in s.order else None); s.groups[s.cur].append(el)
    def rect(s,x,y,w,h,fill):
        s.d.rectangle([x,y,x+w,y+h],fill=fill)
        s._svg(f'<rect x="{x:.2f}" y="{y:.2f}" width="{w:.2f}" height="{h:.2f}" fill="{hexof(fill)}"/>')
    def imgcover(s,x,y,w,h,path,ah=0.5,av=0.5):
        im=Image.open(path).convert("RGB"); iw,ih=im.size; k=max(w/iw,h/ih)
        nw,nh=max(1,round(iw*k)),max(1,round(ih*k)); im=im.resize((nw,nh),Image.LANCZOS)
        l=round((nw-w)*ah); t=round((nh-h)*av); band=im.crop((l,t,l+w,t+h))
        s.im.paste(band,(x,y))
        buf=io.BytesIO(); band.save(buf,"JPEG",quality=86); b64=base64.b64encode(buf.getvalue()).decode()
        s._svg(f'<image x="{x}" y="{y}" width="{w}" height="{h}" preserveAspectRatio="none" xlink:href="data:image/jpeg;base64,{b64}"/>')
    def tw(s,t,k,px,wt=None): return s.d.textlength(t,font=font(k,px,wt))
    def text(s,x,y,t,k,px,fill=INK,a="l",wt=None,ls=0):
        ft=font(k,px,wt)
        if ls and len(t)>1 and a=="l":
            cx=x
            for ch in t: s.d.text((cx,y),ch,font=ft,fill=fill,anchor="la"); cx+=s.d.textlength(ch,font=ft)+ls
        else:
            anc={"l":"la","m":"ma","r":"ra"}[a]; s.d.text((x,y),t,font=ft,fill=fill,anchor=anc)
        wght=wt if wt else (500 if k=="sm" else 400)
        style=' font-style="italic"' if k in("di","si") else ''
        anchor={"l":"start","m":"middle","r":"end"}[a]
        lsa=f' letter-spacing="{ls:.2f}"' if ls else ''
        s._svg(f'<text x="{x:.2f}" y="{y:.2f}" font-family="{FAM[k]}" font-size="{px}" fill="{hexof(fill)}" font-weight="{wght}" text-anchor="{anchor}" dominant-baseline="text-before-edge"{style}{lsa}>{esc(t)}</text>')
    def wrap(s,t,k,px,maxw,wt=None):
        out=[]
        for para in t.split("\n"):
            ln=""
            for w in para.split():
                tt=(ln+" "+w).strip()
                if s.tw(tt,k,px,wt)<=maxw or not ln: ln=tt
                else: out.append(ln); ln=w
            out.append(ln)
        return out
    def para(s,x,y,t,k,px,maxw,fill=INK7,lh=1.42,a="l",wt=None):
        for ln in s.wrap(t,k,px,maxw,wt):
            xx=x if a=="l" else (x+maxw/2 if a=="m" else x+maxw)
            s.text(xx,y,ln,k,px,fill,a,wt); y+=round(px*lh)
        return y
    def fit(s,x,y,t,k,maxpx,maxw,fill=INK,a="l",wt=None):
        px=maxpx
        while s.tw(t,k,px,wt)>maxw and px>8: px-=1
        s.text(x,y,t,k,px,fill,a,wt); return px
    def qr(s,x,y,size):
        q=qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M,border=0); q.add_data(QURL); q.make(fit=True)
        m=q.get_matrix(); n=len(m)
        s.rect(x,y,size,size,MARF)
        bw=max(1,size/180.0); s.d.rectangle([x,y,x+size,y+size],outline=KEY,width=max(1,round(bw)))
        s._svg(f'<rect x="{x:.2f}" y="{y:.2f}" width="{size:.2f}" height="{size:.2f}" fill="none" stroke="{hexof(KEY)}" stroke-width="{bw:.2f}"/>')
        qz=size*0.085; inner=size-2*qz; ms=inner/n; mods=[]
        for r in range(n):
            for c in range(n):
                if m[r][c]:
                    mxp=x+qz+c*ms; myp=y+qz+r*ms
                    s.d.rectangle([mxp,myp,mxp+ms+0.6,myp+ms+0.6],fill=INK)
                    mods.append(f'<rect x="{mxp:.2f}" y="{myp:.2f}" width="{ms+0.6:.2f}" height="{ms+0.6:.2f}"/>')
        s._svg(f'<g fill="{hexof(INK)}" data-qr="{QURL}">'+"".join(mods)+'</g>')
    def logoband(s,x,y,h):
        # fila canónica (5 unidades), alinhada à esquerda, gap = 0,6 x altura (proporção do trio)
        gap=0.6*h; cx=float(x)
        for fn in LOGOS_CANON:
            p=os.path.join(LOGODIR,fn)
            if not os.path.exists(p): continue
            im=_trimlogo(p); w=h*im.size[0]/im.size[1]
            rim=im.resize((max(1,round(w)),max(1,round(h))),Image.LANCZOS)
            s.im.paste(rim,(round(cx),round(y)),rim)
            buf=io.BytesIO(); im.save(buf,"PNG"); b64=base64.b64encode(buf.getvalue()).decode()
            s._svg(f'<image x="{cx:.2f}" y="{y:.2f}" width="{w:.2f}" height="{h:.2f}" xlink:href="data:image/png;base64,{b64}"/>')
            cx+=w+gap
        return cx-gap-x  # largura total da fila
    def save(s,name):
        s.im.save(f"{OUTF}/{name}.png")
        body="".join(f'<g id="{g}">'+"".join(s.groups[g])+"</g>" for g in s.order)
        if s.phys:
            wmm=round(s.W*25.4/DPI,2); hmm=round(s.H*25.4/DPI,2); dim=f'width="{wmm}mm" height="{hmm}mm"'
        else: dim=f'width="{s.W}" height="{s.H}"'
        svg=(f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" {dim} viewBox="0 0 {s.W} {s.H}">'
             f'<rect width="{s.W}" height="{s.H}" fill="{hexof(s.bg)}"/>{body}</svg>')
        open(f"{OUTF}/{name}.svg","w").write(svg)

DPI=300; mm=DPI/25.4
def P(v): return round(v*mm)
def PT(v): return round(v*DPI/72)

def partner_footer(f,mx,rx,top_y,bandh,sig_px,sub_px,gap):
    """BLOCO INSTITUCIONAL — TOP-anchored: começa INTEIRAMENTE abaixo do bloco CTA/QR.
    Separador + assinatura (dominante) + identificador 2026 (menor/secundário) + subtítulo + logos.
    `top_y` = y do separador (já abaixo do fundo do QR + espaço real)."""
    cw=rx-mx
    idf_px=max(round(sub_px*1.0),round(sig_px*0.72))  # identificador MENOR que a assinatura (secundário)
    f.group("partners")
    rule_y=top_y
    f.rect(mx,rule_y,cw,max(1,round(bandh*0.016)),HAIR)
    sig_y=rule_y+round(gap*1.7)
    idf_y=sig_y+sig_px+round(gap*1.95)   # mais respiro entre assinatura e identificador (microajuste óptico)
    sub_y=idf_y+idf_px+round(gap*1.15)
    band_y=sub_y+sub_px+round(gap*1.2)
    f.text(mx,sig_y,SIG,"u",sig_px,INK5,"l",wt=600)
    # identificador = Archivo maiúsculas espaçado (tipografia do sistema), secundário e com respiro
    f.text(mx,idf_y,"MUSEUS SEM FRONTEIRAS · INICIATIVAS 2026","u",idf_px,INK5,"l",ls=max(1,round(idf_px*0.10)))
    f.text(mx,sub_y,"Apoio institucional e parcerias","u",sub_px,INK5,"l",wt=600,ls=max(1,round(sub_px*0.05)))
    f.logoband(mx,band_y,bandh)
    return band_y+bandh

# ======= LAYOUT APROVADO (v6) — NÃO ALTERAR =======
def a6_frente():
    W,H=P(111),P(154); bl=P(3); mx=bl+P(8); rx=W-bl-P(8); cw=rx-mx; u=P(3)
    f=F(W,H,MARF,phys=True)
    # imagem reduzida para recompor e dar respiro ao rodapé institucional (convite é de face única)
    f.group("image"); ih=round(H*0.29); f.imgcover(0,0,W,ih,PHOTO,av=0.62)
    y=ih+2*u
    f.group("eyebrow"); f.text(mx,y,"INQUÉRITO MILREU 2026","u",PT(8.5),RED,"l",wt=600,ls=PT(1.1)); y+=PT(8.5)+u
    f.group("headline"); hpx=PT(20)
    while hpx>PT(15) and len(f.wrap(CHAMADA,"d",hpx,cw,600))>2: hpx-=1
    y=f.para(mx,y,CHAMADA,"d",hpx,cw,INK,1.12,"l",wt=600)+round(1.3*u)
    f.group("description"); y=f.para(mx,y,EXPL1,"s",PT(9.5),cw,INK7,1.3,"l")+round(u*0.8)
    qs=P(29)
    f.group("qr"); f.qr(mx,y,qs); tx=mx+qs+P(5); cy=y+qs/2
    f.group("cta"); f.text(tx,round(cy-PT(8)),"PARTICIPE","u",PT(10.5),INK,"l",wt=700,ls=PT(0.5))
    f.group("url"); f.text(tx,round(cy+PT(3)),URL,"u",PT(7.0),RED,"l",wt=400)
    # ---- bloco institucional: começa abaixo do fundo do QR + espaço real (quiet zone intacta) ----
    partner_footer(f,mx,rx,y+qs+P(8),P(5.0),PT(7.5),PT(5.6),P(2.3))
    f.save("06_A6_frente"); return (105,148)

def ax(name,trim_w,trim_h):
    W,H=P(trim_w+6),P(trim_h+6); bl=P(3); k=trim_w/210.0; u=round(P(5)*k); mx=round(P(14)*k); rx=W-mx; cw=rx-mx
    def pt(v): return round(PT(v)*k)
    f=F(W,H,MARF,phys=True)
    f.group("image"); ih=round(H*0.35); f.imgcover(0,0,W,ih,PHOTO,av=0.60)
    y=ih+round(1.6*u)
    f.group("eyebrow"); f.text(mx,y,"INQUÉRITO MILREU 2026","u",pt(13),RED,"l",wt=600,ls=pt(2.2)); y+=pt(13)+u
    f.group("headline"); hpx=pt(42)
    while hpx>pt(26) and len(f.wrap(CHAMADA,"d",hpx,cw,600))>2: hpx-=1
    y=f.para(mx,y,CHAMADA,"d",hpx,cw,INK,1.08,"l",wt=600)+round(1.1*u)
    f.group("description"); y=f.para(mx,y,EXPL1,"sm",pt(14),cw,INK,1.3,"l")+round(0.5*u)
    f.group("context"); y=f.para(mx,y,CONTEXT,"s",pt(11),cw,INK7,1.4,"l")+round(0.6*u)
    qs=round(P(54)*k)
    f.group("qr"); f.qr(mx,y,qs); tx=mx+qs+round(P(8)*k); cy=y+qs/2
    f.group("cta"); f.text(tx,round(cy-pt(16)),"PARTICIPE","u",pt(19),INK,"l",wt=700,ls=pt(1))
    f.group("url"); f.text(tx,round(cy+pt(5)),URL,"u",pt(12),RED,"l",wt=400)
    # bloco institucional TOP-anchored: começa abaixo do fundo do QR + espaço real (quiet zone intacta)
    partner_footer(f,mx,rx,y+qs+round(P(12)*k),round(P(7)*k),pt(11),pt(7),round(P(3)*k))
    f.save(name); return (trim_w,trim_h)

def digital(name,W,H,story=False):
    f=F(W,H,MARF,phys=False); mx=72; rx=W-72; cw=rx-mx; u=40
    f.group("image"); ih=round(H*(0.25 if story else 0.22)); f.imgcover(0,0,W,ih,PHOTO,av=0.60)
    y=ih+round(0.8*u)
    f.group("eyebrow"); f.text(mx,y,"INQUÉRITO MILREU 2026","u",30,RED,"l",wt=600,ls=6); y+=30+round(0.7*u)
    f.group("headline"); hpx=82 if story else 72
    while hpx>52 and len(f.wrap(CHAMADA,"d",hpx,cw,600))>2: hpx-=1
    y=f.para(mx,y,CHAMADA,"d",hpx,cw,INK,1.08,"l",wt=600)+round(0.55*u)
    f.group("description"); y=f.para(mx,y,EXPL1,"sm",30,cw,INK,1.3,"l")+round(0.15*u)
    f.group("context"); y=f.para(mx,y,CONTEXT,"s",26,cw,INK7,1.4,"l")+round(0.5*u)
    qs=round(W*(0.27 if story else 0.23))
    f.group("qr"); f.qr(mx,y,qs); tx=mx+qs+40; cy=y+qs/2
    f.group("cta"); f.text(tx,round(cy-34),"PARTICIPE","u",40,INK,"l",wt=700,ls=2)
    f.group("url"); f.text(tx,round(cy+6),URL,"u",28,RED,"l",wt=400)
    sy=round(y+qs+round(0.9*u))
    # bloco institucional COMPLETO (Projecto -> identificador -> Apoio -> logos) em ambos os digitais
    if story:
        # Story/Status 1080x1920: safe-area inferior adequada (logos nunca nos últimos píxeis)
        partner_footer(f,mx,rx,max(sy+24,H-300-320),52,28,22,24)
    else:
        # feed vertical 1080x1350: bloco institucional completo, abaixo do QR
        partner_footer(f,mx,rx,sy+28,52,28,22,24)
    f.save(name)

def printpdf(name,trim_w,trim_h):
    im=Image.open(f"{OUTF}/{name}.png").convert("RGB"); d=ImageDraw.Draw(im)
    b=P(3); W,H=im.size; lw=max(2,P(0.25)); glen=P(2.2); gap=P(0.5)
    for (x,y,sx,sy) in [(b,b,-1,-1),(W-b,b,1,-1),(b,H-b,-1,1),(W-b,H-b,1,1)]:
        d.line([(x,y+sy*gap),(x,y+sy*(gap+glen))],fill=INK,width=lw)
        d.line([(x+sx*gap,y),(x+sx*(gap+glen),y)],fill=INK,width=lw)
    out=f"{OUTF}/{name}_PRINT.pdf"; im.save(out,"PDF",resolution=DPI); return out

# ======= GERAR =======
dims={}
dims["06_A6_frente"]=a6_frente()
dims["06_A4"]=ax("06_A4",210,297)
dims["06_A3"]=ax("06_A3",297,420)
digital("06_1080x1350",1080,1350,False)
digital("06_1080x1920",1080,1920,True)
for n in ["06_A6_frente","06_A4","06_A3"]: printpdf(n,*dims[n])
for n in ["06_1080x1350","06_1080x1920"]:
    im=Image.open(f"{OUTF}/{n}.png").convert("RGB"); im.save(f"{OUTF}/{n}.jpg","JPEG",quality=92)
print("GERADO.")

# ======= QA TÉCNICO =======
print("\n==== QA TÉCNICO ====")
ok=True
# 1+2 dimensões físicas e bleed
for n,(tw_,th_) in dims.items():
    im=Image.open(f"{OUTF}/{n}.png"); exp=(P(tw_+6),P(th_+6))
    good=im.size==exp; ok&=good
    print(f"[{'OK' if good else 'FALHA'}] {n}: {im.size}px = {im.size[0]*25.4/DPI:.1f}x{im.size[1]*25.4/DPI:.1f}mm (trim {tw_}x{th_} + sangria 3mm, esperado {exp})")
# 4 URL sem quebra (texto único; confirmar que cabe)
def urlfit(name,k,px,maxw):
    w=ImageDraw.Draw(Image.new("RGB",(10,10))).textlength(URL,font=font(k,px));
    print(f"[{'OK' if w<=maxw else 'FALHA'}] URL {name}: {w:.0f}px <= {maxw:.0f}px (uma linha, sem quebra)")
    return w<=maxw
# medir larguras disponíveis por formato
A6w=P(111)-(P(3)+P(8))-(P(29)+P(5))-(P(3)+P(8))  # à direita do QR
ok&=urlfit("A6",'u',PT(7.0),A6w)
for nm,twmm in [("A4",210),("A3",297)]:
    k=twmm/210.0; W=P(twmm+6); mx=round(P(14)*k); qs=round(P(54)*k); avail=W-mx-(mx+qs+round(P(8)*k))
    ok&=urlfit(nm,'u',round(PT(12)*k),avail)
for nm,W,story in [("1080x1350",1080,False),("1080x1920",1080,True)]:
    qs=round(W*(0.27 if story else 0.23)); avail=(W-72)-(72+qs+40)
    ok&=urlfit(nm,'u',28,avail)
# 5 QR validação digital (round-trip de matriz)
q=qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M,border=0); q.add_data(QURL); q.make(fit=True)
M=q.get_matrix(); n=len(M)
tmp=Image.new("L",(n*10,n*10),255); dd=ImageDraw.Draw(tmp)
for r in range(n):
    for c in range(n):
        if M[r][c]: dd.rectangle([c*10,r*10,c*10+9,r*10+9],fill=0)
mism=0
for r in range(n):
    for c in range(n):
        px=tmp.getpixel((c*10+5,r*10+5)); bit=1 if px<128 else 0
        if bit!=(1 if M[r][c] else 0): mism+=1
print(f"[{'OK' if mism==0 else 'FALHA'}] QR round-trip: {n*n-mism}/{n*n} módulos coincidem · codifica {QURL} · (scan físico = HUMAN GATE)")
ok&=(mism==0)
# 6 SVG não achatado
import glob
for sp in sorted(glob.glob(f"{OUTF}/06_*.svg")):
    txt=open(sp).read(); groups=len(re.findall(r'<g id=',txt)); texts=txt.count('<text'); imgs=txt.count('<image'); qrrects=len(re.findall(r'data-qr',txt))
    flat = imgs<=1 and texts==0
    print(f"[{'OK' if (groups>=5 and texts>=3 and not flat) else 'FALHA'}] {os.path.basename(sp)}: {groups} grupos · {texts} <text> · {imgs} <image> · QR vetorial={'sim' if qrrects else 'não'}")
    ok&=(groups>=5 and texts>=3)
print("\nQA GLOBAL:", "PASS" if ok else "FALHA")

# ======= PRANCHA FINAL =======
names=["06_A6_frente","06_A4","06_A3","06_1080x1350","06_1080x1920"]
ims=[Image.open(f"{OUTF}/{x}.png") for x in names]
hh=1000; sc=[im.resize((round(im.size[0]*hh/im.size[1]),hh)) for im in ims]
pad=30; Wc=sum(i.size[0] for i in sc)+pad*(len(sc)+1); Hc=hh+2*pad+40
sheet=Image.new("RGB",(Wc,Hc),(238,232,222)); d=ImageDraw.Draw(sheet); x=pad
for nm,im in zip(names,sc):
    sheet.paste(im,(x,pad)); d.text((x,pad+hh+10),nm,fill=(60,54,48),font=font("u",22)); x+=im.size[0]+pad
sheet.save(f"{OUTF}/_PRANCHA_FINAL.png")
print("\nPRANCHA:",f"{OUTF}/_PRANCHA_FINAL.png")
print("\n==== INVENTÁRIO ====")
for fn in sorted(os.listdir(OUTF)):
    p=os.path.join(OUTF,fn); print(f"  {os.path.getsize(p):>9} bytes  {fn}")
