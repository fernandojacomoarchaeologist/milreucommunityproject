---
title: "Design Tokens v0.2"
version: "0.2.0"
status: "active"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md na raiz do repositório"
---
# Design Tokens v0.2

## Fonte de verdade

`tokens.json` agrega as fundações. Os ficheiros menores facilitam revisão por domínio.

## Utilização

- componentes consomem tokens semânticos;
- valores primitivos não devem ser escolhidos diretamente sem justificação;
- exportações de plataforma devem ser regeneradas quando os tokens mudarem;
- fontes são referenciadas por nome, sem ficheiros binários;
- CMYK definitivo não faz parte desta versão.

## Compatibilidade

Esta pasta não apaga automaticamente os tokens v0.1 do Pacote 02. Consultar `integration/PACKAGE_02_TOKEN_UPGRADE.md`.
