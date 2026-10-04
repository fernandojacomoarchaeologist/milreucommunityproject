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

### PENDING — `milreu-hoje`
`PUBLIC_SOURCE_REDISTRIBUTION = PENDING`. Registo committed (`MILREU_EXPO_CAMADAS_DOCUMENTAIS_v1.1.md`, L79): direitos **A CONFIRMAR**, uso autorizado **apenas mockup interno**. Sem autorização explícita de redistribuição pública → **ficheiro bruto NÃO versionado**. Só manifest/SHA/proveniência/caminho lógico/consumidor/instrução de obtenção (ver `RIGHTS.md`). O gerador do poster fica a aguardar o ficheiro fornecido pelo operador em `original-reference/milreu-hoje.jpg`.
> **Flag separada:** o poster aprovado usa `milreu-hoje` como arte-final apesar do estado «mockup interno» — a rever pelo responsável (não alterado nesta fase).

`MM202607` — removido do conjunto: **nenhum gerador o consome**.

## Geradores repontados
`poster_proof_print.py`, `flyer_marcador_build.py`, `convite_arte_final.py`, `dossie_generator.py`, `_SOURCES_SHARED/prepress/make_editable_vector.py`. Todos passam a resolver assets na estrutura canónica (`_SOURCES_SHARED/assets/…`) ou em `public/media/…`. **Sem** `/Users/…`, scratchpad ou stash.

## Reprodução (regenerado vs outputs aprovados)
| Item | Output | Resultado |
|---|---|---|
| 5 Materiais | flyer/marcador PRINT | **pixel-idêntico** (média 0.0000, max 0) |
| 6 Convite | A4 (raster) | visual-idêntico (ruído JPEG 0.15% px>24) |
| 7 Dossiê | PRINT P1–P4 | **pixel-idêntico** (0.000, 4/4) |
| 4 Poster | PRINT A0 | **pixel-idêntico** (0.000) — com `milreu-hoje` fornecido |
| 4+5 Editáveis | SVG vetor | **byte-idêntico** (git diff vazio) |

Itens **3 (Orçamento)**, **8 (Cartaz)** e **9 (Kit)**: usam só canónicos committed → já reproduzíveis (sem gap).

## Verificação
- Sem referências a `/Users/…`, scratchpad ou stash nos geradores.
- `npm run validate` → **PASS (exit 0)**.
- `npm test` → **641/641**.
- Teste de checkout limpo (worktree sem stash/scratchpad): ver secção abaixo.

## Dependências do operador (não versionadas, por política)
- Fontes Fraunces/Spectral/Archivo (`FONTS_MANIFEST.md`).
- Dependências pip (`BUILD_ENVIRONMENT.md`).
- `milreu-hoje.jpg` (PENDING — obter autorização e colocar em `original-reference/`).

## Stash
Auditoria do `stash@{0}` para dependências únicas: ver secção final (após teste de checkout limpo).
