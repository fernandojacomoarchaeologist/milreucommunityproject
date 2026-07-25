-- © 2026 Fernando Rodrigues de Jácomo.
-- Produzido no âmbito do Projeto Comunitário de Milreu.
-- Consentimento, permissões e módulos do Pacote 08E.

update public.collab_consent_versions
set active=false,retired_at=coalesce(retired_at,now())
where active and code<>'2026-08E-v1';

insert into public.collab_consent_versions(code,title,body,active,effective_at)
values(
  '2026-08E-v1',
  'Contributos Comunitários — Informação e consentimento',
  'O contributo será analisado pela equipa do Projeto Comunitário de Milreu. A submissão não garante publicação ou incorporação. A pessoa mantém os direitos que lhe pertençam e declara possuir legitimidade para partilhar o material. O projeto pode contactar o participante para esclarecer informação. Qualquer utilização pública dependerá do âmbito autorizado, do crédito acordado, da revisão editorial e das condições de direitos. É possível solicitar correção ou retirada através do código de acompanhamento.',
  true,
  now()
)
on conflict(code) do update set
  title=excluded.title,
  body=excluded.body,
  active=true,
  retired_at=null;

insert into public.collab_permissions(code,name,description) values
('contributions.track-own','Acompanhar contributos','Consultar estado e mensagens dos próprios contributos.'),
('contributions.view-all','Consultar todos os contributos','Consultar fila, conteúdo, alvos e histórico.'),
('contributions.assign','Atribuir contributos','Atribuir triagem, revisão, direitos ou investigação.'),
('contributions.review','Rever contributos','Analisar conteúdo, fontes e possíveis destinos.'),
('contributions.decide','Decidir contributos','Aceitar, aceitar parcialmente, recusar, retirar ou incorporar.'),
('contributions.request-info','Solicitar informação','Pedir esclarecimentos ao participante.'),
('contributions.files.review','Rever ficheiros','Aceder e decidir sobre ficheiros privados.'),
('contributions.export','Exportar contributos','Gerar exports controlados para análise.'),
('withdrawals.manage','Gerir retiradas','Analisar e concluir pedidos de retirada.'),
('rights.review','Rever direitos e créditos','Analisar autoria, titularidade, autorização e crédito.')
on conflict(code) do update
set name=excluded.name,description=excluded.description;

insert into public.collab_role_permissions(role_code,permission_code)
select 'master',code
from public.collab_permissions
where code in (
  'contributions.track-own','contributions.view-all','contributions.assign',
  'contributions.review','contributions.decide','contributions.request-info',
  'contributions.files.review','contributions.export','withdrawals.manage','rights.review'
)
on conflict do nothing;

insert into public.collab_role_permissions(role_code,permission_code) values
('coordinator','contributions.track-own'),
('coordinator','contributions.view-all'),
('coordinator','contributions.assign'),
('coordinator','contributions.review'),
('coordinator','contributions.decide'),
('coordinator','contributions.request-info'),
('coordinator','contributions.files.review'),
('coordinator','contributions.export'),
('coordinator','withdrawals.manage'),
('coordinator','rights.review'),

('volunteer','contributions.track-own'),
('researcher','contributions.track-own'),
('researcher','contributions.view-all'),
('researcher','contributions.review'),
('reviewer','contributions.track-own'),
('reviewer','contributions.view-all'),
('reviewer','contributions.review'),
('reviewer','contributions.request-info'),
('reviewer','rights.review'),
('translator','contributions.track-own')
on conflict do nothing;

update public.collab_modules
set status='active',
    description='Submeter e acompanhar fotografias, testemunhos, correções, documentos e referências.'
where code='contributions';

insert into public.collab_modules(
  code,name,route,description,status,required_permission,sort_order
) values (
  'contribution-moderation',
  'Moderação de contributos',
  '/area-colaborativa/gestao/contributos',
  'Triagem, atribuição, revisão, direitos, decisões e encaminhamento editorial.',
  'active',
  'contributions.moderate',
  95
)
on conflict(code) do update set
  name=excluded.name,
  route=excluded.route,
  description=excluded.description,
  status=excluded.status,
  required_permission=excluded.required_permission,
  sort_order=excluded.sort_order;
