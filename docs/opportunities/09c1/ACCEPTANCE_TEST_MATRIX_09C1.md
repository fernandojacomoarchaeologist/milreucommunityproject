---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "09C.1"
---

# Matriz mínima de aceitação

| ID | Critério | Evidência obrigatória |
|---|---|---|
| C1 | #39 e #40 integrados na ordem correta | histórico, commits e CI |
| C2 | master cria, pré-visualiza e publica | E2E + screenshots |
| C3 | anónimo encontra e lê oportunidade publicada | E2E público |
| C4 | login retorna à oportunidade original | E2E com URL validada |
| C5 | perfil mínimo pede apenas dados ausentes | E2E + teste de formulário |
| C6 | candidatura é submetida uma única vez | UI + backend |
| C7 | master aceita e não seleciona | E2E por estado |
| C8 | candidato consulta resultado e pode retirar quando permitido | E2E |
| C9 | encerrar, cancelar, remover e capacidade funcionam | integração + UI |
| C10 | candidatos não são públicos nem visíveis entre si | RLS negativo |
| C11 | menor permanece bloqueado | UI + backend negativo |
| C12 | rotas e textos respeitam 09D | contratos + Playwright |
| C13 | EN/ES/FR não aparentam tradução publicada | teste por locale |
| C14 | Formação não mostra dados demonstrativos | inventário + visual |
| C15 | zero módulos, permissões e migrations novos | diff e inventário |
| C16 | estado vazio continua honesto | teste visual e conteúdo |
| C17 | mobile, teclado, foco e erros são utilizáveis | Playwright/a11y |
| C18 | nenhuma evidência contém dados pessoais | revisão de artefactos |

Falha em C1, C6, C10, C11, C12 ou C18 bloqueia o PR.
