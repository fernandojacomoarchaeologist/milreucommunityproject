---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08G"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Prompt de integração — Pacote 08G

Integra cumulativamente o 08G sobre o 08F.

## Antes de alterar

Ler:

- `PROJECT_CONTEXT_LEDGER.md`;
- `PACKAGE_DEPENDENCY_MAP.md`;
- `CHANGE_SURFACE_REGISTRY.md`;
- `CONTEXT_RECOVERY_PROTOCOL.md`;
- `docs/deployment/ENVIRONMENT_STRATEGY_08G.md`;
- `docs/deployment/STAGING_HOMOLOGATION_08G.md`.

## Objetivo

Preparar a implantação real da Área Colaborativa, sem configurar segredos ou publicar produção automaticamente.

## Integrar

1. migrations `20260724130000`–`130200`;
2. modelos e perfis de ambiente;
3. controller, rotas, view e estilos;
4. scripts de preflight, OAuth, smoke e master;
5. workflows;
6. testes;
7. documentação e contexto.

## Regras obrigatórias

- não inventar o e-mail master;
- não gravar secrets no Git;
- `service_role` somente em terminal seguro, CI protegido ou função de servidor;
- Google OAuth com pré-autorização;
- tokens do provider não armazenados;
- demo apenas local;
- staging separado de produção;
- HTTPS fora do local;
- produção sem reset;
- dry-run antes de migrations remotas;
- staging aprovado antes de produção;
- aprovação de produção com literal;
- remote smoke de produção apenas read-only;
- não executar `db reset --linked` em produção;
- não executar produção durante a integração.

## Comandos

```bash
npm ci
npm run deploy:profile
npm run deploy:preflight
npm run deploy:oauth-check
npm run collab:config
npm run validate
npm test
npm run build
npm run smoke
```

Executar os testes SQL 08A–08G em Supabase local.

## Verificação manual

- login Google;
- callback;
- conta sem pré-autorização;
- convite autorizado;
- aprovação de membro;
- master;
- último master;
- logout;
- expiração;
- perfis;
- RLS;
- storage;
- 24 checks;
- staging;
- 375, 768 e 1280 px.

Não afirmar que o Google OAuth ou staging estão configurados até existirem evidências reais.
