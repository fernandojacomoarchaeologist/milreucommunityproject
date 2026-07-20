---
title: "Sistema de cor"
version: "0.1.0"
status: "active"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md na raiz do repositório"
---
# Sistema de cor

## Paleta autoritativa

| Token conceptual | Valor | Função principal |
|---|---:|---|
| Paper | `#F2ECE0` | superfície comunitária principal |
| Paper Deep | `#E7DFCF` | superfície secundária e separação |
| Ink | `#2A2622` | texto e contraste principal |
| Ink Soft | `#5B534A` | texto secundário |
| Sepia | `#8A6A4A` | datas, memória e estado provável |
| Stone | `#A79B88` | filetes, limites e hipótese |
| Silver | `#6C6C6C` | metadados e utilitários |
| Patina | `#5E7267` | relação comunitária e estado certo |
| Brick | `#A83227` | moldura institucional controlada |
| Brick Deep | `#7E251C` | detalhe institucional de contraste |

## Tokens semânticos

Os componentes devem consumir tokens semânticos, não valores hexadecimais:

- `--ds-surface-primary`;
- `--ds-surface-secondary`;
- `--ds-text-primary`;
- `--ds-text-secondary`;
- `--ds-accent-community`;
- `--ds-accent-memory`;
- `--ds-border-muted`;
- `--ds-metadata`;
- `--ds-certainty-confirmed`;
- `--ds-certainty-probable`;
- `--ds-certainty-hypothesis`;
- `--ds-institutional-frame`.

## Estados de confiança

| Estado | Cor | Significado |
|---|---|---|
| Certa/confirmada | Pátina | sustentação documental, visual ou testemunhal suficiente |
| Provável | Sépia | leitura fundamentada, mas não completamente confirmada |
| Hipótese | Pedra | possibilidade interpretativa que requer cautela |

A cor nunca deve ser o único indicador. Utilizar texto, símbolo ou rótulo em conjunto.

## Restrições

- não criar novas cores de marca sem decisão registada;
- não usar tijolo como grande superfície;
- não usar sépia para simular envelhecimento artificial;
- não reduzir contraste de corpo para obter aparência “histórica”;
- não codificar estado apenas por cor;
- não inserir hexadecimais diretamente em componentes novos.
