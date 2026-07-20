---
title: "Auditoria inicial de tokens do protótipo"
version: "0.1.0"
status: "active"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md na raiz do repositório"
---
# Auditoria inicial de tokens do protótipo

## Origem

Contagem textual realizada no `style.css` da versão preliminar anexada. Os números incluem a própria declaração do token e servem apenas para estimar impacto.

| Token | Ocorrências aproximadas |
|---|---:|
| `--color-charcoal` | 103 |
| `--color-terracotta` | 94 |
| `--color-sand` | 81 |
| `--color-charcoal-light` | 56 |
| `--color-parchment` | 49 |
| `--color-white` | 41 |
| `--color-sand-light` | 41 |
| `--font-display` | 28 |
| `--color-olive` | 23 |
| `--font-body` | 20 |
| `--color-charcoal-mid` | 14 |
| `--color-parchment-dark` | 13 |
| `--color-terracotta-light` | 12 |
| `--color-olive-dark` | 10 |
| `--color-terracotta-dark` | 8 |
| `--color-parchment-mid` | 5 |
| `--color-olive-light` | 3 |
| `--font-accent` | 1 |

## Conclusão

A migração não deve começar por renomeação global. `terracotta`, `sand` e `charcoal` estão fortemente acoplados à interface. O primeiro passo seguro é a camada de aliases, seguida por migração componente a componente.

## Revisões prioritárias

1. fundos atualmente terracotta;
2. botões e estados ativos;
3. cabeçalho e hero;
4. overlays do modo imersivo;
5. rodapé e créditos;
6. contraste de corpo após mudança de fonte;
7. classes que assumem branco puro.
