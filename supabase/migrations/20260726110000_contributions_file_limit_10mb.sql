-- © 2026 Fernando Rodrigues de Jácomo.
-- Produzido no âmbito do Projeto Comunitário de Milreu.
-- Pacote 08N — reforço do limite de ficheiro de contributos para 10 MB.
--
-- Não edita migrations aplicadas: cria uma nova que aperta a constraint
-- CHECK de tamanho em collab_contribution_files de 25 MB (26214400) para
-- 10 MB (10485760). É o reforço autoritativo no backend; qualquer ficheiro
-- acima de 10 MB é rejeitado no insert, mesmo que o cliente seja contornado.
-- O pré-check mais largo (25 MB) no RPC collab_create_contribution_internal_08e
-- permanece intacto (migration aplicada, não editada); a constraint é o gate.

alter table public.collab_contribution_files
  drop constraint if exists collab_contribution_files_size_check;

alter table public.collab_contribution_files
  add constraint collab_contribution_files_size_check
  check (size_bytes > 0 and size_bytes <= 10485760);
