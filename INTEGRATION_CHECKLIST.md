---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08J"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Checklist de integração — 08J

## Continuidade

- [x] base 08I v0.20.0 confirmada
- [x] ledger lido e preservado
- [x] dependências lidas e preservadas
- [x] superfícies lidas e preservadas
- [x] 22 módulos preservados
- [x] 117 permissões preservadas
- [x] nenhuma decisão editorial alterada

## Fecho funcional

- [x] rotas públicas
- [x] Museu
- [x] modo imersivo
- [x] entrada
- [x] membro pendente
- [x] voluntário
- [x] master
- [x] negação de administração
- [x] estados vazio, loading, erro e bloqueado representados na matriz
- [x] regressão da Home
- [x] regressão do Museu

## Acessibilidade

- [x] baseline automática
- [x] reflow a 375 px
- [x] reflow a 768 px
- [x] reflow a 1280 px
- [x] skip link
- [x] foco visível no contrato e no browser
- [ ] ordem integral de foco — revisão humana
- [x] labels
- [x] nomes de botões e links
- [x] movimento reduzido
- [ ] zoom a 200% — revisão humana
- [ ] leitor de ecrã — revisão humana
- [ ] contraste visual final — revisão humana
- [ ] revisão humana registada

## E2E

- [x] Chromium disponível
- [x] runtime integral em memória gerado
- [x] cenários públicos
- [x] cenários de voluntário
- [x] cenários master
- [x] erros de consola verificados
- [x] relatório JSON
- [x] falhas identificadas corrigidas e retestadas

## Release candidate

- [x] vista `release-candidate`
- [x] RC técnica avaliada
- [x] staging continua bloqueado sem evidência
- [x] produção continua bloqueada sem evidência
- [x] relatório gerado
- [x] sem secrets

## Ambientes externos

- [ ] Supabase staging
- [ ] Supabase produção
- [ ] Google OAuth
- [ ] master seguro
- [ ] migrations reais
- [ ] Edge Functions reais
- [ ] RLS por perfil em ambiente real
- [ ] backup real
- [ ] restauração testada

## Qualidade final

- [x] `npm run validate:08j`
- [x] `npm run validate`
- [x] `npm test`
- [x] `npm run e2e:08j`
- [x] `npm run build`
- [x] `npm run smoke`
- [x] `npm run rc:evaluate`
