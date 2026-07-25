---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08H"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Protocolo de recuperação de contexto

## Quando interromper e pedir contexto

Interromper a implementação quando houver risco elevado de:

- redefinir a identidade do projeto;
- contradizer uma decisão anterior;
- inventar conteúdo editorial;
- substituir um fluxo já integrado;
- alterar direitos, créditos ou autorizações;
- publicar uma memória sem aprovação;
- perder decisões da Área Colaborativa;
- alterar a Home sem conhecer os slots e integrações atuais.

## Conjunto mínimo necessário

Para retomar com segurança, solicitar ou localizar:

1. o ZIP do pacote cumulativo mais recente;
2. `PROJECT_CONTEXT_LEDGER.md`;
3. `PACKAGE_DEPENDENCY_MAP.md`;
4. `CHANGE_SURFACE_REGISTRY.md`;
5. `public/data/package-impact-registry.json`;
6. `VALIDATION_REPORT.md`;
7. a mensagem de integração do Claude/GitHub com PRs e problemas;
8. ficheiros ou imagens novos explicitamente citados pelo utilizador.

## Informação adicional conforme o risco

### Museu

- `memories.json`;
- `museum-editorial-approved.json`;
- imagens e direitos;
- decisão específica sobre MM202617.

### Página principal

- `portal.js`;
- `museum.js`;
- `public-content-effects.json`;
- `home-carousel.json`.

### Supabase

- migrations mais recentes;
- políticas RLS;
- funções RPC;
- resultados do workflow local/staging.

### Conteúdo

- texto-fonte;
- fontes;
- grau de certeza;
- crédito;
- autorização;
- língua e estado da tradução.

## Resposta ao utilizador

Quando faltar uma destas bases, indicar claramente:

- qual decisão está em risco;
- qual ficheiro ou confirmação é necessário;
- o que pode continuar sem risco;
- o que ficará bloqueado.

Não preencher lacunas com inferências convincentes.

### Notificações

Localizar:

- `collaborative-notification-model.json`;
- `collaborative-notification-templates.json`;
- `notifications.runtime.json`;
- migrations 08H;
- Edge Function;
- relatório de outbox;
- decisão sobre fornecedor e domínio.

Nunca inferir que o canal de e-mail está ativo.
