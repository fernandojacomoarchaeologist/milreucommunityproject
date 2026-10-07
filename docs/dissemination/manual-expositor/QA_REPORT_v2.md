> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.

# Item 11 — Manual do Expositor · QA VISUAL v2

**Data:** 2026-10-07 · **Estado:** **HUMAN CONTENT/DESIGN REVIEW / PHYSICAL VALIDATION GATE OPEN** (não FINAL/DONE).
Auditoria visual página-a-página (render 200 dpi) + correcções da revisão v2. **Critério absoluto: zero sobreposição texto/componentes → cumprido.**

## Correcções da revisão v2 (página | problema | correcção | resultado)
| Pág. | Problema (v1) | Correcção (v2) | Resultado |
|---|---|---|---|
| 1 Capa | **BLOCKER:** QR «ACEDA ONLINE» sobre o título | QR movido para baixo-direita (junto a «Utilização»), reduzido para 20 mm; título preservado | **PASS** |
| 8 Percurso | **BLOCKER:** parágrafo + labels S1–S6/diagrama a colidir | Reorganizado: texto → respiro → rótulo IDA → labels S1–S6 → barras (Q por face, dentro) → REGRESSO → legenda → tabela de pares | **PASS** |
| 14 Métricas | Tokens crus `[LINK_…]`/`[QR_…]` como elemento final | «INQUÉRITO DO ANFITRIÃO · Link a inserir após aprovação» + caixa «QR A INSERIR (a criar)»; tokens só no source/docs | **PASS** |
| 3 Antes | Fluxo documental sem destino | Bloco **ENVIO DE DOCUMENTAÇÃO** (a78190@ualg.pt · assunto padrão · CC AAMLF · Upload online: [PENDING]) | **PASS** |
| 5 Recepção | — | Nota: OBS/DANO → enviar antes da montagem; OK → guardar p/ encerramento | **PASS** |
| 11 Danos | — | Callout **ENVIO IMEDIATO** (Ficha+fotos → a78190; CC AAMLF) + «reportar online: link a criar» | **PASS** |
| A Recepção | «Foto nº» por item; `☐` unicode | Inventário com checkboxes **desenhados** (OK/OBS/DANO), sem «Foto nº» por item; nota OBS/DANO; bloco DOCUMENTAÇÃO | **PASS** |
| B Montagem | — | «Fotografia geral enviada ao Projecto (a78190)» | **PASS** |
| C Ocorrência | — | Bloco **ENVIO** (☐ Ficha enviada · ☐ Fotografias anexadas · Data/hora · enviar para a78190 · CC AAMLF) | **PASS** |
| D Desmontagem | — | Checkboxes desenhados; + fotos finais / volumes reembalados / documentação enviada | **PASS** |
| F Avaliação | `☐` unicode; destino em falta | Escalas 1–5 e Sim/Não com checkboxes **desenhados**; «envie para a78190@ualg.pt» | **PASS** |
| G Fecho | `☐` unicode; sem envio | Checks documentação/fotos/métricas/avaliação enviadas + **modo de entrega** (E-mail/Online/Papel) | **PASS** |
| Todas | — | `field()` com espaço real de escrita à mão; `☐` substituídos por rects desenhados (imprimível) | **PASS** |

## QA visual (21 páginas)
- **Zero sobreposição** de texto/componentes (auditado em todas; crops ampliados: 1, 3, 5, 8, 11, 14, 15, 17, 20, 21).
- **Sem clipping**; headers/footers, callouts, tabelas/listas, checkboxes e labels corretos.
- **QR/diagramas não sobre texto** (QR da capa em baixo; placeholder de inquérito na sua caixa; diagrama do percurso separado).
- **Imprimível / B-W-safe:** estados por checkbox desenhado, não por cor. Campos com espaço para caneta.
- **Índice clicável** + bookmarks + hyperlinks (incl. mailto nos pontos de envio).
- **Nenhum token cru** de desenvolvimento como elemento final (controlados: «a criar» / «a inserir» / «[PENDING]»).
- **VEVOR × AAMLF** separados; 12 painéis + 6 suportes inventariados; avaliação no checklist final.
- **Nenhum procedimento técnico inventado** (PENDING marcados; ver `PENDING_PHYSICAL_VALIDATION.md`).

## Fluxo documental (nova regra canónica)
Canal principal **a78190@ualg.pt** · assunto **[MILREU] [TIPO] — INSTITUIÇÃO — DATA** (RECEPÇÃO/MONTAGEM/DANO/DEVOLUÇÃO/MÉTRICAS/AVALIAÇÃO) · **CC museu.lyceu@aejdfaro.pt só quando envolver equipamento/estruturas AAMLF** · `[LINK_ENVIO_DOCUMENTACAO]` registado no source como futuro, e-mail é o fallback funcional.

## Fotografias obrigatórias (clarificado)
Recepção: volumes fechados + OBS/DANO (não todos os OK). Montagem: ≥1 geral. Dano: geral + detalhe(s) + Q#/S#/data. Desmontagem: geral + alterações + volumes reembalados.

**QA PASS.** Continua PROVA — não finalizar, não abrir PR de FINAL ART, não marcar DONE. Parar em HUMAN GATE.
