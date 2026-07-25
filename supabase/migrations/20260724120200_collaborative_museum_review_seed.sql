-- © 2026 Fernando Rodrigues de Jácomo.
-- Produzido no âmbito do Projeto Comunitário de Milreu.
-- Catálogos, permissões e ciclo inicial do Pacote 08F.

insert into public.collab_permissions(code,name,description) values
('training.complete','Concluir formação','Registar progresso nas lições atribuídas.'),
('training.assess','Avaliar formação','Registar avaliações e validar conclusão de percursos.'),
('training.audit.view','Consultar auditoria de formação','Consultar progresso e avaliações de membros.'),
('museum.review.view','Consultar revisão do Museu','Consultar ciclos, registos, propostas, comentários e checks.'),
('museum.review.edit','Propor alterações ao Museu','Criar propostas campo a campo com fundamentação e fontes.'),
('museum.review.comment','Comentar revisão do Museu','Criar e resolver comentários editoriais.'),
('museum.review.assign','Atribuir revisão do Museu','Atribuir papéis editoriais, de investigação, direitos, tradução e publicação.'),
('museum.review.check','Executar checks do Museu','Registar checks editoriais, de fontes, direitos, acessibilidade e publicação.'),
('museum.review.editorial-approve','Aprovar editorialmente','Registar aprovação editorial após formação e gates.'),
('museum.review.rights-approve','Aprovar direitos','Registar aprovação de direitos, créditos e intervenções digitais.'),
('museum.review.publication-approve','Aprovar publicação','Autorizar entrada num snapshot editorial.'),
('museum.review.preview','Pré-visualizar revisão','Comparar versão canónica e propostas.'),
('museum.review.export','Gerar snapshot editorial','Gerar e exportar snapshots aprovados.'),
('museum.review.apply','Aprovar aplicação editorial','Aprovar snapshot para aplicação controlada no Git.'),
('museum.review.manage','Gerir ciclos de revisão','Criar ciclos, bootstrap, estados e releases.'),
('museum.review.audit.view','Consultar auditoria editorial','Consultar histórico completo da revisão.'),
('museum.review.link-contribution','Relacionar contributos','Ligar contributos aceites aos registos em revisão.'),
('museum.review.effects.manage','Gerir efeitos públicos','Propor destaques orgânicos no Portal e no Museu.')
on conflict(code) do update
set name=excluded.name,description=excluded.description;

insert into public.collab_role_permissions(role_code,permission_code)
select 'master',code
from public.collab_permissions
where code in ('training.complete','training.assess','training.audit.view','museum.review.view','museum.review.edit','museum.review.comment','museum.review.assign','museum.review.check','museum.review.editorial-approve','museum.review.rights-approve','museum.review.publication-approve','museum.review.preview','museum.review.export','museum.review.apply','museum.review.manage','museum.review.audit.view','museum.review.link-contribution','museum.review.effects.manage')
on conflict do nothing;

insert into public.collab_role_permissions(role_code,permission_code) values
('coordinator','training.complete'),
('coordinator','training.assess'),
('coordinator','training.audit.view'),
('coordinator','museum.review.view'),
('coordinator','museum.review.edit'),
('coordinator','museum.review.comment'),
('coordinator','museum.review.assign'),
('coordinator','museum.review.check'),
('coordinator','museum.review.editorial-approve'),
('coordinator','museum.review.rights-approve'),
('coordinator','museum.review.publication-approve'),
('coordinator','museum.review.preview'),
('coordinator','museum.review.export'),
('coordinator','museum.review.apply'),
('coordinator','museum.review.manage'),
('coordinator','museum.review.audit.view'),
('coordinator','museum.review.link-contribution'),
('coordinator','museum.review.effects.manage'),
('volunteer','training.complete'),
('volunteer','museum.review.view'),
('volunteer','museum.review.comment'),
('reviewer','training.complete'),
('reviewer','training.assess'),
('reviewer','museum.review.view'),
('reviewer','museum.review.edit'),
('reviewer','museum.review.comment'),
('reviewer','museum.review.check'),
('reviewer','museum.review.preview'),
('reviewer','museum.review.link-contribution'),
('reviewer','museum.review.audit.view'),
('researcher','training.complete'),
('researcher','museum.review.view'),
('researcher','museum.review.edit'),
('researcher','museum.review.comment'),
('researcher','museum.review.check'),
('researcher','museum.review.preview'),
('researcher','museum.review.link-contribution'),
('researcher','museum.review.audit.view'),
('translator','training.complete'),
('translator','museum.review.view'),
('translator','museum.review.edit'),
('translator','museum.review.comment'),
('translator','museum.review.check'),
('translator','museum.review.preview'),
('partner','training.complete'),
('partner','museum.review.view'),
('partner','museum.review.comment'),
('observer','training.complete'),
('observer','museum.review.view')
on conflict do nothing;

update public.collab_modules
set status='active',
    description='Guias, procedimentos, consentimentos, manuais e recursos internos do projeto.'
where code='library';

update public.collab_modules
set status='active',
    description='Percursos de formação, avaliações e requisitos para atividades especializadas.'
where code='training';

update public.collab_modules
set status='active',
    description='Revisão campo a campo das 31 memórias, fontes, direitos, relações, traduções e publicação.',
    required_permission='museum.review.view'
where code='museum-review';

insert into public.collab_modules(
  code,name,route,description,status,required_permission,sort_order
) values (
  'museum-review-management',
  'Gestão da revisão do Museu',
  '/area-colaborativa/gestao/revisao-museu',
  'Ciclos, atribuições, gates, snapshots, efeitos públicos e incorporação controlada.',
  'active',
  'museum.review.manage',
  96
)
on conflict(code) do update set
  name=excluded.name,
  route=excluded.route,
  description=excluded.description,
  status=excluded.status,
  required_permission=excluded.required_permission,
  sort_order=excluded.sort_order;

insert into public.collab_training_trails(
  code,version,title,summary,estimated_minutes,passing_score,
  audience,required_for,active,sort_order
) values
('project-foundations','0.17.0','Fundamentos do Projeto Comunitário de Milreu','Princípios, objetivos, ética, participação, consentimento e separação entre comunidade, instituição e conteúdo canónico.',45,80,'["volunteer", "reviewer", "researcher", "translator", "coordinator", "partner"]'::jsonb,'["museum-review", "contributions", "tasks"]'::jsonb,true,10),
('museum-editorial-evidence','0.17.0','Revisão editorial, evidência e proveniência','Como rever títulos, descrições, datas, classificações, fontes, relações e níveis de certeza.',75,85,'["reviewer", "researcher", "coordinator"]'::jsonb,'["museum-review.edit", "museum-review.editorial-approve"]'::jsonb,true,20),
('rights-credits-ai','0.17.0','Direitos, créditos e intervenções digitais','Autoria, titularidade, crédito, condições de uso, retoque, restauro e divulgação de IA.',60,90,'["reviewer", "coordinator", "researcher"]'::jsonb,'["museum-review.rights-approve", "contributions.files.review"]'::jsonb,true,30),
('translation-localisation','0.17.0','Tradução e localização do Museu','Tradução a partir do português europeu, controlo terminológico e estados de revisão.',50,85,'["translator", "reviewer", "coordinator"]'::jsonb,'["museum-review.translate"]'::jsonb,true,40),
('accessible-public-writing','0.17.0','Escrita pública e acessibilidade','Clareza, leitura, estrutura, texto alternativo, linguagem não excludente e comunicação de incerteza.',55,85,'["reviewer", "translator", "coordinator", "volunteer"]'::jsonb,'["museum-review.publication-approve"]'::jsonb,true,50)
on conflict(code) do update set
  version=excluded.version,
  title=excluded.title,
  summary=excluded.summary,
  estimated_minutes=excluded.estimated_minutes,
  passing_score=excluded.passing_score,
  audience=excluded.audience,
  required_for=excluded.required_for,
  active=excluded.active,
  sort_order=excluded.sort_order,
  updated_at=now();

insert into public.collab_training_lessons(
  trail_code,lesson_code,title,resource_path,sort_order,active
) values
('project-foundations','project-purpose','Objetivo, princípios e iniciativas','docs/training/project-purpose.md',10,true),
('project-foundations','community-first','Comunidade, mutualidade e contexto institucional','docs/training/community-first.md',20,true),
('project-foundations','ethics-consent','Ética, consentimento, correção e retirada','docs/training/ethics-consent.md',30,true),
('museum-editorial-evidence','field-review','Revisão campo a campo','docs/training/field-review.md',10,true),
('museum-editorial-evidence','sources-certainty','Fontes, inferência e grau de certeza','docs/training/sources-certainty.md',20,true),
('museum-editorial-evidence','provenance-relations','Proveniência e relações entre memórias','docs/training/provenance-relations.md',30,true),
('rights-credits-ai','rights-roles','Autor, titular, fonte e cedente','docs/training/rights-roles.md',10,true),
('rights-credits-ai','credits-conditions','Crédito e condições de utilização','docs/training/credits-conditions.md',20,true),
('rights-credits-ai','digital-ai-disclosure','Intervenções digitais e IA','docs/training/digital-ai-disclosure.md',30,true),
('translation-localisation','source-language','Português europeu como fonte','docs/training/source-language.md',10,true),
('translation-localisation','translation-status','Estados e revisão de tradução','docs/training/translation-status.md',20,true),
('translation-localisation','terminology','Terminologia arqueológica e comunitária','docs/training/terminology.md',30,true),
('accessible-public-writing','plain-language','Clareza sem simplificação indevida','docs/training/plain-language.md',10,true),
('accessible-public-writing','accessibility-text','Acessibilidade textual e visual','docs/training/accessibility-text.md',20,true),
('accessible-public-writing','uncertainty-public','Comunicar incerteza ao público','docs/training/uncertainty-public.md',30,true)
on conflict(trail_code,lesson_code) do update set
  title=excluded.title,
  resource_path=excluded.resource_path,
  sort_order=excluded.sort_order,
  active=excluded.active;

insert into public.collab_library_resources(
  code,version,title,category,resource_path,audience,status,sort_order
) values
('project-context-ledger','0.17.0','Contexto consolidado do projeto','governance','PROJECT_CONTEXT_LEDGER.md','["all"]'::jsonb,'active',10),
('museum-review-manual','0.17.0','Manual de revisão editorial do Museu','museum-review','docs/collaborative/MUSEUM_EDITORIAL_REVIEW_MANUAL.md','["reviewer", "researcher", "translator", "coordinator"]'::jsonb,'active',20),
('field-map','0.17.0','Mapa de campos e decisões','museum-review','docs/collaborative/MUSEUM_FIELD_REVIEW_MAP.md','["reviewer", "researcher", "translator", "coordinator"]'::jsonb,'active',30),
('rights-guide','0.17.0','Guia de direitos, créditos e intervenções digitais','rights','docs/collaborative/MUSEUM_RIGHTS_REVIEW_08F.md','["reviewer", "coordinator"]'::jsonb,'active',40),
('sources-guide','0.17.0','Guia de fontes, citações e proveniência','research','docs/collaborative/MUSEUM_SOURCES_PROVENANCE_08F.md','["reviewer", "researcher", "coordinator"]'::jsonb,'active',50),
('translation-guide','0.17.0','Guia de tradução e localização','translation','docs/collaborative/MUSEUM_TRANSLATION_REVIEW_08F.md','["translator", "reviewer", "coordinator"]'::jsonb,'active',60),
('accessibility-checklist','0.17.0','Checklist de escrita e acessibilidade','accessibility','docs/collaborative/MUSEUM_ACCESSIBILITY_REVIEW_08F.md','["reviewer", "translator", "coordinator"]'::jsonb,'active',70),
('publication-gates','0.17.0','Gates de aprovação e publicação','publication','docs/collaborative/MUSEUM_PUBLICATION_GATES_08F.md','["coordinator", "reviewer"]'::jsonb,'active',80),
('context-recovery','0.17.0','Protocolo de recuperação de contexto','governance','CONTEXT_RECOVERY_PROTOCOL.md','["all"]'::jsonb,'active',90)
on conflict(code) do update set
  version=excluded.version,
  title=excluded.title,
  category=excluded.category,
  resource_path=excluded.resource_path,
  audience=excluded.audience,
  status=excluded.status,
  sort_order=excluded.sort_order,
  updated_at=now();

do $$
declare
  cycle_uuid uuid;
begin
  insert into public.collab_museum_review_cycles(
    project_id,code,title,description,status,source_dataset_version,
    source_dataset_hash,created_by
  ) values (
    public.collab_project_id(),
    'museum-review-2026-01',
    'Revisão editorial inicial das 31 memórias',
    'Ciclo inicial criado a partir dos 31 registos visíveis no ambiente de revisão.',
    'planned',
    '0.11.3',
    'b8ca1fe3e407a84aee832db62e47cfffd1393c5d3d283329eed81745f9c0fb40',
    null
  )
  on conflict(project_id,code) do update set
    title=excluded.title,
    description=excluded.description,
    source_dataset_version=excluded.source_dataset_version,
    source_dataset_hash=excluded.source_dataset_hash,
    updated_at=now()
  returning id into cycle_uuid;

  insert into public.collab_museum_review_records(
    project_id,cycle_id,memory_id,status,source_record_hash,
    source_editorial_status,source_site_visible,public_release_eligible,
    requires_ai_disclosure,linked_contribution_count
  ) values
  (public.collab_project_id(),cycle_uuid,'MM202601','not-started','0c5641006f4415da650a2085bad640a68c8dc16623602e02cb009942bcfda6c4','preliminary',true,true,false,0),
  (public.collab_project_id(),cycle_uuid,'MM202602','not-started','f970c1cf5224407052eb3c468782a2def249cdfdcf36d76be4351da9a51ae718','preliminary',true,true,false,0),
  (public.collab_project_id(),cycle_uuid,'MM202603','not-started','cb102cc652b6cc794efb572d3a3a1633c496f5124ef3252fdd0146f787b3e857','preliminary',true,true,false,0),
  (public.collab_project_id(),cycle_uuid,'MM202604','not-started','af0010b97e12c15ce25fe5c963835286755f9283ba645dec01b595a3ead6fb72','preliminary',true,true,false,0),
  (public.collab_project_id(),cycle_uuid,'MM202605','not-started','f7ae8a1d8f7f7e96d28d87af71bab13386053795edecc8c458a189e947e4dad5','preliminary',true,true,false,0),
  (public.collab_project_id(),cycle_uuid,'MM202606','not-started','dfbda0a455d05f8529dda241bd55665fcfc596dfe63dd8b078b447b10abecf01','preliminary',true,true,false,0),
  (public.collab_project_id(),cycle_uuid,'MM202607','not-started','d404257ba8549e63482d1c3f7bdbc17546648dcb5f0cadb3456d6a9eebd67274','preliminary',true,true,false,0),
  (public.collab_project_id(),cycle_uuid,'MM202608','not-started','d2fc657e7b80f0268baaaaa8817a9bcd7d22402c35bc3a6f0adc8fb59b889a15','preliminary',true,true,false,0),
  (public.collab_project_id(),cycle_uuid,'MM202609','not-started','c2510067b6197a6ec9e6fbf575d40189ddf690cdb3fa816f5626c1d7b7a55f4e','preliminary',true,true,false,0),
  (public.collab_project_id(),cycle_uuid,'MM202610','not-started','32566b917f496fb9a930d7c089241be1c5701b76b921637de530bb89de4b15f0','preliminary',true,true,false,0),
  (public.collab_project_id(),cycle_uuid,'MM202611','not-started','f726310f3ac5d24adabed82883fa424b309e9df05df782fbfa94c381d8a40b7c','preliminary',true,true,false,0),
  (public.collab_project_id(),cycle_uuid,'MM202612','not-started','39889e76c543a61af7f6d380d18f8424829d8e276786c53659f2e13f86799cb3','preliminary',true,true,false,0),
  (public.collab_project_id(),cycle_uuid,'MM202613','not-started','0d0bba00c87cc964e9a4c522abf10b2b745fcde3b7272d2b1238f58409fc3e69','preliminary',true,true,false,0),
  (public.collab_project_id(),cycle_uuid,'MM202614','not-started','71d721325eb4053d5e65cef13813163480202600ae3ac9fd51405c0eb84b868c','preliminary',true,true,false,0),
  (public.collab_project_id(),cycle_uuid,'MM202615','not-started','27bcbad96aeca9cb360593b44cb64fbaa741dc7194adbc7373f9249325222a0d','preliminary',true,true,false,0),
  (public.collab_project_id(),cycle_uuid,'MM202616','not-started','1954f11dcdc7060460b5e4f82a911285261fe8c8321e2cb9f003e14ee4f776dd','preliminary',true,true,false,0),
  (public.collab_project_id(),cycle_uuid,'MM202617','not-started','9e8794687954cfbf43cd591e1f0219ebfc89839f59f8613cd3b72c9ed3d6224a','in-review',true,false,true,0),
  (public.collab_project_id(),cycle_uuid,'MM202618','not-started','aa831cbcae5641a4056d7eaff0ff3f0fa849f14ece52cf0942d06062c24dd9aa','preliminary',true,true,true,0),
  (public.collab_project_id(),cycle_uuid,'MM202619','not-started','af93d8080d1ed237e77209ce73de980408e0e02e69b3c52463f2117787ba13a6','preliminary',true,true,true,0),
  (public.collab_project_id(),cycle_uuid,'MM202620','not-started','20a61c71e7d2b89adce4323b732379bb8678181c45ef5935ccabd0ec22b5d445','preliminary',true,true,false,0),
  (public.collab_project_id(),cycle_uuid,'MM202621','not-started','ab69387e3681ab83e13e5a191d3a5aa0345e4b8bb7053e2ce97e6fd8233e141f','preliminary',true,true,false,0),
  (public.collab_project_id(),cycle_uuid,'MM202622','not-started','2e98f7a5eed436178dc0579d4555f4305ec16fbb7a0bbda0af334ccbc1d23523','preliminary',true,true,false,0),
  (public.collab_project_id(),cycle_uuid,'MM202623','not-started','0130de729c770f2b9f60aa264c59b7a1f8b5a79a4401a5b12d0d65eea7c388bc','preliminary',true,true,false,0),
  (public.collab_project_id(),cycle_uuid,'MM202624','not-started','5bea292daf0af97aedc1c7338f8c678df7a1f4a958d00b7d625c2a0d0a0d5d52','preliminary',true,true,false,0),
  (public.collab_project_id(),cycle_uuid,'MM202625','not-started','43d744a5a319113bfc6a142420ca8542959ecec669ae10a34498b906d7e4a1a1','preliminary',true,true,false,0),
  (public.collab_project_id(),cycle_uuid,'MM202626','not-started','f9a873e9768d1b6c0aeee475edf6ff5d355e95794fac0270dca8569dec137192','preliminary',true,true,false,0),
  (public.collab_project_id(),cycle_uuid,'MM202627','not-started','84de204b22dc00cc388bc1aa48d1459ae720bebbde66fc9a3f606e990a4a9b33','preliminary',true,true,false,0),
  (public.collab_project_id(),cycle_uuid,'MM202628','not-started','e7c81748cf05c6b997d59761c837900ad903b4d062aa751536f846be458001ca','preliminary',true,true,false,0),
  (public.collab_project_id(),cycle_uuid,'MM202629','not-started','24667a5fa77bf6232bfc9be3349bda57566c0c593c316d25b1188c6c16e285eb','preliminary',true,true,false,0),
  (public.collab_project_id(),cycle_uuid,'MM202630','not-started','e045b044d644f0f406bffc9802aef6e3e462998a2ebc6ad5c285e24c4300a809','preliminary',true,true,false,0),
  (public.collab_project_id(),cycle_uuid,'MM202631','not-started','0f29e04fabfef4dc29f658da64648c8c9ee7b588fd5ffbde35e82bdae9b87b62','preliminary',true,true,true,0)
  on conflict(cycle_id,memory_id) do update set
    source_record_hash=excluded.source_record_hash,
    source_editorial_status=excluded.source_editorial_status,
    source_site_visible=excluded.source_site_visible,
    public_release_eligible=excluded.public_release_eligible,
    requires_ai_disclosure=excluded.requires_ai_disclosure,
    updated_at=now();

  insert into public.collab_museum_review_checks(
    project_id,review_record_id,check_type,status
  )
  select
    public.collab_project_id(),
    record.id,
    check_type,
    'pending'
  from public.collab_museum_review_records record
  cross join unnest(array[
    'editorial','source','rights','digital-intervention',
    'accessibility','translation','relations','publication'
  ]) check_type
  where record.cycle_id=cycle_uuid
  on conflict(review_record_id,check_type) do nothing;
end
$$;
