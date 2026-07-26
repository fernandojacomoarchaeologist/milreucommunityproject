---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08L"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Definição do sistema

## Fluxo geral

```text
evidência do piloto
→ achado
→ proposta de evolução
→ decisão
→ tarefa ou incidente
→ implementação
→ verificação
→ eventual proposta pública
→ revisão multidimensional
→ preview de staging
→ snapshot
→ ativação autorizada
→ monitorização
→ suspensão, expiração ou rollback
```

A integração pública também pode nascer de conteúdos e atividades já aprovados, sem depender do piloto. A origem deve permanecer explícita.

## Subsistemas

### 1. Propostas de integração pública

Representam um efeito pretendido numa superfície pública. Devem indicar:

- origem canónica;
- slot ou rota;
- finalidade;
- audiência;
- conteúdo estruturado;
- idiomas;
- datas;
- requisitos;
- riscos;
- estados editoriais;
- dependências;
- responsável.

### 2. Snapshots públicos

São representações imutáveis e aprovadas do efeito. Não contêm dados operacionais privados. Devem ter:

- versão;
- checksum;
- payload;
- referências;
- idiomas;
- aprovações;
- vigência;
- estado;
- motivo de suspensão ou rollback.

### 3. Percursos de participação

Organizam continuidade sem substituir módulos existentes. Um percurso combina passos que referenciam:

- formação;
- oportunidade;
- tarefa;
- evento;
- contributo;
- revisão;
- atividade informativa;
- outro registo canónico autorizado.

### 4. Inscrição e progresso

A inscrição é voluntária e separada da membership. O progresso:

- referencia o passo;
- guarda origem da comprovação;
- diferencia conclusão automática e humana;
- permite reabertura justificada;
- preserva retirada.

### 5. Achados do piloto

Consolidam uma ou mais observações e métricas do 08K. Cada achado indica:

- problema ou oportunidade;
- perfis e módulos afetados;
- fontes;
- nível de confiança;
- impacto;
- limitações;
- dados ausentes;
- relação com acessibilidade, segurança, direitos ou privacidade.

### 6. Propostas e decisões de evolução

A proposta descreve:

- hipótese de mudança;
- racional;
- alternativa de não agir;
- impacto esperado;
- riscos;
- esforço estimado de forma qualitativa;
- critérios de verificação;
- dependências;
- decisão.

## Estados de alto nível

### Integração pública

```text
draft
→ under-review
→ approved-for-preview
→ previewed
→ approved-for-activation
→ active
```

Saídas:

- `rejected`;
- `changes-requested`;
- `suspended`;
- `expired`;
- `rolled-back`;
- `withdrawn`.

### Participação

```text
draft
→ available
→ active
→ paused
→ completed
```

Também pode ir para `archived` ou `withdrawn`.

### Evolução

```text
draft
→ evidence-review
→ proposed
→ decided
→ planned
→ implemented
→ verifying
→ verified
```

Alternativas:

- `rejected`;
- `deferred`;
- `cancelled`;
- `needs-more-evidence`.
