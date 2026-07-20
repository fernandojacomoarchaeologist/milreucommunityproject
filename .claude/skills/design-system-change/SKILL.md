---
title: "Skill — alteração do sistema de design"
version: "0.1.0"
status: "active"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md na raiz do repositório"
---
# Skill: design-system-change

## Quando utilizar

Antes de alterar token, componente, padrão, shell ou regra visual já registada.

## Procedimento

1. Identificar o pedido e o produto afetado.
2. Ler os documentos relevantes em `docs/design/`.
3. Consultar `COMPONENT_REGISTRY.md` e as specs.
4. Verificar se a alteração exige uma decisão pendente.
5. Comparar estado atual e proposto.
6. Avaliar acessibilidade, quatro idiomas, Portal, Museu, impressão e Flutter.
7. Confirmar que o tijolo não se torna superfície dominante.
8. Atualizar fonte estruturada, implementações e guia.
9. Atualizar estado e release.
10. Executar `node scripts/validate-design-system.mjs`.

## Deve questionar quando

- falta o asset oficial;
- a alteração envolve conteúdo real;
- o pedido contradiz uma decisão autoritativa;
- a mudança cria nova visualização;
- a alteração é incompatível e não existe estratégia de migração.

## Saída

- resumo da alteração;
- ficheiros afetados;
- impacto;
- validações;
- pendências;
- release recomendado.
