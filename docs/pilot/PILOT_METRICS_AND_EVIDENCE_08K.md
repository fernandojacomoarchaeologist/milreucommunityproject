---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08K"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Métricas e evidências

## Métricas internas

O modelo deve suportar:

- participantes convidados, confirmados, ativos, retirados e concluídos;
- onboarding concluído;
- cenários iniciados, concluídos, falhados e bloqueados;
- conclusão independente, assistida e facilitada;
- tempo de conclusão quando disponível;
- observações por tipo, severidade, módulo e estado;
- problemas críticos e altos;
- pedidos de suporte;
- falhas de autenticação;
- falhas de RLS ou storage;
- problemas de acessibilidade;
- tarefas e incidentes ligados;
- taxa de repetição de cenários;
- cobertura por perfil e módulo;
- gates aprovados, bloqueados e pendentes.

## Métricas que não devem ser inventadas

O pacote não define:

- tamanho mínimo da coorte;
- meta de ativação;
- meta de conclusão;
- tempo máximo de tarefa;
- NPS;
- índice de satisfação;
- percentagem aceitável de suporte;
- data de encerramento.

Esses limiares exigem decisão humana e contexto do piloto.

## Gates absolutos

Devem ter valor zero para homologação:

- exposição de dados entre utilizadores;
- perda ou corrupção de dados;
- incidente crítico aberto;
- falha crítica de privacidade;
- secret no frontend;
- escrita de produção;
- publicação automática;
- conteúdo inelegível publicado;
- evidência falsa ou não rastreável.

## Evidência mínima

Cada cenário obrigatório deve ter:

- sessão;
- ator/perfil;
- data;
- ambiente;
- resultado;
- observações;
- referência de evidência ou justificação;
- responsável pela validação.

## Bundle de evidência

O export deve conter apenas metadados redigidos:

- release e commit;
- ambiente por código, sem secrets;
- ciclo;
- matriz de cobertura;
- resultados;
- gates;
- incidentes e tarefas referenciados;
- resumo de métricas;
- aprovações;
- lacunas.

Não incluir:

- tokens;
- secrets;
- URL assinada ativa;
- e-mails completos;
- ficheiros pessoais;
- conteúdo privado integral;
- gravação não autorizada.
