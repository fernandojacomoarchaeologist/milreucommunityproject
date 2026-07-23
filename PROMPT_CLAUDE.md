---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md"
---

# Prompt de integração — Pacote 05E

Estás a integrar o **Pacote 05E — Identidade, Logótipo, Iconografia e Arquitetura de Marca v0.5.0** no repositório do Projeto Comunitário de Milreu.

## Antes de agir

1. Lê `CLAUDE.md`, `README.md`, `PACKAGE_MANIFEST.md`, `INTEGRATION_CHECKLIST.md` e os releases 05A–05D.
2. Confirma a existência de `apps/design-guide/` v0.4.0 e `packages/design-tokens/v0.2/`.
3. Verifica alterações locais. Se houver conflitos no Design Guide ou na marca, interrompe e pergunta.
4. Preserva o ficheiro original do logótipo sem o substituir.

## Objetivo

Integrar o sistema de marca, as variantes transparentes, o dark mode, a iconografia inicial e a arquitetura Projeto–Museu–Milreu Proteus no catálogo do Sistema de Design.

## Regras obrigatórias

- O nome público principal é `Projeto Comunitário de Milreu`.
- `Milreu Proteus` é a base estruturada de dados e conhecimento; não entra no logótipo principal.
- Não criar logótipo independente para Proteus ou para o Museu sem decisão expressa.
- Ignorar o fundo texturado e o pequeno brilho do ficheiro original.
- Usar apenas cores chapadas; não usar gradientes, brilhos, sombras decorativas ou texturas no logótipo.
- Tratar os PNGs derivados como `draft` até revisão visual de Fernando Rodrigues de Jácomo.
- Não afirmar que existe um SVG oficial. Não converter automaticamente o raster em vetor e tratá-lo como mestre.
- Não modificar proporções, composição, ordem dos elementos ou texto do logótipo.
- Não misturar o terracota do logótipo com o token vermelho de assinatura da interface.
- Ícones devem ser funcionais, consistentes e herdar `currentColor`; não criar arqueologia decorativa genérica.
- Perguntar antes de mudar cores, recortar elementos, alterar tipografia do logótipo ou promover maturidade.

## Sequência

1. Integrar `packages/brand-tokens/v0.5/` e `packages/brand-assets/v0.5/`.
2. Integrar `assets/brand/`, `assets/icons/` e `data/brand/`.
3. Atualizar o Design Guide com páginas: arquitetura de marca, logótipo, dark mode, iconografia e aplicações.
4. Manter as páginas em estado `internal-preview` e os ativos em `draft`.
5. Executar todos os validadores e testes.
6. Servir o guia por HTTP e rever: fundos claros, fundo `#1E1A17`, tamanhos mínimos, responsividade, contraste, favicon e ícones.
7. Produzir relatório de integração com ficheiros criados/substituídos, conflitos, testes, pendências e capturas.

## Condição de conclusão

A integração termina quando os ativos funcionam, os testes passam, o Design Guide apresenta as novas secções e nenhum derivado é promovido para `approved` sem validação humana.
