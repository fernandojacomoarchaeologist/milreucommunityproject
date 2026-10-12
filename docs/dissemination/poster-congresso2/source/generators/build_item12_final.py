#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar RIGHTS.md.
# Item 12 — Poster de Congresso 2: adaptação editorial 2026 MÍNIMA (opção C aprovada).
# NÃO redesenha o corpo do poster aprovado: escala uniforme (proporção preservada) + rodapé 2026 discreto.
# Produz:
#   final/poster_congresso2_C.svg          -> corpo aprovado EMBEBIDO (raster) + rodapé em VETOR-TEXTO vivo + logos
#   final/poster_congresso2_C_preview.png  -> render de verificação (PIL), coords idênticas ao SVG
# O rodapé em vetor mantém o texto nítido a qualquer dimensão (resolve o "corte"/pixelização na versão grande).
# Corpo = resolução nativa do PSD aprovado (1200x1700); não há master de maior resolução (ver CONTENT_NOTES).
import os, io, base64, html
import numpy as np
from PIL import Image, ImageDraw, ImageFont

HERE=os.path.dirname(os.path.abspath(__file__))
def _repo_root(p):
    p=os.path.abspath(p)
    while p!="/" and not os.path.exists(os.path.join(p,"CLAUDE.md")): p=os.path.dirname(p)
    return p
REPO=_repo_root(HERE)
OUT=os.path.join(REPO,"docs","dissemination","poster-congresso2","final"); os.makedirs(OUT,exist_ok=True)
BODY=os.path.join(REPO,"docs","dissemination","poster-congresso2","source","poster_body.png")  # composto aprovado (PSD->PNG)
LOGODIR=os.path.join(REPO,"public","media","exhibition","updated","logos")
LOGOS=["logo-projeto-comunitario-milreu.png","logo-ccdr-algarve.png",
       "logo-associacao-amigos-museu-lyceu-faro.png","Milreu_policromatico.png","logo-ualg-completo.png"]
FP=os.path.expanduser("~/Library/Fonts/")

# --- geometria (coords partilhadas SVG + preview) ---
W,H=1200,1700
FOOTER_H=100
TOP=H-FOOTER_H                     # 1600
S=(H-FOOTER_H)/H                   # escala uniforme do corpo
CW=round(W*S); OX=(W-CW)//2        # corpo centrado (barras de papel finas nos lados)
MX=56
SEPY=TOP+16                        # separador fino
# cores (Design System)
PAPER="#F7F4EE"; INK="#1E1A17"; INK5="#766D64"; KEY="#B0A491"; HAIR="#D6CEBE"
PAPER_T=(247,244,238); INK_T=(30,26,23); INK5_T=(118,109,100); KEY_T=(176,164,145); HAIR_T=(214,206,190)
# rodapé — linha esquerda (assinatura) / direita (apoios)
SIG_Y=1650; SIG_PX=21            # "Projecto Comunitário de Milreu" (Archivo, INK)
MSF_Y=1674; MSF_PX=13; MSF_LS=1.1  # "MUSEUS SEM FRONTEIRAS · INICIATIVAS 2026" (Archivo, KEY)
EYE_Y=1638; EYE_PX=12; EYE_LS=0.8  # "APOIO INSTITUCIONAL E PARCERIAS" (Archivo, INK5)
LOGO_H=30; LOGO_TOP=1646; LOGO_GAPF=0.6; LOGO_RIGHT=W-MX  # barra alinhada à direita
# logótipo junto ao título (decisão humana 2026-10-12): sobreposto ao corpo legado na zona livre
# à esquerda do título (faixa cinzenta uniforme). Coords medidas no corpo nativo 1200x1700:
# título começa em x=316; linha de afiliação (y=215) começa em x=113 -> caixa livre x<305, y<210.
HDR_LOGO=os.path.join(REPO,"assets","brand","derived","light","logo-full-colour-transparent@2x.png")
HDR_BODY_TOP=20; HDR_BODY_H=175; HDR_BODY_CX=158   # em px do corpo nativo (antes da escala S)
SIG="Projecto Comunitário de Milreu"
MSF="MUSEUS SEM FRONTEIRAS · INICIATIVAS 2026"
EYE="APOIO INSTITUCIONAL E PARCERIAS"

def trim(im):
    a=np.asarray(im); al=a[:,:,3]
    mask=(al>16) if al.min()<250 else (a[:,:,:3].sum(2)<735)
    ys,xs=np.where(mask)
    return im.crop((int(xs.min()),int(ys.min()),int(xs.max())+1,int(ys.max())+1)) if len(xs) else im

def logo_list(h):
    out=[]
    for fn in LOGOS:
        im=trim(Image.open(os.path.join(LOGODIR,fn)).convert("RGBA"))
        w=max(1,round(im.size[0]*h/im.size[1]))
        out.append((fn,im,w,h))
    return out

def logo_layout():
    L=logo_list(LOGO_H); gap=round(LOGO_H*LOGO_GAPF)
    tot=sum(w for *_,w,_ in L)+gap*(len(L)-1)
    sx=LOGO_RIGHT-tot                 # alinhado à direita
    xs=[]; cx=sx
    for fn,im,w,h in L: xs.append((fn,im,round(cx),w,h)); cx+=w+gap
    return xs, sx, tot

def header_logo():
    im=trim(Image.open(HDR_LOGO).convert("RGBA"))   # sem alterar proporção/cores; só recorte de margem transparente
    h=HDR_BODY_H*S; w=im.size[0]*h/im.size[1]
    x=OX+HDR_BODY_CX*S-w/2; y=HDR_BODY_TOP*S
    return im, round(x,2), round(y,2), round(w,2), round(h,2)

def b64_png(im):
    b=io.BytesIO(); im.save(b,"PNG"); return base64.b64encode(b.getvalue()).decode()

# ---------------- SVG ----------------
def build_svg():
    body=Image.open(BODY).convert("RGB")
    bb=io.BytesIO(); body.save(bb,"JPEG",quality=92)  # corpo fotográfico -> JPEG q92 (nativo 1200x1700)
    body_b64=base64.b64encode(bb.getvalue()).decode()
    xs,_,_=logo_layout()
    esc=html.escape
    T=[f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
       f'width="{W}" height="{H}" viewBox="0 0 {W} {H}">']
    T.append(f'<rect x="0" y="0" width="{W}" height="{H}" fill="{PAPER}"/>')
    # corpo aprovado embebido (escala uniforme, centrado)
    T.append(f'<image x="{OX}" y="0" width="{CW}" height="{TOP}" '
             f'xlink:href="data:image/jpeg;base64,{body_b64}"/>')
    # logótipo junto ao título (resolução de origem @2x embebida, escala só no SVG)
    lim,lx,ly,lw,lh=header_logo()
    T.append(f'<image id="logo-titulo" x="{lx}" y="{ly}" width="{lw}" height="{lh}" '
             f'xlink:href="data:image/png;base64,{b64_png(lim)}"/>')
    # separador
    T.append(f'<line x1="{MX}" y1="{SEPY}" x2="{W-MX}" y2="{SEPY}" stroke="{HAIR}" stroke-width="2"/>')
    # assinatura (esq)
    T.append(f'<text x="{MX}" y="{SIG_Y}" font-family="Archivo, sans-serif" font-size="{SIG_PX}" '
             f'font-weight="600" fill="{INK}">{esc(SIG)}</text>')
    T.append(f'<text x="{MX}" y="{MSF_Y}" font-family="Archivo, sans-serif" font-size="{MSF_PX}" '
             f'letter-spacing="{MSF_LS}" fill="{KEY}">{esc(MSF)}</text>')
    # apoios (dir) — eyebrow alinhado ao início da barra de logos
    _,sx,_=logo_layout()
    T.append(f'<text x="{sx}" y="{EYE_Y}" font-family="Archivo, sans-serif" font-size="{EYE_PX}" '
             f'letter-spacing="{EYE_LS}" fill="{INK5}">{esc(EYE)}</text>')
    for fn,im,x,w,h in xs:
        T.append(f'<image x="{x}" y="{LOGO_TOP}" width="{w}" height="{h}" '
                 f'xlink:href="data:image/png;base64,{b64_png(im)}"/>')
    T.append('</svg>')
    svg="\n".join(T)
    p=os.path.join(OUT,"poster_congresso2_C.svg"); open(p,"w",encoding="utf-8").write(svg)
    return p, len(svg)

# ---------------- PREVIEW PNG (coords idênticas) ----------------
def F(px,wt=None):
    f=ImageFont.truetype(FP+"Archivo.ttf",px)
    return f
def build_preview(scale=2, name="poster_congresso2_C_preview.png"):
    cv=Image.new("RGB",(W*scale,H*scale),PAPER_T)
    body=Image.open(BODY).convert("RGB").resize((CW*scale,TOP*scale),Image.LANCZOS)
    cv.paste(body,(OX*scale,0))
    lim,lx,ly,lw,lh=header_logo()
    rl=lim.resize((round(lw*scale),round(lh*scale)),Image.LANCZOS)
    cv.paste(rl,(round(lx*scale),round(ly*scale)),rl)
    d=ImageDraw.Draw(cv)
    def sp(x,y,t,px,fill,ls=0):
        f=F(px*scale); cx=x*scale
        for ch in t:
            d.text((cx,y*scale),ch,font=f,fill=fill); cx+=d.textlength(ch,font=f)+ls*scale
    d.line([(MX*scale,SEPY*scale),((W-MX)*scale,SEPY*scale)],fill=HAIR_T,width=2*scale)
    # assinatura: baseline no SVG ~ y; no PIL 'la' top. Ajuste aproximado (-px) p/ alinhar visualmente.
    d.text((MX*scale,(SIG_Y-SIG_PX)*scale),SIG,font=F(SIG_PX*scale),fill=INK_T)
    sp(MX,MSF_Y-MSF_PX,MSF,MSF_PX,KEY_T,MSF_LS)
    _,sx,_=logo_layout()
    sp(sx,EYE_Y-EYE_PX,EYE,EYE_PX,INK5_T,EYE_LS)
    for fn,im,x,w,h in logo_layout()[0]:
        rim=im.resize((w*scale,h*scale),Image.LANCZOS)
        cv.paste(rim,(x*scale,LOGO_TOP*scale),rim)
    if name is None: return cv
    p=os.path.join(OUT,name)
    cv.save(p); return p, cv.size

# ---------------- FINAL DE IMPRESSÃO (raster, sem cairo/inkscape disponíveis) ----------------
# Render ×6 (7200x10200) -> rodapé e logótipo nítidos; o corpo legado continua limitado à resolução
# nativa 1200x1700 (sem master maior). Página à largura A0 (841 mm) na proporção do poster.
# NÃO é prepress: sem sangria, sem CMYK, sem fontes embebidas (FASE B pendente).
PRINT_SCALE=6; PRINT_W_MM=841
def build_print():
    d=os.path.join(OUT,"print"); os.makedirs(d,exist_ok=True)
    cv=build_preview(PRINT_SCALE,name=None)
    dpi=cv.size[0]/(PRINT_W_MM/25.4)
    png=os.path.join(d,"poster_congresso2_C_final.png"); cv.save(png,dpi=(dpi,dpi))
    pdf=os.path.join(d,"poster_congresso2_C_final.pdf"); cv.save(pdf,"PDF",resolution=dpi,quality=95)
    return png,pdf,cv.size,round(dpi,1)

# ---------------- VERSÃO COM SANGRIA (3 mm) ----------------
# Sangria só por extensão: papel (PAPER) à volta; no topo, a faixa cinzenta do corpo é prolongada
# replicando a linha 0 do corpo (limpa) — o corpo legado não é editado nem reposicionado.
# Escala física: largura de corte = PRINT_W_MM (A0) -> 1 unidade = PRINT_W_MM/W mm.
BLEED_MM=3
UNIT_MM=PRINT_W_MM/W
B=BLEED_MM/UNIT_MM                 # sangria em unidades do poster (~4.28)
def band_strip():
    body=Image.open(BODY).convert("RGB")
    return body.crop((0,0,body.size[0],1))   # linha 0 (sem texto) para prolongar a faixa

def build_svg_bleed():
    src=open(os.path.join(OUT,"poster_congresso2_C.svg"),encoding="utf-8").read()
    inner=src.split(">",1)[1].rsplit("</svg>",1)[0]
    b=round(B,3); tw=W+2*B; th=H+2*B
    st=band_strip(); sb=io.BytesIO(); st.save(sb,"PNG"); st64=base64.b64encode(sb.getvalue()).decode()
    T=[f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
       f'width="{tw*UNIT_MM:.2f}mm" height="{th*UNIT_MM:.2f}mm" viewBox="{-b} {-b} {round(tw,3)} {round(th,3)}">',
       f'<!-- Sangria {BLEED_MM} mm. Corte (trim) = rect#trim ({PRINT_W_MM} x {H*UNIT_MM:.1f} mm). -->',
       f'<rect x="{-b}" y="{-b}" width="{round(tw,3)}" height="{round(th,3)}" fill="{PAPER}"/>',
       f'<image id="sangria-faixa-topo" x="{OX}" y="{-b}" width="{CW}" height="{round(B+0.5,3)}" preserveAspectRatio="none" '
       f'xlink:href="data:image/png;base64,{st64}"/>',
       inner,
       f'<rect id="trim" x="0" y="0" width="{W}" height="{H}" fill="none" stroke="none"/>',
       '</svg>']
    p=os.path.join(OUT,"poster_congresso2_C_sangria3mm.svg"); open(p,"w",encoding="utf-8").write("\n".join(T))
    return p

def _write_pdf(path, jpeg, px_w, px_h, media, trim):
    # PDF mínimo: uma imagem DCT a ocupar a página; MediaBox=BleedBox=sangria, TrimBox=corte.
    mw,mh=media; tx,ty,tw,th=trim
    content=f"q {mw:.4f} 0 0 {mh:.4f} 0 0 cm /Im0 Do Q".encode()
    objs=[b"<< /Type /Catalog /Pages 2 0 R >>",
          b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
          (f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 {mw:.4f} {mh:.4f}] /BleedBox [0 0 {mw:.4f} {mh:.4f}] "
           f"/TrimBox [{tx:.4f} {ty:.4f} {tx+tw:.4f} {ty+th:.4f}] "
           f"/Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>").encode(),
          (f"<< /Type /XObject /Subtype /Image /Width {px_w} /Height {px_h} /ColorSpace /DeviceRGB "
           f"/BitsPerComponent 8 /Filter /DCTDecode /Length {len(jpeg)} >>\nstream\n").encode()+jpeg+b"\nendstream",
          f"<< /Length {len(content)} >>\nstream\n".encode()+content+b"\nendstream"]
    out=bytearray(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n"); offs=[]
    for i,o in enumerate(objs,1):
        offs.append(len(out)); out+=f"{i} 0 obj\n".encode()+o+b"\nendobj\n"
    x=len(out); out+=f"xref\n0 {len(objs)+1}\n0000000000 65535 f \n".encode()
    for o in offs: out+=f"{o:010d} 00000 n \n".encode()
    out+=f"trailer\n<< /Size {len(objs)+1} /Root 1 0 R >>\nstartxref\n{x}\n%%EOF\n".encode()
    open(path,"wb").write(out)

def build_print_bleed():
    d=os.path.join(OUT,"print"); os.makedirs(d,exist_ok=True)
    k=PRINT_SCALE; bp=round(B*k)                    # sangria em px do render
    cv=build_preview(k,name=None)
    full=Image.new("RGB",(cv.size[0]+2*bp,cv.size[1]+2*bp),PAPER_T)
    full.paste(cv,(bp,bp))
    strip=band_strip().resize((CW*k,bp+1),Image.NEAREST)  # prolonga a faixa cinzenta para cima
    full.paste(strip,(bp+OX*k,0))
    dpi=cv.size[0]/(PRINT_W_MM/25.4)
    png=os.path.join(d,"poster_congresso2_C_final_sangria3mm.png"); full.save(png,dpi=(dpi,dpi))
    jb=io.BytesIO(); full.save(jb,"JPEG",quality=95,dpi=(dpi,dpi))
    pt=72/dpi; mw,mh=full.size[0]*pt,full.size[1]*pt
    pdf=os.path.join(d,"poster_congresso2_C_final_sangria3mm.pdf")
    _write_pdf(pdf,jb.getvalue(),full.size[0],full.size[1],(mw,mh),(bp*pt,bp*pt,cv.size[0]*pt,cv.size[1]*pt))
    return png,pdf,full.size,(mw*25.4/72,mh*25.4/72)

if __name__=="__main__":
    sp_,n=build_svg(); print("SVG :",sp_, n//1024,"KB")
    pp,sz=build_preview(); print("PREV:",pp,sz)
    a,b,sz,dpi=build_print(); print("PRINT:",a,"|",b,sz,dpi,"dpi @ 841 mm")
    print("SVG+sangria:",build_svg_bleed())
    a,b,sz,mm=build_print_bleed(); print("PRINT+sangria:",a,"|",b,sz,"%.1f x %.1f mm"%mm)
