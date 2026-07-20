---
title: "Espaçamento, grelha e layout"
version: "0.1.0"
status: "provisional"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md na raiz do repositório"
---
# Espaçamento, grelha e layout

## Natureza dos tokens

Os valores desta versão são defaults técnicos provisórios. Não são apresentados como elementos retirados do livro de Hauschild e Teichner.

## Escala de espaçamento

Base de 4 px:

`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96`

Utilizar os tokens `--ds-space-1` a `--ds-space-9`.

## Contentores

- texto longo: máximo aproximado de 72 caracteres por linha;
- portal: contentor central amplo, com navegação previsível;
- museu: contentor fluido e imagem dominante;
- metadados: colunas ou painéis secundários, sem competir com a narrativa;
- guia: navegação lateral em ecrãs largos e fluxo linear em ecrãs pequenos.

## Grelha

- Portal: grelha de 12 colunas como referência de desktop;
- Museu: grelha assimétrica e responsiva, permitindo imagem dominante;
- dispositivos pequenos: uma coluna principal, com detalhes progressivos;
- impressão: grelha própria definida por template e dimensão física.

## Breakpoints de engenharia

Referências iniciais:

- pequeno: 480 px;
- médio: 768 px;
- largo: 1024 px;
- extra largo: 1440 px.

Os breakpoints podem ser ajustados após testes. Evitar criar layouts dependentes de um dispositivo específico.

## Ritmo

- narrativa comunitária recebe maior espaço de respiração;
- metadados são compactos, mas não ilegíveis;
- separação deve usar espaço antes de acrescentar caixas e bordas;
- ecrã imersivo deve reduzir elementos persistentes;
- o portal não deve adotar o ritmo cinematográfico do museu em todas as páginas.
