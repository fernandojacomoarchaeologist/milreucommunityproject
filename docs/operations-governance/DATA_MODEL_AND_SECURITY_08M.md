---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08M"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Modelo de dados e segurança

## Migrations propostas

```text
20260726100000_operations_governance_foundation.sql
20260726100100_operations_governance_rpc_rls.sql
20260726100200_operations_governance_seed.sql
```

Ajustar timestamps para evitar colisão. Não reescrever migrations anteriores.

## Tabelas propostas

1. `collab_operating_cycles`
2. `collab_operational_responsibilities`
3. `collab_service_requests`
4. `collab_moderation_cases`
5. `collab_content_review_cycles`
6. `collab_governance_decisions`
7. `collab_impact_indicators`
8. `collab_impact_snapshots`
9. `collab_continuity_reviews`

## Campos essenciais

### Ciclos

Projeto, código, título, tipo, estado, início, fim, responsável, resumo de revisão e auditoria.

### Responsabilidades

Domínio, tipo de papel, pessoa, substituto, escopo de autoridade, estado, aceitação, validade e risco.

### Suporte

Referência pública segura, categoria, prioridade, estado, resumo, descrição, responsável, tarefa/incidente ligado e resolução.

### Moderação

Código, categoria, prioridade, estado, origem, referência, relator, sujeito, descrição, ação, recurso e responsável.

### Revisão de conteúdo

Entidade, referência, tipos de revisão, estado, última e próxima revisão, expiração, responsável, resultado e notas.

### Decisão

Tipo, título, contexto, opções, consulta, autoridade, conflito, decisão, racional, condições, revisão e item substituído.

### Indicador

Código, nome, tipo, definição, fórmula, unidade, fonte, população, periodicidade, limitações, classificação, estado público e responsável.

### Snapshot

Período, valor, numerador, denominador, metodologia, fontes, qualidade, privacidade, publicação e aprovação.

### Continuidade

Tipo de revisão, estado, dimensões, risco de pessoa única, achados, ações, responsáveis e próxima revisão.

## RLS

- pessoa vê pedidos próprios quando permitido;
- pedidos de terceiros permanecem privados;
- moderação é restrita;
- sujeito de caso não recebe acesso administrativo;
- público lê apenas snapshots aprovados;
- responsabilidades e continuidade são internas;
- contactos não são públicos;
- mutações produzem auditoria;
- eliminação física segue retenção protegida.

## Segurança

- sem detalhes sensíveis em URLs;
- referências públicas distintas de UUIDs internos;
- exports redigidos;
- sem PII em transparência;
- sem secrets;
- sem service role no frontend;
- anexos privados por URL assinada;
- logs sem conteúdo pessoal integral.
