---
title: "Release — Pacote 03 v0.1.0"
version: "0.1.0"
status: "ready-for-integration"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
initiative: "Museu de Memórias de Milreu"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Pacote 03 v0.1.0 — Modelo de Dados do Museu

## Data

20 de julho de 2026.

## Tipo

Primeiro release do modelo de domínio e validação estrutural do Museu de Memórias de Milreu.

## Adicionado

- modelo de domínio da memória;
- dicionário de dados;
- identificadores e referências;
- modelo de quatro idiomas;
- datas, lugares e níveis de certeza;
- separação das camadas narrativas;
- pessoas e vozes comunitárias;
- ativos de media e intervenções digitais;
- proveniência e fontes;
- direitos, consentimento, contestação e retirada;
- ciclo de vida editorial e de publicação;
- revisões e trilho de auditoria;
- relações tipadas;
- barreiras de publicação;
- correspondência dos campos do `museum-items.js`;
- limites para o futuro Pacote 04;
- cinco schemas JSON Schema 2020-12;
- registo de schemas;
- sete vocabulários controlados iniciais;
- quatro templates;
- exemplo preliminar baseado no registo real `MM202601`;
- quatro specs de dados;
- quatro rules contextuais;
- seis skills;
- script de validação sem dependências externas;
- testes básicos;
- prompt, checklist e manifesto de integração.

## Alterado

Nada no protótipo, nos 31 registos, nas imagens ou no Design System.

## Removido

Nada.

## Decisões consolidadas

- `pt-PT`, `en`, `es` e `fr` são obrigatórios na estrutura;
- traduções ausentes usam `null`;
- direitos, consentimento e publicação são dimensões separadas;
- certeza não admite `mixed`;
- localizações sensíveis não podem ser publicadas como exatas;
- intervenções digitais e uso de IA devem ser declarados;
- uma memória é mais do que um ficheiro de imagem;
- versões publicadas não devem ser sobrescritas silenciosamente.

## Não incluído

- migração dos 31 registos;
- base de dados;
- API;
- Supabase;
- UI;
- mapa vivo;
- tradução em massa;
- resolução final de direitos;
- integração CIDOC CRM ou JSON-LD.

## Validação

O pacote deve passar:

```bash
node scripts/validate-data-model.mjs
node tests/data-model.test.mjs
```

## Próximo release recomendado

Pacote 04 — Auditoria e Migração da Versão Preliminar.
