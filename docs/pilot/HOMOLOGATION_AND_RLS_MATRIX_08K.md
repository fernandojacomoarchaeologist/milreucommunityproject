---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08K"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Matriz de homologação e RLS

## Perfis e fronteiras

| Ator | Deve conseguir | Deve ser impedido |
|---|---|---|
| Anónimo | Ver superfícies públicas e entrada | Ver piloto, coorte ou sessões |
| Pendente | Ver estado do pedido | Entrar no piloto |
| Participante inscrito | Ver ciclo, cenários, sessões e feedback próprios | Ver coorte, terceiros, evidências ou gates |
| Membro ativo não inscrito | Usar módulos normais permitidos | Ver dados do piloto |
| Facilitador atribuído | Ver sessões atribuídas e participantes dessas sessões | Ver sessões não atribuídas sem permissão de gestão |
| Coordenador | Gerir operação e avaliar gates | Aprovar homologação final |
| Master | Aprovar com evidência e confirmação literal | Aprovar com gate bloqueador pendente |
| Service role | Executar workflows protegidos no backend | Ser exposta no browser |

## Casos RLS obrigatórios

1. participante A não vê participante B;
2. participante A não vê feedback de B;
3. participante A não vê evidência privada;
4. membro ativo fora da coorte não vê ciclo;
5. facilitador não atribuído não vê sessão restrita;
6. coordenador vê dados do projeto correto;
7. nenhuma função cruza `project_id`;
8. inscrição exige membership ativa;
9. ciclo não pode usar ambiente de produção;
10. gate bloqueador não pode ser aprovado sem evidência;
11. apenas master executa aprovação final;
12. evidência usa storage privado;
13. link assinado expira;
14. retirada impede novas sessões;
15. auditoria é gerada em todas as mutações;
16. export redige e-mails, tokens, URLs assinadas e dados sensíveis;
17. observação crítica bloqueia aprovação;
18. produção permanece sem escrita.

## Matriz de homologação

### Ambiente

- staging separado;
- HTTPS;
- demo desativada;
- production writes desativadas;
- configuração sem secrets no bundle.

### Base e auth

- migrations cumulativas;
- testes SQL;
- OAuth;
- callback;
- master;
- proteção do último master;
- expiração de sessão.

### Operação

- coorte;
- cenários;
- sessões;
- feedback;
- evidência;
- métricas;
- triagem;
- incidente;
- tarefa corretiva;
- retirada.

### Humano

- 375, 768 e 1280 px;
- teclado;
- leitor de ecrã;
- zoom 200%;
- mensagens de erro;
- linguagem pt-PT;
- suporte real;
- revisão do notice e privacidade.

### Saída

- cobertura de cenários obrigatórios;
- zero incidentes críticos abertos;
- zero falhas de isolamento;
- evidência suficiente;
- relatório de encerramento;
- aprovação literal:

```text
APPROVE_MILREU_STAGING_HOMOLOGATION
```

A confirmação literal é necessária, mas nunca suficiente sem os gates.
