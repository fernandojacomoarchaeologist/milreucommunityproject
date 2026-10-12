# Handoff — Item 15 · Adesivo do logótipo (Projecto Comunitário de Milreu)

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> Método comum: ver [`00_INDEX_E_METODO.md`](00_INDEX_E_METODO.md). Item novo criado em 2026-10-12.

**O que é.** Adesivo (sticker) **redondo Ø50 mm** com o logótipo do Projecto Comunitário de Milreu. Pedido do responsável (2026-10-12).

## 1. Local dos arquivos
- `docs/dissemination/adesivo-logo/source/generators/adesivo_build.py` (gerador PIL).
- `docs/dissemination/adesivo-logo/print/adesivo_logo_redondo_50mm_sangria3mm.{pdf,png}` (print RGB 300 dpi, Ø56 = trim Ø50 + 3 mm sangria).
- `docs/dissemination/adesivo-logo/proof/adesivo_logo_redondo_50mm_PROVA.png` (prova com guias de corte/sangria/safe).
- Logótipo-fonte: `public/media/exhibition/updated/logos/logo-projeto-comunitario-milreu.png` (450×460, asset oficial, preservado).

## 2. Pontos mais importantes
- Redondo **Ø50 mm**, fundo **MARF**, **sangria 3 mm**, linha de corte Ø50, safe Ø40.
- Logótipo **preservado tal como o asset oficial** (cores chapadas, «PROJETO», sem gradiente/sombra/textura — regras `logo-integrity`/`flat-colours`).
- Resolução do logótipo limitada (450 px → ~38 mm a 300 dpi); SVG vetorial do logótipo continua **pendente**.

## 3. Como se estruturou a arte
Logótipo centrado numa área segura (~35 mm) sobre círculo MARF; sangria por fundo MARF; guias só na prova (não imprimem).

## 4. Como se trabalhou ponto a ponto
Gerador PIL único (`adesivo_build.py`) → print (PDF+PNG) + prova com guias; QA visual aprovado pelo responsável; CMYK (Generic) derivado para o cofre Temporary.

## 5. O que NÃO fazer
Não alterar/recolorir o logótipo; não adicionar efeitos; não assumir ICC CMYK final (gráfica converte); não inventar outras dimensões sem pedido.

## 6. Resultado esperado
Adesivo redondo Ø50 mm pronto para gráfica (RGB + sangria; CMYK pela gráfica).

## 7. Documentos necessários
Regras `logo-integrity.md`, `flat-colours.md`; `00_INDEX_E_METODO.md`.

## 8. Pendências observadas
SVG vetorial do logótipo (para nitidez em grande formato); outros tamanhos/formatos (Ø40/Ø70, quadrado, die-cut) sob pedido.

## 9. Dossiê do modo de trabalhar (Item 15)
Peça pequena, logótipo inviolável, flat-colours; prova com guias para validação; CMYK como referência.

## 10. Onde está cada informação
- Arte/gerador: `docs/dissemination/adesivo-logo/`.
- Cofre gráfica: `Milreudocs/Temporary` (print + CMYK + prova).

## 11. Registo incremental (append-only — acrescentar no fim; nunca reescrever entradas)
> Formato: `AAAA-MM-DD · TIPO · descrição · fonte`. TIPO ∈ **NOVO** · **DECISÃO** · **ALTERADO** · **REMOVIDO** · **PENDENTE** · **RESOLVIDO**.

- 2026-10-12 · NOVO · Item criado a pedido do responsável — adesivo redondo Ø50 mm do logótipo. Arte + prova + CMYK (Generic). APROVADO. · responsável
