# ASSET_DEPENDENCY_AUDIT — FASE A · imagens de input das peças 2–9

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> **Objectivo:** auditar as imagens de input ainda externas ao source pack, classificar, resolver proveniência/direitos e propor política de versionamento **sem duplicação desnecessária**. **Não incorpora assets** (apenas audita/propõe) e **não inicia prepress CMYK.** Dados por-asset em `ASSET_MANIFEST.csv`.

## 1. Classificação

### A. Acervo do projecto (fotografias históricas MM2026*)
Rights na matriz `kit-digital-press/v1/04_IMAGENS/LEGENDAS_E_CREDITOS.csv`: **`authorized-for-project-publication`**, `project_official_publication=YES`; **`press_editorial_use` / `host_partner_republication` / `generic_third_party_redistribution` = PENDING** (condições da fonte aplicáveis). **Crédito obrigatório.**
- MM202601 (Torre do Tombo — Samorrinha), MM202603, MM202604, MM202607, MM202608 (Aldeia de Estoi), MM202613 (Coleção Celeste e Branca Pimenta).

### B. Derivados / crops de produção (do acervo)
Versões preparadas (crop/formato) usadas pelos geradores — **não são o original canónico**. Mesmos direitos do acervo de origem. **Partilha entre peças (dedup):** vários são **byte-idênticos** entre Item 4 e Item 5/6 (mesmo SHA-256):
- `MM202601-original.jpg` ≡ `MM202601_procissao.jpg` · `MM202603-original.jpg` ≡ `MM202603_pessoas.jpg` · `MM202608.png` ≡ `MM202608_contexto.png`.
- `MM202604_crop.png` já está **versionado** em `dossie-convite/final/editaveis/imagens/`.

### C. Não-acervo — foto real
- **`milreu-hoje.jpg`** = **byte-idêntico** ao canónico `public/media/exhibition/q3/lugar-hoje.jpg` (já no repo). **Foto real do sítio.** **Autor/crédito: José António Paula Brito.** Uso do projecto **VALIDATED** (registo de direitos da exposição). **Não é gap** — referenciar o canónico.

### D. Ilustrações geradas por IA (Circuito Educativo)
- `circuito/oficina_{escavacao,estratigrafia,mosaico}.jpg` = **derivados** (jpg) das **ilustrações conceptuais geradas por IA** canónicas em `docs/dissemination/poster-congresso/assets/circuito_*.png` (já no repo, com `ASSET_NOTICE.md`). **Propriedade do projecto; geradas por IA.** **Rotulação obrigatória:** «representação conceptual · **não documental**» (política do poster). **Não** são registo fotográfico nem actividade executada.

### Direitos — confirmados vs pendentes
- **Confirmados para uso do projecto:** todo o acervo (project publication), `milreu-hoje` (foto real validada, crédito Paula Brito), circuito (IA do projecto, com disclosure).
- **Pendentes (não bloqueiam uso do projecto nem versionamento):** `press_editorial_use` / `host_partner_republication` / `generic_third_party_redistribution` do acervo. **→ Nenhum asset com direitos *incertos* a exigir HUMAN GATE para versionamento de uso-do-projecto.** (O que permanece é a **redistribuição a terceiros**, já coberta pelo rights gate do Item 9.)

## 2. Proveniência resolvida (pontos antes em aberto)
- **`milreu-hoje`** → `public/media/exhibition/q3/lugar-hoje.jpg`; «Ruínas hoje»; **José António Paula Brito**; uso do projecto VALIDATED (fonte: `poster_congresso_milreu_data.md` → `# image_assets` / `# credits` + `docs/exhibition/EXHIBITION_ASSET_RIGHTS_MATRIX_v1.md`).
- **`circuito/*`** → canónicos `poster-congresso/assets/circuito_*.png`; **ilustração IA do projecto**; disclosure obrigatório (mesma fonte).

## 3. Proposta de política de versionamento (sem duplicação)
**Três camadas, uma fonte-de-verdade por original:**
1. **Original canónico** — mantém-se onde já está: acervo em `public/media/museum/originals/`; foto do sítio em `public/media/exhibition/q3/`; IA do circuito em `docs/dissemination/poster-congresso/assets/`. **Nunca duplicar o canónico.**
2. **Derivados de produção** (crops/formatos preparados usados pelos geradores):
   - Se **byte-idêntico a um canónico** (ex.: `MM202613_hauschild.png`≡`MM202613.png`, `milreu-hoje.jpg`≡`q3/lugar-hoje.jpg`) → **não versionar o derivado**; **repontar o gerador** para o canónico (follow-up com re-verificação de reprodução, HUMAN GATE porque toca em bytes de input).
   - Se **genuinamente derivado** e **partilhado** entre peças (mesmo SHA) → versionar **UMA vez** em `docs/dissemination/_SOURCES_SHARED/assets/<asset_id>/<ficheiro>` e os geradores referenciam aí (sem triplicar). Registar no `ASSET_MANIFEST.csv`.
   - Se **específico de uma peça** → versionar em `.../<peça>/source/assets/`.
3. **Registo obrigatório** por derivado no `ASSET_MANIFEST.csv`: `asset_id · ficheiro · sha256 · tamanho · classificação · canónico idêntico · origem · crédito · rights_status · usado_por`.

**Tamanho:** `MM202608.png` (5,3 MB) é o único derivado grande de acervo que exigiria versionamento (os restantes 26–800 KB). O hauschild (14,3 MB) **deixa de ser necessário** (repontar ao canónico idêntico).

## 4. O que ainda impede reprodução 100% autónoma (hoje)
Para um terceiro regenerar **sem** a árvore de trabalho/`scratchpad`, faltam **apenas**:
1. **Derivados de produção do acervo** (crops) não versionados — decisão de versionar por política (secção 3). Lista exacta: `MM202601-original.jpg` (617 KB), `MM202603-original.jpg` (320 KB), `MM202607-original.jpg` (26 KB), `MM202608.png` (**5,3 MB**), `MM202608_ctx.jpg` (797 KB). *(MM202604_crop.png já versionado.)*
2. **Derivados jpg do circuito** (`oficina_*.jpg`) — OU versionar os 3 jpgs (≤870 KB cada, IA do projecto com disclosure) OU **repontar o gerador do poster** para os `.png` canónicos (muda bytes → re-verificar reprodução).
3. **Assets byte-idênticos a canónicos** (`MM202613_hauschild.png`, `milreu-hoje.jpg`) — **não faltam**; basta **repontar os geradores** (Item 4 poster, Item 7 dossiê) aos caminhos canónicos.
4. **Ficheiros de fonte** (Fraunces/Spectral/Archivo) — por política, não versionados (`FONTS_MANIFEST.md`).
5. **Dependências pip** — instaladas pelo operador (`BUILD_ENVIRONMENT.md`).

> **Nenhum item desta lista tem direitos incertos.** As decisões em aberto são de **política (tamanho/dedup)** e de **repontar geradores** — ambas requerem HUMAN GATE porque alteram o source pack / bytes de input, **não** por risco de direitos.

## 5. Próximo (FASE A2, após decisão humana — NÃO executado aqui)
- Confirmar a política (secção 3) e autorizar: (a) versionar os derivados de acervo pequenos + `MM202608.png` em `_SOURCES_SHARED/assets/`; (b) repontar geradores aos canónicos para hauschild/milreu-hoje; (c) decidir circuito (versionar jpg vs repontar png).
- Só depois, e separadamente: **FASE B — prepress CMYK com o ICC real da gráfica.**
