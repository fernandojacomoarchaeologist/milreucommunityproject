-- © 2026 Fernando Rodrigues de Jácomo.
-- Produzido no âmbito do Projeto Comunitário de Milreu.
-- Consultar RIGHTS.md no repositório principal.

create or replace view public.proteus_poc_published_facts
with (security_invoker = true)
as
select
  id,
  slug,
  record_kind,
  title,
  summary,
  updated_at
from proteus_poc.facts
where editorial_status = 'published'
  and publication_status = 'public';

revoke all on public.proteus_poc_published_facts from public;
grant select on public.proteus_poc_published_facts to anon, authenticated;

comment on view public.proteus_poc_published_facts is
'View POC para testar leitura pública controlada. Remover antes do modelo final.';
