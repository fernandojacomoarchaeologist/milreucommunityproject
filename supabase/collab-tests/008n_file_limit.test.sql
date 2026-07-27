-- © 2026 Fernando Rodrigues de Jácomo.
-- Produzido no âmbito do Projeto Comunitário de Milreu.
-- Pacote 08N — verifica o aperto do limite de ficheiro de contributos para 10 MB.

begin;
do $$
declare def text;
begin
  select pg_get_constraintdef(oid) into def from pg_constraint where conname='collab_contribution_files_size_check';
  if def is null then raise exception 'constraint de tamanho ausente'; end if;
  if position('10485760' in def)=0 then raise exception 'limite de ficheiro não foi apertado para 10 MB: %', def; end if;
  if position('26214400' in def)>0 then raise exception 'limite antigo de 25 MB ainda presente: %', def; end if;
end
$$;
rollback;
