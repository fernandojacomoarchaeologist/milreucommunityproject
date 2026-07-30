# Auditoria semântica da linguagem pública — Pacote 09B

© 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md.

Auditoria por inspeção do código real (`src/lib/i18n.js`, `public/data/portal-content.json`, `src/views/**`, `src/components/layout.js`). Fonte estruturada: [`reports/semantic-audit-09b.json`](semantic-audit-09b.json). Fugas: [`public-instruction-leaks-09b.json`](public-instruction-leaks-09b.json). Idiomas: [`language-source-inventory-09b.json`](language-source-inventory-09b.json). Decisões: [`editorial-decisions-09b.md`](editorial-decisions-09b.md).

**Resultado:** 14 elementos-chave auditados — **2 corrigidos** (Tipo A), **5 propostas pendentes** de revisão humana (Tipo C), o restante `clear`/honesto e mantido. Sem novos módulos/permissões/migrations; dataset canónico inalterado.

## Corrigido (Tipo A — objetivo)

| Rota | Elemento | Antes | Depois |
|------|----------|-------|--------|
| todas | seletor de idiomas | PT/EN/ES/FR todos clicáveis; EN/ES/FR trocavam a UI mas o conteúdo caía em pt-PT **em silêncio** | pt-PT ativo; **EN/ES/FR "em preparação"** (desativados, `aria-disabled`, leitor de ecrã ouve "Inglês — em preparação"); sem navegação falsa nem fallback silencioso |
| todas | footer | `Versão 08A · pré-visualização não indexável` | `Pré-visualização editorial · não indexável` (remove o código de pacote) |

## Propostas pendentes (Tipo C — decisão humana; **não aplicadas**)

1. **Home / pilares** — reformular a sequência para "o que é Milreu → porquê importa → como participo" em vez de descrever a arquitetura interna (portal/museu/proteus).
2. **Home / Proteus** — `proteusFeatureText` promete "totens e futuras aplicações"; evitar prometer o que ainda não existe.
3. **/conhecimento (Proteus)** — já honesto ("conteúdo futuro"); proposta menor de um rótulo explícito "em desenvolvimento".
4. **/participar** — explicitar benefício, compromisso de tempo, para quem é e próximos passos (prepara o 09C).
5. **/sobre** — rever papel institucional, parceiros e enquadramento do doutoramento.

Detalhe e diffs sugeridos em `editorial-decisions-09b.md`.

## Honesto e mantido (sem ação)

- **Proteus** apresentado como estrutura futura (empty-state + "conteúdo futuro").
- **Contacto público** declarado como "ainda por definir" (não inventar).
- **Avisos de IA e direitos** nas memórias — linguagem correta; alterações são decisão humana.
- **Área Colaborativa** — autenticada; textos cobertos pela auditoria funcional do 08P.

## Lacunas registadas (não inventadas)

- Páginas institucionais próprias (privacidade, acessibilidade, contacto) ainda não existem como rotas — a tratar em pacote próprio ligado ao lançamento.
- Tradução de **conteúdo** (Portal, memórias, carrossel) para en/es/fr — fica para o **09D** (i18n com revisão humana). As strings de UI já estão traduzidas.
