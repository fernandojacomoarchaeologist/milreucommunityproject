# Museu de Memórias — avaliação e partilha das imagens

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu.

**Estado:** `AVALIAÇÃO PRONTA / PARTILHA IMPLEMENTADA MAS DESLIGADA — DECISÃO HUMANA SOBRE DIREITOS`
**Pedido:** responsável do projecto, 2026-10-15 (Item 2, pacote C).

## 1. Avaliação (1 a 5 corações)
- No detalhe de cada memória visível (`#/museu/memorias/ID`).
- Rádios nativos num `fieldset` com `legend`: teclado (setas), foco visível, rótulo «N de 5», área de toque de 44 px, estado anunciado (`role="status"`).
- Sem login, sem dados pessoais, sem tabelas nem migrations, sem armazenamento no browser.
- Envia **um** evento Umami anónimo por memória e visita: `museum_rating` `{memory, value}`. Mudar a escolha não envia outro.
- Sem estatística activa (fora do domínio público ou sem configuração), nada é enviado.
- Não mostra médias nem contadores e não diz que o voto fica guardado. A mensagem é só «Obrigado pela sua avaliação.»

## 2. Partilha (Facebook, WhatsApp, partilha nativa)
- Ligação para a **página pública estável** `https://projectomilreu.pt/museu/memorias/ID/`, gerada por `scripts/structured/static-record-builder.mjs` (og:title, og:description, og:image, canonical), e não para o ficheiro da imagem.
- Facebook `sharer.php`, WhatsApp `wa.me`, `navigator.share` só quando o browser o suporta. Sem SDKs, pixels nem scripts de terceiros. A CSP não muda.
- Eventos separados e **de intenção**: `facebook_share_intent`, `whatsapp_share_intent`, `native_share_intent` `{memory}`. Um clique não prova que a partilha foi concluída.
- Junto aos botões aparece o pedido de manter o crédito, com o crédito da fotografia.

### Elegibilidade por fotografia (`isShareable`)
`siteVisible` + `publicReleaseEligible !== false` + `rights.status = authorized-for-project-publication`. Hoje são 30 memórias. **MM202617 nunca é elegível**: só está visível para revisão.

### Porque está desligada (`MUSEUM_SHARING.enabled = false`)
- As 30 autorizações registadas dizem «publicação no projecto», com crédito obrigatório e condições da fonte.
- Várias fontes têm condições próprias: Arquivo Nacional da Torre do Tombo, Hemeroteca, Património Cultural, I.P., e particulares.
- **Nenhum registo menciona redes sociais.** Partilhar uma ligação para a página do projecto é diferente de republicar a imagem. Mesmo assim, o Facebook e o WhatsApp geram uma pré-visualização com a fotografia (og:image) nos seus serviços.
- A regra de direitos aprovada não muda. Ligar a partilha é uma decisão do responsável.

## 3. Decisões humanas
1. A autorização «publicação no projecto» cobre a partilha de ligações com pré-visualização? Para todas as fontes ou só para algumas? Se for só para algumas, é preciso um campo por registo, por exemplo `rights.socialSharing`, o que exige uma alteração ao schema.
2. Se sim: mudar `enabled: true` em `src/lib/museum-engagement.js` (PR próprio).
3. Rever as traduções EN/ES/FR dos novos textos.

## 4. Riscos observados (não corrigidos aqui)
- As páginas estáticas `/museu/memorias/ID/` têm `robots index,follow`, enquanto o site tem `noindex` e o `robots.txt` diz `Disallow: /`. É uma inconsistência a decidir.
- A og:image está em **WebP**. Alguns clientes (versões antigas do WhatsApp e certos scrapers) podem não mostrar a pré-visualização. Avaliar um derivado JPEG para og:image.
- As páginas estáticas não têm CSP (já identificado no preflight de 2026-10-15).

## 5. Testes
- `tests/museum-engagement-item2.test.mjs`: elegibilidade, interruptor, ligações, eventos, acessibilidade e textos.
- Chrome headless com o build de produção, em desktop (1280) e telemóvel (390):
  - interruptor desligado → sem partilha;
  - interruptor ligado (cópia de teste) → ligações correctas e eventos separados; a partilha nativa só aparece com suporte;
  - um único `museum_rating`;
  - MM202617 sem partilha;
  - 0 violações CSP, 0 excepções, 0 overflow;
  - nenhum pedido real à Umami, ao Facebook ou ao WhatsApp (todos interceptados).
