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

### PENDING — `milreu-hoje.jpg` (NÃO versionar o ficheiro bruto)
`PUBLIC_SOURCE_REDISTRIBUTION = PENDING`.
- Autor: **José António Paula Brito**. Registo committed (`docs/exhibition/inventory/MILREU_EXPO_CAMADAS_DOCUMENTAIS_v1.1.md`, L79): **autoria/data/proveniência/direitos = A CONFIRMAR**; uso autorizado = **apenas referência interna de mockup**; **não apto à arte-final**.
- Não há autorização explícita de **redistribuição no repositório público**. Por decisão humana (FASE A2, ponto 4) e por não se inferir redistribuição a partir de uso: **o ficheiro bruto não é adicionado ao Git público.**
- Registado apenas aqui: SHA-256 `4d8bf958…`, proveniência, caminho lógico (`original-reference/milreu-hoje.jpg`), consumidor (poster), e **instrução de obtenção autorizada**: obter o ficheiro autorizado junto do responsável e colocá-lo em `original-reference/milreu-hoje.jpg` antes de regenerar o poster.
- **Flag separada (fora do âmbito A2):** o poster aprovado usa este ativo como arte-final apesar do estado «apenas mockup interno» — a rever pelo responsável (não alterado nesta fase).

## Reprodução
Com fontes (`FONTS_MANIFEST.md`) e dependências (`BUILD_ENVIRONMENT.md`) do operador, um checkout limpo regenera os Itens 3–9 **exceto** o poster, que fica dependente do `milreu-hoje` (PENDING) acima. Ver `A2_REPRODUCIBILITY_REPORT.md`.
