---
title: "ADR-DS-009 — Tema escuro do Portal e do Museu na Web"
version: "0.2.1"
status: "accepted"
date: "2026-10-13"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md na raiz do repositório"
---
# ADR-DS-009 — Tema escuro do Portal e do Museu na Web

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu.

## Estado
Aceite. Decisão do responsável (Fernando Rodrigues de Jácomo), 2026-10-13, feita directamente a Claude. Esta ADR complementa a ADR-DS-007 e não a revoga.

## Contexto
O responsável pediu um modo escuro para o site, que muda a cor de base clara («bege»), e escolheu este comportamento:
- segue a preferência do dispositivo;
- tem um botão no cabeçalho;
- a escolha fica guardada.

A ADR-DS-007 define superfícies claras para leitura prolongada.

## Decisão
1. A identidade por omissão continua **clara** (papel/branco documental). O tema escuro só se aplica quando:
   - o dispositivo o pede (`prefers-color-scheme: dark`); ou
   - a pessoa o escolhe no botão. A escolha fica em `localStorage` (`milreu-theme`), só como preferência visual.
2. O tema escuro **só redefine tokens semânticos** (`--ml-surface-*`, `--ml-text-*`, `--ml-border-*`, `--ml-focus-ring`):
   - os componentes continuam a consumir os mesmos tokens;
   - não há componentes duplicados;
   - não há hexadecimais novos fora de `tokens.css`.
3. Paleta escura quente, derivada de `ink`:
   - tela `ink.950`, leitura `ink.925`, superfície recolhida `ink.900`, inversa `ink.1000`;
   - texto `paper.100`, secundário `ink.300`;
   - texto de assinatura `red.300`.
4. **O vermelho de assinatura (`red.500`) não muda.** Continua a ser assinatura e abertura (ADR-DS-005), com texto branco.
5. Exceções que não invertem:
   - texto sobre destaques amarelos (fica sempre `ink.950`);
   - logótipos de parceiros, sempre sobre painel `paper.0` (Faixa de Logos canónica);
   - fotografias e modo imersivo;
   - pré-visualizações físicas e de impressão.
6. Contraste mínimo **AA** em todas as combinações de texto. Valores de referência, sobre as superfícies escuras:

   | Texto | Contraste |
   |---|---|
   | primário | ≥ 9,5:1 |
   | secundário | ≥ 4,7:1 |
   | assinatura | ≥ 4,5:1 nas superfícies de leitura |

## Consequências
- A ADR-DS-007 continua válida para o tema claro, impressão e peças físicas. No tema escuro, a leitura prolongada assenta em `ink.925` com texto `paper.100` (≥ 14:1).
- Primitivos novos em `tokens.css` e em `packages/design-tokens/v0.2/tokens.css`:
  - `paper.150`, `red.50`, `ochre.50`, `patina.100`;
  - `ink.1000`, `ink.925`, `ink.850`, `ink.800`;
  - `red.300`, `red.950`, `ochre.950`, `patina.950`, `info.300`.
- Semânticos novos:
  - superfícies: `surface.sunken`, `surface.subtle`, `surface.tint-{warning,danger,signature,success}`;
  - texto: `text.signature`.
- Cerca de 530 cores literais em `src/styles/app.css` e `components.css` passaram a tokens semânticos.
- O orçamento de CSS sobe de 180 000 para 195 000 bytes (nomes de variáveis mais longos; impacto comprimido desprezável).
- Flutter, impressão e o guia vivo (`apps/design-guide/`) **ainda não** têm tema escuro. Registado como pendência.
