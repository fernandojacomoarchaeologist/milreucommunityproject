# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar RIGHTS.md.
# Item 8 — ficheiro FINAL para a gráfica: PDF/X-3 CMYK a partir dos PDFs RGB aprovados (A3/A4, sangria 3 mm).
# Mesmo método de docs/dissemination/_SOURCES_SHARED/prepress/faseb_cmyk.py: sRGB -> «Generic CMYK Profile»
# (perfil INTERINO, substituível pelo ICC da gráfica), TrimBox/BleedBox + OutputIntent. Não altera a arte.
# Uso: PYTHONPATH=<dir com pikepdf+reportlab> python3 build_cmyk.py
import os, sys
HERE=os.path.dirname(os.path.abspath(__file__)); EV=os.path.dirname(HERE)
REPO=HERE
while REPO!="/" and not os.path.exists(os.path.join(REPO,"CLAUDE.md")): REPO=os.path.dirname(REPO)
sys.argv=[sys.argv[0],"/nonexistent"]  # o módulo partilhado corre a sua lista de trabalhos ao importar; sem ROOT válido não faz nada
sys.path.insert(0,os.path.join(REPO,"docs","dissemination","_SOURCES_SHARED","prepress"))
import faseb_cmyk as fb
FIN=os.path.join(EV,"final"); OUT=os.path.join(FIN,"CMYK_PDFX"); os.makedirs(OUT,exist_ok=True)
for fmt,(w,h) in [("A3",(297,420)),("A4",(210,297))]:
    src=os.path.join(FIN,f"ITEM8_Estoi_{fmt}_PRINT_sangria3mm_300dpi.pdf")
    out=os.path.join(OUT,f"ITEM8_Estoi_{fmt}_PRINTX_CMYKgenerico.pdf")
    cw,ch,ps=fb.make_pdfx(src,w,h,3.0,out,f"Cartaz Estoi {fmt} — Entre Ruinas e Memorias (CMYK generico)")
    print(f"OK {os.path.basename(out)} media {cw:.1f}x{ch:.1f}mm trim {w}x{h} img {ps[0]}x{ps[1]} (~{ps[0]/((w+6)/25.4):.0f}dpi) {os.path.getsize(out)//1024}KB")
