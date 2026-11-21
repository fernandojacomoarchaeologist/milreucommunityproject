#!/usr/bin/env python3
# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar RIGHTS.md.
"""Gera os esquemas de organização do Guia Operacional do Circuito Educativo.

Cada esquema é um SVG escrito por este script (guias/source/esquemas/) e convertido
em PNG com o qlmanage do macOS (guias/operacional/figuras/). Os esquemas são
diagramas de organização do espaço e de sequência, elaborados para o guia: não
representam plantas, mosaicos ou objectos de Milreu e não estão à escala.

Uso: python3 -I build_esquemas.py
"""
import os
import subprocess
import tempfile

AQUI = os.path.dirname(os.path.abspath(__file__))
SVG_DIR = os.path.join(AQUI, "esquemas")
PNG_DIR = os.path.normpath(os.path.join(AQUI, "..", "operacional", "figuras"))

INK = "#1E1A17"
RED = "#A83227"
PAPER = "#FFFCF7"
GREY = "#7A716A"
FILL = "#F1EBE3"
FILL2 = "#E6DCCF"
W = 1600
FONT = "Helvetica, Arial, sans-serif"


def esc(t):
    return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


class Svg:
    def __init__(self, h):
        self.h = h
        self.off = (W - h) / 2  # conteúdo centrado num quadrado W×W (o qlmanage rasteriza em quadrado)
        self.el = []

    def rect(self, x, y, w, h, fill=FILL, stroke=INK, sw=3, rx=10, dash=None):
        d = f' stroke-dasharray="{dash}"' if dash else ""
        self.el.append(f'<rect x="{x}" y="{y + self.off}" width="{w}" height="{h}" rx="{rx}" '
                       f'fill="{fill}" stroke="{stroke}" stroke-width="{sw}"{d}/>')

    def circle(self, x, y, r, fill=RED, stroke="none"):
        self.el.append(f'<circle cx="{x}" cy="{y + self.off}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="3"/>')

    def text(self, x, y, s, size=30, fill=INK, anchor="middle", weight="normal"):
        self.el.append(f'<text x="{x}" y="{y + self.off}" font-family="{FONT}" font-size="{size}" '
                       f'fill="{fill}" text-anchor="{anchor}" font-weight="{weight}">{esc(s)}</text>')

    def lines(self, x, y, ls, size=28, fill=INK, anchor="middle", lh=1.25, weight="normal"):
        for i, s in enumerate(ls):
            self.text(x, y + i * size * lh, s, size, fill, anchor, weight)

    def box(self, x, y, w, h, title, body=(), fill=FILL, tsize=32, bsize=26, stroke=INK, dash=None):
        self.rect(x, y, w, h, fill=fill, stroke=stroke, dash=dash)
        self.text(x + w / 2, y + 48, title, tsize, INK, weight="bold")
        self.lines(x + w / 2, y + 48 + tsize * 1.3, list(body), bsize, INK)

    def arrow(self, x1, y1, x2, y2, color=INK, sw=4):
        self.el.append(f'<line x1="{x1}" y1="{y1 + self.off}" x2="{x2}" y2="{y2 + self.off}" stroke="{color}" '
                       f'stroke-width="{sw}" marker-end="url(#seta)"/>')

    def line(self, x1, y1, x2, y2, color=GREY, sw=3, dash=None):
        d = f' stroke-dasharray="{dash}"' if dash else ""
        self.el.append(f'<line x1="{x1}" y1="{y1 + self.off}" x2="{x2}" y2="{y2 + self.off}" stroke="{color}" stroke-width="{sw}"{d}/>')

    def mediador(self, x, y, label="M"):
        self.circle(x, y, 22, fill=RED)
        self.text(x, y + 9, label, 24, PAPER, weight="bold")

    def pessoa(self, x, y):
        self.circle(x, y, 14, fill=GREY)

    def rodape(self, s="Esquema de organização elaborado para este guia. Não está à escala e não representa Milreu."):
        self.text(W / 2, self.h - 22, s, 24, GREY)

    def guardar(self, nome):
        svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{W}" viewBox="0 0 {W} {W}">'
               f'<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. -->'
               f'<defs><marker id="seta" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">'
               f'<path d="M0,0 L12,6 L0,12 z" fill="{INK}"/></marker></defs>'
               f'<rect width="{W}" height="{W}" fill="{PAPER}"/>' + "".join(self.el) + "</svg>")
        p_svg = os.path.join(SVG_DIR, nome + ".svg")
        with open(p_svg, "w", encoding="utf8") as f:
            f.write(svg)
        with tempfile.TemporaryDirectory() as tmp:
            subprocess.run(["qlmanage", "-t", "-s", str(W), "-o", tmp, p_svg],
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
            png_tmp = os.path.join(tmp, nome + ".svg.png")
            subprocess.run(["sips", "-c", str(int(self.h)), str(W), png_tmp],
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
            dest = os.path.join(PNG_DIR, nome + ".png")
            os.replace(png_tmp, dest)
        print("ok", nome)


def legenda(s, x, y, items):
    """Pequena legenda: items = [(tipo, texto)]."""
    for i, (tipo, t) in enumerate(items):
        yy = y + i * 40
        if tipo == "M":
            s.mediador(x + 22, yy, "M")
        elif tipo == "P":
            s.pessoa(x + 22, yy)
        s.text(x + 60, yy + 9, t, 24, INK, anchor="start")


def circuito_integrado():
    s = Svg(900)
    s.text(W / 2, 60, "Circuito integrado: ordem pedagógica sugerida (nenhuma estação depende de outra)", 32, INK, weight="bold")
    xs = [60, 370, 680, 990, 1300]
    nomes = [("1 Escavação", ["simulada"]), ("2 Mosaicos", ["ou 3 Estratigrafia"]), ("3 Estratigrafia", ["ou 2 Mosaicos"]),
             ("4 Montagem", ["da villa"]), ("5 Laboratório", ["de Numismática"])]
    for x, (t, b) in zip(xs, nomes):
        s.box(x, 140, 240, 170, t, b, fill=FILL)
    for i in range(4):
        s.arrow(xs[i] + 240, 225, xs[i + 1] - 8, 225)
    s.text(W / 2, 390, "Complementos, em qualquer momento da visita", 30, RED, weight="bold")
    comp = [("6 Oficina digital", ["jogo de mosaicos", "jogo da villa"]), ("7 Caça ao tesouro", ["só nas ruínas"]),
            ("8 Caderno", ["6–10 anos"]), ("9 Quiz", ["três níveis"])]
    xs2 = [100, 470, 840, 1210]
    for x, (t, b) in zip(xs2, comp):
        s.box(x, 430, 290, 180, t, b, fill=FILL2)
    s.rect(100, 660, 1400, 150, fill=PAPER, stroke=RED, dash="14 10")
    s.lines(W / 2, 715, ["Transversais: passaporte (um carimbo por estação), texto e pictogramas em todos os postos,",
                         "mediação e desenhos para o livro, quebra-cabeças em dia de chuva ou como pista da caça ao tesouro"], 26)
    s.rodape("Esquema de organização elaborado para este guia, a partir das fontes do Circuito. Não está à escala.")
    s.guardar("ESQ-00_circuito_integrado")


def escavacao_turma():
    s = Svg(980)
    s.text(W / 2, 56, "Escavação simulada com uma turma: cinco molduras de 1 m × 1 m em paralelo", 32, INK, weight="bold")
    xs = [80, 380, 680, 980, 1280]
    for i, x in enumerate(xs):
        s.rect(x, 130, 240, 240, fill=FILL2)
        s.line(x + 120, 130, x + 120, 370, GREY, 2, "8 6")
        s.line(x, 250, x + 240, 250, GREY, 2, "8 6")
        s.text(x + 120, 115, f"Moldura {i + 1}", 26, INK, weight="bold")
        s.mediador(x + 120, 420)
        for k in range(3):
            s.pessoa(x + 40 + k * 80, 470)
        for k in range(3):
            s.pessoa(x + 40 + k * 80, 520)
    s.text(W / 2, 580, "Em cada moldura, 2 ou 3 participantes escavam enquanto os restantes crivam e registam; depois trocam de tarefa", 26)
    s.box(120, 630, 400, 200, "Crivagem", ["crivos sobre tabuleiro", "areia e cortiça separam-se", "tesselas recuperadas"])
    s.box(600, 630, 400, 200, "Triagem e registo", ["ficha de proveniência", "sacos etiquetados", "mala por categoria"])
    s.box(1080, 630, 400, 200, "Coordenação", ["regras em texto e pictogramas", "«achado especial»: ossos", "partilha final"], fill=PAPER, stroke=RED)
    legenda(s, 80, 880, [("M", "mediador (um por moldura)"), ("P", "participante")])
    s.rodape()
    s.guardar("ESQ-01_escavacao_turma")


def numismatica():
    s = Svg(900)
    s.text(W / 2, 56, "Laboratório de Numismática: mesa de trabalho para cinco ou seis grupos", 32, INK, weight="bold")
    s.rect(120, 120, 1360, 420, fill=FILL2)
    for i in range(6):
        x = 170 + i * 220
        s.box(x, 160, 190, 150, f"Bolsa {i + 1}", ["≈ 20 réplicas"], fill=PAPER, tsize=28, bsize=24)
        s.box(x, 330, 190, 150, "Tabuleiro", ["classificação", "com pistas"], fill=FILL, tsize=28, bsize=24)
    for i in range(6):
        x = 265 + i * 220
        for k in range(-1, 2):
            s.pessoa(x + k * 45, 580)
    s.box(120, 640, 560, 180, "Momento 1: identificar", ["tirar a bolsa, observar, ler pistas", "progressivas, posicionar cada moeda"])
    s.box(920, 640, 560, 180, "Momento 2: comprar", ["cartas de bens por época;", "regras de jogo, não preços romanos"])
    s.arrow(680, 730, 912, 730)
    s.mediador(800, 600)
    legenda(s, 1290, 590, [("M", "mediador"), ("P", "participante")])
    s.rodape()
    s.guardar("ESQ-05_numismatica_mesa")


def digital():
    s = Svg(820)
    s.text(W / 2, 56, "Oficina digital e quiz: dois postos partilhados", 32, INK, weight="bold")
    s.rect(120, 110, 820, 330, fill=FILL2)
    for i, (t, b) in enumerate([("Tablet 1", ["jogo de mosaicos", "ou quiz"]), ("Tablet 2", ["jogo da villa", "ou quiz"])]):
        s.box(170 + i * 390, 150, 330, 200, t, b, fill=PAPER)
        s.pessoa(335 + i * 390, 395)
    s.mediador(530, 470)
    s.box(1020, 110, 460, 330, "Zona de espera activa", ["caderno de actividades", "quebra-cabeças", "ou outra estação"], fill=FILL)
    s.arrow(1020, 275, 948, 275)
    s.box(120, 540, 1360, 180, "Regras do posto", ["conteúdo pré-carregado, sem depender de rede; instruções escritas e com pictogramas;",
                                                  "modo sem tempo para quem o pedir; alternativa por indicação verbal ao mediador"], fill=PAPER, stroke=RED)
    s.rodape()
    s.guardar("ESQ-06_digital_postos")


def caca():
    s = Svg(760)
    s.text(W / 2, 56, "Caça ao tesouro: sequência de uma carta", 32, INK, weight="bold")
    passos = [("1 Carta", ["de desafio", "imagem + pista"]), ("2 Procurar", ["só em zonas", "visitáveis"]),
              ("3 Registar", ["fotografia ou", "descrição oral"]), ("4 Validar", ["no ponto de", "validação"]),
              ("5 Receber", ["carta", "coleccionável"])]
    xs = [60, 370, 680, 990, 1300]
    for x, (t, b) in zip(xs, passos):
        s.box(x, 140, 240, 220, t, b, fill=FILL if x != 990 else PAPER, stroke=INK if x != 990 else RED)
    for i in range(4):
        s.arrow(xs[i] + 240, 250, xs[i + 1] - 8, 250)
    s.box(200, 430, 1200, 230, "Alternativas previstas", ["sem telemóvel: validação por descrição, observação ou escolha de imagem;",
                                                          "ponto inacessível: pista e imagem mediadas, sem dizer que substituem a visita;",
                                                          "percurso, fotografia e ponto de validação dependem da entidade que gere as ruínas"], fill=FILL2)
    s.rodape("Esquema de sequência elaborado para este guia. Não representa o percurso nas ruínas nem está à escala.")
    s.guardar("ESQ-07_caca_sequencia")


def caderno():
    s = Svg(880)
    s.text(W / 2, 56, "Caderno de actividades: brochura única de 20 a 30 páginas (6–10 anos)", 32, INK, weight="bold")
    temas = ["Onde fica Milreu", "Mosaicos: pintar", "Mosaicos: criar", "Bustos e pessoas", "Objectos",
             "A villa e os edifícios", "Produzir azeite e vinho", "Memória de Milreu", "Desenho livre", "Pequenos problemas"]
    for i, t in enumerate(temas):
        x = 90 + (i % 5) * 290
        y = 120 + (i // 5) * 170
        s.box(x, y, 260, 140, t, [], fill=FILL if i < 5 else FILL2, tsize=26)
    s.rect(90, 470, 1420, 70, fill=PAPER, stroke=GREY)
    s.text(W / 2, 515, "dificuldade crescente dentro da mesma brochura; instrução curta com pictograma em cada página", 26)
    s.arrow(130, 580, 1470, 580, RED, 5)
    s.box(90, 640, 440, 150, "Na estação", ["apoio a mosaicos e villa"])
    s.box(580, 640, 440, 150, "Em dia de chuva", ["actividade de interior"])
    s.box(1070, 640, 440, 150, "Em casa", ["sem obrigação de acabar"])
    s.rodape("Esquema de organização elaborado para este guia: os temas seguem as fontes; a paginação não está fixada.")
    s.guardar("ESQ-08_caderno_estrutura")


def quiz():
    s = Svg(820)
    s.text(W / 2, 56, "Quiz: três níveis de escolha livre e comentário a cada resposta", 32, INK, weight="bold")
    for i, (t, b) in enumerate([("Fácil", ["reconhecer imagens,", "2 ou 3 opções"]), ("Médio", ["relacionar edifícios,", "objectos e épocas"]),
                                ("Difícil", ["confrontar pistas", "e hipóteses"])]):
        s.box(120 + i * 470, 120, 420, 190, t, b, fill=FILL if i != 1 else FILL2)
    s.box(120, 400, 380, 170, "Pergunta", ["imagem + texto curto"], fill=PAPER)
    s.box(610, 400, 380, 170, "Resposta", ["toque, oral ou", "indicação ao mediador"], fill=PAPER)
    s.box(1100, 400, 380, 170, "Comentário", ["texto + pictograma;", "fonte da resposta"], fill=PAPER, stroke=RED)
    s.arrow(500, 485, 602, 485)
    s.arrow(990, 485, 1092, 485)
    s.line(1290, 570, 1290, 650)
    s.line(1290, 650, 310, 650)
    s.arrow(310, 650, 310, 580)
    s.text(800, 690, "próxima pergunta; modo sem tempo recomendado; a pontuação não penaliza hipóteses", 26)
    s.rodape()
    s.guardar("ESQ-09_quiz_niveis")


def livro():
    s = Svg(940)
    s.text(W / 2, 56, "Mediação e livro com as crianças: sequência de trabalho", 32, INK, weight="bold")
    passos = [("Oficina", ["de mosaicos"]), ("Conversa", ["o que sentiram"]), ("Mediação", ["história de Milreu"]),
              ("Desenho", ["individual"]), ("Conversa", ["sobre o desenho"])]
    xs = [60, 370, 680, 990, 1300]
    for x, (t, b) in zip(xs, passos):
        s.box(x, 130, 240, 170, t, b)
    for i in range(4):
        s.arrow(xs[i] + 240, 215, xs[i + 1] - 8, 215)
    s.line(1420, 300, 1420, 380)
    s.line(1420, 380, 180, 380)
    s.arrow(180, 380, 180, 432)
    passos2 = [("Devolução", ["às crianças e famílias", "antes de publicar"]), ("Edição", ["desenho da criança;", "texto adaptado pelo", "investigador, assinalado"]),
               ("Livro", ["50 páginas, digital", "e papel (500 ex.),", "publicação em dezembro de 2027"])]
    xs2 = [60, 580, 1100]
    for x, (t, b) in zip(xs2, passos2):
        s.box(x, 440, 440, 230, t, b, fill=FILL2 if x != 1100 else PAPER, stroke=INK if x != 1100 else RED)
    s.arrow(500, 555, 572, 555)
    s.arrow(1020, 555, 1092, 555)
    s.rect(60, 720, 1480, 120, fill=PAPER, stroke=RED, dash="14 10")
    s.lines(W / 2, 770, ["Antes do primeiro desenho: consentimento dos encarregados de educação, assentimento da criança,",
                         "autorização da escola, regras de dados, direitos sobre os desenhos e decisão sobre nomes ou pseudónimos"], 25)
    s.rodape()
    s.guardar("ESQ-A_livro_sequencia")


def passaporte():
    s = Svg(900)
    s.text(W / 2, 56, "Passaporte do Circuito: organização das páginas", 32, INK, weight="bold")
    s.rect(100, 110, 660, 600, fill=FILL2)
    s.text(430, 160, "Estações do Circuito", 30, INK, weight="bold")
    for i in range(9):
        x = 150 + (i % 3) * 200
        y = 200 + (i // 3) * 160
        s.rect(x, y, 160, 130, fill=PAPER, stroke=GREY, dash="8 6")
        s.text(x + 80, y + 75, f"carimbo {i + 1}", 24, GREY)
    s.rect(840, 110, 660, 600, fill=FILL)
    s.text(1170, 160, "Lugares parceiros (a acordar)", 30, INK, weight="bold")
    for i in range(10):
        x = 880 + (i % 5) * 122
        y = 210 + (i // 5) * 170
        s.rect(x, y, 104, 130, fill=PAPER, stroke=GREY, dash="8 6")
        s.text(x + 52, y + 75, f"{i + 1}", 26, GREY)
    s.lines(1170, 600, ["locais, carimbos e regras", "definidos com o Museu Municipal de Faro"], 24, INK)
    s.box(100, 750, 1400, 110, "Fecho: síntese «o que já sei» e prémio possível no museu, a definir com o museu", [], fill=PAPER, stroke=RED, tsize=28)
    s.rodape("Esquema elaborado para este guia: o número de lugares parceiros é uma meta e nenhum está confirmado.")
    s.guardar("ESQ-B_passaporte_paginas")


def puzzles():
    s = Svg(900)
    s.text(W / 2, 56, "Quebra-cabeças: dez mesas de 30 peças e uma zona para o A0 de grupo", 32, INK, weight="bold")
    for i in range(10):
        x = 80 + (i % 5) * 160
        y = 130 + (i // 5) * 230
        s.rect(x, y, 130, 130, fill=FILL2)
        s.text(x + 65, y + 75, f"Q{i + 1}", 28, INK, weight="bold")
        for k in range(2):
            s.pessoa(x + 40 + k * 50, y + 165)
    s.mediador(470, 620)
    s.rect(950, 110, 420, 594, fill=FILL, stroke=INK)
    s.text(1160, 160, "A0 (841 × 1189 mm)", 28, INK, weight="bold")
    for gx in range(5):
        s.line(950 + gx * 84, 110, 950 + gx * 84, 704, GREY, 1)
    for gy in range(8):
        s.line(950, 110 + gy * 74, 1370, 110 + gy * 74, GREY, 1)
    s.rect(1400, 210, 160, 220, fill=PAPER, stroke=RED, dash="10 8")
    s.lines(1480, 300, ["gabarito", "1:1"], 26, RED)
    for k in range(4):
        s.pessoa(990 + k * 110, 740)
    s.text(1160, 800, "circulação à volta do A0", 24, GREY)
    s.text(470, 680, "1 a 3 crianças por quebra-cabeças", 26)
    s.text(470, 720, "imagens montadas tornam-se pistas", 26)
    s.rodape()
    s.guardar("ESQ-C_puzzles_espaco")


def adolescentes():
    s = Svg(900)
    s.text(W / 2, 56, "Componente para adolescentes: três momentos com uma escola em 2027", 32, INK, weight="bold")
    m = [("Momento 1", ["roda de conversa com", "representantes de turma", "(o que interessa e afasta)"]),
         ("Momento 2", ["escavação simulada", "com divisão de papéis", "e, se autorizado, manuseio", "de materiais reais com luvas"]),
         ("Momento 3", ["visita a um sítio em", "escavação ou ao ICArEHB", "(UAlg), a combinar"])]
    xs = [60, 580, 1100]
    for x, (t, b) in zip(xs, m):
        s.box(x, 130, 440, 300, t, b, fill=FILL)
    s.arrow(500, 280, 572, 280)
    s.arrow(1020, 280, 1092, 280)
    papeis = ["escavar", "registar", "fotografar", "interpretar"]
    for i, p in enumerate(papeis):
        s.box(140 + i * 340, 500, 300, 110, p, [], fill=FILL2, tsize=28)
    s.text(W / 2, 660, "papéis rotativos dentro de cada moldura", 26)
    s.rect(60, 700, 1480, 130, fill=PAPER, stroke=RED, dash="14 10")
    s.lines(W / 2, 750, ["Presença de professores e assistentes operacionais da escola; autorização da entidade que detém",
                         "os materiais reais; autorização dos encarregados de educação para saídas e registos"], 25)
    s.rodape()
    s.guardar("ESQ-D_adolescentes_momentos")


if __name__ == "__main__":
    os.makedirs(SVG_DIR, exist_ok=True)
    os.makedirs(PNG_DIR, exist_ok=True)
    for f in (circuito_integrado, escavacao_turma, numismatica, digital, caca, caderno, quiz, livro,
              passaporte, puzzles, adolescentes):
        f()
