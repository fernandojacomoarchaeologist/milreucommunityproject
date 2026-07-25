---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08I"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Relatório de validação — Pacote 08I

## Resultado geral

- Versão: 0.20.0
- Base cumulativa: 08H
- Testes automatizados: 286
- Testes aprovados: 286
- Testes falhados: 0
- Validação cumulativa: concluída
- Build: concluído
- Smoke HTTP: concluído
- TypeScript das duas Edge Functions: verificado com shim local de Deno
- YAML dos workflows 08I: válido
- Revisão visual humana em navegador: pendente
- Execução real das migrations em PostgreSQL/Supabase: pendente
- Execução real das Edge Functions em Deno/Supabase: pendente

## Área Colaborativa

- Módulos registados: 22
- Módulos ativos: 22
- Permissões acumuladas: 117
- Recursos de biblioteca: 22
- Novos módulos:
  - `system-administration`;
  - `audit-governance`;
  - `incident-continuity`.

## Administração e saúde operacional

- Checks operacionais: 20
- Categorias cobertas: banco, autenticação, auditoria, storage, notificações, backup, retenção, incidentes, publicação, staging, produção, segurança e continuidade
- Evidência obrigatória para checks configurados: sim
- Execuções por ambiente: local, staging e produção
- Conclusão bloqueada enquanto existem checks pendentes: sim
- Configurações sensíveis no painel: bloqueadas
- Polling operacional mínimo: 60 segundos

## Auditoria

- Acesso direto da função `authenticated` à tabela: revogado
- Pesquisa via RPC redigida: incluída
- Cadeia de hashes: incluída
- Redacção recursiva: incluída
- Update/delete por utilizadores da aplicação: bloqueados
- Categorias e severidades: incluídas
- Correlação e request hash: incluídos
- Exportação CSV: limitada a 5000 linhas
- Exportação com service role: não
- `before_data`/`after_data` brutos na exportação: não
- Cache da exportação: `no-store`

## Retenção

- Políticas: 7
- Aplicação automática: false
- Agendamento automático: false
- Aplicação pelo navegador: false
- Preview antes da aprovação: sim
- Legal holds: incluídos
- Hash do conjunto de candidatos: incluído
- Revalidação antes da aplicação: incluída
- Aplicação: exclusiva do service role
- Confirmação de aprovação: `APPROVE_MILREU_RETENTION_RUN`
- Confirmação de aplicação: `APPLY_MILREU_RETENTION_POLICY`
- Confirmação adicional de produção: `APPLY_MILREU_PRODUCTION_RETENTION`
- Contributos comunitários, auditoria e incidentes: fora da eliminação automática

## Incidentes e continuidade

- Severidades: SEV-1 a SEV-4
- Estados operacionais: incluídos
- Referência anual: `INC-AAAA-NNN`
- Linha temporal: incluída
- Ações corretivas: incluídas
- Responsável: incluído
- Resumo público opcional: incluído
- Exercícios de continuidade: incluídos
- Cenários: perda de dados, storage, login, fornecedor, credenciais, publicação acidental e retirada
- Exercício concluído sem resultado/evidência: bloqueado

## Backups

- Tipos de plano: base de dados, storage, código, configuração e auditoria
- Provider inicial: `unconfigured`
- Backup remoto confirmado: false
- RPO/RTO: incluídos
- Responsáveis principal e secundário: incluídos
- Evidência de verificação: obrigatória
- Restauração testada: registável
- Falha de verificação: gera notificação interna
- Um plano é tratado como prova de backup: não

## Notificações orgânicas do 08I

- Eventos acumulados: 25
- Templates acumulados: 25
- Novos eventos:
  - `incident.opened`;
  - `incident.assigned`;
  - `incident.resolved`;
  - `backup.verification-failed`;
  - `retention.run-approved`.
- E-mail ativo por padrão: não

## Banco de dados

- Migrations novas: 3
- Tabelas novas: 13
- Funções/RPCs novas ou substituídas: 29
- Triggers novos na fundação: 9
- RLS nas novas tabelas: sim
- Escrita direta autenticada nas novas tabelas: não
- Teste SQL: `supabase/tests/008i_operations_governance.test.sql`

Migrations:

- `20260724150000_collaborative_operations_foundation.sql`
- `20260724150100_collaborative_operations_rpc.sql`
- `20260724150200_collaborative_operations_seed.sql`

Este ambiente não possui Supabase CLI, PostgreSQL, Docker ou Deno. As migrations foram verificadas estruturalmente e possuem teste SQL preparado, mas a execução real continua obrigatória em Supabase local e staging.

## Edge Functions

- `dispatch-collab-notifications` preservada do 08H
- `export-collab-audit` adicionada no 08I
- TypeScript verificado com `tsc` e declarações locais de compatibilidade
- Exportação de auditoria exige JWT
- Service role não utilizada pela exportação
- Execução real em Deno não realizada

## Workflows 08I

- `08i-audit-export-deploy.yml`
- `08i-ci.yml`
- `08i-database-tests.yml`
- `08i-retention-apply.yml`

Características:

- CI cumulativa;
- testes locais de banco;
- deploy manual da exportação em staging;
- aplicação manual de uma execução de retenção aprovada;
- GitHub Environment protegido;
- dois literais para produção;
- nenhum agendamento recorrente.

## Preflight herdado do 08G

Estado: **blocked**

Bloqueios externos preservados:

- MILREU_SITE_URL não está definido.
- MILREU_SUPABASE_URL não está definido.
- Google OAuth ainda não foi marcado como configurado.
- MILREU_MASTER_EMAIL ainda não está definido.

Nenhum URL, projeto Supabase, credencial Google, e-mail master, fornecedor de backup ou evidência remota foi inventado.

## Build

- Manifest version: 0.20.0
- Modo: `editorial-preview-noindex`
- Páginas estáticas de memórias: 30
- JSONs individuais de memórias: 30
- Checksum do modelo operacional: sim
- Checksum do modelo de retenção: sim
- Checksum do runtime operacional: sim
- Checksum das notificações: sim
- Checksum do modelo editorial: sim
- `dist/` removido do ZIP para evitar duplicação das imagens

## Comandos concluídos

- `npm run deploy:profile`
- `npm run deploy:preflight`
- `npm run deploy:oauth-check`
- `npm run notifications:config`
- `npm run operations:config`
- `npm run operations:report`
- `npm run operations:backup-evidence`
- `npm run operations:retention-plan`
- `npm run operations:audit-status`
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

## Estado de prontidão

- Governação operacional preparada: true
- Operação remota validada: false
- Integridade remota da auditoria validada: false
- Backup remoto confirmado: false
- Restauração confirmada: false

## Próxima fronteira

O próximo pacote recomendado é o **08J — Fecho funcional, acessibilidade, testes E2E e release candidate da Área Colaborativa**.
