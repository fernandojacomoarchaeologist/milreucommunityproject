---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "05F"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Gates de release

## Gate Infra

- CI verde;
- migrations testadas;
- schemas válidos;
- ausência de segredos;
- fonte privada desacoplada.

## Gate Produção

- ticket;
- impacto;
- rollback;
- backup quando aplicável;
- workflow manual;
- required reviewer;
- confirmação literal.

## Gate Público

- estado editorial aprovado;
- direitos compatíveis;
- tradução conforme política;
- snapshot validado;
- proveniência presente.

## Gate A visual

Necessário antes do Pacote 06:

- identidade validada para arquitetura;
- logótipo claro/escuro revisto;
- cores e tipografia revistas;
- navegação responsiva revista;
- componentes críticos revistos.

O estado permitido é `validated-for-architecture`, não `approved`.
