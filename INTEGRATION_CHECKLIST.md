---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08A"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Checklist de integração

## Aplicação

- [ ] Portal e Museu sem regressão
- [ ] Link Área Colaborativa
- [ ] `/entrar`
- [ ] `/area-colaborativa`
- [ ] perfil
- [ ] tarefas
- [ ] contributos
- [ ] agenda
- [ ] biblioteca
- [ ] formação
- [ ] revisão do Museu
- [ ] gestão de perfis
- [ ] gestão de exposições

## Demonstração

- [ ] utilizador pendente
- [ ] cadastro com nome
- [ ] e-mail somente leitura
- [ ] escolha do perfil
- [ ] pedido pendente
- [ ] master de demonstração
- [ ] módulos condicionados
- [ ] logout

## Supabase

- [ ] migrations preservadas
- [ ] RLS
- [ ] funções RPC
- [ ] perfil criado após login
- [ ] vínculo pending
- [ ] aprovação de acesso
- [ ] atribuição de funções
- [ ] auditoria
- [ ] tabelas de tarefas
- [ ] tabelas de exposições

## Google

- [ ] projeto Google Cloud
- [ ] ecrã de consentimento
- [ ] cliente OAuth Web
- [ ] provider Google no Supabase
- [ ] callback local
- [ ] callback GitHub Pages
- [ ] callback domínio final
- [ ] teste PKCE

## Master

- [ ] login inicial efetuado
- [ ] e-mail real definido fora do Git
- [ ] service role apenas em ambiente administrativo
- [ ] bootstrap executado
- [ ] função master confirmada
- [ ] auditoria confirmada

## Qualidade

- [ ] `npm run collab:status`
- [ ] `npm run validate`
- [ ] `npm test`
- [ ] `npm run build`
- [ ] `npm run smoke`
