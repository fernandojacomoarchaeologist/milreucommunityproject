# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar RIGHTS.md.
# A atribuição não transfere direitos de terceiros (fotografia: ver crédito na legenda).
"""Adesivo correctivo da «Imagem relacionada» do painel Q05 (Item 1, 2026-11-16).

Motivo: a MM202609 impressa no Q05 foi tirada numa praia, não em Milreu (revisão do
responsável, 2026-11-16). Decisão do responsável: substituir pela MM202608, que não
está em nenhum painel.

O gerador:
- lê o raster CMYK do PDF do painel enviado à gráfica;
- mede a moldura da fotografia (maior bloco de tinta em largura total na faixa de
  pesquisa) e as linhas de legenda logo abaixo;
- gera DOIS adesivos (decisão do responsável, 2026-11-16):
  1. FOTOGRAFIA — só imagem até ao corte, 2 mm maior que a moldura antiga de cada
     lado (sem orla cor de papel, onde uma diferença de tom se notaria mais);
  2. LEGENDA — tira cor de papel (cor amostrada) sobre as duas linhas antigas, com a
     nova legenda na mesma linha de base, tipografia calibrada e cor das letras;
  o papel entre a fotografia e a legenda fica o original do painel;
- converte a fotografia sRGB -> «Generic CMYK Profile», como nos painéis;
- não altera tons, não usa IA, não grava EXIF.

Uso:
  PYTHONPATH=<pydeps: pikepdf, Pillow, numpy> python3 q05_imagem_relacionada_adesivo_build.py \
      <painel.pdf> <out_dir> <proof_dir> [--panel Q05] [--search-mm 1000 1720] [--sha <sha256>]

`--panel`/`--search-mm` permitem um ensaio noutro painel (ex.: Q12) sem produzir
ficheiros de impressão válidos para o Q05. Sem `--sha`, o SHA-256 do painel é só
impresso no relatório; com `--sha`, funciona como hash-gate.
"""
import argparse
import hashlib
import io
from pathlib import Path

import numpy as np
import pikepdf
from PIL import Image, ImageCms, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[5]
CMYK_ICC = "/System/Library/ColorSync/Profiles/Generic CMYK Profile.icc"
FONT = Path.home() / "Library/Fonts/Archivo.ttf"   # instalada localmente; não distribuída

PANEL_TRIM_MM = (841.0, 1800.0)
PANEL_BLEED_MM = 20.0
OVERLAP_MM = 2.0      # folga do adesivo para lá da moldura/legenda antigas
BLEED_MM = 3.0        # sangria de impressão do adesivo
CAP_MARGIN_MM = 3.0   # margem da tira da legenda à volta das letras (antigas e novas)
OUT_PPI = 300         # texto nítido; a fotografia-fonte tem ~85 ppi à largura da moldura

# Fotografia nova: MM202608, sem a margem branca e o fio da digitalização (medidos)
PHOTO = ROOT / "public/media/museum/originals/MM202608.jpg"
PHOTO_SHA = None      # preenchido no relatório; acrescentar gate após aprovação
PHOTO_INNER = (111, 113, 2577, 1487)
PHOTO_FOCUS_Y = 0.6   # recorte vertical: tira mais céu do que chão

# Tipografia das legendas dos painéis, calibrada pela largura das duas linhas conhecidas do Q12
# («A comunidade em Milreu, …» = 327,6 mm; «Registo do Projecto Comunitário de Milreu.» = 100,1 mm):
# Archivo Regular (peso 400, largura 100), linha 1 ≈ 19,1 pt, linha 2 ≈ 15,0 pt.
FONT_AXES = [400, 100]
CAP_PT = [19.1, 15.0]

CAPTION = [
    "Edifício de cultos de Milreu, potencialmente em 1910 · The cult building at Milreu, possibly 1910.",
    "Fonte: Aldeia de Estoi — Cultura e Património · datação segundo relatos orais.",
]


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def panel_raster(pdf_path):
    pdf = pikepdf.open(pdf_path)
    xo = pdf.pages[0].Resources.XObject
    name = sorted(xo.keys())[0]
    img = Image.open(io.BytesIO(xo[name].read_raw_bytes()))
    assert img.mode == "CMYK", img.mode
    a = np.asarray(img).astype(int)
    # O PIL já desfaz a inversão Adobe do JPEG CMYK; o PDF declara /Decode [1 0 ...] para o mesmo efeito
    dec = xo[name].get("/Decode")
    inverted = dec is not None and float(dec[0]) == 1.0
    return img, a, inverted


def runs(mask):
    out, start = [], None
    for i, v in enumerate(mask):
        if v and start is None:
            start = i
        if not v and start is not None:
            out.append((start, i - 1))
            start = None
    if start is not None:
        out.append((start, len(mask) - 1))
    return out


def measure(a, ppm, search_mm):
    h, w, _ = a.shape
    bg = np.median(a[int(h * 0.02):int(h * 0.04), int(w * 0.45):int(w * 0.55)].reshape(-1, 4), 0)
    ink = np.abs(a - bg).sum(2) > 24
    y0 = int((search_mm[0] + PANEL_BLEED_MM) * ppm)
    y1 = int((search_mm[1] + PANEL_BLEED_MM) * ppm)
    frac = ink[y0:y1].mean(1)
    # Fotografia: a sequência mais longa de linhas com >50 % de tinta
    blocks = [(s + y0, e + y0) for s, e in runs(frac > 0.5)]
    T, B = max(blocks, key=lambda r: r[1] - r[0])
    cols = ink[T + 5:B - 5].mean(0) > 0.5
    L, R = max(runs(cols), key=lambda r: r[1] - r[0])
    # Legenda: linhas de texto logo abaixo da moldura; começa até 20 mm abaixo e pára no primeiro intervalo > 8 mm
    row_ink = ink[:, L:R + 1].any(1)
    below = [(s + B + 1, e + B + 1) for s, e in runs(row_ink[B + 1:B + 1 + int(120 * ppm)])]
    below = [r for r in below if r[1] - r[0] >= int(1.0 * ppm)]      # ignora o fio da moldura
    lines = []
    for r in below:
        if lines and r[0] - lines[-1][1] > int(8 * ppm):
            break
        if not lines and r[0] - B > int(20 * ppm):     # legenda até 20 mm abaixo da foto
            break
        lines.append(r)
    nxt = [r for r in below if r[0] > (lines[-1][1] if lines else B)]
    next_ink = nxt[0][0] if nxt else h
    cap_info = []
    for s, e in lines:
        band = ink[s:e + 1, L:]
        xs = np.where(band.any(0))[0]
        # cor: núcleo das letras (20 % de píxeis mais afastados do papel), não o antialiasing
        sub = a[s:e + 1, L:]
        dist = np.abs(sub - bg).sum(2)
        core = sub[band & (dist >= np.percentile(dist[band], 80))]
        colr = np.median(core.reshape(-1, 4), 0)
        # linha de base: última linha com >= 35 % da tinta máxima (exclui descendentes)
        prof = band.sum(1)
        base = s + int(np.where(prof >= 0.35 * prof.max())[0].max())
        cap_info.append({"top": s, "bot": e, "base": base, "x0": L + xs.min(), "x1": L + xs.max(),
                         "cmyk": tuple(int(v) for v in colr)})
    return bg, (L, T, R, B), cap_info, next_ink


def build(pdf_path, out_dir, proof_dir, panel_id="Q05", search_mm=(1000, 1720), expect_sha=None):
    psha = sha(pdf_path)
    if expect_sha:
        assert psha == expect_sha, f"hash-gate painel FAIL: {psha}"
    panel, a, inverted = panel_raster(pdf_path)
    h, w, _ = a.shape
    ppm = w / (PANEL_TRIM_MM[0] + 2 * PANEL_BLEED_MM)      # px do painel por mm
    assert abs(h / ppm - (PANEL_TRIM_MM[1] + 2 * PANEL_BLEED_MM)) < 1.5, "formato do painel inesperado"
    bg, (L, T, R, B), caps, next_ink = measure(a, ppm, search_mm)
    assert len(caps) == 2, f"esperava 2 linhas de legenda, encontrei {len(caps)}"

    mm = lambda px: px / ppm
    fx, fy = mm(L) - PANEL_BLEED_MM, mm(T) - PANEL_BLEED_MM
    fw, fh = mm(R - L + 1), mm(B - T + 1)
    paper = tuple(int(v) for v in bg)

    def px(v_mm):
        return int(round(v_mm / 25.4 * OUT_PPI))

    out_dir, proof_dir = Path(out_dir), Path(proof_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    proof_dir.mkdir(parents=True, exist_ok=True)
    tag = "" if panel_id == "Q05" else f"_ENSAIO_{panel_id}"

    # ---- Peça 1: FOTOGRAFIA. Só imagem, até ao corte; 2 mm maior que a moldura antiga
    # de cada lado (cobre o filete antigo); a sangria também é fotografia.
    i_cx, i_cy = fx - OVERLAP_MM, fy - OVERLAP_MM
    i_cw, i_ch = fw + 2 * OVERLAP_MM, fh + 2 * OVERLAP_MM
    i_dw, i_dh = i_cw + 2 * BLEED_MM, i_ch + 2 * BLEED_MM
    src = Image.open(PHOTO).convert("RGB").crop(PHOTO_INNER)
    ratio = i_dw / i_dh
    sw, sh = src.size
    if sw / sh > ratio:
        nw = round(sh * ratio)
        x0 = (sw - nw) // 2
        src = src.crop((x0, 0, x0 + nw, sh))
    else:
        nh = round(sw / ratio)
        y0 = round((sh - nh) * PHOTO_FOCUS_Y)
        src = src.crop((0, y0, sw, y0 + nh))
    eff_ppi = src.width / (i_dw / 25.4)
    tr = ImageCms.buildTransform(ImageCms.createProfile("sRGB"), ImageCms.getOpenProfile(CMYK_ICC),
                                 "RGB", "CMYK", ImageCms.Intent.PERCEPTUAL)
    img_piece = ImageCms.applyTransform(src.resize((px(i_dw), px(i_dh)), Image.LANCZOS), tr)
    i_base = f"ADESIVO_Q05_1_FOTOGRAFIA{tag}_{i_cw:.1f}x{i_ch:.1f}mm_corte_sangria3mm_CMYK"
    write_print_pdf(img_piece, i_dw, i_dh, out_dir / f"{i_base}.pdf")
    img_piece.convert("RGB").save(out_dir / f"{i_base}_preview_RGB.png", dpi=(OUT_PPI, OUT_PPI))

    # ---- Peça 2: LEGENDA. Tira cor de papel sobre as duas linhas antigas, com a nova
    # legenda na mesma linha de base, tipografia calibrada e cor do núcleo das letras.
    fonts = []
    for pt in CAP_PT:
        f = ImageFont.truetype(str(FONT), round(pt / 72 * OUT_PPI))
        f.set_variation_by_axes(FONT_AXES)
        fonts.append(f)
    # extensão da tinta nova (mm, coordenadas do corte do painel)
    new_ext = []
    for text, c, f in zip(CAPTION, caps, fonts):
        bb = f.getbbox(text, anchor="ls")
        x0m = mm(c["x0"]) - PANEL_BLEED_MM
        basem = mm(c["base"] + 1) - PANEL_BLEED_MM
        new_ext.append((x0m + bb[0] / OUT_PPI * 25.4, basem + bb[1] / OUT_PPI * 25.4,
                        x0m + bb[2] / OUT_PPI * 25.4, basem + bb[3] / OUT_PPI * 25.4))
    old_ext = [(mm(c["x0"]) - PANEL_BLEED_MM, mm(c["top"]) - PANEL_BLEED_MM,
                mm(c["x1"] + 1) - PANEL_BLEED_MM, mm(c["bot"] + 1) - PANEL_BLEED_MM) for c in caps]
    ext = old_ext + new_ext
    l_cx = min(e[0] for e in ext) - CAP_MARGIN_MM
    l_cy = min(e[1] for e in ext) - CAP_MARGIN_MM
    l_cr = max(e[2] for e in ext) + CAP_MARGIN_MM
    l_cb = max(e[3] for e in ext) + CAP_MARGIN_MM
    l_cw, l_ch = l_cr - l_cx, l_cb - l_cy
    assert l_cy >= i_cy + i_ch + 1.0, f"tira da legenda colide com a fotografia ({l_cy:.1f} < {i_cy + i_ch + 1:.1f} mm)"
    assert l_cr <= PANEL_TRIM_MM[0] - 5, "tira da legenda sai do painel"
    free_below = mm(next_ink) - PANEL_BLEED_MM - l_cb
    assert free_below > 1.0, f"tira da legenda encosta ao elemento seguinte ({free_below:.1f} mm)"
    l_dw, l_dh = l_cw + 2 * BLEED_MM, l_ch + 2 * BLEED_MM
    cap_piece = Image.new("CMYK", (px(l_dw), px(l_dh)), paper)
    d = ImageDraw.Draw(cap_piece)
    rep_caps = []
    for text, c, f, pt in zip(CAPTION, caps, fonts, CAP_PT):
        tx = px(BLEED_MM + mm(c["x0"]) - PANEL_BLEED_MM - l_cx)
        ty = px(BLEED_MM + mm(c["base"] + 1) - PANEL_BLEED_MM - l_cy)
        d.text((tx, ty), text, font=f, fill=c["cmyk"], anchor="ls")
        tw = f.getlength(text) / OUT_PPI * 25.4
        cap_h_font = (f.getbbox("H", anchor="ls")[3] - f.getbbox("H", anchor="ls")[1]) / OUT_PPI * 25.4
        rep_caps.append(f"  «{text}»: Archivo {FONT_AXES[0]} {pt} pt; largura {tw:.1f} mm; CMYK {c['cmyk']}; "
                        f"topo-base antigo {mm(c['base'] - c['top'] + 1):.2f} mm vs. H da fonte {cap_h_font:.2f} mm")
    l_base = f"ADESIVO_Q05_2_LEGENDA{tag}_{l_cw:.1f}x{l_ch:.1f}mm_corte_sangria3mm_CMYK"
    write_print_pdf(cap_piece, l_dw, l_dh, out_dir / f"{l_base}.pdf")
    cap_piece.convert("RGB").save(out_dir / f"{l_base}_preview_RGB.png", dpi=(OUT_PPI, OUT_PPI))

    # ---- Provas: as duas peças (só corte) pousadas no painel, à escala do raster
    mock = panel.copy()
    for piece, cx, cy, cw, ch in ((img_piece, i_cx, i_cy, i_cw, i_ch), (cap_piece, l_cx, l_cy, l_cw, l_ch)):
        W, H = piece.size
        cut = piece.crop((px(BLEED_MM), px(BLEED_MM), W - px(BLEED_MM), H - px(BLEED_MM)))
        mock.paste(cut.resize((round(cw * ppm), round(ch * ppm)), Image.LANCZOS),
                   (round((cx + PANEL_BLEED_MM) * ppm), round((cy + PANEL_BLEED_MM) * ppm)))
    zoom = (max(0, L - 120), max(0, T - 160), min(w, R + 120), min(h, next_ink + 120))
    mock.convert("RGB").resize((w // 2, h // 2), Image.LANCZOS).save(proof_dir / f"{panel_id}_com_adesivos_MONTAGEM.png")
    mock.convert("RGB").crop(zoom).save(proof_dir / f"{panel_id}_com_adesivos_ZOOM.png")
    panel.convert("RGB").crop(zoom).save(proof_dir / f"{panel_id}_imagem_ANTES_ZOOM.png")

    rep = f"""painel {panel_id}: {Path(pdf_path).name}  sha256 {psha}
raster do painel: {w}x{h} px ({ppm * 25.4:.1f} ppi); Decode invertido: {inverted}; papel CMYK 0-255 {paper}
moldura antiga: {fw:.1f} x {fh:.1f} mm; canto sup-esq a {fx:.1f} mm da esquerda e {fy:.1f} mm do topo do corte do painel

ADESIVO 1 — FOTOGRAFIA ({i_base}.pdf)
  corte: {i_cw:.1f} x {i_ch:.1f} mm (moldura antiga + {OVERLAP_MM} mm por lado); com sangria {BLEED_MM} mm: {i_dw:.1f} x {i_dh:.1f} mm
  colocação: canto sup-esq a {i_cx:.1f} mm da esquerda e {i_cy:.1f} mm do topo do painel
             (= {OVERLAP_MM} mm para fora da moldura antiga em cada lado)
  fotografia: {PHOTO.name} sha256 {sha(PHOTO)}; recorte {src.width}x{src.height} px; ~{eff_ppi:.0f} ppi efectivos

ADESIVO 2 — LEGENDA ({l_base}.pdf)
  corte: {l_cw:.1f} x {l_ch:.1f} mm (linhas antigas e novas + {CAP_MARGIN_MM} mm); com sangria: {l_dw:.1f} x {l_dh:.1f} mm
  colocação: canto sup-esq a {l_cx:.1f} mm da esquerda e {l_cy:.1f} mm do topo do painel
  distância à fotografia (adesivo 1): {l_cy - (i_cy + i_ch):.1f} mm; ao elemento seguinte: {free_below:.1f} mm
  legenda nova:
""" + "\n".join(rep_caps) + "\n"
    (out_dir / f"ADESIVOS_Q05{tag}_MEDIDAS.txt").write_text(rep)
    print(rep)
    return rep


def write_print_pdf(piece, dw, dh, path):
    """PDF de impressão: página = corte + sangria; TrimBox = corte; CMYK JPEG (Adobe, /Decode invertido)."""
    W, H = piece.size
    buf = io.BytesIO()
    piece.save(buf, "JPEG", quality=95, dpi=(OUT_PPI, OUT_PPI))
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
    pdf.save(path)


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("pdf")
    ap.add_argument("out_dir")
    ap.add_argument("proof_dir")
    ap.add_argument("--panel", default="Q05")
    ap.add_argument("--search-mm", nargs=2, type=float, default=[1000, 1720])
    ap.add_argument("--sha")
    a = ap.parse_args()
    build(a.pdf, a.out_dir, a.proof_dir, a.panel, tuple(a.search_mm), a.sha)
