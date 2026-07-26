---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08K"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Matriz de cenários do piloto

A implementação deve semear modelos de cenário, não participantes ou resultados fictícios.

| Código | Perfil principal | Fluxo | Resultado esperado |
|---|---|---|---|
| PILOT-AUTH-01 | anónimo | Login Google | Callback correto sem acesso automático |
| PILOT-AUTH-02 | pendente | Pedido de acesso | Estado pendente, sem módulos internos |
| PILOT-MEM-01 | coordenador/master | Pré-autorização | E-mail verificado associa o vínculo previsto |
| PILOT-MEM-02 | master | Último master | Remoção/despromoção bloqueada |
| PILOT-PROF-01 | participante | Perfil | Atualiza apenas campos permitidos |
| PILOT-AVL-01 | voluntário | Disponibilidade | Registo próprio persistido e isolado |
| PILOT-TASK-01 | voluntário | Candidatura | Oportunidade visível e candidatura auditada |
| PILOT-TASK-02 | coordenador | Atribuição | Atribuição respeita capacidade e permissões |
| PILOT-TASK-03 | voluntário/coordenador | Progresso e validação | Horas e conclusão passam pelo fluxo previsto |
| PILOT-AGENDA-01 | participante | RSVP | Participação própria atualizada |
| PILOT-CONTRIB-01 | comunidade/voluntário | Submissão | Código de acompanhamento e consentimento |
| PILOT-CONTRIB-02 | revisor | Ficheiro privado | Acesso por URL assinada e negação cruzada |
| PILOT-CONTRIB-03 | coordenador | Pedido de informação | Estado e notificação interna |
| PILOT-CONTRIB-04 | participante | Retirada | Pedido prioritário e auditado |
| PILOT-TRAIN-01 | revisor/tradutor | Formação | Gate impede ação não autorizada |
| PILOT-MUSEUM-01 | revisor | Proposta campo a campo | Proposta não altera canónico automaticamente |
| PILOT-MUSEUM-02 | tradutor | Tradução | Permanece rascunho/revisão |
| PILOT-MUSEUM-03 | master/coordenador | MM202617 | Continua bloqueada para lançamento |
| PILOT-NOTIF-01 | participante | Centro interno | Notificação legível, marcável e preferências |
| PILOT-AUDIT-01 | coordenador | Auditoria | Pesquisa redigida e íntegra |
| PILOT-INC-01 | coordenador/master | Incidente | Observação crítica liga e bloqueia |
| PILOT-PILOT-01 | participante | Inscrição | Apenas membro ativo explicitamente inscrito |
| PILOT-PILOT-02 | participante | Sessão | Vê apenas as próprias sessões |
| PILOT-PILOT-03 | participante | Feedback | Submete e acompanha feedback próprio |
| PILOT-PILOT-04 | coordenador | Triagem | Liga observação a tarefa ou incidente |
| PILOT-PILOT-05 | master | Gates | Aprovação negada com bloqueador |
| PILOT-ACC-01 | todos | Teclado | Fluxos obrigatórios sem rato |
| PILOT-ACC-02 | todos | Leitor de ecrã | Estrutura e mensagens compreensíveis |
| PILOT-RESP-01 | todos | 375/768/1280 | Sem perda funcional ou overflow crítico |
| PILOT-SEC-01 | dois participantes | Isolamento | A não lê B por UI, API ou storage |
| PILOT-REC-01 | operação | Backup/restauração | Evidência real registada |
| PILOT-PUBLIC-01 | anónimo | Regressão pública | Portal/Museu preservados |
| PILOT-PUBLIC-02 | operação | Efeitos públicos | Slots permanecem vazios |
| PILOT-PROD-01 | operação | Produção | Escritas e aprovação continuam bloqueadas |

## Regras

- cenários obrigatórios não podem ser marcados como passados sem sessão ou evidência;
- `not-applicable` requer justificação;
- falha crítica bloqueia ciclo;
- repetição cria nova sessão, sem apagar a anterior;
- contas técnicas de teste devem ser claramente distinguidas de participantes reais.
