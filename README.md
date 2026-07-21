---
title: "Pacote 05A — Auditoria Visual e Fonte Primária"
version: "0.1.0"
status: "ready-for-integration"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md na raiz do repositório e SOURCE_RIGHTS_NOTICE.md neste pacote"
---
# Pacote 05A — Auditoria Visual e Fonte Primária

Este pacote transforma o livro *Milreu: Ruínas*, de Theodor Hauschild e Felix Teichner, numa fonte primária contextual e visual controlada para o Projeto Comunitário de Milreu.

## Decisões confirmadas

- O vermelho funciona como **assinatura, abertura, transição e fecho**.
- O vermelho não é a superfície padrão para leitura extensa.
- O preto pode preencher áreas de destaque, contraste, legenda ou chamada, de forma controlada.
- As superfícies principais de leitura permanecem claras.
- As cores observadas na digitalização não são ainda tokens finais de produção.
- O livro é a principal referência visual do sistema e a base contextual inicial para falar do sítio de Milreu no portal.
- O livro não substitui memórias comunitárias, dados dos inquéritos, fontes orais ou investigação posterior.

## Objetivos

1. Registar a fonte e a sua hierarquia.
2. Mapear visualmente as 36 páginas do PDF.
3. Identificar padrões de cor, tipografia, fotografia, cartografia, objetos e composição.
4. Separar elementos a preservar, adaptar, consultar ou rejeitar.
5. Documentar problemas de leitura que não devem migrar para o digital.
6. Criar um quadro visual interno e navegável.
7. Preparar o Pacote 05B sem fechar prematuramente fontes ou cores.

## Conteúdo principal

- PDF de referência, mantido em área privada do pacote;
- 36 miniaturas derivadas para análise interna;
- auditoria visual e contextual;
- mapa página a página;
- estrutura temática do livro;
- inventário de componentes candidatos;
- observações de cor sem conversão automática em tokens;
- regras de adaptação digital e acessibilidade;
- quadro visual em `apps/visual-source-board/`;
- rules, skills, spec, testes, prompt e release.

## Dependências

- Pacote 01 integrado;
- Pacote 02 integrado;
- `RIGHTS.md` disponível na raiz do repositório.

## Instalação

1. Descompactar na raiz do repositório.
2. Utilizar `PROMPT_CLAUDE.md` para a integração.
3. Manter `sources/primary/private/` fora de qualquer build público.
4. Executar `node scripts/validate-package-05a.mjs`.
5. Servir o repositório localmente para abrir `apps/visual-source-board/`.

## Limites

Este pacote não:

- define a tipografia final;
- publica o PDF ou as imagens do livro;
- declara equivalência cromática entre o scan e a impressão original;
- cria o catálogo público do Design System;
- aplica a identidade ao Portal ou ao Museu;
- altera os 31 registos migrados;
- cria logótipo ou marca definitiva.
