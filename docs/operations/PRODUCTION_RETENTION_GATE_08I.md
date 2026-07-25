---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08I"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Gate de retenção em produção

Produção exige dois literais:

```text
APPLY_MILREU_RETENTION_POLICY
APPLY_MILREU_PRODUCTION_RETENTION
```

O workflow deve usar GitHub Environment protegido e service role armazenada apenas como secret.
