---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "07A"
rights: "Consultar RIGHTS.md; imagens e conteúdos mantêm créditos e condições das respetivas fontes."
---

# Prompt de integração — Pacote 07A

Estás a integrar o **Pacote 07A — Base Executável, Pipeline de Imagens e Primeira Experiência Vertical**.

## Pré-condições confirmadas

- Pacotes 01–06 integrados;
- CI verde;
- Gate A aceite;
- tokens v0.2 canónicos;
- fotografias e descrições autorizadas para publicação no repositório público;
- livro e fontes protegidas continuam privados.

## Antes de agir

1. Lê `README.md`, `RIGHTS.md`, `PACKAGE_MANIFEST.md` e `INTEGRATION_CHECKLIST.md`.
2. Inspeciona a aplicação e o `package.json` existentes.
3. Mescla; não substituas o repositório sem comparar.
4. Preserva os tokens canónicos e os derivados do logótipo.
5. Não alteres textos migrados para “melhorar” a escrita.
6. Não publiques `MM202617` no site.
7. Não ligues ao Supabase remoto.
8. Não marques textos como `approved`.

## Integração técnica

1. Copia a aplicação, dados, imagens, scripts, tests, rules e skills.
2. Mescla scripts do `package.json`; este pacote não exige dependências runtime.
3. Mantém routing por hash para GitHub Pages nesta fase.
4. Executa:
   - `npm install`;
   - `npm run validate`;
   - `npm test`;
   - `npm run build`;
   - `npm run smoke`.
5. Abre em 1280, 768 e 375 px.
6. Verifica as rotas:
   - `#/`;
   - `#/museu`;
   - `#/museu/explorar`;
   - `#/museu/memorias/MM202601`;
   - `#/museu/imersivo/MM202601`;
   - `#/museu/memorias/MM202617`.
7. Confirma que `MM202617` devolve estado indisponível.
8. Confirma que o build não contém o PDF do livro.

## Imagens

- Não substituas os originais autorizados sem registo.
- A interface deve usar os WebP gerados.
- Preserva os créditos.
- `MM202612.jpeg` era duplicado exato de `MM202612.jpg`; manter apenas `.jpg`.
- `milreu_mosaic_hero.png` tinha conteúdo JPEG e não é usado neste pacote.
- O script de regeneração exige Python e Pillow, mas os derivados já estão incluídos.

## Conteúdo multicanal

Cada memória contém perfis para:

- Portal;
- Museu;
- totem;
- painel.

Não criar uma segunda fonte de verdade para os totens. A arte final permanece no Pacote 14.

## Resultado esperado

- aplicação local executável;
- build para GitHub Pages;
- 31 imagens no repositório;
- 30 memórias visíveis na pré-visualização;
- 1 memória bloqueada;
- primeira fatia vertical funcional;
- release de integração;
- nenhuma ligação produtiva.
