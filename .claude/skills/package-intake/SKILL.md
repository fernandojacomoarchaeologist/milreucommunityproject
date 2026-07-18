---
name: "package-intake"
description: "Integrar um pacote versionado do Projeto Comunitário de Milreu sem sobrescrever decisões ou ficheiros silenciosamente."
version: "0.1.0"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md"
---

# Skill — Package intake

## Quando utilizar

Utilizar sempre que um ZIP de pacote for adicionado ao repositório.

## Procedimento

1. Ler `README.md`, `PACKAGE_MANIFEST.md`, `PROMPT_CLAUDE.md` e o release do pacote.
2. Confirmar número, versão, dependências e escopo.
3. Listar todos os ficheiros do pacote.
4. Comparar cada caminho com o repositório de destino.
5. Classificar cada ficheiro como:
   - novo;
   - idêntico;
   - conflito;
   - candidato a fusão;
   - fora do escopo.
6. Não sobrescrever conflitos.
7. Apresentar um plano de integração.
8. Fazer perguntas apenas sobre bloqueios reais.
9. Integrar após confirmação, quando necessária.
10. Verificar copyright em todos os MDs e códigos adicionados.
11. Registar o release e produzir um relatório final com:
    - criados;
    - alterados;
    - mantidos;
    - não integrados;
    - conflitos;
    - pendências.

## Proibições

- Não alterar código ou dados fora do manifesto.
- Não remover ficheiros legados.
- Não transformar pendências em decisões.
- Não executar pacotes seguintes por antecipação.
