---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08J"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Registo de superfícies de alteração

## Portal Home

Contrato:

```text
portal.home.after-featured
```

Ficheiros:

- `src/views/portal.js`;
- `src/components/public-content-effects.js`;
- `public/data/public-content-effects.json`.

## Museu Home

Contrato:

```text
museum.home.after-opening
```

Ficheiros:

- `src/views/museum.js`;
- `src/components/public-content-effects.js`;
- `public/data/public-content-effects.json`.

## Dados canónicos do Museu

- `public/data/memories.json`;
- `public/data/museum-editorial-approved.json`;
- `scripts/museum-review/apply-approved.mjs`.

Alterações exigem hash de base, aprovações, validação e PR.

## Área Colaborativa

Navegação por `collaborative-modules.json`. Um pacote deve ativar ou ampliar módulos pelo registo, não criar entradas paralelas sem permissão e rota.

## Formação

Percursos são registados em `collaborative-training-trails.json` e sincronizados com Supabase.

## Biblioteca

Recursos são registados em `collaborative-library.json`.

## Regra

Quando um pacote tocar numa destas superfícies, deve:

1. atualizar `package-impact-registry.json`;
2. atualizar o ledger;
3. executar testes de não regressão;
4. documentar o efeito público;
5. preservar os slots existentes.

## Implantação e autenticação

Ficheiros:

- `public/config/deployment-profile.runtime.json`;
- `public/data/deployment-readiness.json`;
- `public/data/collaborative-homologation-model.json`;
- `scripts/deploy/`;
- `supabase/migrations/20260724130*.sql`;
- `.github/workflows/08g-*.yml`.

Alterações futuras devem preservar:

- staging separado;
- demo apenas local;
- pré-autorização;
- service role fora do browser;
- homologação antes de produção.

## Notificações e comunicação transacional

Ficheiros:

- `public/data/collaborative-notification-model.json`;
- `public/data/collaborative-notification-templates.json`;
- `public/config/notifications.runtime.json`;
- `src/views/collaborative-notifications.js`;
- `src/collab/controller.js`;
- `supabase/migrations/20260724140*.sql`;
- `supabase/functions/dispatch-collab-notifications/`;
- `scripts/notifications/`.

Contratos:

- evento → preferência → notificação;
- e-mail → template aprovado → outbox → worker;
- centro interno independente;
- fornecedor desativado por padrão;
- convites explícitos;
- sem chat.

## Administração, auditoria e continuidade

Ficheiros:

- `public/data/collaborative-operational-governance-model.json`;
- `public/data/collaborative-retention-model.json`;
- `public/config/operations.runtime.json`;
- `src/views/collaborative-operations.js`;
- `supabase/migrations/20260724150*.sql`;
- `supabase/functions/export-collab-audit/`;
- `scripts/operations/`.

Contratos:

- auditoria imutável e redigida;
- exportação sem service role;
- retenção preview → aprovação → service role;
- produção com confirmação adicional;
- legal holds revalidados;
- backup com evidência;
- incidentes auditados;
- sem mutação operacional automática.


## Qualidade, acessibilidade e release candidate — 08J

Ficheiros:

- `public/data/collaborative-release-candidate-model.json`;
- `public/data/release-candidate-readiness.json`;
- `public/data/accessibility-audit-model-08j.json`;
- `public/data/e2e-scenarios-08j.json`;
- `src/views/collaborative-release-candidate.js`;
- `scripts/accessibility/`;
- `scripts/e2e/`;
- `scripts/release/`.

Contratos:

- preservar 22 módulos e 117 permissões;
- RC técnica separada de staging e produção;
- acessibilidade automática com gate humano;
- E2E local sem alegação remota;
- evidência reproduzível;
- sem secrets ou mutação de produção.
