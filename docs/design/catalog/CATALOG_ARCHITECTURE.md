---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md"
---

# Arquitetura do catálogo

O catálogo 0.3 é uma aplicação estática orientada por dados. O registo canónico reside em `packages/design-guide-catalog/v0.3/catalog.json`; a app utiliza uma projeção JavaScript para funcionar sem build.

## Camadas

1. **Conteúdo estruturado:** grupos, páginas, tags, estados e secções.
2. **Shell:** topbar, sidebar, conteúdo, índice local e pesquisa.
3. **Renderers:** exemplos visuais e estruturas documentais.
4. **Tokens:** consumidos exclusivamente do Pacote 05B.
5. **Governação:** specs, regras, skills e releases.

O Pacote 05D deve ampliar o registo e os renderers, mantendo a compatibilidade de rotas.
