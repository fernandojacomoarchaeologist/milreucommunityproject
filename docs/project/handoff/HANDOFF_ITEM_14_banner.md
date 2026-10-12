# Handoff — Item 14 · Banner institucional vertical (lona 850×2000)

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> Método comum: ver [`00_INDEX_E_METODO.md`](00_INDEX_E_METODO.md). Estado vivo: `docs/project/ESTADO_ITENS_1-5_2026-10-01.md` (secção «Item 14»). **Sessão 2026-10-08→12 — HUMAN GATE, sem commit/PR.**

**O que é.** Banner **institucional perene** do Projecto — **lona vertical 850×2000 mm**. Identidade **principal e permanente** do projecto; «Museus sem Fronteiras · Iniciativas 2026» como **camada secundária**.

## 1. Local dos arquivos
- **`docs/dissemination/banner-institucional/`**:
  - `ARQUITETURA_E_COPY_v0.1.md` — arquitectura + copy.
  - **`source/generators/banner_build_v06.py`** — gerador canónico (**= v0.6b**).
  - `proof/BANNER_v0.6b_final.png` — prova final (+ crops `…_crop_sobre.png`, `…_crop_coordenacao.png`, histórico v0.1→v0.6).
  - `print/BANNER_v0.6b_PRINT_856x2006mm_sangria3mm.pdf` + `.png` — **prova para gráfica** (850×2000 trim + 3 mm sangria + marcas; **3× LANCZOS → ~152 dpi; RGB**).
  - **`_private/imagens/`** (gitignored) — imagens de origem.

## 2. Pontos mais importantes
- **Estado: v0.6b · HUMAN DESIGN PASS / FINAL ART READY · PREPRESS PENDING.** Prova para gráfica gerada. **Sem commit/PR.**
- **Hierarquia canónica no rodapé:** **Projecto em cima → MSF 2026 em baixo → iniciativas do ciclo → logos (ordem canónica).**
- **3 imagens P&B, autoria DESCONHECIDA** («Aldeia de Estói» = só fonte digital, NÃO autor):
  - **MM202608** (edifício de cultos, c.1910).
  - **MM202613** (equipa de escavações, c.1981; col. M. L. Mendes Martins / prov. Celeste e Branca Pimenta).
  - **MM202603** (achados romanos, associados às descobertas de 1966).
- **4 FRENTES:** «Entre Ruínas e Memórias» · Circuito Educativo · **Documentando Milreu** · Investigação, participação e comunicação científica. ⚠️ **«Documentando Milreu» NÃO é apresentada como iniciativa MSF 2026** (é frente do projecto).
- Logo diz «PROJETO» (asset oficial) — **preservar**; não corrigir para «Projecto».

## 3. Como se estruturou a arte
Vertical, 2 passagens de distribuição. De cima para baixo: **logótipo** (marca principal) · enquadramento «Arqueologia Pública e Comunitária · Ruínas Romanas de Milreu, Estói (Faro)» · **MSF 2026** secundário · **faixa documental de 3 imagens P&B** · **Sobre o projecto** (perene, origem no doutoramento UAlg) · **4 FRENTES** · **Coordenação** (bio sintética) · **rodapé** (hierarquia canónica + logos). Fraunces/Spectral/Archivo; paleta v0.2. Micro-QA final PASS (créditos legíveis, safe area, logos, PROJETO preservado).

## 4. Como se trabalhou ponto a ponto
1. v0.1 (brief) → v0.2 (A sem-foto / B com-foto) → v0.3 (sóbria/visual) → v0.4 (C1 B&W contemporânea / C2 B&W histórica) → v0.5 (consolidado, base C2) → **v0.6 / v0.6b** (micro-QA final).
2. Correcção 3.ª imagem: **autoria desconhecida** (não L. Barriga).
3. Fixação da **hierarquia de rodapé** (Projecto > MSF 2026) como canónica.
4. **Prova para gráfica**: 3× LANCZOS → ~152 dpi RGB + sangria 3 mm + marcas.

## 5. O que NÃO fazer
- **NÃO** inverter a hierarquia (Projecto sempre acima de MSF 2026).
- **NÃO** apresentar «Documentando Milreu» como iniciativa MSF 2026.
- **NÃO** atribuir autoria das fotos (é **desconhecida**); «Aldeia de Estói» é só fonte digital.
- **NÃO** «corrigir» o logo «PROJETO» (asset oficial preservado); **NÃO** vetorizar por inferência.
- **NÃO** usar gradientes/brilhos/texturas (`flat-colours`); vermelho ≠ fundo de leitura.
- **NÃO** commitar/abrir PR (HUMAN GATE).

## 6. Resultado esperado
Banner institucional perene pronto para lona após prepress: **re-render print-grade** a resolução real com **logótipo em VETOR** + fotos à resolução total; **CMYK** se a gráfica exigir; formato/acabamento (ilhós vs rollup) confirmados.

## 7. Documentos necessários
`ARQUITETURA_E_COPY_v0.1.md`; `docs/governance/IDENTITY_2026_MUSEUS_SEM_FRONTEIRAS.md` (hierarquia de marca); `docs/dissemination/RIGHTS_DECISIONS_2026-10-05.md`; «Nota — conjunto canónico de parcerias».

## 8. Pendências observadas
- 🔴 **Re-render «print-grade»** a resolução real com **logótipo em VETOR** (SVG oficial do logo **pendente** no projecto; raster 450px suaviza a 360 mm) + fotos à resolução total.
- 🟠 **CMYK** (confirmar se a gráfica exige; hoje RGB).
- 🟠 **Formato/acabamento** (lona com ilhós vs rollup; margem extra; sangria pedida).
- 🟠 **Sem commit/PR** (HUMAN GATE).

## 9. Dossiê do modo de trabalhar (Item 14)
Peça **institucional perene** (não de ciclo): a camada 2026 é secundária e a hierarquia Projecto > MSF é inviolável. Imagens históricas com **autoria desconhecida** tratadas com honestidade (fonte digital ≠ autor). Iteração A/B com comparações lado-a-lado; prova RGB ampliada como aproximação até ao re-render vetorial. Logo oficial preservado tal como é.

## 10. Onde está cada informação
- **Prova/print:** `docs/dissemination/banner-institucional/proof/` + `print/`. **Gerador:** `source/generators/banner_build_v06.py`.
- **Arquitectura/copy:** `ARQUITETURA_E_COPY_v0.1.md`. **Imagens:** `_private/imagens/` (gitignored).
- **Estado/histórico:** `docs/project/ESTADO_ITENS_1-5_2026-10-01.md` (Item 14) + memória da sessão.

## 11. Registo incremental (append-only — acrescentar no fim; nunca reescrever entradas)
> Formato: `AAAA-MM-DD · TIPO · descrição · fonte`. TIPO ∈ **NOVO** · **DECISÃO** · **ALTERADO** · **REMOVIDO** · **PENDENTE** · **RESOLVIDO**. Método em `00_INDEX_E_METODO.md`.

- 2026-10-12 · NOVO · Registo incremental iniciado. Estado de referência = §2 deste ficheiro (2026-10-12).
- 2026-10-12 · ALTERADO · Rodapé reconstruído como **faixa canónica única** (Projecto · CCDR · AAMLF · Junta de Freguesia de Estoi · trio indivisível · UAlg); removido o destaque isolado da CCDR sob «APOIO»; logótipo do Projecto incluído na faixa (redundante com o topo, por decisão do responsável). · responsável
- 2026-10-12 · ALTERADO · Espaçamento corrigido para o **canónico**: gap = 0,6 × altura, igual entre todos; largura preenchida por escala uniforme das alturas (nunca alargando intervalos). · responsável
- 2026-10-12 · ALTERADO · Imagem central (equipa de escavações, MM202613) com recorte das margens brancas + zoom para preencher a célula. · responsável
- 2026-10-12 · RESOLVIDO · Alterações **persistidas** em `source/generators/banner_build_v06.py` (reprodutível). Finais: `proof/BANNER_v0.6b_final.png` + `print/BANNER_v0.6b_PRINT_856x2006mm_sangria3mm.{png,pdf}`; CMYK «Generic» no cofre Temporary. **APROVADO** pelo responsável. · sessão
- 2026-10-12 · DECISÃO · CMYK = perfil «Generic» só como referência; entregar RGB (print c/ sangria) e a **gráfica faz a conversão**. · responsável
