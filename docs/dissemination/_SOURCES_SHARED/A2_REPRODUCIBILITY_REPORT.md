# A2_REPRODUCIBILITY_REPORT — Reprodutibilidade real dos Itens 3–9

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.

## Objectivo
Garantir que um checkout limpo de `main` regenera os materiais finais dos Itens 3–9 **sem stash, sem caminhos `/Users/…` e sem assets externos implícitos** (apenas fontes e dependências do operador). Decisões humanas FASE A2 aplicadas; design/copy/spacing/outputs aprovados **inalterados**.

## Correção ao audit anterior
O `ASSET_DEPENDENCY_AUDIT.md` assumia canónicos committed para `milreu-hoje` (`q3/lugar-hoje.jpg`) e circuito (`poster-congresso/assets/circuito_*.png`). **Nenhum existe em `main`** — estavam apenas no working tree/stash. Esta fase corrige isso.

## Classificação e acções (decisões aplicadas)

### PRODUCTION_DERIVATIVE — `_SOURCES_SHARED/assets/production-derivatives/`
Derivados exactos (resize/crop/reencode) de originais do acervo, **versionados** (Opção B) porque o output aprovado depende dos seus bytes. Dedup por SHA-256 (nomes de consumidores distintos apontavam ao mesmo ficheiro). Rights herdados (`AUTHORIZED-FOR-PROJECT-PUBLICATION`, crédito).

| asset | SHA-256 | fonte | consumidores |
|---|---|---|---|
| MM202601_procissao.jpg | bca8a026… | MM202601.png | poster, materiais, dossiê |
| MM202603_pessoas.jpg | 81c2b49c… | MM202603.png | poster, materiais, dossiê |
| MM202608_contexto.png | f05f61fc… | MM202608.jpg | poster, materiais, convite |
| MM202608_ctx.jpg | 0c56eead… | MM202608.jpg | poster |
| MM202608_hero.png | 7f6f73be… | MM202608.jpg | materiais |
| MM202608_nb.png | f8e53a63… | MM202608.jpg | materiais |

### PROJECT_GENERATED — `_SOURCES_SHARED/assets/project-generated/circuito/`
`oficina_{escavacao,estratigrafia,mosaico}.jpg` — **AI-generated / project-produced**, disclosure «representação conceptual · não documental», não-fotografia. Versionados (autorizado). Consumidor: poster.

### ORIGINAL_REFERENCE — repoint (não duplicar)
- **hauschild** → `public/media/museum/originals/MM202613.png` (byte-idêntico); poster e dossiê repontados.
- dossiê `MM604c` → `editaveis/imagens/MM202604_crop.png` (já committed); `detail.webp` e `MM202608.jpg` já canónicos.

### `milreu-hoje` — NÃO consumido (verificação decisiva)
Ao testar o checkout limpo descobriu-se que `PHOJE`/`AHOJE` estavam **definidos mas nunca usados** no `poster_proof_print.py` (nenhuma chamada de imagem). **Nenhum gerador consome `milreu-hoje`.** A referência morta foi **removida**; o poster reproduz-se **pixel-idêntico sem** o ficheiro. Rights (A CONFIRMAR / mockup interno) registados em `RIGHTS.md` apenas para memória factual.
> **Flag anterior RETIRADA:** não há não-conformidade no poster — `milreu-hoje` **não** está na arte-final (a foto de contexto é `MM202608_ctx`, acervo histórico autorizado).

`MM202607` — removido do conjunto: **nenhum gerador o consome**.

## Geradores repontados
`poster_proof_print.py`, `flyer_marcador_build.py`, `convite_arte_final.py`, `dossie_generator.py`, `_SOURCES_SHARED/prepress/make_editable_vector.py`. Todos passam a resolver assets na estrutura canónica (`_SOURCES_SHARED/assets/…`) ou em `public/media/…`. **Sem** `/Users/…`, scratchpad ou stash.

## Reprodução (regenerado vs outputs aprovados)
| Item | Output | Resultado |
|---|---|---|
| 5 Materiais | flyer/marcador PRINT | **pixel-idêntico** (média 0.0000, max 0) |
| 6 Convite | A4 (raster) | visual-idêntico (ruído JPEG 0.15% px>24) |
| 7 Dossiê | PRINT P1–P4 | **pixel-idêntico** (0.000, 4/4) |
| 4 Poster | PRINT A0 | **pixel-idêntico** (0.000) — sem qualquer PENDING |
| 4+5 Editáveis | SVG vetor | **byte-idêntico** (git diff vazio) |

Itens **3 (Orçamento)**, **8 (Cartaz)** e **9 (Kit)**: usam só canónicos committed → já reproduzíveis (sem gap).

### Teste de checkout limpo (worktree sem stash/scratchpad-assets)
Worktree em detached HEAD do commit A2, sem stash nem assets de scratchpad; só ficheiros committed + fontes/deps do operador:
- **Materiais** regenerado → **pixel-idêntico** (max=0).
- **Dossiê** generator corre e produz as previews.
- **Poster** generator corre **sem erro** e **sem `milreu-hoje`** (confirmou a referência morta).
→ Nenhuma dependência de stash/`/Users`/scratchpad. **Reprodução a partir de checkout limpo: PASS.**

## Verificação
- Sem referências a `/Users/…`, scratchpad ou stash nos geradores.
- `npm run validate` → **PASS (exit 0)**.
- `npm test` → **641/641**.
- Teste de checkout limpo (worktree sem stash/scratchpad): ver secção abaixo.

## Dependências do operador (não versionadas, por política)
- Fontes Fraunces/Spectral/Archivo (`FONTS_MANIFEST.md`).
- Dependências pip (`BUILD_ENVIRONMENT.md`).
- (Nenhum asset PENDING bloqueia a reprodução.)

## Auditoria do `stash@{0}`
Todos os assets necessários à reprodução estão agora **versionados** (`production-derivatives/`, `project-generated/circuito/`) ou são **canónicos committed** (hauschild→`MM202613.png`, `MM202608.jpg`, `detail.webp`, `immersive.webp`, `MM202604_crop.png`). O único asset exclusivo do stash relevante era o `milreu-hoje`, que **não é consumido**. **→ O stash não contém nenhuma dependência única necessária à reprodução dos Itens 3–9.**
- Para efeitos de reprodução: **descartável**.
- Nota: o `stash@{0}` contém ainda WIP do utilizador não relacionado (ex.: originais apagados, pastas de trabalho, regressão do convite). O descarte final (`git stash drop`) é decisão do responsável — este relatório apenas certifica que **nada ali é necessário para regenerar os materiais finais**.
