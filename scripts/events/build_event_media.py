#!/usr/bin/env python3
"""
© 2026 Fernando Rodrigues de Jácomo.
Produzido no âmbito do Projecto Comunitário de Milreu.
Consultar RIGHTS.md.

Derivados web das imagens dos eventos da agenda pública (#/exposicoes).

- Os ORIGINAIS ficam em armazenamento privado (fora do Git); a pasta de origem
  vem da variável MILREU_EVENT_MEDIA_SRC (nunca um caminho fixo no código).
- Cada derivado: orientação corrigida, EXIF/GPS removidos (regra media-pipeline),
  JPEG progressivo, 2 tamanhos (1600 px e 640 px no lado maior).
- Incremental: para acrescentar fotografias, juntar entradas a MEDIA e voltar a
  correr; ficheiros já existentes são regenerados de forma determinística.
- Direitos/créditos de cada imagem: public/media/events/PROVENIENCIA.txt e o campo
  `media[].credit` em public/data/exhibitions-public.json.

Uso:  MILREU_EVENT_MEDIA_SRC=<pasta> python3 scripts/events/build_event_media.py
Requer Pillow; ficheiros HEIC são convertidos primeiro com `sips` (macOS).
"""
import json, os, subprocess, sys, tempfile
from PIL import Image, ImageOps

OUT_ROOT = "public/media/events"
SIZES = {"full": 1600, "thumb": 640}

# evento → [(ficheiro de origem, nome de saída)]
MEDIA = {
    "2026-02-07-milreu-roda-de-conversas": [
        ("Fig03_Cartaz_Evento_Milreu_Fevereiro_2026-Direito FernandoJacomo.tiff", "cartaz"),
        ("Fig04_Apresentacao_Encontro_Milreu_Fevereiro_2026 - direito Patrimonio Cultural IP.tiff", "apresentacao"),
        ("Fig05_Debate_Encontro_Milreu_Fevereiro_2026-direito Patrimonio Cultural IP.tiff", "debate"),
    ],
    "2026-04-11-estoi-roda-de-conversas": [
        ("Evento_Abril Cartaz - Direitos Fernando Jacomo.jpg", "cartaz"),
        ("Evento_Abril - Direitos Fernando Jacomo.JPG", "roda-01"),
        ("Evento_Abril2 - Direitos Fernando Jacomo.JPG", "roda-02"),
    ],
    "2026-10-10-sao-bras-de-alportel-museu-do-traje": [
        ("evento1010-IMG_0055.HEIC", "exposicao-01"),
        ("evento1010-IMG_0057.HEIC", "exposicao-02"),
        ("evento1010-IMG_0058.HEIC", "exposicao-03"),
        ("IMG_0076 2.HEIC", "exposicao-04"),
        ("evento1010-IMG_0059.HEIC", "folha-de-sala"),
        ("evento1010-IMG_0060.HEIC", "acervo-em-mesa"),
        ("evento1010-Cartaz.jpg", "cartaz-encontro"),
    ],
}


def open_image(path):
    if path.lower().endswith(".heic"):
        tmp = tempfile.NamedTemporaryFile(suffix=".jpg", delete=False).name
        subprocess.run(["sips", "-s", "format", "jpeg", path, "--out", tmp],
                       check=True, capture_output=True)
        path = tmp
    im = Image.open(path)
    im = ImageOps.exif_transpose(im)  # aplica a orientação antes de descartar o EXIF
    return im.convert("RGB")


def main():
    src = os.environ.get("MILREU_EVENT_MEDIA_SRC")
    if not src or not os.path.isdir(src):
        sys.exit("Defina MILREU_EVENT_MEDIA_SRC com a pasta privada das imagens dos eventos.")
    report = {}
    for event, items in MEDIA.items():
        out_dir = os.path.join(OUT_ROOT, event)
        os.makedirs(out_dir, exist_ok=True)
        for source, name in items:
            im = open_image(os.path.join(src, source))
            entry = {}
            for size_name, max_side in SIZES.items():
                copy = im.copy()
                copy.thumbnail((max_side, max_side), Image.LANCZOS)
                suffix = "" if size_name == "full" else "-640"
                rel = f"{out_dir}/{name}{suffix}.jpg"
                # sem exif=..., o Pillow não grava metadados (EXIF/GPS removidos)
                copy.save(rel, "JPEG", quality=82, optimize=True, progressive=True)
                entry[size_name] = {"src": rel, "width": copy.width, "height": copy.height}
            report[f"{event}/{name}"] = entry
            print(f"{event}/{name}: {entry['full']['width']}x{entry['full']['height']}")
    json.dump(report, sys.stderr, ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
