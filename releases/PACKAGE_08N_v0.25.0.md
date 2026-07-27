# Release — Pacote 08N v0.25.0 (Refino da área voluntária, correções de site e imersivo)

© 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md.

Refinamento cumulativo sobre 08A–08M. Sem novos módulos, permissões ou tabelas de schema.

## Entregas
- **Secções do voluntário:** estrutura orientadora (Objetivo/Ações esperadas/Pequeno guia/Detalhes) na home colaborativa.
- **Formação:** UI do voluntário mostra apenas o percurso Fundamentos (`project-foundations`); os restantes 4 permanecem no backend (dados/gates intactos), ocultos só na UI.
- **Contributos:** anexos até **10 MB** (reduzido de 25 MB). Cliente valida e mostra o limite; config `maxFileSizeBytes=10485760`; **nova migration** aperta a constraint CHECK `collab_contribution_files_size_check` para 10 MB (não edita migrations aplicadas). Método real de upload = **URL assinada gerada no backend (Edge Function `community-contribution-intake`) para o bucket privado `community-contributions-private`**; `service_role` só na Edge Function; ficheiros nunca no Git nem públicos; whitelist de tipos já existente preservada.
- **Home:** bloco de **ações pendentes** derivado de dados reais (vínculo pendente, notificações não lidas, perfil incompleto); fallback positivo quando não há pendências; nada fictício.
- **Carrossel:** autoplay confirmado; imagem do Inquérito 2026 com `object-fit:cover` + `object-position` para remover a linha azul do topo e uniformizar o tamanho dos 3 slides.
- **Imersivo:** novo controlo **"Voltar ao Portal"** (`data-immersive-portal` → `#/`), preservando "Voltar ao Museu", fecho, teclado e não-regressão (validate:immersive verde).

## Invariantes
0 efeitos públicos, produção bloqueada, MM202617 inelegível, dataset canónico em 0.11.3, `service_role` fora do browser, Portal/Museu sem regressão. 25 módulos, 149 permissões (inalterados).
