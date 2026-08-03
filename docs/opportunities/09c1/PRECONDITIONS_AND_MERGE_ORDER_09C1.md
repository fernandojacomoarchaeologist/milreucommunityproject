---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "09C.1"
---

# Precondições e ordem de integração

## Ordem obrigatória

```text
#39 — 09C mergeado no main
→ #40 — 09D atualizado sobre o main, CI verde e mergeado
→ branch nova para 09C.1 a partir do main atualizado
```

## Preflight bloqueante

Registar no relatório:

- branch e commit atuais;
- commit do `main` usado como base;
- estado real dos PRs #39 e #40;
- versão do produto e working tree;
- CI da base;
- migrations, módulos e permissões existentes;
- rotas e contratos introduzidos pelo 09D;
- estado do seletor e dos conteúdos por idioma.

Parar sem alterar código se:

- o #39 não estiver no histórico da base;
- o #40 não estiver integrado ou estiver com CI vermelho;
- houver alterações locais não compreendidas;
- não for possível distinguir código do 09C, do 09D e mudanças posteriores.

Não reabrir, sobrescrever ou recriar a arquitetura do 09D para contornar conflitos.
