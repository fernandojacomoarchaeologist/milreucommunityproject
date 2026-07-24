---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08D"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Checklist de integração — 08D

## Não regressão

- [ ] Portal
- [ ] Museu
- [ ] modo imersivo
- [ ] carrossel da Home
- [ ] Experiência Proteus
- [ ] autenticação Google
- [ ] gestão de membros
- [ ] tarefas e voluntariado
- [ ] MM202617

## Agenda

- [ ] lista de próximas atividades
- [ ] calendário mensal
- [ ] itinerância
- [ ] mudança de mês
- [ ] RSVP interessado
- [ ] RSVP participante
- [ ] RSVP não participante
- [ ] capacidade e lista de espera
- [ ] privacidade dos participantes

## Locais

- [ ] criar
- [ ] editar
- [ ] rascunho
- [ ] ativo
- [ ] arquivado
- [ ] dados públicos
- [ ] contacto interno
- [ ] acessibilidade
- [ ] impedir ID de outro projeto

## Exposições

- [ ] criar
- [ ] editar
- [ ] tipo fixa
- [ ] tipo itinerante
- [ ] tipo temporária
- [ ] tipo digital
- [ ] estado
- [ ] resumo público
- [ ] objetivos internos

## Agendamentos

- [ ] associar exposição e local
- [ ] datas válidas
- [ ] montagem
- [ ] desmontagem
- [ ] bloquear sobreposição da mesma exposição
- [ ] avisar sobre ocupação simultânea do local
- [ ] estado da instalação
- [ ] estado da logística
- [ ] notas públicas
- [ ] notas internas
- [ ] publicar
- [ ] retirar da publicação

## Logística

- [ ] checklist
- [ ] prazo
- [ ] responsável
- [ ] concluir item
- [ ] bloquear item
- [ ] gerar tarefa de montagem
- [ ] gerar tarefa de desmontagem
- [ ] tarefas em rascunho
- [ ] ligação ao agendamento

## Público

- [ ] `#/exposicoes`
- [ ] empty state sem datas fictícias
- [ ] local atual
- [ ] próximos locais
- [ ] histórico
- [ ] atividades públicas
- [ ] sem notas internas
- [ ] sem contactos internos
- [ ] sem relatórios de condição

## Supabase

- [ ] migrations 08D
- [ ] RLS
- [ ] RPCs
- [ ] constraint de sobreposição
- [ ] bloqueio entre projetos
- [ ] lock de capacidade do RSVP
- [ ] teste SQL 08D
- [ ] staging
- [ ] rollback documentado

## Qualidade

- [ ] `npm run exhibitions:export`
- [ ] `npm run validate`
- [ ] `npm test`
- [ ] `npm run build`
- [ ] `npm run smoke`
- [ ] 1280 px
- [ ] 768 px
- [ ] 375 px
