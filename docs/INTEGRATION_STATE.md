# Estado de integração — base da Série 09

© 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md.

Confirmação objetiva do estado real do repositório no início da **Série 09 — Consolidação e evolução do Portal público**. A base da Série 09 é o **último pacote efetivamente mergeado**, não o último ZIP gerado.

## Estado no arranque do 09A

| Item | Valor |
|------|-------|
| Branch base | `main` |
| Commit base | `5de5f4a` (Merge PR #36) |
| Versão | `0.28.0` |
| Working tree | limpo |
| Testes | 480 (node --test) verdes |
| Módulos colaborativos | 25 |
| Permissões | 149 |
| PRs abertos | nenhum |
| Dataset canónico do Museu | 0.11.3 (inalterado) |

## Série 08 — encerrada (tudo mergeado no `main`)

| Pacote | Versão | PR | Merge |
|--------|--------|----|-------|
| 08A–08J | 0.12.0–0.21.0 | #20–#29 | mergeados |
| 08K Piloto | 0.22.0 | #30 | mergeado |
| 08L Integração pública | 0.23.0 | #31 | mergeado |
| 08M Operação/governação | 0.24.0 | #32 | mergeado |
| 08N Refino área voluntária | 0.25.0 | #33 | mergeado |
| **08O** Hotfix carrossel + auditoria | 0.26.0 | **#34** | **mergeado** |
| **08P** Fecho funcional transversal | 0.27.0 | **#35** | **mergeado** |
| **08Q** Hotfix banner + auditoria responsiva | 0.28.0 | **#36** | **mergeado** |

## Mudança de fase

As pendências principais **já não pertencem à Área Colaborativa**. Concentram-se no **Portal, design system, internacionalização, desempenho e infraestrutura de testes**. A Série 09 trata desta evolução.

### Bloqueadores operacionais da Área Colaborativa (fora da Série 09)
Supabase staging, Google OAuth, master real, storage privado, backups, piloto 08K, acessibilidade humana — já mapeados nos *external blockers* do 08P; não se misturam com os pacotes de evolução do Portal.

## Roadmap da Série 09 (planeado)

09A qualidade (Playwright + regressão visual + progressive enhancement) → 09B fontes em runtime → 09C media/desempenho → 09D i18n + fluxo editorial → 09E SEO/partilha → 09F logo mestre + Gate B do design system → 09G Proteus/escopo público → 09H homologação pública.

O **09A vem primeiro**: instala a rede de proteção antes de mexer em fontes, media, idiomas e SEO — evitando corrigir regressões visuais de forma reativa (como aconteceu entre 08O e 08Q).
