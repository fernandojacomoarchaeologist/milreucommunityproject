---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "LAB-JOGOS-01"
rights: "Consultar RIGHTS.md no repositório principal"
---

# SPEC-PAGE-022-LAB-DETETIVES

## Estado

Laboratório — protótipo experimental, só em ambiente de teste (HML). Não publicado.

## Produto

laboratorio

## Rota

`/laboratorio/jogos/detetives-da-memoria`

## Objetivo

Jogo «Detetives da Memória»: investigação visual com pistas, ajudas, pontuação, conclusão e Caderno de Campo.

## Componentes autorizados

- ProjectHeader
- LabGamesMenu
- InvestigationStage
- DiscoveryCard
- FieldNotebook

## Fontes de dados

- labMissionCatalog
- labAuthorisations
- localProgress

## Idiomas

pt-PT. Noutros idiomas mostra o aviso de que o jogo só existe em português nesta versão.

## Acessibilidade

Rato, toque e teclado; foco visível; alternativa textual («Explorar por descrição»); sem tempo limite; `prefers-reduced-motion`; som desligado por omissão.

## Fora do âmbito

Login, base de dados, Supabase, rankings, certificados, contributos, fotografias do acervo sem decisão de uso interactivo, publicação em produção.

## Critérios

- só existe com `public/config/lab.runtime.json` activo e fora do domínio de produção;
- o build de produção remove `src/lab`, `public/data/lab` e `public/media/lab`;
- conteúdo demonstrativo identificado como tal;
- especificação: `docs/website/SPEC_DETETIVES_DA_MEMORIA.md`.
