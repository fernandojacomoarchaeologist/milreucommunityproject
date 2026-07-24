---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08C"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Prompt de integração — Pacote 08C

Integra o 08C cumulativamente sobre o 08B.

## Preservar

- autenticação Google e callback PKCE;
- proteção do master;
- gestão de membros e pré-autorizações;
- Portal, Museu, modo imersivo e carrossel;
- MM202617 visível apenas para revisão;
- gates de publicação.

## Integrar

1. Mesclar o modelo de tarefas e os módulos ativos.
2. Integrar as novas rotas e views.
3. Integrar o controller 08C sem remover operações 08B.
4. Aplicar migrations somente em local ou staging.
5. Executar os testes SQL 08A, 08B e 08C.
6. Validar demonstração de voluntário e master.
7. Testar os três modos de atribuição:
   - adesão direta;
   - candidatura com aprovação;
   - convite direto.
8. Testar capacidade, desistência, submissão, validação e tempo.
9. Confirmar que tarefas em rascunho não aparecem para voluntários.
10. Confirmar que escritas diretas foram revogadas e passam por RPC auditada.

## Segurança

- disponibilidade própria é privada para o membro e para gestores de tarefas;
- horas são autodeclaradas e exigem validação;
- não criar ranking de voluntários;
- não enviar e-mails ou notificações fictícias;
- não expor `service_role`;
- não inventar tarefas, pessoas, datas ou locais em produção.

## Comandos

```bash
npm run collab:config
npm run channels:export
npm run museum:index
npm run museum:audit
npm run validate
npm test
npm run build
npm run smoke
```
