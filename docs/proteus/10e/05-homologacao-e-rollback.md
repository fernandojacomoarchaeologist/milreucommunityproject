<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# 05 — Homologação, rollback e limitações

## Homologação humana (antes do merge)

Conferir, sem alterar dados, no pacote de revisão (`npm run proteus:review-packet`):

- total **16** e distribuição por classe/prioridade (**8 high, 7 normal, 1 time_sensitive**);
- evidências/localizadores presentes; hipóteses e incertezas preservadas como tais;
- item temporal `a10c1-016` sinalizado para reverificação;
- **nenhum** botão/ação pública, aprovação, revisor ou direito presumido; **nenhuma** saída em `public/`.

Testes manuais negativos (todos devem **bloquear**): rever sem `reviewerId`; publicar após aprovação
editorial; `apiExposure:allow` sem prova; ingerir fonte excluída; usar `--apply`.

## Rollback

Tudo é aditivo e repo-interno. Reverter = remover os 26 caminhos do 10E (contratos, núcleos,
scripts, registos vazios, testes, docs) e a alteração de `scripts` em `package.json`. Não há
migrations, dados canónicos alterados nem estado servido; o rollback não afeta a Biblioteca, a API,
o snapshot nem os 16 registos.

## Limitações

- fundação servida/persistência depende de Supabase futuro e de decisões humanas;
- **HD-03 a HD-07** continuam `PENDING-HUMAN`;
- `proteus-overview.json`↔`validate-10a` e o pin legado `currentPackage="10B"`↔`validate-09d`
  permanecem por reconciliar (fora do âmbito do 10E).
