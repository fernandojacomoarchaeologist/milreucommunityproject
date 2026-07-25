---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08H"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Relatório de validação — Pacote 08H

## Resultado geral

- Versão: 0.19.0
- Testes automatizados: 246
- Testes aprovados: 246
- Testes falhados: 0
- Validação cumulativa: concluída
- Build: concluído
- Smoke HTTP: concluído
- TypeScript do worker: verificado com shim local de Deno
- YAML dos workflows 08H: válido
- Revisão visual humana em navegador: pendente
- Execução real das migrations: pendente
- Execução real do worker em Deno/Supabase: pendente

## Área Colaborativa

- Módulos registados: 19
- Módulos ativos: 19
- Permissões: 94
- Recursos de biblioteca: 17
- Novos módulos:
  - `notifications`;
  - `notification-management`.

## Centro interno

- Estado inicial: ativo
- Eventos: 20
- Categorias: 10
- Estados: não lida, lida e arquivada
- Badge no cabeçalho: incluído
- Filtros: pesquisa, estado e categoria
- Preferências por evento: incluídas
- Horário silencioso: incluído
- Fuso horário: validado
- Eventos críticos obrigatórios: preservados
- Inbox e preferências: estritamente self-service por RLS
- Polling: mínimo de 30 segundos

## E-mail transacional

- Estado inicial: desativado
- Provider inicial: `disabled`
- Provider suportado: `webhook`
- Templates pt-PT: 20
- Templates aprovados imutáveis: sim
- Correções por nova versão: sim
- Opt-in explícito: sim
- Eventos com e-mail ativo por padrão: 0
- Convites automáticos: não
- Agendamento automático: não
- Ativação lógica exige:

```text
ACTIVATE_MILREU_TRANSACTIONAL_EMAIL
```

## Outbox e worker

- Outbox privada: sim
- Deliveries privadas: sim
- Claim por browser: não
- Claim por service role: sim
- Retry: limitado
- Dead-letter: incluído
- Cancelamento manual: incluído
- Deduplicação: notificações e outbox
- Worker secret customizado: obrigatório
- Provider response body retido: não
- Destinatário resolvido no servidor: sim
- Destinatário completo no painel: não
- Payload no painel: não
- HTML arbitrário em templates: não
- HTML gerado a partir de texto escapado: sim

## Eventos operacionais

Triggers incluídos para:

1. memberships;
2. tarefas;
3. atribuição de contributos;
4. estado de contributos;
5. atribuição de revisão do Museu;
6. comentários bloqueantes;
7. formação;
8. agenda;
9. logística da exposição;
10. retirada;
11. homologação.

A atribuição inicial de tarefa utiliza corretamente o estado `assigned`.

## Banco de dados

- Migrations novas: 3
- Tabelas novas: 7
- RPCs/funções na migration operacional: 31
- Triggers operacionais: 11
- RLS: ativa nas sete tabelas
- Escrita direta autenticada: bloqueada
- Teste SQL: `supabase/tests/008h_notifications.test.sql`

Novas migrations:

- `20260724140000_collaborative_notifications_foundation.sql`
- `20260724140100_collaborative_notifications_rpc.sql`
- `20260724140200_collaborative_notifications_seed.sql`

Este ambiente não possui Supabase CLI, PostgreSQL, Docker ou Deno. As migrations e o worker foram validados estruturalmente, mas precisam de execução em Supabase local e staging.

## Edge Function

```text
supabase/functions/dispatch-collab-notifications/
```

- TypeScript verificado com `tsc` e declarações locais de compatibilidade;
- execução real em Deno não realizada;
- `verify_jwt=false` acompanhado de segredo customizado;
- provider desativado não reclama itens;
- service role apenas no servidor;
- corpo da resposta do fornecedor não é persistido.

## Workflows

- `08h-ci.yml`
- `08h-database-tests.yml`
- `08h-notification-dispatch.yml`
- `08h-notification-worker-deploy.yml`

Todos foram analisados como YAML válido.

Não existe agendamento recorrente. Publicação do worker e dispatch em staging são manuais e exigem confirmações literais.

## Preflight herdado do 08G

Estado: **blocked**

Bloqueios externos preservados:

- MILREU_SITE_URL não está definido.
- MILREU_SUPABASE_URL não está definido.
- Google OAuth ainda não foi marcado como configurado.
- MILREU_MASTER_EMAIL ainda não está definido.

Nenhum URL, projeto Supabase, credencial Google ou e-mail master foi inventado.

## Build

- Manifest version: 0.19.0
- Páginas estáticas de memórias: 30
- JSONs individuais de memórias: 30
- Checksum do modelo de notificações: sim
- Checksum dos templates: sim
- Checksum do runtime: sim
- Checksum do modelo editorial: sim
- Checksum do registo de impacto: sim
- `dist/` removido do ZIP para evitar duplicação de imagens

## Comandos concluídos

- `npm run deploy:profile`
- `npm run deploy:preflight`
- `npm run deploy:oauth-check`
- `npm run notifications:config`
- `npm run notifications:preview`
- `npm run notifications:test-payload`
- `npm run notifications:dispatch-status`
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

O snapshot editorial permanece vazio; a aplicação terminou corretamente sem alterar memórias.

## Próxima fronteira

O próximo pacote recomendado é o **08I — Administração, auditoria, retenção, backups e continuidade operacional**.
