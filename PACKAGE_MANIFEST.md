---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "05F"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Manifesto do Pacote 05F

## Identificação

- Pacote: 05F
- Versão: 0.6.0
- Finalidade: infraestrutura, persistência, CI, segurança operacional e skills.
- Próximo pacote: 06 — Arquitetura do Portal e do Museu.

## Grupos de ficheiros

| Grupo | Finalidade |
|---|---|
| `docs/architecture` | Decisões estruturais e ciclo de dados |
| `docs/security` | Acesso produtivo, segredos, RLS e incidentes |
| `docs/development` | Fluxos operacionais e modos de Claude |
| `docs/design/visual-reviews` | Gate A de revisão humana |
| `.claude/rules` | Regras obrigatórias por contexto |
| `.claude/skills` | Procedimentos reutilizáveis |
| `.claude/agents` | Revisores especializados |
| `supabase` | POC local, migrations, seed e testes SQL |
| `scripts` | Guards, validação, exports e fontes privadas |
| `.github/workflows` | CI, testes de banco e deployment protegido |
| `data/schemas` | Contratos dos snapshots públicos |
| `infrastructure` | Matrizes e políticas legíveis por máquina |
| `integration` | Fragmentos a mesclar |
| `tests` | Testes dos guards e exports |
| `releases` | Release do pacote |

## Modos de integração

- **Add:** documentação, skills, scripts, schemas e POC.
- **Merge:** `package.json`, `.gitignore`, workflows existentes.
- **Do not replace:** tokens, componentes, conteúdo migrado e configuração de publicação existente.
- **Human gate:** produção, secrets, Supabase remoto e revisão visual.

## Critérios de aceitação

- nenhuma credencial no pacote;
- produção bloqueada por defeito;
- migrations versionadas;
- POC isolado;
- testes locais;
- CI mínimo;
- build público sem binários privados;
- coleção de skills instalada;
- release de integração produzida.
