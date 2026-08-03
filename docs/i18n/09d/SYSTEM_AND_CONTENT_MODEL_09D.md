---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "09D"
---

# Sistema e modelo de conteúdo

## Fluxo

```text
missing
→ draft | machine-draft
→ in-review
→ changes-requested | approved
→ published
→ archived
```

## Fonte

- contentId;
- domínio;
- chave estável;
- idioma-fonte;
- versão;
- estado;
- autoria;
- direitos;
- proveniência;
- certeza, quando aplicável.

## Tradução

- translationId;
- contentId;
- locale;
- sourceVersion;
- status;
- texto;
- tradutor;
- revisor;
- notas;
- aprovador;
- data de publicação;
- assistência de máquina;
- indicador de fonte alterada.

Alteração da fonte deve marcar traduções potencialmente desatualizadas, sem as sobrescrever.
