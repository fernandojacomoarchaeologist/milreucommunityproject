# © 2026 Fernando Rodrigues de Jácomo.
# Produzido no âmbito do Projeto Comunitário de Milreu.
# Consultar RIGHTS.md.

from pathlib import Path
from PIL import Image, ImageOps
import hashlib, json
ROOT=Path(__file__).resolve().parents[2]
source=ROOT/'public/media/museum/originals'; target=ROOT/'public/media/museum/generated'
specs={'thumbnail':(480,75),'card':(900,80),'detail':(1600,84),'immersive':(2400,88)}
for image_path in sorted(source.glob('MM*.jpg')):
    rid=image_path.stem
    with Image.open(image_path) as original:
        image=ImageOps.exif_transpose(original).convert('RGB')
        for name,(size,quality) in specs.items():
            out=target/rid/f'{name}.webp';out.parent.mkdir(parents=True,exist_ok=True)
            copy=image.copy();copy.thumbnail((size,size),Image.Resampling.LANCZOS);copy.save(out,'WEBP',quality=quality,method=6)
print('Variantes regeneradas. Execute npm run validate para atualizar/verificar o manifest.')
