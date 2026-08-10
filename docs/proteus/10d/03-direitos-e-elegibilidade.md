<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# 03 — Direitos e elegibilidade (fail-closed)

## Princípio

A **exposição por API é uma dimensão de direitos independente da publicação**. Um registo estar
`published` no catálogo humano **não** o torna elegível para a API. Por omissão, a API **nega**.

## Condições cumulativas

Um item só entra numa coleção quando **todas** forem verdadeiras:

1. estado editorial **`published`**;
2. **fonte pública** adequada (`sources` não vazio);
3. **data de revisão** (`lastReviewed`);
4. permissão explícita de exposição por API igual a **`allow`** — procurada em `apiExposure`,
   `rights.apiExposure` ou `publicApi.decision`;
5. apenas campos **allowlisted** (ver `src/proteus/public-api.mjs`), sem URL privada, texto
   integral, nota interna, dado pessoal ou material restrito.

Ausência, `unknown`, `deny`, `in_review`, `draft`, `withdrawn`, `superseded` ou conflito de
direitos **excluem** o item. A saída **não** explica qual item foi excluído nem o contabiliza.

## Porque as coleções começam vazias

Na base `9386e98`:

- as 3 obras e 2 autores do catálogo humano estão publicados, mas **nenhum** carrega `apiExposure:
  allow` — a permissão de API não foi comprovada;
- as 16 afirmações e as entidades do piloto estão `in_review`/`draft`, logo inelegíveis;
- o *snapshot* de conhecimento servido é `0/0/0`.

Resultado: `works/authors/assertions/entities/relations` = `[]`. O gerador **falha** se algum
registo for considerado elegível sem a permissão explícita (reforço *fail-closed*).

## Quem decide a exposição por API

A atribuição de `apiExposure: allow` a registos reais é uma **decisão editorial/de direitos**
futura (associada ao 10E e às decisões humanas pendentes), não a este pacote. O 10D apenas fornece
o mecanismo que a respeita.

© 2026 Fernando Rodrigues de Jácomo.
