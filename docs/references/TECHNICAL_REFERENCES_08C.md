---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08C"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Referências técnicas — 08C

- Supabase Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase database functions: https://supabase.com/docs/guides/database/functions
- PostgreSQL constraints: https://www.postgresql.org/docs/current/ddl-constraints.html
- PostgreSQL transaction isolation: https://www.postgresql.org/docs/current/transaction-iso.html

## Decisão técnica

As transições de tarefa usam funções transacionais. A interface não altera diretamente tarefas, atribuições, disponibilidade ou horas.
