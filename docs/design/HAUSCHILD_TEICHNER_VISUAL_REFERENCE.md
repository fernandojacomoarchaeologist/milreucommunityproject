---
title: "Referência visual — Hauschild e Teichner"
version: "0.1.0"
status: "active"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md na raiz do repositório"
---
# Referência visual — Hauschild e Teichner

## Fonte

HAUSCHILD, Theodor; TEICHNER, Felix — *Milreu: ruínas*. Lisboa: Instituto Português do Património Arquitectónico, 2002. Roteiros da Arqueologia Portuguesa, 9.

## Função no projeto

O livro funciona como referência histórica e visual para a nova identidade do Museu de Memórias. A intenção não é copiar a publicação, mas reconhecer a sua associação consolidada com Milreu e reinterpretar:

- sobriedade editorial;
- relação entre fotografia, planta, legenda e texto;
- tonalidades de papel, pedra e impressão;
- hierarquia entre informação principal e documentação;
- presença controlada da instituição.

## Decisões já extraídas e consideradas autoritativas

- superfícies de linho e papel em vez da paleta parchment/terracotta do protótipo;
- títulos em Fraunces;
- corpo inicialmente em Spectral;
- metadados em Archivo;
- sépia, pedra, prata e pátina para acentos e estados;
- tijolo como moldura institucional e não como superfície;
- continuidade visual entre site e painéis.

## Limites desta versão

Este documento não afirma ainda:

- que uma página específica do livro originou um componente específico;
- que os grafismos do livro podem ser reproduzidos livremente;
- que a composição digital é um fac-símile;
- que o logótipo foi retirado do livro;
- que todos os padrões visuais foram auditados página a página.

## Material necessário para auditoria final

Quando o projeto exigir uma identidade final ou comparação detalhada, solicitar:

1. digitalizações ou fotografias das páginas de referência escolhidas;
2. indicação dos elementos considerados mais representativos;
3. confirmação dos direitos de reprodução nos documentos internos e no guia público;
4. versão aprovada do logótipo do projeto;
5. comparação entre o design system produzido no agente anterior e este pacote.

A ausência desses materiais não bloqueia a integração da fundação. Bloqueia apenas a declaração de fidelidade visual final.

## Atualização — Pacote 05A (auditoria da fonte primária)

Este pacote complementa e atualiza semanticamente a referência acima:

- a fonte visual deixou de ser apenas uma referência declarada e passou a ter auditoria página a página (ver `docs/design-source/`);
- o PDF foi registado com hash e número de páginas em `data/design-source/source-manifest.json` (mantido privado, ver `SOURCE_RIGHTS_NOTICE.md`);
- o livro passou a ser também fonte contextual inicial para o conteúdo arqueológico do sítio;
- o vermelho foi confirmado como assinatura e abertura;
- o preto foi confirmado como preenchimento de destaque controlado;
- foram identificados componentes candidatos e problemas de acessibilidade;
- a identificação tipográfica e os tokens finais continuam pendentes (Pacote 05B).
