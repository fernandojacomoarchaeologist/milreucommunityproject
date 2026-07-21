---
title: "Requisitos de contraste"
version: "0.2.0"
status: "active"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md na raiz do repositório"
---
# Requisitos de contraste

## Mínimos

- texto normal: 4,5:1;
- texto grande: 3:1;
- elementos gráficos e controlos: 3:1;
- foco: claramente visível e não dependente apenas de cor.

## Combinações principais verificadas

| Fundo | Texto | Resultado aproximado |
|---|---|---:|
| `paper.50` | `ink.950` | superior a 16:1 |
| `red.500` | branco | superior a 6,6:1 |
| `red.700` | branco | superior a 9,6:1 |
| `ink.950` | branco | superior a 17:1 |
| `paper.50` | `patina.500` | superior a 5:1 |
| `paper.50` | `sepia.500` | superior a 4,8:1 |

Os testes automatizados são fonte de verdade para valores exatos.
