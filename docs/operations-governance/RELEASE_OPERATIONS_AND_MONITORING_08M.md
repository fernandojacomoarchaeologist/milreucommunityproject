---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08M"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Releases e monitorização

## Mudança

```text
proposta
→ risco
→ aprovação
→ janela
→ backup/rollback
→ deploy
→ smoke
→ observação
→ encerramento
```

Tipos: `standard`, `normal`, `urgent`, `emergency`, `content-only`, `configuration`, `rollback`.

Toda mudança regista release, ambiente, superfície, responsável, janela, risco, dependências, backup, rollback, checks, evidência e resultado.

## Monitorização mínima

- disponibilidade;
- erros;
- autenticação;
- API e storage;
- notificações;
- links quebrados;
- efeitos públicos;
- expirações;
- snapshots;
- RLS;
- desempenho;
- acessibilidade regressiva quando testável.

## Não definido pelo pacote

- fornecedor;
- uptime alvo;
- horário de suporte;
- pager;
- escala;
- SLA.

Saúde: `healthy`, `degraded`, `at-risk`, `incident`, `unknown`.
