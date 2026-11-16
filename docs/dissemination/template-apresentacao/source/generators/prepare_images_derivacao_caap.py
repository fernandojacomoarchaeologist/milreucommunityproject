# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu.
# Consultar RIGHTS.md. A atribuição não transfere direitos de terceiros.
"""Item 18 — Derivação «Desafio da integração comunitária» (V CAAP, Braga, 20-11-2026): imagens.

Reutiliza as regras de prepare_images.py (trim de margem de digitalização, recorte de
enquadramento, redimensionamento; sem alteração tonal, sem IA, sem EXIF). Só imagens já
publicadas pelo projecto (índice do Museu e agenda pública). MM202617 é recusada pelo source_of().

Uso: python3 prepare_images_derivacao_caap.py   (a partir de qualquer pasta)
"""
import csv
import hashlib
import json
import sys
from pathlib import Path

from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent))
from prepare_images import ROOT, MAX_SIDE, trim_scan_margin, crop_ratio, museum_meta, source_of  # noqa: E402

DERIV = ROOT / "docs/dissemination/template-apresentacao/derivacoes/comunicacao-caap-2026"
OUT = DERIV / "imagens"
BUILD = ROOT / "docs/dissemination/template-apresentacao/_private/build"
E02 = "ev:2026-02-07-milreu-roda-de-conversas/"
E04 = "ev:2026-04-11-estoi-roda-de-conversas/"
E10 = "ev:2026-10-10-sao-bras-de-alportel-museu-do-traje/"

# (id de saída, fonte, proporção w/h ou None, foco vertical, uso[, recorte extra l,t,r,b])
SELECTION = [
    ("c0_MM202613", "MM202613", 6.433 / 5.45, 0.5, "Capa"),
    ("c1_MM202608", "MM202608", 6.2 / 3.45, 0.45, "Slide 2 — Milreu (imagem principal)", (0.045, 0.045, 0, 0)),
    ("c1_MM202606", "MM202606", 2.1, 0.5, "Slide 2 — Milreu, 1897"),
    ("c1_MM202614", "MM202614", 2.1, 0.4, "Slide 2 — Milreu, escavações do séc. XX"),
    ("c2_MM202602", "MM202602", 5.6 / 4.6, 0.45, "Slide 3 — problemática"),
    ("c3_apresentacao", E02 + "apresentacao.jpg", 5.9 / 2.2, 0.5, "Slide 4 — 1.ª roda de conversas"),
    ("c3_roda-01", E04 + "roda-01.jpg", 5.9 / 2.2, 0.45, "Slide 4 — 2.ª roda de conversas"),
    ("c5_exposicao-02", E10 + "exposicao-02.jpg", 6.6 / 4.2, 0.55, "Slide 6 — primeira entrega"),
    ("c6_debate", E02 + "debate.jpg", 5.6 / 4.6, 0.5, "Slide 7 — dificuldades (participação)"),
    ("c7_MM202623", "MM202623", 5.6 / 4.6, 0.5, "Slide 8 — dificuldades (estrutura e sustentação)"),
]


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    meta = museum_meta()
    rows = []
    for out_id, src, ratio, fy, uso, *extra in SELECTION:
        path, credit, canon, titulo, aviso = source_of(src, meta)
        im = Image.open(path).convert("RGB")
        if src.startswith("MM"):
            im = trim_scan_margin(im)
        if extra:
            l, t, r, bt = extra[0]
            w, h = im.size
            im = im.crop((int(w * l), int(h * t), int(w * (1 - r)), int(h * (1 - bt))))
        if ratio:
            im = crop_ratio(im, ratio, fy)
        im.thumbnail((MAX_SIDE, MAX_SIDE), Image.LANCZOS)
        dest = OUT / f"{out_id}.jpg"
        im.save(dest, "JPEG", quality=88, optimize=True)  # sem EXIF
        rows.append({
            "ficheiro": dest.name, "fonte_id": src.split("/")[-1].split(":")[-1].replace(".jpg", ""),
            "fonte_canonica": canon, "titulo_ou_contexto": titulo, "uso": uso,
            "dimensoes": f"{im.width}x{im.height}",
            "transformacao": ("trim margem digitalização + " if src.startswith("MM") else "")
            + ("recorte de enquadramento + " if ratio else "sem recorte + ")
            + "redimensionamento; sem alteração tonal; sem IA; sem EXIF",
            "credito_obrigatorio": credit, "aviso": aviso,
            "sha256": hashlib.sha256(dest.read_bytes()).hexdigest(),
        })
    with open(OUT / "IMAGENS.csv", "w", newline="", encoding="utf-8") as fh:
        wr = csv.DictWriter(fh, fieldnames=list(rows[0].keys()))
        wr.writeheader()
        wr.writerows(rows)
    BUILD.mkdir(parents=True, exist_ok=True)
    (BUILD / "imagens_derivacao_caap_2026.json").write_text(
        json.dumps({r["ficheiro"]: r for r in rows}, ensure_ascii=False, indent=1))
    for r in rows:
        print(r["ficheiro"], r["dimensoes"], "|", r["credito_obrigatorio"][:70])


if __name__ == "__main__":
    main()
