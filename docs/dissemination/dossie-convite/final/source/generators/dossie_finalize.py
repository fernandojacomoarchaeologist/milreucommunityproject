# -*- coding: utf-8 -*-
# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar RIGHTS.md.
# FONTE DE EDITORAÇÃO CANÓNICA (portada p/ caminhos relativos ao repositório).
import os as _os
def _repo_root(p):
    p=_os.path.abspath(p)
    while p!="/" and not _os.path.exists(_os.path.join(p,"CLAUDE.md")): p=_os.path.dirname(p)
    return p
_REPO=_repo_root(_os.path.dirname(__file__))
#!/usr/bin/env python3
# Item 7 — finalização/prepress: DIGITAL (RGB + hyperlinks + QR), PRINT (CMYK PDF/X-3 bleed+marcas),
# LIVRETO A4 (imposição 1 folha dobrada) + QR standalone. Design CONGELADO; só exportação.
import os, io, json, shutil
from PIL import Image, ImageCms, ImageDraw
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
import pikepdf, qrcode
import qrcode.image.svg as qrsvg

HERE=_os.path.join(_REPO,"docs","dissemination","dossie-convite","final","editaveis")  # lê previews/ gerados por dossie_generator.py
PREV=os.path.join(HERE,"previews")
OUT=_os.path.join(_REPO,"docs","dissemination","dossie-convite","final")
EDIT=os.path.join(OUT,"editaveis")
os.makedirs(OUT,exist_ok=True); os.makedirs(EDIT,exist_ok=True)
DPI=300; S=72.0/DPI  # px -> pt
ICC="/System/Library/ColorSync/Profiles/Generic CMYK Profile.icc"
PROFILE_NAME="Generic CMYK Profile (perfil padrão — confirmar/substituir pelo perfil ICC da gráfica)"
QURL="https://projectomilreu.pt"
meta=json.load(open(os.path.join(PREV,"_links.json")))
BLEED_MM=meta["bleed_mm"]; TW,TH=meta["trim_mm"]
bleed_px=round(BLEED_MM*DPI/25.4)
PAGES=["07_P1_capa","07_P2_projecto","07_P3_espaco","07_P4_convite"]
NAME="DOSSIE_Entre_Ruinas_e_Memorias"

def trim_img(p):
    im=Image.open(os.path.join(PREV,p+".png")).convert("RGB")
    W,H=im.size
    return im.crop((bleed_px,bleed_px,W-bleed_px,H-bleed_px))  # 148x210mm

# ---------- 1) DIGITAL (RGB, trim, hyperlinks) ----------
def build_digital():
    out=os.path.join(OUT,f"{NAME}_DIGITAL.pdf")
    c=canvas.Canvas(out, pagesize=(TW*mm,TH*mm)); c.setTitle("Entre Ruínas e Memórias — convite")
    tmp=[]
    for p in PAGES:
        im=trim_img(p); jp=os.path.join(OUT,f".{p}.jpg"); im.save(jp,"JPEG",quality=88,dpi=(DPI,DPI)); tmp.append(jp)
        from reportlab.lib.utils import ImageReader
        c.drawImage(ImageReader(jp),0,0,width=TW*mm,height=TH*mm)
        c.showPage()
    c.save()
    for jp in tmp: os.remove(jp)
    # anotações de link via pikepdf
    pdf=pikepdf.open(out, allow_overwriting_input=True)
    Hpt=TH*mm
    for i,p in enumerate(PAGES):
        rects=meta["links"].get(p,[])
        annots=pikepdf.Array()
        for (x0,y0,x1,y1,target) in rects:
            # full-bleed px -> trim px -> pt (y-flip)
            tx0=(x0-bleed_px)*S; tx1=(x1-bleed_px)*S
            ty_top=(y0-bleed_px)*S; ty_bot=(y1-bleed_px)*S
            rect=pikepdf.Array([tx0, Hpt-ty_bot, tx1, Hpt-ty_top])
            a=pikepdf.Dictionary(Type=pikepdf.Name("/Annot"),Subtype=pikepdf.Name("/Link"),
                Rect=rect,Border=pikepdf.Array([0,0,0]),
                A=pikepdf.Dictionary(S=pikepdf.Name("/URI"),URI=pikepdf.String(target)))
            annots.append(pdf.make_indirect(a))
        if len(annots): pdf.pages[i].Annots=annots
    pdf.save(out); pdf.close()
    return out

# ---------- 2) PRINT (CMYK PDF/X-3, full-bleed + marcas) ----------
def crop_marks(im):
    W,H=im.size; d=ImageDraw.Draw(im)
    g=round(3.0*DPI/25.4); gap=round(1.2*DPI/25.4); lw=max(2,round(0.2*DPI/25.4))
    for (x,y,sx,sy) in [(bleed_px,bleed_px,-1,-1),(W-bleed_px,bleed_px,1,-1),(bleed_px,H-bleed_px,-1,1),(W-bleed_px,H-bleed_px,1,1)]:
        d.line([(x,y+sy*gap),(x,y+sy*(gap+g))],fill=(0,0,0),width=lw)
        d.line([(x+sx*gap,y),(x+sx*(gap+g),y)],fill=(0,0,0),width=lw)
    return im

def build_print():
    out=os.path.join(OUT,f"{NAME}_PRINT.pdf")
    srgb=ImageCms.createProfile('sRGB'); tr=ImageCms.buildTransform(srgb,ICC,'RGB','CMYK',renderingIntent=ImageCms.Intent.RELATIVE_COLORIMETRIC)
    cw_mm=TW+2*BLEED_MM; ch_mm=TH+2*BLEED_MM
    from reportlab.lib.utils import ImageReader
    c=canvas.Canvas(out, pagesize=(cw_mm*mm,ch_mm*mm)); c.setTitle("Entre Ruínas e Memórias — convite (print)")
    tmp=[]
    for p in PAGES:
        im=Image.open(os.path.join(PREV,p+".png")).convert("RGB"); im=crop_marks(im)
        cmyk=ImageCms.applyTransform(im,tr); jp=os.path.join(OUT,f".{p}_cmyk.jpg"); cmyk.save(jp,"JPEG",quality=92,dpi=(DPI,DPI)); tmp.append(jp)
        c.drawImage(ImageReader(jp),0,0,width=cw_mm*mm,height=ch_mm*mm); c.showPage()
    c.save()
    for jp in tmp: os.remove(jp)
    pdf=pikepdf.open(out, allow_overwriting_input=True)
    PT=lambda v: v*72/25.4
    media=[0,0,PT(cw_mm),PT(ch_mm)]; trimbox=[PT(BLEED_MM),PT(BLEED_MM),PT(BLEED_MM+TW),PT(BLEED_MM+TH)]
    for pg in pdf.pages:
        pg.MediaBox=media; pg.BleedBox=media; pg.TrimBox=trimbox; pg.ArtBox=trimbox
        r=pg.get('/Resources',{});  _=r.get('/Font') and r.__delitem__('/Font')
    st=pikepdf.Stream(pdf, open(ICC,'rb').read()); st.N=4
    oi=pdf.make_indirect(pikepdf.Dictionary(Type=pikepdf.Name("/OutputIntent"),S=pikepdf.Name("/GTS_PDFX"),
        OutputConditionIdentifier=pikepdf.String("Generic CMYK"),Info=pikepdf.String(PROFILE_NAME),DestOutputProfile=pdf.make_indirect(st)))
    pdf.Root.OutputIntents=pikepdf.Array([oi])
    pdf.docinfo[pikepdf.Name("/GTS_PDFXVersion")]=pikepdf.String("PDF/X-3:2002")
    pdf.docinfo[pikepdf.Name("/Trapped")]=pikepdf.Name("/False")
    pdf.save(out); pdf.close()
    return out

# ---------- 3) LIVRETO A4 (imposição: 1 folha A4 landscape, dobrada ao meio) ----------
def build_livreto():
    out=os.path.join(OUT,f"{NAME}_LIVRETO_A4.pdf")
    from reportlab.lib.utils import ImageReader
    A4w,A4h=297.0,210.0
    c=canvas.Canvas(out, pagesize=(A4w*mm,A4h*mm)); c.setTitle("Entre Ruínas e Memórias — livreto A4")
    tr={p:trim_img(p) for p in PAGES}
    tmp=[]
    def place(img,xmm):
        jp=os.path.join(OUT,f".l_{id(img)}.jpg"); img.save(jp,"JPEG",quality=88); tmp.append(jp)
        c.drawImage(ImageReader(jp),xmm*mm,0,width=(A4w/2)*mm,height=A4h*mm)
    # Folha 1 (frente): P4 (esq) | P1 (dir)  -> dobrada: capa=P1, contracapa=P4
    place(tr["07_P4_convite"],0); place(tr["07_P1_capa"],A4w/2); c.showPage()
    # Folha 2 (verso): P2 (esq) | P3 (dir)
    place(tr["07_P2_projecto"],0); place(tr["07_P3_espaco"],A4w/2); c.showPage()
    c.save()
    for jp in tmp: os.remove(jp)
    return out

# ---------- QR standalone ----------
def build_qr():
    q=qrcode.make(QURL); q.save(os.path.join(EDIT,"QR_projectomilreu.png"))
    img=qrcode.make(QURL, image_factory=qrsvg.SvgPathImage); img.save(os.path.join(EDIT,"QR_projectomilreu.svg"))

# ---------- editáveis: source + imagens usadas ----------
def collect_editaveis():
    shutil.copy(os.path.join(HERE,"dossie_generator.py"), os.path.join(EDIT,"dossie_generator.py"))
    imgdir=os.path.join(EDIT,"imagens"); os.makedirs(imgdir,exist_ok=True)
    GEN=_os.path.join(_REPO,"public","media","museum","generated")
    srcs=[GEN+"/MM202602/detail.webp", os.path.join(HERE,"assets_crop","MM202604_crop.png"),
          GEN+"/MM202613/detail.webp",
          os.path.join(HERE,"..","item5_build","assets","MM202608.png"),
          os.path.join(HERE,"..","item5_build","assets","MM202601-original.jpg")]
    for src in srcs:
        if os.path.exists(src):
            dst=os.path.join(imgdir, os.path.basename(src))
            if "MM202602" in src: dst=os.path.join(imgdir,"MM202602_detail.webp")
            if "MM202613" in src: dst=os.path.join(imgdir,"MM202613_detail.webp")
            shutil.copy(src,dst)

if __name__=="__main__":
    d=build_digital(); print("DIGITAL:",d, os.path.getsize(d)//1024,"KB")
    pr=build_print(); print("PRINT  :",pr, os.path.getsize(pr)//1024,"KB")
    lv=build_livreto(); print("LIVRETO:",lv, os.path.getsize(lv)//1024,"KB")
    build_qr(); collect_editaveis(); print("QR + editáveis OK")
