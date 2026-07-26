---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08K"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Rotas, vistas e permissões

## Módulo novo

```json
{
  "code": "pilot",
  "name": "Piloto e homologação operacional",
  "route": "/area-colaborativa/piloto",
  "status": "active",
  "permission": "pilot.view",
  "description": "Participação, sessões, feedback, evidências e gates do piloto controlado.",
  "sortOrder": 104
}
```

Não criar um segundo módulo no menu. A gestão utiliza uma subrota e ações condicionadas por permissão.

## Rotas

### `/area-colaborativa/piloto`

Para participantes inscritos:

- estado da participação;
- notice e confirmação;
- próximos cenários e sessões;
- instruções;
- conclusão;
- submissão de feedback;
- histórico próprio;
- canal de suporte;
- opção de retirada do piloto.

Para coordenação/master, pode incluir resumo da operação e ligação à gestão.

### `/area-colaborativa/gestao/piloto`

Para coordenação/master:

- dashboard do ciclo;
- readiness de staging;
- coorte;
- cenários;
- sessões;
- observações;
- evidências;
- métricas;
- gates;
- relatório de encerramento.

### Integrações em rotas existentes

- `/area-colaborativa/gestao/homologacao`: apresentar o ciclo e a evidência do 08K;
- `/area-colaborativa/gestao/incidentes`: permitir ligação a observações;
- `/area-colaborativa/gestao/tarefas`: permitir ligação a correções;
- `/area-colaborativa/notificacoes`: eventos do piloto;
- `/area-colaborativa/gestao/auditoria`: eventos e export redigido.

## Permissões novas

1. `pilot.view`
2. `pilot.manage`
3. `pilot.participants.manage`
4. `pilot.sessions.manage`
5. `pilot.feedback.submit`
6. `pilot.feedback.manage`
7. `pilot.evidence.manage`
8. `pilot.metrics.view`
9. `pilot.gates.evaluate`
10. `pilot.approve`

Total esperado após integração: **127 permissões**, salvo conflito real identificado durante integração.

## Matriz por função

### `master`

- todas as permissões;
- único perfil que pode executar `pilot.approve`.

### `coordinator`

- todas as permissões do piloto, exceto `pilot.approve`.

### `volunteer`, `reviewer`, `researcher`, `translator`, `partner`, `observer`

- `pilot.view`;
- `pilot.feedback.submit`.

A visibilidade real depende de inscrição na coorte e RLS.

### membro pendente ou anónimo

- nenhuma permissão do piloto.

## UI obrigatória

- estados com texto, não apenas cor;
- feedback de formulários com `aria-live`;
- navegação por teclado;
- foco após ações;
- tabelas adaptáveis ou cartões em 375 px;
- nenhuma exposição de e-mail da coorte a participantes;
- evidências com classificação e aviso de sensibilidade;
- ações destrutivas com confirmação;
- bloqueadores e ausências de configuração visíveis;
- nunca exibir secret, token ou project ref sensível.
