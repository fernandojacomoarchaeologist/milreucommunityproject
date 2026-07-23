---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08A"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Configuração do login Google

## Fluxo

```text
Entrar com Google
→ Supabase Auth
→ Google
→ /auth/callback/
→ troca PKCE
→ #/area-colaborativa
```

## Configuração necessária

1. Criar ou selecionar um projeto no Google Cloud.
2. Configurar a audiência e o ecrã de consentimento.
3. Criar credenciais OAuth para aplicação Web.
4. Ativar Google no Supabase Auth.
5. Registar as URLs locais, GitHub Pages e domínio final na lista de redirecionamentos.
6. Definir `MILREU_SUPABASE_URL`, `MILREU_SUPABASE_PUBLISHABLE_KEY` e `MILREU_SITE_URL`.
7. Executar `npm run collab:config`.

## Escopo

O 08A solicita apenas identidade básica:

- `openid`;
- `email`;
- `profile`.

Não solicita Gmail, Drive, Calendar ou outros serviços Google.

## Referências oficiais

- https://supabase.com/docs/guides/auth/social-login/auth-google
- https://supabase.com/docs/reference/javascript/auth-signinwithoauth
