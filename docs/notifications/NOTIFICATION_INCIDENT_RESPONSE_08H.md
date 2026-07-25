---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08H"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Incidentes

Incidentes possíveis:

- destinatário errado;
- template incorreto;
- loop de notificações;
- webhook comprometido;
- excesso de retry;
- exposição em log;
- canal ativo sem autorização.

Ação imediata:

- pausar canal;
- rodar secrets;
- cancelar outbox;
- preservar evidência mínima;
- informar coordenação;
- corrigir por migration ou release;
- testar em staging.
