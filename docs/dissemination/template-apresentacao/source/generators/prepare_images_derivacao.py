# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu.
# Consultar RIGHTS.md. A atribuição não transfere direitos de terceiros.
"""Item 18 — Derivação «O arqueólogo e a manutenção da memória»: imagens necessárias.

Reutiliza as regras de prepare_images.py (trim de margem de digitalização,
recorte de enquadramento, redimensionamento; sem alteração tonal, sem IA, sem EXIF).
proporção None = sem recorte (imagem inteira, só trim), para o estudo de caso.

Uso: python3 prepare_images_derivacao.py   (a partir da raiz do repositório)
"""
import csv
import hashlib
import json
import sys
from pathlib import Path

from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent))
from prepare_images import ROOT, MAX_SIDE, trim_scan_margin, crop_ratio, museum_meta, source_of  # noqa: E402

DERIV = ROOT / "docs/dissemination/template-apresentacao/derivacoes/comunicacao-arqueologo-memoria"
OUT = DERIV / "imagens"
BUILD = ROOT / "docs/dissemination/template-apresentacao/_private/build"
EV = "ev:2026-10-10-sao-bras-de-alportel-museu-do-traje/"

SELECTION = [
    ("s0_MM202614", "MM202614", 6.43 / 5.45, 0.5, "Capa"),
    ("s0b_MM202608", "MM202608", 5.9 / 2.35, 0.45, "Slide «O que é Milreu»", (0.045, 0, 0, 0)),
    ("s1_MM202602", "MM202602", 5.6 / 4.6, 0.45, "Slide 1 — introdução"),
    ("s2_MM202606", "MM202606", 3.7 / 2.0, 0.55, "Slide 2 — percurso de investigação (séc. XIX)"),
    ("s2_MM202616", "MM202616", 3.7 / 2.0, 0.4, "Slide 2 — percurso de investigação (Hauschild)"),
    ("s2_debate", "ev:2026-02-07-milreu-roda-de-conversas/debate.jpg", 3.7 / 2.0, 0.5, "Slide 2 — actualmente (roda de conversas)"),
    ("s3_MM202615", "MM202615", 1.0, 0.5, "Slide 3 — Museu de Memórias"),
    ("s3_MM202621", "MM202621", 1.0, 0.5, "Slide 3 — Museu de Memórias"),
    ("s4_roda-01", "ev:2026-04-11-estoi-roda-de-conversas/roda-01.jpg", 5.6 / 4.6, 0.5, "Slide 4 — curadoria participativa"),
    ("s6_MM202613", "MM202613", None, 0.5, "Slide 6 — estudo de caso (imagem inteira)"),
    ("s7_exposicao-01", EV + "exposicao-01.jpg", 4 / 3, 0.5, "Slide 7 — exposição 10-10-2026"),
    ("s7_exposicao-02", EV + "exposicao-02.jpg", 4 / 3, 0.5, "Slide 7 — exposição 10-10-2026"),
    ("s7_exposicao-03", EV + "exposicao-03.jpg", 4 / 3, 0.5, "Slide 7 — exposição 10-10-2026"),
    ("s8_MM202624", "MM202624", 5.6 / 4.6, 0.4, "Slide 8 — discussão"),
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
        if extra:  # recorte adicional (fracções l, t, r, b) quando o trim automático deixa margem de digitalização
            l, t, r, bt = extra[0]
            w, h = im.size
            im = im.crop((int(w * l), int(h * t), int(w * (1 - r)), int(h * (1 - bt))))
        if ratio:
            im = crop_ratio(im, ratio, fy)
        im.thumbnail((MAX_SIDE, MAX_SIDE), Image.LANCZOS)
        dest = OUT / f"{out_id}.jpg"
        im.save(dest, "JPEG", quality=88, optimize=True)
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
    (BUILD / "imagens_derivacao_arqueologo_memoria.json").write_text(
        json.dumps({r["ficheiro"]: r for r in rows}, ensure_ascii=False, indent=1))
    for r in rows:
        print(r["ficheiro"], r["dimensoes"])


if __name__ == "__main__":
    main()
