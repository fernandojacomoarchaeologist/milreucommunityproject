---
title: "Dicionário de dados do Museu"
version: "0.1.0"
status: "ready-for-integration"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
initiative: "Museu de Memórias de Milreu"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Dicionário de dados

## Identificação e estado

| Campo | Finalidade |
|---|---|
| `id` | Identificador persistente da memória, como `MM202601`. |
| `schemaVersion` | Versão do schema usada pelo registo. |
| `recordStatus` | Estado editorial interno do registo. |
| `publicationStatus` | Estado de publicação pública. |
| `dataState` | Condição epistemológica/editorial do conteúdo. |
| `initiativeId` | Iniciativa responsável, atualmente `museum-of-memories`. |

## Conteúdo

| Campo | Finalidade |
|---|---|
| `title` | Título em quatro idiomas. |
| `narratives.shortDescription` | Resumo para listas e cartões. |
| `narratives.objectiveDescription` | Descrição observável e documental. |
| `narratives.communityNarrative` | Relação, memória ou interpretação comunitária. |
| `narratives.historicalContext` | Contexto histórico sustentado por fontes. |
| `narratives.institutionalContext` | Moldura institucional, quando necessária. |

## Documentação

| Campo | Finalidade |
|---|---|
| `date` | Intervalo, apresentação, precisão e certeza. |
| `places` | Lugares relacionados e precisão pública. |
| `people` | Pessoas ou grupos, com controlo de identificação pública. |
| `classification` | Tipo principal, tipos secundários e tags. |
| `sources` | Fontes documentais e respetivo papel. |
| `provenance` | Histórico de aquisição, digitalização, validação e publicação. |
| `media` | Originais, derivados, miniaturas e intervenções digitais. |
| `relations` | Ligações tipadas a outras entidades. |

## Direitos e revisão

| Campo | Finalidade |
|---|---|
| `rightsAndConsent` | Estado de direitos, consentimento, base de publicação e contestação. |
| `communityVoices` | Contributos aprovados ou em revisão associados à memória. |
| `audit` | Criação, alteração, origem do sistema e revisão. |
| `extensions` | Dados ainda não normalizados, com uso controlado. |
