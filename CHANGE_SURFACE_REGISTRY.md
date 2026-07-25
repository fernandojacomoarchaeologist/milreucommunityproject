---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08H"
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
