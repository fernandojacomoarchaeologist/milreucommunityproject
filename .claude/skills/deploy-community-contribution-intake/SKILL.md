---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08E"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Skill — Deploy Community Contribution Intake

## Procedimento

1. Aplicar migrations em local e staging.
2. Configurar RATE_LIMIT_SALT.
3. Configurar ALLOWED_ORIGINS.
4. Configurar Turnstile quando aprovado.
5. Fazer deploy sem verify_jwt.
6. Testar ações públicas.
7. Rever logs sem PII excessiva.
