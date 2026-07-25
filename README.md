---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08F"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Pacote 08F — Revisão Editorial e Curatorial do Museu

**Versão:** 0.17.0  
**Base cumulativa:** Pacote 08E.

## Escopo

- revisão das 31 memórias;
- propostas campo a campo;
- comparação canónica/candidata;
- fontes e contributos;
- comentários bloqueantes;
- checks;
- aprovações editoriais, de direitos e publicação;
- snapshots;
- aplicação local protegida;
- formação;
- biblioteca;
- efeitos orgânicos na Home do Portal e do Museu;
- preservação formal de contexto.

## Rotas

```text
#/area-colaborativa/biblioteca
#/area-colaborativa/formacao
#/area-colaborativa/formacao/:trilha
#/area-colaborativa/revisao-museu
#/area-colaborativa/revisao-museu/:memoria
#/area-colaborativa/revisao-museu/:memoria/preview
#/area-colaborativa/gestao/revisao-museu
#/area-colaborativa/gestao/revisao-museu/:memoria
#/area-colaborativa/gestao/revisao-museu/releases
```

## Formação

Percursos:

1. Fundamentos do projeto;
2. Revisão editorial e evidência;
3. Direitos, créditos e IA;
4. Tradução e localização;
5. Escrita pública e acessibilidade.

Aprovações utilizam gates de formação.

## Snapshot

```bash
npm run museum:review-export
```

Sem configuração remota, o comando valida e preserva o snapshot local.

Para exportar:

```bash
MILREU_SUPABASE_URL="..." MILREU_SUPABASE_PUBLISHABLE_KEY="..." MILREU_SUPABASE_ACCESS_TOKEN="JWT_DE_UTILIZADOR" MILREU_MUSEUM_REVIEW_SNAPSHOT_ID="..." npm run museum:review-export
```

## Aplicação

Dry-run:

```bash
npm run museum:review-apply
```

Aplicação real:

```bash
MILREU_APPLY_EDITORIAL_SNAPSHOT="I_CONFIRM_APPLY_APPROVED_MUSEUM_REVIEW" npm run museum:review-apply
```

Depois:

```bash
npm run museum:index
npm run museum:audit
npm run channels:export
npm run validate
npm test
npm run build
npm run smoke
```

A aplicação cria backup e deve seguir para PR. Não publica automaticamente.

## Contexto

Ficheiros cumulativos:

- `PROJECT_CONTEXT_LEDGER.md`;
- `PACKAGE_DEPENDENCY_MAP.md`;
- `CHANGE_SURFACE_REGISTRY.md`;
- `CONTEXT_RECOVERY_PROTOCOL.md`;
- `package-impact-registry.json`.

Esses ficheiros devem acompanhar todos os próximos pacotes.
