# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar RIGHTS.md.
"""Esquema dos três modelos de escavação simulada (Estação 1), segundo a decisão do responsável de 18-11-2026.

1. Padrão: moldura de 1 m × 1 m sem fundo rígido, quatro tábuas de ~20 cm com dobradiças, lona inferior amovível,
   duas camadas de enchimento (areia vegetal + granulado de cortiça) com réplicas.
2. Simplificado: quadriculagem com barbantes, para eventos menores.
3. Integrado no solo: só onde a intervenção for autorizada; escavação até 10 cm; corte aprumado e decapagem por
   camadas; só material biodegradável que possa voltar ao solo; réplicas em PLA sempre recolhidas.
Esquema elaborado para os guias, não à escala; cores e tipografia do design system (tokens v0.2).
Uso: python3 esquema_tres_modelos.py  (grava em ../operacional/figuras e ../tecnico/figuras)
"""
import os
import shutil

from PIL import Image, ImageDraw, ImageFont

AQUI = os.path.dirname(os.path.abspath(__file__))
SAIDA_OP = os.path.join(AQUI, "..", "operacional", "figuras", "ESQ-01b_tres_modelos_escavacao.png")
SAIDA_TEC = os.path.join(AQUI, "..", "tecnico", "figuras", "GT-02b_tres_modelos_escavacao.png")
FONTES = os.path.expanduser("~/Library/Fonts")

INK = (30, 26, 23)
INK6 = (94, 85, 77)
RED = (126, 37, 28)
PAPER = (255, 252, 247)
PAPER1 = (247, 241, 231)
BORDA = (181, 170, 155)
MADEIRA = (176, 132, 84)
AREIA = (222, 198, 150)
CORTICA = (150, 104, 66)
SOLO = (139, 110, 82)
SOLO2 = (120, 92, 66)
LONA = (90, 110, 120)
PECA = (240, 240, 236)


def fonte(nome, t):
    for f in (nome, "Archivo.ttf"):
        p = os.path.join(FONTES, f)
        if os.path.exists(p):
            return ImageFont.truetype(p, t)
    return ImageFont.load_default()


TIT = fonte("Fraunces.ttf", 46)
SUB = fonte("Archivo.ttf", 27)
TXT = fonte("Archivo.ttf", 23)
PEQ = fonte("Archivo.ttf", 20)


def texto(d, xy, s, f, cor=INK, anc="la"):
    d.text(xy, s, font=f, fill=cor, anchor=anc)


def bloco_texto(d, x, y, linhas, f=TXT, cor=INK6, passo=31):
    for ln in linhas:
        texto(d, (x, y), ln, f, cor)
        y += passo
    return y


def pecas(d, x0, y0, x1, y1, n=5):
    import random
    random.seed(7 + x0)
    for _ in range(n):
        cx = random.randint(x0 + 20, x1 - 20)
        cy = random.randint(y0 + 6, y1 - 6)
        d.ellipse([cx - 9, cy - 6, cx + 9, cy + 6], fill=PECA, outline=INK, width=2)


def painel_padrao(d, ox, oy, w):
    texto(d, (ox, oy), "1 · Modelo padrão", SUB, RED)
    # planta
    py = oy + 95
    lado = 260
    px = ox + (w - lado) // 2
    d.rectangle([px - 28, py - 28, px + lado + 28, py + lado + 28], fill=(205, 214, 218), outline=LONA, width=3)
    d.rectangle([px - 12, py - 12, px + lado + 12, py + lado + 12], fill=MADEIRA, outline=INK, width=2)
    d.rectangle([px, py, px + lado, py + lado], fill=AREIA, outline=INK, width=2)
    for cx, cy in ((px - 6, py - 6), (px + lado + 6, py - 6), (px - 6, py + lado + 6), (px + lado + 6, py + lado + 6)):
        d.ellipse([cx - 9, cy - 9, cx + 9, cy + 9], fill=INK6)
    texto(d, (px + lado // 2, py + lado + 44), "planta · 1 m × 1 m", PEQ, INK6, "ma")
    # corte
    cy = py + lado + 100
    d.rectangle([ox + 20, cy + 150, ox + w - 20, cy + 160], fill=LONA)
    d.rectangle([ox + 40, cy, ox + 56, cy + 150], fill=MADEIRA, outline=INK)
    d.rectangle([ox + w - 56, cy, ox + w - 40, cy + 150], fill=MADEIRA, outline=INK)
    d.rectangle([ox + 56, cy + 80, ox + w - 56, cy + 150], fill=CORTICA)
    d.rectangle([ox + 56, cy + 22, ox + w - 56, cy + 80], fill=AREIA)
    pecas(d, ox + 56, cy + 26, ox + w - 56, cy + 76, 4)
    pecas(d, ox + 56, cy + 84, ox + w - 56, cy + 146, 3)
    texto(d, (ox + w // 2, cy + 176), "corte · tábuas de ~20 cm com dobradiças, lona amovível", PEQ, INK6, "ma")
    bloco_texto(d, ox, cy + 230, [
        "Moldura de quatro tábuas articuladas, sem fundo",
        "rígido, sobre lona; duas camadas de enchimento",
        "(areia vegetal e granulado de cortiça) com réplicas.",
        "Dobra-se e guarda-se num saco ou na própria lona.",
        "Uso: turmas e circuito integrado.",
    ])


def painel_simplificado(d, ox, oy, w):
    texto(d, (ox, oy), "2 · Modelo simplificado", SUB, RED)
    py = oy + 95
    lado = 260
    px = ox + (w - lado) // 2
    d.rectangle([px, py, px + lado, py + lado], fill=AREIA, outline=INK6, width=2)
    for i in range(0, 5):
        x = px + i * lado // 4
        y = py + i * lado // 4
        d.line([(x, py - 18), (x, py + lado + 18)], fill=RED, width=3)
        d.line([(px - 18, y), (px + lado + 18, y)], fill=RED, width=3)
    for cx, cy in ((px, py), (px + lado, py), (px, py + lado), (px + lado, py + lado)):
        d.rectangle([cx - 7, cy - 7, cx + 7, cy + 7], fill=INK)
    pecas(d, px + 10, py + 10, px + lado - 10, py + lado - 10, 6)
    texto(d, (px + lado // 2, py + lado + 44), "planta · quadriculagem com barbantes", PEQ, INK6, "ma")
    cy = py + lado + 100
    d.rectangle([ox + 40, cy + 70, ox + w - 40, cy + 150], fill=AREIA, outline=INK6)
    for i in range(5):
        x = ox + 40 + i * (w - 80) // 4
        d.line([(x, cy + 40), (x, cy + 78)], fill=INK, width=4)
    d.line([(ox + 40, cy + 50), (ox + w - 40, cy + 50)], fill=RED, width=3)
    pecas(d, ox + 50, cy + 76, ox + w - 50, cy + 146, 4)
    texto(d, (ox + w // 2, cy + 176), "corte · estacas e barbantes sobre uma camada", PEQ, INK6, "ma")
    bloco_texto(d, ox, cy + 230, [
        "Quadriculagem marcada com barbantes, sem",
        "moldura de madeira, para registar a posição",
        "dos achados por quadrado.",
        "Montagem rápida e menos material.",
        "Uso: eventos menores.",
    ])


def painel_solo(d, ox, oy, w):
    texto(d, (ox, oy), "3 · Modelo integrado no solo", SUB, RED)
    py = oy + 95
    lado = 260
    px = ox + (w - lado) // 2
    d.rectangle([px - 30, py - 30, px + lado + 30, py + lado + 30], fill=(198, 186, 160))
    d.rectangle([px, py, px + lado, py + lado], fill=SOLO, outline=INK, width=3)
    for i in range(1, 4):
        d.line([(px + i * lado // 4, py), (px + i * lado // 4, py + lado)], fill=PAPER1, width=1)
        d.line([(px, py + i * lado // 4), (px + lado, py + i * lado // 4)], fill=PAPER1, width=1)
    pecas(d, px + 10, py + 10, px + lado - 10, py + lado - 10, 5)
    texto(d, (px + lado // 2, py + lado + 44), "planta · sondagem delimitada no terreno", PEQ, INK6, "ma")
    cy = py + lado + 100
    d.rectangle([ox + 20, cy + 40, ox + w - 20, cy + 160], fill=SOLO2)
    d.rectangle([ox + 20, cy + 40, ox + w - 20, cy + 50], fill=(120, 140, 90))
    d.rectangle([ox + 90, cy + 40, ox + w - 90, cy + 100], fill=SOLO, outline=INK, width=2)
    pecas(d, ox + 96, cy + 54, ox + w - 96, cy + 96, 3)
    d.line([(ox + 60, cy + 40), (ox + 60, cy + 100)], fill=RED, width=3)
    d.line([(ox + 52, cy + 40), (ox + 68, cy + 40)], fill=RED, width=3)
    d.line([(ox + 52, cy + 100), (ox + 68, cy + 100)], fill=RED, width=3)
    texto(d, (ox + 60, cy + 6), "até 10 cm", PEQ, RED, "ma")
    texto(d, (ox + w // 2, cy + 176), "corte · corte aprumado e decapagem por camadas", PEQ, INK6, "ma")
    bloco_texto(d, ox, cy + 230, [
        "Só onde a intervenção for autorizada.",
        "Escavação até 10 cm para ensinar técnicas:",
        "corte aprumado e decapagem por camadas.",
        "Só material biodegradável que possa voltar ao",
        "solo; réplicas em PLA sempre recolhidas.",
    ])


def main():
    W, H = 2400, 1180
    img = Image.new("RGB", (W, H), PAPER)
    d = ImageDraw.Draw(img)
    texto(d, (70, 48), "Estação 1 · Escavação simulada: três modelos de uso", TIT, INK)
    texto(d, (70, 112), "Esquema elaborado para este guia, não à escala. A escolha do modelo depende do público, do espaço e "
                        "das autorizações.", TXT, INK6)
    larg = (W - 70 * 2 - 60 * 2) // 3
    for i, painel in enumerate((painel_padrao, painel_simplificado, painel_solo)):
        ox = 70 + i * (larg + 60)
        d.rounded_rectangle([ox - 24, 170, ox + larg + 24, H - 40], radius=18, outline=BORDA, width=2, fill=PAPER)
        painel(d, ox, 196, larg)
    os.makedirs(os.path.dirname(SAIDA_OP), exist_ok=True)
    os.makedirs(os.path.dirname(SAIDA_TEC), exist_ok=True)
    img.save(SAIDA_OP, dpi=(200, 200))
    shutil.copyfile(SAIDA_OP, SAIDA_TEC)
    print(SAIDA_OP)


if __name__ == "__main__":
    main()
