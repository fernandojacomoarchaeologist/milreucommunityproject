---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08B"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Prompt de integração — Pacote 08B

Integra o 08B cumulativamente sobre o 08A.

## Objetivo

Ativar a gestão completa de membros e perfis sem avançar ainda para tarefas, calendário ou revisão editorial.

## Regras

1. Preservar Google OAuth, PKCE, RLS e separação entre perfil/função/permissão.
2. Não expor `service_role`.
3. Não hardcodar o e-mail do master.
4. Não permitir a remoção ou suspensão do último master ativo.
5. Não apresentar pré-autorização como e-mail enviado.
6. Não apagar membros; arquivar preservando histórico.
7. Aplicar migrations apenas em local/staging antes de produção.

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

## Revisão manual

- filtros e pesquisa;
- pedido pendente;
- aprovação com perfil e funções;
- recusa;
- suspensão e reativação;
- arquivo;
- proteção do último master;
- notas e histórico;
- criação e revogação de pré-autorização;
- login Google com e-mail previamente autorizado.

## Workflows

Substituir os workflows 08A pelos workflows 08B incluídos neste pacote para evitar CI duplicado.
