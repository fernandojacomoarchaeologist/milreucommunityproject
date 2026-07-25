---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08G"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Google OAuth — configuração

## Fluxo

```text
Aplicação
→ Supabase Auth
→ Google
→ callback do Supabase
→ callback da aplicação
→ sessão
→ pré-autorização e membership
```

## Local

Callback registado no Google:

```text
http://127.0.0.1:54321/auth/v1/callback
```

Callback da aplicação:

```text
http://localhost:4173/auth/callback/
```

Ativar `[auth.external.google]` somente depois de configurar as variáveis locais.

## Hosted Supabase

No Google, utilizar o callback exibido pelo provider Google do respetivo projeto Supabase:

```text
https://<project-ref>.supabase.co/auth/v1/callback
```

Configurar separadamente staging e produção.

## Segurança

- secret do Google fora do Git;
- `skip_nonce_check = false`;
- tokens do provider não armazenados;
- pré-autorização obrigatória;
- membership pendente até aprovação;
- domínios permitidos são opcionais e não substituem a aprovação;
- validar redirects exatos.
