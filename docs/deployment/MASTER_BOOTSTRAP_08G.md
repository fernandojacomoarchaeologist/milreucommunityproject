---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08G"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Bootstrap do master

O pacote não define o e-mail.

## Condições

- a pessoa já iniciou sessão com Google;
- o e-mail corresponde ao utilizador no Supabase Auth;
- a execução ocorre fora do navegador;
- `service_role` está num terminal seguro ou CI protegido;
- a confirmação literal foi fornecida.

## Comando

```bash
MILREU_BOOTSTRAP_MASTER_CONFIRM=BOOTSTRAP_MILREU_MASTER npm run collab:bootstrap-master
```

Depois, consultar apenas a contagem de masters. Não incluir o e-mail em artefactos públicos.
