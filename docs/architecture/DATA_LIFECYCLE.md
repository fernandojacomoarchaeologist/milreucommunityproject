---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "05F"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Ciclo de vida dos dados

```text
recolhido
→ registado
→ classificado
→ em revisão
→ aprovado
→ exportado
→ publicado
→ corrigido ou retirado
```

## Camadas

- `operational`: Supabase;
- `review`: Supabase com permissões;
- `public_snapshot`: Git;
- `presentation`: Portal, Museu e API pública;
- `archive`: backups e releases.

## Retirada

Retirar da apresentação pública não significa apagar a auditoria. O histórico deve preservar:

- motivo;
- responsável;
- data;
- versão;
- referência ao pedido.
