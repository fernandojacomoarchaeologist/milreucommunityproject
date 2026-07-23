---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "05F"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Catálogo de comandos

## Ambiente

- `npm run env:status`
- `npm run infra:validate`
- `npm run infra:test`

## Supabase local

- `npm run db:start`
- `npm run db:reset`
- `npm run db:test`
- `npm run db:stop`

## Migrations

- `npm run db:migration:new -- nome`
- `npm run db:migration:check`

## Produção

- `npm run db:production:preflight`
- deployment somente pelo workflow protegido

## Snapshots

- `npm run snapshot:export`
- `npm run snapshot:validate`

## Fontes privadas

- `npm run assets:private:status`
- `npm run assets:private:verify`

## Revisão visual

- `npm run review:gate-a:index`
