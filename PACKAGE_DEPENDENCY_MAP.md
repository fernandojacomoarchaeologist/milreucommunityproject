---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08G"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Mapa de dependências

```text
01 → 02 → 03 → 04
          ↓
05A → 05B → 05C → 05D → 05E → 05F
                              ↓
                              06
                              ↓
07A → 07B → 07C → 07D → 07D.1 → 07D.2 → 07D.3
                                      ↓
08A → 08B → 08C → 08D → 08E → 08F → 08G
```

## Dependências críticas do 08F

- 03: modelo de dados;
- 04: migração preliminar;
- 05F: Supabase e segurança;
- 07A: imagens e registos;
- 07C: experiência do Museu;
- 07D.3: tratamento de MM202617;
- 08A–08B: autenticação, membros e permissões;
- 08C: tarefas;
- 08E: contributos aceites.

## Saídas do 08F usadas no futuro

- `museum-editorial-approved.json`;
- `public-content-effects.json`;
- formação concluída;
- biblioteca interna;
- propostas aceites;
- decisões e snapshots;
- ledger e registo de impactos.

Pacotes futuros devem alterar páginas públicas através dos contratos e slots registados, sem substituir silenciosamente as integrações anteriores.

## Dependências críticas do 08G

- 05F: Supabase, GitHub e proteção de produção;
- 08A: Google Auth e master;
- 08B: perfis e proteção do último master;
- 08E: storage privado e Edge Function;
- 08F: módulos completos e ledger.

## Saídas do 08G

- perfil de ambiente;
- readiness;
- política de autenticação;
- execuções de homologação;
- checks e evidências;
- gates de staging e produção.
