<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# Contrato de identidade do repositório — Projeto Comunitário de Milreu

Este documento é a **fonte autoritativa de identidade** deste repositório para o Guardião de
Pacotes de Desenvolvimento. Nenhum pacote pode ser inspecionado, extraído, aplicado, gerado ou
reportado sem que a sua identidade corresponda exatamente aos valores canónicos abaixo.

A identidade **nunca** é inferida a partir do título da conversa, do nome do ficheiro, da memória
recente ou de garantias do operador. Se este contrato faltar, ou se algum identificador exato
divergir, o resultado é `PROJECT GATE: BLOCKED` — e o contrato **não** pode ser criado por
inferência (exige decisão humana explícita, como sucedeu na adoção GOV-01).

## Valores canónicos (autoritativos)

```json
{
  "schema_version": "1.0",
  "project_id": "milreu-public-archaeology",
  "project_name": "Projeto Comunitário de Milreu",
  "repository_slug": "milreucommunityproject",
  "canonical_remote": "github.com/fernandojacomoarchaeologist/milreucommunityproject",
  "canonical_document": "CLAUDE.md",
  "expected_source_root": "src",
  "framework_signature": "vanilla-js SPA static-first: src/main.js + hash router (src/lib/router.js) + public/data JSON",
  "project_routes": ["/museu", "/conhecimento/biblioteca", "/conhecimento/afirmacoes"],
  "current_version": "0.38.0",
  "current_package": "10C",
  "allowed_package_prefixes": ["10", "GOV"],
  "foreign_markers": ["Compostela", "compostela", "Godot", "GDD", "game engine", "godot", "project.godot"],
  "adopted_by": "GOV-01",
  "adopted_at": "2026-08-04"
}
```

## Sinais de verificação (mínimo três, independentes)

1. **Remote canónico** — `git remote` termina em `fernandojacomoarchaeologist/milreucommunityproject`.
2. **Documento canónico** — `CLAUDE.md` presente na raiz, com as instruções permanentes do projeto.
3. **Assinatura de framework / raiz de código** — SPA vanilla-js static-first com `src/main.js`, router por hash em `src/lib/router.js` e dados em `public/data/*.json`.
4. **Rotas próprias** — `/museu`, `/conhecimento/biblioteca`, `/conhecimento/afirmacoes` presentes em `src/lib/router.js`.
5. **Estado versionado** — `package.json` em `current_version` e `package-impact-registry.json` em `current_package`.

## Marcadores estrangeiros (bloqueiam se presentes no pacote)

Qualquer referência forte a **Compostela**, a motores de jogo (**Godot**, `project.godot`, **GDD**,
"game engine") ou a outro projeto distinto é um marcador estrangeiro. A sua presença material num
pacote destinado a este repositório força `PROJECT GATE: BLOCKED`. Ignoram-se ocorrências em
`.git`, caches de dependências, saída de build, arquivos e nos próprios ficheiros de controlo de
identidade.

## Regra de correspondência

- `project_id` e `repository_slug` exigem **igualdade exata** com o `PACKAGE_IDENTITY.json` do pacote.
- `expected_base_commit` do pacote deve ser o `HEAD` atual **ou** um ancestral explicitamente
  permitido pelas instruções do pacote (`base_commit_policy`).
- A sequência do pacote deve seguir o `current_package`/`current_version` deste contrato.
- Pelo menos **três** sinais independentes acima têm de ser provados.

Ver a skill `guard-development-packages` e `scripts/verify_project_package.py` para a execução
automatizada do gate.
