> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.

# Auditoria científica + proposta — Posters Item 4 e Item 12

**Data:** 2026-10-06 · **Estado:** PARECER / HUMAN GATE — *nada foi alterado na arte; nada foi regenerado*.
**Âmbito:** auditoria de conteúdo, mapa de espaço, validação de referências e proposta de copy ajustada ao espaço. A decisão é do responsável.

---

## 0. Validação das referências (transversal aos dois posters)

| Ref. | Entrada bibliográfica | Estado |
|---|---|---|
| **A** | HAUSCHILD, Theodor; TEICHNER, Felix — *Milreu: Ruínas*. Lisboa: Instituto Português do Património Arquitectónico, 2002. (Roteiros da Arqueologia Portuguesa, 9). | **CONFIRMADA** — consta do repo (`docs/design-source/PRIMARY_CONTEXTUAL_SOURCE.md`, `IMAGE_USE_AND_ATTRIBUTION.md`). Fonte primária do sítio. |
| **B** | JÁCOMO, Fernando Rodrigues de — *Avaliação preliminar para a aplicação de medidas de compromisso comunitário em Milreu, Estói*. [ResearchGate, publicação 396400302]. | **PARCIAL** — título, autoria e método (inquéritos online + entrevistas + observação) confirmados pelo resumo público. **NÃO confirmados na fonte:** ano (referido como «2024»), tipo de publicação, venue, DOI. A página ResearchGate devolve **HTTP 403** e o Google Scholar **não indexa** o registo → impossível ler o PDF e confirmar números. |
| **C** | MOSHENSKA, Gabriel (ed.) — *Key Concepts in Public Archaeology*. London: UCL Press, 2017. ISBN 978-1-911576-41-9. DOI: 10.14324/111.9781911576419. (CC BY 4.0). | **CONFIRMADA** — verificada em UCL Press / OAPEN. |

> **BLOQUEIO DE INTEGRIDADE (crítico).** Os números do inquérito (**n**, **satisfação /10**, **%**) **não foram confirmáveis na fonte**. O corpo aprovado do Item 12 afirma **«inquérito local (n=385)»**; qualquer valor proposto para o Item 4 (ex.: n=532; satisfação 7,6/10) **diverge** desse número e **não** pode ser inscrito por inferência. Antes de citar qualquer número é preciso que o autor confirme directamente no documento de 2024: (a) o **n** correcto e o que ele conta (respostas totais vs. visitantes vs. não visitantes vs. entrevistas); (b) se existe pontuação de satisfação e a sua base; (c) ano/tipo/DOI para a referência B. **Enquanto isso não for confirmado, as propostas de copy abaixo são number-free** (deixam marcador `[n=__]` / `[__]`).

---

## ITEM 4 — Poster A0 «Projecto Comunitário de Milreu»

**Ficheiro-fonte:** `docs/dissemination/poster-congresso/source/generators/poster_proof_print.py` · **Formato:** A0 (841×1189 mm), margem 48 mm, coluna útil 745 mm. **Arte = vetor** (gerada), logo com espaço editável real.

### 4.1 Auditoria científica (estrutura actual)

Fluxo vertical contínuo, posições derivadas (cada secção começa no fundo da anterior):

1. Cabeçalho (eyebrow APC + título + autor/UAlg + identificador MSF)
2. **Contexto** — «O Projecto Comunitário de Milreu» + «Do diagnóstico à intervenção» (+ pull-quote + foto histórica)
3. **Metodologia** + «O que entendemos por Arqueologia Pública e Comunitária?»
4. Iniciativas — «Entre Ruínas e Memórias» · «Circuito Educativo»
5. Desenvolvimento em 2026 (duas entradas)
6. «Próximos passos»
7. Rodapé (identificador MSF + parceria/apoio + barra de logótipos + curadoria + ©)

**Lacunas face ao pedido:**
- **Não existe** secção explícita de **Objectivo** (está implícito no Contexto).
- **Não existe** bloco de **Resultados** quantitativos (o diagnóstico 2024/auscultação 2026 aparece só em texto qualitativo).
- **Não existe** secção de **Discussão** rotulada (função dispersa por «O que é APC» + «Próximos passos»).
- **Não existe** bloco de **Referências bibliográficas**.
- **Não existe** **contacto** por e-mail (o rodapé tem curadoria/autor, sem endereço).
- Factualidade do corpo: **sólida e sem números inventados** — a redação é deliberadamente qualitativa, o que é correcto enquanto os números não estiverem confirmados.

### 4.2 Mapa de espaço

A arte é vetor e o fluxo empurra tudo para baixo até ao rodapé, que é fixo e começa em `fy-108` (≈ y 1063 mm). O único «ar» disponível é o intervalo entre o fim de «Próximos passos» e o topo do rodapé. É **estreito mas existe**, porque o rodapé é fixo e o corpo termina antes dele.

| Elemento a inserir | Footprint | Classificação |
|---|---|---|
| **Contacto (e-mail)** na linha de curadoria do rodapé | ~0 (reaproveita linha existente) | **CABE SEM ALTERAR LAYOUT** |
| **Referências** (3 entradas, tamanho legenda) | 1 bloco pequeno acima do rodapé | **CABE COM MICRO-CONDENSAÇÃO** |
| **Objectivo** (1 frase/rótulo) | baixo, se integrado no Contexto | **CABE COM MICRO-CONDENSAÇÃO** |
| **Resultados** (linha curta, number-free por agora) | baixo, se integrado em «Do diagnóstico à intervenção» | **CABE COM MICRO-CONDENSAÇÃO** |
| **Discussão** como secção própria nova | alto (quebra o fluxo) | **EXIGE REDISTRIBUIÇÃO → NÃO RECOMENDADO** (integrar em vez de criar bloco) |

**Prioridade se o espaço apertar:** 1. Objectivo · 2. Resultados · 3. Contacto · 4. Referências · 5. Discussão. (Tentar integrar Discussão num bloco existente **antes** de a deixar cair.)

### 4.3 Avaliação de propostas A/B (copy)

Para cada rubrica, **A = mínima** (menos espaço, integra-se no corpo existente) e **B = mais completa** (precisa de micro-condensação adicional). Todas em pré-AO90 («projecto»), coerentes com o rodapé.

**OBJECTIVO**
- **A (recomendada):** rótulo discreto a abrir o Contexto — «**Objectivo.** Compreender e reduzir o distanciamento entre a população de Estoi e as Ruínas de Milreu, criando relações mais activas de memória, participação, educação e acesso público.»
- **B:** parágrafo autónomo acrescentando o enquadramento doutoral e a passagem «do diagnóstico à intervenção».
- *Avaliação:* **A** — cabe sem redistribuição e não duplica o que o Contexto já diz; **B** repete conteúdo já presente → custo de espaço sem ganho informativo.

**RESULTADOS** *(number-free enquanto a fonte não confirmar)*
- **A (recomendada):** uma frase integrada em «Do diagnóstico à intervenção» — «O diagnóstico identificou **distanciamento, lacunas de comunicação e baixa participação**; a auscultação de 2026 mostra que, entre não visitantes, **não visitar não equivale a desinteresse** — há valorização do património local, da memória e da educação.» *(sem n/%, tal como hoje)*
- **B:** mini-destaque com números **apenas depois de confirmados**: «Inquérito 2024 (**[n=__]**): **[__]%** valorizam o património local; **[__]%** interessados em experiências práticas; satisfação **[__]/10**.»
- *Avaliação:* **A** pode entrar já (é o texto actual, melhorado); **B** fica **bloqueada** até confirmação dos números na fonte 2024 — e, a entrar, implica reconciliar com o «n=385» do Item 12.

**DISCUSSÃO**
- **A (recomendada):** uma frase a fechar «Próximos passos» — «**Discussão.** A aproximação entre investigação académica e comunidade sugere que metodologias comunitárias podem reforçar a responsabilidade social e a corresponsabilização pelo património.»
- **B:** secção «Discussão» autónoma com 3-4 linhas e remissão às referências A/C.
- *Avaliação:* **A** — integra-se sem quebrar o fluxo; **B** **não recomendada** (exige redistribuição de toda a metade inferior).

### 4.4 Referências — proposta de inscrição (3 entradas)

Bloco pequeno «**Referências**» imediatamente **acima** do separador do rodapé (`fy-26`), tamanho legenda (`T_LEG≈0.82`), 3 linhas:

```
Referências
Hauschild, T. & Teichner, F. (2002). Milreu: Ruínas. Lisboa: IPPAR (Roteiros da Arqueologia Portuguesa, 9).
Jácomo, F. R. de ([ANO]). Avaliação preliminar para a aplicação de medidas de compromisso comunitário em Milreu, Estói.
Moshenska, G. (ed.) (2017). Key Concepts in Public Archaeology. London: UCL Press. DOI: 10.14324/111.9781911576419.
```
*(o `[ANO]` de B fica por confirmar; sem inventar venue/DOI de B.)*

### 4.5 Onde entraria exactamente cada elemento (Item 4)

| Elemento | Localização exacta no gerador |
|---|---|
| Objectivo (A) | prefixo da 1.ª frase do Contexto (`poster_proof_print.py:163`) |
| Resultados (A) | é o parágrafo «Do diagnóstico à intervenção» (`:165`) — melhoria pontual, sem números |
| Resultados (B, números) | mini-destaque novo entre `:165` e `:167` — **só após confirmação** |
| Discussão (A) | frase final de «Próximos passos» (`:296`) |
| Referências | bloco novo antes de `c.line("footer",…,fy-26,…)` (`:330`) |
| Contacto (e-mail) | linha de curadoria do rodapé (`:331`) |

---

## ITEM 12 — Poster de Congresso 2 (corpo aprovado + rodapé 2026)

**Ficheiro-fonte:** `docs/dissemination/poster-congresso2/source/generators/build_item12_final.py` · **Corpo = raster** (PSD aprovado `Milreu - Proposta de Trabalho-8.psd`, 1200×1700) embebido; **rodapé = vetor** (100 px).

### 12.1 Auditoria científica

- Corpo **aprovado e imutável** (peça já validada): título «INTEGRAÇÃO COMUNITÁRIA…», iniciativas antigas, e-mail `a78190@ualg.pt`, «**inquérito local (n=385)**». Divergências face ao canónico estão registadas em `ITEM12_CONTENT_NOTES.md` como *INFORMATION ONLY — NOT CHANGED*.
- Rodapé vetor (só a camada 2026): assinatura «Projecto Comunitário de Milreu» + «MUSEUS SEM FRONTEIRAS · INICIATIVAS 2026» (esq.) + eyebrow «APOIO INSTITUCIONAL E PARCERIAS» + barra de 5 logótipos (dir.).

### 12.2 Mapa de espaço

- **Corpo raster:** **não aceita inserção de texto** sem redesenho do PSD. Qualquer novo texto só pode viver no rodapé vetor.
- **Rodapé:** 100 px, **já cheio** (2 linhas à esquerda + eyebrow + 5 logótipos à direita). Margem livre mínima.

| Elemento | Classificação |
|---|---|
| Referências no corpo | **NÃO RECOMENDADO** (corpo raster, exigiria redesenho do PSD) |
| Referências no rodapé actual (100 px) | **NÃO RECOMENDADO** (sem espaço; comprometeria legibilidade) |
| Referências via **rodapé mais alto** (ex.: 100→150 px) | **EXIGE REDISTRIBUIÇÃO** (aumentar `FOOTER_H`, reescalar corpo) — possível, mas é uma alteração de layout a decidir |

### 12.3 Metodologia — **confirmação: NÃO é necessária**

O corpo aprovado já remete para o método (inquérito local + abordagem comunitária). Acrescentar um bloco «Metodologia» é **desnecessário** e, além disso, **impossível** no corpo raster. **Confirmado: não adicionar Metodologia ao Item 12.**

### 12.4 Proposta de referências (Item 12)

Dado o constrangimento, **a opção conservadora é NÃO inserir referências no Item 12** nesta fase (manter a peça aprovada intacta). Se o responsável quiser mesmo referências, a única via limpa é **aumentar o rodapé** (`FOOTER_H` 100→≈150 px) e inscrever **uma micro-linha** de 1-2 fontes-chave (A e C), em tamanho ≤10 px — o que constitui alteração de layout sujeita a nova prova visual.

### 12.5 Alteração recomendada (Item 12)

- **Recomendado:** **não alterar** o corpo nem forçar referências; no máximo, acertar o `[ANO]`/grafia **apenas** se e quando houver redesenho do PSD aprovado.
- **Flag obrigatória:** discrepância **n=385 (corpo Item 12)** vs. qualquer «n» proposto para o Item 4 → reconciliar na fonte 2024 antes de publicar números em qualquer peça.

---

## RECOMENDAÇÃO — O QUE ALTERAR / O QUE NÃO ALTERAR

### Item 4 (A0, vetor)
**ALTERAR (recomendado):**
1. **Referências** — bloco de 3 entradas (A confirmada, C confirmada, B sem ano/DOI até confirmação).
2. **Contacto** — acrescentar e-mail à linha de curadoria do rodapé.
3. **Objectivo (variante A)** — rótulo a abrir o Contexto.
4. **Resultados (variante A, number-free)** — melhoria pontual do parágrafo existente.
5. **Discussão (variante A)** — frase integrada em «Próximos passos».

**NÃO ALTERAR:**
- Não criar secção **Discussão** autónoma (quebra o fluxo).
- Não inscrever **números** de inquérito (n/%/satisfação) **até confirmação na fonte 2024**.
- Não mexer na identidade, logótipos, grafia pré-AO90, nem no fluxo das iniciativas.

### Item 12 (raster aprovado + rodapé vetor)
**ALTERAR:** **nada** no corpo. (Opcional, só por decisão: aumentar `FOOTER_H` para caber 1 micro-linha de referências — é alteração de layout.)
**NÃO ALTERAR:**
- Não tentar inserir texto/referências no corpo raster.
- Não adicionar **Metodologia** (desnecessária e impossível no raster).
- Não «corrigir» por inferência o título/iniciativas/e-mail/n=385 do corpo aprovado.

### Gate humano (bloqueia execução)
1. Confirmar na **fonte Jácomo 2024**: **n** (e o que conta), **satisfação/%** (se existem), **ano/tipo/DOI** da referência B.
2. Decidir, para o **Item 4**, variantes A vs. B de Objectivo/Resultados/Discussão.
3. Decidir, para o **Item 12**, se se mantém intacto (recomendado) ou se se aumenta o rodapé para referências.
4. Reconciliar a discrepância **n=385 vs. [n proposto]** antes de qualquer número ir para arte.

*Após decisão, regenerar a arte (Item 4) e/ou rever o layout (Item 12) e emitir nova prova. Prepress CMYK/fontes (FASE B) permanece pendente para ambos.*

---

# REAVALIAÇÃO 2026-10-06 — DADOS 2024 RESOLVIDOS + COPIES APROVADAS

> Esta secção **supersede** os pontos acima bloqueados por falta de números. O responsável resolveu o bloqueio de integridade e aprovou copies concretas. Medição feita **em memória, sem escrever/regenerar qualquer arte** (`scratchpad/measure_item4*.py`). Continua em HUMAN GATE.

## Dados 2024 — canónicos (decisão humana)
- **532** respostas totais · **422** do Algarve · **318** tinham visitado Milreu · **98** não tinham visitado · satisfação média **entre visitantes = 7,6/10** · **9** entrevistas qualitativas.
- **n=385 = amostra mínima prevista** (desenho amostral), **não** o total efectivo. Não misturar meta amostral com amostra efectiva. Não apresentar 7,6/10 como avaliação de toda a população (é satisfação dos visitantes).
- Referência B corrigida: **JÁCOMO, F. R. de (2025)** — publicação é de **2025**; 2024 = período/dados.

## Referências — metadados canónicos (formato compacto de poster)
1. **HAUSCHILD, T.; TEICHNER, F. (2002).** *Milreu: ruínas.* Lisboa: Instituto Português do Património Arquitectónico. Roteiros da Arqueologia Portuguesa, 9.
2. **JÁCOMO, F. R. de (2025).** «Avaliação preliminar para a aplicação de medidas de compromisso comunitário em Milreu, Estoi». *Anais do Município de Faro*, XLVII, pp. 323–358.
3. **MOSHENSKA, G. (ed.) (2017).** *Key Concepts in Public Archaeology.* London: UCL Press.

## ITEM 4 — mapa de espaço REAL (medido, A0, mm)
O poster **já está cheio**: o corpo termina em **1063,5 mm** e o rodapé começa em **1063,0 mm** → **gap livre ≈ 0 (−0,5 mm)**. Nada cai em espaço vazio; cada adição é **financiada por condensação/substituição**.

| Operação | Altura (mm) | Efeito no orçamento vertical |
|---|---|---|
| **RESULTADOS (cond)** substitui o parágrafo «Do diagnóstico à intervenção» | 18,1 (vs 45,1 actual) | **LIBERTA −27,1** |
| Remover pull-quote «Não visitar Milreu…» | 7,0 | **LIBERTA −7,0** |
| Condensar abertura «O Projecto Comunitário…» | 36,1 (vs 45,1) | **LIBERTA −9,0** |
| **OBJECTIVO (rótulo + 2 linhas)** novo | 28,2 | +28,2 |
| **DISCUSSÃO** integrada (prefixo de «Próximos passos», largura total = 2 linhas) | 18,1 | +18,1 |
| **REFERÊNCIAS** (título + 3 linhas, tamanho legenda) | 23,6 | +23,6 |
| **CONTACTO** (e-mail numa linha existente) | ~0 | +0 |

**Balanço:** adições ≈ **+69,9 mm**; libertado por substituição+condensação ≈ **−43,1 mm**; falta reclamar ≈ **+26,8 mm**, disponível com folga ao condensar **um** bloco da faixa «Metodologia» (col-esq ≈ 33 mm) **ou** «Desenvolvimento em 2026» (col-esq ≈ 16 mm, parcialmente redundante com o texto das iniciativas).

### Classificação por elemento (actualizada)
- **Resultados:** CABE — na verdade **liberta** espaço (substitui bloco maior). *(mesmo a versão longa = 37,2 mm continua < 45,1, logo também cabe.)*
- **Objectivo:** CABE COM REDISTRIBUIÇÃO (financiado por abertura condensada + remoção do pull-quote). As duas versões (completa/condensada) ocupam **2 linhas** → **usar a completa** (1.ª opção), sem custo extra.
- **Contacto:** CABE SEM ALTERAR LAYOUT.
- **Referências:** CABE COM REDISTRIBUIÇÃO (condensar Metodologia **ou** Desenvolvimento 2026).
- **Discussão integrada:** CABE COM REDISTRIBUIÇÃO (pequena, 2 linhas a largura total).
- **Discussão como caixa autónoma:** NÃO RECOMENDADO.

### Implantação exacta (onde entra cada elemento — `poster_proof_print.py`)
1. **OBJECTIVO** — novo bloco no topo da coluna «context», **antes** do título «O Projecto Comunitário de Milreu» (`:162`): eyebrow vermelho «OBJECTIVO» (estilo `:151`) + a frase completa aprovada (2 linhas, `s`, `T_BODY`, largura `LWc`). Financiado condensando a abertura `:163`.
2. **RESULTADOS** — renomear o subtítulo `:164` para **«Diagnóstico e resultados (2024)»** e **substituir** o parágrafo `:165` pela copy **cond** aprovada (com 532 / 422 / 7,6/10 enquadrado como satisfação dos visitantes). Remover o pull-quote `:166-167`.
3. **DISCUSSÃO** — **prefixo** do parágrafo «Próximos passos» `:296` (largura total, 2 linhas) — sem caixa nova.
4. **CONTACTO** — nova linha no bloco de autoria do cabeçalho (direita, após `:156`): `a78190@ualg.pt` (`u`, `T_META*0.82`, `end`, INK5).
5. **REFERÊNCIAS** — novo bloco **acima** do separador do rodapé (antes de `c.line("footer",…,fy-26,…)` `:330`): título «Referências» + 3 linhas compactas (legenda). Financiado condensando `:178` (Metodologia) **ou** `:288`/`:291` (Desenvolvimento 2026).

### Copy final proposta (Item 4)
- **OBJECTIVO (completa):** «Compreender a relação entre população e Milreu e transformar o diagnóstico de 2024 em estratégias de Arqueologia Pública e Comunitária, articulando memória, mediação e participação.»
- **RESULTADOS (cond):** «O diagnóstico de 2024 revelou uma experiência de visita globalmente positiva (7,6/10 entre visitantes), mas também distanciamento e fragilidades de comunicação; das 532 respostas, 422 do Algarve. Os resultados sustentaram a necessidade de reforçar mediação, divulgação e participação comunitária.» *(nota: acrescentei «entre visitantes» e os totais para não atribuir 7,6/10 a toda a população; se exceder 2 linhas, usar a cond original sem os totais.)*
- **DISCUSSÃO (integrada):** «Os resultados indicam que o desafio não é apenas aumentar a visitação: mesmo com avaliação positiva da experiência, persistem barreiras de comunicação e distância entre o sítio e parte da comunidade — ao que o projecto responde com dispositivos participativos de memória, educação e mediação.»

## ITEM 12 — correcção factual de n=385 (frase verificada)
**Frase real do corpo (verificada na imagem):** «…investigação académica iniciada em 2024, **baseada em inquérito local (n=385)**, que identificou um progressivo distanciamento…».
**Sentido:** 385 aparece como **base efectiva** do inquérito que «identificou» o distanciamento → está a ser usado como **amostra/resultado efectivo**, o que é **factualmente incorrecto** (385 = amostra mínima prevista; efectivo = 532 / 422 Algarve).

**Correcção mínima — opções (sem redesenhar o corpo, decisão do responsável):**
- **(Recomendada) Editar apenas o parêntese** no corpo (mesma caixa, mesmo layout — não é redesenho): `(n=385)` → **«(inquérito de 2024: 532 respostas, 422 do Algarve)»** *ou*, mais curto, **«(2024; 532 respostas)»**. É a única correcção plenamente fiel ao sentido «que identificou…».
- **(Alternativa, se o corpo for intocável)** manter o corpo e inscrever uma **nota de rectificação discreta em vetor no rodapé existente** (sem o aumentar): «Rectificação: n=385 = amostra mínima prevista; o inquérito de 2024 reuniu 532 respostas (422 do Algarve).» — honesto, mas visível.
- **(Se se quisesse preservar o 385 como desenho amostral)** `(n=385)` → **«(amostra mínima prevista: n=385)»** — só legítimo se a frase passar a descrever o desenho, o que **não** corresponde ao «que identificou…» actual.

**Mantido:** não acrescentar Metodologia; não aumentar o rodapé para referências; referências só se houver solução muito discreta (não há no rodapé actual de 100 px) → **não inserir referências no Item 12**.

## O QUE ALTERAR / O QUE NÃO ALTERAR (reavaliado)
**Item 4 — ALTERAR:** Objectivo (completa) · Resultados (cond, substitui diagnóstico) · Contacto (e-mail) · Referências (3) · Discussão integrada. **NÃO:** caixa de Discussão autónoma; atribuir 7,6/10 a toda a população; tocar em identidade/logótipos/grafia pré-AO90.
**Item 12 — ALTERAR:** apenas o parêntese `n=385` (correcção factual). **NÃO:** Metodologia; expandir rodapé; referências; «corrigir» título/iniciativas/e-mail do corpo aprovado.

## Gate humano (bloqueia execução)
1. Item 4 — confirmar a copy de **Resultados** (com ou sem os totais na mesma frase) e aprovar o plano de financiamento (condensar Metodologia **ou** Desenvolvimento 2026).
2. Item 12 — escolher a via de correcção do `n=385`: **editar parêntese no corpo** (recomendado) vs **nota de rectificação no rodapé** vs **manter 385 como desenho amostral**.
3. Só então regenerar a arte do Item 4 e aplicar a correcção do Item 12; emitir novas provas. FASE B (CMYK/fontes) continua pendente.

---

# EXECUÇÃO 2026-10-06 — PROVAS GERADAS (a aguardar validação visual)

Decisões humanas aplicadas. Provas geradas; **não é prepress final**. Nada aprovado automaticamente — aguarda validação visual do responsável.

## Item 4 — aplicado em `poster_proof_print.py` (prova `out/poster_congresso_PROVA_VISUAL_v9.svg/.png`)
- **Objectivo** (versão completa) — novo lead rotulado no topo da coluna de contexto.
- **Diagnóstico e resultados (2024)** — bloco renomeado; copy: «O inquérito de 2024 (532 respostas) revelou uma avaliação positiva da experiência entre visitantes (7,6/10)…». Sem «422 do Algarve» no bloco principal; 7,6/10 explicitamente ligado aos visitantes. Pull-quote removido.
- **Discussão** integrada em «Discussão e próximos passos» (sem caixa nova).
- **Contacto** `a78190@ualg.pt` junto à autoria (direita do cabeçalho).
- **Referências** (3, compactas) acima do rodapé.
- **Espaço reclamado** (ordem pedida): Desenvolvimento 2026 condensado a 1 faixa; Metodologia micro-condensada (mantida presente, versão mínima); mais aperto ligeiro de intervalos de secção. **Museu/Circuito não alterados.**

**Verificação automática (medida):** overflow/clipping **nenhum** (`REFS end=1053,0 mm` vs `footer_top=1063,0 mm`, **folga +10,0 mm**); **colisões texto/foto = 0**. Corpos: corpo 20 pt · Metodologia 18 pt · **referências 12,9 pt** (todas 1 linha; 212/341/172 mm em 745 mm) — acima do mínimo do sistema (~10,8 pt). Altura do conteúdo = 1053 mm (A0 1189 mm); rodapé 1063–1171 mm. Metodologia preservada ✔.

## Item 12 — correcção factual aplicada em `poster_body.png`
- `(n=385)` → **`(2024; 532 respostas)`**. Reflui para **5 linhas** (igual ao original), sem colisão com o bloco seguinte (510 vs 543 px). Original preservado em `source/poster_body_ORIG_n385.png`. Final regenerado: `final/poster_congresso2_C.svg/.png`.
- **Sem** Metodologia / referências / novo bloco / rodapé maior. Restante corpo preservado.
- `n=385` **eliminado como resultado efectivo** ✔.

## Flags para HUMAN GATE
1. **Item 12 — tipografia:** o parágrafo foi re-composto em **Helvetica Neue** (Acumin Pro, a fonte original do corpo, **não está instalada** nesta máquina). Match muito próximo em prova, mas **não idêntico** aos restantes parágrafos Acumin. **Para prepress final, editar o parêntese no PSD com Acumin Pro** (reflui igual) para preservar a identidade tipográfica exacta.
2. **Item 12 — redundância textual (observação):** a frase passa a ter «2024» duas vezes («iniciada em 2024, … (2024; 532 respostas)»). Apliquei a string exacta pedida; se preferir, numa futura edição do corpo poderá retirar-se «iniciada em 2024» — **não** alterado agora (fora do pedido).
3. **FASE B** (CMYK + incorporação de fontes) continua pendente para ambos.

---

# AJUSTES FINAIS 2026-10-06 (HUMAN REVIEW)

## Item 4 — **HUMAN DESIGN PASS**
- **Único ajuste aplicado:** referências condensadas para formato compacto de poster, numa **única linha a 16 pt** (antes 12,9 pt), preservando autor + ano + identificação essencial:
  > Referências — Hauschild, T. & Teichner, F. (2002). Milreu: ruínas. IPPAR. · Jácomo, F. R. de (2025). Anais do Município de Faro, XLVII, 323–358. · Moshenska, G. (ed.) (2017). Key Concepts in Public Archaeology. UCL Press.
- **Sem** reclamar espaço estrutural adicional. Verificação: `REFS end=1040,5 mm` vs `footer_top=1063,0 mm` → **folga +22,5 mm**; **colisões = 0**. Museu, Circuito, Metodologia, imagens, identidade, parceiros e copy científica **não alterados**.

## Item 12 — **CONTENT PASS / FINAL ART PENDING SINGLE PSD TEXT CORRECTION** (decisão final)
> **Decisão HUMAN final 2026-10-06:** Item 12 é **peça legada aprovada** — preservar a tipografia original (Bebas Neue títulos · Acumin Pro corpo · Source Sans 3 autoria · Archivo rodapé 2026; coexistência intencional). A **normalização para DS fica SUPERSEDED** (STOP/REPORT aceite). **Única alteração:** `(n=385)` → `(532 respostas)` **no PSD, em Acumin Pro** (não Archivo). Provas com Archivo = **PROOF ONLY/SUPERSEDED**. Arte revertida ao legado (== main) até chegar o PNG corrigido. Detalhe em `poster-congresso2/ITEM12_TYPOGRAPHY_NORMALIZATION_2026-10-06.md`.

### (Histórico) override Acumin → Archivo só no parágrafo
- Copy final aplicada: `(n=385)` → **`(532 respostas)`** (sem «2024» no parêntese, sem `n=385`, sem «422 Algarve»).
- **Decisão HUMAN 2026-10-06:** adoptado **Archivo** (sans do DS) no parágrafo editado, dispensando Acumin Pro; aplicado **só** a esse parágrafo (resto do corpo intacto). Corpo canónico `poster_body.png` corrigido; original em `poster_body_ORIG_n385.png`.
- **QA:** diferenças só no parágrafo (bbox 24,389–541,510); **0 px fora**; 5 linhas, sem overflow (510 vs 543); nenhuma outra copy mudou; composição inalterada. Prova integral `final/poster_congresso2_C_preview.png`; comparação `review/item12/REGIAO_CORRIGIDA_ANTES_DEPOIS.png`. Provas Helvetica/estado n=385 removidas (histórico em `ITEM12_FONT_REQUIRED_2026-10-06.md`).
- Não se acrescentou Metodologia/referências/rodapé. **Gate restante: FASE B.**
