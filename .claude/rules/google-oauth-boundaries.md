---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08A"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Limites do Google OAuth

- Usar Google apenas para autenticação no 08A.
- Solicitar `openid email profile`.
- Não pedir Gmail, Drive, Calendar ou contactos.
- Não guardar provider token ou refresh token.
- Manter callback explícito e PKCE.
