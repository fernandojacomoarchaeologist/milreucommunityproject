---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08D"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Plano de rollback — Pacote 08D

O rollback não deve ser executado automaticamente em produção.

## Antes da migration

- criar backup;
- guardar o estado das migrations;
- confirmar que o ambiente é local ou staging;
- executar os testes cumulativos.

## Rollback funcional

Quando a aplicação precisar regressar ao 08C sem eliminar dados:

1. desativar os módulos `agenda`, `venue-management` e `exhibition-management`;
2. retirar a rota pública de exposições;
3. deixar de executar `exhibitions:export`;
4. manter as tabelas e dados para análise;
5. reverter o código para a release 08C.

Essa é a opção preferencial.

## Rollback estrutural

A remoção das tabelas e colunas é destrutiva. Somente depois de exportar os dados:

1. revogar execução das RPCs 08D;
2. remover políticas 08D;
3. remover tabelas:
   - `collab_exhibition_logistics_checklist`;
   - `collab_event_participants`;
   - `collab_agenda_events`;
4. remover a constraint de sobreposição;
5. remover os campos adicionados a locais, exposições, períodos e tarefas;
6. remover as permissões e o módulo de locais;
7. remover a extensão `btree_gist` apenas quando nenhum outro objeto depender dela.

## Dados públicos

Antes de recuar:

- substituir `exhibitions-public.json` por um snapshot vazio;
- executar build e smoke;
- confirmar que nenhum local ou evento continua publicado.

## Critério

Preferir sempre rollback funcional. A remoção estrutural exige autorização explícita, backup verificado e execução manual.
