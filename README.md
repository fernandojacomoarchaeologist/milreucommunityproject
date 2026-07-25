---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08H"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Pacote 08H — Notificações, Comunicação e Operação

**Versão:** 0.19.0  
**Base cumulativa:** Pacote 08G.

O 08H ativa um centro interno de notificações e prepara a comunicação transacional por e-mail sem selecionar ou ativar automaticamente um fornecedor externo.

## Rotas

```text
#/area-colaborativa/notificacoes
#/area-colaborativa/notificacoes/preferencias
#/area-colaborativa/gestao/notificacoes
#/area-colaborativa/gestao/notificacoes/templates
```

## Centro interno

O centro interno é o canal canónico para membros autenticados.

Inclui:

- não lidas, lidas e arquivadas;
- prioridade;
- categoria;
- link para o contexto;
- marcação individual;
- marcação coletiva;
- filtros;
- badge no cabeçalho;
- preferências.

Avisos críticos e obrigatórios não podem ser desativados dentro da aplicação.

## Eventos

O pacote possui 20 eventos, incluindo:

- acesso;
- tarefas;
- contributos;
- revisão do Museu;
- formação;
- agenda;
- exposição;
- retirada;
- homologação.

Triggers de banco criam avisos a partir das alterações operacionais existentes.

## E-mail transacional

Estado inicial:

```text
provider=disabled
channel=disabled
automaticScheduleEnabled=false
```

Fornecedor suportado pelo contrato:

```text
webhook
```

O Edge Function envia um payload genérico para um webhook configurado no servidor. O pacote não seleciona Resend, SendGrid, Mailgun ou outro fornecedor.

Variáveis:

```text
MILREU_NOTIFICATION_PROVIDER
MILREU_NOTIFICATION_WEBHOOK_URL
MILREU_NOTIFICATION_WEBHOOK_TOKEN
MILREU_NOTIFICATION_WORKER_SECRET
MILREU_NOTIFICATION_FROM_NAME
MILREU_NOTIFICATION_FROM_EMAIL
MILREU_PUBLIC_SITE_URL
```

Nenhum desses valores é gravado no runtime público.

## Ativação do e-mail

A ativação lógica no Supabase exige:

```text
ACTIVATE_MILREU_TRANSACTIONAL_EMAIL
```

Antes da ativação:

1. fornecedor aprovado;
2. domínio/remetente validados;
3. política de privacidade revista;
4. webhook testado;
5. templates aprovados;
6. worker secret configurado;
7. staging homologado;
8. rollback documentado.

## Outbox

```text
evento
→ preferência
→ template aprovado
→ outbox
→ claim por service role
→ webhook
→ delivery
→ entregue / retry / dead-letter
```

O navegador não reclama nem entrega mensagens.

## Convites

Convites por e-mail são explícitos. A criação da pré-autorização não envia automaticamente mensagem.

## Comandos

```bash
npm run notifications:config
npm run notifications:preview
npm run notifications:test-payload
npm run notifications:dispatch-status
npm run notifications:validate
```

Validação cumulativa:

```bash
npm run deploy:profile
npm run deploy:preflight
npm run deploy:oauth-check
npm run notifications:config
npm run collab:config
npm run museum:review-export
npm run museum:review-apply
npm run contributions:demo-export
npm run exhibitions:export
npm run channels:export
npm run museum:index
npm run museum:audit
npm run validate
npm test
npm run build
npm run smoke
```

As migrations e o worker devem ser testados em Supabase local e staging.
