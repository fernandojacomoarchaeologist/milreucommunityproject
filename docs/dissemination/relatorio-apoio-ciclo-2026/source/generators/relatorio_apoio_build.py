#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar RIGHTS.md.
"""Item 16 — Relatório de Apoio Institucional e Evidências dos Trabalhos (Ciclo 2026).

Relatório funcional para envio: enquadramento, papel da AAMLF (entidade beneficiária e
mediadora), EXECUÇÕES EM ANDAMENTO, trabalhos realizados, REGISTO FOTOGRÁFICO das atividades,
apoio institucional local e contactos. Junta, como anexos, as cartas de apoio.

PRIVADO: contém fotografias de participantes e cartas com assinaturas → sai só para `_private/`
e para o cofre externo; NÃO vai para o Git público. O gerador é reprodutível (fica no repo),
mas lê imagens/anexos de caminhos privados (não versionados).

Uso: ANEXOS_DIR=.../CCDR/apoios FOTOS_DIR=.../imagem-eventos PYTHONPATH=<deps> python3 relatorio_apoio_build.py
"""
import os, io
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader
from PIL import Image, ImageOps, ImageEnhance
import pikepdf

def _repo(p):
    p=os.path.abspath(p)
    while p!="/" and not os.path.exists(os.path.join(p,"CLAUDE.md")): p=os.path.dirname(p)
    return p
HERE=os.path.dirname(os.path.abspath(__file__)); REPO=_repo(HERE)
BASE=os.path.join(REPO,"docs","dissemination","relatorio-apoio-ciclo-2026")
PRIV=os.path.join(BASE,"_private"); os.makedirs(PRIV,exist_ok=True)
LOGO=os.path.join(REPO,"public","media","exhibition","updated","logos","logo-projeto-comunitario-milreu.png")
ANEXOS_DIR=os.environ.get("ANEXOS_DIR","/Users/fernandojacomo/Desktop/Milreudocs/CCDR/apoios")
FOTOS_DIR=os.environ.get("FOTOS_DIR",os.path.join(REPO,"docs","relatorio-execucao-ccdr-2026","_private","imagem-eventos"))
AX1=os.path.join(ANEXOS_DIR,"20260417114600586.pdf")
AX2=os.path.join(ANEXOS_DIR,"0050AA4B8FBA260414151027.pdf")
# A digitalização da carta da Câmara de Faro (AX2) está quase em branco (corpo não captado).
# Fica DESLIGADA por omissão; activar com INCLUDE_AX2=1 quando houver um scan legível.
INCLUDE_AX2=os.environ.get("INCLUDE_AX2","0")=="1"

FP=os.path.expanduser("~/Library/Fonts/")
for n,f in [("FR","Fraunces.ttf"),("SP","Spectral-Regular.ttf"),("SPm","Spectral-Medium.ttf"),("AR","Archivo.ttf"),("SPi","Spectral-Italic.ttf")]:
    try: pdfmetrics.registerFont(TTFont(n,FP+f))
    except Exception: pass

INK=(0.118,0.102,0.090); INK7=(0.27,0.24,0.21); INK5=(0.46,0.43,0.39)
RED=(0.659,0.196,0.153); MARF=(1,0.988,0.969); STONE=(0.84,0.81,0.75)
W,H=A4; MX=24*mm; CW=W-2*MX

FOTOS=[  # (ficheiro, legenda, rotação_extra, âncora_horizontal 0=esq..1=dir)
 ("evid_EVID-006_apresentacao_07fev2026.jpg","Apresentação pública do projecto à comunidade — 7 de Fevereiro de 2026",0,0.5),
 ("evid_EVID-008_visita_guiada_07fev2026.jpg","Visita guiada às Ruínas Romanas de Milreu — 7 de Fevereiro de 2026",0,0.10),
 ("evid_EVID-010_roda_conversas_11abr2026.jpg","Roda de conversas e recolha de memórias com a comunidade — 11 de Abril de 2026",0,0.5),
 ("evid_EVID-013_exposicao_vista_geral_10out2026.jpg","Exposição «Entre Ruínas e Memórias» — montagem e vista geral, 10 de Outubro de 2026",180,0.5),
 ("evid_EVID-014_exposicao_paineis_10out2026.jpg","Painéis da exposição itinerante — 10 de Outubro de 2026",180,0.5),
 ("evid_EVID-016_folha_sala_convite_mesa_10out2026.jpg","Folha de sala e convite ao inquérito em contexto de exposição — 10 de Outubro de 2026",180,0.5),
]

def _wrap(c,t,font,size,maxw):
    out=[]
    for para in t.split("\n"):
        line=""
        for w_ in para.split(" "):
            test=(line+" "+w_).strip()
            if pdfmetrics.stringWidth(test,font,size)<=maxw: line=test
            else: out.append(line); line=w_
        out.append(line)
    return out

def build_corpo(path):
    c=canvas.Canvas(path, pagesize=A4)
    def bg(): c.setFillColorRGB(*MARF); c.rect(0,0,W,H,fill=1,stroke=0)
    def block(y,t,font,size,color,lh=1.42,x=MX,maxw=CW):
        c.setFillColorRGB(*color)
        for ln in _wrap(c,t,font,size,maxw):
            c.setFont(font,size); c.drawString(x,y,ln); y-=size*lh
        return y
    def h2(y,t):
        c.setFont("AR",10.5); c.setFillColorRGB(*RED); c.drawString(MX,y,t.upper())
        c.setStrokeColorRGB(*STONE); c.setLineWidth(0.6); c.line(MX,y-5,MX+CW,y-5); return y-20
    def bullets(y,items,gap=4):
        for it in items:
            c.setFillColorRGB(*RED); c.circle(MX+2,y+3,1.4,fill=1,stroke=0)
            y=block(y,it,"SP",9.5,INK7,x=MX+10,maxw=CW-10); y-=gap
        return y
    def footer(nota="Anexo I (carta de apoio)"):
        c.setStrokeColorRGB(*STONE); c.setLineWidth(0.6); c.line(MX,18*mm,MX+CW,18*mm)
        c.setFont("AR",7.5); c.setFillColorRGB(*INK5)
        c.drawString(MX,13*mm,"© 2026 Fernando Rodrigues de Jácomo · Projecto Comunitário de Milreu · DOCUMENTO INTERNO")
        c.drawRightString(W-MX,13*mm,nota)

    # ---------- Página 1 ----------
    bg()
    try:
        lg=Image.open(LOGO).convert("RGBA"); base=Image.new("RGBA",lg.size,(255,252,247,255)); base.alpha_composite(lg)
        b=io.BytesIO(); base.convert("RGB").save(b,"PNG"); b.seek(0)
        lh=22*mm; lw=lh*lg.size[0]/lg.size[1]; c.drawImage(ImageReader(b),MX,H-MX-lh,width=lw,height=lh,mask='auto')
    except Exception: pass
    c.setFont("AR",8.5); c.setFillColorRGB(*INK5)
    for i,t in enumerate(["Arqueologia Pública e Comunitária","Ruínas Romanas de Milreu · Estói (Faro)","projectomilreu.pt"]):
        c.drawRightString(W-MX,H-MX-6-i*12,t)
    y=H-MX-30*mm
    c.setFont("FR",20); c.setFillColorRGB(*INK); c.drawString(MX,y,"Relatório de Apoio Institucional"); y-=24
    c.drawString(MX,y,"e Evidências dos Trabalhos"); y-=18
    c.setFont("AR",9); c.setFillColorRGB(*RED); c.drawString(MX,y,"CICLO 2026 · PROJECTO COMUNITÁRIO DE MILREU · MUSEUS SEM FRONTEIRAS"); y-=22
    fields=[("Projecto","Projecto Comunitário de Milreu — programa plurianual de Arqueologia Pública e Comunitária."),
            ("Coordenação / Responsável","Fernando Rodrigues de Jácomo (autor e coordenador; doutorando em Arqueologia, Universidade do Algarve) · a78190@ualg.pt"),
            ("Entidade beneficiária e mediadora","Associação dos Amigos do Museu do Lyceu de Faro (AAMLF) · museu.lyceu@aejdfaro.pt"),
            ("Apoio / data","CCDR Algarve, I.P. — Programa de Apoio a Iniciativas Culturais Regionais 2026 · Relatório de 2026-10-12")]
    pad=10; vx=MX+pad
    rows=[(lab,_wrap(c,val,"SP",9.5,CW-2*pad)) for lab,val in fields]
    total=pad+sum(11+len(ls)*12+5 for _,ls in rows)
    box_y=y-total
    c.setFillColorRGB(0.984,0.965,0.933); c.setStrokeColorRGB(*STONE); c.setLineWidth(0.6); c.rect(MX,box_y,CW,total,fill=1,stroke=1)
    ry=y-pad-8
    for lab,lines in rows:
        c.setFont("AR",7.5); c.setFillColorRGB(*RED); c.drawString(vx,ry,lab.upper()); ry-=12
        c.setFont("SP",9.5); c.setFillColorRGB(*INK7)
        for ln in lines: c.drawString(vx,ry,ln); ry-=12
        ry-=5
    y=box_y-20
    y=h2(y,"1. Enquadramento")
    y=block(y,"O Projecto Comunitário de Milreu é um programa plurianual de Arqueologia Pública e Comunitária associado às Ruínas Romanas de Milreu, em Estói (Faro). Aproxima património, investigação e comunidade e tem origem numa investigação de doutoramento em Arqueologia na Universidade do Algarve. No ciclo de 2026 — «Museus sem Fronteiras · Iniciativas 2026» — desenvolve duas iniciativas principais: o museu e exposição itinerante «Entre Ruínas e Memórias» e o Circuito Educativo de Milreu.","SP",9.5,INK7); y-=6
    y=block(y,"A candidatura ao Programa de Apoio a Iniciativas Culturais Regionais da CCDR Algarve, I.P. (Aviso 2026) foi apresentada pela Associação dos Amigos do Museu do Lyceu de Faro (AAMLF), com o acompanhamento de entidades locais cujas declarações de apoio se anexam.","SP",9.5,INK7); y-=10
    y=h2(y,"2. Papel da AAMLF — entidade beneficiária e mediadora")
    y=block(y,"A AAMLF assume o papel de entidade beneficiária e de mediadora institucional do ciclo 2026: formaliza a candidatura e a relação com a CCDR Algarve, acompanha a execução e articula com o Museu do Lyceu de Faro e com as entidades do território. A autoria científica, a conceção e a coordenação do projecto são do responsável, no âmbito da sua investigação de doutoramento na Universidade do Algarve. Esta mediação permite enquadrar institucionalmente um projecto de base comunitária, assegurando a boa gestão do apoio e a ligação à rede cultural local.","SP",9.5,INK7)

    # ---------- Página 2 ----------
    c.showPage(); bg(); y=H-MX
    y=h2(y,"3. Execuções em andamento")
    y=bullets(y,[
     "Exposição itinerante «Entre Ruínas e Memórias» em circulação — apresentação na Junta de Freguesia de Estói, de 31 de Outubro a 6 de Novembro de 2026.",
     "Elaboração do Relatório de Execução e Execução Financeira para a CCDR Algarve, I.P. (ao abrigo do art. 13.º do Aviso), em curso.",
     "Preparação para produção/impressão dos materiais de divulgação (prepress e cor final com a gráfica).",
     "Circuito Educativo de Milreu — em preparação (recursos pedagógicos e planeamento de actividades).",
     "Portal projectomilreu.pt e componente digital do Museu de Memórias — em actualização contínua.",
    ]); y-=8
    y=h2(y,"4. Trabalhos realizados")
    y=bullets(y,[
     "Sessões comunitárias e rodas de conversa (apresentações, debates, visitas guiadas e recolha de memórias): 7 de Fevereiro, 11 de Abril e 18 de Abril de 2026.",
     "Exposição «Entre Ruínas e Memórias» — conjunto de 12 painéis; primeira montagem a 10 de Outubro de 2026.",
     "Materiais de divulgação e produção: flyer e marcador, convite ao Inquérito Milreu 2026, dossiê de acolhimento, folha de sala, manual do expositor, cartazes, posters de congresso, banner institucional e kit de imprensa.",
     "Documentação continuada do sítio, das memórias e das relações entre património, investigação e comunidade.",
    ]); y-=6
    c.setFont("SPi",8.5); c.setFillColorRGB(*INK5)
    for ln in _wrap(c,"O registo fotográfico das atividades apresenta-se na página seguinte.","SPi",8.5,CW): c.drawString(MX,y,ln); y-=12
    footer()

    # ---------- Página 3 — registo fotográfico ----------
    c.showPage(); bg(); y=H-MX
    y=h2(y,"5. Atividades realizadas — registo fotográfico")
    cols=2; gap=8*mm; cw=(CW-gap)/cols
    imgh=cw*0.70; caph=22; cellh=imgh+caph+10*mm
    x0=MX; yy=y-6
    for i,(fn,cap,rot,ax) in enumerate(FOTOS):
        col=i%cols; row=i//cols
        cx=x0+col*(cw+gap); cy=yy-row*cellh
        p=os.path.join(FOTOS_DIR,fn)
        try:
            im=ImageOps.exif_transpose(Image.open(p)).convert("RGB")
            if rot: im=im.rotate(rot, expand=True)
            k=max(cw/im.size[0], imgh/im.size[1]); nw,nh=int(im.size[0]*k),int(im.size[1]*k)
            im=im.resize((nw,nh)); l=int((nw-int(cw))*ax); t=(nh-int(imgh))//2; im=im.crop((l,t,l+int(cw),t+int(imgh)))
            b=io.BytesIO(); im.save(b,"JPEG",quality=86); b.seek(0)
            c.drawImage(ImageReader(b),cx,cy-imgh,width=cw,height=imgh)
            c.setStrokeColorRGB(*STONE); c.setLineWidth(0.5); c.rect(cx,cy-imgh,cw,imgh,fill=0,stroke=1)
        except Exception as e:
            c.setFillColorRGB(0.9,0.9,0.9); c.rect(cx,cy-imgh,cw,imgh,fill=1,stroke=0)
        c.setFont("SP",7.6); c.setFillColorRGB(*INK7)
        ty=cy-imgh-11
        for ln in _wrap(c,cap,"SP",7.6,cw): c.drawString(cx,ty,ln); ty-=9.5
    cy=yy-((len(FOTOS)+1)//cols)*cellh
    c.setFont("SPi",8); c.setFillColorRGB(*INK5)
    c.drawString(MX,max(cy-4,22*mm),"Registo fotográfico: Projecto Comunitário de Milreu (Fernando Rodrigues de Jácomo).")
    footer()

    # ---------- Página 4 — apoio institucional + contactos ----------
    c.showPage(); bg(); y=H-MX
    y=h2(y,"6. Apoio institucional (cartas em anexo)")
    _ap=["Anexo I — Declaração de Apoio da União das Freguesias de Faro (Sé e São Pedro), subscrita pela Presidente Paula Matias, em 16 de Abril de 2026, manifestando apoio à candidatura e reconhecendo a relevância cultural, social e artística do projecto."]
    _ap.append("Anexo II — Carta da Câmara Municipal de Faro (Cidade de Faro), com timbre oficial, assinatura e selo." if INCLUDE_AX2
               else "Carta de apoio da Câmara Municipal de Faro (Cidade de Faro) — a incluir quando disponível uma digitalização legível.")
    y=bullets(y,_ap); y-=10
    y=h2(y,"7. Contactos")
    y=block(y,"Coordenação e responsável — Fernando Rodrigues de Jácomo · a78190@ualg.pt · projectomilreu.pt","SPm",9.5,INK7)
    y=block(y,"Entidade beneficiária e mediadora — Associação dos Amigos do Museu do Lyceu de Faro (AAMLF) · museu.lyceu@aejdfaro.pt · Av. 5 de Outubro, Liceu de Faro, 8004-069 Faro","SPm",9.5,INK7)
    footer()
    c.save()

def anexo_page(c, img_pdf, rotate, titulo, enhance=False):
    pdf=pikepdf.open(img_pdf); pg=pdf.pages[0]
    im=pikepdf.PdfImage(list(pg.images.values())[0]).as_pil_image().convert("RGB"); pdf.close()
    if enhance:  # digitalização muito clara: reforçar contraste p/ revelar timbre/assinatura
        im=ImageOps.autocontrast(im,cutoff=1); im=ImageEnhance.Contrast(im).enhance(2.3); im=ImageEnhance.Brightness(im).enhance(0.96)
    if rotate: im=im.rotate(rotate, expand=True)
    c.setFillColorRGB(*MARF); c.rect(0,0,W,H,fill=1,stroke=0)
    c.setFont("AR",8); c.setFillColorRGB(*INK5); c.drawString(MX,H-16*mm,titulo.upper())
    c.setStrokeColorRGB(*STONE); c.setLineWidth(0.5); c.line(MX,H-18*mm,MX+CW,H-18*mm)
    aw=CW; ah=H-2*MX-10*mm; k=min(aw/im.size[0], ah/im.size[1]); dw,dh=im.size[0]*k,im.size[1]*k
    b=io.BytesIO(); im.save(b,"JPEG",quality=88); b.seek(0)
    c.drawImage(ImageReader(b),(W-dw)/2,(H-20*mm-dh),width=dw,height=dh); c.showPage()

if __name__=="__main__":
    corpo=os.path.join(PRIV,"RELATORIO_APOIO_Ciclo_2026_corpo.pdf")
    build_corpo(corpo); print("corpo:",corpo, os.path.getsize(corpo)//1024,"KB")
    full=os.path.join(PRIV,"RELATORIO_APOIO_Ciclo_2026_COM_ANEXOS.pdf")
    out=pikepdf.open(corpo)
    tmp=os.path.join(PRIV,".anexos_tmp.pdf"); ca=canvas.Canvas(tmp,pagesize=A4); ok=True
    if os.path.exists(AX1): anexo_page(ca,AX1,90,"Anexo I — Declaração de Apoio · União das Freguesias de Faro (Sé e São Pedro)")
    else: ok=False; print("FALTA AX1:",AX1)
    if INCLUDE_AX2 and os.path.exists(AX2): anexo_page(ca,AX2,0,"Anexo II — Câmara Municipal de Faro (Cidade de Faro)",enhance=True)
    elif not INCLUDE_AX2: print("AX2 OMITIDO (scan em branco) — activar com INCLUDE_AX2=1 quando houver scan legível")
    ca.save()
    if ok:
        ax=pikepdf.open(tmp); out.pages.extend(ax.pages); out.save(full); out.close(); ax.close(); os.remove(tmp)
        print("COM ANEXOS:",full, os.path.getsize(full)//1024,"KB")
    else: out.close()
