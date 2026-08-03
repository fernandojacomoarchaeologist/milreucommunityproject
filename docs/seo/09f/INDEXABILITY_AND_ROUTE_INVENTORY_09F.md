<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# Inventário de indexabilidade

Gerar `reports/seo-route-inventory-09f.json` a partir do router real, sem lista inventada. Cada registo deve conter rota, tipo, idiomas disponíveis, estado editorial, decisão de indexação, canonical, inclusão em sitemap, origem da decisão e evidência de teste.

## Regras

- `index`: rota pública, conteúdo publicado, resposta válida, canonical aprovado e sem dados pessoais.
- `noindex`: página pública necessária à experiência, mas inadequada para resultados; exemplos devem ser confirmados no código, não presumidos.
- `blocked`: autenticação, perfil, candidatura, gestão, revisão, demonstração, preview, staging, erro, sessão expirada ou dados pessoais.
- 404 e soft-404 nunca recebem canonical para a home e nunca entram no sitemap.
- Parâmetros de pesquisa, filtros e tracking não criam novas páginas canónicas.
- Memórias individuais só entram se forem públicas, publicadas, com URL estável e direitos/consentimentos compatíveis.

O relatório deve provar que todas as rotas do router foram classificadas exatamente uma vez.
