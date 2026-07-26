-- © 2026 Fernando Rodrigues de Jácomo.
-- Produzido no âmbito do Projeto Comunitário de Milreu.
-- Pacote 08M — seed de permissões, módulo e atribuições.
--
-- operations.view/manage e continuity.manage já existem (08I); apenas as
-- 9 permissões genuinamente novas são inseridas. Não semeia ciclos,
-- responsáveis, indicadores nem snapshots reais.

insert into public.collab_permissions(code,name,description) values
  ('responsibilities.manage','Gerir responsabilidades','Definir responsáveis operacionais, substitutos e risco de pessoa única.'),
  ('support.submit','Submeter suporte','Abrir pedidos de suporte próprios.'),
  ('support.manage','Gerir suporte','Triar e resolver pedidos de suporte.'),
  ('moderation.manage','Gerir moderação','Tratar casos de moderação e recursos.'),
  ('content-review.manage','Gerir revisão de conteúdo','Agendar e concluir revisões periódicas de conteúdo.'),
  ('governance.view','Ver governação','Consultar decisões de governação.'),
  ('governance.manage','Gerir governação','Preparar decisões, opções e consulta.'),
  ('governance.decide','Decidir governação','Registar a decisão final de governação.'),
  ('impact.manage','Gerir indicadores','Definir indicadores, snapshots e publicação de transparência.')
on conflict (code) do nothing;

insert into public.collab_modules(
  code,name,route,description,status,required_permission,sort_order
) values (
  'operations-governance',
  'Operação e governação',
  '/area-colaborativa/gestao/operacao',
  'Ciclos operacionais, suporte, moderação, governação, indicadores e continuidade.',
  'active',
  'operations.view',
  106
)
on conflict (code) do update
  set name=excluded.name, route=excluded.route, description=excluded.description,
      status=excluded.status, required_permission=excluded.required_permission, sort_order=excluded.sort_order;

-- Master: todas as 9 novas.
insert into public.collab_role_permissions(role_code,permission_code)
select 'master', code from public.collab_permissions
where code in ('responsibilities.manage','support.submit','support.manage','moderation.manage','content-review.manage','governance.view','governance.manage','governance.decide','impact.manage')
on conflict do nothing;

-- Coordenação: todas exceto a decisão final (reservada ao master).
insert into public.collab_role_permissions(role_code,permission_code)
select 'coordinator', code from public.collab_permissions
where code in ('responsibilities.manage','support.submit','support.manage','moderation.manage','content-review.manage','governance.view','governance.manage','impact.manage')
on conflict do nothing;

-- Restantes perfis: submeter suporte.
insert into public.collab_role_permissions(role_code,permission_code) values
  ('volunteer','support.submit'),('reviewer','support.submit'),('researcher','support.submit'),
  ('translator','support.submit'),('partner','support.submit'),('observer','support.submit')
on conflict do nothing;
