#!/usr/bin/env python3
# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar RIGHTS.md.
# FASE B — prepress CMYK (perfil GENÉRICO, interino).
# Extrai o raster APROVADO embebido em cada PDF RGB de impressão, converte RGB->CMYK
# com o "Generic CMYK Profile" do sistema (NOMEADO, substituível pela gráfica) e
# reembrulha como PDF/X-3 com MediaBox/TrimBox/BleedBox/ArtBox + OutputIntent.
# Não altera a arte: converte exatamente o que já foi aprovado em RGB.
import os, io, sys
from PIL import Image, ImageCms
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from reportlab.lib.utils import ImageReader
import pikepdf

DPI_TAG=300
ICC="/System/Library/ColorSync/Profiles/Generic CMYK Profile.icc"
PROFILE_NAME="Generic CMYK Profile (perfil padrao INTERINO — substituir pelo ICC da grafica)"
_srgb=ImageCms.createProfile('sRGB')
_tr=ImageCms.buildTransform(_srgb, ICC, 'RGB','CMYK', renderingIntent=ImageCms.Intent.RELATIVE_COLORIMETRIC)
MM=25.4/72

def extract_image(src_pdf):
    pdf=pikepdf.open(src_pdf); pg=pdf.pages[0]
    media=[float(x) for x in pg.MediaBox]
    cw_mm=(media[2]-media[0])*MM; ch_mm=(media[3]-media[1])*MM
    xo=dict(pg.get('/Resources',{}).get('/XObject',{}))
    img=None
    for k,v in xo.items():
        if v.get('/Subtype')==pikepdf.Name('/Image'):
            img=pikepdf.PdfImage(v).as_pil_image(); break
    pdf.close()
    if img is None: raise RuntimeError("sem imagem embebida: "+src_pdf)
    return img.convert("RGB"), cw_mm, ch_mm

def make_pdfx(src_pdf, trim_w_mm, trim_h_mm, bleed_mm, out_pdf, title):
    im, cw_mm, ch_mm = extract_image(src_pdf)
    cmyk=ImageCms.applyTransform(im, _tr)
    tmp=out_pdf+".cmyk.jpg"; cmyk.save(tmp,"JPEG",quality=92,dpi=(DPI_TAG,DPI_TAG))
    c=canvas.Canvas(out_pdf, pagesize=(cw_mm*mm, ch_mm*mm))
    c.setTitle(title)
    c.drawImage(ImageReader(tmp), 0,0, width=cw_mm*mm, height=ch_mm*mm)
    c.showPage(); c.save(); os.remove(tmp)
    pdf=pikepdf.open(out_pdf, allow_overwriting_input=True); page=pdf.pages[0]
    PT=lambda v: v*72/25.4
    bx=(cw_mm-trim_w_mm)/2; by=(ch_mm-trim_h_mm)/2
    page.MediaBox=[0,0,PT(cw_mm),PT(ch_mm)]
    page.BleedBox=[PT(max(0,bx-bleed_mm)),PT(max(0,by-bleed_mm)),
                   PT(min(cw_mm,bx+trim_w_mm+bleed_mm)),PT(min(ch_mm,by+trim_h_mm+bleed_mm))]
    page.TrimBox=[PT(bx),PT(by),PT(bx+trim_w_mm),PT(by+trim_h_mm)]
    page.ArtBox=page.TrimBox
    res=page.get('/Resources',{})
    if '/Font' in res: del res['/Font']
    st=pikepdf.Stream(pdf, open(ICC,'rb').read()); st.N=4
    oi=pdf.make_indirect(pikepdf.Dictionary(
        Type=pikepdf.Name("/OutputIntent"), S=pikepdf.Name("/GTS_PDFX"),
        OutputConditionIdentifier=pikepdf.String("Generic CMYK"),
        Info=pikepdf.String(PROFILE_NAME), DestOutputProfile=pdf.make_indirect(st)))
    pdf.Root.OutputIntents=pikepdf.Array([oi])
    pdf.docinfo[pikepdf.Name("/GTS_PDFXVersion")]=pikepdf.String("PDF/X-3:2002")
    pdf.docinfo[pikepdf.Name("/Title")]=pikepdf.String(title)
    pdf.docinfo[pikepdf.Name("/Trapped")]=pikepdf.Name("/False")
    pdf.save(out_pdf); pdf.close()
    return cw_mm, ch_mm, im.size

ROOT=sys.argv[1] if len(sys.argv)>1 else "."
D=f"{ROOT}/docs/dissemination"
I4=f"{D}/poster-congresso/print-A0"; I5=f"{D}/materiais-museu/print"; I6=f"{D}/convite-inquerito/final"
jobs=[
 # (src_pdf, trim_w, trim_h, bleed, out_pdf, title)
 (f"{I4}/poster_milreu_A0_PRINT_sangria5mm.pdf",841,1189,5.0,f"{I4}/CMYK_PDFX/poster_milreu_A0_PRINTX_CMYKgenerico.pdf","Poster A0 — Entre Ruinas e Memorias (CMYK generico)"),
 (f"{I5}/flyer_a6_front_PRINT.pdf",105,148,3.0,f"{I5}/CMYK_PDFX/flyer_a6_front_PRINTX_CMYKgenerico.pdf","Flyer A6 frente (CMYK generico)"),
 (f"{I5}/flyer_a6_back_PRINT.pdf",105,148,3.0,f"{I5}/CMYK_PDFX/flyer_a6_back_PRINTX_CMYKgenerico.pdf","Flyer A6 verso (CMYK generico)"),
 (f"{I5}/marcador_59x214_front_PRINT.pdf",59,214,3.0,f"{I5}/CMYK_PDFX/marcador_59x214_front_PRINTX_CMYKgenerico.pdf","Marcador frente (CMYK generico)"),
 (f"{I5}/marcador_59x214_back_PRINT.pdf",59,214,3.0,f"{I5}/CMYK_PDFX/marcador_59x214_back_PRINTX_CMYKgenerico.pdf","Marcador verso (CMYK generico)"),
 (f"{I6}/print/06_A6_frente_PRINT.pdf",105,148,3.0,f"{I6}/print/CMYK_PDFX/06_A6_frente_PRINTX_CMYKgenerico.pdf","Convite A6 (CMYK generico)"),
 (f"{I6}/print/06_A4_PRINT.pdf",210,297,3.0,f"{I6}/print/CMYK_PDFX/06_A4_PRINTX_CMYKgenerico.pdf","Convite A4 (CMYK generico)"),
 (f"{I6}/print/06_A3_PRINT.pdf",297,420,3.0,f"{I6}/print/CMYK_PDFX/06_A3_PRINTX_CMYKgenerico.pdf","Convite A3 (CMYK generico)"),
]
for job in jobs:
    src=job[0]; out=job[4]
    if not os.path.exists(src): print("FALTA:",src); continue
    os.makedirs(os.path.dirname(out),exist_ok=True)
    cw,ch,ps=make_pdfx(*job)
    eff=ps[0]/((job[1]+2*job[3])/25.4)
    print(f"OK {os.path.basename(out)}  media {cw:.1f}x{ch:.1f}mm  trim {job[1]}x{job[2]}  img {ps[0]}x{ps[1]} (~{eff:.0f}dpi)  {os.path.getsize(out)//1024}KB")
