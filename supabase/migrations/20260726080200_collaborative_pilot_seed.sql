-- © 2026 Fernando Rodrigues de Jácomo.
-- Produzido no âmbito do Projeto Comunitário de Milreu.
-- Pacote 08K — seed de permissões, módulo e atribuições do piloto.
--
-- Não semeia ciclos, participantes, cenários, datas nem resultados.
-- Apenas o catálogo de permissões, o módulo e a matriz por função.

insert into public.collab_permissions(code,name,description) values
  ('pilot.view','Ver piloto','Aceder à área de participação do piloto controlado.'),
  ('pilot.manage','Gerir piloto','Criar e gerir ciclos, cenários e operação do piloto.'),
  ('pilot.participants.manage','Gerir coorte','Inscrever, remover e acompanhar participantes.'),
  ('pilot.sessions.manage','Gerir sessões','Agendar e concluir sessões acompanhadas.'),
  ('pilot.feedback.submit','Submeter feedback','Registar observações e feedback próprios do piloto.'),
  ('pilot.feedback.manage','Gerir feedback','Triar observações e ligar a tarefas ou incidentes.'),
  ('pilot.evidence.manage','Gerir evidências','Registar e rever evidências privadas do piloto.'),
  ('pilot.metrics.view','Ver métricas','Consultar métricas internas do piloto.'),
  ('pilot.gates.evaluate','Avaliar gates','Registar resultados de gates de piloto e homologação.'),
  ('pilot.approve','Aprovar homologação','Aprovar a homologação de staging com confirmação literal.')
on conflict (code) do nothing;

insert into public.collab_modules(
  code,name,route,description,status,required_permission,sort_order
) values (
  'pilot',
  'Piloto e homologação operacional',
  '/area-colaborativa/piloto',
  'Participação, sessões, feedback, evidências e gates do piloto controlado em staging.',
  'active',
  'pilot.view',
  104
)
on conflict (code) do update
  set name=excluded.name,
      route=excluded.route,
      description=excluded.description,
      status=excluded.status,
      required_permission=excluded.required_permission,
      sort_order=excluded.sort_order;

-- Master: todas as permissões do piloto (inclui pilot.approve).
insert into public.collab_role_permissions(role_code,permission_code)
select 'master', code
from public.collab_permissions
where code like 'pilot.%'
on conflict do nothing;

-- Coordenação: todas exceto a aprovação final.
insert into public.collab_role_permissions(role_code,permission_code)
select 'coordinator', code
from public.collab_permissions
where code like 'pilot.%' and code <> 'pilot.approve'
on conflict do nothing;

-- Restantes perfis: ver e submeter feedback (visibilidade real depende de inscrição + RLS).
insert into public.collab_role_permissions(role_code,permission_code) values
  ('volunteer','pilot.view'),
  ('volunteer','pilot.feedback.submit'),
  ('reviewer','pilot.view'),
  ('reviewer','pilot.feedback.submit'),
  ('researcher','pilot.view'),
  ('researcher','pilot.feedback.submit'),
  ('translator','pilot.view'),
  ('translator','pilot.feedback.submit'),
  ('partner','pilot.view'),
  ('partner','pilot.feedback.submit'),
  ('observer','pilot.view'),
  ('observer','pilot.feedback.submit')
on conflict do nothing;
