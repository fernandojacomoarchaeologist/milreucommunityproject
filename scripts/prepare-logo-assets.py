# © 2026 Fernando Rodrigues de Jácomo.
# Produzido no âmbito do Projeto Comunitário de Milreu.
# Consultar RIGHTS.md.

from pathlib import Path
from PIL import Image
import numpy as np

# Script de referência. Os derivados fornecidos no pacote já foram gerados.
# Não substitui revisão visual nem cria um mestre vetorial.

PALETTE = {
    "terracotta": (181, 99, 70),
    "olive": (126, 132, 100),
    "sand": (211, 194, 169),
    "pale": (229, 219, 202),
    "ink": (42, 38, 34),
}


def has_alpha(path: Path) -> bool:
    return Image.open(path).convert("RGBA").getextrema()[3] != (255, 255)


if __name__ == "__main__":
    root = Path(__file__).resolve().parents[1]
    logo = root / "assets/brand/derived/light/logo-full-colour-transparent.png"
    if not logo.exists() or not has_alpha(logo):
        raise SystemExit("Logo transparente ausente ou inválido.")
    print("Ativo transparente validado. Rever visualmente antes de publicar.")
