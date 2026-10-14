# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar RIGHTS.md.
# Item 8 — TIPO CANÓNICO 1/3: CARTAZ GERAL (impressão). Ver README.md desta pasta.
# Lê o evento.json e gera A3 e A4 com sangria 3 mm: mestre RGB 300 dpi + preview + PDF/X-3 CMYK
# («Generic CMYK Profile», interino) pelo método partilhado _SOURCES_SHARED/prepress/faseb_cmyk.py.
# Uso: QRPYLIBS=<dir com qrcode> PYTHONPATH=<dir com pikepdf+reportlab> python3 cartaz_impressao.py <pasta do evento>
import os, sys
os.environ.setdefault("ITEM8_DPI","300")
HERE=os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0,HERE)
import evento_lib as L
import cartaz_gerador as gen
from PIL import Image

def gerar(pasta):
    ev=L.carregar(pasta); F=L.campos_cartaz(ev); pre=ev["prefixo_ficheiros"]
    img=L.repo_path(ev["imagem_principal"]["ficheiro"])
    OUT=L.saida(ev,"final"); gen.OUTP=OUT
    pdfs=[]
    for fmt,(w,h) in [("A3",gen.A3),("A4",gen.A4)]:
        name=f"{pre}_{fmt}"
        # guarda final=True: bloqueia placeholders e campos obrigatórios vazios
        gen.render(w,h,F,name,img=img,final=True)
        im=Image.open(os.path.join(OUT,name+".png")).convert("RGB")
        pdf=os.path.join(OUT,name+f"_PRINT_sangria3mm_{gen.DPI}dpi.pdf"); im.save(pdf,resolution=gen.DPI); pdfs.append((fmt,w,h,pdf))
        pv=im.copy(); pv.thumbnail((1400,1400)); pv.save(os.path.join(OUT,name+"_preview.png")); os.remove(os.path.join(OUT,name+".png"))
    # CMYK (PDF/X-3): o módulo partilhado corre a sua lista de trabalhos ao importar; sem ROOT válido não faz nada
    argv=sys.argv; sys.argv=[argv[0],"/nonexistent"]
    sys.path.insert(0,os.path.join(L.REPO,"docs","dissemination","_SOURCES_SHARED","prepress"))
    import faseb_cmyk as fb
    sys.argv=argv
    CM=L.saida(ev,"final","CMYK_PDFX")
    for fmt,w,h,pdf in pdfs:
        out=os.path.join(CM,f"{pre}_{fmt}_PRINTX_CMYKgenerico.pdf")
        cw,ch,ps=fb.make_pdfx(pdf,w,h,3.0,out,f"Cartaz {fmt} — Entre Ruinas e Memorias — {ev['id']} (CMYK generico)")
        print(f"OK {os.path.basename(out)} {cw:.0f}x{ch:.0f}mm trim {w}x{h} ~{ps[0]/((w+6)/25.4):.0f}dpi")

if __name__=="__main__":
    if len(sys.argv)<2: raise SystemExit("uso: python3 cartaz_impressao.py <pasta do evento>")
    gerar(sys.argv[1])
