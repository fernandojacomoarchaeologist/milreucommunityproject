---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08G"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Estratégia de ambientes

## Local

- Supabase CLI;
- demo opcional;
- reset permitido;
- Google OAuth local opcional;
- dados fictícios.

## Staging

- projeto Supabase separado;
- HTTPS;
- demo desativada;
- dados de homologação;
- migrations por dry-run e ação manual;
- perfis reais de teste;
- storage privado.

## Produção

- projeto exclusivo;
- sem reset;
- sem seed de demonstração;
- migrations por pipeline protegido;
- exige staging aprovado para a mesma versão;
- aprovação humana literal.

Nunca reutilizar a referência do projeto de produção em staging.
