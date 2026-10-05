# Decisões sobre indexação pública e direitos — 2026-10-05 (HUMAN/CANONICAL)

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> Registo das **decisões humanas** sobre a futura indexação pública do site e os direitos aplicáveis. **A indexação NÃO foi ativada** (ver «Estado»): é um pacote próprio (`SPEC_INDEXACAO_PUBLICA.md`). Este documento preserva as decisões para esse trabalho. A atribuição do projeto **não** transfere direitos de terceiros.

## Estado
- `noindex` **mantido** (site live em `editorial-preview`). A ativação depende do pacote de indexação (arquitetura + pré-geração + testes) e de nova decisão de lançamento.

## Decisões registadas
1. **Origem pública canónica:** `https://projectomilreu.pt` (confirmada).
2. **Imagem social (Open Graph) padrão:** o **logótipo** do Projecto Comunitário de Milreu (marca própria, direitos confirmados).
3. **Entidade responsável (dados estruturados):** o projeto **não** é uma organização; é um **projeto de investigação de doutoramento associado à Universidade do Algarve (UALG)**. Enquadrar como *«projeto de investigação associado à UALG»* (**afiliação**), **sem** afirmar que a UALG é proprietária ou que endossa o site. Dados estruturados mantidos **mínimos** (`WebSite` factual); **não** inventar `Organization`.
4. **x-default (hreflang):** só `pt-PT` publicado; EN/ES/FR não bloqueiam o lançamento PT (fallback explícito). Decisão de x-default fica para o pacote de indexação.

## Direitos (base declarada)
- **Conteúdo original do projeto:** **CC BY 4.0**, quando expressamente indicado.
- **Fotografias de terceiros** (de periódicos ou fontes antigas): utilizadas **com atribuição** (autor/arquivo/fonte quando conhecido + Fernando Rodrigues de Jácomo + outros devidos) e em base **não comercial**. O projeto **não** licencia obras de terceiros (não são suas para licenciar); reconhece a possibilidade de **reivindicação futura** e mantém **correção/remoção** a pedido fundamentado (política já publicada em `#/direitos`).
- Os provedores das fotografias selecionadas **libertaram** o uso pelo projeto; as restantes imagens históricas seguem a base acima.

## Memórias a indexar (Fase 2 — critério)
- Critério do responsável: **memórias relacionadas com datas < 1960** **e** memórias das **escavações dos anos 70–80**.
- Aplicação **registo a registo** durante a **aprovação editorial** (hoje os 31 registos estão `preliminary`). Casos a decidir caso a caso:
  - escavações de **1966** (anos 60, fora de «70–80»);
  - registos com **data em intervalo/desconhecida** (sem ano simples);
  - distinção entre `escavações` e `trabalho arqueológico` (ambos ligados às campanhas 70–80).
- **MM202617** permanece **`noindex`** sempre (retoque de IA em revisão).

## Pré-condições de lançamento (já cumpridas / em falta)
- ✅ HTTPS forçado · ✅ página `#/direitos` publicada · ✅ formulário operacional · ✅ QA do site.
- ⏳ **Em falta:** o **pacote de indexação** (arquitetura) + **aprovação editorial** do subconjunto de memórias + decisão final de lançamento.
