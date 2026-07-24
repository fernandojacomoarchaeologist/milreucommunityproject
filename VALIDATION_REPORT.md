---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08C"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Relatório de validação

## Resultado

- Pacote: 08C
- Versão: 0.14.0
- Base: 08B v0.13.0
- SHA-256 da base: `602cafd55f3d219c345543d4acf29f0c0c4bbd7fa77acf0bae55cb869356af60`
- Validação acumulada: sucesso
- Testes automatizados: 99 aprovados, 0 falhados
- Build: sucesso
- Smoke HTTP: sucesso
- JSONs validados: 80
- Credenciais prováveis encontradas: 0
- Revisão visual humana: pendente após integração

## Voluntariado e tarefas

- Categorias: 13
- Modos de atribuição: 3
- Estados da tarefa: 6
- Estados da participação: 9
- Módulos colaborativos: 13
- Módulos ativos: 7
- Permissões colaborativas: 35
- Migrations novas: 2
- Migrations colaborativas acumuladas: 9

## Regressão pública

- Memórias visíveis no ambiente de revisão: 31
- Elegíveis para lançamento público: 30
- Páginas estáticas do Museu geradas: 30
- JSONs individuais gerados: 30
- Callback de autenticação no build: sim
- Checksum do modelo de tarefas no manifest: sim

## Comandos executados

```text
npm run collab:config      sucesso
npm run collab:status      sucesso
npm run channels:export    sucesso
npm run museum:index       sucesso
npm run museum:audit       sucesso
npm run validate           sucesso
npm test                   99/99
npm run build              sucesso
npm run smoke              sucesso
```

## Banco de dados

As migrations, políticas RLS, grants, constraints e RPCs foram validados estaticamente. O ambiente de geração não possui Supabase CLI, PostgreSQL ou Docker, portanto as migrations não foram executadas contra uma base real.

O pacote inclui:

- `supabase/tests/008c_volunteering_tasks.test.sql`;
- `.github/workflows/08c-database-tests.yml`;
- execução acumulada dos testes 08A, 08B e 08C em Supabase local.

A integração deve executar o workflow de banco em local ou staging antes de ligar o módulo a utilizadores reais.

## Limites preservados

- sem ranking ou gamificação;
- disponibilidade não cria obrigação;
- tempo autodeclarado exige validação;
- sem notificações ou e-mails automáticos;
- sem Google Calendar nesta versão;
- sem dados reais na demonstração;
- sem `service_role` no frontend.
