> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.

# Item 12 — Normalização tipográfica (sans do DS) · AUDIT + STOP/REPORT

**Data:** 2026-10-06 · **Estado:** **CONTENT PASS / TYPOGRAPHY NORMALIZATION PENDING.** Não iniciar FASE B. Item 4 **não** é alterado.

## Decisão humana (interpretação corrigida)
A versão final deve adoptar o **sans do DS (Archivo)** de forma **coerente** onde substituir a Acumin Pro seja editorialmente equivalente — **não** apenas no parágrafo corrigido. O estado actual (parágrafo = Archivo; restante corpo = Acumin) é uma **mistura incoerente no mesmo nível de informação** e **não é final**.

## Auditoria de fontes (PSD `Milreu - Proposta de Trabalho-8.psd`, 21 camadas de texto)

| Elemento | Fonte actual | Função | Substituir por Archivo? | Impacto |
|---|---|---|---|---|
| «INTEGRAÇÃO COMUNITÁRIA…» (título) | **BebasNeue** 73 px | título condensado | **NÃO — legado** | DS não tem condensada (display=Fraunces serif); Archivo mudaria a identidade |
| Headings de secção ×6 (Enquadramento/Problema; Observações iniciais; Causas raízes; Ruínas Romanas de Milreu; Resposta experimental; Conclusão) | **BebasNeue** 32–41 px | headings condensados | **NÃO — legado** | idem (excepção documentada) |
| Autor / afiliação (topo) | SourceSans3 Bold/Reg 25 px | metadata sans | **SIM** | coerência sans |
| Parágrafo ENQUADRAMENTO | AcuminPro-Regular 21 px | corpo | **SIM** | — |
| «Causas raízes» (bullets) | AcuminPro-Regular 21 px | bullets | **SIM** | quebras de linha deslocam |
| «Hipótese:» (box azul) | AcuminPro-Bold+Reg 21 px | label+corpo em caixa | **SIM** | altura do bloco/caixa |
| «Localização:» | AcuminPro-Bold+Reg+Italic 21 px | label+corpo | **SIM** | — |
| «Programa plurianual…» + Iniciativas | AcuminPro-Bold+Reg 21 px | corpo+bullets | **SIM** | — |
| Legendas da planta / «Região do Algarve» | AcuminPro-Regular 10 px | legenda | **SIM** | — |
| «Histórico:» + bullets | AcuminPro-Bold+Reg 21 px | corpo+bullets | **SIM** | — |
| «Objetivo:» | AcuminPro-Bold+Reg 21 px | label+corpo | **SIM** | — |
| «Desafios Encontrados» + bullets | AcuminPro-Bold+Reg 21 px | corpo+bullets | **SIM** | — |
| Legenda Hauschild | AcuminPro-Regular 10 px | legenda | **SIM** | — |
| «Conclusão» (corpo) | AcuminPro-Regular 21 px | corpo | **SIM** | — |
| «Problema identificado:» (box azul) | AcuminPro-Bold+Reg 21 px | label+corpo em caixa | **SIM** | altura do bloco/caixa |
| Rodapé 2026 (vetor) | **Archivo** | assinatura/apoios | já DS | — |

**Famílias actuais:** BebasNeue ×7 · AcuminPro (Reg/Bold/Italic) ×13 camadas · SourceSans3 ×1 · (rodapé Archivo, vetor).

## Inventário final de fontes (meta)
| Elemento | Família final | Motivo |
|---|---|---|
| Título + headings de secção | **BebasNeue (legado)** | Personalidade da peça aprovada; sem equivalente condensado no DS — **excepção documentada** |
| Autor/afiliação, corpo, bullets, legendas, labels, metadata, caixas | **Archivo (DS)** | Sans canónica do DS; elimina a mistura Acumin/SourceSans/Archivo no mesmo nível |
| Rodapé 2026 | Archivo (DS) | Já conforme |
| Copy factual | — | Mantém **`(532 respostas)`** (sem outra alteração de copy) |

## STOP / REPORT — porque não se migra sobre o raster sem redesenho
O corpo é um **raster achatado**; a troca de fonte em todos os blocos exigiria **re-compor** cada bloco sobre a imagem. Como o Archivo tem métricas diferentes do Acumin, ao manter corpo/legibilidade (sem comprimir), **as quebras de linha e as alturas dos blocos mudam** dentro das caixas fixas. Blocos que **não** migram sobre o raster sem risco estrutural:

- **Listas com bullets** (Causas raízes, Histórico, Iniciativas, Desafios) — indentação pendente + glifo de bullet + re-wrap por item ⇒ nº de linhas e altura mudam.
- **Labels bold inline + corpo** (Localização, Objetivo, Hipótese, Problema identificado) — layout de runs mistos.
- **Texto em caixas azuis** (Hipótese, Problema identificado) — altura do texto define a relação com a caixa; qualquer deslize desalinha.
- **Bloco de autor centrado** (SourceSans, bold+reg) — centragem + largura.
- **Blocos adjacentes a imagens/colunas** — um deslize de altura causa colisão ou desequilíbrio de colunas.

Uma migração **parcial** (só alguns blocos) **recriaria** a mistura incoerente que se quer eliminar. Logo, a normalização tem de ser **integral** — e integral, de forma fiel, **só no PSD**.

## Execução recomendada (no PSD — preserva tudo)
1. Abrir `Milreu - Proposta de Trabalho-8.psd`.
2. Selecionar **todas** as camadas de texto em **AcuminPro** e **SourceSans3** e definir família **Archivo**: Regular→Archivo Regular, Bold→Archivo SemiBold/Bold, Italic→Archivo Italic.
3. **Manter** as caixas de texto, posições, cores, alinhamentos, leading e tracking; **ajustar opticamente** (o tamanho numérico do Archivo ≈ 0,94× do Acumin para a mesma largura — ex.: 21,3 px → ~20 px) **dentro das caixas existentes**, sem comprimir nem reduzir legibilidade.
4. **Manter BebasNeue** nos títulos/headings (excepção de legado).
5. Aplicar em simultâneo a copy factual **`(n=385)` → `(532 respostas)`** (sem «2024» no parêntese).
6. Exportar o composto 1200×1700 → substituir `source/poster_body.png` → regenerar `final/poster_congresso2_C.svg`.

Depois disto, farei a **QA visual** (prova integral + ANTES|DEPOIS + crops) comparando com a peça aprovada: quebras de linha, alturas de blocos, bullets, headings, colisões, overflow, equilíbrio de colunas, posição das imagens, rodapé e densidade. Só com PASS: **HUMAN DESIGN PASS / EDITORIAL CONTENT FROZEN**.

## Estado do ficheiro actual
O corpo canónico mantém, **a título interino**, a copy `(532 respostas)` com o parágrafo em Archivo e o restante em Acumin — **mistura reconhecidamente não-final**, assinalada aqui como PENDING. Não é a arte final.

## Não fazer
Não alterar Item 4 · não comprimir texto/reduzir legibilidade · não substituir BebasNeue automaticamente · não iniciar FASE B.
