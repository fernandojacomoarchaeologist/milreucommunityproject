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

Pré-visualização **pura**: sem `--apply`, sem escrita, limite pequeno de tamanho, recusa de
symlink/traversal/formato não-JSON. O núcleo é `src/proteus/knowledge-ingestion.mjs`.
