---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08N"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Decisões do Pacote 08N

## Área voluntária

1. O 08N não cria novas secções no menu lateral.
2. O 08N revê as secções já existentes do ponto de vista do voluntário.
3. As secções do voluntário devem adotar uma estrutura editorial comum sempre que aplicável:
   - Objetivo desta secção
   - Ações esperadas
   - Pequeno guia
   - Detalhes
4. `Detalhes` deve aproveitar e reorganizar o conteúdo já existente; não o substituir por texto genérico.
5. As secções não devem tornar-se tutoriais extensos; o objetivo é orientar sem poluir a interface.

## Formação

6. Em Formação deve ficar visível apenas **Fundamentos do Projeto Comunitário de Milreu**.
7. Os restantes percursos não devem ser apagados do sistema.
8. Os restantes percursos devem ficar ocultos para a UI do voluntário até orientação posterior.
9. O estado do percurso visível deve continuar a refletir o progresso real.

## Contributos

10. A secção de Contributos deve permitir envio de ficheiros até 10 MB.
11. O fluxo de upload deve ser explicado na própria interface.
12. O Claude deve explicitar no relatório final como os ficheiros são enviados no projeto real:
    - via endpoint/backend controlado ou URL assinada;
    - nunca com `service_role` no browser.
13. O limite de 10 MB deve ser validado tanto no cliente como no servidor quando o backend real o permitir.
14. O pacote não deve inventar tipos de ficheiro sem verificar a whitelist do repositório real. Se não existir whitelist, deve criar a menor whitelist coerente e reportá-la.

## Home

15. A home da Área Colaborativa deve apresentar ações pendentes relevantes do utilizador.
16. A lista de pendências deve derivar do estado real das entidades já existentes.
17. A home não deve criar tarefas fictícias nem rankings.

## Site público

18. Os três slides do carrossel principal devem ficar visualmente consistentes.
19. A imagem do Inquérito 2026 deve ser recortada para eliminar a linha azul superior e preencher o espaço.
20. O carrossel principal deve avançar automaticamente.
21. O carrossel deve continuar utilizável manualmente e acessível por teclado.
22. O avanço automático deve poder pausar em hover ou focus, ou equivalente, para evitar comportamento hostil.

## Experiência imersiva

23. As ações de retorno ao portal devem funcionar.
24. O retorno deve preservar uma navegação clara e previsível.
25. O 08N não redesenha o imersivo; corrige a navegação e os destinos.
