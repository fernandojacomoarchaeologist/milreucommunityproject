---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08J"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Prompt de integração — Pacote 08J

Integra cumulativamente o 08J sobre o 08I v0.20.0.

## Ler primeiro

- `PROJECT_CONTEXT_LEDGER.md`;
- `PACKAGE_DEPENDENCY_MAP.md`;
- `CHANGE_SURFACE_REGISTRY.md`;
- `CONTEXT_RECOVERY_PROTOCOL.md`;
- `docs/quality/FUNCTIONAL_CLOSURE_08J.md`;
- `docs/quality/ACCESSIBILITY_08J.md`;
- `docs/quality/E2E_08J.md`;
- `docs/quality/RELEASE_CANDIDATE_08J.md`;
- `VALIDATION_REPORT.md`.

## Objetivo

Produzir uma release candidate técnica reproduzível, sem transformar ausência de infraestrutura, credenciais ou decisão humana em aprovação fictícia.

## Integrar

1. modelos de RC, acessibilidade e cenários;
2. carregamento dos novos contratos no controller;
3. subrota e vista da release candidate;
4. navegação dentro da homologação existente;
5. scripts de acessibilidade;
6. runner E2E Chromium/CDP;
7. avaliação e relatório da RC;
8. testes unitários e de contrato;
9. workflow CI 08J;
10. documentação, ledger e registo de impactos.

## Regras obrigatórias

- preservar 22 módulos e 117 permissões;
- não criar migration, tabela ou Edge Function sem necessidade;
- não ativar e-mail, fornecedor, convites automáticos ou chat;
- não alterar conteúdo canónico do Museu;
- não aprovar MM202617;
- não publicar tradução automática;
- não inserir URL, project ref, client secret ou e-mail master fictícios;
- não declarar migrations ou Edge Functions executadas sem ambiente real;
- não declarar backup ou restauração sem evidência;
- não declarar revisão visual, teclado ou leitor de ecrã concluídos sem execução humana;
- não declarar staging homologado com base em E2E local;
- não declarar produção aprovada com base na RC técnica.

## Validação

```bash
npm ci
npm run validate:08j
npm test
npm run e2e:08j
npm run build
npm run smoke
npm run rc:evaluate
```

O `rc:evaluate` pode aprovar apenas `technicalCandidate`. `stagingHomologation` e `productionApproval` devem continuar bloqueados até evidência real.

## Revisão manual

- 375, 768 e 1280 px;
- teclado integral;
- leitor de ecrã;
- zoom a 200%;
- contraste e alvos;
- mensagens de erro;
- todos os perfis;
- 31 memórias;
- direitos, créditos e traduções;
- Supabase staging;
- OAuth e RLS;
- backup e restauração.

Nunca pedir que segredos sejam colados no chat.
