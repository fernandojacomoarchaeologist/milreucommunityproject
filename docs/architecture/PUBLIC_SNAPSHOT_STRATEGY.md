---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "05F"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Estratégia de snapshots públicos

## Objetivo

Publicar dados aprovados de forma:

- estável;
- versionada;
- auditável;
- disponível sem depender do banco em tempo real.

## Processo

```text
Supabase
→ query aprovada
→ normalização
→ validação por schema
→ manifest
→ commit/release
→ GitHub Pages
```

## Regras

- snapshots são gerados;
- não são editados manualmente;
- contêm apenas campos públicos;
- incluem versão, data e checksum;
- nunca incluem secrets, consentimentos ou dados pessoais internos.
