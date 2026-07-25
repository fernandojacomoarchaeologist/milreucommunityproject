---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08I"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Pacote 08I — Administração, Auditoria, Retenção e Continuidade

**Versão:** 0.20.0  
**Base cumulativa:** Pacote 08H.

O 08I fecha a camada de governação operacional da Área Colaborativa. Ele não executa retenção, backup ou produção automaticamente.

## Novos módulos

```text
#/area-colaborativa/gestao/sistema
#/area-colaborativa/gestao/auditoria
#/area-colaborativa/gestao/incidentes
```

Os incidentes possuem detalhe em:

```text
#/area-colaborativa/gestao/incidentes/:id
```

## Administração do sistema

Inclui:

- dashboard de saúde;
- 20 checks operacionais;
- execuções por ambiente;
- evidências;
- configurações não sensíveis;
- planos de backup;
- verificações de backup;
- RPO e RTO;
- responsáveis principal e secundário.

A existência de um plano não é tratada como prova de backup.

## Auditoria

O acesso direto à tabela de auditoria foi removido dos utilizadores autenticados.

A consulta passa por RPC redigida:

- ator por nome, sem e-mail;
- ação;
- entidade;
- categoria;
- prioridade;
- chaves alteradas;
- correlação;
- hashes;
- data.

A auditoria recebe:

- cadeia de hashes;
- redacção recursiva;
- categoria;
- prioridade;
- request hash;
- correlação;
- imutabilidade contra update/delete.

Exportações são CSV redigidos, limitados e gerados por Edge Function com a sessão do utilizador.

## Retenção

Fluxo:

```text
Política ativa
→ preview
→ legal holds
→ hash dos candidatos
→ aprovação literal
→ workflow protegido
→ service role
→ confirmação de produção
```

Aprovação:

```text
APPROVE_MILREU_RETENTION_RUN
```

Aplicação:

```text
APPLY_MILREU_RETENTION_POLICY
```

Produção:

```text
APPLY_MILREU_PRODUCTION_RETENTION
```

O navegador não aplica retenção.

Contributos comunitários, pedidos de retirada, auditoria e incidentes permanecem em revisão humana; não entram em eliminação automática.

## Legal holds

Podem proteger:

- um recurso completo;
- uma entidade específica;
- um período definido;
- investigação, direitos ou incidente.

O conjunto de legal holds é revisto novamente antes da aplicação.

## Incidentes

Inclui:

- referência `INC-AAAA-NNN`;
- severidade SEV-1 a SEV-4;
- ambiente;
- estado;
- impacto;
- responsável;
- linha temporal;
- ações corretivas;
- resumo público opcional;
- resolução e fecho;
- notificações internas.

## Backups e continuidade

Inclui planos para:

- base de dados;
- storage privado;
- código;
- configuração;
- exportação de auditoria.

Também inclui:

- verificações;
- restauração testada;
- evidência;
- RPO/RTO;
- exercícios de continuidade;
- resultados e tempo real de recuperação.

O pacote não cria backups diretamente.

## Comandos

```bash
npm run operations:config
npm run operations:report
npm run operations:audit-status
npm run operations:backup-evidence
npm run operations:retention-plan
npm run operations:validate
```

Validação cumulativa:

```bash
npm run deploy:profile
npm run deploy:preflight
npm run deploy:oauth-check
npm run notifications:config
npm run operations:config
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

As migrations 08A–08I devem ser executadas em Supabase local e staging.
