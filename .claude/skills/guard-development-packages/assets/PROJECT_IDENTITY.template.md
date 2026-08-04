<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# Contrato de identidade do repositório — <NOME DO PROJETO>

Fonte autoritativa de identidade para o Guardião de Pacotes. Preencher com valores canónicos
**confirmados por decisão humana** — nunca inferidos.

```json
{
  "schema_version": "1.0",
  "project_id": "<id-canonico>",
  "project_name": "<nome>",
  "repository_slug": "<slug-do-repositorio-git-real>",
  "canonical_remote": "<host/owner/repo>",
  "canonical_document": "CLAUDE.md",
  "expected_source_root": "src",
  "framework_signature": "<assinatura>",
  "project_routes": ["<rota-propria>"],
  "current_version": "<versao>",
  "current_package": "<pacote-ativo>",
  "allowed_package_prefixes": ["<prefixos>"],
  "foreign_markers": ["<marcadores-de-outros-projetos>"],
  "adopted_by": "<pacote-de-adocao>",
  "adopted_at": "<data>"
}
```

Ver a skill `guard-development-packages` e `scripts/verify_project_package.py`.
