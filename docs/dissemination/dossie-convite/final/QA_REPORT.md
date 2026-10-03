# Item 7 — Dossiê «Entre Ruínas e Memórias» · QA_REPORT (FINAL ART DELIVERED)

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> **Estado: HUMAN DESIGN PASS / FINAL ART DELIVERED.** Design congelado (arquitectura, imagens, hierarquia, copy, diagramas, parceiros). Só finalização/prepress. **DONE apenas após revisão humana dos ficheiros finais.**
>
> **Atualização 2026-10-03 (enquadramento 2026, GOV-MSF-2026):** inserido o enquadramento das iniciativas de 2026 **apenas na página final (P4)**, sem reabrir a arquitectura aprovada: parágrafo que torna explícito que o **Projecto Comunitário de Milreu** é o projecto permanente, que **«Projecto Comunitário de Milreu / Museus sem Fronteiras»** enquadra o ciclo de 2026, e que as iniciativas são **«Entre Ruínas e Memórias» + Circuito Educativo** (apoio CCDR); e identificador secundário **«Museus sem Fronteiras · Iniciativas 2026»** no rodapé institucional. Contactos, QR, hiperligações e demais páginas preservados. Regenerados do pipeline: DIGITAL (RGB+links), PRINT (CMYK PDF/X-3), LIVRETO A4, prancha e gerador versionado.

## Entregáveis
| Ficheiro | Formato | Notas |
|---|---|---|
| `DOSSIE_Entre_Ruinas_e_Memorias_DIGITAL.pdf` | **RGB**, 4 págs A5 (148×210), **sem** sangria/marcas | ecrã/e-mail; **hyperlinks** + QR funcional |
| `DOSSIE_Entre_Ruinas_e_Memorias_PRINT.pdf` | **CMYK · PDF/X-3:2002**, 4 págs A5 + 3 mm sangria + marcas de corte | prepress; TrimBox/BleedBox + OutputIntent |
| `DOSSIE_Entre_Ruinas_e_Memorias_LIVRETO_A4.pdf` | RGB, **imposição** 1 folha A4 landscape (duplex, dobra ao meio) | versão **adicional** (nunca substitui o A5) |
| `_PRANCHA_FINAL.png` | prancha das 4 páginas | referência |
| `editaveis/` | fonte + imagens + QR | ver abaixo |

## Portas de legibilidade (gates) — resultados
1. **A5 a 100%** — páginas renderizadas a **300 dpi** (1819×2551 px c/ sangria; trim 148×210). Corpo, legendas e notas legíveis. **PASS**
2. **Logótipos P4** — reconhecíveis ao tamanho final, altura óptica coerente, não demasiado pequenos. **PASS** (verificado a 100%)
3. **Alinhamentos / clipping / overflow** — conteúdo dentro do trim em todas as páginas (margens ≈ 24–30 px @300 acima do trim). **PASS**
4. **Resolução das imagens no tamanho final** (PPI efetivo): P1 herói MM202608 ≈ **285**; P2 banda MM202602 ≈ 275; P2 Ti' Jacinto (recortada) ≈ 740; P2 equipa Hauschild MM202613 ≈ 950; P4 MM202601 ≈ 350. Todas ≥ 275 PPI. **PASS** *(herói limitado pela fonte; aceitável para foto histórica)*
5. **QR** — 25×25 módulos, codifica `https://projectomilreu.pt`; validação de matriz OK. **Scan físico numa impressão real = HUMAN GATE.**
6. **Hyperlinks (DIGITAL)** — 6 anotações de link: P1 site (1); P4 site + 2 e-mails (`mailto:`) + telefone (`tel:+351925339613`) + site sob QR (5). **PASS** *(P2 menciona o site em texto corrido, sem link — coberto em P1/P4)*

> Nota: não se corrigiu legibilidade reduzindo corpo; ajustaram-se micro-espaçamentos (ex.: imagem do herói P4 reduzida para abrir respiros).

## Prepress / standard registado
- **PRINT**: exportado e validado como **PDF/X-3:2002**, **DeviceCMYK**, **sem fontes não embebidas** (conteúdo rasterizado a 300 dpi — o gerador do Item 7 é raster-nativo, não vetorial). OutputIntent = **«Generic CMYK Profile»** (perfil padrão ColorSync).
- **Perfil de cor NÃO é final**: confirmar/reconverter com o **perfil ICC da gráfica** (ex.: Coated FOGRA39). O texto é raster a 300 dpi (sem substituição de tipos).

## Editáveis
- `editaveis/dossie_generator.py` — **fonte aberta** com todo o texto vivo, diagramas vetoriais (código) e composição (equivalente aberto ao SVG; o Item 7 é raster-nativo, pelo que **não há SVG por página**).
- `editaveis/imagens/` — imagens usadas (MM202608, MM202602, MM202604 recortada, MM202613, MM202601).
- `editaveis/QR_projectomilreu.{png,svg}` — QR isolado (vetorial SVG + PNG).
- Logótipos: conjunto canónico em `public/media/exhibition/updated/logos/` (não duplicados aqui).

## HUMAN PRODUCTION GATE (pendente)
- Teste **físico** do QR numa impressão real.
- **Prova visual** do livreto A5 impresso/dobrado (ordem das páginas).
- Confirmação final de **cor/prepress** caso a gráfica determine especificação própria.
- **Créditos das fotografias** (`creditRequired: true`): decidir a forma de exibição (legenda por imagem ou colofão) — **não incluídos nesta arte**; ver tabela de contexto em `../v1/RELATORIO_FASE1.md`.

## Direcção de imagens (narrativa canónica)
Lugar (P1 · MM202608) → Comunidade (P2 · MM202602 + MM202604 + MM202613) → Exposição (P3 · diagramas) → Convite (P4 · MM202601). Nenhuma imagem principal repetida.
