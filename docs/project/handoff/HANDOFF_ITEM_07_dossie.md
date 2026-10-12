# Handoff — Item 7 · Dossiê «convite ao convite» (booklet A5, 4 páginas)

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> Método comum: ver [`00_INDEX_E_METODO.md`](00_INDEX_E_METODO.md). Estado vivo: `docs/project/ESTADO_ITENS_1-5_2026-10-01.md` (Item 7).

**O que é.** **Booklet A5, 4 páginas** — dossiê institucional para convidar espaços (museus, bibliotecas, escolas, universidades, autarquias, associações) a **acolher a exposição itinerante** «Entre Ruínas e Memórias». Distribuição em **PDF**. Grafia pré-AO90 «Projecto».

## 1. Local dos arquivos
- **`docs/dissemination/dossie-convite/final/`**:
  - `DOSSIE_Entre_Ruinas_e_Memorias_DIGITAL.pdf` — RGB, 4×A5 (148×210), **6 hyperlinks** + QR funcional.
  - `DOSSIE_Entre_Ruinas_e_Memorias_PRINT.pdf` — **CMYK · PDF/X-3:2002**, 4×A5 + 3 mm sangria + marcas + TrimBox/BleedBox + OutputIntent (perfil «Generic CMYK» — **confirmar c/ gráfica**).
  - `DOSSIE_Entre_Ruinas_e_Memorias_LIVRETO_A4.pdf` — imposição 1 folha A4 landscape (duplex, dobra ao meio).
  - `editaveis/dossie_generator.py` (SVG vetorial, texto vivo) + `07_P1–P4.svg` + imagens + QR svg/png.
  - `_PRANCHA_FINAL.png` + `QA_REPORT.md`.
- **Previews FASE 1:** `docs/dissemination/dossie-convite/v1/previews/` (P1–P4 PNG) + `v1/RELATORIO_FASE1.md`.
- **Finalização** `scratchpad/item7_build` + `item7_finalize.py` — **não versionados**.

## 2. Pontos mais importantes
- **Estado:** `FINAL ART DELIVERED — AAMLF DISPLAY SYSTEM + SVG VETORIAL` (PRs #106→#110→#113). Direcção **congelada** (arquitectura, imagens, hierarquia, copy, diagramas, parceiros). **Aguarda prepress** (CMYK/fontes) + prova física do QR/livreto.
- **P3 v2 — INTEGRADA NA ARTE-FINAL (HUMAN PASS 2026-10-12; sem commit):** material «PVC expandido, impressão em vinil laminado» (sem espessura/peso); ordenação **frente/verso** (Q1→Q6 frente, Q7→Q12 verso; Q1/Q12 costas com costas), diagramas «em linha — suportes próprios» / «em ziguezague — estruturas AAMLF (presas entre si)», bloco **AMBIENTE** (interior; exterior ≤ 4 h com responsável), sem triangular, sem fotografia, sem marca/estado dos suportes. Ver §11.
- *(Histórico, substituído pela P3 v2:)* **P3** reescrita = **sistema de expositores AAMLF**: 7 estruturas **metálicas** / 2 faces / até 14 superfícies; 2 diagramas em vista de topo (**núcleos 2+2+3** + **ziguezague contínuo**); «MONTAGEM AUTÓNOMA — EM DESENVOLVIMENTO» (esquema conceptual).
- **P4 (2026-10-12):** COMO PEDIR (site «Quero expor» `#/participar/expor` + QR → formulário) · CONTACTOS lado a lado (Fernando | Meira Pinto/AAMLF `museu.lyceu@aejdfaro.pt`) · FICHA TÉCNICA 3 colunas = Q12. Ver §11.
- *(Histórico, substituído 2026-10-12:)* **P4** = bloco **PARCERIA E ACOMPANHAMENTO** (AAMLF · **Meira Pinto** · interlocutor · `museu.lyceu@aejdfaro.pt` · morada publicável) + linha editorial MSF + contactos do Projecto. **NIF da AAMLF NÃO incluído** (dado administrativo).
- **Bloco institucional só na última página** (P4 = fecho editorial).
- **PNG byte-idêntico** ao preview committado (correr gerador com `ITEM7_DPI=300`).

## 3. Como se estruturou a arte
- P1 capa · P2 Projecto/Museu/Exposição · P3 a exposição no espaço (expositores AAMLF) · P4 convite + contactos + QR (`projectomilreu.pt`) + **barra canónica de parcerias** (5 logos, safe-area real, não encostam ao corte).
- **Narrativa de imagens:** Lugar (**MM202608**) → Comunidade (**MM202602** + **MM202604** recortada + **MM202613**) → Exposição (diagramas) → Convite (**MM202601**); sem repetições. Fotografias reais autorizadas; **sem IA**.
- 2 famílias tipográficas no gerador original (Fraunces + Spectral) → backend SVG vetorial editável.

## 4. Como se trabalhou ponto a ponto
1. FASE 1 — previews das 4 páginas (PIL, 150 dpi).
2. Patch MSF 2026 só na P4 (sem reabrir arquitectura) + logos em safe-area (PR #79/#83).
3. Reescrita P3/P4 para expositores AAMLF + bloco parceria (PR #106/#110).
4. Gerador **reconstruído com SVG vetorial editável** (texto vivo, 4×`07_P1–P4`) + PDFs regenerados (PR #113).
5. Portas de legibilidade PASS (A5 100%, logos P4, PPI ≥275, QR matriz, hyperlinks).

## 5. O que NÃO fazer
- **NÃO** reabrir P1/P2 nem a arquitectura geral (congelada).
- **NÃO** incluir o **NIF da AAMLF** (dado administrativo, fora do repo).
- **NÃO** inserir fotos dos expositores (só referência; registadas para o Item 11). *(Reafirmado 2026-10-12: foto da montagem de 10-10 testada e retirada.)*
- **NÃO** mencionar marca/modelo (VEVOR) nem o estado de teste dos suportes próprios.
- **NÃO** apresentar a configuração triangular.
- **NÃO** usar IA nas imagens; **NÃO** repetir imagens.
- **NÃO** inventar o cargo de Meira Pinto: no dossiê usa-se o papel decidido para o Q12 — «Coordenação institucional» (2026-10-12); outro cargo/título = confirmar.
- **NÃO** alterar `QR_projectomilreu.*` (QR canónico do site, dependência dos Itens 10 e 11); o QR da P4 é `QR_quero_expor.*`.
- **NÃO** pôr o bloco institucional fora da P4.

## 6. Resultado esperado
Booklet A5 (DIGITAL + PRINT + LIVRETO_A4) pronto para distribuição e, após prepress/prova física, para impressão.

## 7. Documentos necessários
`final/QA_REPORT.md`, `v1/RELATORIO_FASE1.md` (tabela de contexto das imagens), `docs/dissemination/RIGHTS_DECISIONS_2026-10-05.md`; «Nota — directiva de recomposição do bloco institucional (2026-10-02)».

## 8. Pendências observadas
- 🟠 **Prepress** (CMYK/fontes) + confirmação do perfil «Generic CMYK».
- 🟠 **Prova física** do QR + do livreto dobrado.
- 🟠 **Forma de exibição dos créditos** das fotografias (`creditRequired`) a decidir.
- ⚪ *(2026-10-12)* `collect_editaveis` já não falha; mantém-se a referência morta a `../item5_build/` (inócua).
- 🟠 Referência morta a `../item5_build/` no passo opcional `collect_editaveis` do `dossie_finalize.py` (cosmético; imagens já em `editaveis/imagens/`).

- 🟠 **P3 v2 integrada e PDFs regenerados (2026-10-12)** → falta **commit/PR** (HUMAN GATE).
- ⚪ Opção triangular: **não é opção** por agora (não reintroduzir sem decisão).

## 9. Dossiê do modo de trabalhar (Item 7)
Peça institucional com **narrativa de imagens** cuidada e **texto vivo vetorial**. Atualizações cirúrgicas (só P3/P4) sem reabrir a arquitectura congelada. Dados administrativos sensíveis (NIF) **fora** do repo. Bloco de parcerias recomposto (não «encaixado no fundo»), só na última página.

## 10. Onde está cada informação
- **PDFs + editáveis:** `docs/dissemination/dossie-convite/final/`.
- **Contexto das imagens:** `v1/RELATORIO_FASE1.md`. **QA:** `final/QA_REPORT.md`.
- **Estado/histórico:** `docs/project/ESTADO_ITENS_1-5_2026-10-01.md` (Item 7).

## 11. Registo incremental (append-only — acrescentar no fim; nunca reescrever entradas)
> Formato: `AAAA-MM-DD · TIPO · descrição · fonte`. TIPO ∈ **NOVO** · **DECISÃO** · **ALTERADO** · **REMOVIDO** · **PENDENTE** · **RESOLVIDO**. Método em `00_INDEX_E_METODO.md`.

- 2026-10-12 · NOVO · Registo incremental iniciado. Estado de referência = §2 deste ficheiro (2026-10-12).
- 2026-10-12 · DECISÃO · Rever a **ordenação da exposição** na P3 considerando estruturas metálicas como as da montagem de 10-10 (fotografia de referência do responsável, não versionada); as estruturas são usadas só **frente e verso** (1 painel por face). · responsável
- 2026-10-12 · DECISÃO · A opção **triangular não é opção** (por agora). Ramo de diagrama triangular removido do gerador da proposta. · responsável
- 2026-10-12 · NOVO · **Proposta P3 v2** (HUMAN GATE): ordenação frente/verso — 6 estruturas, ida pela frente Q1→Q6, regresso pelo verso Q7→Q12, Q1/Q12 costas com costas (coerente com Item 11, pares S1–S6); diagramas «Em linha» e «Em ziguezague». Em `docs/dissemination/dossie-convite/proposta_p3_v2/` (gerador + preview P3, reprodução byte-idêntica verificada). PDFs finais **não** regenerados. · esta sessão
- 2026-10-12 · REMOVIDO · Da P3 (proposta): diagrama «núcleos 2+2+3» e bloco «Montagem autónoma — em desenvolvimento» (esquema conceptual). · esta sessão
- 2026-10-12 · DECISÃO · Suportes próprios = os 6 VEVOR, **ainda em teste** — **não** mencionar marca/modelo nem estado de teste no dossiê; retirar «a caminho». Texto: «Suportes próprios. Solução mais simples, também de dupla face, mediante apontamento.» · responsável
- 2026-10-12 · DECISÃO · Estruturas AAMLF «mediante consulta à AAMLF sobre disponibilidade» e **presas entre si** → diagrama ziguezague = AAMLF; diagrama em linha = suportes próprios (isolados). · responsável
- 2026-10-12 · DECISÃO · Novo bloco **AMBIENTE**: «A exposição destina-se a espaços interiores. Em exterior, apenas por um período máximo de 4 horas e com o acompanhamento de um responsável do projecto.» Checklist: «espaço interior · dimensões / área disponível». · responsável
- 2026-10-12 · REMOVIDO · Fotografia da montagem (exterior, 10-10) testada na P3 e **retirada** («não gostei da imagem»); a informação de ambiente mantém-se. Reafirma «NÃO inserir fotos dos expositores». · responsável
- 2026-10-12 · PENDENTE · HUMAN PASS da P3 v2 → transpor para o gerador final, regenerar DIGITAL/PRINT/LIVRETO + QA_REPORT → PR. · responsável
- 2026-10-12 · DECISÃO · Material dos painéis confirmado pelo responsável: **«PVC expandido, impressão em vinil laminado»** (linha sob o título da P3). Espessura **não** indicada (não confirmada). **Peso não indicado** no dossiê (sem registo; não é informação necessária para o convite). · responsável
- 2026-10-12 · RESOLVIDO · **HUMAN PASS da P3 v2** («confirmado — gerar versões finais»). P3 v2 integrada em `final/editaveis/dossie_generator.py`; regenerados previews P3 (PNG+SVG, 300 dpi), prancha, **DIGITAL**, **PRINT** (CMYK/OutputIntent/TrimBox) e **LIVRETO_A4**. P1/P2/P4 byte-idênticas. QA_REPORT actualizado. · esta sessão
- 2026-10-12 · ALTERADO · `_PRANCHA_FINAL.png` substituída pela prancha actual — a versionada estava desactualizada (pré-2026-10-06, ainda com diagramas linear/costas/triangular). · esta sessão
- 2026-10-12 · REMOVIDO · Pasta temporária `dossie-convite/proposta_p3_v2/` (não versionada) — conteúdo integrado no gerador final. · esta sessão
- 2026-10-12 · PENDENTE · Commit/PR das versões finais (HUMAN GATE) · prepress CMYK/ICC da gráfica · prova física QR/livreto (mantêm-se). · responsável
- 2026-10-12 · DECISÃO · P4: incluir a **ficha técnica** como no Q12 (Item 1) — Investigação, design e produção · Fernando Rodrigues de Jácomo | Coordenação institucional · Meira Pinto (AAMLF) | Curadoria · Grupo de voluntários do Projecto Comunitário de Milreu (3 colunas de peso igual, mesma ordem). Supera, neste item, a forma «Interlocutor da AAMLF». · responsável
- 2026-10-12 · DECISÃO · Contactos: Meira Pinto **ao lado** do responsável, com o e-mail. Usado `museu.lyceu@aejdfaro.pt` (único e-mail associado a Meira Pinto no repositório — institucional da AAMLF; nenhum e-mail pessoal registado). · responsável
- 2026-10-12 · DECISÃO · Encaminhar os pedidos para o **site, opção «Quero expor»** (`projectomilreu.pt/#/participar/expor`, rota canónica; página verificada publicada). · responsável
- 2026-10-12 · ALTERADO · P4 refeita: blocos COMO PEDIR (texto + URL + **QR → formulário**), CONTACTOS (2 colunas), FICHA TÉCNICA (3 colunas). Espaçamentos compactados; rodapé na posição original. PDFs DIGITAL/PRINT/LIVRETO, prancha e previews regenerados; P1/P2 inalteradas. 7 hyperlinks. · esta sessão
- 2026-10-12 · REMOVIDO · Bloco «PARCERIA E ACOMPANHAMENTO» da P4 (parágrafo «O desenvolvimento e a circulação das iniciativas de 2026 contam com a colaboração da AAMLF…» + «AAMLF · Meira Pinto — Interlocutor da AAMLF»); a AAMLF passa a figurar nos contactos, na ficha técnica e na barra de parcerias. · esta sessão
- 2026-10-12 · NOVO · `editaveis/QR_quero_expor.{png,svg}` (QR do formulário). `QR_projectomilreu.*` mantém-se inalterado (canónico, Itens 10/11). `dossie_finalize.py`: QR do formulário + `collect_editaveis` corrigido. · esta sessão
- 2026-10-12 · RESOLVIDO · Pendência cosmética do `collect_editaveis` (SameFileError) corrigida. · esta sessão
- 2026-10-12 · PENDENTE · Prova física do **novo QR** (formulário) · commit/PR (HUMAN GATE) · prepress CMYK/ICC. · responsável
- 2026-10-12 · NOVO · **PR #122** aberto (branch `feat/item7-p3-p4-ordenacao-quero-expor`, commit `0d6827c`): P3 v2 + P4 + PDFs/prancha/QR. Só ficheiros do dossiê; ESTADO/handoff fora do PR (alterações de outras sessões). Merge = decisão humana. · https://github.com/fernandojacomoarchaeologist/milreucommunityproject/pull/122
