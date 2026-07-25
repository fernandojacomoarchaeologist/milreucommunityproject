---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08I"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Prompt de integração — Pacote 08I

Integra cumulativamente o 08I sobre o 08H.

## Ler primeiro

- `PROJECT_CONTEXT_LEDGER.md`;
- `PACKAGE_DEPENDENCY_MAP.md`;
- `CHANGE_SURFACE_REGISTRY.md`;
- `CONTEXT_RECOVERY_PROTOCOL.md`;
- `docs/operations/OPERATIONAL_GOVERNANCE_08I.md`;
- `docs/operations/AUDIT_INTEGRITY_08I.md`;
- `docs/operations/RETENTION_LIFECYCLE_08I.md`;
- `docs/operations/BACKUP_RESTORE_RUNBOOK_08I.md`;
- `docs/operations/INCIDENT_RESPONSE_08I.md`.

## Objetivo

Ativar a administração operacional sem executar ações irreversíveis ou afirmar recursos remotos não comprovados.

## Integrar

1. migrations `20260724150000`–`150200`;
2. Edge Function `export-collab-audit`;
3. modelos e runtime;
4. controller;
5. views, rotas, navegação e estilos;
6. notificações orgânicas do 08I;
7. scripts;
8. workflows;
9. testes;
10. documentação e contexto.

## Regras obrigatórias

- não editar nem apagar a auditoria;
- não devolver `before_data` ou `after_data` brutos;
- manter e-mail e identificadores sensíveis fora da exportação;
- não configurar secrets como settings;
- não afirmar backup sem evidência;
- não criar backup fictício;
- não aplicar retenção pelo navegador;
- não habilitar retenção automática;
- preview antes de aprovação;
- legal holds antes da aplicação;
- hash dos candidatos deve permanecer igual;
- aplicação apenas com service role;
- confirmação adicional para produção;
- contributos, auditoria, incidentes e direitos em revisão humana;
- não executar produção durante a integração;
- manter Google OAuth, staging e master bloqueados quando não configurados.

## Validação

```bash
npm ci
npm run operations:config
npm run operations:report
npm run operations:backup-evidence
npm run operations:retention-plan
npm run operations:audit-status
npm run validate
npm test
npm run build
npm run smoke
```

Executar o teste SQL 08I após os testes 08A–08H.

## Revisão manual

- dashboard;
- check run;
- evidência;
- configuração sem secret;
- pesquisa de auditoria;
- integridade;
- exportação;
- preview de retenção;
- aprovação;
- legal hold;
- incidente;
- ação corretiva;
- backup;
- verificação;
- exercício;
- 375, 768 e 1280 px;
- teclado e leitor de ecrã.

Não executar o workflow de aplicação da retenção sem dados reais, backup e aprovação.
