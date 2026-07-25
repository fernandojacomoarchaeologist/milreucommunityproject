---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08G"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Relatório de validação — Pacote 08G

## Resultado técnico

- Versão: 0.18.0
- Testes automatizados: 208
- Testes aprovados: 208
- Testes falhados: 0
- Build: concluído
- Smoke HTTP local: concluído
- YAML dos três workflows 08G: válido
- Integridade do ZIP: validada após compactação
- Revisão visual humana em navegador: pendente
- Execução real das migrations no Supabase: pendente

## Estado operacional real

O pacote foi validado em modo local e de demonstração. O preflight terminou corretamente como **blocked**, porque os dados externos não foram inventados.

Bloqueios atuais:

- MILREU_SITE_URL não está definido.
- MILREU_SUPABASE_URL não está definido.
- Google OAuth ainda não foi marcado como configurado.
- MILREU_MASTER_EMAIL ainda não está definido.

Consequentemente:

- Google OAuth remoto não está configurado;
- o e-mail master não está definido;
- o master não foi criado;
- staging não foi criado nem homologado;
- produção não foi configurada;
- remote smoke foi ignorado por falta de URL;
- a consulta remota da contagem de masters foi ignorada por falta de credenciais seguras.

## Área Colaborativa

- Módulos registados: 17
- Módulos ativos: 17
- Permissões: 82
- Recursos de biblioteca: 13
- Novo módulo: `deployment-homologation`
- Rota de gestão: `#/area-colaborativa/gestao/homologacao`

## Homologação

- Ambientes modelados: 3
- Checks obrigatórios/recomendados: 24
- Checks bloqueantes: 23
- Migrations novas: 3
- Workflows novos: 3
- Relatório local inicial gerado: sim

Fluxo protegido:

```text
local
→ staging separado
→ 24 checks
→ staging aprovado
→ produção futuramente autorizada
```

A produção exige a confirmação literal:

```text
APPROVE_MILREU_PRODUCTION_RELEASE
```

## Google OAuth e master

- Provider Google preparado no `supabase/config.toml`
- Provider ativado por padrão: não
- Pré-autorização obrigatória: sim
- Armazenamento de tokens do Google: não
- Secret do Google no frontend: não
- Service role no frontend: não
- Domínios permitidos: configuráveis
- E-mail master incluído no pacote: não
- Bootstrap do master: protegido por literal
- Proteção do último master: preservada

Literal de bootstrap:

```text
BOOTSTRAP_MILREU_MASTER
```

## Segurança de implantação

- Demo somente local
- HTTPS obrigatório fora do local
- Staging e produção devem usar projetos distintos
- Escritas de produção desativadas no preflight
- Dry-run de migrations obrigatório
- Remote smoke de produção limitado a GET e confirmação literal
- Escrita nas tabelas 08G apenas por RPC
- RLS preparada nas cinco novas tabelas
- Relatórios não expõem e-mail master
- Artefactos públicos não contêm valores reais de secrets

## Banco de dados

Novas migrations:

- `20260724130000_collaborative_deployment_homologation.sql`
- `20260724130100_collaborative_deployment_homologation_rpc.sql`
- `20260724130200_collaborative_deployment_homologation_seed.sql`

Novo teste:

```text
supabase/tests/008g_deployment_homologation.test.sql
```

Este ambiente não possui Supabase CLI, PostgreSQL ou Docker. As migrations, RLS e RPCs foram validadas estruturalmente, mas precisam ser executadas em Supabase local e depois em staging.

## Workflows

- `08g-ci.yml`
- `08g-database-tests.yml`
- `08g-staging-homologation.yml`

O workflow de staging é manual. O dry-run é executado antes de qualquer aplicação, enquanto migrations e Edge Functions dependem de inputs explícitos e do ambiente GitHub protegido.

## Build

- Versão do manifest: 0.18.0
- Páginas estáticas das memórias: 30
- JSONs individuais das memórias: 30
- Checksum do perfil de implantação: sim
- Checksum do readiness: sim
- Checksum do modelo de homologação: sim
- Checksum do modelo editorial 08F: sim
- Checksum do registo de impacto: sim
- `dist/` removido do ZIP para evitar duplicação das imagens

## Comandos concluídos

- `npm run deploy:profile`
- `npm run deploy:preflight`
- `npm run deploy:oauth-check`
- `npm run collab:config`
- `npm run museum:review-export`
- `npm run museum:review-apply`
- `npm run contributions:demo-export`
- `npm run exhibitions:export`
- `npm run channels:export`
- `npm run museum:index`
- `npm run museum:audit`
- `npm run validate`
- `npm test`
- `npm run build`
- `npm run smoke`
- `npm run deploy:homologation-report`
- `npm run deploy:master-status`
- `npm run deploy:remote-smoke`

## Próxima ação real

1. integrar o 08G;
2. executar Supabase local;
3. executar os testes SQL 08A–08G;
4. criar um projeto de staging separado;
5. configurar Google OAuth local e em staging;
6. autenticar o utilizador que será master;
7. fornecer o e-mail master por secret;
8. executar o bootstrap com confirmação literal;
9. homologar os perfis e os 24 checks;
10. manter produção bloqueada.
