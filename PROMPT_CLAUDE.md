---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "07D.3"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Prompt de integração — Pacote 07D.3

Integra este hotfix sobre o 07D.2.

## Decisão humana

MM202617 deve ficar visível para revisão, com menção clara ao retoque substantivo por inteligência artificial.

## Estado obrigatório

- `siteVisible: true`;
- `siteStatus: review-visible`;
- `editorialStatus: in-review`;
- `robots: noindex`;
- `publicReleaseEligible: false`;
- Portal e Museu ativados;
- totem e painel desativados.

## Divulgação obrigatória

Confirmar aviso no:

1. card;
2. detalhe;
3. modo imersivo;
4. crédito;
5. bloco de intervenção digital.

A interface deve afirmar que:

- a imagem é derivada;
- houve retoque substantivo por IA;
- podem existir detalhes reconstruídos ou alterados;
- não corresponde ao documento fotográfico original;
- ainda não está aprovada para lançamento público.

## Separação de estados

O índice local de revisão possui 31 registos.

O dataset público, as páginas estáticas de lançamento e os QR continuam com 30 e excluem MM202617.

## Integração

```bash
npm install
npm run channels:export
npm run museum:index
npm run museum:audit
npm run validate
npm test
npm run build
npm run smoke
```

## Revisão manual

Abrir MM202617 em:

- galeria;
- lista;
- pesquisa;
- filtro de intervenção digital;
- coleção de intervenções;
- detalhe;
- modo imersivo;
- navegação anterior e seguinte.

Não promover `publicReleaseEligible` sem nova decisão humana.
