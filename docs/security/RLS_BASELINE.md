---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "05F"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Baseline de Row Level Security

## Regra

Toda tabela acessível por API deve ter RLS ativada antes de conter dados.

## Princípios

- negar por defeito;
- políticas pequenas;
- separar leitura pública e administração;
- não confiar apenas na interface;
- testar anon, authenticated e funções internas;
- evitar políticas genéricas que liberem todas as linhas.

## Conteúdo público

Leitura pública deve depender de estado explicitamente publicável e, quando aplicável, de data de publicação.
