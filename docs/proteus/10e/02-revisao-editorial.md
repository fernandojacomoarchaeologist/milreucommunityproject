<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# 02 — Revisão editorial humana

O pacote de revisão local reúne, de modo **determinístico**, as 16 afirmações `in_review` com
localizadores, entidades relacionadas, prioridade, verificações pendentes, classe epistémica,
confiança e limitações. É **repo-interno e não servido**.

## Comando local

```bash
node scripts/10e/build-review-packet.mjs            # stdout (por omissão)
node scripts/10e/build-review-packet.mjs --output /caminho/externo/packet.json
```

Nunca escreve sob `public/`, `src/` ou `data/proteus/`, nunca altera dados editoriais e nunca
inventa revisor. Distribuição atual: **8 `high`, 7 `normal`, 1 `time_sensitive`** (`a10c1-016`).

A bancada é **autossuficiente**: cada item traz texto, idioma, **confiança completa (nível +
razões + limitações, preservadas dos dados canónicos)**, proponente, instante, **localizadores
preservados** (`id/sourceId/locatorType/pageStart/pageEnd/label/url/accessedAt/notes`, sem citação),
entidades, prioridade, checks e condição temporal — revisável sem cruzar outro ficheiro.

## Gates humanos (núcleo `src/proteus/editorial-workflow.mjs`)

- decisões que alterem estado exigem `reviewerId` humano não vazio, `decidedAt` **ISO 8601** do
  operador, ação, comentário/justificação e **`checks` como objeto** `{evidence, rights,
  epistemicClass, publicSafety}` — todos `true` (arrays arbitrários são rejeitados); e
  `conflictOfInterest` **explícito** (`validateReviewRequest`);
- **`conflictOfInterest:true` bloqueia a própria transição editorial**, não apenas a publicação;
- **autoaprovação bloqueada** quando `reviewerId === assertion.proposedBy`;
- **integridade:** `proposeTransition` exige `request.assertionId === assertion.id`; divergência bloqueia;
- o código **valida e propõe** uma transição (`proposeTransition`), mas **não a aplica** aos 16
  registos neste PR; os registos de decisões e auditoria começam vazios;
- ausência de decisão, comentário ou revisor **nunca** equivale a aprovação;
- autoaprovação e conflito de interesse ficam visíveis e bloqueantes até política humana;
- `approve` leva a `approved` e **nunca** publica.
