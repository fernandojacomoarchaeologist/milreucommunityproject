# Milreu — Design System transversal (crossmedia) v0.2.1

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar `RIGHTS.md`.
> Revisão documental. **Existência num ficheiro ≠ aprovação.** Nada aqui é PASS/homologação/arte-final.

## 0. Taxonomia de estados
`REPO-FACT` · `HUMAN-DECIDED` · `CURRENT-HUMAN-BASELINE` (baseline humano em vigor, com detalhes ainda por fechar) · `PROPOSED` · `PENDING` · `SUPERSEDED` · `NOT-APPLICABLE`.

---

## A. NÚCLEO COMUM (restrito ao verdadeiramente partilhável)
1. **Identidade e arquitetura de marca** — `HUMAN-DECIDED`. Guarda-chuva **Projeto Comunitário de Milreu**; **Proteus** e **Museu de Memórias** subordinados, sem logótipo próprio. (`brand-architecture`, `proteus-naming`.)
2. **Linguagem e nomes canónicos** — `REPO-FACT`. Nomes por extenso; sem siglas inventadas.
3. **Fotografia e proveniência** — `HUMAN-DECIDED`. Registo, enquadramento/recorte documentados, original preservado, crédito+proveniência+direitos sempre presentes, tratamento/IA declarados. (`IMAGERY_TEXTURE_PHOTOGRAPHY`.)
4. **Papéis tipográficos** — `HUMAN-DECIDED`. **Fraunces** (display), **Spectral** (leitura), **Archivo** (interface/metadados/créditos). A hierarquia não depende da presença da fonte.
5. **Paleta essencial** — `HUMAN-DECIDED`. **Marfim** (superfície), **preto quente** (leitura), **vermelho/tijolo** (assinatura, nunca fundo de leitura extensa/cabeçalho/overlay). *(Os estados de certeza pátina/sépia/pedra são do perfil web — ver §B.)*
6. **Governação** — `REPO-FACT`. Tokens semânticos; `design-token-change`/`design-system-change`; `component-intake` + `COMPONENT_REGISTRY`; maturidade `proposed→draft→validated→approved` (só `approved` por decisão explícita).
7. **Política contra afirmações não documentadas** — `PROPOSED`. Taxonomia de afirmações: `DOCUMENTADO` · `OBSERVÁVEL` · `DOCUMENTADO PELO BRIEF` (fonte bibliográfica `PENDING`) · `METODOLÓGICO` (declaração de método, não facto) · `INTERPRETAÇÃO` (editorial) · `PENDENTE`. **Uma tabela não legitima uma frase não comprovada** — o não comprovado sai da arte pública; linguagem de bastidores fica fora do texto do visitante.

> **Nota sobre «ordem editorial»:** é **hierarquia de atenção e conteúdo**, **não** ordem espacial obrigatória. Ver §D (quatro eixos editoriais distintos). Não representar as diferentes ordens por uma única seta.

8. **Linguagem interna vs. pública** — `HUMAN-DECIDED`. A taxonomia de afirmações é **interna**; **nunca** transpor códigos (`PENDING`, `DOCUMENTED`, `INTERPRETAÇÃO`, `NOT-PLANNED`…) para o painel/site. A incerteza comunica-se de forma **natural e clara, sem ser escondida**. Vocabulário público controlado: **atribuído/a** (catálogo/coleção/legenda/testemunho) · **estimado/a** (intervalo/cálculo fundamentado) · **possivelmente** (indícios interpretativos, sem confirmação) · **desconhecido/a** (sem base suficiente) · **potencial** (só relações/usos editoriais em consideração). Não usar estes termos de forma arbitrária. Antes de redigir uma data/atribuição, registar **fonte** e **grau de cautela** no inventário interno.

---

## B. PERFIL WEB — `REPO-FACT`
- Tokens CSS (`src/styles/tokens.css`): `--ml-color-*`, semânticos `--ml-surface/text/border/focus-*`.
- **Estados de certeza (aqui, não no núcleo):** `--ml-certainty-confirmed` (pátina `#5E7267`), `probable` (sépia `#8A6A4A`), `hypothesis` (pedra `#6F6456`) — **método interno/digital**; a cor nunca é o único indicador.
- Unidades `rem`/`clamp()`/`ch`; medida `68ch`; contentor `90rem`; breakpoints em `rem` + `375px`.
- **Fontes: fallbacks** (Iowan Old Style/Georgia/Helvetica Neue); o site **não carrega webfonts**.
- Navegação Portal/Museu; componentes; movimento (`--ml-duration-*`, `prefers-reduced-motion`); foco/teclado/`noscript`; modo imersivo.

---

## C. PERFIL EXPOSIÇÃO — próprio (não converter `rem`/píxeis em mm)
- **Formato: 841 × 2000 mm = `CURRENT-HUMAN-BASELINE`**; grelha/margens/sangria/arte = `PROPOSED/PENDING`. (1000 × 800 = `SUPERSEDED`; ver `MILREU_FORMAT_MIGRATION_NOTE_v0.2.md`.)
- Grelha/margens em mm; distância de leitura ~1 m; **fotografia principal** (ver política §E); **camadas secundárias** excecionais (ver spec); recorte documentado; PPI por imagem; proveniência/créditos na placa; **área institucional só Q1/Q12**; base calma; sangria/segurança `PROPOSED` (pendente de definição e prova física).
- **Perfil de impressão** (PDF/X‑4, ICC) = `PENDING`. **PT dominante; EN só após revisão humana.**

### Tipografia real
As fontes reais (Fraunces/Spectral/Archivo, OFL) foram **instaladas localmente apenas para os estudos** (render de mockups). **Incorporação, licença e exportação para produção impressa permanecem `PENDING`** (não integradas ao repositório; a licença/instalação de produção é decisão humana).

---

## D. ORDEM EDITORIAL — quatro coisas distintas (substitui a formulação ambígua)
Distinguir **quatro** eixos e **não** os representar por uma só seta:

### D.1 Atenção visual (peso) — **específica por arquétipo**
Painel fotográfico padrão: 1. fotografia principal · 2. título · 3. texto principal · 4. imagens/documentos secundários · 5. legenda e proveniência · 6. elementos institucionais (quando aplicáveis). Q1/Q8/Q12 têm hierarquias próprias (ver `MILREU_EXPO_PANEL_SYSTEM_SPEC`).

### D.2 Ordem semântica dos dados (modelo de informação) — **comum**
Estrutura do registo: identificador · título · lugar/data · autoria/proveniência · direitos · descrição · relações · fontes. É o **modelo**, **não** a obrigação de imprimir todos os campos.

### D.3 Sequência de leitura espacial — painel padrão
1. nº de percurso · 2. título · 3. lugar e data · 4. fotografia principal · 5. legenda · 6. crédito/proveniência · 7. texto PT · 8. tradução EN (revista) · 9. imagens/documentos/testemunhos secundários · 10. créditos dos módulos secundários · 11. área institucional (só quando aplicável).

### D.4 Posição física no painel
Onde cada elemento assenta, em mm (faixa de leitura, base calma, área institucional). Decorre do arquétipo e da **prova física**; **não** deriva de `rem`/píxeis.

**Regra pública:** mostrar «desconhecido» só quando a ausência for relevante; **omitir** campos desconhecidos que não sirvam a narrativa; **nunca** preencher lacunas por inferência.
**Exceções:** Q1 (abertura, sem número dominante, identidade + bloco institucional); Q8 (comparação/IA); Q12 (encerramento, comunidade + bloco institucional).

---

## E. FOTOGRAFIA E RECORTE (política corrigida)
- **Enquadramento integral preferencial** (não «obrigatório universal»).
- **Recorte permitido quando editorialmente justificado**, com **coordenadas e transformação documentadas**, **conteúdo essencial preservado** e **validação humana obrigatória**; evitar cortes acidentais de **rostos, cabeças, membros e objetos relevantes**.
- **Fotografia atual («o lugar hoje»):** preferir fotografia própria do projeto; permitir imagem externa **com autoria, proveniência, direitos e resolução confirmados**; **nunca** imagem gerada por IA como documentação do estado atual.
- **Documentos:** OCR pode ser utilizado como **assistência**. **Toda transcrição destinada ao público exige confronto com a imagem original e revisão humana integral.** **Preservar separadamente imagem, saída OCR e transcrição revista.**

---

## F. LEGIBILIDADE (parâmetros distintos)
Distinguir e registar separadamente: **tamanho nominal da fonte** · **altura‑x/altura visual** · **distância de leitura** · **entrelinha** · **contraste** · **largura da coluna**. **`font-size: 8 mm` não produz caracteres com 8 mm de altura** (a altura‑x é menor). **Legenda e crédito têm parâmetros próprios** (não partilham automaticamente o mesmo valor). Todos os valores permanecem **`PROPOSED` até prova física**.

---

## G. LICENCIAMENTO E DIREITOS
- **Camada original do Projeto Comunitário de Milreu = CC BY 4.0**: textos próprios, metadados próprios, afirmações, entidades, mapeamentos e documentos originais do projeto.
- **Ativos de terceiros, arquivos, fotografias comunitárias e logótipos = excluídos do CC BY 4.0**, regidos pelos respetivos direitos.
- **Fotografias comunitárias = `AUTHORIZED-FOR-PROJECT-PUBLICATION / OTHER-USES-NOT-ESTABLISHED`.** Decisão confirmada: «As fotografias foram cedidas pela comunidade e estão autorizadas para publicação no projeto.» **Publicação no projeto autorizada. Sublicenciamento, relicenciamento, reutilização externa e treino de IA não estão demonstrados pela informação disponível e não devem ser presumidos.** (Não inventar cláusulas ausentes.)

### Tabela de direitos e licenças
| Tipo de conteúdo | Titular/origem | Autorização/licença | Reutilização permitida | Crédito | Restrições |
|---|---|---|---|---|---|
| Camada original do projeto | Projeto Comunitário de Milreu | **CC BY 4.0** | sim, com atribuição | «© 2026 Fernando Rodrigues de Jácomo — Projeto Comunitário de Milreu» | não cobre ativos de terceiros |
| Fotografias comunitárias | comunidade (cedência) | **AUTHORIZED-FOR-PROJECT-PUBLICATION / OTHER-USES-NOT-ESTABLISHED** | publicação **no projeto** autorizada | crédito do detentor | sublicença, relicenciamento, uso externo e treino de IA **não demonstrados** — não presumir (nem PD/CC) |
| Arquivos históricos (ex.: Torre do Tombo; Ilustração Portuguesa/Hemeroteca) | arquivo/publicação | condições próprias do arquivo | conforme o arquivo | ref. do arquivo obrigatória | reprodução sujeita a termos; confirmar |
| Commons — busto de Agripina | Bextrel (Wikimedia Commons) | **CC BY‑SA 4.0** | sim, com atribuição + share‑alike | «Bextrel, CC BY‑SA 4.0, via Wikimedia Commons» | share‑alike; verificar ficha |
| Logótipos (projeto e institucionais) | respetivos titulares | direitos de marca / uso institucional | não | conforme titular | derivados do projeto = `draft`; institucionais `PENDING` |

---

## H. Pendências transversais (`PENDING`, HUMAN)
Perfil de impressão (PDF/X‑4 + ICC) + prova física + PPI · fontes reais para produção · SVG oficial + área de proteção/dimensão mínima + institucionais reais + Museu do Lyceu · QR final (URL público) · fontes bibliográficas dos itens `DOCUMENTADO PELO BRIEF`.

*(A migração de formato 1000×800 `SUPERSEDED` → 841×2000 `CURRENT-HUMAN-BASELINE` foi **aplicada** e sai das pendências — ver `MILREU_FORMAT_MIGRATION_NOTE_v0.2.md`.)*
