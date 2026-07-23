---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08A"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Arquitetura da Área Colaborativa

A Área Colaborativa é um espaço interno do Projeto Comunitário de Milreu. Não é apenas administração do Portal.

```text
Área Colaborativa
├── autenticação Google
├── pedido e aprovação de acesso
├── perfil do membro
├── funções e permissões
├── tarefas
├── contributos
├── agenda e exposições
├── biblioteca
├── formação
├── revisão do Museu
└── gestão
```

## Camadas

- **Google:** confirma identidade, nome e e-mail.
- **Supabase Auth:** mantém a sessão.
- **Postgres e RLS:** controlam o acesso aos dados.
- **Aplicação:** apresenta apenas os módulos permitidos.
- **Git:** guarda migrations, contratos, documentação e releases.

## Princípio

Login não equivale a participação aprovada. O membro pode autenticar-se e permanecer `pending` até validação.
