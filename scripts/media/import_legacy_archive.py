# © 2026 Fernando Rodrigues de Jácomo.
# Produzido no âmbito do Projeto Comunitário de Milreu.
# Consultar RIGHTS.md.

from pathlib import Path
from zipfile import ZipFile
import argparse, hashlib, shutil, tempfile
parser=argparse.ArgumentParser();parser.add_argument('archive');parser.add_argument('--destination',default='public/media/museum/originals');args=parser.parse_args()
dest=Path(args.destination);dest.mkdir(parents=True,exist_ok=True)
with tempfile.TemporaryDirectory() as tmp:
    with ZipFile(args.archive) as z:z.extractall(tmp)
    files=list(Path(tmp).rglob('MM*.jpg'))+list(Path(tmp).rglob('MM*.jpeg'))
    selected={}
    for f in sorted(files):
        rid=f.stem;digest=hashlib.sha256(f.read_bytes()).hexdigest()
        if rid in selected and selected[rid][1]!=digest:raise RuntimeError(f'Duplicado divergente: {rid}')
        selected.setdefault(rid,(f,digest))
    for rid,(f,_) in selected.items():shutil.copy2(f,dest/f'{rid}.jpg')
print(f'{len(selected)} imagens únicas importadas.')
