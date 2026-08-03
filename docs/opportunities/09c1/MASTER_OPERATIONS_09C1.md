---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "09C.1"
---

# Operações do master

Demonstrar pela interface:

- criar e editar rascunho;
- pré-visualizar;
- publicar;
- duplicar sem copiar candidaturas;
- encerrar candidaturas;
- cancelar oportunidade;
- consultar candidaturas autorizadas;
- aceitar ou não selecionar;
- adicionar pessoa manualmente quando permitido;
- remover participante com justificação interna;
- definir ou retirar capacidade máxima;
- exportar lista operacional com minimização de dados;
- copiar e partilhar URL pública.

## Proteções

- ações destrutivas ou irreversíveis exigem confirmação;
- pré-visualização não torna rascunho público;
- cancelamento não apaga histórico de auditoria;
- notas e justificações internas nunca entram na página pública;
- exportação exige autorização e não deve incluir dados supérfluos;
- mudança de estado apresenta resultado e eventual erro de concorrência;
- o master não pode publicar tradução ainda não aprovada pelo fluxo do 09D.

Não introduzir aprovação multinível, lista de espera ou workflow adicional.
