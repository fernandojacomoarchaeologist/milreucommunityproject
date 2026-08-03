<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# Matriz de aceitação

| ID | Critério | Evidência mínima |
|---|---|---|
| 09F-01 | Base exata e árvore limpa | relatório preflight |
| 09F-02 | Todas as rotas classificadas uma vez | inventário + validador |
| 09F-03 | Privadas/demonstração ausentes do sitemap | teste negativo |
| 09F-04 | Canonical absoluto e correto por idioma | HTML inicial + refresh |
| 09F-05 | Hreflang apenas para `published` e recíproco | contrato + teste |
| 09F-06 | EN/ES/FR ausentes não são anunciados | teste negativo 09D |
| 09F-07 | OG/Twitter coerentes e imagem autorizada | preview + inventário 09E |
| 09F-08 | JSON-LD válido e factual | parser + comparação visível |
| 09F-09 | Sitemap só contém 200 indexáveis | crawler local |
| 09F-10 | Staging/preview bloqueados | teste por ambiente |
| 09F-11 | 404 não é soft-404/canonical home | E2E |
| 09F-12 | 31 originais preservados por hash | manifesto 09E |
| 09F-13 | Zero módulos/permissões/migrations | diff automatizado |
| 09F-14 | Build, testes e CI verdes | relatório final |
