---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "09C.1"
---

# Estados e casos-limite

Estados permitidos:

```text
submitted → accepted | not-selected | withdrawn
accepted → removed
```

Transições adicionais só podem existir se já forem parte comprovada do domínio do 09C e forem documentadas.

## Casos obrigatórios

- candidatura duplicada;
- duas decisões concorrentes;
- oportunidade encerrada entre abertura e submissão;
- capacidade atingida antes da confirmação;
- candidatura retirada e tentativa posterior;
- participante removido;
- oportunidade cancelada com candidaturas existentes;
- acesso a ID de candidatura de outro utilizador;
- perfil incompleto;
- sessão expirada;
- oportunidade inexistente ou não publicada;
- utilizador identificado como menor.

Capacidade deve ser aplicada de forma atómica no backend. Não introduzir lista de espera. Se o comportamento de nova candidatura após retirada não estiver definido no domínio atual, manter bloqueado e reportar como decisão aberta.
