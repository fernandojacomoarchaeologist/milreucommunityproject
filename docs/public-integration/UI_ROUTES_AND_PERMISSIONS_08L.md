---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08L"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Rotas, vistas e permissões

## Novo módulo interno

```json
{
  "code": "continuous-participation",
  "name": "Participação contínua",
  "route": "/area-colaborativa/participacao",
  "status": "active",
  "permission": "participation.view",
  "description": "Percursos, próximos passos e continuidade da participação.",
  "sortOrder": 105
}
```

## Rotas

### Pública

- `/participar`

### Área Colaborativa

- `/area-colaborativa/participacao`
- `/area-colaborativa/gestao/integracao-publica`

A gestão de evolução orientada pelo piloto pode ser uma secção da segunda rota e integrar-se com `/area-colaborativa/gestao/piloto`.

## Permissões novas

1. `participation.view`
2. `participation.manage`
3. `participation.enrol`
4. `participation.progress.update`
5. `public-integration.view`
6. `public-integration.propose`
7. `public-integration.review`
8. `public-integration.preview`
9. `public-integration.activate`
10. `public-integration.rollback`
11. `evolution.view`
12. `evolution.manage`
13. `evolution.decide`

## Funções

### `master`

Todas as permissões.

### `coordinator`

Todas, exceto:

- `public-integration.activate`;
- `public-integration.rollback`;

salvo decisão anterior do modelo real de funções. Não expandir autoridade por inferência.

### Perfis especializados

- revisor: revisão editorial quando já autorizada;
- tradutor: revisão linguística atribuída;
- investigador: consulta de evolução autorizada;
- parceiro: participação e consulta conforme vínculo;
- voluntário: participação, inscrição e progresso próprios;
- observador: apenas leitura autorizada.

RLS e atribuição continuam necessárias.

## Vistas

### `/participar`

- apresentação das formas de participação;
- percursos públicos;
- agenda e oportunidades públicas referenciadas;
- contribuir;
- pedir acesso;
- direitos, privacidade e retirada;
- nenhuma promessa de aprovação.

### `/area-colaborativa/participacao`

- percursos elegíveis;
- inscrições;
- próximos passos;
- bloqueios;
- progresso;
- notificações;
- pausa e retirada.

### Gestão

- programas e passos;
- propostas públicas;
- checklist multidimensional;
- preview;
- snapshots;
- ativações;
- rollback;
- achados e propostas de evolução;
- decisões;
- ligações a tarefas, incidentes e releases.

## Acessibilidade

- estados com texto;
- foco preservado;
- `aria-live`;
- tabelas adaptáveis;
- sequência lógica de passos;
- ações protegidas com confirmação;
- nenhum botão de publicação disponível quando gate falha;
- preview distinguível da produção.
