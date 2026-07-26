---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08L"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Gates, ativação e rollback

## Gate de elegibilidade da origem

- referência existe;
- origem não foi retirada;
- origem não está bloqueada;
- conteúdo canónico está aprovado;
- direitos e créditos estão aprovados;
- uso público é compatível com consentimento e base aplicável;
- não é MM202617 inelegível;
- ficheiros públicos são aprovados.

## Gate editorial

- título;
- resumo;
- contexto;
- precisão;
- fontes;
- datas;
- créditos;
- tom público;
- revisão humana.

## Gate linguístico

- `pt-PT` aprovado;
- traduções publicadas apenas quando revistas;
- fallback explícito;
- não marcar tradução automática como revista.

## Gate de acessibilidade

- headings;
- labels;
- alt text;
- contraste;
- teclado;
- foco;
- leitor de ecrã;
- zoom;
- media alternativa quando aplicável.

## Gate técnico

- schema;
- checksum;
- references;
- preview;
- responsividade;
- fallback;
- logging;
- sem PII;
- sem secret;
- sem escrita pública indevida;
- rollback disponível.

## Gate de ativação

- staging homologado;
- proposta aprovada;
- snapshot aprovado;
- todos os gates;
- vigência válida;
- confirmação literal;
- produção aprovada por processo próprio.

Confirmação proposta:

```text
APPROVE_MILREU_PUBLIC_ACTIVATION
```

Ela é necessária, mas nunca substitui os gates.

## Suspensão automática permitida

O sistema pode suspender, sem apagar, quando:

- vigência termina;
- origem fica inelegível;
- retirada é registada;
- rights status deixa de ser aprovado;
- checksum diverge;
- incidente crítico é ligado.

Suspensão deve notificar coordenação/master pelo centro interno.

## Rollback

- seleciona snapshot anterior aprovado;
- cria ativação de rollback;
- mantém histórico;
- regista motivo;
- valida compatibilidade;
- não restaura conteúdo retirado ou inelegível;
- não usa payload manual fora do contrato.
