---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "07D"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Prompt de integração — Pacote 07D

Integra o Pacote 07D cumulativamente sobre o 07C.

## Objetivo

Fechar o MVP técnico, criar saídas multicanal e preparar publicação controlada sem declarar o site ou os materiais físicos como aprovados.

## Antes de agir

1. Lê `README.md`.
2. Lê a documentação de `docs/channels` e `docs/release`.
3. Preserva o Portal, o Museu e o modo imersivo.
4. Não inventes domínio.
5. Não atives totens ou painéis.
6. Não declares previews como print-ready.
7. Não publiques MM202617.
8. Não atribuas licença aberta às fotografias.

## Integração

1. Mescla os ficheiros.
2. Executa:
   - `npm install`;
   - `npm run channels:export`;
   - `npm run museum:index`;
   - `npm run museum:audit`;
   - `npm run validate`;
   - `npm test`;
   - `npm run build`;
   - `npm run smoke`;
   - `npm run release:readiness`.
3. Abre Portal, Museu, ecrã inteiro e `#/laboratorio/canais`.
4. Testa um totem e um painel.
5. Confirma 30 páginas estáticas e 30 JSONs no build.
6. Revê workflows antes de os ativar.
7. Não aciones Pages sem pedido explícito.

## QR

Só gerar com URL real:

```bash
MILREU_PUBLIC_BASE_URL="<URL REAL>" npm run channels:qr:generate
```

## Produção física

Permanece bloqueada até dimensões, suporte, seleção curatorial, textos, QR, resolução, perfil de cor, sangria, prova e revisão de créditos.

## Resultado

MVP técnico executável, exports multicanal, previews físicos, páginas estáticas, JSON-LD, CI e workflow de publicação manual.
