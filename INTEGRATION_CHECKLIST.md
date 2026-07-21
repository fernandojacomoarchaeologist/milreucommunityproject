---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md"
---

# Checklist de integração — Pacote 05C

## Antes

- [ ] Confirmar Pacotes 01, 02, 05A e 05B integrados.
- [ ] Confirmar existência de `packages/design-tokens/v0.2/tokens.css`.
- [ ] Criar branch de integração.
- [ ] Verificar alterações locais em `apps/design-guide/`.
- [ ] Preservar a implementação 0.1.0 no histórico Git; não criar cópia paralela permanente.

## Durante

- [ ] Copiar os ficheiros respeitando os caminhos do pacote.
- [ ] Aplicar `integration/CLAUDE_APPEND.md` sem duplicação.
- [ ] Aplicar `integration/VISUALIZATION_REGISTRY_APPEND.md`.
- [ ] Rever o relatório `integration/PACKAGE_02_DESIGN_GUIDE_UPGRADE.md`.
- [ ] Não copiar tokens 05B para dentro da app.
- [ ] Não publicar o guia antes de validação manual.

## Validar

- [ ] Executar `node scripts/validate-package-05c.mjs`.
- [ ] Executar os testes na pasta `tests/`.
- [ ] Servir o repositório por HTTP.
- [ ] Testar pesquisa e todas as rotas.
- [ ] Testar teclado, foco, menu mobile e redução de movimento.
- [ ] Testar os quatro idiomas da interface.
- [ ] Confirmar que links externos não foram adicionados indevidamente.

## Depois

- [ ] Registar a integração no changelog geral.
- [ ] Manter o release do pacote no repositório.
- [ ] Criar issues para itens `proposed` ou `draft` que dependam do 05D.
- [ ] Não marcar o Design System como 1.0.
