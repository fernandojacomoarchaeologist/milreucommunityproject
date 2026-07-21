---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md"
---

# Pacote 05C — Catálogo Visual Interativo

**Versão:** 0.3.0  
**Estado:** pronto para integração controlada  
**Dependências:** Pacotes 01, 02, 05A e 05B

## Finalidade

Este pacote transforma as fundações visuais do Projeto Comunitário de Milreu num **guia navegável do Sistema de Design**. A estrutura de consulta inspira-se no padrão de documentação de design systems contemporâneos — navegação lateral, pesquisa, páginas individuais, exemplos e estados — sem copiar a identidade, os componentes ou a linguagem de qualquer produto externo.

O catálogo utiliza exclusivamente a gramática visual de Milreu já documentada:

- vermelho como assinatura, abertura, transição e fecho;
- preto aquecido para destaques e preenchimentos controlados;
- superfícies claras para leitura prolongada;
- Fraunces, Spectral e Archivo por função;
- rastreabilidade ao livro *Milreu: Ruínas* e às decisões dos Pacotes 05A e 05B;
- quatro idiomas na interface do guia;
- maturidade explícita para cada página e elemento.

## Entrega principal

`apps/design-guide/` contém uma aplicação estática sem processo de build:

- navegação lateral responsiva;
- pesquisa por título, resumo, grupo e tags;
- rotas por hash com URLs copiáveis;
- breadcrumbs e navegação anterior/seguinte;
- índice local da página;
- exemplos visuais das fundações 05B;
- alternância de idioma da interface;
- estados de maturidade;
- acessibilidade por teclado e redução de movimento;
- estrutura preparada para receber componentes e padrões do Pacote 05D.

## Limites

Este pacote não:

- cria o Portal ou o Museu públicos;
- define o logótipo final;
- publica imagens do livro;
- implementa os componentes museológicos especializados;
- altera os 31 registos migrados;
- inicia o desenvolvimento Flutter;
- considera todos os elementos aprovados.

## Execução local

A partir da raiz do repositório:

```bash
python3 -m http.server 8080
```

Abrir:

```text
http://localhost:8080/apps/design-guide/
```

O guia consome `packages/design-tokens/v0.2/tokens.css`, entregue no Pacote 05B.

## Integração

Executar o conteúdo de `PROMPT_CLAUDE.md`. O pacote substitui de forma controlada a implementação preliminar de `apps/design-guide/` do Pacote 02, preservando-a em histórico Git e sem apagar documentação anterior.
