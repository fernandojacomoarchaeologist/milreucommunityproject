# Fonte de editoração — Item 3 · Orçamento impressora 3D (Circuito Educativo)

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> **CANONICAL.** Esta é a fonte de editoração **canónica e versionada** do orçamento. Regenera **exactamente** o PDF aprovado. **Não alterar preços/dados.**

## O que regenera
`../Orcamento_Impressora_3D_vFinal_2026-10-01.pdf` (8 páginas, A4, RGB) + `../PREVIEW_vFinal_8paginas.png`, com a identificação administrativa:
> **PROJECTO COMUNITÁRIO DE MILREU / MUSEUS SEM FRONTEIRAS**
> Iniciativas 2026 — Museu itinerante «Entre Ruínas e Memórias» · Circuito Educativo

## Fonte
- `generators/orcamento_generator.py` — gerador Python (PIL). Caminho de saída **portável** (calcula a raiz do repo a partir de `__file__`). Dados/preços/tabelas/copy estão **no próprio gerador** (não há inputs externos de imagem).
- Fundamentação factual: `../CHECKPOINT_FACTUAL_2026-10-01.md` (preços medidos, cotações, direcção).

## Assets / fontes
- **Imagens:** nenhuma (peça só de texto/tabelas).
- **Fontes:** Fraunces / Spectral / Archivo de `~/Library/Fonts/` — ver `../../_SOURCES_SHARED/FONTS_MANIFEST.md`.
- **Ambiente:** `../../_SOURCES_SHARED/BUILD_ENVIRONMENT.md` (Python + Pillow).

## Regenerar
```bash
PYTHONPATH=<dir-com-Pillow> python3 docs/procurement/orcamento-impressora-3d/source/generators/orcamento_generator.py
```
Escreve o PDF + preview na pasta do item.

## Reprodução verificada (2026-10-03)
- `PREVIEW_vFinal_8paginas.png` regenerado = **SHA-256 idêntico** ao de `main` → **reprodução OK**.
- O PDF é visualmente idêntico; pode diferir em metadata (data de criação do PDF) — comparar por preview/geometria, não por SHA do PDF.

## Estado / gates
`DRAFT · consulta de mercado, sem adjudicação`. Gates externos: **CMYK c/ perfil da gráfica** + incorporação de fontes (prepress); **adjudicação/compra** (decisão humana).
