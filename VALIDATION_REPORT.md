---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08F"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Relatório de validação — Pacote 08F

## Resultado

- Resultado geral: sucesso
- Versão: 0.17.0
- Testes automatizados: 180
- Testes aprovados: 180
- Testes falhados: 0
- Build: concluído
- Smoke HTTP: concluído
- Revisão visual humana em navegador: pendente
- Execução real das migrations no Supabase: pendente
- Aplicação canónica automática: desativada

## Área Colaborativa

- Módulos registados: 16
- Módulos ativos: 16
- Módulos esqueleto: 0
- Permissões: 70
- Trilhas de formação: 5
- Lições: 15
- Recursos de biblioteca: 9

## Revisão editorial e curatorial

- Memórias no ciclo inicial: 31
- Memórias únicas: 31
- Campos ou grupos de revisão: 22
- Tipos de checks: 8
- Tipos de decisão: 6
- Memórias inicialmente aprovadas: 0
- Efeitos públicos inicialmente ativos: 0
- Slots públicos: 2
- Proposta por JSON Pointer: ativa
- Comentários bloqueantes: suportados
- Atribuições especializadas: suportadas
- Comparação canónico/candidato: suportada
- Sequência editorial → direitos → publicação: obrigatória
- Snapshot aprovado antes da aplicação: obrigatório
- Confirmação literal para aprovação do snapshot: obrigatória
- Dry-run antes da aplicação: suportado
- Backup antes da alteração canónica: suportado

## Formação e segurança

- Escrita direta do progresso pelo browser: bloqueada
- Progresso de formação: apenas por RPC auditada
- Avaliação de formação: apenas por RPC autorizada
- Aprovações especializadas: condicionadas à formação
- Campos editoriais: limitados a whitelist
- Contributos associados: limitados a aceites, parcialmente aceites ou incorporados
- Propostas aceites: imutáveis
- Substituição de proposta aceite: ação explícita e auditada
- `service_role` no browser: não
- Exportação do snapshot: JWT de utilizador autorizado
- Hash do dataset: obrigatório
- Hash do registo: obrigatório
- RLS: preparada nas tabelas 08F

## MM202617

- Visível para revisão: true
- Elegível para lançamento de origem: false
- Divulgação de IA obrigatória: true
- Publicação futura exige proposta explícita em `/publication`: sim
- Divulgação `ai-substantive-intervention` deve ser preservada: sim
- Exportação e aplicação validam a divulgação de IA: sim

## Continuidade de contexto

Incluídos e validados:

- `PROJECT_CONTEXT_LEDGER.md`;
- `PACKAGE_DEPENDENCY_MAP.md`;
- `CHANGE_SURFACE_REGISTRY.md`;
- `CONTEXT_RECOVERY_PROTOCOL.md`;
- `public/data/package-impact-registry.json`.

As páginas principais foram preparadas para evolução orgânica por slots:

```text
portal.home.after-featured
museum.home.after-opening
```

Nenhum conteúdo editorial foi inventado para esses slots.

## Banco de dados

- Migrations novas: 3
- Teste SQL novo: `supabase/tests/008f_museum_review.test.sql`
- Workflow cumulativo 08A–08F: incluído
- Supabase CLI disponível neste ambiente: não
- PostgreSQL disponível neste ambiente: não
- Docker disponível neste ambiente: não

As migrations, RPCs e políticas foram validadas estruturalmente. A execução real deve ocorrer no workflow, em Supabase local ou em staging.

## Build

- Páginas estáticas das memórias: 30
- JSONs individuais das memórias: 30
- Checksum do modelo de revisão: sim
- Checksum das trilhas: sim
- Checksum da biblioteca: sim
- Checksum do snapshot editorial: sim
- Checksum dos efeitos públicos: sim
- Checksum do registo de impacto: sim
- `dist/` removido do ZIP para evitar duplicação das imagens

## Comandos concluídos

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
