# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar RIGHTS.md.
"""Adesivo correctivo do mapa do painel Q01 (Item 1, 2026-10-12).

Mede a moldura do mapa no PDF do Q01 enviado à gráfica e gera um adesivo que
a cobre com folga, usando o mapa corrigido «Mapa de Milreu e Ria Formosa.png».
- A moldura castanha do PNG é retirada; o adesivo recebe o filete do painel
  (mesma cor CMYK), para se integrar no painel já impresso.
- O mapa é escalado uniformemente (sem distorção); o excesso vertical é
  cortado em cima (só relevo) e um pouco em baixo (abaixo da escala).
- Conversão sRGB -> «Generic CMYK Profile» do macOS, a mesma dos painéis
  (o papel do painel dá exactamente C2 M4 Y7 K0 com este perfil).

Uso:
  PYTHONPATH=<pydeps> python3 q1_mapa_adesivo_build.py <Q01.pdf> <mapa.png> <out_dir> <proof_dir>
"""
import hashlib
import io
import sys
from pathlib import Path

import numpy as np
import pikepdf
from PIL import Image, ImageCms, ImageDraw

Q01_SHA = "7469305a06630458873e21c9425dcfdfb0eb95867b2b55da8331d4e9cd31ca8e"
MAP_SHA = "b3742ddcaa211f20e5a19f874555848d2aa8a8a2f5fd502297af86fb15876e8e"
CMYK_ICC = "/System/Library/ColorSync/Profiles/Generic CMYK Profile.icc"

PANEL_PX_PER_MM = 3160 / 881.0     # raster do painel (881 mm = 841 + 2x20 sangria)
PANEL_BLEED_MM = 20.0
BG = (2, 4, 7, 0)                  # papel do painel (CMYK 0-255)

OVERLAP_MM = 2.0     # folga do adesivo para lá da moldura antiga, em cada lado
BLEED_MM = 3.0       # sangria de impressão do adesivo
KEYLINE_MM = 1.2     # filete na orla do adesivo (cor do filete do painel)
OUT_PPI = 150        # resolução de saída (o mapa-fonte tem ~74 ppi efectivos)

# Interior do PNG sem a moldura castanha (medido): x 12..1124, y 8..1370
MAP_INNER = (12, 8, 1125, 1371)
MAP_CROP_BOTTOM = 1360   # mantém a escala «5 km» (termina em y~1345)


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def measure_frame(q01_pdf):
    pdf = pikepdf.open(q01_pdf)
    xo = pdf.pages[0].Resources.XObject["/Im0"]
    img = Image.open(io.BytesIO(xo.read_raw_bytes()))
    a = np.asarray(img).astype(int)
    ink = np.abs(a - np.array(BG)).sum(2) > 12
    y0, y1, x0, x1 = 3950, 5750, 1480, 3000
    sub = ink[y0:y1, x0:x1]
    cols = np.where(sub.mean(0) > 0.5)[0] + x0
    rows = np.where(sub.mean(1) > 0.5)[0] + y0
    L, R, T, B = cols.min(), cols.max(), rows.min(), rows.max()
    keyline = tuple(int(v) for v in np.median(a[T + 400:T + 1200, L + 1:L + 4].reshape(-1, 4), 0))
    return img, (L, T, R, B), keyline


def mm(px):
    return px / PANEL_PX_PER_MM


def build(q01_pdf, map_png, out_dir, proof_dir):
    assert sha(q01_pdf) == Q01_SHA, "hash-gate Q01 FAIL"
    assert sha(map_png) == MAP_SHA, "hash-gate mapa FAIL"
    panel, (L, T, R, B), keyline = measure_frame(q01_pdf)

    # Moldura antiga (mm, a partir do canto superior-esquerdo do CORTE do painel)
    fx, fy = mm(L) - PANEL_BLEED_MM, mm(T) - PANEL_BLEED_MM
    fw, fh = mm(R - L + 1), mm(B - T + 1)
    # Adesivo (linha de corte)
    cw, ch = fw + 2 * OVERLAP_MM, fh + 2 * OVERLAP_MM
    cx, cy = fx - OVERLAP_MM, fy - OVERLAP_MM
    dw, dh = cw + 2 * BLEED_MM, ch + 2 * BLEED_MM

    def px(v):
        return int(round(v / 25.4 * OUT_PPI))

    W, H = px(dw), px(dh)
    k_out = px(BLEED_MM + KEYLINE_MM)             # filete ocupa sangria + 1.2 mm
    inner_w, inner_h = W - 2 * k_out, H - 2 * k_out

    # Mapa: interior sem moldura, cortado à proporção do interior do adesivo
    src = Image.open(map_png).convert("RGB")
    x0, y0, x1, _ = MAP_INNER
    sw = x1 - x0
    sh = round(sw * inner_h / inner_w)
    bottom = MAP_CROP_BOTTOM
    top = bottom - sh
    assert top >= y0, f"corte superior {top} < {y0}"
    crop = src.crop((x0, top, x1, bottom))
    scale_x, scale_y = inner_w / crop.width, inner_h / crop.height
    assert abs(scale_x / scale_y - 1) < 0.002, "distorção"
    eff_ppi = crop.width / ((inner_w / OUT_PPI))
    crop = crop.resize((inner_w, inner_h), Image.LANCZOS)

    srgb = ImageCms.createProfile("sRGB")
    cmyk_p = ImageCms.getOpenProfile(CMYK_ICC)
    t = ImageCms.buildTransform(srgb, cmyk_p, "RGB", "CMYK", ImageCms.Intent.PERCEPTUAL)
    map_cmyk = ImageCms.applyTransform(crop, t)

    sticker = Image.new("CMYK", (W, H), keyline)
    sticker.paste(map_cmyk, (k_out, k_out))

    out_dir, proof_dir = Path(out_dir), Path(proof_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    proof_dir.mkdir(parents=True, exist_ok=True)
    base = f"ADESIVO_Q01_MAPA_{cw:.1f}x{ch:.1f}mm_corte_sangria3mm_CMYK"

    # PDF de impressão: página = corte + sangria; TrimBox = corte
    buf = io.BytesIO()
    sticker.save(buf, "JPEG", quality=95, dpi=(OUT_PPI, OUT_PPI))
    pdf = pikepdf.new()
    pw, ph = dw / 25.4 * 72, dh / 25.4 * 72
    b = BLEED_MM / 25.4 * 72
    img = pikepdf.Stream(pdf, buf.getvalue())
    img.Type, img.Subtype = pikepdf.Name.XObject, pikepdf.Name.Image
    img.Width, img.Height = W, H
    img.ColorSpace, img.BitsPerComponent = pikepdf.Name.DeviceCMYK, 8
    img.Filter = pikepdf.Name.DCTDecode
    img.Decode = pikepdf.Array([1, 0, 1, 0, 1, 0, 1, 0])
    content = pikepdf.Stream(pdf, f"q {pw:.2f} 0 0 {ph:.2f} 0 0 cm /Im0 Do Q".encode())
    page = pikepdf.Dictionary(
        Type=pikepdf.Name.Page,
        MediaBox=[0, 0, round(pw, 2), round(ph, 2)],
        BleedBox=[0, 0, round(pw, 2), round(ph, 2)],
        TrimBox=[round(b, 2), round(b, 2), round(pw - b, 2), round(ph - b, 2)],
        Resources=pikepdf.Dictionary(XObject=pikepdf.Dictionary(Im0=img)),
        Contents=content,
    )
    pdf.pages.append(pikepdf.Page(page))
    pdf.save(out_dir / f"{base}.pdf")

    # Apoio: PNG RGB 150 ppi (com sangria) + TIFF CMYK
    sticker.convert("RGB").save(out_dir / f"{base}_preview_RGB.png", dpi=(OUT_PPI, OUT_PPI))
    sticker.save(out_dir / f"{base}.tif", compression="tiff_lzw", dpi=(OUT_PPI, OUT_PPI))

    # Prova de encaixe sobre o Q01 (só corte, sem sangria), à escala do painel
    cut = sticker.crop((px(BLEED_MM), px(BLEED_MM), W - px(BLEED_MM), H - px(BLEED_MM)))
    pw_px = round(cw * PANEL_PX_PER_MM)
    ph_px = round(ch * PANEL_PX_PER_MM)
    cut_p = cut.resize((pw_px, ph_px), Image.LANCZOS)
    mock = panel.copy()
    mock.paste(cut_p, (round(L - OVERLAP_MM * PANEL_PX_PER_MM), round(T - OVERLAP_MM * PANEL_PX_PER_MM)))
    m = mock.convert("RGB")
    m.resize((1580, 3300), Image.LANCZOS).save(proof_dir / "Q01_com_adesivo_mapa_MONTAGEM.png")
    m.crop((L - 300, T - 250, R + 120, B + 200)).save(proof_dir / "Q01_com_adesivo_mapa_ZOOM.png")
    panel.convert("RGB").crop((L - 300, T - 250, R + 120, B + 200)).save(proof_dir / "Q01_mapa_ANTES_ZOOM.png")

    rep = f"""moldura antiga (painel): {fw:.1f} x {fh:.1f} mm; canto sup-esq a {fx:.1f} mm da esquerda e {fy:.1f} mm do topo (corte do painel)
         distância à direita do corte: {841 - fx - fw:.1f} mm; ao fundo do corte: {1800 - fy - fh:.1f} mm
filete do painel (CMYK 0-255): {keyline}  ~{mm(4):.1f} mm
adesivo (CORTE): {cw:.1f} x {ch:.1f} mm  (folga {OVERLAP_MM} mm/lado)
adesivo (com sangria {BLEED_MM} mm): {dw:.1f} x {dh:.1f} mm  -> {W} x {H} px @ {OUT_PPI} ppi
colocação: canto sup-esq do adesivo a {cx:.1f} mm da esquerda e {cy:.1f} mm do topo do painel (= {OVERLAP_MM} mm para fora da moldura antiga)
mapa: interior PNG {sw}x{sh} px (y {top}..{bottom}); escala uniforme x{scale_x:.4f}/y{scale_y:.4f}; resolução efectiva da fonte ~{eff_ppi:.0f} ppi
"""
    (out_dir / f"{base}_MEDIDAS.txt").write_text(rep)
    print(rep)


if __name__ == "__main__":
    build(*sys.argv[1:5])
