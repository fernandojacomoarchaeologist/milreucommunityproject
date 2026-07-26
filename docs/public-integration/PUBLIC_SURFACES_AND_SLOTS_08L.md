---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08L"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Superfícies públicas e slots

## Superfícies

### Portal público

- página `/participar`;
- home;
- páginas de iniciativas;
- agenda e oportunidades já existentes.

### Museu

- home do Museu;
- coleções;
- detalhe de memória, apenas quando a origem é elegível.

## Slots preservados

### `portal.home.after-featured`

Pode receber, após aprovação:

- chamada para participação;
- percurso público;
- evento ou oportunidade;
- resultado agregado aprovado;
- destaque editorial.

### `museum.home.after-opening`

Pode receber, após aprovação:

- convite para contribuir;
- percurso relacionado com memórias;
- coleção aprovada;
- destaque de revisão comunitária;
- ação pública vinculada ao Museu.

## Limites

A implementação deve ler os limites já definidos no registo de slots. Não aumentar quantidades por inferência.

## Fallback

Com zero efeitos ativos:

- home permanece igual ao 08J/08K;
- Museu permanece igual;
- `/participar` pode apresentar conteúdo institucional estático aprovado e links para fluxos já existentes;
- nenhuma área vazia ou mensagem técnica deve aparecer ao público.

## Contrato de efeito

Cada efeito deve conter:

- `effectId`;
- `snapshotId`;
- `surface`;
- `slot`;
- `type`;
- `language`;
- `title`;
- `summary`;
- `cta`;
- `media`, se elegível;
- `credits`;
- `rights`;
- `validFrom`;
- `validUntil`;
- `sourceReferences`;
- `schemaVersion`;
- `checksum`.

Campos pessoais são proibidos.
