# Fonte de editoração — Item 9 · Kit Digital + Press Kit

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> **CANONICAL.** Não alterar direitos. `press_editorial_use`, `host_partner_republication`, `generic_third_party_redistribution` continuam **PENDING** → **sem ZIP público com fotografias** (só pacote técnico/source interno).

## O que regenera
Previews internos `../_previews/` (Fact Sheet, nota de imprensa, social, web, prancha — **NOT FOR DISTRIBUTION**). Copy/estrutura são ficheiros vivos do próprio kit.

## Fonte
- `generators/kit_previews_build.py` — gera os previews (portado p/ caminhos relativos; imagens = `public/media/museum/generated` canónico; logótipos canónicos).
- **Copy viva (já versionada):** `../02_TEXTOS/{DESCRICAO_50,100,250,BIO,CONTACTOS,ENQUADRAMENTO_2026}`, `../03_PRESS/NOTA_DE_IMPRENSA_BASE.md`, `../01_README/`, `../05_LOGOS/PROJECTO/` (regras de marca/identidade).
- **Direitos:** `../04_IMAGENS/LEGENDAS_E_CREDITOS.csv` (matriz 4 estados) + `USO_E_DIREITOS.md`.
- **Manifest/inventory/QA:** `../10_MANIFEST/`.

## Assets / fontes
- Imagens: `public/media/museum/generated` (webp canónico) ✓. Logótipos canónicos ✓. Fontes: `_SOURCES_SHARED/FONTS_MANIFEST.md`.

## Reprodução verificada (2026-10-03)
Previews Fact Sheet/nota regenerados do gerador = correspondem aos de `main` (bloco «ENQUADRAMENTO 2026»). Social/web determinísticos.

## Estado / gates
FASE 1 · RIGHTS GATE PENDING. **Nenhuma foto ganhou direitos.** ZIP público bloqueado; SVG/PDF logo + CMYK + fontes pendentes.
