---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08D"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Referências técnicas — 08D

As decisões do pacote apoiam-se em recursos já adotados no projeto:

- PostgreSQL range types e exclusion constraints;
- Supabase Row Level Security;
- Supabase RPC/PostgREST;
- GitHub Actions;
- exportação estática para GitHub Pages.

A execução real das migrations deve ocorrer no workflow com Supabase local. A validação desta geração não substitui a execução PostgreSQL.

## Chave da Data API

A exportação estática usa a chave publicável no cabeçalho `apikey`. Ela não é enviada como `Authorization: Bearer`, pois as chaves publicáveis atuais não são JWTs de utilizador. A função pública depende de grants restritos e devolve apenas campos aprovados.
