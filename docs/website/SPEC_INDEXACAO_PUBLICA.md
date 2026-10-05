# Spec (PROPOSTA) — Pacote de indexação pública do site

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> **ESTADO: PROPOSTA — NÃO APROVADA, NÃO IMPLEMENTADA.** Avalia o esforço para tornar o site pesquisável no Google **em condições**. Requer decisão de lançamento (`public-release-gated`) + aprovação desta spec. Decisões de conteúdo em `DECISAO_INDEXACAO_2026-10-05.md`.

## 1. Porque não é um simples "ligar"
Verificado em 2026-10-05 ao tentar a Fase 1:
1. **`index.html` tem `noindex` fixo** (a base do SPA). Enquanto assim for, as páginas servidas por ele não são indexáveis.
2. **Testes-guarda** asseguram o estado `preview/noindex` (ex.: «config SEO é por ambiente e não inventa domínio», «robots.txt do preview bloqueia tudo», «rotas … fora do sitemap»). Flipar a config **falha 3 testes** — são salvaguardas deliberadas, não bugs.
3. **SPA com rotas em `#/`**: as páginas institucionais (`#/projeto`, `#/sobre`, …) são renderizadas no cliente e **não têm HTML próprio**; só as **memórias** são pré-geradas. Indexar sem pré-geração daria conteúdo pobre ao motor de busca.

## 2. Objetivo
Permitir indexação pública **de qualidade** das páginas institucionais (Fase 1) e, depois, do subconjunto aprovado de memórias (Fase 2), sem quebrar salvaguardas nem expor conteúdo preliminar.

## 3. Trabalho proposto
### 3.1 Base de indexação (técnico)
- **`index.html` robots condicional:** injetar no build `index,follow` quando `indexingAllowed && origem aprovada`, senão `noindex,nofollow`. (Hoje é fixo.)
- **Pré-geração de páginas institucionais estáticas** (como já se faz para memórias): HTML próprio por rota pública institucional (início, projeto, metodologia, iniciativas, conhecimento, participar, sobre, imprensa, identidade, direitos, exposições, oportunidades, transparência) com `<title>`, `meta description`, `canonical`, OG/Twitter e `robots index,follow`. É o maior item de esforço.
- **Gate `museumIndexingAllowed`** (novo): o Museu permanece **visível no site** mas **fora do sitemap e `noindex`** até aprovação editorial; na Fase 2 passa a `true` com o subconjunto aprovado. (Sem este gate, as 30 memórias elegíveis entram no sitemap/index.)
- **`sitemap.xml` / `robots.txt`:** já derivam do inventário + memórias; passam a incluir as institucionais pré-geradas e a excluir o Museu até à Fase 2.

### 3.2 Decisões de SEO a fechar (humanas; ver decisão registada)
- `publicOrigin` = `https://projectomilreu.pt`; `indexingAllowed: true`; `environment: production`.
- **x-default** (só `pt-PT` publicado) — decidir se se declara e qual entrada.
- **Dados estruturados**: manter `WebSite`; **não** criar `Organization` (afiliação UALG só em texto, não como entidade proprietária).
- **Imagem social** = logótipo (confirmado).

### 3.3 Testes-guarda (atualizar com cuidado, não remover)
- Tornar os 3 testes **sensíveis ao estado aprovado**: asseguram `preview` quando `indexingAllowed=false` **e** o estado de lançamento correto quando `true` (origem presente, Museu fora do sitemap na Fase 1, rotas privadas sempre `blocked`, MM202617 sempre `noindex`). Mantém-se a salvaguarda contra publicação acidental.

### 3.4 Conteúdo (Fase 2 — separado)
- Aprovação editorial do subconjunto de memórias (<1960 + escavações 70–80), registo de direitos por imagem e `museumIndexingAllowed: true` + (idealmente) flag de indexação **por registo**. Conduzido pelos skills de aprovação do Museu.

## 4. Fases
- **Fase 1:** base técnica + pré-geração institucional + testes → **institucional indexado**, Museu `noindex`.
- **Fase 2:** aprovação editorial do Museu → subconjunto de memórias indexado.

## 5. Estimativa de esforço (indicativa)
- **Base de indexação (3.1) + testes (3.3):** **médio** — a pré-geração das páginas institucionais é o grosso (reutiliza o padrão das memórias, mas são ~13 rotas com conteúdo próprio).
- **Decisões SEO (3.2):** pequeno (já quase todas decididas).
- **Fase 2 (conteúdo):** próprio, orientado por aprovação editorial (variável consoante o nº de registos).

## 6. Governação e riscos
- `public-release-gated`: remover `noindex` é decisão de lançamento humana.
- scope-check: iniciativa `INIT-MUSEUM` + portal.
- Riscos: qualidade de SEO de um SPA (mitigada pela pré-geração); alterar testes-guarda exige rigor (preservar a intenção).

## 7. Decisão pedida (quando quiser avançar)
- [ ] Aprovar este pacote de indexação (técnico) e a Fase 1.
- [ ] Confirmar as decisões SEO em falta (x-default).
- [ ] Agendar a Fase 2 com a aprovação editorial do Museu.
