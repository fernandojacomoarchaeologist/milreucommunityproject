---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md"
---

# Prompt de integração — Pacote 05D

Estás a integrar o **Pacote 05D — Componentes e Padrões Museológicos v0.4.0** no repositório do Projeto Comunitário de Milreu.

## Antes de alterar qualquer ficheiro

1. Lê `CLAUDE.md`, `README.md`, `PACKAGE_MANIFEST.md`, `INTEGRATION_CHECKLIST.md` e os releases 05A–05C.
2. Confirma a existência de `packages/design-tokens/v0.2/tokens.css` e da versão 0.3.0 de `apps/design-guide/`.
3. Verifica alterações locais. Se houver conflito relevante no guia, interrompe e pergunta.
4. Confirma que os Pacotes 03 e 04 estão integrados ou documenta a ausência; não inventes campos ou estados.

## Objetivo

Atualizar o catálogo para 0.4.0, integrar a biblioteca de componentes e padrões e concluir o ciclo 05 sem construir ainda o Portal ou o Museu públicos.

## Regras obrigatórias

- Não usar imagens, textos, nomes ou dados reais do acervo nos exemplos.
- Não publicar páginas ou imagens do livro *Milreu: Ruínas*.
- Não copiar componentes, textos ou código da referência externa Conta BOLD.
- Consumir os tokens do Pacote 05B; não criar uma segunda fonte de verdade.
- Preservar apenas os níveis de certeza `confirmed`, `probable` e `hypothesis`.
- A narrativa comunitária antecede o contexto institucional.
- Não ocultar direitos, proveniência, certeza ou estado editorial quando forem necessários.
- Não marcar nenhum componente ou padrão como `approved` sem decisão explícita de Fernando Rodrigues de Jácomo.
- Não criar backend, base de dados, Portal, Museu público, app Flutter ou ficheiros finais de impressão.
- Perguntar quando faltar uma decisão que altere comportamento, direitos, publicação ou arquitetura.

## Sequência

1. Integrar `packages/design-components/v0.4/` e `packages/design-patterns/v0.4/`.
2. Atualizar `apps/design-guide/` preservando o shell 05C.
3. Integrar `packages/design-guide-catalog/v0.4/`.
4. Integrar docs, specs, rules, skills e anexos.
5. Executar testes e validadores.
6. Servir por HTTP e verificar manualmente: inventários, componentes, padrões, pesquisa, navegação mobile, idiomas, teclado, foco e exemplos.
7. Produzir relatório com ficheiros criados/substituídos, conflitos, testes, pendências e decisão de publicação.

## Conclusão

A integração termina quando o guia 0.4.0 funciona localmente, os testes passam e o estado permanece `internal-preview`. O próximo trabalho deve partir para as specs e arquitetura do Portal e do Museu, consumindo este sistema.
