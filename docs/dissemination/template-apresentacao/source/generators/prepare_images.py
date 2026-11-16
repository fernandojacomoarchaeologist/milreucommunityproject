# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu.
# Consultar RIGHTS.md. A atribuição não transfere direitos de terceiros.
"""Item 18 — Template de apresentação: imagens sugeridas (derivados de enquadramento).

Gera recortes enquadrados para os slides do template a partir de imagens JÁ
apresentadas publicamente pelo projecto (índice do Museu, agenda #/exposicoes,
Circuito Educativo). Transformações permitidas: remover a margem branca da
digitalização, recortar para a proporção do slide e redimensionar.
SEM alteração tonal, SEM IA, SEM EXIF. Não são novos originais.

MM202617 (inelegível para lançamento) e registos com intervenção por IA não
são usados. Créditos lidos do índice do Museu / PROVENIENCIA.txt.

Uso: python3 prepare_images.py   (a partir da raiz do repositório)
"""
import csv
import hashlib
import json
import os
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[5]
OUT = ROOT / "docs/dissemination/template-apresentacao/imagens-sugeridas"
BUILD = ROOT / "docs/dissemination/template-apresentacao/_private/build"
LOGOS = ROOT / "public/media/exhibition/updated/logos"
MUSEUM = ROOT / "public/media/museum/originals"
EVENTS = ROOT / "public/media/events"
CIRCUITO = ROOT / "docs/dissemination/_SOURCES_SHARED/assets/project-generated/circuito"

EV_CREDIT = {
    "2026-02-07": "Fotografia: Património Cultural, I.P. — reprodução sob autorização.",
    "2026-04-11": "Fotografia: Fernando Rodrigues de Jácomo (consentimento dos participantes confirmado pelo responsável).",
    "2026-10-10": "Fotografia: Fernando Rodrigues de Jácomo.",
}

# id, fonte, proporção (w/h), foco vertical (0=topo, 0.5=centro), uso no template
SELECTION = [
    ("capa_MM202613", "MM202613", 6.43 / 5.45, 0.45, "Capa"),
    ("divisor_MM202610", "MM202610", 4.73 / 7.5, 0.45, "Divisor 01 — O Projecto"),
    ("texto_MM202606", "MM202606", 5.6 / 4.6, 0.5, "O Projecto (texto + imagem)"),
    ("divisor_MM202624", "MM202624", 4.73 / 7.5, 0.4, "Divisor 02 — Iniciativas 2026"),
    ("iniciativa_expo_exposicao-01", "ev:2026-10-10-sao-bras-de-alportel-museu-do-traje/exposicao-01.jpg", 5.7 / 2.6, 0.45, "Iniciativas — Entre Ruínas e Memórias"),
    ("iniciativa_circuito_oficina", "circ:oficina_escavacao.jpg", 5.7 / 2.6, 0.5, "Iniciativas — Circuito Educativo"),
    ("inteira_roda-02", "ev:2026-04-11-estoi-roda-de-conversas/roda-02.jpg", 13.333 / 6.35, 0.5, "Fotografia de actividade"),
    ("divisor_MM202611", "MM202611", 4.73 / 7.5, 0.35, "Divisor 03 — Museu de Memórias"),
    ("grelha_MM202602", "MM202602", 1.0, 0.45, "Museu — grelha"),
    ("grelha_MM202615", "MM202615", 1.0, 0.5, "Museu — grelha"),
    ("grelha_MM202621", "MM202621", 1.0, 0.5, "Museu — grelha"),
    ("grelha_MM202605", "MM202605", 1.0, 0.5, "Museu — grelha"),
    ("destaque_MM202601", "MM202601", 6.2 / 7.5, 0.5, "Memória em destaque"),
    ("divisor_exposicao-04", "ev:2026-10-10-sao-bras-de-alportel-museu-do-traje/exposicao-04.jpg", 4.73 / 7.5, 0.5, "Divisor 04 — Parcerias e próximos passos"),
    ("texto_acervo-em-mesa", "ev:2026-10-10-sao-bras-de-alportel-museu-do-traje/acervo-em-mesa.jpg", 5.6 / 4.6, 0.5, "Próximos passos (texto + imagem)"),
    ("grelha_MM202614", "MM202614", 1.0, 0.5, "Banco — alternativa"),
]

MAX_SIDE = 1920


def trim_scan_margin(im):
    """Remove margem branca/clara uniforme da digitalização (não toca no conteúdo)."""
    g = im.convert("L")
    w, h = g.size
    px = g.load()

    def dark_frac_row(y):
        return sum(1 for x in range(0, w, 4) if px[x, y] < 225) / (w / 4)

    def dark_frac_col(x):
        return sum(1 for y in range(0, h, 4) if px[x, y] < 225) / (h / 4)

    t, b, l, r = 0, h - 1, 0, w - 1
    while t < h // 3 and dark_frac_row(t) < 0.15:
        t += 1
    while b > 2 * h // 3 and dark_frac_row(b) < 0.15:
        b -= 1
    while l < w // 3 and dark_frac_col(l) < 0.15:
        l += 1
    while r > 2 * w // 3 and dark_frac_col(r) < 0.15:
        r -= 1
    # pequena margem interior para eliminar o fio de borda da prova
    inset = int(0.006 * max(w, h))
    return im.crop((l + inset, t + inset, r - inset, b - inset))


def crop_ratio(im, ratio, focus_y):
    w, h = im.size
    if w / h > ratio:
        nw = int(h * ratio)
        x0 = (w - nw) // 2
        return im.crop((x0, 0, x0 + nw, h))
    nh = int(w / ratio)
    y0 = int((h - nh) * focus_y)
    return im.crop((0, y0, w, y0 + nh))


def museum_meta():
    d = json.loads((ROOT / "public/data/museum-index.json").read_text())
    return {r["id"]: r for r in d["records"]}


def source_of(src, meta):
    if src.startswith("ev:"):
        rel = src[3:]
        return EVENTS / rel, EV_CREDIT[rel[:10]], f"public/media/events/{rel}", "Agenda pública #/exposicoes", ""
    if src.startswith("circ:"):
        f = src[5:]
        return (CIRCUITO / f, "Projecto Comunitário de Milreu — imagem gerada por IA.",
                f"docs/dissemination/_SOURCES_SHARED/assets/project-generated/circuito/{f}",
                "Circuito Educativo (Item 4)", "Representação conceptual · não documental")
    r = meta[src]
    assert src != "MM202617", "MM202617 é inelegível para lançamento público"
    assert not r.get("interventions"), f"{src} tem intervenção declarada — não usar"
    f = next(MUSEUM.glob(f"{src}.*"))
    return f, r["credit"]["pt-PT"], f"public/media/museum/originals/{f.name}", r["title"]["pt-PT"], ""


def prepare_images():
    OUT.mkdir(parents=True, exist_ok=True)
    meta = museum_meta()
    rows = []
    for out_id, src, ratio, fy, uso in SELECTION:
        path, credit, canon, titulo, aviso = source_of(src, meta)
        im = Image.open(path).convert("RGB")
        trimmed = trim_scan_margin(im) if src.startswith("MM") else im
        cropped = crop_ratio(trimmed, ratio, fy)
        cropped.thumbnail((MAX_SIDE, MAX_SIDE), Image.LANCZOS)
        dest = OUT / f"{out_id}.jpg"
        cropped.save(dest, "JPEG", quality=88, optimize=True)  # sem EXIF
        sha = hashlib.sha256(dest.read_bytes()).hexdigest()
        rows.append({
            "ficheiro": dest.name, "fonte_id": src.split("/")[-1].split(":")[-1].replace(".jpg", ""),
            "fonte_canonica": canon, "titulo_ou_contexto": titulo, "uso_no_template": uso,
            "dimensoes": f"{cropped.width}x{cropped.height}",
            "transformacao": ("trim margem digitalização + " if src.startswith("MM") else "") + "recorte de enquadramento + redimensionamento; sem alteração tonal; sem IA; sem EXIF",
            "credito_obrigatorio": credit, "aviso": aviso, "sha256": sha,
        })
    with open(OUT / "IMAGENS_SUGERIDAS.csv", "w", newline="", encoding="utf-8") as fh:
        wr = csv.DictWriter(fh, fieldnames=list(rows[0].keys()))
        wr.writeheader()
        wr.writerows(rows)
    (BUILD / "imagens.json").parent.mkdir(parents=True, exist_ok=True)
    (BUILD / "imagens.json").write_text(json.dumps({r["ficheiro"]: r for r in rows}, ensure_ascii=False, indent=1))
    return rows


def prepare_logos():
    """Recorta cada logótipo ao conteúdo (alpha) para medir alturas ópticas. Ficheiros só em _private/build."""
    order = ["logo-projeto-comunitario-milreu.png", "logo-ccdr-algarve.png",
             "logo-associacao-amigos-museu-lyceu-faro.png", "logo-junta-freguesia-estoi.png",
             "Milreu_policromatico.png", "logo-ualg-completo.png"]
    info = []
    d = BUILD / "logos"
    d.mkdir(parents=True, exist_ok=True)
    for f in order:
        im = Image.open(LOGOS / f).convert("RGBA")
        bbox = im.getchannel("A").point(lambda a: 255 if a > 8 else 0).getbbox()
        # fundos brancos opacos: recortar também o branco
        rgb = Image.new("RGB", im.size, (255, 255, 255))
        rgb.paste(im, mask=im.getchannel("A"))
        inv = rgb.convert("L").point(lambda v: 255 if v < 245 else 0).getbbox()
        if inv:
            bbox = (max(bbox[0], inv[0]), max(bbox[1], inv[1]), min(bbox[2], inv[2]), min(bbox[3], inv[3]))
        c = im.crop(bbox)
        c.save(d / f)
        info.append({"file": str(d / f), "name": f, "w": c.width, "h": c.height})
    (BUILD / "logos.json").write_text(json.dumps(info, indent=1))
    return info


if __name__ == "__main__":
    rows = prepare_images()
    logos = prepare_logos()
    for r in rows:
        print(r["ficheiro"], r["dimensoes"])
    for l in logos:
        print(l["name"], l["w"], l["h"])
