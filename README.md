---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08J"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Pacote 08J — Fecho funcional, acessibilidade, E2E e release candidate

**Versão:** 0.21.0  
**Base cumulativa:** Pacote 08I v0.20.0.

O 08J fecha transversalmente a Área Colaborativa sem criar uma nova grande frente funcional. Preserva os 22 módulos, as 117 permissões e todos os gates editoriais, operacionais e de segurança.

## Resultado central

O pacote distingue três estados que nunca devem ser tratados como equivalentes:

```text
Release candidate técnica local
→ pode ficar pronta com código, validações, testes, build e E2E local

Homologação de staging
→ depende de Supabase, OAuth, migrations, RLS, storage, Edge Functions e perfis reais

Aprovação de produção
→ depende também de decisões editoriais, direitos, traduções, acessibilidade humana, backup e restauração
```

A rota de consulta é:

```text
#/area-colaborativa/gestao/homologacao/release-candidate
```

Ela utiliza a permissão já existente `homologation.view`; nenhum módulo ou poder novo foi criado.

Evidência final da RC1:

- 307/307 testes unitários e de contrato;
- 394/394 verificações E2E em Chromium;
- 12/12 checks da baseline automática de acessibilidade;
- build e smoke HTTP aprovados;
- staging e produção corretamente bloqueados.

## Fecho funcional

- matriz de jornadas por perfil;
- rotas públicas, Museu e Área Colaborativa;
- estados anónimo, pendente, voluntário e master;
- negação segura de módulos administrativos;
- regressão do Portal e do Museu;
- verificação de loading, vazio, erro e bloqueio;
- preservação das fronteiras de publicação, retenção, notificações e produção.

## Acessibilidade

Alvo: **WCAG 2.2 AA**.

Inclui:

- baseline automática de código e DOM;
- skip link, landmarks, nomes acessíveis, labels e IDs;
- foco visível e navegação por teclado;
- movimento reduzido;
- reflow nos viewports 375, 768 e 1280 px;
- checklist humano para leitor de ecrã, contraste, zoom, ordem de foco, alvos e mensagens de erro.

A automação não aprova a acessibilidade final.

## E2E em navegador real

O runner utiliza Chromium por Chrome DevTools Protocol, sem dependências npm externas.

Abrange:

- Home e Museu nos três viewports;
- detalhe e modo imersivo;
- participação e contributos públicos;
- entrada e onboarding pendente;
- jornadas de voluntário;
- negação de administração ao voluntário;
- jornadas master e governação;
- vista da release candidate;
- erros JavaScript e consola;
- acessibilidade dinâmica básica.

O caminho do Chromium pode ser definido por `MILREU_CHROMIUM_PATH`.

## Comandos

```bash
npm ci
npm run validate:08j
npm test
npm run e2e:08j
npm run build
npm run smoke
npm run rc:evaluate
```

Execução cumulativa:

```bash
npm run rc
```

## Gates que permanecem bloqueados

- projetos Supabase de staging e produção;
- Google OAuth;
- `MILREU_MASTER_EMAIL` em ambiente protegido;
- migrations 08A–08I em PostgreSQL/Supabase real;
- Edge Functions em Deno/Supabase;
- backup e teste de restauração;
- revisão visual humana;
- teclado e leitor de ecrã por pessoa competente;
- revisão das 31 memórias;
- direitos, créditos e traduções;
- domínio e contacto oficial;
- aprovação literal de produção.

Nenhum segredo deve ser colocado no chat ou dentro deste ZIP.
