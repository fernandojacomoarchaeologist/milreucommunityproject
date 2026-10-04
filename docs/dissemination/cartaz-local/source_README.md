# Fonte de editoração — Item 8 · Cartaz local (master/template)

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> **CANONICAL / TEMPLATE READY · STAND BY.** Não gerar cartaz de evento. A3 e A4 são **previews** de template (dados fictícios declarados).

## Fonte
- `master/cartaz_local_generator.py` — gerador do master (portado p/ caminhos relativos; **inputs 100% canónicos**). Slot «MUSEUS SEM FRONTEIRAS · INICIATIVAS 2026»; guarda `final=True` que bloqueia export com placeholders/demo.
- `master/FIELDS_template.json` — campos locais editáveis (placeholders).

## Assets / fontes
- **Imagem principal:** `public/media/museum/originals/MM202601.png` (canónico, substituível). ✓
- **Logótipos:** canónico ✓. **Fontes:** `_SOURCES_SHARED/FONTS_MANIFEST.md`.

## Reprodução verificada (2026-10-03)
Gerador portado regenerou o template A3 **SHA-256 idêntico** a `master/_TEMPLATE_A3_preview.png` → **reprodução OK**.

## Estado / gates
TEMPLATE READY / STAND BY. Ao gerar cartazes reais: dados confirmados; crédito/direitos da foto; prepress gráfica; sem placeholders (guarda ativa).
