---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08D"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Prompt de integração — Pacote 08D

Integra cumulativamente o Pacote 08D sobre o 08C.

## Objetivo

Ativar agenda, locais, exposições e itinerância sem regressão do Portal, Museu, Proteus ou módulos colaborativos anteriores.

## Preservar

- autenticação Google e RLS;
- gestão de membros;
- voluntariado e tarefas;
- Portal e Museu;
- MM202617 em revisão;
- gates de publicação;
- separação entre dados públicos e internos.

## Integrar

1. Mesclar as três migrations 08D.
2. Preservar migrations anteriores.
3. Integrar:
   - modelo de exposições;
   - snapshot público;
   - controller;
   - rotas;
   - views;
   - estilos;
   - exportador;
   - workflows;
   - testes.
4. Executar:

```bash
npm ci
npm run collab:config
npm run exhibitions:export
npm run channels:export
npm run museum:index
npm run museum:audit
npm run validate
npm test
npm run build
npm run smoke
```

5. Executar o workflow ou os testes SQL em Supabase local.
6. Testar os perfis:
   - master;
   - coordenador;
   - voluntário;
   - observador;
   - utilizador pendente.

## Regras funcionais

- uma exposição é separada dos seus períodos;
- uma passagem por um local é um agendamento;
- a mesma exposição não pode ter períodos sobrepostos;
- conflito do mesmo local entre exposições diferentes gera aviso;
- só períodos confirmados, instalados, abertos ou encerrados podem ser publicados;
- tarefas logísticas são geradas em rascunho;
- RSVP não expõe a lista de participantes ao público;
- não inventar locais, datas, contactos ou horários.

## Segurança

- não usar `service_role` no browser ou no exportador;
- manter RLS;
- manter funções `security definer` com validação de projeto e permissão;
- preservar a separação entre contacto interno e público;
- não exportar notas internas, transporte ou relatórios de condição.

## Revisão manual

Testar:

- lista da agenda;
- calendário mensal;
- itinerância;
- RSVP;
- criação e edição de locais;
- criação e edição de exposições;
- agendamento;
- conflito bloqueante da mesma exposição;
- aviso do mesmo local;
- publicação e retirada;
- checklist;
- geração de tarefas;
- página pública vazia;
- página pública com snapshot de staging;
- desktop, tablet e telemóvel.

Não publicar automaticamente o projeto.
