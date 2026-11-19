# Handoff — Item 13 · Relatório de Execução e Execução Financeira (CCDR Algarve 2026)

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> Método comum: ver [`00_INDEX_E_METODO.md`](00_INDEX_E_METODO.md). Estado vivo: `docs/project/ESTADO_ITENS_1-5_2026-10-01.md` (secção «Item 13»). **Sessão 2026-10-08→12 — HUMAN GATE, sem commit/PR.**

**O que é.** **Relatório PRELIMINAR** de execução (física + financeira) da candidatura **«PROJECTO COMUNITÁRIO DE MILREU / Museu sem fronteiras»** ao Programa de Apoio a Iniciativas Culturais Regionais 2026 da **CCDR Algarve, I.P.** Base legal = **art. 13.º n.º 3 do Aviso** (permite relatório preliminar + adenda; **prazo-limite 2026-11-15**). Entidade beneficiária = **AAMLF**.

## 1. Local dos arquivos
- **`docs/relatorio-execucao-ccdr-2026/`** (público, sanitizado):
  - `README.md`, `MANIFEST.json`, `DOCUMENTACAO_EM_FALTA.md`, `INVENTARIO_MATERIAIS_GRAFICOS.md`, `PRIVATE_EVIDENCE_POLICY.md`, `PRIVATE_LAYOUT.md`.
  - `proof/RELATORIO_EXECUCAO_CCDR_2026_v0.XX_PRELIMINAR.pdf` (PDFs por versão, image-based @200dpi).
  - `DIFF_v0.1_v0.2.md` … `DIFF_v0.18_v0.19.md` (histórico de cada versão).
  - `data/` — CSVs: `despesas.csv` (c/ `data_pagamento` + `elegibilidade_apoio`), `doc_financeiros.csv`, `sessoes.csv`, `evidencias.csv`, `acoes.csv`, `orcamento_aprovado.csv`, `orcamento_real.csv`, `orcamento_adaptacao.csv`, `orcamento_itemizado_museu.csv`, `orcamento_itemizado_circuito.csv`, `anexo_iv_reconciliacao_interna.csv`, `faturas_manifest_TEMPLATE.csv`.
  - **`source/generators/`**: `relatorio_build.py` + `anexos_build.py` + `anexo_iv_build.py`.
  - **`_private/`** (gitignored) — originais fiscais; `_private/imagem-eventos/` (derivados JPEG sem EXIF, incl. `evid_EVID-012…017_*_10out2026.jpg`); `_private/contexto/` (mensagem do orientador, 2026-10-12).
- **Cofre externo privado:** `/Users/fernandojacomo/Desktop/Milreudocs` (NIF, IBAN, cartão, faturas, dossier de entrega). Fotos dos eventos em `Milreudocs/imagem dos eventos/` — convenção de nome do evento de 10-10: prefixo **`evento1010-`** (HEIC originais + `evento1010-Cartaz.jpg`).

## 2. Pontos mais importantes
- **Estado: v1.5 FECHADO PARA ENTREGA (relatório datado de 2026-10-21; linguagem institucional; pacote de entrega em `_private/entrega/`) · IN PROGRESS / PRELIMINARY · RETOMADO 2026-10-12** com nova informação do responsável (pausa anterior em v0.17 levantada). O responsável chama-lhe «relatório final», mas continua **PRELIMINAR** (art. 13.º n.º 3) até decisão humana explícita.
- **1.ª apresentação pública da exposição itinerante = 10-10-2026** · 2.º Encontro do Grupo de Amigos de Museus do Algarve · Museu do Traje (São Brás de Alportel) · 9h30–17h00 · **~50 participantes, representantes de diversos museus do Algarve (estimativa do responsável)** · **6 painéis** · **estruturas AAMLF** · sem intervenção oral formal · deslocação não computada · ACAO-03 = EXECUTADO · SESSAO-004 · EVID-012 (cartaz, terceiro, não reproduzir) + EVID-013…017 (fotos **Fernando Jácomo**; reproduzidas 013/014/016). Convite ao inquérito + Folha de Sala em circulação (EVID-016).
- **Montante atribuído = 2.200,00 €** (deliberação 2026-07-06). **Cabimento 83 · Compromisso 1132.** **NIPC da CCDR = 517638827.**
- **Postura de elegibilidade (art. 12.º) = «a entidade informa; a CCDR decide»** — **sem subtotal de elegíveis** calculado por nós.
- **Valor de cada despesa = sempre o da fatura, em euros** (decisão 2026-10-14). **Valor total do projecto = Museu + Circuito** (Documentando Milreu citado, não computado).
- **3 estados financeiros distintos** (não confundir): pagamento **PAGO** ≠ **documento fiscal** ≠ **prova de pagamento**.
- **Totais à data (v0.26):** realizadas **1.734,64 €** (todas com doc. fiscal) · prova pgto **947,94 €** · previstas (DESP-008, orçamento Ossónoba 20261056) **≈ 578,10 €** → realizadas + previstas **2.312,74 €** de despesas elegíveis faturadas à AAMLF para justificar os 2.200 €.
- **3 sessões comunitárias** documentadas: **07-02, 11-04, 18-04-2026** (Anexo A) + **SESSAO-004 (10-10-2026, exposição)**.
- **Anexo IV** localizado (cultalg.gov.pt/downloads/doc/67) + réplica `.xlsx` preenchida internamente.

## 3. Como se estruturou a arte
Relatório de ~13 páginas (image-based @200dpi, DS) + Anexos A–F + réplica do Anexo IV (.xlsx). Arquitectura de **privacidade**: repo público = **sanitizado**; **dossier administrativo de entrega** privado (`/Milreudocs`) = originais fiscais/NIF/IBAN/cartão. «Regras canónicas do documento» + enquadramento administrativo real + enquadramento académico (doutoramento UAlg).

## 4. Como se trabalhou ponto a ponto
1. Iteração **v0.1 → v0.19**, cada versão com `DIFF_*`. Rebuild: `cd source/generators && PYTHONPATH=<pydeps> python3 relatorio_build.py && python3 anexos_build.py && python3 anexo_iv_build.py`.
2. Dataset CSV como fonte de verdade (despesas, docs financeiros, sessões, evidências, orçamentos).
3. Localização e obtenção do **Anexo IV oficial** + réplica preenchida.
4. Tratamento de elegibilidade como «informar, não decidir».
5. Separação rígida público/privado (sanitização).

## 5. O que NÃO fazer
- Fotos de 10-10: crédito «Fernando Jácomo» (licença **não** especificada — não acrescentar «CC»); **nunca** EVID-015 (pessoa identificável) nem EVID-017 (reproduções do acervo) por defeito; **nunca** o cartaz EVID-012 (terceiro).
- **NÃO** integrar no relatório o contexto do orientador (protocolo em conversações; contactos para inquéritos) sem confirmação — é contexto, não execução.
- **NÃO** pôr NIF/IBAN/cartão/faturas/e-mails no repo público (só `_private/` + `/Milreudocs`).
- **NÃO** calcular/afirmar subtotal de despesas «elegíveis» (a CCDR decide).
- **NÃO** confundir os 3 estados financeiros.
- **NÃO** classificar como elegível despesa de **compra de bens/equipamento** (impressora, filamentos, ferramentas) ou **hospitalidade ao público** (buffet, água aos convidados) — art. 12.º/2 = **fraco/arriscado**; serviço/logística/aluguer faturado à AAMLF = **forte**.
- **NÃO** commitar/abrir PR (HUMAN GATE).

## 6. Resultado esperado
Relatório preliminar + adenda que, com a informação em falta, justifique a aplicação dos 2.200 € com despesas **fortes** (serviço/logística/equipa/aluguer faturados à AAMLF), Anexo IV oficial preenchido e contrapartidas do art. 16.º cumpridas — dentro do prazo 2026-11-15.

## 7. Documentos necessários
`README.md`, `DOCUMENTACAO_EM_FALTA.md`, `PRIVATE_EVIDENCE_POLICY.md`, `MANIFEST.json`, CSVs em `data/`; Anexo IV oficial (cultalg.gov.pt/downloads/doc/67); dossier privado em `/Users/fernandojacomo/Desktop/Milreudocs`.

## 8. Pendências observadas (gates para retomar)
- 🟠 **Art. 16.º:** verificar a menção textual «Apoiado pela CCDR Algarve, I.P.» nos materiais além do Q12 (logótipo já presente).
- 🟢 **Anexo IV oficial preenchido (preliminar)** — actualizar com as despesas adicionais.
- 🔴 **Despesas elegíveis adicionais faturadas à AAMLF** (deslocação de equipa — ex. Faro — + serviços de design/comunicação) para fechar os 465,36 €.
- ✅ ~~Comprovativo das 50 cópias da Folha de Sala~~ (resolvido 2026-10-13: fatura Auchan + talão).
- ✅ ~~Documento da impressão do convite~~ (resolvido 2026-10-13: 103 cópias PB A5, DESP-005).
- ✅ ~~Fatura dos filamentos~~ (DOC-FIN-009, 2026-10-14). VEVOR: sem prova de pagamento por decisão do responsável — não mencionar.
- 🟠 **Prova do remanescente dos painéis** (em andamento). ~~Folhas de presença~~ (não exigidas).
- 🟠 **Contrapartidas art. 16.º** (logótipo CCDR + «Apoiado pela CCDR Algarve, I.P.» nos materiais).
- 🟠 **Art. 14.º n.º 1 (AAMLF; o responsável envia ao interlocutor da AAMLF, que remete à CCDR):** autorização SS · autorização AT · RCBE · **fatura/recibo à CCDR** 2.200 € (NIPC 517638827, cab. 83 / comp. 1132) até 2026-11-15 — condição do pagamento do apoio.

## 9. Dossiê do modo de trabalhar (Item 13)
Rigor fiscal e **separação público/privado** absoluta. Elegibilidade reportada, nunca decidida. Três estados financeiros distintos sempre explícitos. Orientação de despesas: **serviço/logística forte, bens/hospitalidade fraco**. Iteração versionada com DIFF por versão. Retomado a 2026-10-12; avançar só com inputs do responsável. **Registo incremental (§11) obrigatório a cada novidade/decisão/remoção.**

## 10. Onde está cada informação
- **Relatório/anexos:** `docs/relatorio-execucao-ccdr-2026/proof/` + geradores em `source/generators/`.
- **Dados financeiros:** `docs/relatorio-execucao-ccdr-2026/data/*.csv`.
- **O que falta:** `DOCUMENTACAO_EM_FALTA.md`. **Privado:** `_private/` + `/Users/fernandojacomo/Desktop/Milreudocs`.
- **Estado/histórico:** `docs/project/ESTADO_ITENS_1-5_2026-10-01.md` (Item 13) + memória da sessão.

## 11. Registo incremental (append-only — acrescentar no fim; nunca reescrever entradas)
> Formato: `AAAA-MM-DD · TIPO · descrição · fonte`. TIPO ∈ **NOVO** (informação/artefacto) · **DECISÃO** (humana) · **ALTERADO** · **REMOVIDO** · **PENDENTE** (nova lacuna) · **RESOLVIDO** (lacuna fechada).

- 2026-10-08 · ALTERADO · v0.17 — auditoria de postura «a entidade informa; a CCDR decide»; secção «Regras canónicas». Item posto **EM PAUSA**. · `DIFF_v0.16_v0.17.md`
- 2026-10-12 · DECISÃO · Item **retomado** com nova informação (pausa levantada). · responsável
- 2026-10-12 · NOVO · 1.ª apresentação pública da exposição a **10-10-2026** (2.º Encontro do Grupo de Amigos de Museus do Algarve, Museu do Traje, São Brás de Alportel, 9h30–17h00). · responsável + cartaz + viralagenda.com/pt/events/1862247
- 2026-10-12 · ALTERADO · ACAO-03 «CALENDARIZADO» → **EXECUTADO (1.ª apresentação) · circulação EM CURSO**; nova **SESSAO-004**; **EVID-012…017**; convite e Folha de Sala → **UTILIZADOS** (EVID-016). v0.18. · `DIFF_v0.17_v0.18.md`
- 2026-10-12 · NOVO · Imagens `evento1010-*` convertidas em derivados sem EXIF para `_private/imagem-eventos/`; originais intocados. `IMG_0076 2.HEIC` (sem prefixo) e `.textClipping` ignorados.
- 2026-10-12 · RESOLVIDO · Público de 10-10 = **~50 participantes, representantes de diversos museus do Algarve** (estimativa do responsável). v0.19. · `DIFF_v0.18_v0.19.md`
- 2026-10-12 · NOVO · Mensagem do orientador (privada, `_private/contexto/`): expectativa de o responsável «falar» a 10-10; contactos para alargar inquéritos (museu de S. Brás; Museu do Lyceu de Faro — Meira Pinto); **protocolo de colaboração em conversações** (partes não especificadas); orientador ausente a 10-10. **Não integrado no relatório.**
- 2026-10-12 · PENDENTE · Direitos das fotos 10-10 · n.º de painéis · intervenção oral · estruturas AAMLF/VEVOR · art. 16.º nos painéis · deslocação a São Brás.
- 2026-10-12 · NOVO · Contrapartida art. 16.º: menção «Apoiado pela CCDR Algarve, I.P.» aplicada em **prova** no Q12 (Item 1, prova v2; logótipo CCDR já presente na banda de parcerias). Por aprovar/imprimir; Q01–Q06 já impressos sem a menção textual. · Item 1 §11
- 2026-10-12 · RESOLVIDO · Fotos 10-10 = **Fernando Jácomo** (licença não especificada); reproduzidas EVID-013/014/016; EVID-015/017 continuam fora. · responsável
- 2026-10-12 · RESOLVIDO · **6 painéis** expostos · **estruturas da AAMLF** · **sem intervenção oral formal** (esclarecimentos individuais) · **deslocação não computada**. v0.20. · responsável · `DIFF_v0.19_v0.20.md`
- 2026-10-12 · ALTERADO · Art. 16.º: logótipo CCDR confirmado nos painéis/Folha de Sala/convite; menção textual «Apoiado pela CCDR Algarve, I.P.» só na ficha técnica do Q12 em reabertura → «em inclusão».
- 2026-10-12 · REMOVIDO · Pendências: público · direitos fotos · n.º painéis · intervenção oral · estruturas · deslocação.
- 2026-10-12 · DECISÃO · Parte do contexto da mensagem do orientador **ocultada do registo público** por decisão do responsável (protecção de pessoas); entradas anteriores redigidas. Excepção de privacidade ao append-only. Não reintroduzir. · responsável
- 2026-10-13 · RESOLVIDO · **DESP-004 deixa de ser placeholder**: fatura VEVOR (INDEPSALE TECHNOLOGY LIMITED, 20261007000185, 2026-10-07, emitida à AAMLF) — 6 suportes, **167,40 €** (era ~120 € provisório). DOC-FIN-008 no dossier privado. v0.21. · responsável (`Milreudocs/faturas/in4.pdf`) · `DIFF_v0.20_v0.21.md`
- 2026-10-13 · ALTERADO · Totais: realizadas **1.734,64 €** · doc. fiscal **1.626,41 €** · prova pgto 839,71 € · **a integrar 465,36 €** (era ≈513 €). Texto da síntese passa a calcular do dataset.
- 2026-10-13 · PENDENTE · Prova do pagamento online da fatura VEVOR.
- 2026-10-13 · ALTERADO · `DOCUMENTACAO_EM_FALTA.md` secção E (desactualizada desde v0.5) corrigida: só faltam prova remanescente painéis, fatura definitiva filamentos, prova pgto VEVOR, evidência das 50 cópias da Folha de Sala.
- 2026-10-13 · ALTERADO · **Correcção DESP-005**: as 100 impressões A4 cor (30,00 €) da fatura Auchan …/000343 = **50 Folhas de Sala F/V** (antes atribuídas por engano ao convite). Pagamento = talão Mastercard (DOC-FIN-007b). v0.22. · responsável · `DIFF_v0.21_v0.22.md`
- 2026-10-13 · RESOLVIDO · Evidência de pagamento das 50 cópias da Folha de Sala (fatura + talão já no dossier).
- 2026-10-13 · PENDENTE · Documento da **impressão do convite ao inquérito** (já não suportado pela fatura Auchan); finalidade das 103 cópias PB a confirmar.
- 2026-10-13 · RESOLVIDO · Convite ao inquérito = **103 cópias a preto e branco, formato A5** (5,15 €, fatura Auchan …/000343, DESP-005). «Teste PB» abandonado. v0.23. · responsável · `DIFF_v0.22_v0.23.md`
- 2026-10-14 · RESOLVIDO · **Fatura definitiva 3DJake** (R49010013926102460, 2026-10-13, 108,23 €, «já paga») → DOC-FIN-009; proforma DOC-FIN-003 SUPERSEDED. Todas as despesas com documento fiscal (1.734,64 €); prova pgto 947,94 €. v0.24. · responsável · `DIFF_v0.23_v0.24.md`
- 2026-10-14 · DECISÃO · DESP-004 (VEVOR): sem prova documental de pagamento além da fatura (privacidade); **não mencionar no relatório**. · responsável
- 2026-10-14 · REMOVIDO · Pendência «folhas de presença» — não exigida pelo art. 13.º n.º 1 c) do Aviso (só n.º de sessões e público); tinha sido acrescentada internamente.
- 2026-10-14 · NOVO · **Anexo IV oficial preenchido** (versão preliminar): 7 faturas, total 1.734,64 €; «objeto do apoio» = total realizadas; gerador `anexo_iv_oficial_fill.py`, saída e dados com NIF em `_private/anexo-iv/`. · pedido do responsável
- 2026-10-14 · NOVO · Pendências art. 14.º n.º 1 explicitadas (AAMLF): autorização SS, autorização AT, RCBE, fatura/recibo à CCDR 2.200 € (cab. 83 / comp. 1132) até 2026-11-15.
- 2026-10-14 · PENDENTE (EM ANDAMENTO) · Prova do remanescente dos painéis; despesas adicionais (465,36 €). · responsável
- 2026-10-14 · DECISÃO · **Regra de valores:** cada despesa vale **sempre o valor da fatura, em euros** (variações de cobrança no cartão não contam). · responsável
- 2026-10-14 · DECISÃO · **Valor total do projecto = Museu + Circuito**; «Documentando Milreu» pode ser citado, **não computado**. · responsável
- 2026-10-14 · ALTERADO · Sessões **abertas** (sem bilheteira/registo de presenças). 10-10: ~50 no encontro **+ visitantes do Museu do Traje ao longo do dia** (não contabilizados). v0.25. · responsável · `DIFF_v0.24_v0.25.md`
- 2026-10-14 · DECISÃO · Documentos do art. 14.º n.º 1 b)–e): o responsável envia ao interlocutor da AAMLF (mensagem + e-mail), que remete à CCDR. Fora do âmbito de produção do relatório. · responsável
- 2026-10-14 · PENDENTE · **Divergência de público:** responsável indicou Fev 15 / Abr 12; Anexo A regista Fev «nove participantes» (+2 convidados não inscritos? +4 visitantes não-participantes) / Abr «aproximadamente quinze». Valores do Anexo A mantidos até decisão.
- 2026-10-14 · PENDENTE · Valor total do projecto: Circuito = 8.480 € (soma das rubricas) ou 8.580 € (total impresso no orçamento v0)? Hoje 13.966 € (5.486 + 8.480).
- 2026-10-14 · RESOLVIDO · **Valor total do projecto = 13.966,00 €**, conforme o declarado nos formulários submetidos nos Serviços Online (n.º 182 Programação/Circulação e n.º 188 Protocolo, 18-04-2026: «Custo total do projeto» e «Total despesas previstas» = 13.966,00 €) = Museu 5.486 + Circuito 8.480. Os 8.580 € são só o total impresso no anexo «orçamento ccdr.pdf» (gralha de 100 € interna ao anexo). Anexo IV e relatório já correctos. · Milreudocs/CCDR/candidatura
- 2026-10-14 · NOVO · As autorizações de consulta SS e AT (art. 14.º n.º 1 b) e c)) já foram anexadas pela AAMLF às candidaturas de 18-04-2026; podem ser reenviadas/actualizadas. Faltam RCBE e fatura/recibo à CCDR.
- 2026-10-14 · DECISÃO · Público de Fevereiro e Abril = **valores do Anexo A** (07-02: 9 presentes, 25 inscrições; 11-04: ~15 participantes). Divergência encerrada; relatório já usava estes valores (sem alteração). · responsável
- 2026-10-14 · DECISÃO · **Placeholder das despesas adicionais = orçamento Gráfica Ossónoba n.º 20261056** (DESP-008): 470,00 € s/ IVA + IVA 23 % ≈ **578,10 €**; prevista, fatura a emitir **à AAMLF** (orçamento está em nome do responsável). Realizadas 1.734,64 + previstas 578,10 = **2.312,74 €** (≥ 2.200). Anexo IV oficial só com faturas (DESP-008 entra com a fatura). v0.26. · responsável · `DIFF_v0.25_v0.26.md`
- 2026-10-14 · PENDENTE · Fatura da Gráfica Ossónoba (orçamento 20261056) — «em breve»; valor definitivo = o da fatura (IVA incluído).
- 2026-10-14 · DECISÃO · Apresentar despesas **acima do apoio** (2.200 €) não é problema — a **CCDR filtra** o objeto do apoio. Frase na síntese financeira; Anexo IV «objeto do apoio» = total apresentado. v0.27. · responsável
- 2026-10-14 · NOVO · O roll-up da DESP-008 (orçamento 20261056) é o banner institucional do Item 14. · responsável
- 2026-10-14 · DECISÃO · **Linguagem institucional:** relatório sem jargão de sistema (ex.: «regras canónicas»), sem códigos internos nem rótulos de «preliminar»; só se marca o que é previsto/placeholder. · responsável
- 2026-10-14 · DECISÃO · **Seguir sempre o texto do orçamento/fatura** nas descrições das despesas (DESP-008 = designações do orçamento 20261056). · responsável
- 2026-10-14 · ALTERADO · v0.28: relatório reescrito (10 secções alinhadas com o art. 13.º n.º 1; 9 páginas); ficheiro sem sufixo PRELIMINAR; mantida 1 frase sobre a adenda (art. 13.º n.º 3). Anexos: só cabeçalho/rodapé revistos. · `DIFF_v0.27_v0.28.md`
- 2026-10-14 · PENDENTE · Rever a linguagem do texto interno dos Anexos A–F (ainda com códigos e termos técnicos).
- 2026-10-14 · RESOLVIDO · Fotos de 10-10 de pernas para o ar (relatório p. 5 e Anexo A): rotação EXIF aplicada aos derivados. · responsável
- 2026-10-14 · ALTERADO · v0.29: anexos A–F reescritos em linguagem institucional; **pacote de entrega** em `_private/entrega/` (relatório + A–F + Anexo IV .xls), com Anexo E contendo as **faturas e comprovativos** e Anexo A com o relatório de eventos (08-10-2026). Versão pública dos anexos sem dados fiscais. · responsável · `DIFF_v0.28_v0.29.md`
- 2026-10-14 · NOVO · Programação da exposição em **Estoi (30-10 a 06-11-2026, inauguração 30-10 às 21h00)** incluída no relatório (secção 8) e no Anexo C, lida do `evento.json` do Item 8. · responsável
- 2026-10-14 · PENDENTE · O relatório de eventos anexado (Anexo A) tem «Preliminar» no próprio título — confirmar se há versão final.
- 2026-10-15 · NOVO · Documento FlixBus (reserva #3403942071, emitido 15-10-2026, comprador AAMLF NIF 517897717): deslocação Coimbra → Faro 16-10-2026 e regresso 16/17-10 do investigador, para testar as novas estruturas metálicas e validar as provas na gráfica. Bruto 29,49 + 12,49 + taxa 0,99 = 42,97 €; lugares 0,00 €. Guardado como DOC-FIN-010 (cofre privado). **Não integrado ainda.** · responsável
- 2026-10-15 · PENDENTE · Cada fatura FlixBus mostra «Voucher de crédito: −X € · Total: 0,00 €» (pago com voucher) — confirmar a origem do voucher antes de apresentar 42,97 € como despesa; e data do relatório (≥ 17-10) para redigir a deslocação no passado.
- 2026-10-15 · RESOLVIDO · Bilhetes FlixBus: o responsável declara ter **pago com o seu cartão**; integrado como **DESP-009 = 42,97 €** (valor das faturas), deslocação da equipa (art. 12.º/1/d). Nota interna: os documentos mostram «Voucher de crédito … Total 0,00 € · Já pago por: Apple Pay». · responsável
- 2026-10-15 · DECISÃO · Deslocação de 16/17-10 **redigida no passado**; data do relatório passa a **17-10-2026**. v0.30: realizadas 1.777,61 € + previstas 578,10 € = 2.355,71 €; Anexo IV oficial com 8 faturas (nome sem PRELIMINAR). · responsável · `DIFF_v0.29_v0.30.md`
- 2026-10-15 · PENDENTE · Confirmar após 16-10 que a deslocação, os testes das estruturas e a validação das provas decorreram como descrito (o relatório já os dá como realizados).
- 2026-10-16 · DECISÃO · O relatório de eventos **não** é anexado na íntegra; em vez disso, síntese (objectivos, participação, contributos, resultados, relação com Museu de Memórias e Circuito Educativo) no relatório §3.1 e no Anexo A. · responsável
- 2026-10-16 · NOVO · v0.31: 9 novas evidências (EVID-018…026: estruturas AAMLF, montagem, ganchos, público [só entrega], novos suportes testados na gráfica a 16-10, modelo 3D); sistema expositivo (AAMLF ≈2 m vs novos suportes ≈1 m retrácteis, combináveis); cabeça de Milreu 3D com Jorge de Sena; adesivos do orçamento 20261056. 11 páginas. · responsável · `DIFF_v0.30_v0.31.md`
- 2026-10-16 · PENDENTE · Texto concreto de Saramago sobre a cabeça não verificado — só se refere a ligação Estói/Milreu ↔ *Viagem a Portugal* (Rota Literária do Algarve). Se o responsável tiver a passagem (edição/página), acrescentar.
- 2026-10-16 · DECISÃO · Explicitar que as despesas apresentadas são as **seleccionadas para o apoio** e que há **outros custos não apresentados** (pré-apoio; não faturados à AAMLF; pessoais/não elegíveis, ex. água aos participantes): deslocações/alojamento/alimentação+água ≈200 € · ads ≈500 R$ · site 35 €/ano · Claude+Photoshop ≈150 US$/mês · SurveyMonkey ≈100 R$/mês · armazenamento/filamentos extra/impressões pré-apoio por apurar → «pelo menos cerca de 850 €», ~1/3 Circuito. v0.32 (relatório §7.3 + Anexo F §5). · responsável · `DIFF_v0.31_v0.32.md`
- 2026-10-16 · PENDENTE · Revalidar o total: com assinaturas desde fevereiro (9 meses) ultrapassa 1.500 €; 850 € ≈ 2–3 meses. Confirmar nº de meses e quota imputável ao projecto (Claude/Photoshop, SurveyMonkey) e valores dos itens por apurar.
- 2026-10-16 · RESOLVIDO · Assinaturas Claude e SurveyMonkey = **6 meses** → outros custos não apresentados **≥ ~1.190 €** (Claude+Photoshop ≈ 780 €, SurveyMonkey ≈ 96 €, restantes 315 €). v0.33. Pressuposto: Photoshop também 6 meses (no mesmo valor de 150 US$/mês). · responsável
- 2026-10-16 · ALTERADO · Outros custos não apresentados: assinaturas **10 meses** (não 6); armazenamento = **rateio 10 % da quota Google (90 R$/mês) × 10 meses ≈ 14 €** (digital, não material físico); filamentos adicionais ≈ 50 €; impressões ≈ 50 €; água ≈ 10 € (investigador 190 €) → **≈ 1.890 €** (aproximado, ~1/3 Circuito). v0.34. · responsável · `DIFF_v0.33_v0.34.md`
- 2026-10-16 · DECISÃO · Documento orientado **por compra/fatura** (uma linha por documento); a despesa n.º 9 ganha subtabela com as 8 linhas do orçamento 20261056 + **linha de IVA 23 % estimado** (108,10 €); reconciliar com a fatura quando chegar. v0.35 (relatório 7.1 + Anexo D; `data/orcamento_20261056.csv`). · responsável · `DIFF_v0.34_v0.35.md`
- 2026-10-16 · PENDENTE · Reconciliação da despesa n.º 9 com a fatura da Gráfica Ossónoba (linhas, IVA, total) e entrada no Anexo IV oficial.
- 2026-10-16 · DECISÃO · Abordagem da despesa n.º 9 (linha única + detalhe do orçamento + IVA separado) **aprovada** pelo responsável; aplicar o mesmo padrão a futuras despesas previstas com orçamento. · responsável
- 2026-10-16 · RESOLVIDO · Fatura **Gráfica Ossónoba FAC A/80365** (16-10-2026, AAMLF) = **571,95 €** (465,00 + IVA 106,95) substitui o orçamento 20261056; DESP-008 passa a realizada («Faturada»). Diferenças: **sem «Adesivo do projecto»** (25 €); **lona A0** 40 € (era 59,4×42, 20 €). Realizadas **2.349,56 €**; Anexo IV oficial com 9 faturas. v0.36. · responsável · `DIFF_v0.35_v0.36.md`
- 2026-10-16 · PENDENTE · Pagamento da FAC A/80365 (estado «a confirmar»); adesivo do projecto (não faturado) — será faturado à parte?
- 2026-10-16 · PENDENTE (EM DISCUSSÃO) · Comprovativo da 2.ª prestação dos painéis. · responsável
- 2026-10-16 · RESOLVIDO · Deslocação de 16-10, teste dos suportes e validação das provas **realizados como descrito** no relatório. · responsável
- 2026-10-16 · NOVO · Redigido o pedido ao interlocutor da AAMLF com os documentos do art. 14.º n.º 1 (SS, AT, RCBE, fatura/recibo 2.200 € à CCDR NIPC 517638827, cab. 83 / comp. 1132, até 15-11-2026); tipologia de apoio a confirmar. · esta sessão
- 2026-10-16 · RESOLVIDO · «Adesivo do projecto» **incorporado pela gráfica** (sem custo) — pendência removida. · responsável
- 2026-10-16 · NOVO · **Pagamentos previstos até 31-10-2026:** FAC A/80365 (571,95 €) junto com a **2.ª prestação** da FAC A/80286 (pagamento: 500 € no acto + restante a 30 dias). Relatório: DESP-001 «Paga parcialmente», DESP-009(n.º 9) «Faturada; pagamento até 31-10-2026». v0.37. · responsável · `DIFF_v0.36_v0.37.md`
- 2026-10-16 · RESOLVIDO · Galerias públicas = agenda do portal, «Eventos realizados» (`projectomilreu.pt/#/exposicoes`: 07-02, 11-04, 10-10) — ligações no relatório §4 e Anexo A. (Fonte canónica no projecto: `public/data/exhibitions-public.json`.) · responsável
- 2026-10-16 · PENDENTE · Comprovativos dos pagamentos de 31-10 → actualizar situação para «Paga» e Anexo E.
- 2026-10-16 · DECISÃO · **Documento e pacote FECHADOS (v1.0)** para entrega: sem placeholders; pagamentos à Gráfica Ossónoba «no final de outubro de 2026, conforme plano de pagamento acordado»; **sem juízos de elegibilidade** (só natureza das despesas; CCDR decide); Anexo IV com «Total despesas objeto do apoio» **em branco** (preenchimento CCDR); Anexo C enriquecido; Anexo F corrigido; revisão visual de todas as páginas. Pacote: `docs/relatorio-execucao-ccdr-2026/_private/entrega/`. · responsável · `DIFF_v0.37_v1.0.md`
- 2026-10-16 · PENDENTE (fora do documento) · Comprovativos dos pagamentos do final de outubro (2.ª prestação FAC A/80286 + FAC A/80365) → adenda; documentos do art. 14.º via interlocutor da AAMLF; adenda final (art. 13.º n.º 3) com a conclusão da itinerância e do Circuito Educativo.
- 2026-10-19 · NOVO · v1.1: **capítulo 1 sobre a AAMLF** (fonte aamlf.pt + candidatura) e secções renumeradas; **apresentações programadas** com histórico (III ENEP 5–7/11 UAlg; V CAAP 18–21/11 UMinho; Jornadas da Rede de Museus do Algarve 20/11 Alcoutim). Pacote de entrega actualizado. · responsável · `DIFF_v1.0_v1.1.md`
- 2026-10-19 · RESOLVIDO · Data das Jornadas da RMA = **20-11-2026** (dados da página do Município de Alcoutim + Algarve Atlas), não 19-11. · cm-alcoutim.pt
- 2026-10-21 · RESOLVIDO · **Pagamento de 1.191,25 € à Gráfica Ossónoba** (transferência 21-10-2026, DOC-FIN-012) = 2.ª prestação FAC A/80286 + FAC A/80365 → **todas as 9 despesas pagas**; relatório datado de **21-10-2026**. v1.2. · responsável · `DIFF_v1.1_v1.2.md`
- 2026-10-21 · NOVO · Mensagem do interlocutor da AAMLF: pede que fique referenciada no orçamento uma verba de **500 € de despesas administrativas e deslocações/transporte da AAMLF**, mesmo não paga, «como financiamento da AAMLF». Avaliação entregue ao responsável; **não integrado** até decisão (forma: contributo próprio valorizado, fora do registo de despesas/Anexo IV). · AAMLF
- 2026-10-21 · NOTA · Na pasta de entrega existe `1- RELATORIO_EXECUCAO_CCDR_2026.pdf` = cópia da v1.0 (sha256 8656caaa…), não gerada pela sessão; a versão actual é `RELATORIO_EXECUCAO_CCDR_2026.pdf`.
- 2026-10-21 · DECISÃO · Os 500 € da AAMLF são **custo real** suportado pela Associação/interlocutor (não pelo investigador) → **linha final** na composição financeira: realizadas 2.349,56 + AAMLF 500,00 = **2.849,56 €** (apoio 2.200). Valor declarado pela Associação, **sem documentos → fora do Anexo IV**. Menções à AAMLF acrescentadas no cap. 1 e §8.2. v1.3. · responsável · `DIFF_v1.2_v1.3.md`
- 2026-10-21 · PENDENTE (opcional) · Se a AAMLF tiver documentos dessas despesas (bilhetes, recibos), podem entrar no Anexo IV e no Anexo E como as restantes.
- 2026-10-21 · ALTERADO · Montante **500,00 €** explícito nas menções à AAMLF (cap. 1 e §8.2), a pedido do responsável. v1.4. · responsável
- 2026-10-27 · ALTERADO · v1.5 — apontamentos da AAMLF (26-10): (1) cap. 1 com **todos os órgãos sociais 2025–2028** (sem destaque à Tesoureira); (2) **Rede de Museus do Algarve não teve papel no 2.º Encontro** — encontros anuais de iniciativa exclusiva dos 3 grupos de amigos de museus do Algarve (AAMLF incluída), edição acolhida pelo Museu do Traje; frase de «promotora» retirada (corrige registo de 2026-10-19 baseado na viralagenda); (3) **9.as Jornadas RMA**: poster apresentado **pela AAMLF em representação do investigador**. · AAMLF/responsável · `DIFF_v1.4_v1.5.md`
- 2026-11-10 · NOVO · A pedido (CCDR/AAMLF): enviados os **ficheiros originais** (não consolidados) das 9 faturas + 3 comprovativos de pagamento, cópias byte-a-byte verificadas por SHA-256, em `docs/relatorio-execucao-ccdr-2026/_private/entrega/faturas_originais/` (+ `faturas_originais.zip`). Excluídos: proforma 3DJake (substituída) e nota de entrega. · responsável
- 2026-11-14 · NOTA · Apontamento do interlocutor da AAMLF sobre a secção 9 («Actividades em curso»): (1) «2.º Encontro organizado pelo Grupo de Amigos de Museus do Algarve, não pela Rede de Museus» — a frase errada («A Rede de Museus do Algarve foi também promotora do 2.º Encontro…») está na **v1.4**, que é a versão que seguiu para a CCDR; já foi retirada na **v1.5** (27-10). (2) «alterar data para 2 de dezembro» — **não aplicado**: a secção 9 tem duas datas candidatas (Jornadas RMA 20-11-2026, confirmadas em fontes públicas a 14-11; exposição na Junta de Estoi 30-10 a 6-11-2026) e nenhum registo indica qual mudou. Aguarda indicação do responsável; depois gerar v1.6 e decidir se se reenvia à CCDR. · AAMLF + esta sessão
