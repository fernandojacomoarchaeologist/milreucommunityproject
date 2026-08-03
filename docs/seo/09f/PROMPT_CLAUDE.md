<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# Prompt de integração — 09F

Integra o Pacote 09F somente sobre `main@95776ed`, versão `0.34.0`, `currentPackage 09E`, com CI 46/46 verde. Lê integralmente o pacote antes de alterar código.

## Preflight bloqueante

1. Confirma commit, versão, working tree, CI e ausência de PR conflitante.
2. Lê os artefactos de 09D e 09E já integrados, especialmente disponibilidade linguística, inventário de media, ledger e recovery protocol.
3. Descobre a origem pública configurada; não inventes domínio. Se não existir domínio canónico aprovado, implementa configuração validada por ambiente e mantém produção bloqueada.
4. Inventaria todas as rotas e classifica-as como `index`, `noindex` ou `blocked`, com fundamento e evidência.
5. Confirma quais combinações rota×idioma estão realmente `published`. `missing`, `draft`, `machine_draft`, `in_review` e equivalentes não entram em `hreflang` nem sitemap.

## Implementação

- Um título e uma descrição úteis por rota pública indexável, em conteúdo efetivamente publicado.
- Canonical absoluto, estável e sem parâmetros de tracking, sessão, filtro ou fragmento efémero.
- Open Graph e Twitter Cards coerentes; imagem existente, publicável, com URL absoluta, dimensões, tipo, texto alternativo, crédito e direitos conhecidos.
- `hreflang` recíproco apenas entre variantes publicadas e equivalentes; `pt-PT` é canónico. `x-default` só após decisão explícita e deve apontar para a entrada pública padrão aprovada.
- Sitemap somente com URLs canónicas públicas e indexáveis; `lastmod` derivado de alteração real, nunca da hora do build.
- Robots não é mecanismo de privacidade. Rotas privadas devem exigir controlo de acesso e emitir `noindex`; não colocar URLs sensíveis no sitemap.
- JSON-LD mínimo, factual e validado. Não inventar organização, autoria, avaliações, eventos, horários, preços ou relações institucionais.
- Para SPA, garante metadados corretos no HTML entregue a crawlers e previews; não declares sucesso apenas porque o DOM muda após JavaScript.

## Limites

Zero módulos, permissões e migrations. Preserva 26/152, as 31 imagens originais e o pipeline 09E. Não resolve licenças de fontes, não edita o cartaz da linha azul, não publica EN/ES/FR, não altera oportunidades/RLS/RPCs, não ativa produção e não inicia Proteus.

## Verificação e entrega

Executa validadores, testes, build e CI. Testa HTML inicial, navegação cliente, refresh direto, 404, URLs parametrizadas, previews sociais, canonical, reciprocidade `hreflang`, sitemap/robots, JSON-LD e exclusão das rotas privadas. Cria branch e PR; não faças merge automático. Atualiza para `0.35.0` / `09F` apenas se todos os critérios forem cumpridos. Relata inventário antes/depois, decisões humanas pendentes, diff zero de módulos/permissões/migrations e prova de preservação de 09D/09E.
