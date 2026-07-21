---
title: "Pacote 05B — Fundações Visuais de Produção"
version: "0.2.0"
status: "ready-for-integration"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md na raiz do repositório"
---
# Pacote 05B — Fundações Visuais de Produção

Este pacote converte a auditoria visual do livro *Milreu: Ruínas* realizada no Pacote 05A em fundações digitais e físicas implementáveis para o Design System do Projeto Comunitário de Milreu.

## Decisões autoritativas

- o vermelho é assinatura, abertura, transição e fecho;
- o preto aquecido pode preencher destaques e áreas de forte contraste;
- superfícies claras são o padrão para leitura extensa;
- a cor funcional de mapas e dados permanece separada da identidade;
- o sistema não copia páginas do livro e não reproduz defeitos da digitalização;
- as fontes originais do livro não são identificadas por aproximação;
- não são distribuídos ficheiros de fontes;
- a família de destaque é **Fraunces**;
- o corpo editorial é **Spectral**;
- navegação, controlos e metadados usam **Archivo**;
- todas as funções têm fallbacks seguros;
- o corpo de leitura digital parte de 18 px, entrelinha 1,65 e largura recomendada de 68 caracteres.

## Entregas

- tokens de produção em JSON e CSS;
- projeções para JavaScript, Flutter e impressão;
- sistema cromático com matriz de contraste;
- tipografia, escala, densidade e medidas de leitura;
- espaçamento, grelha, breakpoints, formas, bordas e elevação;
- regras de movimento e redução de movimento;
- direções para iconografia, fotografia, texturas, mapas e dados;
- laboratório visual interno para inspeção das fundações;
- ADRs, specs, rules, skills, scripts, testes e release.

## Dependências

1. Pacote 01 — Fundação, Governação e Escopo;
2. Pacote 02 — Sistema de Design e Guia Vivo;
3. Pacote 05A — Auditoria Visual e Fonte Primária.

## Limites

Este pacote não cria o catálogo visual completo, não cria o logótipo, não publica imagens do livro, não reconstrói o Portal ou o Museu e não declara componentes museológicos como finais. Essas entregas pertencem aos Pacotes 05C e 05D.

## Instalação

1. Descompactar na raiz do repositório.
2. Ler `PROMPT_CLAUDE.md`.
3. Integrar manualmente as adendas em `integration/`.
4. Executar os validadores indicados no checklist.
5. Servir a raiz do repositório por HTTP e abrir `apps/foundations-lab/`.
6. Não remover os tokens v0.1 do Pacote 02 antes de concluir a comparação.
