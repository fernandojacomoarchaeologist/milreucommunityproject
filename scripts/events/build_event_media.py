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
    "2026-10-30-estoi-inauguracao": [
        ("IMG_0260.HEIC", "exposicao-01"),
        ("IMG_0262.HEIC", "exposicao-02"),
        ("IMG_0439.JPG", "exposicao-03"),
        ("IMG_0267.HEIC", "mesa-01"),
        ("IMG_0273.HEIC", "mesa-02"),
        ("IMG_0274.HEIC", "exposicao-04"),
        ("IMG_0279.HEIC", "rollup"),
        ("IMG_0326.JPG", "painel-achados"),
        ("IMG_0331.JPG", "inauguracao-01"),
        ("IMG_0332.JPG", "inauguracao-02"),
        ("IMG_0334.JPG", "inauguracao-03"),
        ("IMG_0337.JPG", "inauguracao-04"),
        ("IMG_0338.JPG", "inauguracao-05"),
        ("IMG_0436.JPG", "inauguracao-06"),
        ("IMG_0437.JPG", "inauguracao-07"),
        ("IMG_0351.JPG", "inauguracao-08"),
        ("IMG_0362.JPG", "inauguracao-09"),
        ("IMG_0365.JPG", "inauguracao-10"),
        ("IMG_0367.JPG", "inauguracao-11"),
        ("IMG_0409.JPG", "inauguracao-12"),
        ("IMG_0414.JPG", "inauguracao-13"),
        ("IMG_0416.JPG", "inauguracao-14"),
        ("IMG_0441.PNG", "video-01"),
        ("IMG_0445.PNG", "video-02"),
        ("IMG_0446.PNG", "video-03"),
        ("IMG_0447.PNG", "video-04"),
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
    im = im.convert("RGB")
    if path.lower().endswith(".png"):
        im = crop_black_bars(im)  # capturas de ecrã de vídeo: retirar as barras pretas laterais
    return im


def crop_black_bars(im, threshold=12):
    """Recorta colunas quase pretas nas margens esquerda e direita (fotogramas de vídeo)."""
    gray = im.convert("L")
    w, h = gray.size
    dark = lambda x: max(gray.crop((x, 0, x + 1, h)).getextrema()) <= threshold
    left = 0
    while left < w // 3 and dark(left):
        left += 1
    right = w
    while right > w - w // 3 and dark(right - 1):
        right -= 1
    return im.crop((left, 0, right, h))


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
