---
title: "Migração de pele — utilização"
version: "0.1.0"
status: "ready"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md na raiz do repositório"
---
# Migração de pele

Esta pasta cria uma camada de compatibilidade para o protótipo preliminar. Ela não deve ser ativada automaticamente.

## Estratégia

- preservar nomes antigos enquanto o código é migrado;
- mapear tokens antigos para os novos valores sem mapear `terracotta` para `brick`;
- carregar `tokens-migration.css` depois do `style.css` antigo;
- avaliar visualmente cada área extensa;
- migrar componentes gradualmente para tokens semânticos;
- remover aliases apenas num release incompatível futuro.

## Risco principal

O token antigo `--color-terracotta` aparece muitas vezes em fundos e estados. Mapá-lo diretamente para tijolo violaria a regra institucional. Nesta versão ele é redirecionado para sépia.

## Ativação

Só ativar após:

1. comparação visual;
2. cópia de segurança ou branch;
3. confirmação do responsável;
4. teste de contraste;
5. revisão das áreas que usam terracotta como fundo.
