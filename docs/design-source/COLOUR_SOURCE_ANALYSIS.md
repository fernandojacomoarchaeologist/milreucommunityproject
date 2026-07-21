---
title: "Análise cromática da fonte"
version: "0.1.0"
status: "active"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md na raiz do repositório e SOURCE_RIGHTS_NOTICE.md neste pacote"
---
# Análise cromática da fonte

## Decisão do projeto

- Vermelho: assinatura, abertura, transição e fecho.
- Preto: áreas de destaque e preenchimento de contraste.
- Superfícies claras: leitura principal.

## Observações

O PDF é uma digitalização sem perfil cromático confiável. Os valores em `colour-observations.json` são amostras visuais aproximadas e não tokens finais.

## Famílias cromáticas observadas

- vermelhos editoriais, entre tijolo e vermelho vivo;
- branco e papel ligeiramente quente;
- preto e castanho muito escuro;
- pedra, terra, cerâmica e argamassa;
- azuis de céu nas fotografias;
- verdes, amarelos e azuis funcionais nas plantas;
- creme, castanho e preto nos mosaicos.

## Regras para o Pacote 05B

1. Testar mais de um vermelho de produção.
2. Verificar contraste com branco e preto.
3. Não usar cor extraída de uma única página.
4. Separar cor de marca, cor de conteúdo e cor de dados.
5. Não usar preto pleno em grandes áreas sem avaliar fadiga e hierarquia.
6. Produzir equivalentes para ecrã, impressão e Flutter.
