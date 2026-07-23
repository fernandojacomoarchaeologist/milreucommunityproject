---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "07D.2"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Pacote 07D.2 — Correções do Modo Imersivo e Carrossel da Home

**Versão:** 0.11.2  
**Base:** Pacote 07D.1.

## Executar

```bash
npm install
npm run channels:export
npm run museum:index
npm run museum:audit
npm run validate
npm test
npm run build
npm run dev
```

## Modo imersivo

- botão persistente **Voltar ao Museu**;
- botão X independente dos restantes controlos;
- ambos continuam visíveis em ecrã inteiro;
- fotografia centralizada;
- largura e altura automáticas;
- limites máximos de 100%;
- `object-fit: contain`;
- anterior, seguinte, filmstrip e modo slide preservados.

## Home do Museu

O bloco estatístico foi removido. A entrada conduz diretamente para percursos de exploração e memórias.

## Carrossel da Home

Transição automática a cada nove segundos, com:

- setas anterior e seguinte;
- indicadores;
- pausar/retomar;
- pausa ao receber foco ou ponteiro;
- autoplay desativado com preferência de movimento reduzido.

### Destaques

1. Museu de Memórias de Milreu;
2. Experiência Proteus;
3. Inquérito 2026.

O Inquérito encaminha para:

```text
https://pt.surveymonkey.com/r/3CFG2MQ
```

## Experiência Proteus

Como ainda não existe uma imagem final, foi criado um empty state visual baseado numa rede de memórias, lugares, fontes, dados e relações.

## Estado

O lançamento público continua bloqueado. Este pacote não aprova conteúdo editorial, traduções, QR ou produção física.
