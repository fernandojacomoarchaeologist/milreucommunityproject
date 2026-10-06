# Imagens distribuíveis para imprensa — Kit Digital + Press

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> Decisão de direitos: 2026-10-05, **reconciliada 2026-10-06** (ver `../USO_E_DIREITOS.md` e `docs/dissemination/RIGHTS_DECISIONS_2026-10-05.md`).

## O que é esta pasta
As **5 imagens com `press_editorial_use = YES`** da matriz do kit, em **JPEG de qualidade de imprensa** (2400 px no lado maior). **Derivados** das originais do acervo (autorizadas); não são os ficheiros crus. **Pacote de USO EDITORIAL DE IMPRENSA** — não é um ZIP genérico «livre».

## Condições de uso (obrigatórias)
- **Uso editorial por imprensa**, **sempre com a linha de crédito** indicada abaixo.
- **Crédito completo obrigatório**; **não remover marcas de água**; **não inferir créditos**; **condições da fonte permanecem aplicáveis**.
- **Sem redistribuição genérica a terceiros** (`generic_third_party_redistribution = NO`).
- **Correção/remoção** a pedido fundamentado de titulares de direitos (ver página pública `#/direitos`).
- **MM202602** («meninas») — uso **editorial do projeto com restrição de reutilização** (**não** reutilização genérica).

## Não incluídas (propositadamente)
- **MM202604, MM202627, MM202631** — `press = NO`.

## Créditos por imagem
| Ficheiro | Legenda | Data | Crédito (linha obrigatória) |
|---|---|---|---|
| `MM202601.jpg` | Um aspecto do cortejo da Festa da Pinha, em Estoi | 1909-05-02 | Arquivo Nacional da Torre do Tombo — Foto Artística Samorrinha. Autor: José Viegas Samorrinha. Ref.: PT/TT/SAM/A/001/000016. **(preservar os termos de reprodução da Torre do Tombo)** |
| `MM202603.jpg` | Achados romanos de Milreu | 1966-1967 | Página ALDEIA DE ESTOI — CULTURA E PATRIMÓNIO, gerida por Luís Barriga. |
| `MM202613.jpg` | Theodor Hauschild e equipa de escavadores em Milreu | ca. 1981 (hipótese de Cristina Farias) | Coleção de Maria de Lurdes Mendes Martins; fotografia providenciada por Celeste Pimenta e Branca Pimenta. |
| `MM202608.jpg` | Edifício de cultos, potencialmente em 1910 | potencialmente 1910 | Página ALDEIA DE ESTOI — CULTURA E PATRIMÓNIO, gerida por Luís Barriga. |
| `MM202602.jpg` | Memórias de juventude — Estoi, década de 1950 | ca. 1950s | Página ALDEIA DE ESTOI — CULTURA E PATRIMÓNIO, gerida por Luís Barriga. **(uso editorial do projeto; sem reutilização genérica)** |

Ver `CREDITOS_IMPRENSA.csv` para a versão estruturada.

## Gerar o ZIP para envio (quando necessário)
```bash
cd docs/dissemination/kit-digital-press/v1/04_IMAGENS/distribuiveis-imprensa
zip -r ../../MILREU_imprensa_imagens.zip . -x ".*"
```
