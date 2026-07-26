-- © 2026 Fernando Rodrigues de Jácomo.
-- Produzido no âmbito do Projeto Comunitário de Milreu.
-- Pacote 08L — seed de permissões, módulo e atribuições.
--
-- Não semeia propostas ativas, snapshots, programas reais nem resultados.
-- Apenas o catálogo de permissões, o módulo e a matriz por função.

insert into public.collab_permissions(code,name,description) values
  ('participation.view','Ver participação','Aceder aos percursos de participação contínua.'),
  ('participation.manage','Gerir participação','Criar e gerir programas, passos e inscrições.'),
  ('participation.enrol','Inscrever-se','Criar a própria inscrição num programa quando permitido.'),
  ('participation.progress.update','Atualizar progresso','Registar progresso próprio permitido.'),
  ('public-integration.view','Ver integração pública','Consultar propostas, snapshots e ativações.'),
  ('public-integration.propose','Propor efeito público','Criar propostas de publicação por slot.'),
  ('public-integration.review','Rever efeito público','Registar decisões de revisão editorial, direitos, privacidade e acessibilidade.'),
  ('public-integration.preview','Pré-visualizar','Gerar snapshots de pré-visualização.'),
  ('public-integration.activate','Ativar efeito público','Ativar, suspender ou expirar um snapshot público.'),
  ('public-integration.rollback','Reverter efeito público','Reverter um efeito público ativo.'),
  ('evolution.view','Ver evolução','Consultar propostas e decisões de evolução.'),
  ('evolution.manage','Gerir evolução','Criar e gerir propostas de evolução.'),
  ('evolution.decide','Decidir evolução','Aprovar, recusar ou adiar propostas de evolução.')
on conflict (code) do nothing;

insert into public.collab_modules(
  code,name,route,description,status,required_permission,sort_order
) values (
  'continuous-participation',
  'Participação contínua',
  '/area-colaborativa/participacao',
  'Percursos, próximos passos e continuidade da participação.',
  'active',
  'participation.view',
  105
)
on conflict (code) do update
  set name=excluded.name, route=excluded.route, description=excluded.description,
      status=excluded.status, required_permission=excluded.required_permission, sort_order=excluded.sort_order;

-- Master: todas as permissões novas.
insert into public.collab_role_permissions(role_code,permission_code)
select 'master', code from public.collab_permissions
where code like 'participation.%' or code like 'public-integration.%' or code like 'evolution.%'
on conflict do nothing;

-- Coordenação: todas exceto ativação/rollback público e decisão de evolução (protegidas ao master).
insert into public.collab_role_permissions(role_code,permission_code)
select 'coordinator', code from public.collab_permissions
where (code like 'participation.%' or code like 'public-integration.%' or code like 'evolution.%')
  and code not in ('public-integration.activate','public-integration.rollback','evolution.decide')
on conflict do nothing;

-- Restantes perfis: ver, inscrever-se e atualizar o próprio progresso.
insert into public.collab_role_permissions(role_code,permission_code) values
  ('volunteer','participation.view'),('volunteer','participation.enrol'),('volunteer','participation.progress.update'),
  ('reviewer','participation.view'),('reviewer','participation.enrol'),('reviewer','participation.progress.update'),
  ('researcher','participation.view'),('researcher','participation.enrol'),('researcher','participation.progress.update'),
  ('translator','participation.view'),('translator','participation.enrol'),('translator','participation.progress.update'),
  ('partner','participation.view'),('partner','participation.enrol'),('partner','participation.progress.update'),
  ('observer','participation.view'),('observer','participation.enrol'),('observer','participation.progress.update')
on conflict do nothing;
