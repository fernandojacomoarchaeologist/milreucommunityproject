---
title: "Pacote 01 — Fundação, Governação e Escopo"
version: "0.1.0"
status: "ready-for-integration"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md"
---

# Pacote 01 — Fundação, Governação e Escopo

Este pacote estabelece a base documental e operacional do repositório do **Projeto Comunitário de Milreu**. Não altera a versão preliminar do Museu de Memórias, não migra dados e não implementa interfaces.

## Objetivo

Criar uma fonte de verdade inicial para que o Claude e futuros colaboradores compreendam:

- o que é o Projeto Comunitário de Milreu;
- o que está fora do seu âmbito;
- como o Museu de Memórias se insere no programa mais amplo;
- quais iniciativas já existem ou estão previstas;
- como devem ser tratados conteúdos, direitos, consentimento, idiomas e publicação;
- como novas funcionalidades e visualizações deverão ser especificadas.

## Conteúdo do pacote

- instruções permanentes para o Claude;
- regras contextuais em `.claude/rules/`;
- skills iniciais em `.claude/skills/`;
- definição do projeto e dos produtos digitais;
- registo inicial das iniciativas;
- definição de escopo do Museu de Memórias;
- políticas preliminares de publicação, direitos, consentimento e idiomas;
- template de especificação funcional;
- registo controlado de visualizações;
- manifesto de instalação;
- prompt de integração;
- release `0.1.0`.

## Instalação

1. Descompactar o pacote na raiz do repositório de destino.
2. Preservar integralmente a estrutura das pastas.
3. Abrir `PROMPT_CLAUDE.md` e utilizar o conteúdo como primeiro prompt na sessão de integração.
4. Não substituir automaticamente ficheiros existentes com o mesmo nome.
5. Solicitar ao Claude uma comparação antes de qualquer substituição ou fusão.
6. Registar o release em `releases/PACKAGE_01_v0.1.0.md`.

## Restrições deste release

Este pacote não:

- redefine ainda o design system;
- altera o site preliminar;
- cria schemas de dados;
- configura base de dados;
- implementa o mapa de narrativas;
- cria o portal ou a aplicação Flutter;
- publica fotografias, depoimentos ou resultados de inquéritos.

Esses trabalhos pertencem aos pacotes seguintes.

## Estado de decisões

As decisões necessárias para este pacote estão suficientemente definidas. Pontos ainda não determinados, como URL pública, canal final para pedidos de direitos e infraestrutura de persistência, estão identificados como pendências não bloqueantes e deverão ser questionados antes da respetiva implementação.
