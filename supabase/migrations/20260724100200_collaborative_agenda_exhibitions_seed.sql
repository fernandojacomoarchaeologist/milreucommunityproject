-- © 2026 Fernando Rodrigues de Jácomo.
-- Produzido no âmbito do Projeto Comunitário de Milreu.
-- Permissões e módulos do Pacote 08D.

insert into public.collab_permissions(code,name,description) values
('agenda.rsvp','Confirmar participação','Confirmar interesse ou participação em eventos.'),
('agenda.manage','Gerir agenda','Criar, editar e cancelar eventos internos ou públicos.'),
('venues.manage','Gerir locais','Criar, editar e arquivar locais.'),
('exhibitions.view-internal','Consultar exposições internas','Consultar planeamento, logística e notas internas.'),
('exhibitions.publish','Publicar itinerância','Publicar ou retirar períodos da agenda pública.'),
('exhibitions.logistics','Gerir logística de exposições','Gerir checklist, montagem, desmontagem e tarefas logísticas.'),
('exhibitions.audit.view','Consultar auditoria de exposições','Consultar decisões e alterações relacionadas com exposições.')
on conflict(code) do update
set name=excluded.name,description=excluded.description;

insert into public.collab_role_permissions(role_code,permission_code)
select 'master',code
from public.collab_permissions
where code in (
  'agenda.rsvp','agenda.manage','venues.manage','exhibitions.view-internal',
  'exhibitions.publish','exhibitions.logistics','exhibitions.audit.view'
)
on conflict do nothing;

insert into public.collab_role_permissions(role_code,permission_code) values
('coordinator','agenda.rsvp'),
('coordinator','agenda.manage'),
('coordinator','venues.manage'),
('coordinator','exhibitions.view-internal'),
('coordinator','exhibitions.publish'),
('coordinator','exhibitions.logistics'),
('coordinator','exhibitions.audit.view'),

('volunteer','agenda.rsvp'),
('reviewer','agenda.rsvp'),
('researcher','agenda.rsvp'),
('translator','agenda.rsvp'),
('partner','agenda.rsvp'),
('observer','agenda.rsvp')
on conflict do nothing;

update public.collab_modules
set status='active',
    description='Calendário de atividades, confirmações de participação e percurso da exposição física itinerante.'
where code='agenda';

update public.collab_modules
set status='active',
    description='Exposições, locais, itinerância, publicação, logística e verificação de conflitos.'
where code='exhibition-management';

insert into public.collab_modules(
  code,name,route,description,status,required_permission,sort_order
) values (
  'venue-management',
  'Gestão de locais',
  '/area-colaborativa/gestao/locais',
  'Gerir museus, escolas, bibliotecas e outros locais que podem receber atividades e exposições.',
  'active',
  'venues.manage',
  98
)
on conflict(code) do update set
  name=excluded.name,
  route=excluded.route,
  description=excluded.description,
  status=excluded.status,
  required_permission=excluded.required_permission,
  sort_order=excluded.sort_order;
