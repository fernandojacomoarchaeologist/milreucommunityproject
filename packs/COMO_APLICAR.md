# Como aplicar um pack

1. Estar na raiz do repo (onde existe `.milreu-root`) com a árvore limpa.
2. Colar o script no terminal e correr.
3. Inspeccionar: `git --no-pager diff --stat main..pack/<ID>`
4. Aceitar: `git checkout main && git merge --no-ff pack/<ID> && git push`
   Descartar: `git checkout main && git branch -D pack/<ID>`

Se um pack vier truncado pelo chat, o `set -euo pipefail` e o heredoc por
fechar fazem-no rebentar antes de escrever lixo. Pedir reenvio desse pack.
