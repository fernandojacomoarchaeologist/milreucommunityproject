---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "07D.3"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Pacote 07D.3 — MM202617 visível para revisão

**Versão:** 0.11.3  
**Base:** Pacote 07D.2.

Este hotfix aplica a decisão do responsável do projeto de tornar MM202617 visível para revisão, desde que o retoque por inteligência artificial seja indicado de forma clara.

## Estado de MM202617

```text
siteVisible: true
siteStatus: review-visible
editorialStatus: in-review
robots: noindex
publicReleaseEligible: false
```

O registo pode ser consultado no Museu local, na pesquisa, nas coleções, no detalhe e no modo imersivo.

Ele permanece excluído de:

- lançamento público definitivo;
- dataset JSON-LD de lançamento;
- páginas estáticas públicas;
- QR finais;
- totem;
- painel.

## Divulgação do retoque

A interface apresenta aviso:

- no card;
- na página de detalhe;
- no painel do modo imersivo;
- no crédito;
- na documentação da intervenção digital.

O texto informa que a imagem é derivada, recebeu retoque substantivo por IA e pode conter reconstruções ou alterações que não estavam presentes no original.

## Executar

```bash
npm install
npm run channels:export
npm run museum:index
npm run museum:audit
npm run validate
npm test
npm run build
npm run dev
```

## Contagens

- 31 registos visíveis no ambiente de revisão;
- 30 registos elegíveis para lançamento público;
- 31 registos no índice de revisão;
- 30 registos no dataset e nas páginas estáticas de lançamento;
- 30 destinos QR pendentes.

## Próximos passos

Consultar `docs/roadmap/NEXT_STEPS_AFTER_07D3.md`.

O próximo pacote recomendado é o **08A — Interface de Revisão Editorial e Curatorial das 31 Memórias**.
