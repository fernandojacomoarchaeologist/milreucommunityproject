#!/usr/bin/env python3
# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar RIGHTS.md.
# Produz SVG vetor-texto EDITÁVEIS (texto vivo) a partir das fontes dos geradores,
# embebendo as imagens ligadas (base64) para portabilidade. NÃO altera texto/geometria.
# Poster: também gera variante com sangria 5mm (fundo de papel estendido + translate).
# Verificado à parte: materiais reproduzem o print aprovado pixel-idêntico; poster = arte aprovada (trim).
import os, re, base64, sys, io
from PIL import Image

CAP=1800  # px no lado maior p/ imagens embebidas (visualmente pleno à escala da peça)

def clean_dup_fontweight(svg_text):
    # corrige defeito do gerador: <text ... font-weight="A" ... font-weight="B" ...> → mantém o último (B),
    # que é o que os renderers tolerantes já aplicam; apenas torna o SVG bem-formado. Não altera o render.
    def fix(m):
        tag=m.group(0); parts=re.findall(r'font-weight="[^"]*"',tag)
        if len(parts)>1:
            # remove todas menos a última ocorrência
            for p in parts[:-1]:
                tag=tag.replace(" "+p,"",1)
        return tag
    return re.sub(r'<text\b[^>]*>', fix, svg_text)

def embed(svg_text, assets_dir):
    def repl(m):
        ref=m.group(1)
        if ref.startswith("data:"): return m.group(0)
        fn=ref.split("/")[-1]; path=os.path.join(assets_dir,fn)
        if not os.path.exists(path): print("  !! FALTA asset:",path); return m.group(0)
        im=Image.open(path)
        if max(im.size)>CAP:
            k=CAP/max(im.size); im=im.resize((max(1,round(im.size[0]*k)),max(1,round(im.size[1]*k))), Image.LANCZOS)
        buf=io.BytesIO()
        if im.mode in("RGBA","LA","P") and ("A" in im.getbands()):
            im.convert("RGBA").save(buf,"PNG"); mt="image/png"
        else:
            im.convert("RGB").save(buf,"JPEG",quality=90); mt="image/jpeg"
        b=base64.b64encode(buf.getvalue()).decode()
        return f'href="data:{mt};base64,{b}"'
    return re.sub(r'href="([^"]*)"', repl, svg_text)

def add_bleed(svg_text, trim_w, trim_h, bleed, paper="#FFFCF7"):
    # outer tag -> novo viewBox trim+2*bleed; conteúdo em <g translate(bleed,bleed)>; fundo de papel a sangrar
    W=trim_w+2*bleed; H=trim_h+2*bleed
    m=re.match(r'^(<svg\b[^>]*>)(.*)(</svg>)\s*$', svg_text, re.S)
    assert m, "estrutura SVG inesperada"
    inner=m.group(2)
    head=(f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
          f'width="{W}mm" height="{H}mm" viewBox="0 0 {W} {H}">')
    bg=f'<rect x="0" y="0" width="{W}" height="{H}" fill="{paper}"/>'
    return f'{head}{bg}<g transform="translate({bleed},{bleed})">{inner}</g></svg>'

ROOT=sys.argv[1]
SCR=sys.argv[2]  # scratchpad (fontes dos materiais)
D=f"{ROOT}/docs/dissemination"

# --- POSTER ---
pdir=f"{D}/poster-congresso/editavel-vetor"; os.makedirs(pdir,exist_ok=True)
pv9=open(f"{ROOT}/docs/dissemination/poster-congresso/proof/poster_congresso_PROVA_VISUAL_v9.svg",encoding="utf-8").read()
passets=f"{ROOT}/docs/dissemination/poster-congresso/proof/assets"
pemb=clean_dup_fontweight(embed(pv9, passets))
open(f"{pdir}/poster_A0_editavel.svg","w",encoding="utf-8").write(pemb)
pbleed=add_bleed(pemb, 841, 1189, 5)
open(f"{pdir}/poster_A0_editavel_sangria5mm.svg","w",encoding="utf-8").write(pbleed)
print(f"POSTER: trim {len(pemb)//1024}KB + sangria5mm {len(pbleed)//1024}KB  (imgs embebidas)")

# --- MATERIAIS (masters A5/bookmark, já com 3mm bleed) ---
mdir=f"{D}/materiais-museu/editavel-vetor"; os.makedirs(mdir,exist_ok=True)
massets=f"{SCR}/item5_build/assets"
for src,out in [("flyer_a5_front","flyer_a5_frente_editavel"),("flyer_a5_back","flyer_a5_verso_editavel"),
                ("bookmark_front","marcador_frente_editavel"),("bookmark_back","marcador_verso_editavel")]:
    s=open(f"{SCR}/item5_build/{src}_editable.svg",encoding="utf-8").read()
    e=clean_dup_fontweight(embed(s, massets))
    open(f"{mdir}/{out}.svg","w",encoding="utf-8").write(e)
    print(f"MATERIAIS {out}.svg  {len(e)//1024}KB")
