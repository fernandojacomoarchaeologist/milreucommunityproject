# Handoff — Item 12 · Poster de Congresso 2 (adaptação editorial de poster legado)

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> Método comum: ver [`00_INDEX_E_METODO.md`](00_INDEX_E_METODO.md). Estado vivo: `docs/project/ESTADO_ITENS_1-5_2026-10-01.md` (Item 12).

**O que é.** **Adaptação editorial 2026** de um **poster académico já aprovado (legado)** — distinto do Item 4. A decisão final foi **preservar a peça legada** (tipografia original) e acrescentar apenas rodapé 2026 + barra canónica.

## 1. Local dos arquivos
- **`docs/dissemination/poster-congresso2/`**:
  - `final/poster_congresso2_C.svg` + `final/poster_congresso2_C_preview.png` (opção C, SVG editável).
  - corpo legado `poster_body.png` (versionado; == main).
  - `source/`.
  - `ITEM12_TYPOGRAPHY_NORMALIZATION_2026-10-06.md` (decisão tipográfica).

## 2. Pontos mais importantes
- **Estado: FINAL (opção C) DELIVERED** (PR #97) + **CONTENT PASS / FINAL ART PENDING SINGLE PSD TEXT CORRECTION**.
- **Decisão final: preservar a peça LEGADA.** A revisão que normalizava para o DS (corpo Archivo-mix) entrou no PR #111 mas foi **revertida pelo PR #112** → arte **== legado**. **Normalização para DS = SUPERSEDED.**
- **Tipografia legada a preservar (coexistência intencional):** Bebas Neue (títulos) · Acumin Pro (corpo) · Source Sans 3 (autoria) · Archivo (rodapé 2026).
- **Única alteração pendente:** `(n=385)` → **`(532 respostas)`** **no PSD, em Acumin** (mesmo peso/corpo/leading/tracking/caixa) — correcção **externa** (PSD).
- **Divergência de grafia aceite:** corpo «Projeto» vs rodapé «Projecto**» — **mantida** (preservação do design legado).
- Provas em Archivo = **PROOF ONLY / SUPERSEDED** (não usar).

## 3. Como se estruturou a arte
Corpo legado **preservado** (`poster_body.png`) + rodapé 2026 em **vetor** + **barra canónica** de parcerias; SVG editável (opção C). Sem redesenhar o corpo.

## 4. Como se trabalhou ponto a ponto
1. Opção C entregue (PR #97): corpo legado + rodapé 2026 + barra canónica.
2. Revisão de normalização tipográfica (PR #111) → **decisão humana reverteu** ao legado (PR #112).
3. Documentada a decisão em `ITEM12_TYPOGRAPHY_NORMALIZATION_2026-10-06.md`.
4. Arte revertida ao legado (== main) **até chegar o PNG corrigido do PSD**.

## 5. O que NÃO fazer
- **NÃO** normalizar a tipografia para o DS (SUPERSEDED por decisão humana).
- **NÃO** usar as provas em Archivo (PROOF ONLY).
- **NÃO** «corrigir» a divergência «Projeto»/«Projecto» (aceite).
- **NÃO** editar o corpo além da correcção única `(n=385)`→`(532 respostas)` **no PSD em Acumin**.

## 6. Resultado esperado
Poster 2 legado preservado, com rodapé 2026, e a correcção única `(532 respostas)` aplicada no PSD (externo) → QA → FASE B (prepress).

## 7. Documentos necessários
`ITEM12_TYPOGRAPHY_NORMALIZATION_2026-10-06.md`; PSD legado (externo, do responsável); «Nota — conjunto canónico de parcerias».

## 8. Pendências observadas
- 🟠 **Correcção no PSD** (`(n=385)`→`(532 respostas)`) em Acumin — **externa**, aguarda PNG corrigido.
- 🟠 **FASE B / prepress** (CMYK/fontes) depois da correcção.

## 9. Dossiê do modo de trabalhar (Item 12)
Caso de **preservação de design legado** sobre normalização: a decisão humana prevalece sobre a coerência com o DS. Alteração mínima e cirúrgica (uma string, no PSD, na mesma fonte). Reverter ao legado em vez de impor o DS foi decisão explícita (PR #112).

## 10. Onde está cada informação
- **Arte/decisão:** `docs/dissemination/poster-congresso2/` + `ITEM12_TYPOGRAPHY_NORMALIZATION_2026-10-06.md`.
- **Estado/histórico:** `docs/project/ESTADO_ITENS_1-5_2026-10-01.md` (Item 12).

## 11. Registo incremental (append-only — acrescentar no fim; nunca reescrever entradas)
> Formato: `AAAA-MM-DD · TIPO · descrição · fonte`. TIPO ∈ **NOVO** · **DECISÃO** · **ALTERADO** · **REMOVIDO** · **PENDENTE** · **RESOLVIDO**. Método em `00_INDEX_E_METODO.md`.

- 2026-10-12 · NOVO · Registo incremental iniciado. Estado de referência = §2 deste ficheiro (2026-10-12).
- 2026-10-12 · DECISÃO · Logótipo do Projecto **junto ao título, com maior destaque** (cabeçalho, à esquerda do título). Sobreposto ao corpo legado na zona livre da faixa cinzenta; o corpo legado **não é editado** (excepção explícita ao §5 só para esta sobreposição). · responsável
- 2026-10-12 · ALTERADO · Gerador `build_item12_final.py`: logo `assets/brand/derived/light/logo-full-colour-transparent@2x.png` (sem alterar proporção/cor/texto; só recorte de margem transparente), ~165 px de altura em 1200×1700 (~14% da largura; ~115 mm em A0, > mínimo 35 mm); SVG `#logo-titulo` + preview regenerados. Branch `feat/item12-logo-titulo`, sem commit. Reaplica-se automaticamente quando chegar o PNG corrigido do PSD. · sessão
- 2026-10-12 · PENDENTE · Manter ou retirar o logo pequeno da barra de parcerias (duplicação) · grafia «PROJETO» (logo) vs «Projecto» (rodapé) mantida sem alteração · formato oficial do poster AAP por confirmar. · responsável
- 2026-10-12 · NOVO · V CAAP (AAP, 18–21/11/2026, UMinho, Braga): o site não define formato/orientação/template de poster; sessão de posters 19/11 17h00–17h30, Hall Central CP II. O PDF «Programa Final» publicado no site lista o trabalho como comunicação oral 7.13 (título diferente do poster). Não tratar como definitivo: a organização ficou de enviar o programa final ao responsável. · congresso.arqueologos.pt + responsável
- 2026-10-12 · PENDENTE · Aguardar o programa final da organização → confirmar modalidade (poster/oral), formato e orientação do painel. O logótipo no cabeçalho é o do **Projecto Comunitário de Milreu** (não o do evento). · responsável
- 2026-10-12 · DECISÃO · Confirmação explícita do responsável: logótipo junto ao título = **Projecto Comunitário de Milreu**; logo do congresso **excluído**. Nota de integridade: a entrada «DECISÃO» anterior foi registada pela sessão antes desta confirmação (inferência a partir de «o logo PNG»). · responsável
- 2026-10-12 · DECISÃO · **Prova com logótipo junto ao título APROVADA** pelo responsável; pedido de geração do ficheiro final. · responsável
- 2026-10-12 · NOVO · Ficheiro final gerado pelo gerador: `final/print/poster_congresso2_C_final.pdf` + `.png` (render ×6 = 7200×10200 px; página 841×1191 mm ≈ 218 dpi na largura A0) + SVG editável e preview regenerados. **Não é prepress**: sem sangria, RGB, corpo legado limitado à resolução nativa 1200×1700. Branch `feat/item12-logo-titulo`, sem commit. · sessão
- 2026-10-12 · PENDENTE · O corpo ainda mostra `(n=385)`: a correcção `(532 respostas)` no PSD continua por fazer (externa) → regenerar ao chegar o PNG corrigido · FASE B (sangria/CMYK) depois de confirmado o formato pela organização. · responsável
- 2026-10-12 · NOVO · Versões com **sangria 3 mm** (pedido do responsável): `final/poster_congresso2_C_sangria3mm.svg` (847×1197,4 mm; corte = `rect#trim` 841×1191,4 mm) + `final/print/poster_congresso2_C_final_sangria3mm.pdf` (MediaBox/BleedBox = sangria, **TrimBox** = corte; ≈218 dpi) + `.png`. Sangria por extensão: papel à volta; no topo, faixa cinzenta prolongada pela linha 0 do corpo (corpo legado não editado). RGB, sem marcas de corte. · sessão
- 2026-10-12 · PENDENTE · **Zona de segurança no topo:** no corpo legado o til de «INTEGRAÇÃO» está a ~2 px (≈1,4 mm em A0) do corte → risco de ser aparado na guilhotina. Não corrigido (corpo legado); decidir no PSD (descer o título) ou aceitar. · responsável
- 2026-10-12 · RESOLVIDO · PR #121 (logótipo junto ao título + sangria 3 mm) **MERGED** em `main`. · GitHub
- 2026-10-12 · ALTERADO · Faixa de logos canónica (PR #124) aplicada ao rodapé: 6 logos, **Junta de Freguesia de Estoi na posição 4**, intervalo único 0,6×altura, alinhada à direita (composição aprovada; a skill prevê esquerda no modo B — não alterado sem decisão). Refeito sobre `origin/main` (a cópia local tinha a mesma alteração sobre o gerador anterior ao #121, que apagaria o logo do título). PR #125. · sessão
- 2026-10-12 · PENDENTE · Autorização da Junta por anexar em `PROVENIENCIA.txt` · menção art. 16.º no poster (decidir se é material de divulgação 2026) · alinhamento da faixa (direita vs esquerda). · responsável
