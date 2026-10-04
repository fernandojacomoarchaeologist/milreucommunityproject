#!/usr/bin/env python3
# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar RIGHTS.md.
# Embrulha a arte APROVADA (raster embebido no PDF RGB de impressão) num SVG auto-suficiente,
# à dimensão exacta de impressão (mm) COM a sangria já presente no PDF, base64 embebido.
# Poster A0 e materiais (flyer/marcador) foram finalizados como raster -> SVG = contentor
# dimensionado + imagem aprovada (não é vetor-texto editável; para isso, reabrir o gerador).
import os, sys, base64, io
import pikepdf
from PIL import Image

MM=25.4/72

def wrap(src_pdf, out_svg, title, bleed_mm):
    pdf=pikepdf.open(src_pdf); pg=pdf.pages[0]
    media=[float(x) for x in pg.MediaBox]
    cw_mm=round((media[2]-media[0])*MM,2); ch_mm=round((media[3]-media[1])*MM,2)
    xo=dict(pg.get('/Resources',{}).get('/XObject',{}))
    im=[pikepdf.PdfImage(v).as_pil_image() for v in xo.values() if v.get('/Subtype')==pikepdf.Name('/Image')][0].convert("RGB")
    pdf.close()
    pw,ph=im.size
    buf=io.BytesIO(); im.save(buf,"JPEG",quality=92); b64=base64.b64encode(buf.getvalue()).decode()
    svg=(f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
         f'width="{cw_mm}mm" height="{ch_mm}mm" viewBox="0 0 {pw} {ph}" '
         f'data-title="{title}" data-bleed-mm="{bleed_mm}">'
         f'<title>{title}</title>'
         f'<image x="0" y="0" width="{pw}" height="{ph}" preserveAspectRatio="none" '
         f'xlink:href="data:image/jpeg;base64,{b64}"/></svg>')
    os.makedirs(os.path.dirname(out_svg),exist_ok=True)
    open(out_svg,"w").write(svg)
    return cw_mm,ch_mm,pw,ph,len(svg)

ROOT=sys.argv[1] if len(sys.argv)>1 else "."
D=f"{ROOT}/docs/dissemination"
I4=f"{D}/poster-congresso/print-A0"; I5=f"{D}/materiais-museu/print"
jobs=[
 (f"{I4}/poster_milreu_A0_PRINT_sangria5mm.pdf", f"{I4}/CMYK_PDFX/poster_milreu_A0_PRINTX.svg","Poster A0 — Entre Ruinas e Memorias (sangria 5mm)",5.0),
 (f"{I5}/flyer_a6_front_PRINT.pdf", f"{I5}/CMYK_PDFX/flyer_a6_front_PRINTX.svg","Flyer A6 frente (sangria 3mm)",3.0),
 (f"{I5}/flyer_a6_back_PRINT.pdf",  f"{I5}/CMYK_PDFX/flyer_a6_back_PRINTX.svg","Flyer A6 verso (sangria 3mm)",3.0),
 (f"{I5}/marcador_59x214_front_PRINT.pdf", f"{I5}/CMYK_PDFX/marcador_59x214_front_PRINTX.svg","Marcador frente (sangria 3mm)",3.0),
 (f"{I5}/marcador_59x214_back_PRINT.pdf",  f"{I5}/CMYK_PDFX/marcador_59x214_back_PRINTX.svg","Marcador verso (sangria 3mm)",3.0),
]
for src,out,title,bl in jobs:
    if not os.path.exists(src): print("FALTA:",src); continue
    cw,ch,pw,ph,n=wrap(src,out,title,bl)
    print(f"OK {os.path.basename(out)}  {cw}x{ch}mm (bleed {bl})  img {pw}x{ph}  {n//1024}KB")
