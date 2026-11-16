#!/usr/bin/env python3
"""
© 2026 Fernando Rodrigues de Jácomo.
Produzido no âmbito do Projecto Comunitário de Milreu.
Consultar RIGHTS.md.

Detetives da Memória — DERIVADOS DE APRESENTAÇÃO (laboratório, só teste).
1) Fotografia sem as margens brancas do suporte digitalizado: recorte rectangular às bordas do
   conteúdo fotográfico. Não corta pessoas nem objectos (só o branco do scanner) e não altera píxeis.
2) Miniaturas dos objectos procurados (cartões da missão), recortadas da mesma variante.
O master (public/media/museum/originals) e as variantes do Museu NÃO são alterados. Cada derivado
regista a origem (caminho + sha256) e o recorte em public/data/lab/detetives-derivados.json.
Uso: python3 scripts/lab/build_detetives_derivados.py
"""
import hashlib, json, os
from PIL import Image

OUT = "public/media/lab/detetives/derivados"
os.makedirs(OUT, exist_ok=True)

def digest(path):
    return hashlib.sha256(open(path, "rb").read()).hexdigest()

def content_box(im, share=0.25):
    """Bordas do conteúdo fotográfico. «Branco de scanner» = píxel muito claro E neutro (sem cor);
    o chão claro ou o céu da fotografia têm cor e contam como conteúdo. Uma linha/coluna é conteúdo
    quando ≥ 25 % dos seus píxeis não são branco de scanner."""
    rgb = im.convert("RGB"); W, H = rgb.size; px = rgb.load()
    def paper(x, y):
        r, g, b = px[x, y]
        return min(r, g, b) > 228 and max(r, g, b) - min(r, g, b) < 14
    col = [sum(1 for y in range(0, H, 4) if not paper(x, y)) / len(range(0, H, 4)) for x in range(W)]
    row = [sum(1 for x in range(0, W, 4) if not paper(x, y)) / len(range(0, W, 4)) for y in range(H)]
    x0 = next(i for i, v in enumerate(col) if v >= share); x1 = W - next(i for i, v in enumerate(reversed(col)) if v >= share)
    y0 = next(i for i, v in enumerate(row) if v >= share); y1 = H - next(i for i, v in enumerate(reversed(row)) if v >= share)
    return x0, y0, x1, y1

def bbox(shape):
    if shape["type"] == "multi":
        boxes = [bbox(s) for s in shape["shapes"]]
        return min(b[0] for b in boxes), min(b[1] for b in boxes), max(b[2] for b in boxes), max(b[3] for b in boxes)
    if shape["type"] == "circle":
        return shape["cx"] - shape["r"], shape["cy"] - shape["r"], shape["cx"] + shape["r"], shape["cy"] + shape["r"]
    xs = [p[0] for p in shape["points"]]; ys = [p[1] for p in shape["points"]]
    return min(xs), min(ys), max(xs), max(ys)

catalog = json.load(open("public/data/lab/detetives-missions.json", encoding="utf-8"))
manifest = {i["id"]: i for i in json.load(open("public/data/media-manifest.json", encoding="utf-8"))["items"]}
records = []
for mission in catalog["missions"]:
    mid = mission["memoryRef"]; variant = manifest[mid]["variants"]["immersive"]
    im = Image.open(variant["path"]).convert("RGB"); W, H = im.size
    x0, y0, x1, y1 = content_box(im)
    pres = im.crop((x0, y0, x1, y1)); out = f"{OUT}/{mid}-apresentacao.webp"
    pres.save(out, "WEBP", quality=84, method=6)
    entry = {"memoryId": mid, "kind": "apresentacao", "source": variant["path"], "sourceSha256": digest(variant["path"]),
             "master": manifest[mid]["originalPath"], "crop": [round(x0 / W, 5), round(y0 / H, 5), round(x1 / W, 5), round(y1 / H, 5)],
             "output": out, "width": pres.width, "height": pres.height, "sha256": digest(out), "tasks": []}
    for task in [t for t in mission["tasks"] if t["type"] == "find"]:
        # Cartão quadrado centrado no objecto (lado = maior dimensão + 20 %), para o objecto caber inteiro na miniatura.
        bx0, by0, bx1, by1 = bbox(task["shape"])
        cx, cy = (bx0 + bx1) / 2 * W, (by0 + by1) / 2 * H; side = max((bx1 - bx0) * W, (by1 - by0) * H) * 1.2
        box = (int(max(0, cx - side / 2)), int(max(0, cy - side / 2)), int(min(W, cx + side / 2)), int(min(H, cy + side / 2)))
        card = im.crop(box); card.thumbnail((360, 360)); cout = f"{OUT}/{mid}-{task['id']}.webp"
        card.save(cout, "WEBP", quality=82, method=6)
        entry["tasks"].append({"taskId": task["id"], "output": cout, "width": card.width, "height": card.height, "crop": [round(v, 5) for v in (box[0] / W, box[1] / H, box[2] / W, box[3] / H)]})
    records.append(entry)
    print(mid, "apresentação", pres.size, "recorte", entry["crop"], "cartões", len(entry["tasks"]))
json.dump({"_copyright": "© 2026 Fernando Rodrigues de Jácomo — Projeto Comunitário de Milreu", "version": "0.3.0",
           "notice": "Derivados de APRESENTAÇÃO do laboratório de jogos (só teste). Recortes das variantes do Museu; master e variantes intactos. Não são documentos de preservação.",
           "generatedBy": "scripts/lab/build_detetives_derivados.py", "items": records},
          open("public/data/lab/detetives-derivados.json", "w", encoding="utf-8"), ensure_ascii=False, indent=2)
