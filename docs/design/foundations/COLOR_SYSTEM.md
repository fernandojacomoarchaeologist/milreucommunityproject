---
title: "Sistema cromático de produção"
version: "0.2.0"
status: "active"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md na raiz do repositório"
---
# Sistema cromático de produção

## Princípios

- vermelho não é superfície padrão de leitura;
- preto usado em destaque é aquecido, evitando a dureza do preto absoluto;
- branco e papel quente coexistem: branco para conteúdo documental, papel para enquadramento;
- pátina, sépia e pedra conservam funções de certeza e memória;
- mapas e visualizações usam paleta funcional separada.

## Cores principais

| Papel | Token | Valor |
|---|---|---:|
| branco documental | `paper.0` | `#FFFFFF` |
| papel de leitura | `paper.50` | `#FFFCF7` |
| linho suave | `paper.100` | `#F7F1E7` |
| separação quente | `paper.200` | `#E9DECF` |

| Assinatura | Token | Valor |
|---|---|---:|
| vermelho profundo | `red.700` | `#7E251C` |
| vermelho principal | `red.500` | `#A83227` |
| vermelho vivo | `red.400` | `#C44738` |
| vermelho suave | `red.100` | `#F6DEDA` |

| Tinta | Token | Valor |
|---|---|---:|
| tinta máxima | `ink.950` | `#1E1A17` |
| tinta principal | `ink.900` | `#2A2521` |
| tinta secundária | `ink.700` | `#453D36` |
| tinta moderada | `ink.600` | `#5E554D` |

Os valores completos encontram-se nos tokens. Alterações exigem teste de contraste e ADR quando mudarem a identidade.
