---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08B"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Pacote 08B — Gestão de Membros e Perfis

**Versão:** 0.13.0  
**Base cumulativa:** Pacote 08A.

O 08B transforma a fundação de gestão numa funcionalidade completa para pequenos grupos de colaboradores.

## Funcionalidades

- pesquisa e filtros de membros;
- métricas por estado;
- detalhe individual;
- aprovação e recusa de pedidos;
- atribuição do perfil principal;
- atribuição de múltiplas funções;
- suspensão, reativação e arquivo;
- notas internas;
- histórico de auditoria;
- proteção do último master ativo;
- pré-autorizações por e-mail para futuro login Google;
- interesses, competências e idiomas no perfil do membro.

## Pré-autorização

A Área Colaborativa **não envia um e-mail**. A coordenação regista previamente o e-mail, perfil e funções. Quando a pessoa entrar com Google usando o mesmo e-mail verificado, o vínculo pode ser ativado automaticamente.

## Demonstração

```bash
npm install
npm run dev
```

Abrir `#/area-colaborativa`, entrar como master de demonstração e aceder a:

```text
#/area-colaborativa/gestao/perfis
#/area-colaborativa/gestao/convites
```

## Validação

```bash
npm run collab:config
npm run validate
npm test
npm run build
npm run smoke
```

A execução real das migrations deve ocorrer primeiro em ambiente local ou staging.
