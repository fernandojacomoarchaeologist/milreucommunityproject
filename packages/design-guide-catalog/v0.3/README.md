---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md"
---

# Catálogo estruturado v0.3

`catalog.json` é a fonte estruturada canónica para grupos, páginas, rotas, tags, estados e conteúdos do guia 0.3. A aplicação inclui uma projeção JavaScript gerada deste ficheiro para funcionar sem build.

O Pacote 05D deve ampliar o catálogo por novos registos; não deve substituir a estrutura de grupos sem uma ADR.

## Handoff para o Pacote 05D

O 05D deve adicionar componentes ao catálogo sem alterar a arquitetura base. Novos renderers devem ser modulares, acessíveis e orientados pelos registos especializados.

As páginas atuais `components/overview` e `patterns/overview` funcionam como pontos de entrada e devem ser atualizadas no release 0.4.0.
