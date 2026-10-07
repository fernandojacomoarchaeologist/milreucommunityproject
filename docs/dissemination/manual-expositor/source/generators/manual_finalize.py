#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar RIGHTS.md.
"""Item 11 — finalização da PROVA: PDF RGB A4 com índice clicável, bookmarks, hyperlinks e QR.
Lê proof/pages/*.png + _manual_meta.json. NÃO é arte-final (physical validation gate aberto)."""
import os,json
from PIL import Image
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
import pikepdf
HERE=os.path.dirname(os.path.abspath(__file__))
def _repo(p):
    p=os.path.abspath(p)
    while p!='/' and not os.path.exists(os.path.join(p,'CLAUDE.md')): p=os.path.dirname(p)
    return p
REPO=_repo(HERE)
BASE=os.path.join(REPO,"docs","dissemination","manual-expositor")
PROOF=os.path.join(BASE,"proof"); PG=os.path.join(PROOF,"pages")
meta=json.load(open(os.path.join(PROOF,"_manual_meta.json")))
DPI=meta["dpi"]; S=72.0/DPI; W,H=meta["page_px"]; PAGES=meta["pages"]; TOC=meta["toc"]; LINKS=meta["links"]
Hpt=297*mm; TWmm,THmm=210,297
OUT=os.path.join(PROOF,"MANUAL_DO_EXPOSITOR_Entre_Ruinas_e_Memorias_PROVA.pdf")

def build():
    from reportlab.lib.utils import ImageReader
    c=canvas.Canvas(OUT, pagesize=(TWmm*mm,THmm*mm)); c.setTitle("Manual do Expositor — Entre Ruínas e Memórias (prova)")
    tmp=[]
    for p in PAGES:
        im=Image.open(os.path.join(PG,p+".png")).convert("RGB")
        jp=os.path.join(PROOF,f".{p}.jpg"); im.save(jp,"JPEG",quality=88,dpi=(DPI,DPI)); tmp.append(jp)
        c.drawImage(ImageReader(jp),0,0,width=TWmm*mm,height=THmm*mm); c.showPage()
    c.save()
    for jp in tmp: os.remove(jp)
    pdf=pikepdf.open(OUT, allow_overwriting_input=True)
    # link annotations
    for pi_str,rects in LINKS.items():
        pi=int(pi_str); annots=pikepdf.Array()
        for r in rects:
            x0,y0,x1,y1,tgt=r
            rect=pikepdf.Array([x0*S, Hpt-y1*S, x1*S, Hpt-y0*S])
            if isinstance(tgt,list) and len(tgt)==2 and tgt[0]=="DEST":
                dest=pikepdf.Array([pdf.pages[int(tgt[1])].obj, pikepdf.Name("/Fit")])
                a=pikepdf.Dictionary(Type=pikepdf.Name("/Annot"),Subtype=pikepdf.Name("/Link"),Rect=rect,
                    Border=pikepdf.Array([0,0,0]),A=pikepdf.Dictionary(S=pikepdf.Name("/GoTo"),D=dest))
            else:
                a=pikepdf.Dictionary(Type=pikepdf.Name("/Annot"),Subtype=pikepdf.Name("/Link"),Rect=rect,
                    Border=pikepdf.Array([0,0,0]),A=pikepdf.Dictionary(S=pikepdf.Name("/URI"),URI=pikepdf.String(str(tgt))))
            annots.append(pdf.make_indirect(a))
        if len(annots):
            ex=pdf.pages[pi].get("/Annots")
            if ex is not None:
                for e in ex: annots.append(e)
            pdf.pages[pi].Annots=annots
    # bookmarks / outline
    with pdf.open_outline() as ol:
        def oi(title,pi):
            it=pikepdf.OutlineItem(title, pi); return it
        ol.root.append(oi("Capa",0)); ol.root.append(oi("Índice",1))
        for num,title,pi in TOC:
            ol.root.append(oi(f"{num} · {title}",pi))
        anx=pikepdf.OutlineItem("Anexos imprimíveis", 14)  # ~primeiro anexo
        # anexos: as páginas após as secções
        ANXMAP=[("A","Recepção"),("B","Montagem"),("C","Ocorrência/Dano"),("D","Desmontagem"),("E","Métricas"),("F","Avaliação (papel)"),("G","Fecho do local")]
        # mapear por nome de ficheiro
        name2pi={n:i for i,n in enumerate(PAGES)}
        anxfiles=["a01_anexo_recepcao","a02_anexo_montagem","a03_anexo_dano","a04_anexo_desmontagem","a05_anexo_metricas","a06_anexo_avaliacao","a07_anexo_fecho"]
        for (code,lbl),fn in zip(ANXMAP,anxfiles):
            if fn in name2pi: anx.children.append(oi(f"Anexo {code} · {lbl}", name2pi[fn]))
        ol.root.append(anx)
    pdf.save(OUT); pdf.close()
    return OUT

if __name__=="__main__":
    o=build(); print("PROVA PDF:",o, os.path.getsize(o)//1024,"KB |",len(PAGES),"páginas")
