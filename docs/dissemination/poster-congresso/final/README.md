> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.

# Item 4 — Poster de congresso A0 · entregáveis finais (conteúdo congelado)

**Data:** 2026-10-06 · **Estado:** **EDITORIAL CONTENT FROZEN / HUMAN DESIGN PASS** · **CMYK/prepress (FASE B): pendente.**

Esta pasta contém a versão com o **conteúdo científico aprovado nesta sessão** (Objectivo · Diagnóstico e resultados 2024 · Discussão integrada · contacto · Referências 16 pt). **Supersede, em conteúdo**, as versões antigas em `../print-A0/` e `../editavel-vetor/` (que não têm estas adições).

## Ficheiros
| Ficheiro | Formato | Uso |
|---|---|---|
| `poster_item4_FINAL_2026-10-06.svg` | SVG vetorial, A0 (841×1189 mm), **corte** | Arte final editável (texto vivo, fotos ligadas/embebidas, RGB) |
| `poster_item4_FINAL_2026-10-06_sangria5mm.svg` | SVG vetorial, A0 + **sangria 5 mm** (851×1199 mm) | Versão com sangria para impressão (fundo marfim estendido; conteúdo inalterado) |
| `poster_item4_PROVA_RGB_A0_200dpi_2026-10-06.pdf` | PDF **RGB**, A0, raster 200 dpi (6622×9362) | **Prova** de visualização/validação — **não** é prepress final |

## Verificação (prova)
- Sem overflow/clipping; **0 colisões** texto/foto; folga acima do rodapé **+22,5 mm**.
- Corpos: corpo 20 pt · Metodologia 18 pt · **Referências 16 pt** (1 linha compacta). Mínimos de legibilidade respeitados.
- Conteúdo congelado: Museu, Circuito, Metodologia, imagens, identidade, parceiros e copy científica aprovados.

## GATE de produção (FASE B — por fazer, fora deste ambiente)
Decisão humana 2026-10-06: **CMYK fica para a gráfica** (não fechar CMYK por inferência).
1. **Perfil ICC CMYK real da gráfica** (ou padrão acordado, ex.: PSO Coated v3 / FOGRA39) — este ambiente só tem «Generic CMYK» do macOS (não usar como final).
2. **Incorporação/licença das fontes** (Fraunces, Spectral, Archivo) para PDF/X — ficheiros de fonte e licença são do operador, não versionados.
3. **PDF/X-1a ou X-4** a partir do SVG de **sangria** (toolchain vetorial: Inkscape/Ghostscript/Scribus — ausente neste ambiente).
4. **Formato/título do congresso** e **QR final** (URL real) por confirmar.
5. Direitos das fotografias conforme matriz do kit (Item 9).

## Reproduzir
Gerador: `../source/generators/poster_proof_print.py` → `../source/generators/out/` (SVG + PNG). PPI por variável de ambiente (`PPI=200` usado nesta prova). Fontes em `~/Library/Fonts`.
