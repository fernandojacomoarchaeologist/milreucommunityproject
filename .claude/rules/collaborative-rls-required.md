---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08A"
rights: "Consultar RIGHTS.md no repositório principal"
---

# RLS obrigatório

- Todas as tabelas colaborativas devem ter RLS.
- A interface não substitui autorização no banco.
- Permissões devem ser verificadas em políticas ou funções seguras.
- Não usar `raw_user_meta_data` como fonte de autorização.
