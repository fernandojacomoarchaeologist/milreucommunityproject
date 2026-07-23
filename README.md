---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "07D"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Pacote 07D — Multicanal e Release Técnica do MVP

**Versão:** 0.11.0  
**Tipo:** pacote cumulativo e executável sobre o 07C.

O Pacote 07D fecha o primeiro ciclo técnico do Portal e do Museu e cria a ponte estruturada para totens e painéis físicos.

## Executar

```bash
npm install
npm run channels:export
npm run museum:index
npm run museum:audit
npm run validate
npm test
npm run build
npm run dev
```

## Laboratório multicanal

Abrir:

```text
#/laboratorio/canais
```

É possível visualizar cada memória como:

- página do Museu;
- proposta técnica de totem;
- proposta técnica de painel.

Os previews físicos não são arte final e mostram marca de água.

## Estrutura comum

Todos os canais reutilizam identificador, fotografia, título, data, descrição, crédito, direitos, fontes e destino canónico. Portal, Museu, totem e painel alteram a composição, a densidade e a sequência.

## QR

O pacote não inventa um domínio.

```bash
pip install -r requirements-qr.txt
MILREU_PUBLIC_BASE_URL="https://URL-REAL" npm run channels:qr:generate
```

A URL deve ser real. Não utilizar domínio de exemplo ou localhost como QR final.

## Build público

O build gera:

- aplicação;
- 30 páginas HTML estáticas;
- 30 JSONs individuais;
- JSON-LD;
- manifest;
- dados multicanal;
- exports CSV.

## GitHub Pages

O workflow `.github/workflows/07d-pages.yml` é manual e exige confirmação literal e URL pública.

## Estado

Este é um **MVP técnico candidato**, não um lançamento público aprovado. Os bloqueios permanecem em `public/data/release-readiness.json`.
