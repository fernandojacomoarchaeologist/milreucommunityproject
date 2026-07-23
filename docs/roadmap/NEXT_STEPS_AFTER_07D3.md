---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "07D.3"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Próximos passos após o 07D.3

O MVP técnico está funcional. O próximo ciclo deve transformar o conteúdo preliminar em conteúdo publicável, sem misturar revisão editorial, infraestrutura pública e produção física.

## Etapa 1 — integrar e rever o 07D.3

- integrar o hotfix;
- abrir MM202617 no card, detalhe e modo imersivo;
- confirmar a clareza do aviso de IA;
- decidir posteriormente se permanece, é reformulado ou volta a ser ocultado;
- não alterar `publicReleaseEligible` nesta etapa.

## Pacote 08A — interface de revisão editorial e curatorial

Criar uma área restrita para rever os 31 registos, campo a campo.

### Campos

- título;
- data e precisão;
- descrição objetiva;
- narrativa comunitária;
- contexto histórico;
- contexto institucional;
- crédito;
- direitos;
- fontes;
- intervenções digitais;
- relações;
- traduções;
- visualização Portal/Museu/totem/painel.

### Estados por campo

- pendente;
- aceite;
- corrigir;
- bloqueado;
- não aplicável.

### Decisão por registo

- preliminary;
- in-review;
- approved;
- contested;
- withdrawn.

MM202617 terá uma revisão específica de transparência, relação com o original e limites de utilização.

## Pacote 08B — aplicação das decisões e saneamento

- aplicar textos aprovados;
- preservar histórico e autoria;
- resolver ou justificar as 37 relações não recíprocas;
- consolidar datas e níveis de certeza;
- rever intervenções digitais;
- atualizar índice, coleções e exports;
- produzir snapshot editorial versionado.

## Pacote 08C — gate editorial e de direitos

- confirmar créditos e detentores;
- confirmar condições de publicação;
- fechar pedidos de correção/retirada;
- definir contacto público real;
- separar registos aprovados, contestados e bloqueados;
- atualizar `release-readiness.json`.

## Pacote 08D — tradução, acessibilidade e lançamento técnico

### Traduções

Traduzir somente textos portugueses já aprovados:

- inglês;
- espanhol;
- francês.

### Acessibilidade

- auditoria de teclado;
- contraste;
- leitores de ecrã;
- textos alternativos;
- reduced motion;
- formulários;
- modo imersivo;
- testes em desktop, tablet e telemóvel.

### Domínio e deployment

Somente depois dos gates editoriais:

- escolher domínio ou URL final do GitHub Pages;
- configurar canonical;
- executar workflow manual;
- validar rotas públicas;
- gerar e testar QR;
- atualizar sitemap e robots;
- promover release pública.

## Produção física — Pacote 14

Permanece separada do lançamento digital:

- seleção curatorial;
- dimensões;
- materiais;
- transportabilidade;
- resolução;
- CMYK;
- sangria;
- provas;
- acessibilidade física;
- QR definitivos.

## Ordem recomendada

```text
07D.3
→ 08A revisão
→ 08B aplicação e relações
→ 08C direitos/contacto
→ 08D traduções, acessibilidade, domínio e QR
→ Pacote 14 produção física
```
