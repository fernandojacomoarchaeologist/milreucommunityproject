# -*- coding: utf-8 -*-
# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar RIGHTS.md.
# FONTE DE EDITORAÇÃO CANÓNICA — Item 3 (Orçamento impressora 3D · Circuito Educativo).
# Regenera as 8 páginas do PDF vFinal com a identificação administrativa MSF 2026. Dados/preços INALTERADOS.
# Caminho portável: calcula a raiz do repositório a partir da localização deste ficheiro.
import os as _os
def _repo_root(p):
    p=_os.path.abspath(p)
    while p!="/" and not _os.path.exists(_os.path.join(p,"CLAUDE.md")): p=_os.path.dirname(p)
    return p
_REPO=_repo_root(_os.path.dirname(__file__))
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Orçamento impressora 3D — vFinal (consulta 2026-10-01). A4 multipágina, DS Milreu.
Recomendação: Adventurer 5M + enclosure (candidata principal) · Kobra S1 Combo (alternativa técnica)."""
import os
from PIL import Image, ImageDraw, ImageFont
OUT=_os.path.join(_REPO,"docs","procurement","orcamento-impressora-3d")
DPI=200; MM=DPI/25.4
W,H=round(210*MM),round(297*MM)
def P(pt): return max(6,round(pt*DPI/72))
FP=os.path.expanduser("~/Library/Fonts/")
FONTS={"d":"Fraunces.ttf","di":"Fraunces-Italic.ttf","s":"Spectral-Regular.ttf","sm":"Spectral-Medium.ttf","si":"Spectral-Italic.ttf","u":"Archivo.ttf"}
_fc={}
def fnt(c,pt):
    k=(c,pt)
    if k not in _fc: _fc[k]=ImageFont.truetype(FP+FONTS[c],P(pt))
    return _fc[k]
MARF=(255,252,247); CAMPO=(251,246,238); INK=(30,26,23); INK7=(69,61,54); INK5=(118,109,100); INK3=(181,170,155)
RED=(168,50,39); KEY=(176,164,145); HAIR=(230,220,201); GREEN=(64,84,74); BROWN=(98,70,45)
GBG=(227,237,229); GTX=(46,74,56); ABG=(244,233,208); ATX=(122,90,30); RBG=(244,226,224)
MX=round(16*MM)
pages=[]
def newpage():
    im=Image.new("RGB",(W,H),MARF); return im,ImageDraw.Draw(im)
def tw(d,s,c,pt): return d.textlength(s,font=fnt(c,pt))
def txt(d,x,y,s,c,pt,fill=INK,anchor="la",ls=0):
    f=fnt(c,pt)
    if ls:
        cx=x
        for ch in s:
            d.text((cx,y),ch,font=f,fill=fill,anchor="la"); cx+=d.textlength(ch,font=f)+ls
    else:
        d.text((x,y),s,font=f,fill=fill,anchor=anchor)
def wrap(d,s,c,pt,maxw):
    out=[]
    for para in s.split("\n"):
        line=""
        for w in para.split():
            t=(line+" "+w).strip()
            if tw(d,t,c,pt)<=maxw or not line: line=t
            else: out.append(line); line=w
        out.append(line)
    return out
def para(d,x,y,s,p1,p2=None,p3=None,p4=None,lh=1.42):
    # A) para(d,x,y,s,maxw,[fill],[lh])        -> p1=maxw(int)
    # B) para(d,x,y,s,font,pt,maxw,[fill],[lh]) -> p1=font(str)
    if isinstance(p1,str):
        font,pt,maxw=p1,p2,p3; fill=p4 if p4 is not None else INK7
    else:
        maxw=p1; font,pt="s",10.5; fill=p2 if p2 is not None else INK7
        if p3 is not None: lh=p3
    for ln in wrap(d,s,font,pt,maxw):
        d.text((x,y),ln,font=fnt(font,pt),fill=fill); y+=round(P(pt)*lh)
    return y
def rect(d,x,y,w,h,fill=None,outline=None,ow=1):
    d.rectangle([x,y,x+w,y+h],fill=fill,outline=outline,width=ow)
def line(d,x1,y1,x2,y2,fill=KEY,wdt=1):
    d.line([(x1,y1),(x2,y2)],fill=fill,width=wdt)
def chip(d,x,y,w,label,c,bg,tx_,pt=9.5):
    rect(d,x,y,w,round(P(pt)*1.9),fill=bg); txt(d,x+8,y+round(P(pt)*0.42),label,"sm",pt,tx_)

def header(d,n,title):
    txt(d,MX,round(14*MM),"PROJECTO COMUNITÁRIO DE MILREU / MUSEUS SEM FRONTEIRAS","u",8,RED,ls=round(1.2*MM/10))
    line(d,MX,round(20*MM),MX+round(42*MM),round(20*MM),RED,round(0.6*MM))
    txt(d,W-MX,round(14*MM),f"{n} / 8","u",8.5,INK5,anchor="ra")
    txt(d,MX,round(24*MM),title,"d",19,INK)
    line(d,MX,round(34*MM),W-MX,round(34*MM),HAIR,1)
def footer(d):
    y=H-round(12*MM)
    line(d,MX,y-round(4*MM),W-MX,y-round(4*MM),HAIR,1)
    txt(d,MX,y,"© 2026 Fernando Rodrigues de Jácomo · Projecto Comunitário de Milreu · Consulta de mercado · versão final 2026-10-01 · não é adjudicação","u",7.2,INK3)

def table(d,x,y,headers,rows,widths,pt=9.5,hpt=8.5,rowh=None):
    rowh=rowh or round(P(pt)*2.0)
    cx=x
    # header
    rect(d,x,y,sum(widths),round(P(hpt)*1.9),fill=CAMPO)
    for h,w in zip(headers,widths):
        txt(d,cx+8,y+round(P(hpt)*0.42),h,"u",hpt,INK7); cx+=w
    y+=round(P(hpt)*1.9)
    for r in rows:
        cx=x
        maxlines=1
        cell_lines=[]
        for val,w in zip(r,widths):
            style="s"; col=INK7
            if isinstance(val,tuple): val,style,col=val
            lines=wrap(d,str(val),style,pt,w-14)
            cell_lines.append((lines,style,col)); maxlines=max(maxlines,len(lines))
        rh=max(rowh, round(P(pt)*1.42)*maxlines+round(P(pt)*0.7))
        for (lines,style,col),w in zip(cell_lines,widths):
            yy=y+round(P(pt)*0.42)
            for ln in lines:
                txt(d,cx+8,yy,ln,style,pt,col); yy+=round(P(pt)*1.42)
            cx+=w
        line(d,x,y+rh,x+sum(widths),y+rh,HAIR,1)
        y+=rh
    return y

# ---------------- PÁGINA 1 ----------------
im,d=newpage()
txt(d,MX,round(14*MM),"PROJECTO COMUNITÁRIO DE MILREU / MUSEUS SEM FRONTEIRAS","u",8,RED,ls=round(1.2*MM/10))
line(d,MX,round(20*MM),MX+round(42*MM),round(20*MM),RED,round(0.6*MM))
txt(d,W-MX,round(14*MM),"1 / 8","u",8.5,INK5,anchor="ra")
y=round(28*MM)
for ln in wrap(d,"Orçamento comparativo — equipamento e consumíveis de impressão 3D","d",26,W-2*MX):
    d.text((MX,y),ln,font=fnt("d",26),fill=INK); y+=round(P(26)*1.12)
y+=round(2*MM)
txt(d,MX,y,"Iniciativas 2026 — Museu itinerante «Entre Ruínas e Memórias» · Circuito Educativo","si",12.5,INK7); y+=round(7*MM)
chip(d,MX,y,round(92*MM),"CONSULTA DE MERCADO · VERSÃO FINAL · 2026-10-01","sm",CAMPO,INK7,9); y+=round(12*MM)
txt(d,MX,y,"Objectivo","d",15,INK); y+=round(8*MM)
y=para(d,MX,y,"Aquisição de uma impressora 3D (FDM) e consumíveis para o Circuito Educativo de Milreu — oficinas de escavação simulada, estratigrafia e mosaicos para crianças e adolescentes. Ambiente doméstico com animais: a caixa de protecção (enclosure) é requisito de segurança. A aquisição é avaliada por critérios de equipamento, consumíveis, custo entregue e disponibilidade — nunca apenas pelo preço.",W-2*MX,INK7); y+=round(6*MM)
txt(d,MX,y,"Requisitos e regras da consulta","d",15,INK); y+=round(8*MM)
for b in ["Enclosure (caixa de protecção) obrigatório — ambiente com animais; a configuração só é conforme com enclosure.",
          "Três cotações comerciais por cada modelo exacto, cada uma com data e método de consulta; em empate de critérios, prevalece o menor valor.",
          "Quatro bobinas de PLA 1,75 mm · 1 kg: terracota/laranja, cinzento, branco/natural, preto.",
          "Portes nunca a zero por inferência; sem total entregue exacto enquanto houver portes por confirmar.",
          "Facturação com NIF institucional (AAMLF / Museu do Lyceu de Faro) — essencial, a confirmar por fornecedor.",
          "Limite de execução do gasto até 10 de Outubro de 2026 — produtos sem stock imediato consideram-se indisponíveis."]:
    d.ellipse([MX+2,y+P(10)*0.5,MX+2+P(5),y+P(10)*0.5+P(5)],fill=RED)
    y=para(d,MX+round(5*MM),y,b,"s",10.5,W-2*MX-round(5*MM),INK7)+round(1.5*MM)
y+=round(4*MM)
rect(d,MX,y,W-2*MX,round(36*MM),fill=CAMPO)
txt(d,MX+round(5*MM),y+round(4*MM),"Direcção (recomendação desta consulta)","d",12.5,INK)
para(d,MX+round(5*MM),y+round(12*MM),"Candidata principal: Adventurer 5M + enclosure oficial (melhor custo entregue, três cotações activas, baixa manutenção). Alternativa técnica: Anycubic Kobra S1 Combo (enclosure de fábrica + multicolor numa só compra). Alternativa fechada de fábrica: Adventurer 5M Pro. Bambu A1 Combo: referência de mercado, excluída pelo requisito de enclosure.",W-2*MX-round(10*MM),INK7,1.4)
footer(d); pages.append(im)

# ---------------- PÁGINA 2 — comparação técnica ----------------
im,d=newpage(); header(d,2,"Comparação técnica das configurações")
y=round(42*MM)
hdr=["Configuração","Enclosure","Multicolor","Preço base (mín.)","Estado"]
ws=[round(44*MM),round(30*MM),round(24*MM),round(36*MM),round(44*MM)]
rows=[
 [("Kobra S1 Combo","sm",INK),("de fábrica","s",GTX),("Sim (ACE Pro)","s",GTX),"466,59 € (Amazon.es)",("Alternativa técnica","s",INK7)],
 [("Adventurer 5M","sm",INK),("kit oficial","s",INK7),("Não","s",INK5),"249 € + 39,99 € enclosure",("Candidata principal","s",GTX)],
 [("Adventurer 5M Pro","sm",INK),("de fábrica","s",GTX),("Não","s",INK5),"399,00 € (Flashforge EU)",("Alternativa fechada","s",INK7)],
 [("AD5X","sm",INK),("a confirmar","s",ATX),("Sim","s",GTX),"349,00 € (Amazon.es)",("Referência","s",INK5)],
 [("Bambu A1 Combo","sm",INK),("não disp.","s",RED),("Sim","s",GTX),"—",("NÃO CUMPRE (enclosure)","s",RED)],
]
y=table(d,MX,y,hdr,rows,ws,pt=9.5)+round(6*MM)
para(d,MX,y,"O enclosure é o critério de segurança decisivo (ambiente com animais): a Kobra S1 Combo e a 5M Pro são fechadas de fábrica; a Adventurer 5M requer o kit oficial; o AD5X tem janela de visão e a necessidade/compatibilidade de enclosure fica a confirmar; a Bambu A1 Combo não cumpre e aparece apenas como referência de mercado. O multicolor amplia possibilidades didácticas na representação de estratigrafia e mosaicos.",W-2*MX,INK7)
footer(d); pages.append(im)

# ---------------- PÁGINA 3 — 3 cotações: Kobra + 5M ----------------
im,d=newpage(); header(d,3,"Três cotações — Kobra S1 Combo e Adventurer 5M")
y=round(42*MM)
txt(d,MX,y,"Anycubic Kobra S1 Combo","d",13,INK); y+=round(8*MM)
ws=[round(52*MM),round(30*MM),round(34*MM),round(32*MM),round(30*MM)]
rows=[
 [("Amazon.es (AnycubicDirect ES)","sm",INK),("466,59 €","sm",INK),("Grátis","s",GTX),("Em stock","s",GTX),"página"],
 ["Anycubic EU (loja oficial)","379,00 €",("«Free Express»","s",INK5),("Indisponível","s",RED),"carrinho"],
 ["PcComponentes.pt / Worten","—","—",("Não listam","s",INK5),"busca"],
]
y=table(d,MX,y,["Fornecedor","Preço","Portes 3220-172","Stock","Método"],rows,ws,pt=9.3)+round(2*MM)
chip(d,MX,y,round(120*MM),"Apenas 1 cotação ACTIVA em 2026-10-01 · fonte única = risco de fornecimento","sm",RBG,RED,8.6); y+=round(9*MM)
para(d,MX,y,"A loja oficial mostra 379 € mas o produto não entra no carrinho (controlo «Notify me when back in stock»); resolvido no checkout em 2026-10-01: indisponível. Único fornecedor comprável: Amazon.es.","si",9,W-2*MX,INK5); y+=round(8*MM)
txt(d,MX,y,"Flashforge Adventurer 5M","d",13,INK); y+=round(8*MM)
rows=[
 [("Flashforge EU (loja oficial)","sm",INK),("249,00 €","sm",GTX),("a confirmar","s",ATX),("Em stock","s",GTX),"página"],
 ["Amazon.es","253,12 €",("Grátis (6 out.)","s",GTX),("Em stock","s",GTX),"página"],
 ["PcComponentes.pt","309,00 €",("Grátis","s",GTX),("Em stock","s",GTX),"página"],
]
y=table(d,MX,y,["Fornecedor","Preço","Portes 3220-172","Stock","Método"],rows,ws,pt=9.3)+round(2*MM)
chip(d,MX,y,round(90*MM),"3 cotações activas · mínimo 249,00 € (Flashforge EU)","sm",GBG,GTX,8.6)
footer(d); pages.append(im)

# ---------------- PÁGINA 4 — 3 cotações: 5M Pro + enclosure + AD5X ref ----------------
im,d=newpage(); header(d,4,"Três cotações — 5M Pro, enclosure e AD5X (referência)")
y=round(42*MM)
txt(d,MX,y,"Flashforge Adventurer 5M Pro","d",13,INK); y+=round(8*MM)
ws=[round(52*MM),round(30*MM),round(34*MM),round(32*MM),round(30*MM)]
rows=[
 [("Flashforge EU (loja oficial)","sm",INK),("399,00 €","sm",GTX),("a confirmar","s",ATX),("Em stock","s",GTX),"página"],
 ["Amazon.es","405,59 €",("Grátis (6 out.)","s",GTX),("Em stock","s",GTX),"página"],
 ["PcComponentes.pt","439,00 €",("Grátis","s",GTX),("Em stock","s",GTX),"página"],
]
y=table(d,MX,y,["Fornecedor","Preço","Portes 3220-172","Stock","Método"],rows,ws,pt=9.3)+round(2*MM)
chip(d,MX,y,round(90*MM),"3 cotações activas · mínimo 399,00 € (Flashforge EU)","sm",GBG,GTX,8.6); y+=round(9*MM)
txt(d,MX,y,"Enclosure oficial — Adventurer 5M","d",13,INK); y+=round(8*MM)
rows=[
 [("Flashforge EU","sm",INK),("39,99 €","sm",GTX),("a confirmar","s",ATX),("Em stock","s",GTX),"página"],
 ["Amazon.es (Flashforge Official)","40,65 €",("Grátis","s",GTX),("Em stock","s",GTX),"página"],
 ["(3.ª cotação)","—","—",("2 localizadas","s",INK5),"—"],
]
y=table(d,MX,y,["Fornecedor","Preço","Portes 3220-172","Stock","Método"],rows,ws,pt=9.3)+round(9*MM)
txt(d,MX,y,"AD5X — multicolor (referência)","d",13,INK); y+=round(8*MM)
rows=[
 [("Amazon.es","sm",INK),("349,00 €","sm",INK),("Grátis","s",GTX),("Em stock","s",GTX),"página"],
 ["PcComponentes.pt","472,23 €",("Grátis","s",GTX),("Em stock","s",GTX),"página"],
 ["(enclosure AD5X)","a confirmar","—",("origem/compat.","s",ATX),"—"],
]
y=table(d,MX,y,["Fornecedor","Preço","Portes 3220-172","Stock","Método"],rows,ws,pt=9.3)+round(2*MM)
para(d,MX,y,"O AD5X (multicolor, mais barato que a Kobra na Amazon.es) permanece como referência: a necessidade e a origem do enclosure (eventualmente da China, com impacto em portes/IVA/prazo) ficam por confirmar.","si",9,W-2*MX,INK5)
footer(d); pages.append(im)

# ---------------- PÁGINA 5 — filamentos ----------------
im,d=newpage(); header(d,5,"Filamentos — PLA 1,75 mm · 1 kg · quatro cores")
y=round(42*MM)
ws=[round(44*MM),round(44*MM),round(26*MM),round(28*MM),round(36*MM)]
rows=[
 [("Terracota / laranja","sm",INK),"3DJAKE ecoPLA Laranja 1 kg","20,49 €",("Disponível","s",GTX),"página"],
 [("Cinzento","sm",INK),"3DJAKE ecoPLA Cinza-escuro 1 kg","20,49 €",("Disponível","s",GTX),"página"],
 [("Branco / natural","sm",INK),"3DJAKE ecoPLA Branco 1 kg","20,49 €",("Disponível","s",GTX),"página"],
 [("Preto","sm",INK),"3DJAKE ecoPLA Preto 1 kg","20,49 €",("Disponível","s",GTX),"página"],
]
y=table(d,MX,y,["Cor","Produto","€/kg","Stock","Método"],rows,ws,pt=9.3)+round(3*MM)
chip(d,MX,y,round(120*MM),"Pacote completo (4 cores) na 3DJake ≈ 82 € · todas as cores disponíveis","sm",GBG,GTX,8.6); y+=round(10*MM)
txt(d,MX,y,"Observações","d",12.5,INK); y+=round(7*MM)
para(d,MX,y,"A 3DJake (fabricado na UE) tem as quatro cores exactas em 1 kg a 20,49 €/kg (19 €/kg no conjunto branco+preto). Portes para 3220-172 a confirmar no checkout (política de envio grátis acima de limiar, que ~82 € deverá ultrapassar). A comparação com Anycubic, Amazon.es, Mauser e RepRap PT fica como verificação adicional; nenhuma solução conta como pacote completo sem as quatro cores disponíveis.",W-2*MX,INK7)
footer(d); pages.append(im)

# ---------------- PÁGINA 6 — cenários de custo + orçamento ----------------
im,d=newpage(); header(d,6,"Cenários de custo total e enquadramento orçamental")
y=round(42*MM)
ws=[round(60*MM),round(30*MM),round(30*MM),round(32*MM)]
rows=[
 [("5M + enclosure (Flashforge EU)","sm",INK),("288,99 €","s",INK7),("~82 €","s",INK7),("~371 €","sm",GTX)],
 [("5M Pro (Flashforge EU)","sm",INK),("399,00 €","s",INK7),("~82 €","s",INK7),("~481 €","sm",INK)],
 [("Kobra S1 Combo (Amazon.es)","sm",INK),("466,59 €","s",INK7),("~82 €","s",INK7),("~549 €","sm",INK)],
]
y=table(d,MX,y,["Configuração (mais barata comprável)","Hardware","4 PLA","Total entregue*"],rows,ws,pt=9.5)+round(2*MM)
txt(d,MX,y,"* portes Flashforge EU/3DJake a confirmar no checkout; Amazon.es e PcComponentes = portes grátis confirmados na página.","si",8.5,INK5); y+=round(10*MM)
txt(d,MX,y,"Enquadramento no orçamento disponível","d",13,INK); y+=round(8*MM)
para(d,MX,y,"Orçamento total: 1.000 € · reserva para materiais gráficos: 400 € (banners ≈ 300 €, impressos ≈ 100 €, valores provisórios) · disponível para impressora + filamentos: 600 €.",W-2*MX,INK7); y+=round(4*MM)
ws=[round(60*MM),round(34*MM),round(34*MM)]
rows=[
 [("5M + enclosure + 4 PLA","sm",INK),("~371 €","s",INK7),("~229 €","sm",GTX)],
 [("5M Pro + 4 PLA","sm",INK),("~481 €","s",INK7),("~119 €","sm",INK7)],
 [("Kobra S1 Combo + 4 PLA","sm",INK),("~549 €","s",INK7),("~51 €","sm",ATX)],
]
y=table(d,MX,y,["Cenário","Custo total","Folga dos 600 €"],rows,ws,pt=9.5)+round(3*MM)
para(d,MX,y,"A 5M + enclosure deixa a maior folga (~229 €), protegendo a verba gráfica; a Kobra S1 Combo cabe mas com margem apertada (~51 €) e risco de a reserva gráfica subir. Daí a recomendação pela 5M + enclosure, com a Kobra como alternativa técnica.",W-2*MX,INK7)
footer(d); pages.append(im)

# ---------------- PÁGINA 7 — avaliação / pontuação ----------------
im,d=newpage(); header(d,7,"Avaliação final — três opções e pontuação")
y=round(42*MM)
ws=[round(58*MM),round(32*MM),round(36*MM),round(32*MM)]
def pt_(v,col): return (v,"sm",col)
rows=[
 ["NIF institucional (AAMLF) — essencial",pt_("✓ provável",GTX),pt_("✓ provável",GTX),pt_("✓ provável",GTX)],
 ["Fornecedor em Faro/Estoi",pt_("✗",INK5),pt_("✗",INK5),pt_("✗",INK5)],
 ["Enclosure nativo (de fábrica)",pt_("✗ kit",INK5),pt_("✓",GTX),pt_("✓",GTX)],
 ["Permite enclosure",pt_("✓",GTX),pt_("✓",GTX),pt_("✓",GTX)],
 ["Custo total entregue (menor)",pt_("✓ ~371 €",GTX),pt_("~549 €",INK5),pt_("~481 €",INK5)],
 ["Custo hardware (menor)",pt_("✓ 288,99 €",GTX),pt_("466,59 €",INK5),pt_("399 €",INK5)],
 ["Multicolor",pt_("✗",INK5),pt_("✓",GTX),pt_("✗",INK5)],
 ["Prazo de entrega (menor)",pt_("✓ ~poucos dias",GTX),pt_("~poucos dias",INK7),pt_("~poucos dias",INK7)],
 [("TOTAL (pontos positivos)","sm",INK),("6","d",GTX),("5","d",INK),("5","d",INK)],
]
y=table(d,MX,y,["Critério (pontua quando Sim / menor)","5M + enclosure","Kobra S1 Combo","5M Pro"],rows,ws,pt=9.2)+round(5*MM)
txt(d,MX,y,"Recomendação","d",13,INK); y+=round(8*MM)
for n,t in [("1. Adventurer 5M + enclosure — candidata principal.","Melhor custo entregue (~371 €), três cotações activas, baixa manutenção e fiabilidade; vence no critério de desempate (menor valor). Requer o kit de enclosure oficial (2.ª encomenda)."),
            ("2. Kobra S1 Combo — alternativa técnica.","Única com enclosure de fábrica + multicolor numa só compra (amplia possibilidades didácticas em estratigrafia e mosaicos). Reservas: fonte única (apenas Amazon.es; Anycubic oficial indisponível) e margem orçamental apertada (~51 €)."),
            ("3. Adventurer 5M Pro — alternativa fechada de fábrica.","Fechada de origem, fiável e simples; mono-cor e mais cara que a 5M + enclosure.")]:
    txt(d,MX,y,n,"sm",10.5,INK); y+=round(5.2*MM)
    y=para(d,MX+round(4*MM),y,t,"s",9.8,W-2*MX-round(4*MM),INK7,1.38)+round(3*MM)
footer(d); pages.append(im)

# ---------------- PÁGINA 8 — mapa qualitativo + notas ----------------
im,d=newpage(); header(d,8,"Balanço qualitativo (reviews) · notas e facturação")
y=round(42*MM)
txt(d,MX,y,"Risco · manutenção · satisfação (avaliação qualitativa, não quantitativa)","sm",10.5,INK7); y+=round(7*MM)
ws=[round(40*MM),round(42*MM),round(42*MM),round(30*MM)]
rows=[
 [("Risco de problemas","sm",INK),("Baixo","sm",GTX),("Médio","sm",ATX),("Baixo","sm",GTX)],
 [("Manutenção","sm",INK),("Baixa","sm",GTX),("Média","sm",ATX),("Baixa","sm",GTX)],
 [("Satisfação geral","sm",INK),("Boa","sm",GTX),("Boa (mista)","sm",ATX),("Boa","sm",GTX)],
 [("Nota pública","sm",INK),"reviews positivas","Amazon.es 4,0/5 (185)","positivas"],
]
y=table(d,MX,y,["Dimensão","Adventurer 5M","Kobra S1 Combo","5M Pro"],rows,ws,pt=9.3)+round(3*MM)
y=para(d,MX,y,"Menor risco/manutenção: Flashforge 5M e 5M Pro (simples, mono-cor, marca fiável). A Kobra oferece multicolor mas o sistema ACE Pro é o principal ponto de afinação; satisfação boa mas mais «mista». Factores institucionais (stock, garantia, consumíveis, enclosure, custo total, suporte europeu) pesam mais do que a nota de estrelas.",W-2*MX,INK7)+round(6*MM)
txt(d,MX,y,"Facturação / NIF e portes","d",13,INK); y+=round(7*MM)
y=para(d,MX,y,"Facturação com NIF institucional (AAMLF / Museu do Lyceu de Faro): PROVÁVEL em todos os fornecedores (Amazon.es/Amazon Business, PcComponentes, Flashforge, 3DJake), a confirmar no checkout. Portes: confirmados grátis na Amazon.es e PcComponentes; Flashforge EU e 3DJake a confirmar no checkout (não concluído — sem compra).",W-2*MX,INK7)+round(6*MM)
txt(d,MX,y,"Limitações da consulta","d",13,INK); y+=round(7*MM)
y=para(d,MX,y,"Consulta de 2026-10-01; preços e stock sujeitos a alteração e à validade de promoções. Totais entregues aproximados enquanto houver portes por confirmar. Nenhuma compra efectuada; nenhum dado bancário introduzido. Pistas não verificadas (ex.: 5M Pro ~319 € em agregador) não entram como facto.",W-2*MX,INK7)+round(6*MM)
rect(d,MX,y,W-2*MX,round(20*MM),fill=CAMPO)
txt(d,MX+round(5*MM),y+round(4*MM),"Conclusão","d",12.5,INK)
para(d,MX+round(5*MM),y+round(11*MM),"Recomenda-se a Adventurer 5M + enclosure oficial como candidata principal; a Kobra S1 Combo como alternativa técnica (multicolor + enclosure de fábrica), condicionada a stock e à reserva gráfica. Decisão de aquisição = humana.",W-2*MX-round(10*MM),INK7,1.38)
footer(d); pages.append(im)

# ---------------- salvar PDF multipágina + preview ----------------
os.makedirs(OUT,exist_ok=True)
pdf_path=f"{OUT}/Orcamento_Impressora_3D_vFinal_2026-10-01.pdf"
pages[0].save(pdf_path,"PDF",save_all=True,append_images=pages[1:],resolution=DPI)
# preview: grelha 2x4 reduzida
cols,rows_=2,4; tw_,th_=W//3,H//3
grid=Image.new("RGB",(cols*tw_+3*12,rows_*th_+5*12),(236,230,220))
for i,pg in enumerate(pages):
    t=pg.resize((tw_,th_)); gx=12+(i%cols)*(tw_+12); gy=12+(i//cols)*(th_+12); grid.paste(t,(gx,gy))
grid.save(f"{OUT}/PREVIEW_vFinal_8paginas.png")
print("PDF:",pdf_path); print("páginas:",len(pages),"| tamanho px:",W,H)
