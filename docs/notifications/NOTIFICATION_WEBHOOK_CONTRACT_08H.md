---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08H"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Contrato do webhook

Requisição:

```json
{
  "from": {"name": "...", "email": "..."},
  "to": [{"email": "...", "name": "..."}],
  "subject": "...",
  "text": "...",
  "html": "...",
  "metadata": {
    "outboxId": "...",
    "eventType": "...",
    "attemptNumber": 1
  }
}
```

Resposta pode incluir:

```json
{"id": "provider-message-id"}
```

Qualquer resposta HTTP fora de 2xx gera retry ou dead-letter.
