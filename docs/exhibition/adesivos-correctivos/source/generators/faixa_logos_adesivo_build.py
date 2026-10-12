# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar RIGHTS.md.
"""Adesivo da FAIXA DE LOGÓTIPOS dos painéis (Item 1, 2026-10-12).

Segue a skill canónica `.claude/skills/build-logo-band` (modo A, distribuída):
- ordem: Projecto · CCDR · AAMLF · Junta de Freguesia de Estoi · trio Milreu · UAlg;
- INTERVALO IGUAL entre todos os logótipos = intervalo interno médio do trio
  indivisível (0,62 × altura do trio), para o trio não destoar dos restantes;
- a fila ocupa de margem a margem (55 mm de cada lado); as alturas ópticas são as
  do painel aprovado, escaladas uniformemente até a fila preencher a largura.
- O adesivo cobre a faixa inteira: largura total do painel (841 mm), do fio
  (reimpresso) até meia distância do crédito «Impressão dos painéis».
Medidas tiradas do PDF do Q01 enviado à gráfica (Q12 tem a faixa nas mesmas cotas).

Uso:
  PYTHONPATH=<pydeps> python3 faixa_logos_adesivo_build.py <Q01.pdf> <Q12.pdf> <logos_dir> <out_dir> <proof_dir>
"""
import io
import sys
from pathlib import Path

import numpy as np
import pikepdf
from PIL import Image, ImageCms, ImageDraw, ImageFont

FONTS = Path.home() / "Library/Fonts"
CMYK_ICC = "/System/Library/ColorSync/Profiles/Generic CMYK Profile.icc"
PAPER_RGB = (0xFF, 0xFC, 0xF7)        # MARF -> C2 M4 Y7 K0 com o perfil acima
INK = (185, 193, 193, 187)            # Archivo dos títulos (medido no painel)
PANEL_PX_MM = 3160 / 881.0
PANEL_BLEED = 20.0

PPI = 300
PX_MM = PPI / 25.4
W_MM = 841.0
MARGIN_MM = 55.0                      # margem de texto do painel (medida)
BLEED_MM = 3.0
OVERLAP_MM = 2.0                      # o adesivo começa 2 mm acima do fio antigo

# Alturas ópticas aprovadas no painel (mm, medidas no Q01) + Junta = emblema do Projecto
ORDER = [
    ("logo-projeto-comunitario-milreu.png", 33.5),
    ("logo-ccdr-algarve.png", 36.0),
    ("logo-associacao-amigos-museu-lyceu-faro.png", 33.5),
    ("logo-junta-freguesia-estoi.png", 33.5),
    ("Milreu_policromatico.png", 36.5),
    ("logo-ualg-completo.png", 28.4),
]
TRIO = "Milreu_policromatico.png"


def panel_raster(pdf_path):
    pdf = pikepdf.open(pdf_path)
    xo = pdf.pages[0].Resources.XObject["/Im0"]
    return Image.open(io.BytesIO(xo.read_raw_bytes()))


def measure_band(panel):
    a = np.asarray(panel).astype(int)
    ink = np.abs(a - np.array([2, 4, 7, 0])).sum(2) > 20
    rows = np.where(ink[5860:5900, 1000:2000].mean(1) > 0.9)[0] + 5860
    rule_t, rule_b = rows.min(), rows.max()
    rule_cmyk = tuple(int(v) for v in np.median(a[rule_t:rule_b + 1, 1000:2000].reshape(-1, 4), 0))
    head = np.where(ink[5900:5990, 250:1800].any(1))[0] + 5900
    logos = np.where(ink[5990:6160, 250:2900].any(1))[0] + 5990
    credit = np.where(ink[6160:6300, 1000:2000].any(1))[0] + 6160
    mm = lambda px: px / PANEL_PX_MM - PANEL_BLEED
    return dict(rule_top=mm(rule_t), rule_h=(rule_b - rule_t + 1) / PANEL_PX_MM, rule_cmyk=rule_cmyk,
                head_top=mm(head.min()), logos_top=mm(logos.min()), logos_bot=mm(logos.max() + 1),
                credit_top=mm(credit.min()))


def ink_bbox(im):
    a = np.asarray(im.convert("RGBA")).astype(int)
    ink = (a[:, :, 3] > 40) & ((255 * 3 - a[:, :, :3].sum(2)) > 40)
    ys, xs = np.where(ink)
    return im.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))


def trio_gap_ratio(im):
    a = np.asarray(im.convert("RGBA")).astype(int)
    ink = ((a[:, :, 3] > 40) & ((255 * 3 - a[:, :, :3].sum(2)) > 40)).any(0)
    segs, s0 = [], None
    for x, c in enumerate(ink):
        if c and s0 is None:
            s0 = x
        if not c and s0 is not None:
            segs.append([s0, x - 1]); s0 = None
    if s0 is not None:
        segs.append([s0, len(ink) - 1])
    merged = [segs[0]]
    for s in segs[1:]:
        if s[0] - merged[-1][1] < 25:
            merged[-1][1] = s[1]
        else:
            merged.append(s)
    gaps = [merged[i + 1][0] - merged[i][1] - 1 for i in range(len(merged) - 1)]
    return sum(gaps) / len(gaps) / im.height, gaps


def build(q01, q12, logos_dir, out_dir, proof_dir):
    p1, p12 = panel_raster(q01), panel_raster(q12)
    m1, m12 = measure_band(p1), measure_band(p12)
    for k in ("rule_top", "logos_top", "logos_bot", "credit_top"):
        assert abs(m1[k] - m12[k]) < 0.5, f"Q01/Q12 diferem em {k}"
    M = m1

    # Logótipos (RGBA, recortados à tinta)
    imgs = []
    for f, h in ORDER:
        src = Image.open(Path(logos_dir) / f).convert("RGBA")
        imgs.append((f, ink_bbox(src), h))
    trio_img = next(i for f, i, h in imgs if f == TRIO)
    g_ratio, trio_gaps = trio_gap_ratio(trio_img)

    widths = [im.width / im.height * h for f, im, h in imgs]
    gap = g_ratio * 36.5
    row = sum(widths) + gap * (len(imgs) - 1)
    s = (W_MM - 2 * MARGIN_MM) / row                       # escala uniforme para encher a largura
    heights = [h * s for f, im, h in imgs]
    widths = [w * s for w in widths]
    gap *= s

    # Geometria vertical do adesivo (mm a partir do topo do CORTE do painel)
    cut_top = M["rule_top"] - OVERLAP_MM
    logos_center = M["logos_top"] + 36.5 / 2               # centro óptico da fila actual
    tallest = max(heights)
    new_bot = logos_center + tallest / 2
    cut_bot = (new_bot + M["credit_top"]) / 2
    assert cut_bot - new_bot >= 5, "pouco espaço sob os logótipos"
    H_MM = cut_bot - cut_top

    Wpx = round((W_MM + 2 * BLEED_MM) * PX_MM)
    Hpx = round((H_MM + 2 * BLEED_MM) * PX_MM)
    X = lambda mm_: round((mm_ + BLEED_MM) * PX_MM)            # x a partir do corte esq.
    Y = lambda mm_: round((mm_ - cut_top + BLEED_MM) * PX_MM)  # y em cotas do painel

    canvas = Image.new("RGB", (Wpx, Hpx), PAPER_RGB)
    x = MARGIN_MM
    placed = []
    for (f, im, _), w, h in zip(imgs, widths, heights):
        r = im.resize((max(1, round(w * PX_MM)), max(1, round(h * PX_MM))), Image.LANCZOS)
        y = logos_center - h / 2
        canvas.paste(r, (X(x), Y(y)), r)
        eff = im.height / (h / 25.4)
        placed.append((f, x, y, w, h, eff))
        x += w + gap

    t = ImageCms.buildTransform(ImageCms.createProfile("sRGB"), ImageCms.getOpenProfile(CMYK_ICC),
                                "RGB", "CMYK", ImageCms.Intent.PERCEPTUAL)
    st = ImageCms.applyTransform(canvas, t)
    d = ImageDraw.Draw(st)
    # fio (reimpresso na mesma cota/cor) e cabeçalho (mesmo corpo/tracking do painel)
    d.rectangle((X(MARGIN_MM), Y(M["rule_top"]), X(W_MM - MARGIN_MM),
                 Y(M["rule_top"] + M["rule_h"]) - 1), fill=M["rule_cmyk"])
    fh = ImageFont.truetype(str(FONTS / "Archivo.ttf"), round(28 / PANEL_PX_MM * PX_MM))
    fh.set_variation_by_name("Bold")
    tr = 4.44 / PANEL_PX_MM * PX_MM
    hx, hy = X(MARGIN_MM), Y(M["head_top"]) - fh.getbbox("A")[1]
    for ch in "APOIO INSTITUCIONAL E PARCERIAS · INSTITUTIONAL SUPPORT AND PARTNERSHIPS":
        d.text((hx, hy), ch, font=fh, fill=INK)
        hx += fh.getlength(ch) + tr

    out_dir, proof_dir = Path(out_dir), Path(proof_dir)
    out_dir.mkdir(parents=True, exist_ok=True); proof_dir.mkdir(parents=True, exist_ok=True)
    base = f"ADESIVO_FAIXA_LOGOS_{W_MM:.0f}x{H_MM:.1f}mm_corte_sangria3mm_CMYK"
    buf = io.BytesIO(); st.save(buf, "JPEG", quality=95, dpi=(PPI, PPI))
    pdf = pikepdf.new()
    pw, ph = (W_MM + 2 * BLEED_MM) / 25.4 * 72, (H_MM + 2 * BLEED_MM) / 25.4 * 72
    b = BLEED_MM / 25.4 * 72
    img = pikepdf.Stream(pdf, buf.getvalue())
    img.Type, img.Subtype = pikepdf.Name.XObject, pikepdf.Name.Image
    img.Width, img.Height, img.BitsPerComponent = Wpx, Hpx, 8
    img.ColorSpace, img.Filter = pikepdf.Name.DeviceCMYK, pikepdf.Name.DCTDecode
    img.Decode = pikepdf.Array([1, 0, 1, 0, 1, 0, 1, 0])
    page = pikepdf.Dictionary(
        Type=pikepdf.Name.Page, MediaBox=[0, 0, round(pw, 2), round(ph, 2)],
        BleedBox=[0, 0, round(pw, 2), round(ph, 2)],
        TrimBox=[round(b, 2), round(b, 2), round(pw - b, 2), round(ph - b, 2)],
        Resources=pikepdf.Dictionary(XObject=pikepdf.Dictionary(Im0=img)),
        Contents=pikepdf.Stream(pdf, f"q {pw:.2f} 0 0 {ph:.2f} 0 0 cm /Im0 Do Q".encode()))
    pdf.pages.append(pikepdf.Page(page))
    pdf.save(out_dir / f"{base}.pdf")
    st.convert("RGB").save(out_dir / f"{base}_preview_RGB.png", dpi=(PPI, PPI))

    # Montagens sobre Q01 e Q12 (só a área de corte)
    cut = st.crop((X(0), Y(cut_top), X(W_MM), Y(cut_bot)))
    for name, pan in (("Q01", p1), ("Q12", p12)):
        cp = cut.resize((round(W_MM * PANEL_PX_MM), round(H_MM * PANEL_PX_MM)), Image.LANCZOS)
        mk = pan.copy(); mk.paste(cp, (round(PANEL_BLEED * PANEL_PX_MM), round((cut_top + PANEL_BLEED) * PANEL_PX_MM)))
        y0 = round((cut_top + PANEL_BLEED - 40) * PANEL_PX_MM)
        mk.convert("RGB").crop((0, y0, 3160, y0 + 900)).save(proof_dir / f"{name}_com_faixa_logos_MONTAGEM.png")

    lines = [f"faixa no painel: fio a {M['rule_top']:.1f} mm do topo do corte; logótipos {M['logos_top']:.1f}-{M['logos_bot']:.1f}; crédito da gráfica a {M['credit_top']:.1f} (Q01 = Q12)",
             f"ADESIVO (corte): {W_MM:.1f} x {H_MM:.1f} mm; com sangria {BLEED_MM} mm: {W_MM + 2*BLEED_MM:.1f} x {H_MM + 2*BLEED_MM:.1f} mm ({Wpx}x{Hpx} px @ {PPI} ppi)",
             f"colocação: bordo superior a {cut_top:.1f} mm do topo do painel ({OVERLAP_MM} mm acima do fio); bordos laterais = bordos do painel",
             f"intervalo entre logótipos: {gap:.1f} mm (= intervalo interno médio do trio; gaps internos do trio em px {trio_gaps}); escala da fila x{s:.3f}",
             "logótipo | x esq (mm) | y topo (mm) | largura | altura | ppi efectivo"]
    for f, x0, y0, w, h, eff in placed:
        lines.append(f"{f} | {x0:.1f} | {y0:.1f} | {w:.1f} | {h:.1f} | {eff:.0f}{'  <- BAIXO' if eff < 150 else ''}")
    rep = "\n".join(lines) + "\n"
    (out_dir / f"{base}_MEDIDAS.txt").write_text(rep)
    print(rep)


if __name__ == "__main__":
    build(*sys.argv[1:6])
