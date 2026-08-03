<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# SEO e descoberta por máquinas

Aplicar o contrato do 09F às novas rotas. Apenas obras e autores `published` podem ter canonical, sitemap e JSON-LD.

- obra: `ScholarlyArticle`, `Book`, `Report` ou tipo factual adequado; não usar tipo por inferência;
- autor: `Person` somente para identidade revista;
- DOI como `identifier`, não como licença;
- `sameAs` apenas para identificadores verificados;
- `isAccessibleForFree` deriva do estado confirmado, nunca da presença de URL;
- páginas vazias, rascunhos, revisão e área colaborativa ficam `noindex` e fora do sitemap;
- `hreflang` apenas para tradução realmente publicada, seguindo 09D/09F;
- metadados não devem atribuir resumo, autoria ou entidade responsável sem prova.

O 10B não cria API, feed, dataset, IIIF ou MCP. HTML público acessível é a primeira interface para humanos e máquinas.
