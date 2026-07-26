---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08M"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Rotas, vistas e permissões

## Módulo novo

```json
{
  "code": "operations-governance",
  "name": "Operação e governação",
  "route": "/area-colaborativa/gestao/operacao",
  "status": "active",
  "permission": "operations.view",
  "description": "Operação, suporte, moderação, decisões, indicadores e continuidade.",
  "sortOrder": 106
}
```

## Rotas

- `/area-colaborativa/gestao/operacao`
- `/area-colaborativa/gestao/governanca`
- `/transparencia` — pública, opcional e bloqueada por padrão

## Permissões

1. `operations.view`
2. `operations.manage`
3. `responsibilities.manage`
4. `support.submit`
5. `support.manage`
6. `moderation.manage`
7. `content-review.manage`
8. `governance.view`
9. `governance.manage`
10. `governance.decide`
11. `impact.manage`
12. `continuity.manage`

Master tem todas. Coordenador recebe as permissões operacionais, exceto decisões reservadas pelo modelo real. Outros membros podem submeter suporte e aceder apenas ao que for explicitamente autorizado. O público lê somente snapshots aprovados.

## Dashboard

Estado, cobertura, pedidos, moderação, revisões, decisões, indicadores, riscos, continuidade, bloqueadores e atualização.

## Acessibilidade

Estados textuais, `aria-live`, foco, teclado, 375/768/1280 px, tabelas adaptáveis, filtros identificados e nenhum alerta apenas por cor.
