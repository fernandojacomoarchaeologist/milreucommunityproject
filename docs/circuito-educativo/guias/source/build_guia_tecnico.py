#!/usr/bin/env python3
# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar RIGHTS.md.
"""Gera o Guia Técnico do Circuito Educativo (DOCX) a partir dos capítulos em Markdown.

Uso:
    python3 -I -X utf8 build_guia_tecnico.py CAMINHO_DEPS [--versao v0.1] [--data "21 de novembro de 2026"]

- CAMINHO_DEPS: pasta onde está o python-docx instalado com `pip --target`.
- Lê `../tecnico/*.md` pela ordem de ORDEM.
- Desenha os esquemas técnicos GT-01 a GT-05 em `../tecnico/figuras/` (Pillow, fontes do sistema).
- Gera `../tecnico/17_anexo_III_matriz_riscos.md` a partir das tabelas de risco dos capítulos.
- Grava `../_private/Guia_Tecnico_Circuito_Educativo_Milreu_<versao>.docx` (pasta ignorada pelo Git).

Convenções do Markdown:
    # / ## / ###                         títulos (o nível 1 abre página nova)
    | a | b |                            tabelas
    - item / 1. item                     listas
    <!-- figura: caminho | legenda -->   imagem (caminho relativo a ../tecnico/) com legenda
    **negrito**, *itálico*, `código`
A linha de copyright dos capítulos (> © …) não entra no DOCX; a capa leva-a uma vez.
Nenhum ficheiro de fonte é distribuído: usam-se fontes do sistema.
"""
import os
import re
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
GUIAS = os.path.dirname(AQUI)
TECNICO = os.path.join(GUIAS, "tecnico")
FIGURAS = os.path.join(TECNICO, "figuras")
PRIVADO = os.path.join(GUIAS, "_private")

ORDEM = [
    "00_ficha_tecnica.md",
    "00b_contexto.md",
    "01_abertura.md",
    "02_estacao_1_escavacao.md",
    "03_estacao_2_mosaicos.md",
    "04_estacao_3_estratigrafia.md",
    "05_estacao_4_villa.md",
    "06_estacao_5_numismatica.md",
    "07_estacao_6_digital.md",
    "08_estacao_7_caca_tesouro.md",
    "09_estacao_8_caderno.md",
    "10_estacao_9_quiz.md",
    "11_componente_A_mediacao_livro.md",
    "12_componente_B_passaporte.md",
    "13_componente_C_quebra_cabecas.md",
    "14_componente_D_adolescentes.md",
    "15_anexo_I_materiais_por_fornecedor.md",
    "16_anexo_II_epi.md",
    "17_anexo_III_matriz_riscos.md",
]

COPYRIGHT_MD = ("> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário "
                "de Milreu. Consultar `RIGHTS.md`.")


def argumentos():
    args = sys.argv[1:]
    if not args or args[0].startswith("--"):
        sys.exit(__doc__)
    deps = args[0]
    versao, data = "v0.1", "21 de novembro de 2026"
    if "--versao" in args:
        versao = args[args.index("--versao") + 1]
    if "--data" in args:
        data = args[args.index("--data") + 1]
    return deps, versao, data


DEPS, VERSAO, DATA = argumentos()
sys.path.insert(0, DEPS)

try:
    from PIL import Image, ImageDraw, ImageFont  # noqa: E402
except ImportError:  # com -I, o Pillow do utilizador não está no caminho
    import site
    sys.path.append(site.getusersitepackages())
    try:
        from PIL import Image, ImageDraw, ImageFont  # noqa: E402
    except ImportError:
        Image = None  # usa as figuras já geradas

try:
    from docx import Document
    from docx.enum.table import WD_TABLE_ALIGNMENT
    from docx.enum.text import WD_ALIGN_PARAGRAPH
    from docx.oxml import OxmlElement
    from docx.oxml.ns import qn
    from docx.shared import Cm, Pt, RGBColor
except ImportError:
    sys.exit("python-docx não encontrado na pasta indicada: %s" % DEPS)

# ======================================================================== figuras

FONTE_SIS = "/System/Library/Fonts/Supplemental/Arial.ttf"
FONTE_SIS_B = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
TINTA = (43, 36, 32)
CINZA = (120, 110, 100)
LINHA = (90, 80, 72)
ZONA = (236, 230, 222)
ZONA2 = (222, 232, 236)
MADEIRA = (196, 160, 110)
ENCH1 = (214, 196, 160)
ENCH2 = (180, 150, 110)


def fonte(t, negrito=False):
    try:
        return ImageFont.truetype(FONTE_SIS_B if negrito else FONTE_SIS, t)
    except OSError:
        return ImageFont.load_default()


def tela(w, h):
    im = Image.new("RGB", (w, h), "white")
    return im, ImageDraw.Draw(im)


def texto(d, xy, s, t=22, negrito=False, cor=TINTA, ancora="la"):
    d.text(xy, s, font=fonte(t, negrito), fill=cor, anchor=ancora)


def cota_h(d, x1, x2, y, s, t=20):
    d.line([(x1, y), (x2, y)], fill=LINHA, width=2)
    for x in (x1, x2):
        d.line([(x, y - 8), (x, y + 8)], fill=LINHA, width=2)
    texto(d, ((x1 + x2) / 2, y - 6), s, t, ancora="mb")


def cota_v(d, x, y1, y2, s, t=20):
    d.line([(x, y1), (x, y2)], fill=LINHA, width=2)
    for y in (y1, y2):
        d.line([(x - 8, y), (x + 8, y)], fill=LINHA, width=2)
    texto(d, (x + 12, (y1 + y2) / 2), s, t, ancora="lm")


def rodape(d, w, h):
    texto(d, (w / 2, h - 22), "Esquema técnico elaborado para este guia · medidas indicativas · não é plano de construção",
          18, cor=CINZA, ancora="mm")


def fig_unidade_carga():
    w, h = 1400, 760
    im, d = tela(w, h)
    texto(d, (40, 30), "GT-01 · Unidade de carga", 30, True)
    # caixa em perspectiva cavaleira: frente 50 x 32, profundidade 40
    x0, y0, s = 220, 260, 9  # 1 cm = 9 px
    fw, fh, dp = 50 * s, 32 * s, 40 * s * 0.5
    frente = [(x0, y0), (x0 + fw, y0), (x0 + fw, y0 + fh), (x0, y0 + fh)]
    topo = [(x0, y0), (x0 + dp, y0 - dp), (x0 + fw + dp, y0 - dp), (x0 + fw, y0)]
    lado = [(x0 + fw, y0), (x0 + fw + dp, y0 - dp), (x0 + fw + dp, y0 + fh - dp), (x0 + fw, y0 + fh)]
    d.polygon(topo, fill=(205, 205, 200), outline=LINHA)
    d.polygon(lado, fill=(185, 185, 180), outline=LINHA)
    d.polygon(frente, fill=(215, 215, 210), outline=LINHA)
    # etiqueta
    ex, ey = x0 + 60, y0 + 60
    d.rectangle([ex, ey, ex + 300, ey + 150], fill="white", outline=TINTA, width=2)
    for i, l in enumerate(["Volume n.º ___ de ___", "Estação / conteúdo", "Massa medida: ____ kg",
                           "Frágil [ ]   Dois carregadores [ ]"]):
        texto(d, (ex + 14, ey + 14 + i * 33), l, 20)
    cota_h(d, x0, x0 + fw, y0 + fh + 40, "50 cm")
    cota_v(d, x0 - 60, y0, y0 + fh, "")
    texto(d, (x0 - 70, y0 + fh / 2), "32 cm", 20, ancora="rm")
    texto(d, (x0 + fw + dp / 2 + 30, y0 - dp / 2 - 10), "40 cm", 20, ancora="lm")
    # notas
    nx = 900
    notas = [("Caixa organizadora de modelo único", True),
             ("plástico reciclado · 32 × 40 × 50 cm · 45 L", False),
             ("", False),
             ("Tecto por volume transportado", True),
             ("20 a 30 kg (decisão LAC C3, 19-11)", False),
             ("Pesar cada volume na balança (TA-05)", False),
             ("Mais pesado? Usar contentor mais pequeno", False),
             ("", False),
             ("Enchimento (densidade a medir)", True),
             ("45 L × 0,35–0,65 kg/L ≈ 16–29 kg (hipótese A2)", False),
             ("", False),
             ("A moldura de 1 m² nunca viaja cheia", True)]
    for i, (l, b) in enumerate(notas):
        texto(d, (nx, 160 + i * 36), l, 22, b)
    rodape(d, w, h)
    return im


def fig_moldura():
    w, h = 1800, 1050
    im, d = tela(w, h)
    texto(d, (40, 30), "GT-02 · Moldura de escavação (5 unidades)", 30, True)
    # PLANTA: 1 cm = 3,6 px
    s = 3.6
    ox, oy = 120, 170
    lona = 130 * s
    d.rectangle([ox, oy, ox + lona, oy + lona], outline=CINZA, width=2, fill=(245, 243, 238))
    m0 = 15 * s
    ix0, iy0 = ox + m0, oy + m0
    lado = 100 * s
    esp = 2 * s
    d.rectangle([ix0 - esp, iy0 - esp, ix0 + lado + esp, iy0 + lado + esp], fill=MADEIRA, outline=LINHA)
    d.rectangle([ix0, iy0, ix0 + lado, iy0 + lado], fill=ENCH1, outline=LINHA)
    for (cx, cy) in [(ix0, iy0), (ix0 + lado, iy0), (ix0, iy0 + lado), (ix0 + lado, iy0 + lado)]:
        d.ellipse([cx - 9, cy - 9, cx + 9, cy + 9], fill=(70, 70, 70))
    cx, cy = ix0 + lado, iy0 + lado
    d.ellipse([cx - 16, cy - 16, cx + 16, cy + 16], outline=(170, 40, 30), width=3)
    texto(d, (cx + 22, cy + 22), "união desacoplável", 19, cor=(170, 40, 30))
    texto(d, (ox, oy - 40), "Planta", 24, True)
    cota_h(d, ix0, ix0 + lado, iy0 - 28, "≈ 100 cm (interior)")
    cota_h(d, ox, ox + lona, oy + lona + 40, "lona ≈ 130 × 130 cm (sobra ≈ 15 cm por lado)")
    texto(d, (ix0 + lado / 2, iy0 + lado / 2), "enchimento", 20, cor=CINZA, ancora="mm")
    texto(d, (ox, oy + lona + 80), "● dobradiça metálica reforçada, uma por canto (4)", 19)
    texto(d, (ox, oy + lona + 110), "2 fechos por moldura mantêm-na aberta em uso", 19)
    # ALÇADO: 1 cm = 6 px
    ax, ay = 760, 230
    sa = 4.6
    largura = 100 * sa
    alt = 20 * sa
    texto(d, (ax, ay - 70), "Alçado (modelo 1, duas camadas)", 24, True)
    base = ay + 160
    d.rectangle([ax - 20, base, ax + largura + 20, base + 6], fill=CINZA)
    d.rectangle([ax, base - alt, ax + 10, base], fill=MADEIRA, outline=LINHA)
    d.rectangle([ax + largura - 10, base - alt, ax + largura, base], fill=MADEIRA, outline=LINHA)
    c1 = 7 * sa
    c2 = 7 * sa
    d.rectangle([ax + 10, base - c1, ax + largura - 10, base], fill=ENCH2)
    d.rectangle([ax + 10, base - c1 - c2, ax + largura - 10, base - c1], fill=ENCH1)
    texto(d, (ax + largura / 2, base - c1 / 2), "camada inferior", 17, ancora="mm")
    texto(d, (ax + largura / 2, base - c1 - c2 / 2), "camada superior", 17, ancora="mm")
    cota_v(d, ax + largura + 40, base - alt, base, "20 cm (tábua)")
    cota_v(d, ax - 50, base - c1 - c2, base, "")
    texto(d, (ax - 60, base - (c1 + c2) / 2), "≤ 15 cm", 18, ancora="rm")
    texto(d, (ax, base + 30), "Bordo livre ≥ 5 cm (A2 §4.2). Espessura de cada camada fixa-se no protótipo.", 18)
    texto(d, (ax, base + 58), "Lona por baixo (modelos 1 e 2); sem lona no modelo 3 (solo, ≤ 10 cm).", 18)
    # DOBRAGEM
    dx, dy = 760, 620
    texto(d, (dx, dy - 50), "Dobragem e guarda", 24, True)
    sd = 3.0
    lt = 100 * sd
    # passo 1: quadrado aberto (pequeno)
    q = 70
    d.rectangle([dx, dy, dx + q, dy + q], outline=TINTA, width=6)
    texto(d, (dx + q / 2, dy + q + 24), "1. aberta", 18, ancora="mm")
    # passo 2: aberta numa linha (ziguezague)
    px = dx + 130
    for i in range(4):
        y = dy + 10 + i * 14
        d.line([(px + (0 if i % 2 == 0 else 20), y), (px + 200 + (0 if i % 2 == 0 else 20), y)], fill=TINTA, width=6)
    texto(d, (px + 110, dy + q + 24), "2. desacoplar e dobrar", 18, ancora="mm")
    # passo 3: pacote dobrado
    bx = dx + 420
    d.rectangle([bx, dy, bx + lt, dy + 30], fill=MADEIRA, outline=LINHA)
    cota_h(d, bx, bx + lt, dy - 12, "≈ 100 cm")
    texto(d, (bx + lt + 12, dy + 15), "≈ 20 × 9–10 cm (hipótese A2)", 18, ancora="lm")
    texto(d, (bx + lt / 2, dy + q + 24), "3. dobrada", 18, ancora="mm")
    # passo 4: saco
    sy = dy + 150
    d.rounded_rectangle([dx, sy, dx + 110 * sd, sy + 25 * sd * 0.8], radius=18, fill=(230, 222, 205), outline=LINHA, width=2)
    texto(d, (dx + 55 * sd, sy + 30), "saco", 18, ancora="mm")
    texto(d, (dx + 110 * sd + 20, sy + 30), "≈ 110 × 25 × 12 cm (hipótese A2), ou a lona do fundo usada como saco", 18, ancora="lm")
    texto(d, (dx, sy + 90), "Peso por moldura ≈ 8–10 kg com ferragens; lona ≈ 0,9–1,1 kg (hipóteses A2 §4.5, a pesar no protótipo).", 18)
    rodape(d, w, h)
    return im


def fig_implantacao():
    w, h = 1700, 1000
    im, d = tela(w, h)
    texto(d, (40, 30), "GT-03 · Implantação de cinco molduras", 30, True)
    s = 90  # 1 m = 90 px
    ox, oy = 120, 140
    # módulos 3 x 3 m: fila 1 com 3, fila 2 com 2
    pos = [(0, 0), (3, 0), (6, 0), (1.5, 3), (4.5, 3)]
    for i, (mx, my) in enumerate(pos, 1):
        x, y = ox + mx * s, oy + my * s
        d.rectangle([x, y, x + 3 * s, y + 3 * s], outline=CINZA, width=1, fill=ZONA)
        d.rectangle([x + s, y + s, x + 2 * s, y + 2 * s], fill=ENCH1, outline=MADEIRA, width=5)
        texto(d, (x + 1.5 * s, y + 1.5 * s), "M%d" % i, 22, True, ancora="mm")
        texto(d, (x + 1.5 * s, y + 2.6 * s), "circulação ≈ 1 m", 15, cor=CINZA, ancora="mm")
    # faixa de serviço
    fy = oy + 6 * s
    d.rectangle([ox, fy, ox + 9 * s, fy + 2 * s], fill=ZONA2, outline=CINZA)
    texto(d, (ox + 10, fy + 10), "Faixa de serviço", 20, True)
    d.rectangle([ox + 0.3 * s, fy + 0.6 * s, ox + 2.1 * s, fy + 1.3 * s], fill="white", outline=LINHA)
    texto(d, (ox + 1.2 * s, fy + 0.95 * s), "crivagem (a sotavento)", 15, ancora="mm")
    d.rectangle([ox + 2.6 * s, fy + 0.6 * s, ox + 4.6 * s, fy + 1.2 * s], fill="white", outline=LINHA)
    texto(d, (ox + 3.6 * s, fy + 0.9 * s), "mesa de triagem e registo", 15, ancora="mm")
    d.rectangle([ox + 5.0 * s, fy + 0.6 * s, ox + 6.6 * s, fy + 1.2 * s], fill="white", outline=(170, 40, 30), width=3)
    texto(d, (ox + 5.8 * s, fy + 0.9 * s), "mesa acessível", 15, ancora="mm")
    for k in range(5):
        cx = ox + 7.0 * s + k * 0.35 * s
        d.rectangle([cx, fy + 0.6 * s, cx + 0.3 * s, fy + 1.0 * s], fill=(200, 200, 195), outline=LINHA)
    texto(d, (ox + 7.9 * s, fy + 1.3 * s), "contentores ≤ 20–30 kg", 15, ancora="mm")
    # cotas
    cota_h(d, ox, ox + 9 * s, oy - 20, "≈ 9 m")
    cota_v(d, ox + 9 * s + 30, oy, fy + 2 * s, "≈ 8 m")
    # legenda
    lx = ox + 9 * s + 160
    leg = ["Módulo por moldura: ≈ 3 × 3 m = 9 m²",
           "(hipótese A2 §2, com circulação)",
           "Cinco molduras: ≈ 45 m²",
           "Com a faixa de serviço: ≈ 9 × 8 m",
           "",
           "Fita de balizamento à volta",
           "Contentores fora dos percursos",
           "Entrada e saída pela faixa de serviço",
           "Exterior: sombra de Maio a Setembro",
           "Área real confirma-se na visita prévia"]
    for i, l in enumerate(leg):
        texto(d, (lx, oy + 20 + i * 36), l, 19)
    texto(d, (ox, fy + 2 * s + 30), "↑ entrada · acesso de viatura e carrinho do lado da faixa de serviço", 18, cor=CINZA)
    rodape(d, w, h)
    return im


def fig_mosaicos():
    w, h = 1600, 980
    im, d = tela(w, h)
    texto(d, (40, 30), "GT-04 · Oficina de mosaicos: seis mesas, doze postos", 30, True)
    s = 140  # 1 m = 140 px
    ox, oy = 120, 170
    for r in range(2):
        for c in range(3):
            x = ox + c * (1.2 + 1.3) * s
            y = oy + r * (0.6 + 1.5) * s
            d.rectangle([x, y, x + 1.2 * s, y + 0.6 * s], fill=ZONA, outline=LINHA, width=2)
            for k in range(2):
                bx = x + 0.15 * s + k * 0.5 * s
                d.rectangle([bx, y + 0.12 * s, bx + 0.4 * s, y + 0.42 * s], fill="white", outline=TINTA)
            for k in range(2):
                cx = x + 0.35 * s + k * 0.5 * s
                d.ellipse([cx - 18, y + 0.6 * s + 12, cx + 18, y + 0.6 * s + 48], outline=CINZA, width=2)
    x0 = ox
    y0 = oy
    cota_h(d, x0, x0 + 1.2 * s, y0 - 18, "≈ 120 cm")
    cota_v(d, x0 - 40, y0, y0 + 0.6 * s, "")
    texto(d, (x0 - 48, y0 + 0.3 * s), "≈ 60 cm", 18, ancora="rm")
    # mesa de distribuição
    d.rectangle([ox, oy + 4.4 * s, ox + 2.4 * s, oy + 4.4 * s + 0.6 * s], fill=ZONA2, outline=LINHA, width=2)
    texto(d, (ox + 1.2 * s, oy + 4.7 * s), "mesa de distribuição (bolsas por cor)", 16, ancora="mm")
    d.rectangle([ox + 2.7 * s, oy + 4.4 * s, ox + 3.9 * s, oy + 5.0 * s], fill="white", outline=(170, 40, 30), width=3)
    texto(d, (ox + 3.3 * s, oy + 4.7 * s), "mesa acessível", 16, ancora="mm")
    leg = ["□ base de trabalho até 30 × 40 cm",
           "○ lugar sentado",
           "Seis mesas ≈ 120 × 60 cm (hipótese A2 §2)",
           "Doze postos individuais, ou pares e trios",
           "Corredores entre mesas para cadeira de rodas",
           "e passagem do mediador",
           "Interior ou exterior abrigado do vento"]
    for i, l in enumerate(leg):
        texto(d, (ox + 4.4 * s, oy + 4.1 * s + i * 30 - 60), l, 18)
    rodape(d, w, h)
    return im


def fig_estratigrafia():
    w, h = 1500, 820
    im, d = tela(w, h)
    texto(d, (40, 30), "GT-05 · Posto de estratigrafia sobre mesa", 30, True)
    s = 7  # 1 cm = 7 px
    # vista frontal
    ox, oy = 140, 200
    texto(d, (ox, oy - 80), "Vista frontal", 22, True)
    mesa_y = oy + 40 * s
    d.rectangle([ox - 80, mesa_y, ox + 40 * s + 80, mesa_y + 14], fill=MADEIRA, outline=LINHA)
    d.rectangle([ox - 40, mesa_y - 8, ox + 40 * s + 40, mesa_y], fill=(200, 200, 195), outline=LINHA)
    cores = [(150, 120, 90), (190, 160, 120), (120, 110, 100), (210, 190, 150), (170, 140, 100)]
    for i, c in enumerate(cores):
        y1 = oy + i * 8 * s
        d.rectangle([ox, y1, ox + 40 * s, y1 + 8 * s], fill=c)
    d.rectangle([ox, oy, ox + 40 * s, oy + 40 * s], outline=TINTA, width=3)
    cota_h(d, ox, ox + 40 * s, oy - 14, "≈ 40 cm")
    cota_v(d, ox + 40 * s + 110, oy, oy + 40 * s, "≈ 40 cm")
    texto(d, (ox, mesa_y + 30), "bandeja de contenção sob o posto", 18, cor=CINZA)
    # vista lateral
    lx = 760
    texto(d, (lx, oy - 80), "Vista lateral", 22, True)
    d.rectangle([lx - 60, mesa_y, lx + 15 * s + 100, mesa_y + 14], fill=MADEIRA, outline=LINHA)
    d.rectangle([lx, oy, lx + 15 * s, oy + 40 * s], fill=(225, 220, 210), outline=TINTA, width=3)
    cota_h(d, lx, lx + 15 * s, oy - 14, "≈ 15 cm")
    # notas
    nx = 1060
    notas = ["Legenda 1: caixa de acrílico 4–5 mm,", "compartimentos separáveis (A, a decidir)",
             "Legenda 2: moldura aberta e peças", "impressas pintadas (B, a decidir)", "",
             "4–6 observadores por posto (A2 §2)", "Mesa estável e nivelada,", "posto longe do bordo da mesa", "Transporte sempre vazio"]
    for i, l in enumerate(notas):
        texto(d, (nx, 200 + i * 34), l, 19)
    rodape(d, w, h)
    return im


def gerar_figuras():
    os.makedirs(FIGURAS, exist_ok=True)
    if Image is None:
        print("Pillow indisponível: usam-se as figuras existentes")
        return
    for nome, f in (("GT-01_unidade_de_carga.png", fig_unidade_carga),
                    ("GT-02_moldura_escavacao.png", fig_moldura),
                    ("GT-03_implantacao_cinco_molduras.png", fig_implantacao),
                    ("GT-04_mosaicos_mesas.png", fig_mosaicos),
                    ("GT-05_posto_estratigrafia.png", fig_estratigrafia)):
        f().save(os.path.join(FIGURAS, nome), dpi=(200, 200))


# ======================================================================== anexo III

P = {"Baixa": 1, "Média": 2, "Alta": 3}
G = {"Ligeira": 1, "Moderada": 2, "Grave": 3}
ACTIVIDADE = {
    "E1": "1 Escavação", "E2": "2 Mosaicos", "E3": "3 Estratigrafia", "E4": "4 Villa",
    "E5": "5 Numismática", "E6": "6 Digital", "E7": "7 Caça ao tesouro", "E8": "8 Caderno",
    "E9": "9 Quiz", "A": "A Mediação e livro", "B": "B Passaporte", "C": "C Quebra-cabeças",
    "D": "D Adolescentes",
}


def nivel(p, g):
    v = p * g
    return "Alto" if v >= 6 else "Médio" if v >= 3 else "Baixo"


def recolher_riscos():
    riscos = []
    for nome in ORDEM:
        caminho = os.path.join(TECNICO, nome)
        if not os.path.exists(caminho) or nome.startswith(("15_", "16_", "17_")):
            continue
        with open(caminho, encoding="utf-8") as fh:
            for l in fh:
                m = re.match(r"\|\s*([A-Z][0-9]?-R\d\d)\s*\|([^|]*)\|([^|]*)\|([^|]*)\|", l)
                if not m:
                    continue
                ident, risco = m.group(1), m.group(2).strip()
                pp = m.group(3).strip().split(" ")[0]
                gg = m.group(4).strip().split(" ")[0]
                if pp not in P or gg not in G:
                    continue  # remissões para riscos de outra actividade
                riscos.append((ident, risco, pp, gg))
    return riscos


def gerar_anexo_iii():
    riscos = recolher_riscos()
    linhas = [COPYRIGHT_MD, "", "# Anexo III — Matriz de riscos", ""]
    linhas.append(
        "A matriz junta os %d riscos mapeados nos capítulos 2 a 14. Cada risco tem a probabilidade e a gravidade "
        "atribuídas no seu capítulo, segundo a escala da secção 1.4. O nível resulta do produto das duas escalas "
        "(1 a 3 cada): Baixo até 2, Médio de 3 a 4, Alto de 6 a 9. As remissões para riscos de outra actividade "
        "(por exemplo, os riscos dos dispositivos no quiz) não se contam duas vezes. A matriz é uma apreciação "
        "qualitativa anterior aos pilotos e revê-se com os registos de ocorrências de cada teste (CRO §7.2). "
        "Este anexo é gerado pelo script do guia a partir das tabelas dos capítulos." % len(riscos))
    linhas += ["", "## III.1 Matriz probabilidade × gravidade", ""]
    linhas.append("| Probabilidade \\ Gravidade | Ligeira | Moderada | Grave |")
    linhas.append("|---|---|---|---|")
    for pp in ("Alta", "Média", "Baixa"):
        cel = []
        for gg in ("Ligeira", "Moderada", "Grave"):
            ids = [r[0] for r in riscos if r[2] == pp and r[3] == gg]
            cel.append(("%d: " % len(ids) + ", ".join(ids)) if ids else "0")
        linhas.append("| %s | %s |" % (pp, " | ".join(cel)))
    linhas += ["", "## III.2 Contagem por actividade e por nível", ""]
    linhas.append("| Actividade | Riscos | Alto | Médio | Baixo |")
    linhas.append("|---|---|---|---|---|")
    tot = [0, 0, 0, 0]
    for pref, nomeact in ACTIVIDADE.items():
        rs = [r for r in riscos if r[0].split("-")[0] == pref]
        n = [nivel(P[r[2]], G[r[3]]) for r in rs]
        c = [len(rs), n.count("Alto"), n.count("Médio"), n.count("Baixo")]
        tot = [a + b for a, b in zip(tot, c)]
        linhas.append("| %s | %d | %d | %d | %d |" % (nomeact, *c))
    linhas.append("| Total | %d | %d | %d | %d |" % tuple(tot))
    linhas += ["", "## III.3 Riscos de nível alto", "",
               "Estes riscos pedem a prevenção descrita no capítulo antes de qualquer piloto. Os riscos de gravidade "
               "«Grave», mesmo com probabilidade baixa, têm sempre um procedimento de resposta conhecido pelos "
               "mediadores antes da sessão.", ""]
    linhas.append("| ID | Actividade | Risco | Prob. | Grav. |")
    linhas.append("|---|---|---|---|---|")
    for r in riscos:
        if nivel(P[r[2]], G[r[3]]) == "Alto":
            linhas.append("| %s | %s | %s | %s | %s |" % (r[0], ACTIVIDADE[r[0].split("-")[0]], r[1], r[2], r[3]))
    linhas += ["", "## III.4 Riscos de gravidade grave e probabilidade baixa", ""]
    linhas.append("| ID | Actividade | Risco |")
    linhas.append("|---|---|---|")
    for r in riscos:
        if r[3] == "Grave" and r[2] == "Baixa":
            linhas.append("| %s | %s | %s |" % (r[0], ACTIVIDADE[r[0].split("-")[0]], r[1]))
    linhas.append("")
    with open(os.path.join(TECNICO, "17_anexo_III_matriz_riscos.md"), "w", encoding="utf-8") as fh:
        fh.write("\n".join(linhas))
    return riscos


# ======================================================================== DOCX

FONTE_TEXTO = "Georgia"
FONTE_TITULOS = "Arial"
COR_TINTA = (0x2B, 0x24, 0x20)
COR_SECUNDARIA = (0x6B, 0x5E, 0x55)
SOMBRA_CABECALHO = "E9E4DE"


def sombrear(celula, cor):
    tcPr = celula._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), cor)
    tcPr.append(shd)


def campo(paragrafo, instrucao, provisorio=""):
    for tipo, txt in (("begin", None), (None, instrucao), ("separate", None)):
        r = paragrafo.add_run()
        if tipo:
            fc = OxmlElement("w:fldChar")
            fc.set(qn("w:fldCharType"), tipo)
            if tipo == "begin":
                fc.set(qn("w:dirty"), "true")
            r._r.append(fc)
        else:
            it = OxmlElement("w:instrText")
            it.set(qn("xml:space"), "preserve")
            it.text = txt
            r._r.append(it)
    if provisorio:
        paragrafo.add_run(provisorio)
    r = paragrafo.add_run()
    fc = OxmlElement("w:fldChar")
    fc.set(qn("w:fldCharType"), "end")
    r._r.append(fc)


def lingua_pt(estilo):
    rPr = estilo.element.get_or_add_rPr()
    lang = OxmlElement("w:lang")
    lang.set(qn("w:val"), "pt-PT")
    rPr.append(lang)


def repetir_cabecalho(linha):
    trPr = linha._tr.get_or_add_trPr()
    el = OxmlElement("w:tblHeader")
    el.set(qn("w:val"), "true")
    trPr.append(el)


def nao_partir_linha(linha):
    trPr = linha._tr.get_or_add_trPr()
    el = OxmlElement("w:cantSplit")
    el.set(qn("w:val"), "true")
    trPr.append(el)


PADRAO = re.compile(r"(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|`[^`]*`)")


def escrever(p, txt, tamanho=None, negrito=False, cor=None, italico=False):
    for parte in PADRAO.split(txt):
        if not parte:
            continue
        if parte.startswith("**") and parte.endswith("**"):
            r = p.add_run(parte[2:-2])
            r.bold = True
        elif parte.startswith("*") and parte.endswith("*") and len(parte) > 2:
            r = p.add_run(parte[1:-1])
            r.italic = True
        elif parte.startswith("`") and parte.endswith("`"):
            r = p.add_run(parte[1:-1])
            r.font.name = "Courier New"
        else:
            r = p.add_run(parte)
        if tamanho:
            r.font.size = Pt(tamanho)
        if negrito:
            r.bold = True
        if italico:
            r.italic = True
        if cor:
            r.font.color.rgb = RGBColor(*cor)
    return p


def preparar():
    doc = Document()
    sec = doc.sections[0]
    sec.page_height, sec.page_width = Cm(29.7), Cm(21.0)
    sec.top_margin = sec.bottom_margin = Cm(2.2)
    sec.left_margin = sec.right_margin = Cm(2.0)
    sec.header_distance = sec.footer_distance = Cm(1.1)
    sec.different_first_page_header_footer = True
    st = doc.styles["Normal"]
    st.font.name = FONTE_TEXTO
    st.element.rPr.rFonts.set(qn("w:eastAsia"), FONTE_TEXTO)
    st.font.size = Pt(10.5)
    st.paragraph_format.space_after = Pt(6)
    st.paragraph_format.line_spacing = 1.15
    lingua_pt(st)
    for nome, tam, antes, depois in (("Heading 1", 17, 0, 12), ("Heading 2", 13, 14, 6), ("Heading 3", 11, 10, 4)):
        hs = doc.styles[nome]
        hs.font.name = FONTE_TITULOS
        rf = hs.element.rPr.rFonts
        for att in ("w:ascii", "w:hAnsi", "w:cs", "w:eastAsia"):
            rf.set(qn(att), FONTE_TITULOS)
        for att in ("w:asciiTheme", "w:hAnsiTheme", "w:eastAsiaTheme", "w:cstheme"):
            if rf.get(qn(att)) is not None:
                del rf.attrib[qn(att)]
        hs.font.size = Pt(tam)
        hs.font.bold = True
        hs.font.color.rgb = RGBColor(*COR_TINTA)
        hs.paragraph_format.space_before = Pt(antes)
        hs.paragraph_format.space_after = Pt(depois)
        hs.paragraph_format.keep_with_next = True
        lingua_pt(hs)
    cab = sec.header.paragraphs[0]
    cab.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    escrever(cab, "Guia Técnico · Circuito Educativo – Ruínas Romanas de Milreu", tamanho=8, cor=COR_SECUNDARIA)
    rod = sec.footer.paragraphs[0]
    rod.alignment = WD_ALIGN_PARAGRAPH.CENTER
    escrever(rod, "%s · rascunho para revisão · página " % VERSAO, tamanho=8, cor=COR_SECUNDARIA)
    campo(rod, "PAGE", "1")
    for r in rod.runs:
        r.font.size = Pt(8)
    el = OxmlElement("w:updateFields")
    el.set(qn("w:val"), "true")
    doc.settings.element.append(el)
    return doc


def capa(doc):
    def linha(txt, tam, negrito=False, cor=COR_TINTA, antes=0, depois=6, fonte_=FONTE_TITULOS):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(antes)
        p.paragraph_format.space_after = Pt(depois)
        r = p.add_run(txt)
        r.font.size = Pt(tam)
        r.bold = negrito
        r.font.name = fonte_
        r.font.color.rgb = RGBColor(*cor)
        return p

    linha("Projecto Comunitário de Milreu", 11, cor=COR_SECUNDARIA, antes=60)
    linha("Guia Técnico", 30, negrito=True, antes=24, depois=4)
    linha("Circuito Educativo – Ruínas Romanas de Milreu", 16, depois=10)
    linha("Preparação, instalação, operação e armazenamento, actividade a actividade", 12,
          cor=COR_SECUNDARIA, depois=60, fonte_=FONTE_TEXTO)
    linha("Para técnicos de museu, locais anfitriões e responsáveis de segurança", 11, depois=30, fonte_=FONTE_TEXTO)
    linha("Autor", 9, negrito=True, cor=COR_SECUNDARIA, depois=2)
    linha("Fernando Rodrigues de Jácomo", 11, depois=0, fonte_=FONTE_TEXTO)
    linha("Doutoramento em Arqueologia, Universidade do Algarve", 11, depois=24, fonte_=FONTE_TEXTO)
    linha("Versão %s · %s" % (VERSAO, DATA), 11, depois=4, fonte_=FONTE_TEXTO)
    linha("Rascunho interno para revisão. Nenhuma actividade foi ainda testada com público; "
          "as quantidades e áreas são valores de planeamento.", 10, negrito=True, depois=4, fonte_=FONTE_TEXTO)
    linha("© 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. "
          "Os direitos de terceiros mantêm-se com os respectivos titulares.", 8,
          cor=COR_SECUNDARIA, antes=80, fonte_=FONTE_TEXTO)


def indice(doc):
    h = doc.add_heading("Índice", level=1)
    h.paragraph_format.page_break_before = True
    p = doc.add_paragraph()
    campo(p, 'TOC \\o "1-2" \\h \\z \\u',
          "O índice é um campo do Word: ao abrir o ficheiro, aceitar a actualização dos campos "
          "ou usar «Actualizar campo» sobre este texto.")


def celulas(l):
    return [x.strip() for x in l.strip().strip("|").split("|")]


def tabela(doc, linhas):
    cab = celulas(linhas[0])
    corpo = [celulas(l) for l in linhas[2:]]
    n = len(cab)
    tam = 7 if n >= 7 else 7.5 if n >= 6 else 8.5 if n >= 4 else 9.5
    t = doc.add_table(rows=1 + len(corpo), cols=n)
    t.style = "Table Grid"
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    for j, txt in enumerate(cab):
        c = t.rows[0].cells[j]
        c.paragraphs[0].paragraph_format.space_after = Pt(0)
        escrever(c.paragraphs[0], txt, tamanho=tam, negrito=True)
        sombrear(c, SOMBRA_CABECALHO)
    repetir_cabecalho(t.rows[0])
    for i, fila in enumerate(corpo, start=1):
        nao_partir_linha(t.rows[i])
        for j in range(n):
            txt = fila[j] if j < len(fila) else ""
            c = t.rows[i].cells[j]
            pf = c.paragraphs[0].paragraph_format
            pf.space_after = Pt(0)
            pf.line_spacing = 1.0
            escrever(c.paragraphs[0], txt, tamanho=tam, negrito=fila[0].startswith("Total"))
    doc.add_paragraph().paragraph_format.space_after = Pt(2)


def figura(doc, caminho, legenda):
    f = os.path.normpath(os.path.join(TECNICO, caminho))
    if not os.path.exists(f):
        sys.exit("Figura em falta: %s" % f)
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.keep_with_next = True
    p.add_run().add_picture(f, width=Cm(16.5))
    lp = doc.add_paragraph()
    lp.paragraph_format.space_after = Pt(12)
    escrever(lp, legenda, tamanho=8.5, cor=COR_SECUNDARIA, italico=True)


ESTADO = {"h1": 0}


def processar(doc, texto):
    linhas = texto.split("\n")
    i = 0
    par = []

    def despejar():
        if par:
            escrever(doc.add_paragraph(), " ".join(s.strip() for s in par))
            par.clear()

    while i < len(linhas):
        s = linhas[i].strip()
        mf = re.match(r"<!--\s*figura:\s*(\S+)\s*\|\s*(.*?)\s*-->", s)
        if s.startswith("> ©"):
            pass
        elif mf:
            despejar()
            figura(doc, mf.group(1), mf.group(2))
        elif s.startswith("<!--"):
            despejar()
        elif s.startswith("#"):
            despejar()
            nivel_ = len(s) - len(s.lstrip("#"))
            h = doc.add_heading(s.lstrip("#").strip(), level=min(nivel_, 3))
            if nivel_ == 1:
                h.paragraph_format.page_break_before = True
            if nivel_ == 1:
                ESTADO["h1"] += 1
        elif s.startswith("|"):
            despejar()
            bloco = []
            while i < len(linhas) and linhas[i].strip().startswith("|"):
                bloco.append(linhas[i])
                i += 1
            tabela(doc, bloco)
            continue
        elif re.match(r"^[-*] ", s):
            despejar()
            p = doc.add_paragraph(style="List Bullet")
            p.paragraph_format.space_after = Pt(3)
            escrever(p, s[2:])
        elif re.match(r"^\d+\. ", s):
            despejar()
            num, resto = s.split(". ", 1)
            p = doc.add_paragraph()
            p.paragraph_format.left_indent = Cm(0.75)
            p.paragraph_format.first_line_indent = Cm(-0.5)
            p.paragraph_format.space_after = Pt(3)
            p.add_run(num + ". ")
            escrever(p, resto)
        elif s == "":
            despejar()
        else:
            par.append(s)
        i += 1
    despejar()


def main():
    gerar_figuras()
    riscos = gerar_anexo_iii()
    doc = preparar()
    capa(doc)
    primeiro = True
    for nome in ORDEM:
        with open(os.path.join(TECNICO, nome), encoding="utf-8") as fh:
            processar(doc, fh.read())
        if primeiro:
            indice(doc)
            primeiro = False
    os.makedirs(PRIVADO, exist_ok=True)
    saida = os.path.join(PRIVADO, "Guia_Tecnico_Circuito_Educativo_Milreu_%s.docx" % VERSAO)
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from estilo_ds import aplicar_ds
    aplicar_ds(doc)
    doc.save(saida)
    print("Riscos na matriz:", len(riscos))
    print("DOCX:", saida)


if __name__ == "__main__":
    main()
