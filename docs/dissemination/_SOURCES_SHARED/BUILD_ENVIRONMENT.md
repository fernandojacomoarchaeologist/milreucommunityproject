# BUILD_ENVIRONMENT — ambiente de regeneração das peças de disseminação

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> Ambiente mínimo para regenerar **exactamente** as peças a partir das fontes de editoração versionadas (sem depender de `scratchpad/`).

## Pré-requisitos
- **Python 3** (testado com o Python do sistema macOS).
- **Fontes** instaladas em `~/Library/Fonts/` — ver `FONTS_MANIFEST.md`.
- **Pacotes Python** (instalar com `pip install --target <dir>` e `PYTHONPATH`, ou num venv):
  - `Pillow` (PIL) — render raster de todas as peças.
  - `numpy` — recorte de logótipos por alpha.
  - `qrcode` — geração de QR (Itens 6, 7, 8, 9 e nota de imprensa).
  - `reportlab` — PDFs CMYK PDF/X (Itens 5, 6) e DIGITAL/PRINT do dossiê (Item 7).
  - `pikepdf` — OutputIntent/ICC, TrimBox/BleedBox, hiperligações.

## Convenção de caminhos (portável)
Cada gerador versionado calcula a **raiz do repositório** a partir da sua própria localização (sobe de `__file__` até encontrar `CLAUDE.md`), e referencia:
- **assets canónicos:** `public/media/...` (acervo, derivados, logótipos) — já no repositório;
- **assets de fonte próprios da peça:** `source/assets/` da própria peça (quando versionados);
- **logótipos de parceria:** `public/media/exhibition/updated/logos/` (conjunto canónico de 5);
- **fontes:** `~/Library/Fonts/` (ver `FONTS_MANIFEST.md`);
- **saída:** as pastas de entrega da própria peça (`print/`, `digital/`, `svg/`, etc.).

## Reprodutibilidade
- Os **previews/PNG** são **determinísticos** → comparáveis por **SHA-256**.
- Os **PDF** podem conter metadata não determinística (data de criação) → comparar **geometria, páginas, dimensões, conteúdo visual (raster), texto, assets, QR e preflight**, não o SHA do ficheiro.
- Qualquer diferença **visual** → `STOP / SOURCE REPRODUCTION MISMATCH` (não «corrigir» a arte).

## Perfil CMYK
Os PDFs CMYK PDF/X usam, por omissão, o **perfil genérico** `/System/Library/ColorSync/Profiles/Generic CMYK Profile.icc`. **Prepress final:** substituir pelo **perfil ICC da gráfica** (pendência transversal).
