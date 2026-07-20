---
title: "Governação do sistema de design"
version: "0.1.0"
status: "active"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md na raiz do repositório"
---
# Governação do sistema de design

## Fonte de verdade

1. `packages/design-tokens/tokens.json` para valores estruturados;
2. `packages/design-tokens/tokens.css` para implementação Web;
3. documentação em `docs/design/` para intenção e regras;
4. `docs/design/COMPONENT_REGISTRY.md` para estado dos componentes;
5. `apps/design-guide/` para referência visual viva.

## Estados

- `proposal` — ideia ainda não aprovada;
- `draft` — documentação ou componente em construção;
- `beta` — utilizável em testes, sujeito a alteração;
- `stable` — aprovado para produção;
- `deprecated` — mantido apenas por compatibilidade;
- `removed` — não deve ser utilizado.

## Alteração de token

Uma alteração deve indicar:

- token atual;
- valor proposto;
- motivo;
- produtos afetados;
- impacto de acessibilidade;
- impacto em impressão;
- impacto no protótipo;
- estratégia de migração;
- release.

## Alteração de componente

Executar a skill `design-system-change`. Não alterar contratos silenciosamente.

## Novos componentes

Executar a skill `component-intake`. Reutilizar antes de criar. Um componente novo precisa de:

- problema recorrente;
- contexto de utilização;
- estados;
- conteúdo;
- comportamento;
- acessibilidade;
- exemplos;
- estado no registo.

## Compatibilidade

Nomes antigos podem ser mantidos temporariamente como aliases. Aliases não devem impedir a migração para tokens semânticos.

## Releases

O design system usa versionamento semântico:

- patch: correção sem alteração de contrato;
- minor: novo componente ou token compatível;
- major: alteração incompatível ou revisão estrutural.
