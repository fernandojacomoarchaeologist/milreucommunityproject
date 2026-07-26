---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08J"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Relatório de validação — Pacote 08J

## Resultado geral

- Versão: **0.21.0**
- Candidata: **RC1**
- Base cumulativa: **08I v0.20.0**
- Testes unitários e de contrato: **307/307 aprovados**
- Verificações E2E em Chromium: **394/394 aprovadas**
- Baseline automática de acessibilidade: **12/12 aprovada**
- Matriz de qualidade: **42 cenários**
  - 32 automáticos;
  - 6 humanos;
  - 4 externos.
- Validação cumulativa 01–08J: concluída
- Build: concluído
- Smoke HTTP: concluído
- Release candidate técnica local: **ready**
- Homologação de staging: **blocked**
- Aprovação de produção: **blocked**

## Escopo preservado

- Módulos colaborativos: **22 ativos**
- Módulos novos: **0**
- Permissões: **117 preservadas**
- Permissões novas: **0**
- Eventos de notificação: **25 preservados**
- Templates de notificação: **25 preservados**
- Checks operacionais: **20 preservados**
- Políticas de retenção: **7 preservadas**
- Migrations novas: **0**
- Tabelas novas: **0**
- Edge Functions novas: **0**
- Dependências npm novas: **0**

O 08J é um pacote de fecho transversal. Não cria uma nova área funcional nem altera decisões editoriais, de direitos, autenticação, retenção ou operação remota.

## Fecho funcional e regressão

Foram verificados no browser e por testes de contrato:

- Home e Portal público;
- Museu, galeria, memória individual e modo imersivo;
- entrada na Área Colaborativa;
- estado de membro pendente;
- perfil de voluntário;
- perfil master;
- fronteiras de autorização e negação de administração;
- navegação para a subrota da release candidate;
- ausência de erros JavaScript fatais;
- nomes acessíveis de botões, links e campos;
- landmarks, títulos e idioma do documento;
- reflow nos viewports de 375, 768 e 1280 px;
- skip link, foco e preferência por movimento reduzido.

## Correções resultantes do E2E

O ciclo E2E identificou e corrigiu problemas reais na base cumulativa:

- substituição de `String.casefold()` por `toLocaleLowerCase("pt-PT")`;
- nomes acessíveis nos links de media das coleções do Museu;
- inclusão de `main#main` e `h1` no modo imersivo;
- tratamento correto do honeypot oculto na auditoria automática;
- labels nos checks operacionais e no seletor de ambiente;
- correção do grid dos filtros da galeria para evitar overflow;
- wrapping seguro em cartões de relações longas;
- troca de persona E2E através do fluxo real de logout.

## Acessibilidade

Baseline programática:

- idioma do documento;
- viewport responsivo;
- skip link;
- landmark principal;
- live regions;
- navegação atual;
- foco visível;
- movimento reduzido;
- saída do modo imersivo;
- contenção da imagem imersiva;
- feedback de formulários;
- ausência de `service_role` no browser.

A baseline automática **não substitui** revisão humana. Permanecem pendentes:

- percurso integral por teclado;
- leitor de ecrã;
- contraste visual final;
- zoom a 200%;
- alvos táteis;
- mensagens de erro em contexto;
- revisão cognitiva e visual.

## E2E em Chromium

O runner executa a aplicação real no Chromium via CDP, sem novas dependências npm. Como o ambiente possui uma política empresarial que bloqueia origens locais e fictícias, o runtime E2E é montado integralmente em memória a partir dos módulos e fixtures do repositório.

Isto permite testar o frontend real sem:

- rede externa;
- credenciais;
- projeto Supabase;
- ficheiros locais expostos ao browser;
- escrita em staging ou produção.

Resultado: **394 verificações, 394 aprovadas, 0 falhadas**.

## Release candidate

A subrota criada é:

```text
#/area-colaborativa/gestao/homologacao/release-candidate
```

Ela reutiliza a permissão existente:

```text
homologation.view
```

Estado produzido:

```text
Release candidate técnica local: ready
Homologação de staging: blocked
Aprovação de produção: blocked
```

A RC técnica prova apenas a qualidade reproduzível do repositório. Não prova a operação remota.

## Bloqueios externos preservados

- projeto Supabase de staging;
- projeto Supabase de produção;
- URLs e project refs;
- Google OAuth configurado em ambiente protegido;
- `MILREU_MASTER_EMAIL` seguro;
- bootstrap real do master;
- migrations em PostgreSQL/Supabase real;
- Edge Functions em Deno/Supabase;
- RLS validada por perfil em ambiente real;
- fornecedor e evidência de backup;
- teste de restauração;
- domínio e contacto oficiais.

## Gates humanos preservados

- revisão visual humana;
- revisão integral por teclado;
- leitor de ecrã;
- revisão campo a campo das 31 memórias;
- aprovação de direitos e créditos;
- revisão humana das traduções;
- aprovação formal para publicação.

Nenhum recurso, credencial, contacto, aprovação ou evidência externa foi inventado.

## Comandos concluídos

- `npm run validate:08j`
- `npm run validate`
- `npm test`
- `npm run e2e:08j`
- `npm run build`
- `npm run smoke`
- `npm run rc:evaluate`

## Artefactos de evidência

- `reports/e2e-result.json`
- `reports/accessibility-result.json`
- `reports/ACCESSIBILITY_HUMAN_CHECKLIST_08J.md`
- `reports/RELEASE_CANDIDATE_08J.md`
- `public/data/release-candidate-readiness.json`
- `public/data/e2e-scenarios-08j.json`

## Conclusão

O Pacote 08J fecha a **release candidate técnica local RC1** da Área Colaborativa. A aplicação não deve ser apresentada como homologada em staging ou aprovada para produção enquanto os gates externos e humanos permanecerem sem evidência.
