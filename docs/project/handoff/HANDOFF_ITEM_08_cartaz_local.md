# Handoff — Item 8 · Cartaz local «Entre Ruínas e Memórias»

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> Método comum: ver [`00_INDEX_E_METODO.md`](00_INDEX_E_METODO.md). Estado vivo: `docs/project/ESTADO_ITENS_1-5_2026-10-01.md` (Item 8).

**O que é.** **Master de cartaz editável por local** para a exposição itinerante — **A3 vertical** (principal) + **A4 vertical** (derivado). Sistema estável: trocar local/datas/horário/morada/logótipo do anfitrião/imagem **não destrói a composição**. Identidade fixa: Entre Ruínas e Memórias · exposição itinerante do Projecto Comunitário de Milreu · projectomilreu.pt. Campos locais = **texto vivo**.

## 1. Local dos arquivos
- **`docs/dissemination/cartaz-local/`**:
  - `cartaz_local_TEMPLATE_A3.svg` + `cartaz_local_TEMPLATE_A4.svg` (templates vetor-texto vivo).
  - `master/cartaz_local_generator.py` + `master/cartaz_svg.py` (gerador, com **slot MSF 2026** + guarda `final=True`).
  - `master/FIELDS_template.json` (campos locais).
  - `master/_TEMPLATE_A3_preview.png` + `_TEMPLATE_A4_preview.png` + `master/previews/`.
  - `README.md` + `MODELO_PROMPT_NOVO_CARTAZ.md` + `QA_TEMPLATE.md`.
- **Gerador antigo:** `scratchpad/item8_build/build.py` + `item8_finalize.py` — **não versionados**.

## 2. Pontos mais importantes
- **Estado: TEMPLATE READY / STAND BY** (PR #80/#97) — master/template versionado.
- **NÃO se geram cartazes de evento sem local/data concretos.** Há **guarda de export** que bloqueia placeholders/dados fictícios.
- Imagem default **MM202601** (Festa da Pinha, autorizado, **crédito obrigatório exibido**), **substituível**.
- **Sem CMYK/PDF-X** por decisão do brief (perfil da gráfica só quando especificado).

## 3. Como se estruturou a arte
Arquitectura em **4 zonas**: (1) imagem + identidade; (2) informação local com forte hierarquia; (3) CTA + QR; (4) assinaturas com **parceiros estruturais separados do acolhimento local**. Robustez validada (nome curto/longo, horário 2 linhas, morada extensa; A4 deriva do A3 por escala `sf`). IMAGE CONTEXT FIRST.

## 4. Como se trabalhou ponto a ponto
1. Brief `ITEM08_CARTAZ_LOCAL_v1` verificado (PROJECT GATE PASS; 11/11 checksums).
2. FASE 1 previews (`cartaz-local/v1/`) → refinamento humano.
3. Master/template versionado com slot 2026 + guarda `final=True` + previews com **dados fictícios declarados**.
4. Auto-fit de nome/datas; escala `sf` para rodapé legível no A4.

## 5. O que NÃO fazer
- **NÃO** gerar cartaz de evento sem local/data reais (regra `08d-no-fake-exhibition-data`).
- **NÃO** deixar placeholders/dados fictícios num export específico.
- **NÃO** inventar contactos/horários/morada do anfitrião.
- **NÃO** remover o crédito da foto; **NÃO** misturar parceiros estruturais com o logótipo do anfitrião local.

## 6. Resultado esperado
Template robusto que, quando houver evento real, produz cartaz A3/A4 legível, com dados locais reais, crédito de imagem e (se a gráfica exigir) prepress.

## 7. Documentos necessários
`README.md`, `MODELO_PROMPT_NOVO_CARTAZ.md`, `QA_TEMPLATE.md`, `master/FIELDS_template.json`; regras `08d-no-fake-exhibition-data`, `08h-approved-templates-immutable`.

## 8. Pendências observadas
- 🟠 **Sem evento concreto** → fica em STAND BY.
- 🟠 Gates de produção quando houver evento: legibilidade A4 100%; **QR validado em impressão**; sem placeholders; crédito/direitos da foto; perfil/prepress da gráfica.

## 9. Dossiê do modo de trabalhar (Item 8)
Sistema de **template** (não peça única): composição que resiste a dados variáveis, com **guarda de export** anti-placeholder. Templates aprovados são **imutáveis** — alterações = nova versão. Nunca gerar dados de evento inventados.

## 10. Onde está cada informação
- **Master/templates:** `docs/dissemination/cartaz-local/` (+ `master/`).
- **Como gerar novo cartaz:** `MODELO_PROMPT_NOVO_CARTAZ.md`.
- **Estado/histórico:** `docs/project/ESTADO_ITENS_1-5_2026-10-01.md` (Item 8).

## 11. Registo incremental (append-only — acrescentar no fim; nunca reescrever entradas)
> Formato: `AAAA-MM-DD · TIPO · descrição · fonte`. TIPO ∈ **NOVO** · **DECISÃO** · **ALTERADO** · **REMOVIDO** · **PENDENTE** · **RESOLVIDO**. Método em `00_INDEX_E_METODO.md`.

- 2026-10-12 · NOVO · Registo incremental iniciado. Estado de referência = §2 deste ficheiro (2026-10-12).
- 2026-10-12 · DECISÃO · **Primeiro evento real do cartaz:** Junta de Freguesia de Estoi · exposição 30-10 → 06-11-2026 · **inauguração sábado 31-10, 14h00** (linha de destaque) · horário da Junta (2.ª–6.ª 9h00–12h00 / 14h00–18h00; encerrado ao fim-de-semana excepto inauguração) · entrada livre · morada «Largo Ossónoba · 8005-454 Estoi» (confirmada pelo responsável) · logótipo anfitrião = `~/Downloads/Logo_Estoi.jpeg` tal como está (sha256 `a0788fc3…`; outra sessão trata do logótipo definitivo). · responsável
- 2026-10-12 · NOVO · **Prova A3/A4** gerada em scratchpad (`item8_estoi/`; cópia do gerador com campo `DESTAQUE`, linha «Com o apoio de» só em demo, altura da imagem 0.405 A3 / 0.365 A4); guarda `final=True` PASS. Master **não alterado**. · esta sessão
- 2026-10-12 · PENDENTE · HUMAN GATE da prova · confirmar datas (abertura sexta 30-10 vs. inauguração sábado 31-10) · logótipo Estoi definitivo (fundo branco/transparência) · teste físico do QR · prepress da gráfica · commit/PR. · responsável
- 2026-10-12 · ALTERADO · Datas corrigidas pelo responsável: exposição **abre sábado 31-10** (inauguração 14h00) → 06-11-2026; prova A3/A4 regenerada com «31 de Outubro — 6 de Novembro de 2026». Resolve a pendência «abertura 30-10 vs. 31-10». · responsável
- 2026-10-12 · ALTERADO · Imagem principal: MM202601 substituída por fotografia da **equipa reunida** (decisão do responsável) — candidatas `Milreudocs/imagem dos eventos/Evento_Abril*.JPG` (roda de conversas 11-04-2026 = EVID-010/011; direitos Fernando Jácomo); provas V1/V2 em scratchpad, a escolher. ⚠ resolução baixa p/ impressão (1280×842 / 1600×900 px ≈ 107–134 ppi no A3). · responsável
- 2026-10-12 · ALTERADO · **Correcção:** a imagem pedida é a **MM202613 «Theodor Hauschild e equipa de escavadores em Milreu», ca. 1981** (não as fotografias EVID-010/011 — interpretação errada, descartada). Crédito canónico do índice: «Coleção de Maria de Lurdes Mendes Martins; fotografia providenciada por Celeste Pimenta e Branca Pimenta». Original 3508×2481 px; enquadramento vertical av=0.9. Prova A3/A4 regenerada. · responsável
- 2026-10-13 · ALTERADO · **Cartaz Estoi — nova data:** abertura e inauguração **sexta-feira 30-10-2026, 21h00** (exposição 30-10 → 06-11); pasta `eventos/2026-10-30_estoi/`. · responsável
- 2026-10-13 · ALTERADO · Cartaz Estoi com **Faixa de Logos canónica** (Junta na posição 4, intervalo único, menção art. 16.º) e anfitrião = `logo-junta-freguesia-estoi.png`; `Logo_Estoi.jpeg` retirado. PDFs A3/A4 regenerados; aguarda HUMAN GATE. · esta sessão
- 2026-10-13 · NOVO · Cartaz Estoi: **ficheiro final** PDF/X-3 CMYK genérico (A3/A4), **versão online** 1080×1350 + 1080×1920 e **versão animada** MP4 (14 s, 4:5 e 9:16). FINAL ART; pendente teste físico do QR e ICC da gráfica. · responsável
- 2026-10-13 · ALTERADO · Cartaz Estoi — **vídeo animado v2**: sem QR; 4 fotografias do acervo (MM202601/08/03/13) com crédito por cena, texto animado e cartão final «projectomilreu.pt» + Faixa de Logos. · responsável
- 2026-10-13 · PENDENTE · Vídeo animado v2 (e restantes peças do cartaz Estoi) **enviados para validação externa — STAND BY** até retorno. · responsável
- 2026-10-14 · DECISÃO · **3 tipos canónicos de divulgação por paragem**: cartaz geral (impressão, único com QR) · animação (sem QR) · post de rede social (informativo, sem QR; 1080×1350/1080×1080/1080×1920). Dados por paragem só em `eventos/<id>/evento.json`; geradores em `docs/dissemination/cartaz-local/canonico/` (`build_evento.py`). Estoi migrado; versão «online» retirada. · responsável
