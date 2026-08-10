<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# PROMPT-CLAUDE — 10D

Registo do processamento seguido nesta integração (referência para auditoria e futuros pacotes).

1. **PROJECT GATE** endurecido sobre `main@9386e98…` com base exata: `PASS` (4 sinais, sidecar
   verificado, manifesto 9/9).
2. **Preflight**: árvore limpa; `v0.38.1`; registo canónico `10C.1`; identidades iguais;
   `baseline` e `public-git-content` verdes; 16 afirmações `in_review`, *snapshot* `0/0/0`;
   catálogo humano `3/2/1`; sem PR concorrente.
3. **KNOWN_BASE_DISCREPANCY**: `package.json.currentPackage` classificado **legado** (único leitor
   `validate-09d` espera `"10B"`; registo canónico é o *impact registry*). **Não corrigido.**
4. **Implementação** estritamente dentro do `allowed_paths`: núcleo puro, gerador estático,
   validador, contratos, exports vazios, rota/vista humana e ligação discreta a partir da
   Biblioteca; documentação e testes (unitário, rotas, E2E).
5. **Decisão registada**: `proteus-overview.json` **não** alterado (o validador 10A, fora do
   âmbito, impõe o texto atual). Ver `06-decisoes-abertas.md`.
6. **Validação** completa e **POSTFLIGHT** (diff ⊆ `allowed_paths`, sem marcador estrangeiro),
   depois **PR sem merge**.

## Invariantes a nunca violar

- API somente de leitura, estática, determinista, *fail-closed*;
- coleções vazias enquanto não houver `apiExposure: allow` comprovado;
- não revelar itens excluídos; não expor texto integral, URLs privadas, dados pessoais ou segredos;
- não alterar dados/estados/direitos do piloto; `0/0/0` preservado;
- sem *bump* de versão/pacote no PR funcional; sem migrations/papéis/dependências;
- não avançar para o 10E.

© 2026 Fernando Rodrigues de Jácomo.
