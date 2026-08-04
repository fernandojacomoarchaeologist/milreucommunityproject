<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# Testes obrigatórios

- schemas dos registos e agentes;
- unicidade de IDs, URLs persistentes e relações de autoria;
- enumerações de acesso/direitos válidas;
- `public_metadata=false` impede página e SEO públicos;
- `full_text_hosted=false` para todos os seis registos;
- somente o artigo RUN pode ter `open_access=true`;
- nenhum registo ResearchGate possui licença aberta inferida;
- página dinâmica exige `verified_at` e aviso editorial;
- nenhum caminho local, nome de upload, hash ou URL privada aparece no build;
- nenhum parágrafo extraído dos anexos integra fixtures/snapshots;
- catálogo, filtros, ficha de obra e ficha de autor renderizam;
- 404/retirada/restrição continuam honestos;
- validações anteriores, testes e build permanecem verdes.
