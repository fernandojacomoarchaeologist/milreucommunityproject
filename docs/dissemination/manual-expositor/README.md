> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.

# Item 11 — Manual do Expositor «Entre Ruínas e Memórias»

**Estado:** **HUMAN CONTENT/DESIGN PASS / PHYSICAL VALIDATION GATE OPEN** (prova v3 aprovada, 2026-10-07).
**FINAL ART BLOCKED BY PHYSICAL VALIDATION.** A v3 é uma **PROVA APROVADA**, **não** é FINAL ART. **Não** gerar ainda: PDF final público v1.0, PRINT/prepress, QR do inquérito, especificações físicas definitivas. **Não** marcar DONE.

Guia operacional para a instituição anfitriã receber, conferir, guardar, montar, acompanhar, desmontar e devolver a exposição itinerante, com documentação e verificação. Predominantemente digital, mas **imprimível em A4** (checklists de contingência). Regra: **ONLINE quando possível · PAPEL quando necessário.**

## Conteúdo (21 páginas)
Capa · Índice (clicável) · 1 Antes da chegada · 2 O que vai receber · 3 Recepção/Check-in · 4 Armazenamento · 5 Montagem (VEVOR) · 6 Percurso recomendado · 7 Sistema alternativo AAMLF · 8 Durante a exposição · 9 Danos/incidentes · 10 Desmontagem/Check-out · 11 Embalagem · 12 Métricas e avaliação · **Anexos A–G** imprimíveis (recepção, montagem, ocorrência/dano, desmontagem, métricas, avaliação em papel, fecho do local).

## Decisões de conteúdo
- **Kit de circulação:** 12 painéis Q1–Q12 (841×1800 mm, peça individual) + **6 suportes VEVOR SW-03** (dupla face) + embalagem reutilizável + documentação.
- **VEVOR × AAMLF separados:** AAMLF = sistema **alternativo / mediante articulação prévia** (cópia obrigatória para `museu.lyceu@aejdfaro.pt`).
- **B/W-safe:** estados por checkbox/label, não por cor (imprimível em impressora comum).
- **Sem especificações inventadas:** ver `PENDING_PHYSICAL_VALIDATION.md`.
- **Contacto principal:** `a78190@ualg.pt`. Inquérito/links online ainda inexistentes (placeholders).

## Ficheiros
- `proof/MANUAL_DO_EXPOSITOR_..._PROVA.pdf` — PDF RGB de prova (índice clicável, bookmarks, hyperlinks, QR).
- `proof/pages/` — páginas PNG; `proof/_PRANCHA_manual.png` — contact sheet; `proof/crop_*.png` — crops.
- `proof/_manual_meta.json` — TOC/links/ordem.
- `source/generators/manual_build.py` + `manual_finalize.py` — reprodutível (paths relativos; sem scratchpad).
- `REFERENCIAS_TECNICAS.md` · `ITEM11_PROPOSTA_INQUERITO_ANFITRIAO.md` · `PENDING_PHYSICAL_VALIDATION.md`.

## Regenerar
```bash
cd docs/dissemination/manual-expositor/source/generators
ITEM11_DPI=200 python3 manual_build.py && python3 manual_finalize.py
```
Dependências: fontes DS (`~/Library/Fonts`), logos (`public/media/exhibition/updated/logos`), QR canónico (`docs/dissemination/dossie-convite/final/editaveis/QR_projectomilreu.png`).

## Capa — bloco de estado (prova vs. final)
Enquanto for **prova**, a capa mantém o bloco «IN PRODUCTION / HUMAN PROOF PENDING · PHYSICAL VALIDATION GATE OPEN». No **PDF final destinado aos anfitriões** (só depois de resolvidos os gates físicos), substituir esse bloco, no máximo, por **«Versão 1.0 · [data]»**. **Não** executar esta troca enquanto os gates físicos continuarem abertos.

## Notas para a versão final futura (quando os gates forem resolvidos)
- Substituir o bloco técnico da capa por **«Versão 1.0 · [data]»**.
- Substituir **«Questionário digital: em preparação»** pelo **URL/QR real** do inquérito.
- Substituir a linguagem **PENDING** pelos valores/configurações **validados** (VEVOR, embalagem, armazenamento).
- Opcional: transformar «Recomendaria a exposição? (0–10)» numa **escala gráfica 0–10** na ficha em papel.

## Próxima fase (após teste físico + aprovação)
Incorporar peso/espessura/fixação/capacidade do SW-03 (ou configuração validada), sequência definitiva, embalagem e armazenamento; aprovar perguntas do inquérito + criar URL/QR; só então regenerar a arte-final. Se impresso: FASE B (prepress/ICC).
