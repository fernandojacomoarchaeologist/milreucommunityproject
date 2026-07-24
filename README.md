---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08C"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Pacote 08C — Voluntariado e Tarefas

**Versão:** 0.14.0  
**Base cumulativa:** Pacote 08B.

O 08C transforma o módulo de tarefas num fluxo operacional para voluntários, investigadores, tradutores, revisores e coordenação.

## Funcionalidades

- demonstração com perfil de voluntário;
- disponibilidade semanal e modos preferidos;
- oportunidades abertas;
- tarefas próprias;
- adesão direta, candidatura ou convite;
- capacidade e competências requeridas;
- início, progresso, desistência e submissão;
- registo de tempo;
- validação da conclusão pela coordenação;
- criação, edição, publicação, atribuição, cancelamento e encerramento;
- histórico de atividade e auditoria.

## Rotas

```text
#/area-colaborativa/tarefas
#/area-colaborativa/tarefas/:taskId
#/area-colaborativa/disponibilidade
#/area-colaborativa/gestao/tarefas
#/area-colaborativa/gestao/tarefas/nova
#/area-colaborativa/gestao/tarefas/:taskId
#/area-colaborativa/gestao/tarefas/:taskId/editar
```

## Demonstração

```bash
npm install
npm run dev
```

Na entrada da Área Colaborativa estão disponíveis três simulações:

- pedido de acesso;
- voluntário ativo;
- master.

Os dados são fictícios, utilizam endereços `.invalid` e permanecem no `localStorage`.

## Ciclo da participação

```text
Tarefa aberta
→ adesão direta / candidatura / convite
→ aceite
→ em execução
→ submetida
→ validada
→ concluída
```

O registo de tempo fica `pending` até validação. Não é convertido automaticamente em pontuação, ranking ou certificado.

## Executar validações

```bash
npm run collab:config
npm run channels:export
npm run museum:index
npm run museum:audit
npm run validate
npm test
npm run build
npm run smoke
```

A execução real das migrations deve ocorrer primeiro em Supabase local ou staging.
