---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "09C.1"
---

# Prompt de integração — 09C.1

Integra o Pacote 09C.1 apenas sobre o `main` que contenha, nesta ordem, o 09C (#39) e o 09D (#40). Lê todos os ficheiros do pacote antes de alterar código.

## Preflight bloqueante

1. confirma branch, commit, versão, working tree, PRs e CI;
2. comprova #39 e #40 no histórico e a ordem de merge;
3. lê ledger, dependency map, change surface registry e recovery protocol;
4. inventaria domínio de oportunidades, RLS, RPCs, rotas, interfaces, permissões e testes;
5. inventaria a fundação i18n realmente criada pelo 09D;
6. verifica o estado atual da Formação;
7. se a base não cumprir as precondições, para e relata; não simules a integração.

## Objetivo

Fechar e comprovar pela interface:

```text
master cria rascunho → pré-visualiza → publica
→ visitante consulta → login → perfil mínimo → candidatura
→ master decide → participante consulta resultado
```

Inclui retirada, encerramento, cancelamento, remoção, capacidade, duplicidade, privacidade entre candidatos e bloqueio de menores.

## Compatibilidade obrigatória

- preserva integralmente o 09D;
- usa o sistema i18n existente e `pt-PT` como fonte canónica;
- EN/ES/FR permanecem `missing`, `draft` ou `in-review` enquanto não revistos;
- não publiques tradução automática, não faças fallback silencioso e não cries modelo paralelo;
- não alteres dados operacionais por tradução.

## Formação

Verifica primeiro. Se persistirem percursos não aprovados ou dados demonstrativos, mantém apenas “Fundamentos do Projeto”, remove a exposição de notas/progressos fictícios e preserva qualquer dado potencialmente real até esclarecer a origem.

## Limites

Zero novos módulos, permissões e migrations. Se houver bloqueio técnico real, documenta-o antes da implementação, apresenta a menor alternativa e não ultrapasses o limite sem autorização. Não ativar produção, Proteus, SEO, pagamentos, OAuth social, e-mail transacional, lista de espera ou política de menores.

## Testes e evidências

Executa contratos, unitários, integração, build, Playwright, acessibilidade e RLS/Postgres. O E2E deve atravessar UI e backend real do ambiente de teste com dados sintéticos e cleanup seguro. Testes diretos de RPC complementam, mas não substituem a jornada. Produz a matriz de evidências, capturas atuais desktop/mobile e distinção entre local, staging, mock e produção.

## Entrega

Abre PR sem merge automático. Relata commit base, ficheiros, diff de módulos/permissões/migrations, rotas, estados, perfil, ações do master, RLS, i18n, Formação, testes, evidências, limitações e bloqueadores humanos. Não declares a jornada homologada sem evidência de todas as etapas.
