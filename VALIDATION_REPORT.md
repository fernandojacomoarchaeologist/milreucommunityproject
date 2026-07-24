---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08D"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Relatório de validação — Pacote 08D

## Resultado

- Resultado geral: sucesso
- Versão: 0.15.0
- Testes automatizados: 118
- Testes aprovados: 118
- Testes falhados: 0
- ZIP ainda não gerado neste ponto do relatório
- Revisão visual humana em navegador: pendente

## Área Colaborativa

- Módulos totais: 14
- Módulos ativos: 10
- Permissões: 42
- Tipos de exposição: 4
- Tipos de local: 8
- Tipos de evento: 10
- Categorias logísticas: 8

## Agenda e itinerância

- Agenda em lista: validada
- Calendário mensal: validado estruturalmente
- Percurso da exposição: validado
- RSVP: validado
- Capacidade com bloqueio transacional: presente
- Gestão de locais: validada
- Gestão de exposições: validada
- Gestão de períodos: validada
- Sobreposição da mesma exposição: bloqueada
- Sobreposição do mesmo local: aviso
- Checklist logístico: validado
- Geração de tarefas de montagem/desmontagem: validada
- Proteções entre projetos: presentes

## Publicação

- Página pública: incluída
- Snapshot público no build: sim
- View pública no build: sim
- Snapshot atual: 0 atuais, 0 futuros, 0 passados e 0 eventos
- Dados reais inventados: não
- Chave administrativa no exportador: não
- Campos internos no snapshot: não
- Checksum do modelo: sim
- Checksum do snapshot público: sim

## Build cumulativo

- Callback Google no build: sim
- Páginas estáticas do Museu: 30
- JSONs individuais do Museu: 30
- Build removido do ZIP para evitar duplicação de imagens

## Banco de dados

- Migrations novas: 3
- Teste SQL 08D: presente
- Workflow cumulativo 08A–08D: presente
- Constraint `EXCLUDE`: presente
- RLS: presente
- RPC pública controlada: presente
- Execução PostgreSQL nesta geração: não

As migrations, políticas RLS, constraints e RPCs foram validadas estruturalmente, mas não executadas contra um PostgreSQL real neste ambiente. Não estavam disponíveis Supabase CLI, PostgreSQL ou Docker. O pacote inclui teste SQL e workflow próprios para execução durante a integração.

## Comandos

- `npm run collab:config`: sucesso
- `npm run collab:status`: sucesso
- `npm run exhibitions:export`: sucesso
- `npm run channels:export`: sucesso
- `npm run museum:index`: sucesso
- `npm run museum:audit`: sucesso
- `npm run validate`: sucesso
- `npm test`: sucesso
- `npm run build`: sucesso
- `npm run smoke`: sucesso
