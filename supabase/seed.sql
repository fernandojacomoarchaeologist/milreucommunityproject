-- © 2026 Fernando Rodrigues de Jácomo.
-- Produzido no âmbito do Projeto Comunitário de Milreu.
-- Consultar RIGHTS.md no repositório principal.

insert into proteus_poc.facts (
  slug,
  record_kind,
  title,
  summary,
  editorial_status,
  publication_status
)
values (
  'demo-poc-001',
  'demonstration',
  '{"pt-PT":"Registo demonstrativo do Milreu Proteus"}'::jsonb,
  '{"pt-PT":"Este conteúdo é fictício e existe apenas para testar a infraestrutura."}'::jsonb,
  'draft',
  'not-public'
)
on conflict (slug) do nothing;
