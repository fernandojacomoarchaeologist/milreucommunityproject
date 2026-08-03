---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "09E"
---

# Prompt de integração — 09E

Integra o Pacote 09E somente sobre o `main` que contenha o merge `5c6ebda`, versão `0.33.0`, `currentPackage 09C.1` e CI 46/46 verde. Lê todos os ficheiros antes de alterar código.

## Preflight bloqueante

1. confirma branch, commit, versão, working tree, PRs e CI da base;
2. comprova no histórico 09C → 09D → decisões editoriais → 09C.1;
3. lê ledger, dependency map, change surface registry e recovery protocol existentes;
4. inventaria fontes declaradas, efetivamente descarregadas e computadas no browser;
5. inventaria imagens, originais, derivados, referências no código, dimensões, formatos, peso, direitos, créditos e intervenção digital;
6. mede baseline de LCP, CLS, pedidos e bytes, distinguindo local, CI e staging;
7. se a base divergir ou houver alterações locais não compreendidas, para e relata.

## Implementação

- Não presumas que Fraunces, Spectral e Archivo sejam as famílias finais: verifica configuração, ficheiros e licenças; regista divergências antes de decidir.
- Preferir fontes self-hosted e subconjuntos necessários, sem recolher dados de visitantes por fornecedores externos.
- Declarar `@font-face` coerente, `font-display`, pesos/estilos reais e fallback métrico apropriado; eliminar falso bold/italic.
- Preservar todos os originais históricos byte a byte. Gerar derivados numa área própria, com origem, transformação, ferramenta, parâmetros e hash.
- Não usar IA generativa para reconstruir documentação histórica. Intervenções existentes, incluindo MM202617, mantêm menção explícita.
- Implementar `width`/`height` ou `aspect-ratio`, `srcset`, `sizes`, formatos suportados e fallback; lazy load somente fora da dobra.
- Dar prioridade somente ao candidato LCP comprovado; não aplicar preload indiscriminado.
- Preservar enquadramento significativo em mobile, zoom, modo imersivo, carrosséis e cartaz do Inquérito.
- Manter separados `alt`, legenda, crédito, direitos, proveniência e nota de intervenção.

## Limites não negociáveis

Zero módulos, permissões e migrations. Não alterar dados, RLS, RPCs ou fluxos do 09C/09C.1. Preservar o modelo e os estados editoriais do 09D; EN/ES/FR continuam honestos. Não criar SEO, sitemap, Open Graph, Twitter Cards, JSON-LD ou `hreflang`. Não ativar produção nem usar dados pessoais reais.

## Testes e evidências

Executa contratos, validadores, testes existentes, build, Playwright e acessibilidade. Mede pelo menos mobile e desktop, cold load, três rondas comparáveis e mediana; guarda baseline e resultado. Testa zoom 200%/400%, teclado, reduced motion, falha de fonte/imagem, carrosséis, Museu, imersivo e as seis rotas colaborativas. Não declares melhoria sem números comparáveis.

## Entrega

Cria branch nova, commit e PR sem merge automático. Atualiza versão para `0.34.0` e `currentPackage` para `09E` apenas se os critérios forem cumpridos. Relata base, ficheiros, inventários, licenças, hashes, decisões, métricas antes/depois, testes, regressões, exceções, diff de módulos/permissões/migrations e bloqueadores humanos.
