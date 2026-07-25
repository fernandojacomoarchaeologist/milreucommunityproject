---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08F"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Prompt de integração — Pacote 08F

Integra cumulativamente o 08F sobre o 08E.

## Prioridade

Preservar o contexto acumulado. Antes de alterar rotas públicas, Museu, Home, Supabase ou módulos colaborativos, ler:

- `PROJECT_CONTEXT_LEDGER.md`;
- `PACKAGE_DEPENDENCY_MAP.md`;
- `CHANGE_SURFACE_REGISTRY.md`;
- `CONTEXT_RECOVERY_PROTOCOL.md`.

## Integrar

1. migrations 08F;
2. modelos de revisão, formação e biblioteca;
3. controller;
4. views e rotas;
5. slots públicos;
6. scripts de exportação e aplicação;
7. testes e workflows;
8. documentação de contexto.

## Regras

- 31 memórias, não 30;
- MM202617 visível para revisão com divulgação de IA;
- nenhum registo aprovado por inferência;
- proposta por campo;
- bloqueios resolvidos antes da aprovação;
- formação exigida;
- editorial antes de direitos;
- direitos antes de publicação;
- snapshot aprovado antes da aplicação;
- aplicação local antes de PR;
- efeitos públicos apenas por slots;
- não usar `service_role` no browser;
- não inventar traduções, fontes, direitos ou conteúdo.

## Validação

```bash
npm ci
npm run collab:config
npm run museum:review-export
npm run museum:review-apply
npm run contributions:demo-export
npm run exhibitions:export
npm run channels:export
npm run museum:index
npm run museum:audit
npm run validate
npm test
npm run build
npm run smoke
```

Executar migrations e testes SQL em Supabase local.

## Revisão manual

- biblioteca;
- cinco trilhas;
- progresso e avaliação;
- fila das 31 memórias;
- detalhe;
- proposta textual;
- proposta JSON;
- comentário bloqueante;
- resolução;
- checks;
- sequência de aprovações;
- preview;
- contribuição aceite;
- snapshot;
- efeito público;
- desktop, tablet e telemóvel.

Não aplicar um snapshot real durante a integração.
