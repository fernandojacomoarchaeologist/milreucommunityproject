<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# 01 — Ingestão controlada (quarentena)

Toda entrada começa como **proposta em quarentena** e nunca modifica automaticamente dados
canónicos (`knowledge-assertions.json`, entidades, relações, catálogo, snapshots).

## Regras

- estado inicial invariável: **`draft`**; a passagem a `in_review` exige ação humana explícita;
- a **fonte** tem de existir em `knowledge-source-scope.json` e estar em `included`; fonte
  `excluded`, ausente ou ambígua é bloqueada;
- o motor **não** lê rede, URL remota, PDF, OCR, texto integral nem storage — recebe apenas JSON já
  preparado, estritamente limitado ao contrato `contracts/10e/ingestion-proposal.schema.json`;
- preserva fonte, versão, localizador, idioma, transformação, ferramenta/versão, proponente,
  instante fornecido pelo chamador e hash quando aplicável;
- rejeita IDs duplicados, colisões com dados canónicos, referências inexistentes, localizadores
  inválidos, citações sem direitos e confiança probabilística/percentual;
- conteúdo assistido por IA permanece **proposta**, nunca promovido a facto.

## Comando local

```bash
node scripts/10e/preview-ingestion.mjs <lote.json>   # ou: npm run proteus:preview-ingestion -- <lote.json>
```

- **validação estrita do contrato** (`ingestion-proposal.schema.json`): campos obrigatórios do
  lote e da proposta, `additionalProperties:false` (propriedades desconhecidas rejeitadas), idioma
  pelo enum, timestamps **ISO 8601**, `locator.sourceId === proposal.sourceId`, e — quando
  `aiAssisted:true` — `transformation`, `tool` e `toolVersion` obrigatórios;
- **sem aceitação parcial:** um lote com cabeçalho inválido rejeita todos os candidatos;
- **preservação sem mutação** dos itens aceites (texto, idioma, classe, fonte, **`sourceVersion`**,
  localizador, confiança, transformação, ferramenta/versão, `aiAssisted`, hash, proponente e
  instante); citação textual só é preservada com direitos aprovados;
- **`sourceVersion`** (versão/edição da fonte) é **opcional**; quando fornecido, string não vazia
  preservada byte-a-byte. Não se inventam versões para as fontes atuais.

**Paridade profunda com o contrato:** o núcleo recusa os mesmos tipos inválidos que o schema recusa —
`aiAssisted` não-boolean, `entityIds` não-strings, campos do localizador de tipo errado
(`id`/`notes`/`url` não-string, `pageStart`/`pageEnd` não-inteiros ≥1) e propriedades desconhecidas
em `confidence`. A **confiança é completa desde a ingestão**: `level`, `reasons` (strings) e
`limitations` (array de strings, **obrigatório mesmo quando `[]`**), preservada integralmente e sem
mutação. Uma invariável de teste garante que, se o núcleo devolve `valid:true`, a estrutura também é
válida no contrato estático.

Pré-visualização **pura**: sem `--apply`, sem escrita, limite pequeno de tamanho, recusa de
symlink/traversal/formato não-JSON. O núcleo é `src/proteus/knowledge-ingestion.mjs`.
