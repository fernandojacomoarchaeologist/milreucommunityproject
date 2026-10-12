# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar RIGHTS.md.
"""Q12 — reabertura humana (2026-10-12): substitui a banda «Agradecimentos» (conteúdo
errado: repetia a tradução EN da citação de Leandro C Dias) por uma FICHA TÉCNICA
de três colunas de peso igual. Trabalha em CMYK sobre o raster original enviado
à gráfica (Drive «3- Panels»), preservando página 881x1840 mm (841x1800 + 20 mm
sangria), TrimBox/BleedBox e resolução. Só toca na banda y=5484..5878 px.

Uso:
  PYTHONPATH=<pydeps> python3 q12_ficha_tecnica_build.py <Q12_original.pdf> <out_dir> [--final]
Sem --final, a saída leva marca de água «PROVA» (regra physical-preview).
"""
import hashlib
import io
import sys
from pathlib import Path

import numpy as np
import pikepdf
from PIL import Image, ImageDraw, ImageFont

FONTS = Path.home() / "Library/Fonts"
EXPECTED_SHA = "046db67d0f35b6a750a715ef15eec72018637ef366ea3031a111b9886e48779c"

# Cores medidas no original (CMYK 0-255)
BG = (2, 4, 7, 0)            # papel
INK = (185, 193, 193, 187)   # títulos Archivo (igual ao original)
BODY = (187, 192, 187, 185)  # texto Spectral (igual ao original)
WM = (0, 255, 255, 0)        # marca de água de prova (vermelho, só PROVA)

# Geometria (px do raster 3160x6600; 3.587 px/mm)
X0, X1 = 269, 2891           # margens do texto (= regras horizontais)
CLEAR = (262, 5484, 2898, 5878)  # entre as duas regras, sem as tocar
HEAD_TOP = 5532              # topo do título original

SUPPORT_PT = "Apoiado pela CCDR Algarve, I.P."   # menção obrigatória, art. 16.º
SUPPORT_EN = "Supported by CCDR Algarve, I.P."

CREDITS = [
    # (rótulo PT, rótulo EN, nome, afiliação)
    ("INVESTIGAÇÃO, DESIGN E PRODUÇÃO", "Research, design and production",
     "Fernando Rodrigues de Jácomo", None),
    ("COORDENAÇÃO INSTITUCIONAL", "Institutional coordination",
     "Meira Pinto", "Associação dos Amigos do Museu do Lyceu de Faro"),
    ("CURADORIA", "Curated by",
     "Grupo de voluntários", "do Projecto Comunitário de Milreu"),
]


def font(name, size, var=None):
    f = ImageFont.truetype(str(FONTS / name), size)
    if var:
        f.set_variation_by_name(var)
    return f


def tracked(draw, xy, text, f, fill, tracking):
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=f, fill=fill)
        x += f.getlength(ch) + tracking
    return x


def top_aligned(f, text):
    return f.getbbox(text)[1]


def build(src, out_dir, final):
    raw_pdf = Path(src).read_bytes()
    sha = hashlib.sha256(raw_pdf).hexdigest()
    if sha != EXPECTED_SHA:
        sys.exit(f"hash-gate FAIL: {sha} != {EXPECTED_SHA}")

    pdf = pikepdf.open(src)
    page = pdf.pages[0]
    xo = page.Resources.XObject["/Im0"]
    img = Image.open(io.BytesIO(xo.read_raw_bytes()))
    assert img.mode == "CMYK" and img.size == (3160, 6600)
    orig = np.asarray(img).copy()

    d = ImageDraw.Draw(img)
    d.rectangle(CLEAR, fill=BG)

    # Título da banda — mesmo corpo/tracking do «AGRADECIMENTOS · WITH THANKS»
    fh = font("Archivo.ttf", 28, "Bold")
    tracked(d, (X0, HEAD_TOP - top_aligned(fh, "F")), "FICHA TÉCNICA · CREDITS", fh, INK, 4.44)

    # Três colunas de peso igual
    gutter = 72
    colw = (X1 - X0 - 2 * gutter) / 3
    fl = font("Archivo.ttf", 22, "Bold")
    fe = font("Spectral-Italic.ttf", 24)
    fn = font("Spectral-Medium.ttf", 40)
    fa = font("Spectral-Regular.ttf", 26)
    y_label, y_en, y_name, y_aff = 5600, 5634, 5694, 5750
    for i, (lab, en, name, aff) in enumerate(CREDITS):
        x = X0 + i * (colw + gutter)
        tracked(d, (x, y_label - top_aligned(fl, "C")), lab, fl, INK, 2.2)
        d.text((x, y_en - top_aligned(fe, "I")), en, font=fe, fill=BODY)
        d.text((x, y_name - top_aligned(fn, "M")), name, font=fn, fill=BODY)
        if aff:
            d.text((x, y_aff - top_aligned(fa, "A")), aff, font=fa, fill=BODY)
        for t, f in ((name, fn), (aff or "", fa), (en, fe)):
            assert f.getlength(t) <= colw, f"overflow col {i}: {t}"

    # Contrapartida art. 16.º (regulamento CCDR): fórmula exacta, sem paráfrase
    fs = font("Spectral-Medium.ttf", 30)
    fse = font("Spectral-Italic.ttf", 26)
    y_sup = 5822
    d.text((X0, y_sup - top_aligned(fs, "A")), SUPPORT_PT, font=fs, fill=BODY)
    xe = X0 + fs.getlength(SUPPORT_PT + "  ·  ")
    d.text((X0 + fs.getlength(SUPPORT_PT), y_sup - top_aligned(fs, "A")), "  ·  ", font=fs, fill=BODY)
    d.text((xe, y_sup - top_aligned(fse, "S")), SUPPORT_EN, font=fse, fill=BODY)

    # Verificação: nada fora da banda mudou
    new = np.asarray(img)
    mask = np.ones(new.shape[:2], bool)
    x0, y0, x1, y1 = CLEAR
    mask[y0:y1 + 1, x0:x1 + 1] = False
    changed_outside = int((np.abs(new.astype(int) - orig.astype(int)).sum(2)[mask] > 0).sum())
    assert changed_outside == 0, f"{changed_outside} px alterados fora da banda"

    if not final:
        wm = ImageDraw.Draw(img)
        fw = font("Archivo.ttf", 64, "Bold")
        for y in (300, 3300, 6200):
            wm.text((120, y), "PROVA Q12 v3 · NÃO ENVIAR À GRÁFICA · HUMAN GATE", font=fw, fill=WM)

    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    tag = "FINAL" if final else "PROVA_v3"
    buf = io.BytesIO()
    img.save(buf, "JPEG", quality=95, dpi=(91.1, 91.1))
    jpg = buf.getvalue()
    # PIL grava CMYK com marcador Adobe invertido -> manter Decode [1 0 ...] como o original
    reread = np.asarray(Image.open(io.BytesIO(jpg))).astype(int)
    assert np.abs(reread - np.asarray(img).astype(int)).mean() < 3

    xo.write(jpg, filter=pikepdf.Name.DCTDecode)
    xo.Decode = pikepdf.Array([1, 0, 1, 0, 1, 0, 1, 0])
    pdf_out = out_dir / f"12 - MILREU_Q12_841x1800_bleed20_CMYK_FICHA_{tag}.pdf"
    pdf.save(pdf_out)

    rgb = img.convert("RGB")
    rgb.resize((1580, 3300), Image.LANCZOS).save(out_dir / f"Q12_FICHA_{tag}_preview.png")
    rgb.crop((180, 5400, 2980, 6000)).save(out_dir / f"Q12_FICHA_{tag}_banda_100.png")
    print("hash-gate PASS", sha)
    print("fora da banda alterados: 0 px")
    print("saída:", pdf_out)


if __name__ == "__main__":
    a = [x for x in sys.argv[1:] if not x.startswith("--")]
    build(a[0], a[1], "--final" in sys.argv)
