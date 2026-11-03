#!/usr/bin/env python3
"""
© 2026 Fernando Rodrigues de Jácomo.
Produzido no âmbito do Projecto Comunitário de Milreu.
Consultar RIGHTS.md.

Detetives da Memória — gerador das ILUSTRAÇÕES DEMONSTRATIVAS e do catálogo de missões.
As ilustrações são desenhos esquemáticos próprios, criados só para testar as mecânicas do jogo:
não representam Milreu nem pertencem ao acervo. A geometria das pistas é calculada aqui a partir
do próprio desenho, para que o catálogo e a imagem nunca desalinhem.

Uso: python3 scripts/lab/build_detetives_assets.py   (escreve public/media/lab/detetives/*.svg e
public/data/lab/detetives-missions.json). Só biblioteca padrão.
"""
import json, math, os

W, H = 1600, 1000
BAND = 950  # faixa inferior com o aviso de demonstração (fora das pistas)
OUT_SVG = "public/media/lab/detetives"
OUT_JSON = "public/data/lab/detetives-missions.json"

# Paleta dos tokens do sistema de design (packages/design-tokens/v0.2) + tons intermédios
# derivados para o desenho (madeira, vegetação, céu). Cores chapadas, sem gradientes.
C = dict(paper0="#FFFFFF", paper50="#FFFCF7", paper100="#F7F1E7", paper150="#EEE7DB", paper200="#E9DECF",
         ink950="#1E1A17", ink700="#453D36", ink600="#5E554D", ink500="#766D64", ink300="#B5AA9B", ink200="#D8CFC2",
         red500="#A83227", red400="#C44738", red300="#E58A7C", red100="#F6DEDA", red700="#7E251C",
         ochre50="#FFF5D6", ochre="#D9B46A", patina500="#5E7267", patina300="#8FA294", patina200="#A9B8AC", patina100="#DFE7E2",
         info300="#8DB8C6", sky="#DCEBF0", sepia500="#8A6A4A", wood="#7A5C3F", woodDark="#5E4630", coffee="#6F4A2F")

DEMO = "Ilustração demonstrativa — não pertence ao acervo histórico de Milreu."


def n(v, axis):  # normaliza
    return round(v / (W if axis == "x" else H), 4)


def rot(points, cx, cy, deg):
    a = math.radians(deg)
    return [(cx + (x - cx) * math.cos(a) - (y - cy) * math.sin(a), cy + (x - cx) * math.sin(a) + (y - cy) * math.cos(a)) for x, y in points]


def poly_norm(points):
    return [[n(x, "x"), n(y, "y")] for x, y in points]


def circle(cx, cy, r):
    return {"type": "circle", "cx": n(cx, "x"), "cy": n(cy, "y"), "r": round(r / W, 4)}


def svg_doc(title, body):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-labelledby="t">
<title id="t">{title} — {DEMO}</title>
<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Ilustração demonstrativa do laboratório de jogos. -->
{body}
<rect x="0" y="{BAND}" width="{W}" height="{H-BAND}" fill="{C['ink950']}"/>
<text x="{W/2}" y="{BAND+33}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" fill="{C['paper50']}">{DEMO}</text>
</svg>
'''


# ───────────────────────── 00 — A mesa do investigador (tutorial) ─────────────────────────
def scene_desk():
    b = [f'<rect width="{W}" height="{BAND}" fill="{C["sepia500"]}"/>']
    for y in range(0, BAND, 158):
        b.append(f'<rect x="0" y="{y}" width="{W}" height="6" fill="{C["wood"]}"/>')
    for x, y, rx in [(210, 610, 26), (1330, 250, 20), (760, 880, 30), (1500, 700, 18)]:
        b.append(f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{rx*0.45:.0f}" fill="none" stroke="{C["wood"]}" stroke-width="5"/>')
    # régua no topo
    b.append(f'<g transform="rotate(-3 700 70)"><rect x="380" y="45" width="640" height="52" fill="{C["ochre"]}" stroke="{C["woodDark"]}" stroke-width="3"/>' + "".join(
        f'<rect x="{390+i*20}" y="45" width="3" height="{22 if i%5==0 else 12}" fill="{C["woodDark"]}"/>' for i in range(31)) + '</g>')
    # chávena (distractor)
    b.append(f'<circle cx="170" cy="190" r="100" fill="{C["paper100"]}" stroke="{C["ink300"]}" stroke-width="4"/>'
             f'<circle cx="170" cy="190" r="64" fill="{C["paper50"]}" stroke="{C["ink300"]}" stroke-width="4"/>'
             f'<circle cx="170" cy="190" r="50" fill="{C["coffee"]}"/><ellipse cx="152" cy="176" rx="14" ry="6" fill="{C["sepia500"]}"/>'
             f'<rect x="232" y="176" width="44" height="26" rx="12" fill="{C["paper50"]}" stroke="{C["ink300"]}" stroke-width="4"/>')
    # caderno aberto
    nb = [f'<rect x="242" y="312" width="560" height="470" fill="{C["woodDark"]}" opacity=".35"/>',
          f'<rect x="230" y="300" width="275" height="460" fill="{C["paper50"]}" stroke="{C["ink200"]}" stroke-width="3"/>',
          f'<rect x="505" y="300" width="275" height="460" fill="{C["paper50"]}" stroke="{C["ink200"]}" stroke-width="3"/>',
          f'<rect x="499" y="300" width="12" height="460" fill="{C["ink200"]}"/>']
    for i in range(14):
        y = 345 + i * 29
        nb.append(f'<line x1="250" y1="{y}" x2="485" y2="{y}" stroke="{C["paper200"]}" stroke-width="2"/>')
        nb.append(f'<line x1="525" y1="{y}" x2="760" y2="{y}" stroke="{C["paper200"]}" stroke-width="2"/>')
    for i, w in enumerate([190, 150, 205, 120, 180, 160, 90]):
        nb.append(f'<path d="M260 {370+i*29} q{w/4} -9 {w/2} 0 t{w/2} 0" fill="none" stroke="{C["ink500"]}" stroke-width="3" stroke-linecap="round"/>')
    # esboço de um arco (desenho genérico)
    nb.append(f'<path d="M560 700 v-120 a80 80 0 0 1 160 0 v120" fill="none" stroke="{C["ink600"]}" stroke-width="5"/>'
              f'<path d="M590 700 v-110 a50 50 0 0 1 100 0 v110" fill="none" stroke="{C["ink500"]}" stroke-width="3"/>'
              f'<line x1="540" y1="700" x2="740" y2="700" stroke="{C["ink600"]}" stroke-width="5"/>'
              f'<path d="M540 380 h190 M540 410 h140 M540 440 h170" stroke="{C["ink500"]}" stroke-width="3"/>')
    b.append(f'<g transform="rotate(-4 505 530)">{"".join(nb)}</g>')
    # fotografias soltas (distractores)
    for x, y, a in [(880, 110, 8), (1010, 150, -6)]:
        b.append(f'<g transform="rotate({a} {x+90} {y+70})"><rect x="{x}" y="{y}" width="180" height="140" fill="{C["paper0"]}" stroke="{C["ink300"]}" stroke-width="3"/>'
                 f'<rect x="{x+12}" y="{y+12}" width="156" height="98" fill="{C["sky"]}"/>'
                 f'<path d="M{x+12} {y+110} l40 -45 l30 25 l40 -50 l46 70 z" fill="{C["patina300"]}"/></g>')
    # planta (distractor)
    b.append(f'<circle cx="1470" cy="170" r="78" fill="{C["red400"]}"/><circle cx="1470" cy="170" r="58" fill="{C["woodDark"]}"/>' + "".join(
        f'<ellipse cx="{1470+math.cos(math.radians(a))*55:.0f}" cy="{170+math.sin(math.radians(a))*55:.0f}" rx="46" ry="20" transform="rotate({a} {1470+math.cos(math.radians(a))*55:.0f} {170+math.sin(math.radians(a))*55:.0f})" fill="{C["patina500"]}"/>' for a in range(0, 360, 45)))
    # bússola (distractor)
    b.append(f'<circle cx="1440" cy="460" r="70" fill="{C["paper100"]}" stroke="{C["ink700"]}" stroke-width="6"/>'
             f'<path d="M1440 400 l14 60 l-14 60 l-14 -60 z" fill="{C["red500"]}"/><circle cx="1440" cy="460" r="7" fill="{C["ink950"]}"/>')
    # PISTA 1 — lupa
    lx, ly = 1060, 330
    handle = rot([(lx + 70, ly + 62), (lx + 200, ly + 192), (lx + 176, ly + 216), (lx + 46, ly + 86)], lx, ly, 0)
    b.append(f'<polygon points="{" ".join(f"{x:.0f},{y:.0f}" for x,y in handle)}" fill="{C["woodDark"]}" stroke="{C["ink950"]}" stroke-width="4"/>'
             f'<circle cx="{lx}" cy="{ly}" r="88" fill="{C["sky"]}" stroke="{C["ink950"]}" stroke-width="18"/>'
             f'<path d="M{lx-50} {ly-30} a60 60 0 0 1 40 -32" fill="none" stroke="{C["paper0"]}" stroke-width="10" stroke-linecap="round"/>')
    # PISTA 2 — envelope com selo
    ex, ey = 1010, 560
    b.append(f'<g transform="rotate(5 {ex+190} {ey+115})"><rect x="{ex}" y="{ey}" width="380" height="230" fill="{C["paper100"]}" stroke="{C["ink300"]}" stroke-width="4"/>'
             f'<path d="M{ex} {ey} l190 120 l190 -120" fill="none" stroke="{C["ink300"]}" stroke-width="4"/>'
             f'<path d="M{ex+40} {ey+170} h150 M{ex+40} {ey+195} h110" stroke="{C["ink500"]}" stroke-width="5"/></g>')
    sx, sy, sw, sh = 1296, 586, 64, 78
    stamp = rot([(sx, sy), (sx + sw, sy), (sx + sw, sy + sh), (sx, sy + sh)], ex + 190, ey + 115, 5)
    b.append(f'<g transform="rotate(5 {ex+190} {ey+115})"><rect x="{sx}" y="{sy}" width="{sw}" height="{sh}" fill="{C["red500"]}"/>' +
             "".join(f'<circle cx="{sx+i*8}" cy="{sy}" r="3.5" fill="{C["paper100"]}"/><circle cx="{sx+i*8}" cy="{sy+sh}" r="3.5" fill="{C["paper100"]}"/>' for i in range(9)) +
             f'<rect x="{sx+8}" y="{sy+9}" width="{sw-16}" height="{sh-18}" fill="{C["red100"]}"/>'
             f'<path d="M{sx+18} {sy+52} l14 -18 l14 18 z" fill="{C["red500"]}"/><rect x="{sx+22}" y="{sy+52}" width="20" height="10" fill="{C["red500"]}"/></g>')
    # PISTA 3 — lápis
    px0, py0 = 300, 832
    pencil = [(px0 - 45, py0 - 15), (px0 + 360, py0 - 15), (px0 + 405, py0), (px0 + 360, py0 + 15), (px0 - 45, py0 + 15)]
    pencil_r = rot(pencil, 480, 832, -8)
    b.append(f'<g transform="rotate(-8 480 832)">'
             f'<rect x="{px0-45}" y="{py0-15}" width="25" height="30" rx="6" fill="{C["red300"]}"/>'
             f'<rect x="{px0-22}" y="{py0-15}" width="22" height="30" fill="{C["ink300"]}"/>'
             f'<rect x="{px0}" y="{py0-15}" width="360" height="30" fill="{C["red400"]}"/>'
             f'<rect x="{px0}" y="{py0-4}" width="360" height="8" fill="{C["red500"]}"/>'
             f'<polygon points="{px0+360},{py0-15} {px0+405},{py0} {px0+360},{py0+15}" fill="{C["paper100"]}"/>'
             f'<polygon points="{px0+390},{py0-5} {px0+405},{py0} {px0+390},{py0+5}" fill="{C["ink950"]}"/></g>')
    # clipes (distractor)
    b.append(f'<path d="M880 860 h60 a12 12 0 0 0 0 -24 h-52 a8 8 0 0 0 0 16 h44" fill="none" stroke="{C["ink300"]}" stroke-width="5"/>')
    hotspots = [
        dict(id="lupa", shape=circle(lx + 30, ly + 30, 130), title="A lupa", clue="Um instrumento que torna os pormenores maiores.",
             hint="Procura na mesa, à direita do caderno, perto do topo.", hintArea=dict(cx=n(1090, "x"), cy=n(360, "y"), r=0.13),
             discovery="Uma lupa aumenta os pormenores sem tocar no objecto. Serve para ler assinaturas, datas ou carimbos escritos em letra pequena em fotografias e documentos. Neste jogo, a tua lupa é o botão de ampliar: usa-o sempre que algo parecer pequeno demais."),
        dict(id="selo", shape={"type": "polygon", "points": poly_norm(stamp)}, title="O selo",
             clue="Uma pequena marca colada num envelope.", hint="Há um envelope em baixo, à direita. Olha para o canto de cima.",
             hintArea=dict(cx=n(1240, "x"), cy=n(660, "y"), r=0.12),
             discovery="Selos, carimbos e marcas de correio podem ajudar a perceber de onde veio um documento e em que época circulou. Numa investigação a sério, uma pista destas só conta quando é confirmada por outra fonte."),
        dict(id="lapis", shape={"type": "polygon", "points": poly_norm(pencil_r)}, title="O lápis",
             clue="Um objecto para tomar notas que se pode apagar.", hint="Está pousado na mesa, em baixo, debaixo do caderno.",
             hintArea=dict(cx=n(480, "x"), cy=n(830, "y"), r=0.14),
             discovery="Quem investiga toma notas a lápis: pode corrigir e não estraga papéis antigos. Anotar o que vês, onde e quando, é o primeiro passo para não confundir uma observação com uma suposição.")
    ]
    zones = [
        dict(id="z-chavena", label="Canto superior esquerdo", description="Uma chávena de café num pires.", x=n(170, "x"), y=n(190, "y")),
        dict(id="z-regua", label="Topo, ao centro", description="Uma régua de madeira.", x=n(700, "x"), y=n(70, "y")),
        dict(id="z-caderno", label="Centro-esquerda", description="Um caderno aberto com notas e o desenho de um arco.", x=n(505, "x"), y=n(520, "y")),
        dict(id="z-fotos", label="Topo, à direita do centro", description="Duas fotografias soltas de uma paisagem.", x=n(1000, "x"), y=n(190, "y")),
        dict(id="z-lupa", label="À direita do caderno, em cima", description="Um objecto redondo com cabo.", x=n(1090, "x"), y=n(360, "y")),
        dict(id="z-planta", label="Canto superior direito", description="Um vaso com uma planta.", x=n(1470, "x"), y=n(170, "y")),
        dict(id="z-bussola", label="Direita, ao meio", description="Uma bússola.", x=n(1440, "x"), y=n(460, "y")),
        dict(id="z-envelope", label="Em baixo, à direita", description="Um envelope com algo vermelho no canto.", x=n(1328, "x"), y=n(625, "y")),
        dict(id="z-lapis", label="Em baixo, à esquerda", description="Um objecto comprido e vermelho com ponta afiada.", x=n(480, "x"), y=n(832, "y")),
        dict(id="z-clipes", label="Em baixo, ao centro", description="Um clipe de papel.", x=n(910, "x"), y=n(850, "y"))
    ]
    return svg_doc("A mesa do investigador", "\n".join(b)), hotspots, zones


# ───────────────────────── 01 — O olhar do investigador (largo imaginário) ─────────────────────────
def house(x, y, w, h, roof, wall="paper50"):
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{C[wall]}" stroke="{C["ink300"]}" stroke-width="3"/>'
            f'<polygon points="{x-14},{y} {x+w/2},{y-roof} {x+w+14},{y}" fill="{C["red500"]}"/>'
            f'<rect x="{x}" y="{y+h-14}" width="{w}" height="14" fill="{C["ochre"]}"/>')


def window(x, y, w=70, h=90, shut="patina500"):
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{C["ink700"]}" stroke="{C["ink300"]}" stroke-width="3"/>'
            f'<rect x="{x-22}" y="{y}" width="20" height="{h}" fill="{C[shut]}"/><rect x="{x+w+2}" y="{y}" width="20" height="{h}" fill="{C[shut]}"/>')


def olive(x, y, s=1.0):
    return (f'<rect x="{x-12*s:.0f}" y="{y:.0f}" width="{24*s:.0f}" height="{110*s:.0f}" fill="{C["sepia500"]}"/>' +
            "".join(f'<circle cx="{x+dx*s:.0f}" cy="{y+dy*s:.0f}" r="{r*s:.0f}" fill="{C["patina500"] if i%2 else C["patina300"]}"/>'
                    for i, (dx, dy, r) in enumerate([(-50, -10, 52), (40, -20, 58), (0, -60, 60), (-20, 20, 40), (55, 25, 38)])))


def scene_square():
    b = [f'<rect width="{W}" height="{BAND}" fill="{C["sky"]}"/>',
         f'<circle cx="1380" cy="130" r="64" fill="{C["ochre50"]}"/>',
         f'<path d="M0 520 C220 400 420 470 640 420 S1080 380 1300 440 1500 400 1600 420 V700 H0 Z" fill="{C["patina200"]}"/>',
         f'<path d="M0 600 C300 520 600 600 900 560 S1400 540 1600 580 V700 H0 Z" fill="{C["patina300"]}"/>',
         f'<rect x="0" y="690" width="{W}" height="{BAND-690}" fill="{C["paper200"]}"/>']
    for i in range(0, W, 80):
        b.append(f'<path d="M{i} {720+(i//80)%2*30} h60" stroke="{C["ink200"]}" stroke-width="4"/>')
    for j, y in enumerate(range(800, BAND, 60)):
        b.append(f'<path d="M{(j%2)*40} {y} H{W}" stroke="{C["ink200"]}" stroke-width="3" stroke-dasharray="60 20"/>')
    # aves (distractores)
    for x, y in [(520, 150), (580, 180), (980, 110)]:
        b.append(f'<path d="M{x} {y} q12 -14 24 0 q12 -14 24 0" fill="none" stroke="{C["ink700"]}" stroke-width="4"/>')
    # torre com relógio
    b.append(f'<rect x="140" y="170" width="180" height="530" fill="{C["paper100"]}" stroke="{C["ink300"]}" stroke-width="3"/>'
             f'<polygon points="120,170 230,60 340,170" fill="{C["red500"]}"/>'
             f'<path d="M190 520 v-60 a40 40 0 0 1 80 0 v60 z" fill="{C["ink700"]}"/>'
             f'<rect x="200" y="600" width="60" height="100" fill="{C["sepia500"]}"/>')
    ck = (230, 300)
    b.append(f'<circle cx="{ck[0]}" cy="{ck[1]}" r="42" fill="{C["paper50"]}" stroke="{C["ink950"]}" stroke-width="6"/>' +
             "".join(f'<rect x="{ck[0]-2}" y="{ck[1]-36}" width="4" height="9" fill="{C["ink950"]}" transform="rotate({a} {ck[0]} {ck[1]})"/>' for a in range(0, 360, 30)) +
             f'<line x1="{ck[0]}" y1="{ck[1]}" x2="{ck[0]}" y2="{ck[1]-26}" stroke="{C["ink950"]}" stroke-width="5" stroke-linecap="round"/>'
             f'<line x1="{ck[0]}" y1="{ck[1]}" x2="{ck[0]+18}" y2="{ck[1]+8}" stroke="{C["red500"]}" stroke-width="5" stroke-linecap="round"/>')
    # casas
    b.append(house(390, 420, 300, 280, 70))
    b.append(window(440, 480) + window(580, 480) + f'<rect x="510" y="590" width="70" height="110" fill="{C["patina500"]}"/>')
    b.append(house(730, 360, 340, 340, 80, "paper100"))
    # janela do gato (pista)
    gx, gy = 860, 420
    b.append(window(gx, gy, 90, 100, "red400"))
    b.append(f'<path d="M{gx+20} {gy+100} v-38 l10 -22 l8 16 h14 l8 -16 l10 22 v38 z" fill="{C["ink950"]}"/>'
             f'<circle cx="{gx+38}" cy="{gy+68}" r="4" fill="{C["ochre50"]}"/><circle cx="{gx+52}" cy="{gy+68}" r="4" fill="{C["ochre50"]}"/>'
             f'<path d="M{gx+70} {gy+96} q16 -6 10 -26" fill="none" stroke="{C["ink950"]}" stroke-width="6" stroke-linecap="round"/>')
    b.append(window(770, 420, 60, 90) + window(980, 420, 60, 90) + f'<rect x="860" y="580" width="80" height="120" fill="{C["sepia500"]}"/>')
    for x in (770, 980):  # vasos com flores (distractores)
        b.append(f'<rect x="{x-6}" y="512" width="72" height="22" fill="{C["red400"]}"/>' +
                 "".join(f'<circle cx="{x+6+i*15}" cy="506" r="9" fill="{C["red300"] if i%2 else C["ochre"]}"/>' for i in range(5)))
    b.append(house(1110, 430, 330, 270, 60))
    b.append(window(1160, 490) + window(1300, 490) + f'<rect x="1415" y="300" width="36" height="80" fill="{C["paper100"]}" stroke="{C["ink300"]}" stroke-width="3"/>')
    # estendal (distractor)
    b.append(f'<path d="M690 470 Q710 500 730 470" fill="none" stroke="{C["ink500"]}" stroke-width="3"/>')
    # fonte central e cão (distractores)
    b.append(f'<ellipse cx="800" cy="800" rx="170" ry="44" fill="{C["ink300"]}"/><ellipse cx="800" cy="790" rx="150" ry="34" fill="{C["info300"]}"/>'
             f'<rect x="785" y="700" width="30" height="90" fill="{C["ink300"]}"/><ellipse cx="800" cy="700" rx="46" ry="14" fill="{C["ink300"]}"/>'
             f'<path d="M800 690 q-30 -40 -50 0 M800 690 q30 -40 50 0" fill="none" stroke="{C["info300"]}" stroke-width="5"/>')
    b.append(f'<ellipse cx="1000" cy="860" rx="52" ry="20" fill="{C["sepia500"]}"/><circle cx="1050" cy="846" r="18" fill="{C["sepia500"]}"/>'
             f'<path d="M1058 834 l10 -10 l2 16 z" fill="{C["woodDark"]}"/>')
    # banco e candeeiro (distractores)
    b.append(f'<rect x="420" y="800" width="190" height="16" fill="{C["sepia500"]}"/><rect x="430" y="816" width="12" height="40" fill="{C["woodDark"]}"/><rect x="588" y="816" width="12" height="40" fill="{C["woodDark"]}"/>'
             f'<rect x="1520" y="520" width="10" height="330" fill="{C["ink700"]}"/><path d="M1500 520 h50 l-10 -40 h-30 z" fill="{C["ink700"]}"/>')
    b.append(olive(80, 720) + olive(1540, 760, 0.9) + olive(330, 760, 0.7))
    # bicicleta encostada (pista)
    bx = 1180
    b.append(f'<g stroke="{C["ink950"]}" fill="none" stroke-width="6"><circle cx="{bx}" cy="770" r="46"/><circle cx="{bx+130}" cy="770" r="46"/></g>'
             f'<g stroke="{C["red500"]}" stroke-width="8" stroke-linecap="round" fill="none"><path d="M{bx} 770 L{bx+50} 700 L{bx+110} 700 L{bx+130} 770 M{bx+50} 700 L{bx+70} 770 L{bx+110} 700 M{bx} 770 L{bx+70} 770"/></g>'
             f'<path d="M{bx+38} 690 h30" stroke="{C["ink950"]}" stroke-width="10" stroke-linecap="round"/>'
             f'<path d="M{bx+110} 700 l6 -26 h22" fill="none" stroke="{C["ink950"]}" stroke-width="7" stroke-linecap="round"/>')
    hotspots = [
        dict(id="relogio", shape=circle(ck[0], ck[1], 62), title="O relógio da torre", clue="Algo que diz as horas a toda a gente do largo.",
             hint="Olha para cima, para a construção mais alta à esquerda.", hintArea=dict(cx=n(230, "x"), cy=n(300, "y"), r=0.1),
             discovery="Numa fotografia, um relógio visível pode indicar a hora a que a imagem foi feita, e as sombras podem confirmar ou contradizer essa hora. Comparar duas pistas é sempre mais seguro do que confiar só numa."),
        dict(id="gato", shape=circle(gx + 45, gy + 60, 70), title="O gato à janela", clue="Alguém está a espreitar de uma janela…",
             hint="Repara nas janelas da casa do meio, no primeiro andar.", hintArea=dict(cx=n(900, "x"), cy=n(470, "y"), r=0.12),
             discovery="Os pormenores escondidos nas margens de uma imagem mostram a vida do dia-a-dia que nem sempre era o assunto principal da fotografia. Janelas, portas e cantos revelam muitas vezes as pistas mais inesperadas."),
        dict(id="bicicleta", shape={"type": "polygon", "points": poly_norm([(bx-56, 670), (bx+186, 670), (bx+186, 826), (bx-56, 826)])}, title="A bicicleta",
             clue="Um meio de transporte que não precisa de motor.", hint="Procura junto à casa da direita, ao nível do chão.",
             hintArea=dict(cx=n(1250, "x"), cy=n(750, "y"), r=0.12),
             discovery="Os meios de transporte que aparecem numa fotografia ajudam a situá-la no tempo, porque mudam de forma ao longo dos anos. Mas atenção: um objecto antigo também pode aparecer numa fotografia recente.")
    ]
    zones = [
        dict(id="z-torre", label="Esquerda, em cima", description="Uma torre alta com telhado vermelho e um mostrador redondo.", x=n(230, "x"), y=n(300, "y")),
        dict(id="z-sol", label="Céu, à direita", description="O sol.", x=n(1380, "x"), y=n(130, "y")),
        dict(id="z-aves", label="Céu, ao centro", description="Aves a voar.", x=n(560, "x"), y=n(165, "y")),
        dict(id="z-casa1", label="Casa da esquerda", description="Uma casa branca com duas janelas e uma porta verde.", x=n(540, "x"), y=n(560, "y")),
        dict(id="z-janela", label="Casa do meio, primeiro andar", description="Uma janela com portadas vermelhas e algo escuro lá dentro.", x=n(905, "x"), y=n(480, "y")),
        dict(id="z-vasos", label="Casa do meio, varandas", description="Vasos com flores nas janelas.", x=n(805, "x"), y=n(510, "y")),
        dict(id="z-fonte", label="Centro do largo", description="Uma fonte com água.", x=n(800, "x"), y=n(780, "y")),
        dict(id="z-cao", label="Chão, à direita da fonte", description="Um cão deitado.", x=n(1020, "x"), y=n(855, "y")),
        dict(id="z-banco", label="Chão, à esquerda", description="Um banco de madeira.", x=n(515, "x"), y=n(810, "y")),
        dict(id="z-bicicleta", label="Junto à casa da direita", description="Duas rodas e uma armação vermelha.", x=n(1245, "x"), y=n(750, "y")),
        dict(id="z-candeeiro", label="Extremo direito", description="Um candeeiro de rua.", x=n(1525, "x"), y=n(600, "y"))
    ]
    return svg_doc("O olhar do investigador", "\n".join(b)), hotspots, zones


# ───────────────────────── 02 — O arquivo das memórias ─────────────────────────
def scene_archive():
    b = [f'<rect width="{W}" height="700" fill="{C["paper150"]}"/>', f'<rect y="700" width="{W}" height="{BAND-700}" fill="{C["sepia500"]}"/>']
    for x in range(0, W, 140):
        b.append(f'<rect x="{x}" y="700" width="4" height="{BAND-700}" fill="{C["wood"]}"/>')
    b.append(f'<rect y="690" width="{W}" height="14" fill="{C["woodDark"]}"/>')
    # janela (distractor)
    b.append(f'<rect x="110" y="90" width="300" height="290" fill="{C["sky"]}" stroke="{C["paper50"]}" stroke-width="14"/>'
             f'<path d="M260 90 v290 M110 235 h300" stroke="{C["paper50"]}" stroke-width="10"/>'
             f'<path d="M117 330 C180 290 250 320 403 300 V373 H117 Z" fill="{C["patina300"]}"/>')
    # relógio de parede e quadro rectangular (distractores)
    b.append(f'<circle cx="1010" cy="170" r="52" fill="{C["paper50"]}" stroke="{C["woodDark"]}" stroke-width="8"/>'
             f'<path d="M1010 170 v-32 M1010 170 l22 12" stroke="{C["ink950"]}" stroke-width="5" stroke-linecap="round"/>')
    b.append(f'<rect x="930" y="290" width="150" height="110" fill="{C["paper100"]}" stroke="{C["sepia500"]}" stroke-width="10"/>'
             f'<path d="M945 385 l40 -50 l30 30 l20 -20 l30 40 z" fill="{C["patina300"]}"/>')
    # MAPA (pista)
    mx, my, mw, mh = 500, 110, 360, 270
    b.append(f'<g transform="rotate(-2 {mx+mw/2} {my+mh/2})"><rect x="{mx}" y="{my}" width="{mw}" height="{mh}" fill="{C["ochre50"]}" stroke="{C["ink300"]}" stroke-width="4"/>'
             f'<path d="M{mx+20} {my+60} C{mx+120} {my+40} {mx+150} {my+160} {mx+240} {my+150} S{mx+330} {my+220} {mx+345} {my+250}" fill="none" stroke="{C["info300"]}" stroke-width="12"/>'
             f'<path d="M{mx+30} {my+230} L{mx+150} {my+120} L{mx+300} {my+70}" fill="none" stroke="{C["ink500"]}" stroke-width="5" stroke-dasharray="14 10"/>' +
             "".join(f'<path d="M{mx+x} {my+y} l16 -26 l16 26 z" fill="{C["patina500"]}"/>' for x, y in [(60, 140), (90, 160), (250, 110), (280, 125)]) +
             f'<path d="M{mx+190} {my+200} l20 20 m0 -20 l-20 20" stroke="{C["red500"]}" stroke-width="7" stroke-linecap="round"/>'
             f'<path d="M{mx+320} {my+40} v-26 l-8 12 m8 -12 l8 12" stroke="{C["ink700"]}" stroke-width="4" fill="none"/>'
             + "".join(f'<circle cx="{x}" cy="{y}" r="9" fill="{C["red500"]}"/>' for x, y in [(mx+14, my+14), (mx+mw-14, my+14), (mx+14, my+mh-14), (mx+mw-14, my+mh-14)]) + '</g>')
    map_poly = rot([(mx, my), (mx + mw, my), (mx + mw, my + mh), (mx, my + mh)], mx + mw / 2, my + mh / 2, -2)
    # estante (distractores)
    b.append(f'<rect x="1160" y="70" width="400" height="630" fill="{C["woodDark"]}"/>')
    for row, y in enumerate([90, 245, 400, 555]):
        b.append(f'<rect x="1175" y="{y}" width="370" height="140" fill="{C["wood"]}"/>')
        x = 1185
        for k in range(6 if row % 2 else 3):
            if row % 2:  # livros
                w = 30 + (k * 7) % 18
                col = [C["red500"], C["patina500"], C["ink700"], C["sepia500"], C["red700"], C["ink500"]][k % 6]
                b.append(f'<rect x="{x}" y="{y+18}" width="{w}" height="122" fill="{col}"/><rect x="{x+6}" y="{y+40}" width="{w-12}" height="8" fill="{C["paper100"]}"/>')
                x += w + 6
            else:  # caixas de arquivo
                b.append(f'<rect x="{x}" y="{y+30}" width="110" height="110" fill="{C["ink200"] if k%2 else C["ink300"]}" stroke="{C["ink500"]}" stroke-width="3"/>'
                         f'<rect x="{x+25}" y="{y+55}" width="60" height="28" fill="{C["paper50"]}"/><path d="M{x+32} {y+66} h46 M{x+32} {y+75} h30" stroke="{C["ink500"]}" stroke-width="3"/>')
                x += 120
    # globo na estante (distractor)
    b.append(f'<circle cx="1490" cy="335" r="40" fill="{C["info300"]}" stroke="{C["ink700"]}" stroke-width="5"/><path d="M1470 315 q20 10 10 30 q20 0 25 -20" fill="{C["patina300"]}"/>')
    # mesa
    b.append(f'<rect x="430" y="610" width="660" height="34" fill="{C["woodDark"]}"/><rect x="460" y="644" width="26" height="240" fill="{C["woodDark"]}"/><rect x="1034" y="644" width="26" height="240" fill="{C["woodDark"]}"/>')
    # álbum aberto (distractor)
    b.append(f'<path d="M470 610 l20 -60 h120 l10 60 z" fill="{C["paper50"]}" stroke="{C["ink300"]}" stroke-width="3"/><path d="M620 610 l10 -60 h120 l20 60 z" fill="{C["paper50"]}" stroke="{C["ink300"]}" stroke-width="3"/>'
             f'<rect x="510" y="566" width="40" height="30" fill="{C["ink300"]}"/><rect x="560" y="566" width="40" height="30" fill="{C["ink200"]}"/><rect x="650" y="566" width="40" height="30" fill="{C["ink300"]}"/><rect x="700" y="566" width="40" height="30" fill="{C["ink200"]}"/>')
    # máquina de escrever (distractor)
    b.append(f'<path d="M780 610 l15 -55 h140 l15 55 z" fill="{C["ink700"]}"/><rect x="815" y="525" width="100" height="34" fill="{C["paper50"]}"/>' +
             "".join(f'<circle cx="{805+i*16}" cy="595" r="5" fill="{C["paper100"]}"/>' for i in range(9)))
    # MOLDURA OVAL (pista)
    ox, oy = 1010, 540
    b.append(f'<rect x="{ox-6}" y="{oy+50}" width="12" height="22" fill="{C["sepia500"]}"/><ellipse cx="{ox}" cy="{oy}" rx="42" ry="56" fill="{C["ochre"]}" stroke="{C["sepia500"]}" stroke-width="8"/>'
             f'<ellipse cx="{ox}" cy="{oy}" rx="28" ry="40" fill="{C["ink300"]}"/><circle cx="{ox}" cy="{oy-10}" r="12" fill="{C["ink500"]}"/><path d="M{ox-22} {oy+34} q22 -34 44 0" fill="{C["ink500"]}"/>')
    # candeeiro de mesa (distractor)
    b.append(f'<rect x="440" y="590" width="40" height="20" fill="{C["ink700"]}"/><path d="M460 590 l20 -90" stroke="{C["ink700"]}" stroke-width="7"/><path d="M450 520 l40 -40 l40 40 z" fill="{C["patina500"]}"/>')
    # cadeira (distractor)
    b.append(f'<rect x="1100" y="720" width="20" height="170" fill="{C["woodDark"]}"/><rect x="1100" y="790" width="140" height="18" fill="{C["woodDark"]}"/><rect x="1220" y="790" width="20" height="100" fill="{C["woodDark"]}"/>')
    # CÂMARA DE FOLE no tripé (pista)
    cx0, cy0 = 130, 470
    b.append(f'<path d="M{cx0+60} {cy0+95} L{cx0-20} {cy0+420} M{cx0+70} {cy0+95} L{cx0+70} {cy0+430} M{cx0+80} {cy0+95} L{cx0+160} {cy0+420}" stroke="{C["sepia500"]}" stroke-width="10" stroke-linecap="round"/>'
             f'<rect x="{cx0}" y="{cy0}" width="130" height="95" fill="{C["ink950"]}"/>'
             f'<path d="M{cx0+130} {cy0+8} ' + "".join(f'l14 {6 if i%2==0 else -6} ' for i in range(1)) + f'L{cx0+210} {cy0+25} L{cx0+210} {cy0+70} L{cx0+130} {cy0+87} Z" fill="{C["ink700"]}"/>'
             + "".join(f'<path d="M{cx0+140+i*14} {cy0+12+i*2.5} v{71-i*5}" stroke="{C["ink950"]}" stroke-width="3"/>' for i in range(5)) +
             f'<rect x="{cx0+210}" y="{cy0+20}" width="22" height="55" fill="{C["ink950"]}"/><circle cx="{cx0+245}" cy="{cy0+47}" r="24" fill="{C["ink500"]}"/><circle cx="{cx0+245}" cy="{cy0+47}" r="13" fill="{C["info300"]}"/>'
             f'<rect x="{cx0+30}" y="{cy0-16}" width="50" height="16" fill="{C["ink700"]}"/>')
    hotspots = [
        dict(id="mapa", shape={"type": "polygon", "points": poly_norm(map_poly)}, title="O mapa desenhado à mão",
             clue="Um desenho que mostra caminhos e ribeiras.", hint="Está preso na parede, ao lado da janela.",
             hintArea=dict(cx=n(680, "x"), cy=n(245, "y"), r=0.15),
             discovery="Os mapas guardam nomes de lugares, caminhos e ribeiras que às vezes já mudaram. Comparar um mapa antigo com o terreno actual é uma das formas de perceber como os lugares se transformaram."),
        dict(id="moldura", shape=circle(ox, oy, 64), title="A fotografia na moldura oval",
             clue="Uma fotografia guardada numa moldura que não é rectangular.", hint="Procura em cima da mesa, perto da extremidade direita.",
             hintArea=dict(cx=n(1000, "x"), cy=n(560, "y"), r=0.1),
             discovery="As molduras e o formato das provas fotográficas podem dar pistas sobre a época e sobre o valor que a família dava a uma imagem. O verso de uma fotografia também pode guardar nomes e datas."),
        dict(id="camara", shape={"type": "polygon", "points": poly_norm([(cx0-12, cy0-24), (cx0+280, cy0-24), (cx0+280, cy0+110), (cx0-12, cy0+110)])}, title="A câmara de fole",
             clue="O instrumento com que se faziam as fotografias.", hint="Está à esquerda, montado num tripé de madeira.",
             hintArea=dict(cx=n(250, "x"), cy=n(560, "y"), r=0.13),
             discovery="Repara na parte dobrada como um acordeão: o fole servia para focar a imagem. Saber como uma fotografia foi feita ajuda a perceber o que ela mostra e o que ficou de fora do enquadramento.")
    ]
    zones = [
        dict(id="z-janela", label="Parede, à esquerda", description="Uma janela com vista para uma colina.", x=n(260, "x"), y=n(235, "y")),
        dict(id="z-mapa", label="Parede, ao centro", description="Uma folha presa com alfinetes vermelhos, com linhas e uma cruz.", x=n(680, "x"), y=n(245, "y")),
        dict(id="z-relogio", label="Parede, à direita do centro", description="Um relógio de parede.", x=n(1010, "x"), y=n(170, "y")),
        dict(id="z-quadro", label="Parede, por baixo do relógio", description="Um quadro rectangular com uma paisagem.", x=n(1005, "x"), y=n(345, "y")),
        dict(id="z-estante", label="Direita", description="Uma estante com caixas de arquivo, livros e um globo.", x=n(1360, "x"), y=n(380, "y")),
        dict(id="z-album", label="Mesa, à esquerda", description="Um álbum de fotografias aberto.", x=n(620, "x"), y=n(585, "y")),
        dict(id="z-maquina", label="Mesa, ao centro", description="Uma máquina de escrever.", x=n(865, "x"), y=n(575, "y")),
        dict(id="z-moldura", label="Mesa, à direita", description="Um objecto oval de pé, com um retrato.", x=n(1010, "x"), y=n(540, "y")),
        dict(id="z-candeeiro", label="Mesa, extremo esquerdo", description="Um candeeiro de mesa.", x=n(480, "x"), y=n(540, "y")),
        dict(id="z-cadeira", label="Chão, à direita", description="Uma cadeira de madeira.", x=n(1170, "x"), y=n(800, "y")),
        dict(id="z-tripe", label="Esquerda, sobre o tripé", description="Uma caixa escura com uma parte em acordeão e uma lente.", x=n(250, "x"), y=n(517, "y"))
    ]
    return svg_doc("O arquivo das memórias", "\n".join(b)), hotspots, zones


def mission(order, mission_id, kind, title, description, opening, svg_name, alt, hotspots, zones, reward, difficulty):
    return {
        "missionId": mission_id, "order": order, "kind": kind, "title": title, "description": description,
        "difficulty": difficulty, "locale": "pt-PT", "opening": opening,
        "image": {"src": f"{OUT_SVG}/{svg_name}", "width": W, "height": H, "alt": alt, "memoryRef": None,
                  "credit": "Desenho: Projeto Comunitário de Milreu (laboratório de jogos)",
                  "provenance": DEMO, "demo": True},
        "editorial": {"publicationStatus": "lab-only", "rightsReview": "not-applicable-own-illustration",
                      "authorisedScope": "teste interno do laboratório de jogos (HML); não publicar em produção",
                      "decisionRef": "Pedido do responsável, 2026-11-03 — brief «Detetives da Memória» v0.1",
                      "digitalInterventions": []},
        "hotspots": [{**h, "discovery": {"text": h["discovery"], "source": "Conteúdo de demonstração — sem valor documental.", "certainty": None}} for h in hotspots],
        "zones": zones, "reward": reward, "completion": {"requires": "all-hotspots" if kind != "tutorial" else "all-hotspots-and-steps"}
    }


def main():
    os.makedirs(OUT_SVG, exist_ok=True); os.makedirs(os.path.dirname(OUT_JSON), exist_ok=True)
    desk, h0, z0 = scene_desk(); square, h1, z1 = scene_square(); archive, h2, z2 = scene_archive()
    for name, svg in [("00-mesa-do-investigador.svg", desk), ("01-o-olhar-do-investigador.svg", square), ("02-o-arquivo-das-memorias.svg", archive)]:
        open(f"{OUT_SVG}/{name}", "w", encoding="utf-8").write(svg)
    missions = [
        mission(0, "aprende-a-investigar", "tutorial", "Aprende a Investigar", "Treino guiado: aprende a usar a lupa, as ajudas e o Caderno de Campo.",
                "Bem-vindo à equipa de investigação! Observa a imagem com atenção. Encontrámos algumas pistas importantes, mas precisamos da tua ajuda para as descobrir. Toca numa pista para a investigar. Podes ampliar a imagem sempre que precisares.",
                "00-mesa-do-investigador.svg", "Ilustração de uma mesa de madeira vista de cima, com um caderno aberto, uma chávena, fotografias soltas, uma bússola, uma planta, um envelope, um lápis e outros objectos.",
                h0, z0, {"stamp": "lupa", "label": "Selo da primeira investigação"}, "muito fácil"),
        mission(1, "o-olhar-do-investigador", "mission", "O Olhar do Investigador", "Num largo imaginário escondem-se três pormenores. Nem tudo o que parece importante é uma pista.",
                "Um bom investigador olha para tudo: o céu, as janelas, o chão. Observa este largo imaginário e encontra três pormenores que contam como se vive ali.",
                "01-o-olhar-do-investigador.svg", "Ilustração de um largo imaginário com uma torre com relógio, casas brancas de telhados vermelhos, uma fonte, oliveiras, um cão, um banco, um candeeiro e uma bicicleta.",
                h1, z1, {"stamp": "olho", "label": "Selo do olhar atento"}, "fácil"),
        mission(2, "o-arquivo-das-memorias", "mission", "O Arquivo das Memórias", "Num arquivo cheio de caixas e papéis, três objectos contam como se guardam as memórias.",
                "Os arquivos guardam papéis, fotografias e objectos que ajudam a lembrar. Procura os três objectos que nos dizem como as memórias foram registadas e conservadas.",
                "02-o-arquivo-das-memorias.svg", "Ilustração de uma sala de arquivo com uma janela, uma estante com caixas e livros, uma mesa com um álbum e uma máquina de escrever, um mapa na parede e uma câmara num tripé.",
                h2, z2, {"stamp": "arquivo", "label": "Selo do arquivista"}, "média")
    ]
    catalog = {"_copyright": "© 2026 Fernando Rodrigues de Jácomo — Projeto Comunitário de Milreu",
               "version": "0.1.0", "status": "lab-only", "isExample": True,
               "notice": "Catálogo de TESTE do laboratório de jogos. Missões com ilustrações demonstrativas próprias; nenhuma fotografia do acervo.",
               "generatedBy": "scripts/lab/build_detetives_assets.py", "missions": missions}
    open(OUT_JSON, "w", encoding="utf-8").write(json.dumps(catalog, ensure_ascii=False, indent=2) + "\n")
    print("OK", OUT_JSON, [m["missionId"] for m in missions])


if __name__ == "__main__":
    main()
