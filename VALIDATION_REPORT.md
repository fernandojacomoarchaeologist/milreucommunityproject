---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08B"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Relatório de validação

## Resultado

- Resultado geral: sucesso
- Versão: 0.13.0
- Modo runtime: `demo`
- Supabase remoto configurado: não
- Google OAuth executado neste ambiente: não
- Service role no frontend: não
- E-mail real do master no pacote: não

## Gestão de membros

- Módulos colaborativos: 11
- Módulos ativos: 4
- Perfis principais: 8
- Funções: 8
- Permissões: 27
- Áreas de interesse: 10
- Competências: 12
- Migrations colaborativas totais: 7
- Migrations novas do 08B: 2
- Proteção do último master: validada estaticamente
- Pré-autorização Google: validada estaticamente
- Envio automático de e-mail: não implementado

## Qualidade

- Testes automatizados: 82
- Testes aprovados: 82
- Testes falhados: 0
- Páginas estáticas do Museu: 30
- JSONs individuais do Museu: 30
- Callback no build: sim
- Checksum colaborativo no manifest: sim
- Build e smoke HTTP: concluídos
- Teste visual automatizado em Chromium: não executado; o ambiente bloqueou acesso do navegador ao localhost por política administrativa

## Banco de dados

As migrations e políticas foram validadas por inspeção automatizada. O ambiente não dispõe de Supabase CLI, Docker ou PostgreSQL, pelo que a execução real deve ocorrer no workflow `08b-database-tests.yml` ou num ambiente local/staging antes de produção.

## Comandos

- `npm run collab:config`: sucesso
- `npm run collab:status`: sucesso
- `npm run channels:export`: sucesso
- `npm run museum:index`: sucesso
- `npm run museum:audit`: sucesso
- `npm run validate`: sucesso
- `npm test`: sucesso
- `npm run build`: sucesso
- `npm run smoke`: sucesso
