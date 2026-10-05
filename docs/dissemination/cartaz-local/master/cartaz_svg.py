#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar RIGHTS.md.
# Item 8 — gera o SVG FINAL (template de placeholder) do cartaz local, na pasta cartaz-local/.
# Estrutura "como temos feito": base fixa (imagem+identidade+QR+rodapé institucional) EMBEBIDA como raster,
# e os CAMPOS LOCAIS editáveis como VETOR-TEXTO vivo (placeholders [ ... ]) sobre espaços reservados.
# NÃO é export final de produção (tem placeholders): o export final de impressão continua a ser feito pelo
# gerador com final=True (guarda que bloqueia placeholders). Ver MODELO_PROMPT_NOVO_CARTAZ.md.
import os, io, base64, html
import cartaz_local_generator as G
from PIL import Image

HERE=os.path.dirname(os.path.abspath(__file__))
OUT=os.path.join(HERE,"..")  # cartaz-local/ (mesma pasta do MODELO_PROMPT_NOVO_CARTAZ.md)

# campos TEMPLATE (placeholders explícitos — não são dados fictícios)
TPL=dict(G.DEMO)
TPL.update(NOME_DO_LOCAL="[ NOME DO LOCAL ]", CIDADE_LOCALIDADE="[ Cidade · Região ]",
           DATA_INICIO="[ DATA INÍCIO ]", DATA_FIM="[ DATA FIM ]",
           HORARIO="[ dias · horário ]", MORADA="[ morada completa ]",
           ENTRADA_CONDICOES="[ entrada / condições ]",
           CREDITO_IMAGEM="Fotografia: [ crédito obrigatório da imagem ]")

FAM={"d":"Fraunces","di":"Fraunces","s":"Spectral","sm":"Spectral","si":"Spectral","u":"Archivo"}
ITAL={"di","si"}
def _style(k,wt):
    fam=FAM[k]; st=['font-family="%s"'%fam]
    if k in ITAL: st.append('font-style="italic"')
    if wt: st.append('font-weight="%d"'%wt)
    elif k=="sm": st.append('font-weight="500"')
    return " ".join(st)
ANCH={"l":"start","m":"middle","r":"end"}
def _rgb(c): return "#%02X%02X%02X"%c

def build(TW,TH,outname,dpi=200):
    os.environ["ITEM8_DPI"]=str(dpi)
    import importlib; importlib.reload(G)  # aplica DPI
    G.SVG_CAPTURE=True  # liga a captura dos campos locais (opt-in)
    G.LAYOUT.clear()
    f=G.render(TW,TH,TPL,"_svg_base_%s"%outname,demo=False,final=False)  # base com campos locais invisíveis
    base=f.im; Wp,Hp=base.size
    bb=io.BytesIO(); base.convert("RGB").save(bb,"JPEG",quality=90)
    b64=base64.b64encode(bb.getvalue()).decode()
    T=[f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
       f'width="{Wp}" height="{Hp}" viewBox="0 0 {Wp} {Hp}">',
       f'<image x="0" y="0" width="{Wp}" height="{Hp}" xlink:href="data:image/jpeg;base64,{b64}"/>',
       '<g id="campos-locais-editaveis">']
    for (x,y,t,k,px,fill,a,wt,ls) in G.LAYOUT:
        attrs=_style(k,wt)
        lsa=f' letter-spacing="{ls:.2f}"' if ls else ""
        yb=y+round(px*0.80)  # topo (PIL "la") -> baseline alfabética (ascent ~0.80·px)
        T.append(f'<text x="{x:.1f}" y="{yb:.1f}" '
                 f'text-anchor="{ANCH[a]}" font-size="{px}" fill="{_rgb(fill)}" {attrs}{lsa}>'
                 f'{html.escape(t)}</text>')
    T.append('</g></svg>')
    svg="\n".join(T)
    p=os.path.join(OUT,outname); open(p,"w",encoding="utf-8").write(svg)
    # limpa base temporária
    tmp=os.path.join(G.OUTP,"_svg_base_%s.png"%outname)
    if os.path.exists(tmp): os.remove(tmp)
    return p, len(svg), (Wp,Hp), len(G.LAYOUT)

if __name__=="__main__":
    for TW,TH,name in [(297,420,"cartaz_local_TEMPLATE_A3.svg"),(210,297,"cartaz_local_TEMPLATE_A4.svg")]:
        p,n,sz,nf=build(TW,TH,name)
        print(f"{name}: {n//1024}KB  {sz}  campos_vivos={nf}  -> {p}")
