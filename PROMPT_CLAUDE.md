---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "06"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Prompt de integração — Pacote 06

Estás a integrar o **Pacote 06 — Arquitetura do Portal e do Museu**.

## Contexto já confirmado

- Pacotes 01–05F integrados;
- CI ativo e verde;
- Gate A concluído;
- 17 elementos `accepted-for-architecture`;
- tokens v0.2 canónicos;
- navegação responsiva validada;
- logótipo claro e escuro revistos;
- Supabase aprovado para o Milreu Proteus;
- binários privados desacoplados do build público.

## Antes de agir

1. Lê:
   - `README.md`;
   - `PACKAGE_MANIFEST.md`;
   - `docs/architecture/ARCHITECTURE_OVERVIEW.md`;
   - `docs/architecture/INFORMATION_ARCHITECTURE.md`;
   - `docs/architecture/PORTAL_MUSEUM_BOUNDARY.md`;
   - `docs/mvp/MVP_SCOPE.md`.
2. Inspeciona as rotas, componentes e scripts já existentes.
3. Não sobrescrevas decisões anteriores sem comparar.
4. Não publiques dados reais.
5. Não ligues ao Supabase remoto.
6. Não promovas componentes para `approved`.
7. Se existir conflito com o Gate A, interrompe e pergunta.

## Integração

1. Copia documentação, manifests, specs, rules, skills, protótipo e testes.
2. Mescla `integration/package-json.fragment.json`.
3. Executa:
   - `npm run architecture:validate`;
   - `npm run architecture:test`;
   - `npm run architecture:prototype:serve`.
4. Revê o protótipo em 1280, 768 e 375 px.
5. Verifica:
   - entrada no Museu;
   - retorno ao Portal;
   - galeria;
   - detalhe;
   - modo imersivo;
   - linha temporal;
   - fallback de idioma;
   - registo indisponível.
6. Gera release de integração.

## Decisões fixas

- nome público: Projeto Comunitário de Milreu;
- Milreu Proteus não substitui a marca;
- Portal e Museu usam shells diferentes;
- quatro idiomas: pt-PT, en, es e fr;
- vermelho como assinatura e abertura;
- preto aquecido como destaque;
- superfícies claras para leitura;
- snapshots JSON no MVP;
- mapa vivo e submissão ficam fora do MVP;
- dados reais só entram após revisão editorial.

## Resultado esperado

- arquitetura documentada;
- rotas validadas;
- wireframes navegáveis;
- matrizes consistentes;
- backlog pronto para o Pacote 07;
- nenhuma implementação produtiva.
