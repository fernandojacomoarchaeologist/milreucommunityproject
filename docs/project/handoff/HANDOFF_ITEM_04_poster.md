# Handoff — Item 4 · Poster de congresso A0 (académico)

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> Método comum: ver [`00_INDEX_E_METODO.md`](00_INDEX_E_METODO.md). Estado vivo: `docs/project/ESTADO_ITENS_1-5_2026-10-01.md` (Item 4).

**O que é.** Poster **A0 (841×1189 mm, retrato)** do Projecto para apresentação em **congresso** — direcção **académica, texto-protagonista**.

## 1. Local dos arquivos
- **`docs/dissemination/poster-congresso/final/`**:
  - `poster_item4_FINAL_2026-10-06.svg` + `poster_item4_FINAL_2026-10-06_sangria5mm.svg` (SVG editáveis).
  - `poster_item4_PROVA_RGB_A0_200dpi_2026-10-06.pdf` (prova RGB).
  - `README.md`.
- **`docs/dissemination/poster-congresso/print-A0/`** — `poster_milreu_A0_PRINT_sangria5mm.pdf` (barra canónica 5 logos + identificador 2026; PR #63/#74).
- **`docs/dissemination/poster-congresso/review/`** e `editavel-vetor/`.
- **Gerador canónico:** `scratchpad/poster/proof.py` (**não versionado**; PIL dual SVG+PNG).
- ⚠️ **`docs/dissemination/poster-congresso/master/` = REJEITADO** (poster retrato «dois pilares», `master.py`) — **não usar como fonte**.

## 2. Pontos mais importantes
- **Estado:** `EDITORIAL CONTENT FROZEN / HUMAN DESIGN PASS` (PR #111). **Gate restante: FASE B / prepress** (CMYK/fontes + QR final).
- **Poster canónico = o ACADÉMICO** (`vFinal-Academic`, linha `proof/`). **`master/` é rejeitado.**
- **Dados 2024 canónicos (HUMAN):** 532 respostas totais · 422 Algarve · 318 visitaram · 98 não · **7,6/10 satisfação de visitantes** · 9 entrevistas. `n=385` = amostra mínima, **NÃO** efetiva (não confundir).
- **Contacto:** a78190@ualg.pt. **Referências (16 pt):** Hauschild & Teichner 2002 · **Jácomo 2025** (*Anais do Município de Faro* XLVII, 323–358) · Moshenska 2017.
- Rodapé «Parceria e apoio» com **barra canónica de 5 logótipos** (ordem fixa) + identificador 2026.

## 3. Como se estruturou a arte
Blocos: «O Projecto» · «Do diagnóstico à intervenção» · «Metodologia / O que entendemos por Arqueologia Pública e Comunitária» · iniciativa **«Entre Ruínas e Memórias»** · **«Circuito Educativo»** (faixa gráfica **abstrata** — grelha/estratigrafia/tesselas, **sem** ilustração/IA/ícones) · «Desenvolvimento em 2026» · «Próximos passos» · **Objectivo** · **Diagnóstico e resultados (2024)** · **Discussão integrada** · contacto · **Referências** · «Parceria e apoio» + logótipos. 0 colisões, folga +22,5 mm.

## 4. Como se trabalhou ponto a ponto
1. Muitas iterações com **resets totais** do responsável (v1, `gate3/`, `master/`, `reset/` → **rejeitados**).
2. Linha canónica `proof/` (`proof.py`), v2…v9 → **vFinal-Academic**.
3. Auditoria científica das 3 referências; fixação dos dados 2024.
4. Versão de impressão **regenerada do gerador canónico** (idêntica ao vFinal-Academic) + sangria 5 mm (replicação de bordo) + marcas, 150/200 dpi — **sem redesenhar**.
5. Rodapé regenerado com barra canónica; corrigidos logótipos não canónicos usados por engano.

## 5. O que NÃO fazer
- **NÃO** usar `master/` (rejeitado) como fonte; **NÃO** gerar «banner» a partir dele (erro já cometido e corrigido nesta história).
- **NÃO** colocar os 422 Algarve no bloco principal; **NÃO** tratar `n=385` como amostra efetiva.
- **NÃO** usar ilustração/IA/ícones na faixa do Circuito Educativo (é abstrata).
- **NÃO** declarar print-final: falta congresso/formato, QR, CMYK, fontes, direitos das fotos.
- **NÃO** introduzir hexadecimais novos; usar tokens semânticos.

## 6. Resultado esperado
Poster A0 académico pronto para prepress (CMYK/fontes) com QR e formato do congresso confirmados, mantendo a composição congelada.

## 7. Documentos necessários
`final/README.md`; dados 2024 (secção do poster); regras `.claude/rules/production-foundations.md`, `primary-source-and-visual-audit.md`; «Nota — conjunto canónico de parcerias» no estado.

## 8. Pendências observadas
- 🟠 **Prepress FASE B:** CMYK c/ perfil da gráfica + incorporação de fontes.
- 🟠 **QR final** + **formato/título do congresso** por confirmar (rótulo «PROVA VISUAL»).
- 🟠 **Direitos das fotografias** (se houver).
- 🟠 **Arte-fonte `proof/` não versionada** (gerador no scratchpad).

## 9. Dossiê do modo de trabalhar (Item 4)
Peça académica com **texto-protagonista** e rigor científico (dados HUMAN, referências auditadas). Gerador canónico único (`proof.py`); versões de impressão **derivadas**, nunca redesenhadas. Lição registada: não confundir arte rejeitada (`master/`) com canónica; não reinterpretar «não alterar proporção» como novo formato.

## 10. Onde está cada informação
- **Arte final/prova:** `docs/dissemination/poster-congresso/final/` + `print-A0/`.
- **Rejeitado:** `…/master/` (não usar).
- **Dados/estado:** `docs/project/ESTADO_ITENS_1-5_2026-10-01.md` (Item 4) + memória «Disseminação — poster + materiais».

## 11. Registo incremental (append-only — acrescentar no fim; nunca reescrever entradas)
> Formato: `AAAA-MM-DD · TIPO · descrição · fonte`. TIPO ∈ **NOVO** · **DECISÃO** · **ALTERADO** · **REMOVIDO** · **PENDENTE** · **RESOLVIDO**. Método em `00_INDEX_E_METODO.md`.

- 2026-10-12 · NOVO · Registo incremental iniciado. Estado de referência = §2 deste ficheiro (2026-10-12).
