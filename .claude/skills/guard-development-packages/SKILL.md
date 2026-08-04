---
name: "guard-development-packages"
description: "Impedir contaminação entre projetos antes de inspecionar, extrair, aplicar, gerar ou reportar pacotes de desenvolvimento. Usar sempre que vários projetos partilham janela de IA, operador, workspace, máquina ou fluxo de pacotes; quando um ZIP, prompt, patch, branch ou relatório possa pertencer a Milreu, Compostela ou outro projeto; ou sempre que a identidade do projeto tenha de ser verificada antes de trabalho de desenvolvimento."
version: "1.0.0"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md"
---

# Guardião de Pacotes de Desenvolvimento

Tratar a identidade do projeto como um **gate duro**. Nunca confiar apenas no título da conversa,
na memória recente, no nome do ficheiro ou na garantia do operador.

## Exigir dois contratos

Usar `docs/governance/PROJECT_IDENTITY.md` no repositório e `PACKAGE_IDENTITY.json` na raiz do
pacote. Se qualquer um faltar, devolver `PROJECT GATE: BLOCKED` **antes** de extrair, editar,
fazer commit ou gerar um pacote sucessor. Usar os modelos em `assets/` apenas quando o utilizador
autorizar explicitamente a sua criação — nunca criar o contrato por inferência.

Executar `python3 .claude/skills/guard-development-packages/scripts/verify_project_package.py --repo <repositório> --package <zip-ou-diretório>` quando os dois contratos existirem. Tratar um exit
diferente de zero como bloqueio, não como aviso.

## Correr o gate

1. Resolver e registar raiz do repositório, remote, branch, HEAD, estado sujo, versão e pacote ativo.
2. Ler os dois contratos de identidade antes do resto do pacote.
3. Verificar igualdade exata de `project_id` e `repository_slug`.
4. Confirmar que `expected_base_commit` é o HEAD atual ou um ancestral explicitamente permitido.
5. Confirmar que a sequência do pacote segue o pacote/versão ativos do repositório.
6. Provar pelo menos **três** sinais independentes: remote, documento canónico, assinatura de
   framework, raiz de código esperada, manifesto ou rota própria do projeto.
7. Procurar marcadores estrangeiros de alta confiança do contrato do projeto nos caminhos e texto
   do pacote. Ignorar `.git`, caches de dependências, saída de build, arquivos e os próprios
   ficheiros de controlo de identidade.
8. Comparar âmbito pedido, caminhos permitidos, migrations, papéis, permissões e exclusões
   explícitas com a fase atual do projeto.

Devolver exatamente **um** estado antes de agir:

- `PROJECT GATE: PASS` — todos os identificadores exatos batem, pelo menos três sinais concordam,
  a linhagem é válida e não existe marcador estrangeiro material.
- `PROJECT GATE: BLOCKED` — falta um contrato, um identificador exato difere, a linhagem é
  inválida, existe marcador estrangeiro forte, a sequência é ambígua, ou não se provam três sinais.

No `PASS`, reportar projeto, repositório, branch/HEAD, pacote/base e âmbito permitido em no máximo
cinco linhas. No `BLOCKED`, não modificar ficheiros; identificar a evidência conflituante e pedir
ao utilizador que substitua ou resolva explicitamente a entrada suspeita. Nunca reinterpretar um
pacote como pertencente ao projeto aberto.

## Aplicar com segurança

Depois do `PASS`, declarar os caminhos permitidos, preservar alterações não relacionadas, recusar
caminhos fora do repositório, manter o pacote isolado de fases posteriores e nunca fazer merge ou
push sem autorização explícita.

Antes de concluir, inspecionar o diff e os caminhos alterados, repetir o scan de marcadores
estrangeiros apenas nos ficheiros alterados e nas saídas, e confirmar os metadados de
pacote/versão. Devolver:

- `POSTFLIGHT: PASS` com ficheiros alterados, testes corridos e verificações humanas; ou
- `POSTFLIGHT: BLOCKED` com a evidência preservada e sem declarar conclusão.

Ao gerar um pacote novo, incluir um `PACKAGE_IDENTITY.json` fresco, sidecar SHA-256, base esperada
exata, caminhos permitidos, âmbitos proibidos e a relação com o pacote sucessor. Nunca copiar um
manifesto antigo sem reverificar todos os campos.
