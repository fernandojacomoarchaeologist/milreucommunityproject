---
title: "Release — Pacote 05B v0.2.0"
version: "0.2.0"
status: "released"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md na raiz do repositório"
---
# Release — Pacote 05B v0.2.0

## Adicionado

- sistema cromático de produção;
- vermelho como assinatura e preto aquecido como destaque;
- superfícies claras de leitura;
- papéis tipográficos Fraunces, Spectral e Archivo;
- escala tipográfica, medidas e regras de densidade;
- espaçamento, grelha, breakpoints e contentores;
- formas, bordas, elevação e movimento;
- direções para iconografia, fotografia e textura;
- paleta funcional de dados e mapas;
- linha de base de acessibilidade;
- tokens v0.2 em JSON e CSS;
- exportações JavaScript, Flutter e impressão;
- laboratório interno de fundações;
- ADRs, specs, rules, skills e testes.

## Alterado em relação ao Pacote 02

- `brick` é reinterpretado como família de vermelho de assinatura;
- `paper` é dividido em branco documental, canvas e linho;
- `ink` passa a preto aquecido de produção;
- tipografia deixa de ser apenas hipótese e recebe papéis formais;
- fundações passam a cobrir todas as plataformas previstas;
- cores de mapa e dados são separadas da marca.

## Não incluído

- catálogo visual completo;
- componentes finais;
- logótipo;
- ficheiros de fontes;
- CMYK final;
- tema escuro;
- alterações no Portal, Museu ou registos.

## Validação esperada

```bash
node scripts/validate-package-05b.mjs
node tests/token-schema.test.mjs
node tests/contrast.test.mjs
node tests/platform-parity.test.mjs
```

## Próximo release

Pacote 05C — Catálogo Visual Interativo.
