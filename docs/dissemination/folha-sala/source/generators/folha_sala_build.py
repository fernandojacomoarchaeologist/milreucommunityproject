#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar RIGHTS.md.
"""Item 10 — Folha de Sala / Guia Breve. 1ª PROVA (PNG RGB).
A4 frente/verso (210×297 mm), PT-PT, não dobrado. DS: Fraunces/Spectral/Archivo.
SEM fotografia (1ª prova). Títulos Q1–Q12 = sequência de referência (HUMAN = fonte de verdade).
NÃO altera o Item 1. NÃO gera PRINT/CMYK. Parar em HUMAN GATE."""
import os,sys
HERE=os.path.dirname(os.path.abspath(__file__))
def _repo(p):
    p=os.path.abspath(p)
    while p!='/' and not os.path.exists(os.path.join(p,'CLAUDE.md')): p=os.path.dirname(p)
    return p
REPO=_repo(HERE)
sys.path.insert(0,os.path.join(REPO,"docs","dissemination","dossie-convite","final","qrpylibs"))
from PIL import Image, ImageDraw, ImageFont
import numpy as _np
OUT=os.path.join(REPO,"docs","dissemination","folha-sala","proof"); os.makedirs(OUT,exist_ok=True)
QR_PNG=os.path.join(REPO,"docs","dissemination","dossie-convite","final","editaveis","QR_projectomilreu.png")  # QR canónico validado
QURL="https://projectomilreu.pt"
LOGODIR=os.path.join(REPO,"public","media","exhibition","updated","logos")
LOGOS=["logo-projeto-comunitario-milreu.png","logo-ccdr-algarve.png","logo-associacao-amigos-museu-lyceu-faro.png","Milreu_policromatico.png","logo-ualg-completo.png"]
# DS
MARF=(255,252,247); CAMPO=(251,246,238); INK=(30,26,23); INK7=(69,61,54); INK5=(118,109,100); INK3=(181,170,155)
RED=(168,50,39); KEY=(176,164,145); HAIR=(230,220,201)
FP=os.path.expanduser("~/Library/Fonts/")
FF={"d":"Fraunces.ttf","di":"Fraunces-Italic.ttf","s":"Spectral-Regular.ttf","sm":"Spectral-Medium.ttf","si":"Spectral-Italic.ttf","u":"Archivo.ttf"}
_fc={}
def font(k,px,wt=None):
    kk=(k,px,wt)
    if kk in _fc: return _fc[kk]
    f=ImageFont.truetype(FP+FF[k],px)
    if wt and k=="d":
        try: f.set_variation_by_name({600:"SemiBold",700:"Bold"}.get(wt,"SemiBold"))
        except Exception: pass
    _fc[kk]=f; return f
DPI=int(os.environ.get("ITEM10_DPI","200")); mm=DPI/25.4
def P(v): return round(v*mm)
def PT(v): return round(v*DPI/72)
# ---- backend SVG vetorial + hyperlinks (aditivo; não altera o PIL/design) ----
import io as _io, base64 as _b64, json as _json
FAM={"d":"Fraunces","di":"Fraunces","s":"Spectral","sm":"Spectral","si":"Spectral","u":"Archivo"}
FALLBACK={"d":"serif","di":"serif","s":"serif","sm":"serif","si":"serif","u":"sans-serif"}
def _c(col): return "rgb(%d,%d,%d)"%(col[0],col[1],col[2])
def _esc(t): return t.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")
def _b64img(im,fmt="PNG"):
    bb=_io.BytesIO()
    if fmt=="JPEG": im.convert("RGB").save(bb,"JPEG",quality=86)
    else: im.save(bb,"PNG")
    return "data:image/%s;base64,"%("jpeg" if fmt=="JPEG" else "png")+_b64.b64encode(bb.getvalue()).decode()
LINKS={}  # page -> [(x0,y0,x1,y1,target)] em px (trim A4)
def link(page,x0,y0,x1,y1,target): LINKS.setdefault(page,[]).append((round(x0),round(y0),round(x1),round(y1),target))
class F:
    def __init__(s,W,H,bg=MARF): s.W=W;s.H=H;s.bg=bg;s.im=Image.new("RGB",(W,H),bg);s.d=ImageDraw.Draw(s.im);s.svg=[]
    def rect(s,x,y,w,h,fill,outline=None,ow=1):
        s.d.rectangle([x,y,x+w,y+h],fill=fill,outline=outline,width=ow)
        at=f'<rect x="{x:.2f}" y="{y:.2f}" width="{w:.2f}" height="{h:.2f}" '+(f'fill="{_c(fill)}"' if fill else 'fill="none"')
        if outline: at+=f' stroke="{_c(outline)}" stroke-width="{ow}"'
        s.svg.append(at+'/>')
    def line(s,x1,y1,x2,y2,fill,w=1):
        s.d.line([(x1,y1),(x2,y2)],fill=fill,width=w)
        s.svg.append(f'<line x1="{x1:.2f}" y1="{y1:.2f}" x2="{x2:.2f}" y2="{y2:.2f}" stroke="{_c(fill)}" stroke-width="{w}"/>')
    def tw(s,t,k,px,wt=None): return s.d.textlength(t,font=font(k,px,wt))
    def text(s,x,y,t,k,px,fill=INK,a="l",wt=None,ls=0):
        ft=font(k,px,wt)
        if ls and len(t)>1 and a=="l":
            cx=x
            for ch in t: s.d.text((cx,y),ch,font=ft,fill=fill,anchor="la");cx+=s.d.textlength(ch,font=ft)+ls
        else: s.d.text((x,y),t,font=ft,fill=fill,anchor={"l":"la","m":"ma","r":"ra"}[a])
        asc=ft.getmetrics()[0]; by=y+asc; anch={"l":"start","m":"middle","r":"end"}[a]
        style=' font-style="italic"' if k in("di","si") else ''
        wgt=wt if wt else (500 if k=="sm" else None); wstr=f' font-weight="{wgt}"' if wgt else ''
        lsstr=f' letter-spacing="{ls:.2f}"' if ls else ''
        s.svg.append(f'<text x="{x:.2f}" y="{by:.2f}" font-family="{FAM[k]},{FALLBACK[k]}" font-size="{px}" fill="{_c(fill)}" text-anchor="{anch}"{style}{wstr}{lsstr}>{_esc(t)}</text>')
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
    def para(s,x,y,t,k,px,maxw,fill=INK7,lh=1.45,a="l",wt=None):
        for ln in s.wrap(t,k,px,maxw,wt):
            xx=x if a=="l" else (x+maxw/2 if a=="m" else x+maxw)
            s.text(xx,y,ln,k,px,fill,a,wt); y+=round(px*lh)
        return y
    def token_rect(s,x,y,t,k,px,maxw,lh,token,wt=None):  # rect de um token dentro de um parágrafo (links)
        yy=y
        for ln in s.wrap(t,k,px,maxw,wt):
            if token in ln:
                pre=ln[:ln.index(token)]; tx0=x+s.tw(pre,k,px,wt); tx1=tx0+s.tw(token,k,px,wt)
                return (tx0,yy-px*0.1,tx1,yy+px*1.05)
            yy+=round(px*lh)
        return None
    def fit(s,x,y,t,k,maxpx,maxw,fill=INK,a="l",wt=None):
        px=maxpx
        while s.tw(t,k,px,wt)>maxw and px>8: px-=1
        s.text(x,y,t,k,px,fill,a,wt);return px
    def img_contain(s,x,y,bw,bh,path):  # QR: contain + quiet zone já embutida no bloco
        im=Image.open(path).convert("RGB");iw,ih=im.size;k=min(bw/iw,bh/ih)
        nw,nh=max(1,round(iw*k)),max(1,round(ih*k));im=im.resize((nw,nh),Image.NEAREST)
        px_=round(x+(bw-nw)/2); py_=round(y+(bh-nh)/2); s.im.paste(im,(px_,py_))
        s.svg.append(f'<image x="{px_}" y="{py_}" width="{nw}" height="{nh}" preserveAspectRatio="none" xlink:href="{_b64img(im)}"/>')
    def logoband(s,x,y,h):
        gap=0.6*h; cx=float(x)
        for fn in LOGOS:
            p=os.path.join(LOGODIR,fn)
            if not os.path.exists(p): continue
            im=Image.open(p).convert("RGBA");a=_np.asarray(im);al=a[:,:,3]
            mask=(al>16) if al.min()<250 else (a[:,:,:3].sum(2)<735)
            ys,xs=_np.where(mask)
            if len(xs): im=im.crop((int(xs.min()),int(ys.min()),int(xs.max())+1,int(ys.max())+1))
            w=h*im.size[0]/im.size[1]; rim=im.resize((max(1,round(w)),max(1,round(h))),Image.LANCZOS)
            s.im.paste(rim,(round(cx),round(y)),rim)
            s.svg.append(f'<image x="{cx:.2f}" y="{y:.2f}" width="{w:.2f}" height="{h:.2f}" xlink:href="{_b64img(rim)}"/>')
            cx+=w+gap
        return cx-gap-x
    def save(s,name):
        s.im.save(f"{OUT}/{name}.png")
        bg=f'<rect x="0" y="0" width="{s.W}" height="{s.H}" fill="{_c(s.bg)}"/>'
        svg=(f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
             f'width="210mm" height="297mm" viewBox="0 0 {s.W} {s.H}">{bg}{"".join(s.svg)}</svg>')
        os.makedirs(f"{OUT}/svg",exist_ok=True); open(f"{OUT}/svg/{name}.svg","w",encoding="utf-8").write(svg)
        return s.im

W,H=P(210),P(297); MX=P(18); CW=W-2*MX
def eyebrow(f,x,y,t,fill=RED,px=None,ls=None): f.text(x,y,t,"u",px or PT(8.5),fill,"l",wt=600,ls=ls if ls is not None else PT(1.1))

PANELS=[
 ("01","Entre Ruínas e Memórias"),("02","As escavações em Milreu"),
 ("03","A Festa da Pinha"),("04","Os jornalistas ingleses"),
 ("05","Memórias de juventude"),("06","Achados romanos de Milreu"),
 ("07","Theodor Hauschild e a equipa"),("08","A equipa de Milreu"),
 ("09","Trabalhar nas ruínas"),("10","Junto ao edifício de cultos"),
 ("11","A participação local"),("12","Mensagens para o futuro"),
]

def frente():
    f=F(W,H); x=MX; y=P(20)
    eyebrow(f,x,y,"MUSEU · PROJECTO COMUNITÁRIO DE MILREU"); y+=P(5.2)
    # 2.ª linha institucional (secundária): Projecto permanente → enquadramento 2026 → exposição
    f.text(x,y,"MUSEUS SEM FRONTEIRAS · INICIATIVAS 2026","u",PT(7.2),INK5,"l",wt=600,ls=PT(0.85)); y+=P(11)
    ttl="Entre Ruínas e Memórias"; tfs=PT(34)
    while f.tw(ttl,"d",tfs,600)>CW and tfs>8: tfs-=1
    f.text(x,y,ttl,"d",tfs,INK,"l",wt=600); y+=round(tfs*1.10)+P(5)
    y=f.para(x,y,"Museu itinerante sobre as relações entre a população e as Ruínas Romanas de Milreu","si",PT(12.5),CW*0.86,INK5,1.32)+P(7)
    y=f.para(x,y,"«Entre Ruínas e Memórias» reúne fotografias, testemunhos e outros registos ligados às relações entre a população e as Ruínas Romanas de Milreu. Mais do que contar apenas a história arqueológica do sítio, a exposição procura tornar visíveis as memórias, experiências e relações construídas com Milreu ao longo do tempo.","s",PT(11.3),CW,INK7,1.54)+P(4)
    y=f.para(x,y,"Os 12 painéis percorrem diferentes momentos dessa relação — das primeiras escavações às memórias das equipas, das festas e vivências locais às mensagens deixadas para o futuro.","s",PT(11.3),CW,INK7,1.54)+P(11)
    f.line(x,y,x+CW,y,HAIR,1); y+=P(7)
    eyebrow(f,x,y,"COMO PERCORRER"); y+=P(8)
    y=f.para(x,y,"Pode seguir a sequência 1–12 ou aproximar-se dos painéis a partir das imagens e temas que mais lhe despertarem curiosidade. A exposição foi concebida como um percurso aberto entre arqueologia, memória e comunidade.","s",PT(11.3),CW,INK7,1.54)+P(11)
    f.line(x,y,x+CW,y,HAIR,1); y+=P(7)
    eyebrow(f,x,y,"OS 12 PAINÉIS"); y+=P(10)
    # duas colunas × 6 — entrelinha/separação aumentadas (usa o espaço disponível)
    colw=(CW-P(10))/2; col2=x+colw+P(10); rowh=P(14.8); numw=P(10.5)
    for i,(num,tit) in enumerate(PANELS):
        cx=x if i<6 else col2; ry=y+(i%6)*rowh
        f.text(cx,ry+P(0.4),num,"u",PT(12.5),RED,"l",wt=700)
        f.text(cx+numw,ry,"·","sm",PT(12),INK3,"l")
        f.fit(cx+numw+P(3.4),ry,tit,"sm",PT(12.3),colw-numw-P(4),INK,"l")
        f.line(cx,ry+rowh-P(4.0),cx+colw,ry+rowh-P(4.0),HAIR,1)
    y+=6*rowh+P(2)
    # nota de pé (orientação)
    f.text(x,H-P(14),"projectomilreu.pt","sm",PT(9),RED,"l",wt=500)
    link("folha_frente",x,H-P(14),x+f.tw("projectomilreu.pt","sm",PT(9),500),H-P(14)+PT(9),QURL)
    f.text(x+CW,H-P(14),"Guia breve · Folha de sala","u",PT(7.5),INK5,"r")
    f.save("folha_frente")
    return f

def verso():
    f=F(W,H); x=MX; y=P(20)
    eyebrow(f,x,y,"O PROJECTO COMUNITÁRIO DE MILREU"); y+=P(9)
    y=f.para(x,y,"O Projecto Comunitário de Milreu é uma investigação em Arqueologia Pública e Comunitária desenvolvida no âmbito do doutoramento em Arqueologia da Universidade do Algarve. O projecto procura aproximar património, investigação e comunidade, tornando a escuta, a memória e a participação parte do processo de conhecer e interpretar Milreu.","s",PT(11.3),CW,INK7,1.54)+P(14)
    eyebrow(f,x,y,"COMO FOI CONSTRUÍDO"); y+=P(9)
    y=f.para(x,y,"A investigação combina métodos quantitativos e qualitativos — inquéritos, entrevistas e auscultação comunitária — com recolha documental, curadoria participativa e desenvolvimento iterativo das iniciativas. Fotografias, testemunhos e contributos locais são tratados não apenas como ilustração, mas como fontes para compreender as relações entre pessoas, território e património.","s",PT(11.3),CW,INK7,1.54)+P(16)
    # CONTINUE A VISITA — bloco visual com QR independente (quiet zone)
    f.line(x,y,x+CW,y,HAIR,1); y+=P(8)
    qs=P(34); qx=x+CW-qs; qpad=P(3.4)
    f.rect(qx-qpad,y-qpad,qs+2*qpad,qs+2*qpad,MARF,outline=KEY,ow=1)  # moldura leve = quiet zone
    f.img_contain(qx,y,qs,qs,QR_PNG)
    link("folha_verso",qx,y,qx+qs,y+qs,QURL)  # QR → URL canónico
    tw=CW-qs-P(12)
    eyebrow(f,x,y,"CONTINUE A VISITA"); yy=y+P(9.5)
    yy=f.para(x,yy,"No site pode explorar o museu, conhecer o projecto, acompanhar a circulação da exposição e consultar novos conteúdos.","s",PT(11.3),tw,INK7,1.54)+P(4)
    f.text(x,yy,"projectomilreu.pt","sm",PT(12.5),RED,"l",wt=500)
    link("folha_verso",x,yy,x+f.tw("projectomilreu.pt","sm",PT(12.5),500),yy+PT(12.5),QURL)
    cont_bottom=max(yy+P(10), y+qs+qpad+P(2))
    # ---- rodapé institucional (ancorado à base) ----
    logo_h=P(7.5); sb=H-P(15); logo_y=sb-logo_h
    sub_y=logo_y-P(5.0); idf_y=sub_y-P(6.4); sig_y=idf_y-P(5.8); rule_y=sig_y-P(6.0)
    # ---- MSF + créditos/direitos: posicionado mais abaixo, perto do rodapé (sem fundir) ----
    msf_y=max(cont_bottom+P(24), rule_y-P(60))
    f.line(x,msf_y-P(7),x+CW,msf_y-P(7),HAIR,1)
    eyebrow(f,x,msf_y,"MUSEUS SEM FRONTEIRAS · INICIATIVAS 2026",INK5,PT(8)); yb=msf_y+P(7)
    yb=f.para(x,yb,"«Entre Ruínas e Memórias» e o Circuito Educativo integram as iniciativas de 2026 apoiadas no âmbito de «Projecto Comunitário de Milreu / Museus sem Fronteiras».","si",PT(9.5),CW,INK5,1.42)+P(6.5)
    eyebrow(f,x,yb,"CRÉDITOS E PARCERIAS",INK5,PT(8)); yb+=P(6.6)
    yb=f.para(x,yb,"Associação dos Amigos do Museu do Lyceu de Faro — AAMLF: parceiro institucional e de acompanhamento.","s",PT(9.5),CW,INK7,1.42)+P(2.5)
    _dir="Conteúdos originais do Projecto Comunitário de Milreu: CC BY 4.0 quando indicado. Fotografias, documentos, logótipos e outros conteúdos de terceiros mantêm os respectivos créditos, autorizações e condições de utilização. Direitos e créditos: projectomilreu.pt"
    f.para(x,yb,_dir,"s",PT(9),CW,INK5,1.42)
    _r=f.token_rect(x,yb,_dir,"s",PT(9),CW,1.42,"projectomilreu.pt")
    if _r: link("folha_verso",_r[0],_r[1],_r[2],_r[3],QURL+"/#/direitos")  # link de direitos → página #/direitos
    # footer
    f.line(x,rule_y,x+CW,rule_y,HAIR,1)
    f.text(x,sig_y,"Projecto Comunitário de Milreu","s",PT(9.5),INK5,"l")
    f.text(x,idf_y,"MUSEUS SEM FRONTEIRAS · INICIATIVAS 2026","u",PT(6.8),INK5,"l",ls=PT(0.7))
    f.text(x,sub_y,"Apoio institucional e parcerias","sm",PT(6),INK5,"l",wt=500,ls=PT(0.5))
    f.logoband(x,logo_y,logo_h)
    f.save("folha_verso")
    return f

ff=frente(); fv=verso()
# prancha F|V
pad=P(8); gap=P(10)
sheet=Image.new("RGB",(pad*2+gap+W*2, pad*2+H+P(10)),(238,232,222))
dd=ImageDraw.Draw(sheet)
sheet.paste(ff.im,(pad,pad)); sheet.paste(fv.im,(pad+W+gap,pad))
dd.text((pad,pad+H+P(2)),"FRENTE",fill=(60,54,48),font=font("u",PT(9),600))
dd.text((pad+W+gap,pad+H+P(2)),"VERSO",fill=(60,54,48),font=font("u",PT(9),600))
sheet.save(f"{OUT}/_PRANCHA_folha.png")
# crops de QA
ff.im.crop((MX-P(2),P(136),W-MX+P(2),P(248))).save(f"{OUT}/crop_indice_Q1-Q12.png")  # índice
fv.im.crop((0,H-P(135),W,H)).save(f"{OUT}/crop_site_qr_rodape.png")
_json.dump({"dpi":DPI,"page_px":[W,H],"trim_mm":[210,297],"links":LINKS},
           open(f"{OUT}/_links.json","w"),ensure_ascii=False,indent=1)
print("OK folha_frente, folha_verso, _PRANCHA_folha, crops, SVG, _links | A4",W,"x",H,"@",DPI,"dpi | links:",{k:len(v) for k,v in LINKS.items()})
