#!/usr/bin/env python3
"""
© 2026 Fernando Rodrigues de Jácomo.
Produzido no âmbito do Projecto Comunitário de Milreu.
Consultar RIGHTS.md.

Detetives da Memória — sobreposição das pistas nas fotografias reais, para revisão humana.
Lê public/data/lab/detetives-missions.json e o manifesto de imagens; desenha cada zona sobre a
variante usada no jogo (a fotografia NÃO é alterada; as imagens resultantes são só de revisão).
Uso: python3 scripts/lab/overlay_detetives_hotspots.py <pasta-de-saída>
"""
import json, sys
from PIL import Image, ImageDraw

out = sys.argv[1] if len(sys.argv) > 1 else "."
cat = json.load(open("public/data/lab/detetives-missions.json", encoding="utf-8"))
manifest = {i["id"]: i for i in json.load(open("public/data/media-manifest.json", encoding="utf-8"))["items"]}
for mission in cat["missions"]:
    variant = manifest[mission["memoryRef"]]["variants"][mission["variant"]]
    im = Image.open(variant["path"]).convert("RGB")
    W, H = im.size
    layer = Image.new("RGBA", im.size, (0, 0, 0, 0)); d = ImageDraw.Draw(layer)
    colours = {"observacao": (168, 50, 39), "investigacao": (217, 180, 106), "historia": (94, 114, 103)}
    for n, task in enumerate([t for t in mission["tasks"] if t["type"] == "find"], 1):
        c = colours[task["layer"]]
        parts = task["shape"]["shapes"] if task["shape"]["type"] == "multi" else [task["shape"]]
        for s in parts:
          if s["type"] == "circle":
            r = s["r"] * W; box = [s["cx"] * W - r, s["cy"] * H - r, s["cx"] * W + r, s["cy"] * H + r]
            d.ellipse(box, fill=c + (70,), outline=c + (255,), width=8); lx, ly = box[0], box[1]
          else:
            pts = [(x * W, y * H) for x, y in s["points"]]
            d.polygon(pts, fill=c + (70,), outline=c + (255,)); d.line(pts + [pts[0]], fill=c + (255,), width=8); lx, ly = min(p[0] for p in pts), min(p[1] for p in pts)
        d.rectangle([lx, ly - 54, lx + 54 + 22 * len(task["id"]), ly], fill=c + (230,)); d.text((lx + 10, ly - 46), f"{n} {task['id']}", fill=(255, 255, 255, 255), font_size=36)
    for task in [t for t in mission["tasks"] if t["type"] == "question" and t.get("zoomArea")]:
        z = task["zoomArea"]; w = W / z["scale"] / 2; h = H / z["scale"] / 2
        d.rectangle([z["cx"] * W - w, z["cy"] * H - h, z["cx"] * W + w, z["cy"] * H + h], outline=(30, 26, 23, 255), width=8)
        d.text((z["cx"] * W - w + 10, z["cy"] * H - h - 46), f"zoom {task['id']}", fill=(30, 26, 23, 255), font_size=36)
    merged = Image.alpha_composite(im.convert("RGBA"), layer).convert("RGB"); merged.thumbnail((1600, 1600))
    merged.save(f"{out}/{mission['memoryRef']}_pistas.jpg", quality=80)
    full = Image.open(variant["path"]).convert("RGB"); full.thumbnail((1600, 1600)); full.save(f"{out}/{mission['memoryRef']}_integral.jpg", quality=80)
    print(mission["memoryRef"], W, H)
