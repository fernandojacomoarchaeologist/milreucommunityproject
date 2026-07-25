---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08I"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Contexto consolidado até ao Pacote 08I

A Área Colaborativa possui 22 módulos ativos no código.

## Governação

```text
Saúde operacional
Auditoria
Retenção
Legal holds
Incidentes
Backups
Continuidade
```

## Auditoria

- consulta direta revogada;
- redacção;
- cadeia de hashes;
- imutabilidade;
- pesquisa;
- exportação CSV limitada;
- ator sem e-mail.

## Retenção

```text
preview
→ aprovação
→ workflow protegido
→ service role
```

Não existe aplicação automática.

## Estado real

Não foram comprovados:

- backup remoto;
- restauração;
- Supabase local;
- staging;
- produção;
- Google OAuth;
- master;
- fornecedor de e-mail.

O pacote entrega código, migrations, testes, documentação e gates.

## Próxima fronteira

O 08J deverá consolidar a experiência completa da Área Colaborativa, acessibilidade, testes E2E e release candidate.
