---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08H"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Contexto consolidado até ao Pacote 08H

A Área Colaborativa possui 19 módulos ativos no código.

## Comunicação

```text
Centro interno
→ funcional
```

```text
E-mail
→ preparado
→ desativado
→ sem fornecedor
→ sem agenda automática
```

## Eventos

Vinte eventos ligam memberships, tarefas, contributos, Museu, formação, agenda, exposições, retirada e homologação.

## Segurança

- outbox privada;
- deliveries privadas;
- worker com service role;
- segredo próprio;
- destinatários mascarados no painel;
- payload não exposto;
- templates em texto simples;
- HTML escapado;
- retry limitado;
- dead-letter;
- cleanup.

## Decisões em aberto

- fornecedor;
- domínio de envio;
- endereço remetente;
- política final de e-mail;
- frequência do worker;
- responsáveis operacionais;
- staging real.

Esses dados não foram inventados.

## Próximo fecho

O 08I deverá consolidar auditoria, retenção, backups, exportações administrativas, incidentes e manual operacional da Área Colaborativa.
