---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08A"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Definição do master do sistema

O e-mail do master não é gravado no código.

## Processo

1. Configurar Google OAuth.
2. O futuro master entra uma vez com Google.
3. O utilizador passa a existir em `auth.users`.
4. Executar localmente o script administrativo com o e-mail real.
5. O script chama a função `collab_bootstrap_master_by_email`.
6. O utilizador recebe:
   - vínculo ativo;
   - perfil principal `coordinator`;
   - função `master`.

## Comando

```bash
MILREU_SUPABASE_URL="..." \
SUPABASE_SERVICE_ROLE_KEY="..." \
MILREU_MASTER_EMAIL="..." \
npm run collab:bootstrap-master
```

## Segurança

- `SUPABASE_SERVICE_ROLE_KEY` nunca entra no navegador;
- o script não imprime o e-mail;
- a auditoria guarda apenas hash do e-mail;
- a função RPC só é executável por `service_role`.
