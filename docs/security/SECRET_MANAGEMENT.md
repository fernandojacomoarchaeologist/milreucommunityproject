---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "05F"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Gestão de segredos

## Nunca versionar

- `SUPABASE_ACCESS_TOKEN`;
- `SUPABASE_DB_PASSWORD`;
- secret keys;
- service role;
- URLs assinadas persistentes;
- credenciais de storage;
- dumps com dados reais.

## Armazenamento

- secrets locais em `.env.local`;
- secrets remotos em GitHub Environments;
- produção separada de staging;
- acesso mínimo.

## Frontend

Somente valores publicáveis e protegidos por RLS podem ser utilizados.

## Logs

Scripts devem mascarar valores e evitar `set -x`.
