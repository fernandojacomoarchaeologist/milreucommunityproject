---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08H"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Arquitetura de notificações

```text
evento de domínio
→ trigger
→ preferência
→ centro interno
→ outbox opcional
→ worker
→ webhook
→ delivery
```

## Fronteiras

- o centro interno é funcional sem e-mail;
- o navegador lê apenas as próprias notificações;
- outbox e deliveries são privadas;
- o worker utiliza service role;
- o webhook utiliza secret próprio;
- o fornecedor é substituível;
- convites são enfileirados explicitamente.
