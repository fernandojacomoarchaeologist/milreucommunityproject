# Direitos dos assets de produção (FASE A2)

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu.
> Fonte estruturada: `ASSET_MANIFEST.csv`. Esta pasta reúne os inputs canónicos de produção dos geradores (Itens 3–9), para reprodução a partir de um checkout limpo.

## Estrutura
- `production-derivatives/` — **PRODUCTION_DERIVATIVE**: derivados exactos (resize/crop/reencode) de originais do acervo, versionados porque o output aprovado depende dos seus bytes (não substituíveis por transformação on-the-fly sem alterar o resultado). **Não são novos originais.**
- `project-generated/` — **PROJECT_GENERATED**: ativos produzidos pelo projecto (ex.: ilustrações do Circuito geradas por IA).
- `original-reference/` — **ORIGINAL_REFERENCE**: referências lógicas a originais canónicos já versionados noutro local (não duplicar), e entradas **PENDING** cujo ficheiro bruto **não** entra no Git público.

## Direitos por classe

### PRODUCTION_DERIVATIVE (derivados do acervo)
Herdam os direitos do original do acervo: **`AUTHORIZED-FOR-PROJECT-PUBLICATION`**, **crédito obrigatório**, proveniência mantida. A autorização **não** é domínio público, sublicenciamento, dispensa de crédito nem autorização para treino de IA. Fonte de origem por asset em `ASSET_MANIFEST.csv` (`source_asset_id` → `source_canonico`).

### PROJECT_GENERATED (Circuito Educativo)
`oficina_escavacao.jpg`, `oficina_estratigrafia.jpg`, `oficina_mosaico.jpg` — **AI-generated / project-produced**. **Não são fotografia documental.** Disclosure obrigatório: **«representação conceptual · não documental»**. Propriedade do projecto; uso do projecto com disclosure. SHA-256 em `ASSET_MANIFEST.csv`. Consumidor: poster (Item 4).

### ORIGINAL_REFERENCE
- `MM202613.png` — o antigo `MM202613_hauschild.png` era **byte-idêntico** ao canónico `public/media/museum/originals/MM202613.png`; os geradores (poster, dossiê) foram **repontados** ao canónico. Não duplicar.

### `milreu-hoje.jpg` — NÃO consumido (referência morta removida)
Verificação FASE A2: `PHOJE`/`AHOJE` estavam **definidos mas nunca usados** no gerador do poster (nenhuma chamada de imagem). **Nenhum gerador consome `milreu-hoje`.** A referência morta foi **removida** do `poster_proof_print.py`; o poster reproduz-se **pixel-idêntico sem** este ficheiro.
- Não é versionado nem requerido para reprodução. Mantém-se apenas este registo factual: autor **José António Paula Brito**; registo committed (`MILREU_EXPO_CAMADAS_DOCUMENTAIS_v1.1.md`, L79): **direitos = A CONFIRMAR**, uso autorizado **apenas mockup interno**, **não apto à arte-final**.
- **Flag anterior retirada:** não há não-conformidade no poster — o `milreu-hoje` **não** está na arte-final (a foto de contexto usa `MM202608_ctx`, acervo histórico autorizado).

## Reprodução
Com fontes (`FONTS_MANIFEST.md`) e dependências (`BUILD_ENVIRONMENT.md`) do operador, um checkout limpo regenera **todos** os Itens 3–9 (poster incluído) sem stash/scratchpad/`/Users`. Ver `A2_REPRODUCIBILITY_REPORT.md`.
