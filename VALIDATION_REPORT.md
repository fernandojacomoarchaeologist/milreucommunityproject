---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08A"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Relatório de validação

## Resultado

- Resultado geral: sucesso
- Versão: 0.12.0
- Modo runtime do pacote: `demo`
- Supabase remoto configurado: não
- Google OAuth configurado no ambiente: não
- Modo de demonstração: disponível
- Service role no navegador: não
- E-mail do master hardcoded: não

## Fundação colaborativa

- Perfis principais: 8
- Funções: 8
- Permissões: 21
- Módulos: 10
- Módulos ativos: 2
- Módulos em fundação: 1
- Módulos em esqueleto: 7
- Migrations colaborativas: 5
- Callback incluído no build: sim
- Checksum colaborativo no manifest: sim
- Checksum da configuração no manifest: sim

## Regressão e build

- Testes automatizados: 72
- Testes aprovados: 72
- Testes falhados: 0
- Páginas estáticas do Museu: 30
- JSONs individuais do Museu: 30
- Smoke HTTP: Portal, callback, controller, configuração, módulos, Museu e imagem
- Build removido do ZIP para evitar duplicação de imagens

## Banco de dados

As migrations, políticas RLS, RPCs, grants e testes SQL foram validados estaticamente. O ambiente desta geração não possui Supabase CLI, PostgreSQL ou Docker; por isso, a execução real das migrations não foi realizada aqui.

O pacote inclui:

- `supabase/collab-tests/008a_collaborative_foundation.test.sql`;
- `.github/workflows/08a-database-tests.yml`.

A integração deve executar o teste de banco local ou em staging antes de qualquer utilização remota.

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
