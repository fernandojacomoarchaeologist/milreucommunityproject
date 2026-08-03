<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# Hreflang, canonical, sitemap e robots

## Hreflang

Uma variante só é elegível quando rota e conteúdo estão `published`. O conjunto deve ser recíproco e cada página deve referir-se a si própria. Não apontar EN/ES/FR para PT-PT como se fossem traduções. Rotas sem equivalente ficam apenas com a variante realmente publicada. `x-default` depende de decisão explícita.

## Canonical

URL absoluta construída a partir de origem aprovada por ambiente. Remover tracking e fragmentos transitórios sem colapsar páginas semanticamente distintas. Canonical deve corresponder ao conteúdo e ao idioma exibidos; nunca mascarar 404, login ou fallback editorial.

## Sitemap

Gerar deterministicamente a partir do inventário. Incluir apenas status 200, `index`, canonical próprio e variante publicada. `lastmod` vem da última alteração editorial verificável. Dividir índice apenas se necessário; não adicionar prioridade ou frequência sem fundamento.

## Robots

Fornecer política por ambiente. Produção aprovada pode permitir crawling público; staging, preview e ambientes locais devem impedir indexação. `robots.txt` não substitui autenticação nem `noindex`. Testar que sitemap e robots referenciam a mesma origem configurada.
