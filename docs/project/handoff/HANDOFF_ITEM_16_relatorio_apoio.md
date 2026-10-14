# Handoff — Item 16 · Relatório de Apoio Institucional e Evidências dos Trabalhos (Ciclo 2026)

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> Método comum: ver [`00_INDEX_E_METODO.md`](00_INDEX_E_METODO.md). Estado vivo: `docs/project/ESTADO_ITENS_1-5_2026-10-01.md`.

**O que é.** Relatório funcional **para envio** (documento interno, A4): enquadramento do projecto, papel da AAMLF (entidade beneficiária e mediadora), execuções em andamento, trabalhos realizados, registo fotográfico das actividades, apoio institucional local e contactos. Junta, como anexos, as **cartas de apoio** recebidas.

## 1. Local dos arquivos
- **Gerador (versionado):** `docs/dissemination/relatorio-apoio-ciclo-2026/source/generators/relatorio_apoio_build.py` (reportlab + Pillow + pikepdf).
- **Saídas (PRIVADAS, fora do Git):** `docs/dissemination/relatorio-apoio-ciclo-2026/_private/`
  - `RELATORIO_APOIO_Ciclo_2026_corpo.pdf` — corpo do relatório (com fotografias de participantes).
  - `RELATORIO_APOIO_Ciclo_2026_COM_ANEXOS.pdf` — corpo + cartas de apoio digitalizadas (com assinaturas).
- **Inputs privados (não versionados):** cartas em `ANEXOS_DIR` (por omissão `~/Desktop/Milreudocs/CCDR/apoios`), fotografias em `FOTOS_DIR` (por omissão `docs/relatorio-execucao-ccdr-2026/_private/imagem-eventos`, evidências EVID-006/008/010/013/014/016 do Item 13).
- `proof/RELATORIO_APOIO_Ciclo_2026_corpo.pdf` — rascunho anterior (2 pág., sem fotografias), **substituído** pela versão em `_private/`; **não versionado**.

## 2. Pontos mais importantes
- **Privacidade:** o PDF final contém fotografias de participantes e cartas assinadas → só `_private/` + cofre externo. O Git recebe apenas o gerador.
- A carta da Câmara de Faro (AX2) está **quase em branco na digitalização** → desligada por omissão (`INCLUDE_AX2=1` só com scan legível).
- Rodapé marca «DOCUMENTO INTERNO».

## 3. Como se estruturou a arte
Tokens do DS (marfim, tinta aquecida, vermelho de assinatura), Fraunces (título) · Spectral (corpo) · Archivo (rótulos). Logo do Projecto no topo. Pág. 1 ficha + enquadramento + AAMLF; pág. 2 execuções/trabalhos; registo fotográfico em grelha; página final de apoio institucional e contactos; anexos com as cartas.

## 4. Como se trabalhou ponto a ponto
Gerador único, reprodutível: `ANEXOS_DIR=… FOTOS_DIR=… PYTHONPATH=<deps> python3 relatorio_apoio_build.py`. Fontes lidas de `~/Library/Fonts/` (não distribuídas).

## 5. O que NÃO fazer
- Não commitar os PDFs de `_private/`, as fotografias nem as cartas.
- Não inferir conteúdo de cartas ilegíveis.
- Não tratar este relatório como o Relatório de Execução CCDR (Item 13) — são documentos distintos.

## 6. Resultado esperado
PDF interno (corpo + anexos) pronto a enviar pelo responsável.

## 7. Documentos necessários
Cartas de apoio (originais digitalizados), fotografias de evidências (Item 13), logótipo oficial.

## 8. Pendências observadas
- Scan legível da carta da Câmara de Faro (AX2).
- Envio = decisão/acção humana.

## 9. Dossiê do modo de trabalhar
Ver método comum (`00_INDEX_E_METODO.md`).

## 10. Onde está cada informação
Gerador (conteúdo e legendas) · `_private/` (saídas) · Item 13 (evidências fotográficas).

## 11. Registo incremental (append-only)
- 2026-10-12 · NOVO · Relatório gerado (corpo + anexos) em `_private/`. · sessão 2026-10-12
- 2026-10-14 · NOVO · Item 16 registado no repositório: gerador versionado + este handoff; PDFs mantêm-se privados; `proof/` (rascunho superado) não versionado. · responsável
