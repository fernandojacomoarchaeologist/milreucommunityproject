#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar RIGHTS.md.
"""Item 11 — Manual do Expositor «Entre Ruínas e Memórias». 1ª PROVA (PDF RGB).
A4 vertical, PT-PT, DS (Fraunces/Spectral/Archivo). Operacional, imprimível, verificável.
B/W-safe: estados por checkbox/label, não por cor. VEVOR × AAMLF separados. Placeholders explícitos.
NÃO inventa especificações; marca PENDING PHYSICAL VALIDATION. Parar em HUMAN GATE."""
import os,sys,json
HERE=os.path.dirname(os.path.abspath(__file__))
def _repo(p):
    p=os.path.abspath(p)
    while p!='/' and not os.path.exists(os.path.join(p,'CLAUDE.md')): p=os.path.dirname(p)
    return p
REPO=_repo(HERE)
from PIL import Image, ImageDraw, ImageFont
import numpy as _np
OUT=os.path.join(REPO,"docs","dissemination","manual-expositor","proof"); PG=os.path.join(OUT,"pages")
os.makedirs(PG,exist_ok=True)
QR_PNG=os.path.join(REPO,"docs","dissemination","dossie-convite","final","editaveis","QR_projectomilreu.png")
QURL="https://projectomilreu.pt"
LOGODIR=os.path.join(REPO,"public","media","exhibition","updated","logos")
LOGOS=["logo-projeto-comunitario-milreu.png","logo-ccdr-algarve.png","logo-associacao-amigos-museu-lyceu-faro.png","Milreu_policromatico.png","logo-ualg-completo.png"]
MARF=(255,252,247); CAMPO=(251,246,238); CAMPO2=(244,236,221); INK=(30,26,23); INK7=(69,61,54); INK5=(118,109,100); INK3=(181,170,155)
RED=(168,50,39); KEY=(176,164,145); HAIR=(230,220,201); BROWN=(98,70,45)
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
DPI=int(os.environ.get("ITEM11_DPI","200")); mm=DPI/25.4
def P(v): return round(v*mm)
def PT(v): return round(v*DPI/72)
W,H=P(210),P(297); MX=P(18); CW=W-2*MX
TOP=P(22); BOT=H-P(16)
TOC=[]       # [(num, title, page_index)]
ANX=[]       # [(code, title, page_index)]
PAGES=[]     # ordem de ficheiros
LINKS={}     # pageidx -> [(x0,y0,x1,y1, target_or_dest)]
def addlink(pi,x0,y0,x1,y1,tgt): LINKS.setdefault(pi,[]).append((round(x0),round(y0),round(x1),round(y1),tgt))

class Page:
    def __init__(s,running="Manual do Expositor · Entre Ruínas e Memórias",cover=False):
        s.im=Image.new("RGB",(W,H),MARF); s.d=ImageDraw.Draw(s.im); s.y=TOP; s.idx=len(PAGES)
        s.cover=cover
        if not cover: s._runhead(running)
    def _runhead(s,t):
        s.text(MX,P(10),t,"u",PT(6.5),INK5,ls=PT(0.4))
        uw=s.tw("projectomilreu.pt","u",PT(6.5)); s.text(W-MX,P(10),"projectomilreu.pt","u",PT(6.5),INK5,"r")
        addlink(s.idx,W-MX-uw,P(10),W-MX,P(10)+PT(6.5),QURL)
        s.line(MX,P(14.5),W-MX,P(14.5),HAIR,1)
    def text(s,x,y,t,k,px,fill=INK,a="l",wt=None,ls=0):
        ft=font(k,px,wt)
        if ls and a=="l" and len(t)>1:
            cx=x
            for ch in t: s.d.text((cx,y),ch,font=ft,fill=fill,anchor="la");cx+=s.d.textlength(ch,font=ft)+ls
        else: s.d.text((x,y),t,font=ft,fill=fill,anchor={"l":"la","m":"ma","r":"ra"}[a])
    def tw(s,t,k,px,wt=None): return s.d.textlength(t,font=font(k,px,wt))
    def line(s,x1,y1,x2,y2,fill=HAIR,w=1): s.d.line([(x1,y1),(x2,y2)],fill=fill,width=w)
    def rect(s,x,y,w,h,fill=None,outline=None,ow=1): s.d.rectangle([x,y,x+w,y+h],fill=fill,outline=outline,width=ow)
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
    def para(s,t,k=None,px=None,fill=INK7,lh=1.5,x=None,maxw=None,gap=3):
        k=k or "s"; px=px or PT(9.6); x=MX if x is None else x; maxw=CW if maxw is None else maxw
        for ln in s.wrap(t,k,px,maxw): s.text(x,s.y,ln,k,px,fill); s.y+=round(px*lh)
        s.y+=P(gap); return s.y
    def eyebrow(s,t,fill=RED,gap=4): s.text(MX,s.y,t,"u",PT(8),fill,"l",wt=600,ls=PT(0.9)); s.y+=P(gap)+PT(8)
    def h2(s,t,gap=3):
        s.text(MX,s.y,t,"d",PT(13),INK,"l",wt=600); s.y+=round(PT(13)*1.1)+P(gap)
    def sectiontitle(s,num,t):
        s.text(MX,s.y,num,"u",PT(10),RED,"l",wt=700); s.text(MX+P(10),s.y,t,"d",PT(18),INK,"l",wt=600)
        s.y+=round(PT(18)*1.1)+P(4); s.line(MX,s.y,W-MX,s.y,RED,2); s.y+=P(5)
        TOC.append((num,t,s.idx))
    def step(s,n,t,maxw=None):
        maxw=CW-P(9) if maxw is None else maxw
        s.text(MX,s.y+P(0.2),str(n),"u",PT(9.5),RED,"l",wt=700)
        lines=s.wrap(t,"s",PT(9.6),maxw); yy=s.y
        for ln in lines: s.text(MX+P(9),yy,ln,"s",PT(9.6),INK7); yy+=round(PT(9.6)*1.42)
        s.y=yy+P(1.6)
    def bullet(s,t,maxw=None,fill=INK7,sym=True):
        maxw=CW-P(6) if maxw is None else maxw
        if sym: s.rect(MX+P(0.4),s.y+P(1.2),P(1.4),P(1.4),RED)
        lines=s.wrap(t,"s",PT(9.6),maxw); yy=s.y
        for ln in lines: s.text(MX+P(5),yy,ln,"s",PT(9.6),fill); yy+=round(PT(9.6)*1.42)
        s.y=yy+P(1.2)
    def check(s,t,x=None,w=None):
        x=MX if x is None else x; w=CW-P(7) if w is None else w
        s.rect(x,s.y+P(0.2),P(3.4),P(3.4),None,INK,2)  # ☐ imprimível
        lines=s.wrap(t,"s",PT(9.6),w-P(7)); yy=s.y
        for ln in lines: s.text(x+P(6),yy,ln,"s",PT(9.6),INK7); yy+=round(PT(9.6)*1.42)
        s.y=max(yy, s.y+P(5))+P(1.0)
    def field(s,label,x=None,w=None,inline=False):
        x=MX if x is None else x; w=CW if w is None else w
        s.text(x,s.y,label,"u",PT(8),INK5,"l",wt=600)
        ly=s.y+PT(8)+P(5.0); s.line(x,ly,x+w,ly,INK3,1); s.y=ly+P(4.5)  # espaço real de escrita à mão
    def ibox(s,x,y,label,px=None,gap=None,fill=INK7):  # checkbox inline (rect desenhado + rótulo)
        px=px or PT(9); gap=gap if gap is not None else P(3); bs=round(px*0.92)
        s.rect(x,y+round(px*0.1),bs,bs,None,INK,2); lx=x+bs+P(1.6)
        s.text(lx,y,label,"s",px,fill,"l"); return lx+s.tw(label,"s",px)+gap
    def iboxes(s,x,y,labels,px=None,gap=None):
        cx=x
        for lb in labels: cx=s.ibox(cx,y,lb,px,gap)
        return cx
    def kv(s,k,v,x=None,w=None):
        x=MX if x is None else x
        s.text(x,s.y,k,"u",PT(8),INK5,"l",wt=600); s.text(x+P(32),s.y,v,"s",PT(9.6),INK,"l"); s.y+=round(PT(9.6)*1.5)
    def callout(s,title,body,tint=CAMPO):
        pad=P(4); lines=s.wrap(body,"s",PT(9.2),CW-2*pad); bh=PT(8)+P(2)+len(lines)*round(PT(9.2)*1.42)+2*pad
        s.rect(MX,s.y,CW,bh,tint); s.rect(MX,s.y,P(1.4),bh,RED)
        s.text(MX+pad,s.y+pad,title,"u",PT(8),RED,"l",wt=700,ls=PT(0.6)); yy=s.y+pad+PT(8)+P(2)
        for ln in lines: s.text(MX+pad+P(1),yy,ln,"s",PT(9.2),INK7); yy+=round(PT(9.2)*1.42)
        s.y+=bh+P(4)
    def pending(s,t):
        s.callout("PENDING PHYSICAL VALIDATION",t,CAMPO2)
    def qr(s,x,y,size,url=True):
        im=Image.open(QR_PNG).convert("RGB"); im=im.resize((size,size),Image.NEAREST)
        s.rect(x-P(3),y-P(3),size+P(6),size+P(6),MARF,KEY,1); s.im.paste(im,(x,y))
        if url: addlink(s.idx,x,y,x+size,y+size,QURL)
    def qr_placeholder(s,x,y,size,label):
        s.rect(x,y,size,size,CAMPO2,KEY,1)
        s.d.line([(x,y),(x+size,y+size)],fill=INK3,width=1); s.d.line([(x+size,y),(x,y+size)],fill=INK3,width=1)
        s.text(x+size/2,y+size/2-PT(6),label,"u",PT(6.5),INK5,"m",wt=600)
        s.text(x+size/2,y+size/2+P(1),"(a criar)","si",PT(6.5),INK5,"m")
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
            s.im.paste(rim,(round(cx),round(y)),rim); cx+=w+gap
        return cx-gap-x
    def footer(s,label=""):
        n=s.idx+1
        s.line(MX,BOT,W-MX,BOT,HAIR,1)
        s.text(MX,BOT+P(2),label,"u",PT(6.5),INK5,"l")
        s.text(W-MX,BOT+P(2),f"{n}","u",PT(7.5),INK5,"r",wt=600)
    def save(s,name,label=""):
        if not s.cover: s.footer(label)
        s.im.save(f"{PG}/{name}.png"); PAGES.append(name); return s

# ============================== PÁGINAS ==============================
def need(p,minrem): return (BOT-P(8)-p.y) < minrem  # guarda simples (não paginar automaticamente nesta prova)

def p_capa():
    p=Page(cover=True); x=MX; y=P(40)
    p.text(x,y,"MANUAL DO EXPOSITOR","u",PT(10),RED,"l",wt=700,ls=PT(1.4)); y+=P(16)
    tfs=PT(40)
    while p.tw("Entre Ruínas e Memórias","d",tfs,600)>CW and tfs>10: tfs-=1
    p.text(x,y,"Entre Ruínas e Memórias","d",tfs,INK,"l",wt=600); y+=round(tfs*1.12)+P(4)
    for ln in p.wrap("Exposição itinerante — guia operacional de recepção, montagem, acompanhamento, desmontagem e devolução.","si",PT(12),CW*0.9):
        p.text(x,y,ln,"si",PT(12),INK5); y+=round(PT(12)*1.34)
    y+=P(10); p.line(x,y,W-MX,y,HAIR,1); y+=P(8)
    p.text(x,y,"Projecto Comunitário de Milreu","s",PT(12),INK,"l"); y+=round(PT(12)*1.5)
    p.text(x,y,"MUSEUS SEM FRONTEIRAS · INICIATIVAS 2026","u",PT(8),INK5,"l",wt=600,ls=PT(0.8)); y+=round(PT(8)*1.6)
    # estado
    p.y=H-P(78)
    p.callout("ESTADO DESTA VERSÃO","IN PRODUCTION / HUMAN PROOF PENDING · PHYSICAL VALIDATION GATE OPEN. Configurações de montagem e embalagem são PREVISTAS; a configuração definitiva depende de validação física dos painéis e suportes.",CAMPO2)
    # QR do site em baixo-direita (não sobre o título) + utilização à esquerda
    qsz=P(20); qxx=W-MX-qsz; qyy=H-P(50)
    p.text(qxx,qyy-P(5),"ACEDA ONLINE","u",PT(6.5),INK5,"l",wt=600,ls=PT(0.4))
    p.qr(qxx,qyy,qsz)
    p.y=H-P(44)
    for ln in p.wrap("Utilização: ONLINE quando possível · PAPEL quando necessário.","sm",PT(9.5),W-2*MX-qsz-P(8)):
        p.text(x,p.y,ln,"sm",PT(9.5),INK7,"l",wt=500); p.y+=round(PT(9.5)*1.5)
    p.logoband(x,H-P(22),P(7.0))
    p.save("p00_capa")

def p_indice():
    p=Page(running="Manual do Expositor"); p.y=TOP+P(4)
    p.eyebrow("ÍNDICE"); p.h2("Como usar este manual",gap=2)
    p.para("Cada secção termina com uma acção ou lista de verificação. Os anexos imprimíveis (A–G) servem de contingência quando não houver acesso à Internet. Imprima-os em A4 e preencha à mão; depois transcreva/entregue ao Projecto.",px=PT(9.4),gap=5)
    # O índice será preenchido na finalização (links internos). Aqui, marcador de layout.
    p.rect(MX,p.y,CW,P(150),None,HAIR,1)
    p.text(MX+P(4),p.y+P(4),"[ÍNDICE CLICÁVEL — gerado na finalização com os números de página reais e links internos]","si",PT(8.5),INK5,"l")
    p.y+=P(156)
    p.save("p01_indice","Índice")

def sec_antes():
    p=Page(); p.y=TOP+P(4); p.sectiontitle("1","Antes da chegada")
    p.para("O espaço anfitrião deve preparar a recepção e designar um responsável. Confirme datas, acessos e condições antes de a exposição chegar.")
    p.eyebrow("CONFIRMAR ANTES DA CHEGADA")
    for b in ["Responsável local pela exposição (e substituto).","Espaço de exposição e local temporário de armazenamento.","Datas (recepção, montagem, abertura, desmontagem, devolução).","Acessos: porta, elevador/escadas, largura de passagem para painéis 841×1800 mm.","Equipa disponível (mínimo duas pessoas para mover os painéis).","Sistema de montagem previsto: suportes próprios (VEVOR) ou estruturas AAMLF (fallback)."]:
        p.bullet(b)
    p.y+=P(3); p.eyebrow("RESPONSÁVEL LOCAL PELA EXPOSIÇÃO")
    half=(CW-P(8))/2
    p.field("Nome",w=CW);
    y0=p.y; p.field("Instituição",x=MX,w=half); yA=p.y; p.y=y0; p.field("Função",x=MX+half+P(8),w=half); p.y=max(yA,p.y)
    y0=p.y; p.field("E-mail",x=MX,w=half); yA=p.y; p.y=y0; p.field("Telefone",x=MX+half+P(8),w=half); p.y=max(yA,p.y)
    p.field("Substituto (nome / contacto)",w=CW)
    p.y+=P(2); p.eyebrow("ENVIO DE DOCUMENTAÇÃO")
    p.para("Checklists, fotografias e registos devem ser enviados ao Projecto:",px=PT(9.4),gap=1)
    p.text(MX,p.y,"a78190@ualg.pt","sm",PT(10),RED,"l",wt=500); addlink(p.idx,MX,p.y,MX+p.tw("a78190@ualg.pt","sm",PT(10),500),p.y+PT(10),"mailto:a78190@ualg.pt"); p.y+=round(PT(10)*1.7)
    p.para("Assunto: [MILREU] [TIPO] — INSTITUIÇÃO — DATA · tipos: RECEPÇÃO · MONTAGEM · DANO · DEVOLUÇÃO · MÉTRICAS · AVALIAÇÃO.",px=PT(9),gap=1)
    p.para("Nomeie as fotografias de forma identificável: INSTITUIÇÃO_DATA_TIPO_ITEM_Nº.jpg  (ex.: MuseuFaro_2026-11-03_DANO_Q07_01.jpg).",px=PT(9),gap=1)
    p.para("Se os anexos forem grandes para um só e-mail, envie em várias mensagens com o mesmo assunto, numeradas 1/2, 2/2…",px=PT(9),gap=1)
    p.para("Se envolver estruturas/equipamentos da AAMLF, colocar em cópia museu.lyceu@aejdfaro.pt.",px=PT(9),gap=1)
    p.text(MX,p.y,"Envio online: a disponibilizar","si",PT(8.3),INK5,"l")
    p.save("p02_antes","1 · Antes da chegada")

def sec_receber():
    p=Page(); p.y=TOP+P(4); p.sectiontitle("2","O que vai receber")
    p.para("Configuração-base de circulação (kit canónico). Confira contra o inventário na recepção (anexo A).")
    p.eyebrow("INVENTÁRIO-BASE")
    for b in ["12 painéis individuais Q1–Q12 · 841 × 1800 mm · peça individual (não são frente-verso).",
              "6 suportes de chão ajustáveis (VEVOR SW-03, dupla face) — S1–S6, com bases, hastes, parafusos e componentes.",
              "Embalagem de protecção reutilizável.",
              "Manual do Expositor (digital + QR) e checklists imprimíveis."]:
        p.bullet(b)
    p.y+=P(2)
    p.callout("IDENTIFICAÇÃO FÍSICA","Marque fisicamente cada suporte S1–S6 e guarde as peças pequenas (parafusos/fechos) em sacos também identificados S1–S6. Reduz o risco de extravio de componentes durante a itinerância.")
    p.eyebrow("OS 12 PAINÉIS")
    cols=2; colw=(CW-P(8))/cols; names=["Q1 Entre Ruínas e Memórias","Q2 As escavações em Milreu","Q3 A Festa da Pinha","Q4 Os jornalistas ingleses","Q5 Memórias de juventude","Q6 Achados romanos de Milreu","Q7 Theodor Hauschild e a equipa","Q8 A equipa de Milreu","Q9 Trabalhar nas ruínas","Q10 Junto ao edifício de cultos","Q11 A participação local","Q12 Mensagens para o futuro"]
    y0=p.y
    for i,nm in enumerate(names):
        cx=MX+(i%2)*(colw+P(8)); ry=y0+(i//2)*round(PT(9.6)*1.7)
        num,rest=nm.split(" ",1)
        p.text(cx,ry,num,"u",PT(9),RED,"l",wt=700); p.text(cx+P(10),ry,rest,"s",PT(9.4),INK,"l")
    p.y=y0+6*round(PT(9.6)*1.7)+P(2)
    p.callout("TÍTULOS Q1–Q12","Sequência editorial de referência (fonte de verdade confirmada pelo Projecto). Se, na produção física, algum título de painel divergir, prevalece o painel final de produção.")
    p.save("p03_receber","2 · O que vai receber")

def sec_checkin():
    p=Page(); p.y=TOP+P(4); p.sectiontitle("3","Recepção / Check-in")
    p.para("Faça a recepção ANTES da montagem. Inspeccione ao desembalar e compare com a documentação. Use o anexo A (Checklist de Recepção).")
    for n,t in [(1,"Confirme data/hora, instituição e quem recebeu."),
        (2,"Fotografe todos os volumes ainda fechados."),
        (3,"Registe danos exteriores: rasgos, amassados, humidade, violação."),
        (4,"Confira 12 painéis Q1–Q12, um a um; e 6 suportes S1–S6 com componentes."),
        (5,"Inspeccione cada painel: frente, verso, quatro bordos e quatro cantos."),
        (6,"Fotografe qualquer marca já existente e classifique: OK / observação / dano."),
        (7,"Só então assine o recebimento (quem conferiu / data).")]:
        p.step(n,t)
    p.y+=P(2)
    p.callout("REGRA","Comunique imediatamente, por escrito e com fotografias, qualquer dano ou discrepância — antes de instalar. Não repare nem altere nada sem autorização escrita do Projecto.")
    p.eyebrow("ENVIO")
    p.para("Se houver OBS ou DANO, envie a checklist e as fotografias ANTES da montagem. Se houver apenas itens OK, guarde a checklist para enviar com a documentação de encerramento.",px=PT(9.2),gap=1)
    p.text(MX,p.y,"a78190@ualg.pt","sm",PT(9.5),RED,"l",wt=500); addlink(p.idx,MX,p.y,MX+p.tw("a78190@ualg.pt","sm",PT(9.5),500),p.y+PT(9.5),"mailto:a78190@ualg.pt"); p.y+=round(PT(9.6)*1.5)
    p.save("p04_checkin","3 · Recepção / Check-in")

def sec_armazenamento():
    p=Page(); p.y=TOP+P(4); p.sectiontitle("4","Armazenamento temporário")
    p.para("Enquanto não montar (ou entre montagens), guarde o material em condições conservadoras.")
    for b in ["Interior, seco, limpo e protegido do sol directo.","Afastado de fontes de calor e de água/humidade.","Sem cargas sobre os painéis; sem contacto directo com o piso.","Não deixar painéis soltos encostados de forma instável.","Manter a embalagem original para a devolução."]:
        p.bullet(b)
    p.pending("A posição ideal de armazenamento (horizontal vs. vertical) depende do material real do painel e da embalagem. Até à validação física, guarde conforme recebido, apoiado e protegido, sem flexão nem pressão pontual.")
    p.save("p05_armazenamento","4 · Armazenamento temporário")

def sec_montagem():
    p=Page(); p.y=TOP+P(4); p.sectiontitle("5","Montagem com suportes próprios (VEVOR)")
    p.para("Suportes VEVOR SW-03 (dupla face, altura ajustável 100–1905 mm). Montagem interior. Use o anexo B (Checklist de Montagem).")
    for n,t in [(1,"Prepare área limpa, iluminada, sem público; piso firme, plano e nivelado."),
        (2,"Monte S1–S6 SEM painel; aperte e bloqueie todas as peças; ajuste a altura."),
        (3,"Inspeccione estabilidade antes de colocar painéis."),
        (4,"Com duas pessoas, instale os painéis; confira verticalidade e sequência."),
        (5,"Fotografe a exposição montada e preencha a checklist.")]:
        p.step(n,t)
    p.callout("PROIBIDO","Furar painéis · fita/cola sobre a impressão · parafusos através do painel · limpeza com álcool/solventes · alterar o suporte. Uso interior (exterior exige aprovação específica).")
    p.pending("A página oficial do SW-03 NÃO indica capacidade de carga nem espessura máxima de painel. A configuração de DOIS painéis por suporte (um por face) é PREVISTA, não validada. A montagem com dois painéis por suporte deve seguir EXCLUSIVAMENTE a configuração validada pelo Projecto (peso, espessura, fixação, estabilidade e deformação confirmados fisicamente).")
    p.save("p06_montagem","5 · Montagem (VEVOR)")

def sec_percurso():
    p=Page(); p.y=TOP+P(4); p.sectiontitle("6","Percurso recomendado")
    p.para("Se a validação física confirmar duas faces por suporte: percurso de ida e volta. Ida Q1→Q6 (uma face); contorna-se o último suporte; regresso Q7→Q12 (face posterior).")
    p.y+=P(5)
    # rótulo IDA (acima do diagrama, linha própria)
    p.text(MX,p.y,"IDA — Q1 → Q6 (face A, frente)","u",PT(7.5),RED,"l",wt=700,ls=PT(0.3)); p.y+=PT(7.5)+P(5)
    dx=MX; dw=CW; stand_w=P(6.5); gapw=(dw-6*stand_w)/5; sh=P(28)
    pairs=[("Q1","Q12"),("Q2","Q11"),("Q3","Q10"),("Q4","Q9"),("Q5","Q8"),("Q6","Q7")]
    # linha de rótulos S1–S6 (acima das barras, sem tocar)
    sly=p.y
    for i in range(6):
        sx=dx+i*(stand_w+gapw); p.text(sx+stand_w/2,sly,f"S{i+1}","u",PT(8),INK,"m",wt=700)
    dy=sly+PT(8)+P(3)
    for i,(a,b) in enumerate(pairs):
        sx=dx+i*(stand_w+gapw)
        p.rect(sx,dy,stand_w,sh,CAMPO,INK5,2); p.rect(sx,dy,stand_w,P(2),RED)
        p.text(sx+stand_w/2,dy+P(2.6),a,"u",PT(8),RED,"m",wt=700)       # face A (topo, dentro)
        p.text(sx+stand_w/2,dy+sh-P(6.4),b,"u",PT(8),INK7,"m",wt=700)   # face B (base, dentro)
    regy=dy+sh+P(3)
    p.text(W-MX,regy,"REGRESSO — Q7 → Q12 (face B, posterior)","u",PT(7.5),INK7,"r",wt=700,ls=PT(0.3))
    p.y=regy+PT(7.5)+P(7)
    p.line(MX,p.y,W-MX,p.y,KEY,2); p.y+=P(3); p.text(W/2,p.y,"→ ida (frente) · volta (posterior) ←","si",PT(7.5),INK5,"m"); p.y+=PT(7.5)+P(8)
    # tabela de pares
    p.eyebrow("CONFIGURAÇÃO RECOMENDADA — PARES POR SUPORTE")
    colw=(CW-P(8))/2; y0=p.y
    hdr=["Suporte","Face A","Face B"]
    rows=[("S1","Q1","Q12"),("S2","Q2","Q11"),("S3","Q3","Q10"),("S4","Q4","Q9"),("S5","Q5","Q8"),("S6","Q6","Q7")]
    for col in range(2):
        cx=MX+col*(colw+P(8)); rr=rows[col*3:col*3+3]; ry=y0
        for s_,a_,b_ in rr:
            p.text(cx,ry,s_,"u",PT(9),RED,"l",wt=700); p.text(cx+P(16),ry,f"A: {a_}","s",PT(9),INK,"l"); p.text(cx+P(40),ry,f"B: {b_}","s",PT(9),INK,"l")
            ry+=round(PT(9.6)*1.7)
    p.y=y0+3*round(PT(9.6)*1.7)+P(3)
    p.callout("CONFIGURAÇÃO RECOMENDADA — sujeita à validação física dos suportes","Não é a única configuração possível: adapte ao espaço. Outras disposições são admissíveis conforme circulação e área disponível.")
    p.save("p07_percurso","6 · Percurso recomendado")

def sec_aamlf():
    p=Page(); p.y=TOP+P(4); p.sectiontitle("7","Sistema alternativo — estruturas AAMLF")
    p.callout("SISTEMA ALTERNATIVO / MEDIANTE ARTICULAÇÃO PRÉVIA","Quando os seis suportes próprios não puderem ser utilizados, forem insuficientes, não puderem ser transportados, ou o local exigir outra solução, poderá recorrer-se às estruturas metálicas do Museu do Lyceu / AAMLF. Disponibilidade NÃO garantida; recolha/utilização sempre articuladas previamente.")
    p.eyebrow("CARACTERÍSTICAS (para referência)")
    for b in ["7 estruturas metálicas expositivas, utilizáveis nas duas faces (até 14 superfícies).","Estabilidade por associação entre estruturas.","Configuração em núcleos 2 + 2 + 3 ou percurso contínuo em ziguezague."]:
        p.bullet(b)
    p.para("As instruções destas estruturas NÃO se misturam com as dos suportes VEVOR — são dois sistemas de montagem distintos.",px=PT(9.4))
    p.eyebrow("PEDIDO / ARTICULAÇÃO")
    p.para("Qualquer pedido, marcação de recolha ou devolução das estruturas do Museu do Lyceu deve ser previamente articulado e enviado com cópia para:",px=PT(9.4),gap=1)
    p.kv("AAMLF","Museu do Lyceu de Faro"); p.kv("Interlocutor","Meira Pinto — AAMLF");
    p.text(MX,p.y,"museu.lyceu@aejdfaro.pt","sm",PT(9.6),RED,"l",wt=500); addlink(p.idx,MX,p.y,MX+p.tw("museu.lyceu@aejdfaro.pt","sm",PT(9.6),500),p.y+PT(9.6),"mailto:museu.lyceu@aejdfaro.pt"); p.y+=round(PT(9.6)*1.6)
    p.save("p08_aamlf","7 · Sistema alternativo AAMLF")

def sec_durante():
    p=Page(); p.y=TOP+P(4); p.sectiontitle("8","Durante a exposição")
    p.para("Micro-inspecção periódica (semanal, ou sempre que o espaço for alterado).")
    for b in ["Bases estáveis e hastes bloqueadas.","Painéis alinhados e sem deformação.","Sem dano novo.","Circulação livre.","QR / material de sala (folha de sala) disponível.","Nenhum suporte desapertado."]:
        p.check(b)
    p.para("Se houver alteração: fotografar + registar.",px=PT(9.4))
    p.save("p09_durante","8 · Durante a exposição")

def sec_danos():
    p=Page(); p.y=TOP+P(4); p.sectiontitle("9","Danos / incidentes")
    p.callout("PARAR → ISOLAR → FOTOGRAFAR → REGISTAR → CONTACTAR","Não tentar reparar. Contacte o Projecto antes de qualquer intervenção.",CAMPO2)
    p.eyebrow("PROCEDIMENTO")
    for n,t in [(1,"Impedir nova manipulação; retirar da área pública apenas se houver risco de queda."),
        (2,"Fotografar plano geral + detalhe."),
        (3,"Registar Q#, S#, data, hora, local e circunstâncias (anexo C)."),
        (4,"Guardar qualquer peça solta."),
        (5,"Contactar o Projecto e aguardar instruções.")]:
        p.step(n,t)
    p.eyebrow("NÃO FAZER")
    for b in ["Não colar · não limpar · não retocar · não furar · não endireitar à força.","Não fechar material molhado em plástico."]:
        p.bullet(b)
    p.callout("ENVIO IMEDIATO","Enviar imediatamente a Ficha de Ocorrência (anexo C) + fotografias para a78190@ualg.pt. Se envolver equipamento/estruturas da AAMLF, colocar em cópia museu.lyceu@aejdfaro.pt.")
    p.eyebrow("CONTACTOS")
    p.text(MX,p.y,"Projecto — a78190@ualg.pt","sm",PT(9.6),INK,"l",wt=500); addlink(p.idx,MX,p.y,MX+p.tw("Projecto — a78190@ualg.pt","sm",PT(9.6),500),p.y+PT(9.6),"mailto:a78190@ualg.pt"); p.y+=round(PT(9.6)*1.6)
    p.text(MX,p.y,"CC AAMLF (equipamento) — museu.lyceu@aejdfaro.pt (Meira Pinto)","s",PT(9.2),INK7,"l"); addlink(p.idx,MX,p.y,MX+p.tw("CC AAMLF (equipamento) — museu.lyceu@aejdfaro.pt (Meira Pinto)","s",PT(9.2)),p.y+PT(9.2),"mailto:museu.lyceu@aejdfaro.pt"); p.y+=round(PT(9.6)*1.5)
    p.text(MX,p.y,"Reportar dano (online): link a criar — por agora, e-mail.","si",PT(8.5),INK5,"l")
    p.save("p10_danos","9 · Danos / incidentes")

def sec_desmontagem():
    p=Page(); p.y=TOP+P(4); p.sectiontitle("10","Desmontagem e devolução (Check-out)")
    p.para("Faça o segundo relatório de condição à saída. Use o anexo D (Checklist de Desmontagem/Devolução).")
    for n,t in [(1,"Concluir métricas e fotografar a instalação."),
        (2,"Conferir Q1–Q12 e registar alterações desde a recepção."),
        (3,"Desmontar S1–S6; conferir e separar as peças (sacos S1–S6)."),
        (4,"Limpar apenas se autorizado."),
        (5,"Reembalar seguindo exactamente a ordem/embalagem original."),
        (6,"Fotografar volumes fechados; identificar volumes e destino; assinar a saída.")]:
        p.step(n,t)
    p.callout("REGRA","Devolver nos mesmos materiais de embalagem. Comunicar por escrito qualquer alteração de condição antes da devolução.")
    p.save("p11_desmontagem","10 · Desmontagem / Check-out")

def sec_embalagem():
    p=Page(); p.y=TOP+P(4); p.sectiontitle("11","Embalagem — arquitectura")
    p.para("Sequência de protecção recomendada (boas práticas de conservação). Nunca plástico-bolha directamente contra a impressão em contacto prolongado.")
    # diagrama de camadas
    layers=["Painel (superfície impressa)","Camada lisa de protecção (ex.: Tyvek / não-tecido PP-PE / espuma PE fina)","Separador rígido entre painéis (placa alveolar PP, ex.: Correx/Coroplast)","Amortecimento (plástico-bolha — bolhas para FORA)","Protecção de cantos e bordos","Placas rígidas exteriores (sanduíche, maiores que o painel)","Envelope exterior reutilizável"]
    lx=MX; lw=CW; lh=P(9.5); ly=p.y
    for i,t in enumerate(layers):
        yy=ly+i*(lh+P(2))
        p.rect(lx,yy,lw,lh, CAMPO if i%2==0 else MARF, HAIR,1)
        p.rect(lx,yy,P(1.2),lh, RED if i==0 else KEY)
        p.text(lx+P(4),yy+P(2.1),f"{i+1}.","u",PT(8.5),RED,"l",wt=700)
        p.text(lx+P(12),yy+P(2.1),t,"s",PT(9.2),INK7,"l")
    p.y=ly+len(layers)*(lh+P(2))+P(4)
    p.eyebrow("REGRAS")
    for b in ["Fita apenas na embalagem, nunca no objecto.","Separadores rígidos ligeiramente maiores do que o painel.","Guardar TODA a embalagem original durante a exposição, para a devolução."]:
        p.bullet(b)
    p.pending("Envelope exterior — MATERIAL PENDING PHYSICAL VALIDATION. Requisitos: reutilizável · resistente ao rasgo · resistente a salpicos · interior não abrasivo · fácil de abrir/fechar · dimensão suficiente para não comprimir os painéis · identificável · adequado a múltiplas itinerâncias. Não fixar PVC/têxtil/etc. sem decisão. (PVC não recomendado para acondicionamento prolongado.)")
    p.save("p12_embalagem","11 · Embalagem")

def sec_metricas():
    p=Page(); p.y=TOP+P(4); p.sectiontitle("12","Métricas e avaliação")
    p.para("O fecho do local inclui recolher métricas e concluir a avaliação do anfitrião. Use os anexos E (Métricas) e F (Avaliação em papel).")
    p.eyebrow("MÉTRICAS A RECOLHER")
    cols=["Instituição · localidade/concelho","Datas · dias aberta · horas","Visitantes totais estimados + método","Grupos · grupos escolares · participantes","Eventos associados · configuração usada","Suportes VEVOR / estruturas AAMLF / outro","Incidentes · referências de imprensa","Redes/alcance · comentários · novos contactos","Intenção de nova colaboração"]
    for b in cols: p.bullet(b)
    p.y+=P(1)
    p.eyebrow("AVALIAÇÃO DO ANFITRIÃO — OBRIGATÓRIA NO FECHO DOCUMENTAL")
    p.para("Responda online quando possível; em papel quando necessário (anexo F). O fecho DOCUMENTAL do local só é considerado completo depois da avaliação do anfitrião estar concluída, online ou em papel. A desmontagem, recolha e devolução física dos materiais NÃO dependem da avaliação.",px=PT(9.4),gap=2)
    qx=W-MX-P(26); qy=p.y
    p.qr_placeholder(qx,qy,P(26),"QR A INSERIR")
    p.text(MX,p.y,"INQUÉRITO DO ANFITRIÃO","u",PT(8),INK5,"l",wt=600,ls=PT(0.5)); p.y+=PT(8)+P(3)
    p.text(MX,p.y,"Questionário digital: em preparação","si",PT(9.2),INK5,"l"); p.y+=round(PT(9.6)*1.6)
    p.y=max(p.y, qy+P(28))
    p.save("p13_metricas","12 · Métricas e avaliação")

# --------- ANEXOS IMPRIMÍVEIS ---------
def anx_header(p,code,title):
    ANX.append((code,title,p.idx))
    p.text(MX,p.y,f"ANEXO {code}","u",PT(9),RED,"l",wt=700,ls=PT(0.8)); p.text(W-MX,p.y,"IMPRIMÍVEL · A4","u",PT(7.5),INK5,"r",wt=600)
    p.y+=PT(9)+P(2); p.text(MX,p.y,title,"d",PT(15),INK,"l",wt=600); p.y+=round(PT(15)*1.1)+P(3); p.line(MX,p.y,W-MX,p.y,RED,2); p.y+=P(4)

def anx_recepcao():
    p=Page(running="Manual do Expositor — Anexo A"); p.y=TOP+P(2); anx_header(p,"A","Checklist de recepção")
    half=(CW-P(8))/2; y0=p.y
    p.field("Instituição / local",x=MX,w=half); yA=p.y; p.y=y0; p.field("Responsável",x=MX+half+P(8),w=half); p.y=max(yA,p.y)
    y0=p.y; p.field("Data",x=MX,w=half); yA=p.y; p.y=y0; p.field("Hora",x=MX+half+P(8),w=half); p.y=max(yA,p.y)
    p.eyebrow("ANTES DE ABRIR")
    for b in ["Fotografar volumes fechados, antes de abrir.","Verificar rasgos / amassados / humidade / violação."]: p.check(b)
    p.eyebrow("INVENTÁRIO — marcar por item")
    items=[f"Q{i}" for i in range(1,13)]+[f"S{i}" for i in range(1,7)]
    colw=(CW-P(8))/2; y0b=p.y
    for col in range(2):
        cx=MX+col*(colw+P(8)); block=items[col*9:col*9+9]; yy=y0b
        for it in block:
            p.text(cx,yy,it,"u",PT(9),RED,"l",wt=700); p.iboxes(cx+P(13),yy,["OK","OBS","DANO"],PT(8.6))
            yy+=round(PT(9.6)*1.75)
    p.y=y0b+9*round(PT(9.6)*1.75)+P(2)
    p.para("«Foto nº» só para itens OBS/DANO ou marca preexistente relevante — não é necessária fotografia individual dos itens OK. Inspeccionar cada painel: frente · verso · 4 cantos · 4 bordos.",px=PT(8.4),gap=3)
    p.eyebrow("REGISTO DE OBSERVAÇÕES / DANOS")
    c1=MX; c2=MX+P(22); c3=MX+P(78); tr=MX+CW
    p.text(c1,p.y,"Item","u",PT(7.5),INK5,"l",wt=600); p.text(c2,p.y,"Foto(s) / ficheiro","u",PT(7.5),INK5,"l",wt=600); p.text(c3,p.y,"Observação","u",PT(7.5),INK5,"l",wt=600)
    hy=p.y+PT(7.5)+P(2); p.line(c1,hy,tr,hy,INK3,1); ry0=hy+P(2)
    for i in range(4): p.line(c1,ry0+i*P(8.5)+P(7),tr,ry0+i*P(8.5)+P(7),INK3,1)
    ry1=ry0+4*P(8.5)+P(7); p.line(c2-P(2),hy,c2-P(2),ry1,HAIR,1); p.line(c3-P(2),hy,c3-P(2),ry1,HAIR,1)
    p.y=ry1+P(4)
    p.eyebrow("DOCUMENTAÇÃO")
    for b in ["Fotografias dos volumes fechados realizadas.","OBS/DANO fotografados.","Enviado imediatamente ao Projecto (a78190@ualg.pt), quando aplicável."]: p.check(b)
    p.field("Material recebido e conferido por (assinatura / data)",w=CW)
    p.save("a01_anexo_recepcao","Anexo A · Recepção")

def anx_montagem():
    p=Page(running="Manual do Expositor — Anexo B"); p.y=TOP+P(2); anx_header(p,"B","Checklist de montagem")
    for b in ["Área limpa, iluminada, sem público.","Piso firme, plano e nivelado.","Circulação livre.","Equipa mínima adequada (2 pessoas).","Suportes S1–S6 montados antes dos painéis.","Peças apertadas / bloqueadas; altura ajustada.","Sequência Q1–Q12 conforme percurso.","Estabilidade confirmada; sem deformação.","Nenhum painel perfurado.","Nenhuma fita/cola na superfície impressa.","Fotografia final da exposição montada.","Fotografia geral enviada ao Projecto (a78190@ualg.pt)."]:
        p.check(b)
    p.field("Observações",w=CW); p.field("Montado por (assinatura / data)",w=CW)
    p.save("a02_anexo_montagem","Anexo B · Montagem")

def anx_dano():
    p=Page(running="Manual do Expositor — Anexo C"); p.y=TOP+P(2); anx_header(p,"C","Ficha de ocorrência / dano")
    half=(CW-P(8))/2; y0=p.y
    p.field("Data / hora",x=MX,w=half); yA=p.y; p.y=y0; p.field("Instituição",x=MX+half+P(8),w=half); p.y=max(yA,p.y)
    y0=p.y; p.field("Responsável",x=MX,w=half); yA=p.y; p.y=y0; p.field("Painel Q# / Suporte S#",x=MX+half+P(8),w=half); p.y=max(yA,p.y)
    p.field("Local / circunstâncias",w=CW)
    p.field("Descrição do dano",w=CW); p.y+=P(6); p.line(MX,p.y,W-MX,p.y,INK3,1); p.y+=P(8); p.line(MX,p.y,W-MX,p.y,INK3,1); p.y+=P(8)
    p.field("Fotografias (nº)",w=CW)
    p.eyebrow("RISCO ACTUAL")
    p.iboxes(MX,p.y,["Baixo","Médio","Alto","Risco de queda"],PT(9.4)); p.y+=round(PT(9.6)*1.9)
    p.field("Acção tomada",w=CW)
    p.callout("NÃO","Não colar · não limpar · não retocar · não furar · não endireitar · não fechar molhado em plástico. Contactar o Projecto antes de intervir.",CAMPO2)
    p.eyebrow("ENVIO")
    p.iboxes(MX,p.y,["Ficha enviada","Fotografias anexadas"],PT(9.2)); p.y+=round(PT(9.6)*1.9)
    p.field("Data / hora do envio",w=(CW-P(8))/2)
    p.text(MX,p.y,"Enviar para: a78190@ualg.pt","s",PT(9),INK7,"l"); addlink(p.idx,MX,p.y,MX+p.tw("Enviar para: a78190@ualg.pt","s",PT(9)),p.y+PT(9),"mailto:a78190@ualg.pt"); p.y+=round(PT(9)*1.5)
    p.text(MX,p.y,"CC AAMLF quando aplicável: museu.lyceu@aejdfaro.pt","s",PT(9),INK5,"l"); p.y+=round(PT(9)*1.4)
    p.save("a03_anexo_dano","Anexo C · Ocorrência/Dano")

def anx_desmontagem():
    p=Page(running="Manual do Expositor — Anexo D"); p.y=TOP+P(2); anx_header(p,"D","Checklist de desmontagem / devolução")
    for b in ["Fotografar a exposição antes de desmontar.","Conferir Q1–Q12 (OK / observação / dano).","Verificar condição e registar alterações.","Desmontar S1–S6; conferir e separar componentes.","Reembalar na ordem/embalagem original.","Fotografar volumes fechados.","Identificar volumes e destino.","Fotografias finais realizadas.","Fotografias dos volumes reembalados realizadas.","Documentação de saída enviada ao Projecto (a78190@ualg.pt)."]:
        p.check(b)
    p.eyebrow("CONFERÊNCIA FINAL — marcar por item")
    items=[f"Q{i}" for i in range(1,13)]+[f"S{i}" for i in range(1,7)]
    colw=(CW-P(8))/2; y0b=p.y
    for col in range(2):
        cx=MX+col*(colw+P(8)); block=items[col*9:col*9+9]; yy=y0b
        for it in block:
            p.text(cx,yy,it,"u",PT(9),RED,"l",wt=700); p.iboxes(cx+P(13),yy,["OK","OBS","DANO"],PT(8.6)); yy+=round(PT(9.6)*1.7)
    p.y=y0b+9*round(PT(9.6)*1.7)+P(2)
    p.field("Check-out concluído por (assinatura / data)",w=CW)
    p.save("a04_anexo_desmontagem","Anexo D · Desmontagem")

def anx_metricas():
    p=Page(running="Manual do Expositor — Anexo E"); p.y=TOP+P(2); anx_header(p,"E","Ficha de métricas")
    half=(CW-P(8))/2
    for lab in ["Instituição","Localidade / concelho","Datas da exposição","Dias efectivos aberta","Horas de funcionamento","Visitantes totais estimados","Método de contagem","Nº de grupos","Nº de grupos escolares","Participantes em actividades","Eventos associados","Configuração utilizada (VEVOR / AAMLF / outra)","Incidentes","Referências de imprensa","Redes sociais / alcance (se disponível)","Pedidos de informação / novos contactos","Intenção de nova colaboração"]:
        p.field(lab,w=CW)
    p.save("a05_anexo_metricas","Anexo E · Métricas")

def anx_avaliacao():
    p=Page(running="Manual do Expositor — Anexo F"); p.y=TOP+P(2); anx_header(p,"F","Avaliação do anfitrião (papel)")
    half=(CW-P(8))/2; y0=p.y
    p.field("Instituição",x=MX,w=half); yA=p.y; p.y=y0; p.field("Responsável",x=MX+half+P(8),w=half); p.y=max(yA,p.y)
    y0=p.y; p.field("Datas",x=MX,w=half); yA=p.y; p.y=y0; p.field("Nº estimado de visitantes",x=MX+half+P(8),w=half); p.y=max(yA,p.y)
    p.eyebrow("CLASSIFIQUE (1 = fraco · 5 = excelente · N/A = não aplicável)")
    for lab in ["Clareza do Manual","Facilidade de montagem","Adequação do sistema de montagem utilizado","Acondicionamento / embalagem","Adaptação ao espaço","Recepção pelo público"]:
        p.text(MX,p.y,lab,"s",PT(9.2),INK7,"l"); p.iboxes(W-MX-P(60),p.y,["1","2","3","4","5","N/A"],PT(8.8),P(2.4)); p.y+=round(PT(9.6)*1.85)
    p.y+=P(1)
    p.text(MX,p.y,"Ocorreu dano/incidente?","s",PT(9.4),INK7,"l"); p.iboxes(MX+P(52),p.y,["Sim","Não"],PT(9.4)); p.y+=round(PT(9.6)*1.8)
    p.field("O que funcionou melhor?",w=CW); p.field("O que deve ser melhorado?",w=CW)
    p.text(MX,p.y,"Voltaria a acolher?","s",PT(9.4),INK7,"l"); p.iboxes(MX+P(40),p.y,["Sim","Talvez","Não"],PT(9.4)); p.y+=round(PT(9.6)*1.8)
    p.field("Recomendaria a exposição? (0–10)",w=half)
    p.para("Se preenchida em papel, devolva esta ficha com a documentação de encerramento ou envie fotografia/digitalização para a78190@ualg.pt.",px=PT(8.5),gap=2)
    p.text(MX,p.y,"a78190@ualg.pt","sm",PT(9),RED,"l",wt=500); addlink(p.idx,MX,p.y,MX+p.tw("a78190@ualg.pt","sm",PT(9),500),p.y+PT(9),"mailto:a78190@ualg.pt"); p.y+=round(PT(9)*1.5)
    p.save("a06_anexo_avaliacao","Anexo F · Avaliação (papel)")

def anx_fecho():
    p=Page(running="Manual do Expositor — Anexo G"); p.y=TOP+P(2); anx_header(p,"G","Checklist final — fecho do local")
    for b in ["Métricas registadas (anexo E).","Check-out concluído (anexo D).","Q1–Q12 conferidos.","S1–S6 conferidos.","Ocorrências reportadas (se houver, anexo C).","Fotografias finais realizadas.","Material reembalado (embalagem original).","Devolução / recolha acordada.","Documentação final enviada ao Projecto.","Fotografias obrigatórias enviadas.","Ficha de métricas enviada.","Avaliação enviada (online ou em papel)."]:
        p.check(b)
    p.eyebrow("MODO DE ENTREGA DA DOCUMENTAÇÃO")
    p.iboxes(MX,p.y,["E-mail","Online/upload (quando disponível)","Papel"],PT(9.4)); p.y+=round(PT(9.6)*1.9)
    p.callout("A AVALIAÇÃO FAZ PARTE DO FECHO DOCUMENTAL","O fecho DOCUMENTAL do local só é completo depois da avaliação do anfitrião estar concluída (online ou em papel). A desmontagem, recolha e devolução física dos materiais NÃO dependem da avaliação.")
    p.field("Fecho confirmado por (assinatura / data)",w=CW)
    p.logoband(MX,H-P(24),P(6.5))
    p.save("a07_anexo_fecho","Anexo G · Fecho do local")

def render_index():
    pidx=PAGES.index("p01_indice")
    im=Image.new("RGB",(W,H),MARF); d=ImageDraw.Draw(im)
    def T(x,y,t,k,px,fill=INK,a="l",wt=None,ls=0):
        ft=font(k,px,wt)
        if ls and a=="l":
            cx=x
            for ch in t: d.text((cx,y),ch,font=ft,fill=fill,anchor="la");cx+=d.textlength(ch,font=ft)+ls
        else: d.text((x,y),t,font=ft,fill=fill,anchor={"l":"la","m":"ma","r":"ra"}[a])
    T(MX,P(10),"Manual do Expositor","u",PT(6.5),INK5,ls=PT(0.4))
    uw=d.textlength("projectomilreu.pt",font=font("u",PT(6.5))); T(W-MX,P(10),"projectomilreu.pt","u",PT(6.5),INK5,"r")
    d.line([(MX,P(14.5)),(W-MX,P(14.5))],fill=HAIR,width=1)
    LINKS[pidx]=[(W-MX-uw,P(10),W-MX,P(10)+PT(6.5),QURL)]  # running URL; depois juntam-se os DEST
    y=TOP+P(6)
    T(MX,y,"ÍNDICE","u",PT(8),RED,wt=600,ls=PT(0.9)); y+=P(5)+PT(8)
    T(MX,y,"Secções","d",PT(13),INK,wt=600); y+=round(PT(13)*1.1)+P(5)
    def row(code,title,pi):
        nonlocal y; pageno=pi+1
        T(MX,y,code,"u",PT(9.5),RED,wt=700); T(MX+P(11),y,title,"s",PT(10.8),INK)
        T(W-MX,y,str(pageno),"u",PT(9.5),INK5,"r",wt=600)
        addlink(pidx,MX,y-P(1),W-MX,y+PT(10.8)+P(1),("DEST",pi)); y+=round(PT(10.8)*1.8)
    for num,title,pi in TOC: row(num,title,pi)
    y+=P(4); T(MX,y,"Anexos imprimíveis","d",PT(13),INK,wt=600); y+=round(PT(13)*1.1)+P(5)
    for code,title,pi in ANX: row(code,title,pi)
    d.line([(MX,BOT),(W-MX,BOT)],fill=HAIR,width=1)
    T(MX,BOT+P(2),"Índice","u",PT(6.5),INK5); T(W-MX,BOT+P(2),str(pidx+1),"u",PT(7.5),INK5,"r",wt=600)
    im.save(f"{PG}/p01_indice.png")

# build order
p_capa(); p_indice()
sec_antes(); sec_receber(); sec_checkin(); sec_armazenamento(); sec_montagem(); sec_percurso()
sec_aamlf(); sec_durante(); sec_danos(); sec_desmontagem(); sec_embalagem(); sec_metricas()
anx_recepcao(); anx_montagem(); anx_dano(); anx_desmontagem(); anx_metricas(); anx_avaliacao(); anx_fecho()
render_index()  # 2.º passo: índice clicável com TOC + anexos + páginas reais

# contact sheet (prancha)
ims=[Image.open(f"{PG}/{n}.png") for n in PAGES]
cols=5; rows=(len(ims)+cols-1)//cols; th=520; tw=round(th*W/H); padp=16
sheet=Image.new("RGB",(cols*tw+(cols+1)*padp, rows*(th+34)+padp),(238,232,222)); dd=ImageDraw.Draw(sheet)
for i,(nm,im) in enumerate(zip(PAGES,ims)):
    r,c=divmod(i,cols); x=padp+c*(tw+padp); y=padp+r*(th+34)
    sheet.paste(im.resize((tw,th)),(x,y)); dd.text((x,y+th+6),f"{i+1:02d} {nm}",fill=(60,54,48),font=font("u",15))
sheet.save(f"{OUT}/_PRANCHA_manual.png")
# crops obrigatórios (secção 19) — página inteira para auditoria de sobreposição
nameidx={n:i for i,n in enumerate(PAGES)}
for cn,key in [("01_capa","p00_capa"),("03_antes","p02_antes"),("05_recepcao","p04_checkin"),
               ("08_percurso","p07_percurso"),("11_danos","p10_danos"),("14_metricas","p13_metricas"),
               ("15_anexoA_recepcao","a01_anexo_recepcao"),("17_anexoC_ocorrencia","a03_anexo_dano"),
               ("20_anexoF_avaliacao","a06_anexo_avaliacao"),("21_anexoG_fecho","a07_anexo_fecho")]:
    if key in nameidx: Image.open(f"{PG}/{key}.png").save(f"{OUT}/crop_{cn}.png")
# TOC + links + ordem
json.dump({"dpi":DPI,"page_px":[W,H],"pages":PAGES,"toc":TOC,"links":LINKS,"running":"Manual do Expositor · Entre Ruínas e Memórias"},
          open(f"{OUT}/_manual_meta.json","w"),ensure_ascii=False,indent=1)
print("OK manual:",len(PAGES),"páginas @",DPI,"dpi | TOC",len(TOC),"secções | links",{k:len(v) for k,v in LINKS.items()})
