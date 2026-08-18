# Milreu — Sistema de Painéis da Exposição (spec por arquétipo) v0.2.1

> © 2026 Fernando Rodrigues de Jácomo. Consultar `RIGHTS.md`.
> **Nenhum painel homologado. Arte-final = 0/12.** Formato **841 × 2000 mm = `CURRENT-HUMAN-BASELINE`** (grelha/sangria/arte `PROPOSED/PENDING`). Estados: `REPO-FACT · HUMAN-DECIDED · CURRENT-HUMAN-BASELINE · PROPOSED · PENDING · SUPERSEDED · NOT-APPLICABLE`.

## 0. Princípios
- **Nos painéis fotográficos, a fotografia é o objeto museológico central. Painéis documentais, comparativos, comunitários e institucionais podem ter outros centros de atenção.** Os módulos servem a leitura e a proveniência.
- **Um painel pode ter uma ou mais imagens. Conteúdos secundários são excecionais e dependem do conteúdo do painel, não de uma fórmula universal.**
- **Não** propor pormenores/documentos por defeito nem procurar imagens só para preencher. Neste momento, só **três casos** de enriquecimento documental estão definidos: **Q1 (bustos), Q3 (Festa da Pinha), Q4 (jornalistas ingleses)**.
- O **Q3 é caso de teste**; as regras dos restantes painéis **não** derivam automaticamente dele.

## 1. Componentes (biblioteca)
Marca de estado «MOCKUP — NÃO IMPRIMIR» · número de percurso · título · lugar/data · **fotografia principal** · legenda · crédito/proveniência · texto principal (PT) · tradução (EN, revista) · **módulo(s) secundário(s)** · **bloco institucional** · margem de base.

**Módulos secundários (camadas independentes):** um painel pode conter **uma ou mais** camadas — **pormenor · documento · fotografia atual · testemunho · item relacionado** — desde que **cada** camada acrescente **informação verificável**, tenha **proveniência e direitos** e **não** seja usada só para preencher. Independência **não** impede coexistência; **não** criar relações falsas entre camadas; **não** há máximo universal; quantidade/composição dependem do conteúdo.

## 2. Legibilidade (parâmetros distintos, todos `PROPOSED` até prova física)
Registar por elemento: tamanho nominal · altura‑x · distância de leitura (~1 m) · entrelinha · contraste · largura da coluna. Legenda e crédito têm parâmetros **próprios** (não partilham o mesmo valor). `font-size` em mm **não** equivale à altura real do caractere.

## 3. Fotografia principal
Enquadramento **integral preferencial**; **recorte permitido quando justificado**, documentado (coordenadas/transformação), conteúdo essencial preservado, **validação humana**; evitar cortes de rostos/cabeças/membros/objetos. Master de maior resolução; PPI ao tamanho. **Não é obrigatória em todos os arquétipos** (ver Q12).

---

## 4. ARQUÉTIPOS

### Arquétipo 1 — Q1 · Abertura
- **Obrigatórios:** título/identidade da exposição; fotografia principal (a fotografia histórica/comunitária dos **dois bustos** — ver §5 Q1); texto de abertura; **bloco institucional próprio** (trio + «Em parceria com» Museu do Lyceu, `PENDING`).
- **Opcionais:** camada documental secundária (ex.: busto de Agripina do Commons, como **camada**, não substituição do herói); pormenor.
- **Proibidos:** **número de percurso dominante** (a abertura não é ordenada por um «01» grande); placeholders de logótipos.
- **Pendentes:** logótipos institucionais reais; ativo público de Adriano (`PENDING-ASSET`); composição institucional.

### Arquétipo 2 — Painel fotográfico padrão
- **Obrigatórios:** nº de percurso (pequeno), título, lugar/data, fotografia principal, legenda, crédito/proveniência, texto PT, margem de base.
- **Opcionais:** tradução EN (revista); **camada(s) secundária(s)** só com necessidade editorial real e direitos.
- **Proibidos:** bloco institucional; placeholders; camadas só para preencher; relações «antes/agora» não comprovadas.
- **Pendentes:** tamanhos tipográficos (prova física); scans de maior resolução onde limítrofe.

### Arquétipo 3 — Q8 · Comparação documental / IA
- **Obrigatórios:** identificação clara das **duas imagens** (documento original + versão tratada); **divulgação do tratamento por IA em texto** (não selo/caixa); crédito/proveniência de cada imagem; regra de comparação (o que se compara e porquê).
- **Opcionais:** pormenor de conferência.
- **Proibidos:** apresentar a versão IA como documento original; usar a versão IA como herói de lançamento (**MM202617 está inelegível para painel até decisão editorial**); equivalência visual entre tratado e original.
- **Pendentes:** decisão editorial sobre a IA; MM202614 (original) como âncora documental; direitos das pessoas identificáveis.
- **Nota:** a fotografia principal **pode ser o documento original**, não a imagem tratada.

### Arquétipo 4 — Q12 · Encerramento / comunidade / instituições
- **Obrigatórios:** encerramento; **bloco institucional próprio**; devolução à comunidade.
- **Opcionais:** fotografia; **mensagens/testemunhos reais** (como composição de vozes).
- **Proibidos:** mensagens inventadas; placeholders de logótipos; fotografia principal **não é obrigatória** aqui (o painel pode organizar-se em torno das vozes).
- **Pendentes / bloqueado:** **`BLOCKED`** — faltam **mensagens comunitárias reais** e **ativos institucionais**; não produzir.

---

## 5. Casos de enriquecimento definidos (Q1, Q3, Q4)

### Q1 — bustos associados às Ruínas Romanas de Milreu
- **Identificação correta:** **Agripina Menor** e **Adriano** (imperador Adriano). **Não** «Augusto». **Não** substituir por bustos genéricos de Agripina/Adriano de outros sítios; os ativos têm de estar **inequivocamente associados a Milreu**.
- **Herói:** a fotografia histórica/comunitária que mostra **os dois bustos** permanece autorizada (`AUTHORIZED-FOR-PROJECT-PUBLICATION`) e pode ser a fotografia principal.
- **Camada secundária candidata (Agripina):** ficheiro público do Commons (Bextrel, CC BY‑SA 4.0) — tratar como **camada documental**, **não** como substituição automática do herói. **`PENDING-OBJECT-VERIFICATION`** (a ficha não distingue original vs. réplica; registar no inventário, não integrar na arte).
- **Adriano:** **`PENDING-ASSET`** — não foi localizado ativo público inequivocamente identificado como o busto de Milreu; não usar outro busto de Adriano, nem fonte comercial/sem licença; **não esconder a ausência nem resolver por substituição visual**.

### Q3 — Festa da Pinha
- Pode usar **mais de uma imagem** (histórica principal, pormenor da própria fotografia, vista atual, outra imagem relacionada). Podem coexistir, **mas não** apresentadas como equivalentes nem ligadas por relação temporal/topográfica **não comprovada**. Versão atual **em revisão**; sem Q3 v7 nesta ronda.

### Q4 — jornalistas ingleses (1913)
- Pode integrar: fotografia histórica principal; **montagem das páginas de *A Ilustração Portuguesa*, 1913** (documento **independente**, **não** «pormenor da fotografia»); texto original contextualizador; pormenores da publicação, quando legíveis e relevantes.
- **Facto sustentado apenas pela publicação.** A legenda «Dentro do grande edifício romano» **não autoriza** substituir «edifício romano» por «edifício de culto». Registar estrutura e ativos; **não** produzir o Q4.

## 6. Regras duras
1. Módulo opcional só entra com **relação documental/narrativa verificável**.
2. **Não** adicionar imagens/texto só para preencher.
3. Pormenor, documento, fotografia atual e testemunho são **camadas independentes** (coexistem, não se equivalem).
4. Relações «antes/agora» só quando a correspondência estiver **demonstrada**.
5. Hipóteses internas **não** aparecem como factos na arte pública.
6. A tabela de afirmações **não legitima** uma frase não comprovada.
7. **Q3 = caso de teste**; não generalizar automaticamente.
8. **Q1 e Q12** têm composição institucional própria.
9. **Não** criar placeholders visuais de logótipos.
10. **Nenhum painel homologado; arte-final = 0/12.**

## 7. Logótipos (separação explícita)
- **Projeto Comunitário de Milreu:** derivados raster `draft`; SVG `PENDING`; **uso no site ≠ aprovação**; não vetorizar/redesenhar automaticamente.
- **Trio institucional:** República Portuguesa → Património Cultural, I.P. → Ruínas de Milreu (indivisível) — ficheiros reais `PENDING`.
- **Ruínas de Milreu:** parte do trio.
- **Museu do Lyceu de Faro:** bloco «Em parceria com»; nova marca `PENDING-HUMAN / PENDING-ASSET`.
- **Área de proteção e dimensão mínima:** `PENDING` (decisão humana).
