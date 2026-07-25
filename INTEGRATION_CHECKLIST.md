---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08G"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Checklist de integração — 08G

## Contexto

- [ ] ledger
- [ ] dependências
- [ ] superfícies
- [ ] recuperação
- [ ] relatório 08F
- [ ] registo de impacto

## Código

- [ ] módulo de homologação
- [ ] rota de gestão
- [ ] detalhe da execução
- [ ] controller
- [ ] demo
- [ ] preflight
- [ ] OAuth checker
- [ ] remote smoke
- [ ] master status
- [ ] bootstrap literal

## Ambientes

- [ ] local identificado
- [ ] staging criado
- [ ] produção criada
- [ ] referências diferentes
- [ ] SITE_URL
- [ ] callbacks
- [ ] HTTPS
- [ ] demo desativada fora de local
- [ ] produção sem reset

## Google OAuth

- [ ] projeto Google
- [ ] consent screen
- [ ] client web
- [ ] callback Supabase local
- [ ] callback Supabase staging
- [ ] callback Supabase produção
- [ ] provider local
- [ ] provider staging
- [ ] provider produção
- [ ] callback da aplicação
- [ ] pré-autorização
- [ ] tokens não armazenados
- [ ] logout
- [ ] expiração

## Master

- [ ] utilizador autenticado pelo Google
- [ ] e-mail definido em secret
- [ ] confirmação literal
- [ ] bootstrap
- [ ] master ativo
- [ ] proteção do último master
- [ ] segundo responsável definido para contingência

## Banco

- [ ] migrations 08A–08G
- [ ] `db push --dry-run`
- [ ] RLS
- [ ] RPCs
- [ ] 24 checks
- [ ] teste SQL
- [ ] local
- [ ] staging
- [ ] rollback

## Perfis

- [ ] master
- [ ] coordinator
- [ ] volunteer
- [ ] reviewer
- [ ] researcher
- [ ] translator
- [ ] partner
- [ ] observer
- [ ] utilizadores isolados
- [ ] não autorizado

## Storage e contributos

- [ ] bucket privado
- [ ] upload assinado
- [ ] download assinado
- [ ] isolamento
- [ ] retirada
- [ ] ausência de URL pública
- [ ] procedimento de verificação de ficheiros

## Homologação

- [ ] 24 checks
- [ ] evidências
- [ ] bloqueios
- [ ] conclusão
- [ ] aprovação staging
- [ ] versão e SHA
- [ ] produção bloqueada sem staging
- [ ] confirmação literal

## Qualidade

- [ ] validate
- [ ] tests
- [ ] build
- [ ] smoke
- [ ] 375 px
- [ ] 768 px
- [ ] 1280 px
- [ ] teclado
- [ ] leitor de ecrã
