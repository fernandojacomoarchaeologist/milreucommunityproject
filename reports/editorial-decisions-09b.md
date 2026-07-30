# Decisões editoriais — Pacote 09B

© 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md.

Separação entre o que foi **aplicado** (Tipo A/B conservador) e o que **aguarda a tua revisão** (Tipo C). O Claude não reescreveu conteúdo substantivo autonomamente.

## Aplicado neste pacote (Tipo A — objetivo)

1. **Seletor de idiomas** (`src/components/layout.js`, `src/lib/i18n.js`, `src/main.js`): pt-PT selecionável; EN/ES/FR "em preparação" (desativados, acessíveis a leitor de ecrã); `setLanguage` recusa idiomas não selecionáveis; valor inicial do `localStorage` é coagido para pt-PT se necessário. Sem fallback silencioso, sem navegação para `null`.
2. **Footer** (`src/components/layout.js`): removido o código de pacote "Versão 08A".

## Aguarda a tua revisão (Tipo C — decisão humana; **não aplicado**)

> Estas alterações tocam significado, papel institucional, promessa pública ou benefício. Ficam como propostas.

### P1 — Home: sequência de conteúdo
- **Atual:** pilares "O portal orienta / O museu imerge / Proteus estrutura" (descreve a arquitetura interna).
- **Proposta:** reorganizar em torno de "O que é Milreu → Porque importa → O que está a acontecer → Como participo → Quanto tempo → Quem organiza → O que acontece depois".
- **Porquê:** o roteiro define este princípio de conteúdo; o Portal não deve falar sobre a sua própria tecnologia.

### P2 — Home/Proteus: promessa
- **Atual:** "A mesma fonte de dados alimentará o site, os totens e futuras aplicações."
- **Proposta:** focar no valor atual; não prometer totens/apps antes de existirem.

### P3 — /conhecimento: rótulo explícito
- **Proposta:** acrescentar um rótulo "em desenvolvimento" no topo da Experiência Proteus (já há "conteúdo futuro" nos cards).

### P4 — /participar: clareza de participação
- **Proposta:** explicitar benefício, compromisso de tempo, público-alvo e próximos passos. Alinha com o 09C (oportunidades e candidaturas).

### P5 — /sobre: enquadramento institucional
- **Proposta:** rever papel institucional, parceiros e enquadramento do doutoramento. Envolve direitos/terceiros → decisão tua.

## Itens de direitos (rights-review-required)
- Avisos de intervenção por IA e de direitos/retirada nas memórias: linguagem correta; qualquer mudança é decisão tua.

## Itens de tradução (translation-source-not-ready)
- Conteúdo do Portal/memórias/carrossel em en/es/fr: **fora do âmbito do 09B** — a tratar no 09D com revisão humana. Nenhuma tradução automática publicada.

## Lacunas para pacote próprio
- Páginas institucionais de privacidade, acessibilidade e contacto ainda não existem como rotas.
