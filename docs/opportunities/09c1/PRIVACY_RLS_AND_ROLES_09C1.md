---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "09C.1"
---

# Privacidade, RLS e papéis

| Perfil | Oportunidade pública | Própria candidatura | Candidaturas alheias | Gestão |
|---|---:|---:|---:|---:|
| Anónimo | leitura publicada | não | não | não |
| Membro/candidato | leitura publicada | leitura e ações permitidas | não | não |
| Voluntário sem gestão | conforme visibilidade | própria | não | não |
| Master autorizado | leitura | conforme necessidade | leitura operacional | sim |

## Testes negativos obrigatórios

- enumeração de candidaturas por API, URL ou RPC;
- alteração de `user_id`, `opportunity_id` ou estado no cliente;
- leitura de notas internas;
- acesso a rascunho ou pré-visualização por anónimo;
- exportação por perfil não autorizado;
- candidatura a oportunidade restrita sem membership;
- bypass do bloqueio de menores;
- vazamento de e-mail, contacto ou acessibilidade em logs e screenshots.

Reutilizar as permissões e políticas existentes. Não ampliar papéis por conveniência de interface. Cada teste de UI deve ter correspondente verificação de autorização no backend quando aplicável.
