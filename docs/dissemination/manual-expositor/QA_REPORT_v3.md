> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.

# Item 11 — Manual do Expositor · QA v3 (fecho operacional)

**Data:** 2026-10-07 · **Estado:** **HUMAN CONTENT/DESIGN REVIEW / PHYSICAL VALIDATION GATE OPEN** (não FINAL/DONE).
Ronda operacional (sem redesenho). **Critério visual: zero overlap / zero clipping → cumprido.**

## Ajustes v3 (página | alteração | resultado)
| Pág. | Alteração | Resultado |
|---|---|---|
| 3 Antes | **Convenção de nomes** `INSTITUIÇÃO_DATA_TIPO_ITEM_Nº.jpg` (+ exemplos) + envio em **várias mensagens** (1/2, 2/2) + `Upload online: [PENDING]` → **«Envio online: a disponibilizar»** | **PASS** |
| 14 Métricas | **Check-out ≠ fecho documental:** «O fecho DOCUMENTAL só é completo depois da avaliação…; a desmontagem/recolha/devolução física NÃO dependem da avaliação.» · linguagem interna removida → **«Questionário digital: em preparação»** (sem `ITEM11_…` / `PENDING HUMAN APPROVAL`) · mantém «QR A INSERIR» | **PASS** |
| 15 Anexo A | Tabela **REGISTO DE OBSERVAÇÕES / DANOS** (`Item | Foto(s)/ficheiro | Observação`, 4 linhas manuscritas + colunas) | **PASS** |
| 20 Anexo F | Escalas **1–5 + N/A** (checkboxes desenhados) · «Adequação dos suportes» → **«Adequação do sistema de montagem utilizado»** | **PASS** |
| 21 Anexo G | `MODO DE ENTREGA`: E-mail · **Online/upload (quando disponível)** · Papel · callout **«fecho DOCUMENTAL»** (devolução física não depende da avaliação) | **PASS** |

## QA visual (21 páginas)
Auditado render 200 dpi + crops ampliados (1, 3, 5, 8, 11, 14, 15, 17, 20, 21). **Zero sobreposição / zero clipping.** Checkboxes desenhados (imprimível B-W-safe), campos com espaço de escrita à mão, índice clicável + bookmarks + hyperlinks (mailto nos pontos de envio). Nenhum token cru de desenvolvimento no conteúdo público.

## Capa — nota para a versão final
Enquanto **prova**, mantém o bloco de estado. No **PDF final para anfitriões** (só após gates físicos), substituir esse bloco, no máximo, por **«Versão 1.0 · [data]»**. Não executar enquanto os gates físicos estiverem abertos (ver `README.md`).

## Gates que permanecem (realmente físicos / externos)
VEVOR (carga/espessura/2-painéis-por-suporte) · embalagem/envelope · armazenamento definitivo · URL/QR do inquérito + aprovação das perguntas. Ver `PENDING_PHYSICAL_VALIDATION.md`.

**QA v3 PASS.** Continua PROVA — não finalizar, não abrir PR de FINAL ART, não marcar DONE. Parar em HUMAN GATE.
