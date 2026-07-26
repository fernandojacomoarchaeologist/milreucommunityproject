---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08J"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Release — Pacote 08J v0.21.0

Fecha funcionalmente a Área Colaborativa, reforça a baseline de acessibilidade, introduz E2E em Chromium e produz uma release candidate técnica com gates externos e humanos preservados.

O pacote não configura Supabase, Google OAuth, master, domínio, e-mail, backup ou produção. Não aprova conteúdo, direitos, traduções ou acessibilidade humana por inferência.

## Evidência final

- 307/307 testes unitários e de contrato aprovados;
- 394/394 verificações E2E em Chromium aprovadas;
- 12/12 checks da baseline automática de acessibilidade aprovados;
- build e smoke HTTP aprovados;
- RC1 técnica local: `ready`;
- staging e produção: `blocked`, sem evidência externa ou humana suficiente.

O E2E levou à correção de problemas concretos de runtime, nomes acessíveis, landmarks, labels, reflow e wrapping, sem acrescentar módulos, permissões, migrations, tabelas ou Edge Functions.

