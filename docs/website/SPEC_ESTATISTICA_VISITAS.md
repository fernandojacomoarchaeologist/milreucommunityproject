# Estatística de visitas — Umami Cloud (sem cookies)

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu.

**Estado:** preparado e **desligado**. Activa-se quando o responsável criar a conta e fornecer o `websiteId` e o URL do script.
**Decisão:** Fernando Rodrigues de Jácomo, 2026-10-13, feita directamente a Claude. Escolheu o Umami Cloud (plano gratuito), sem cookies.

## Objectivo

| Pergunta | Como se responde |
|---|---|
| Quantos acessos únicos? | visitantes únicos do Umami. São uma estimativa diária sem cookies (sessão anónima com sal rotativo), não pessoas identificadas. |
| Funil: visita → Museu / Agenda / Inquérito | eventos `funil-museu`, `funil-agenda` e `funil-inquerito` (este é o clique no link do SurveyMonkey). Rácio = visitantes únicos com o evento ÷ visitantes únicos do período. |
| De onde vêm? | país/região (geolocalização aproximada pelo serviço) e site de origem (referrer, campanhas UTM). |
| A que horas? | distribuição por hora e dia no painel. O relatório agrega em Europe/Lisbon. |

## Funcionamento
- Configuração em `public/config/analytics.runtime.json`:
  - `enabled`;
  - `websiteId`: identificador público, **não é credencial**;
  - `scriptUrl`;
  - `domains`.

  Sem `websiteId`, nada é carregado e o site funciona exactamente como hoje.
- Só corre no domínio `projectomilreu.pt`, nunca em localhost nem em pré-visualizações.
- Respeita «Do Not Track».
- O site usa rotas com `#`, por isso cada mudança de endereço envia uma página vista com o caminho (`/museu/memorias/MM202601`, `/exposicoes/…`). Os re-renders sem mudança de endereço (idioma, tema, relógio) não contam.
- A Área Colaborativa (`collab-*`) e o laboratório de canais **não** são medidos.
- Texto de privacidade em `#/direitos` («Estatísticas de visita»). Só aparece quando a estatística está activa.

## Para activar (responsável)
1. Criar conta em Umami Cloud e adicionar o site `projectomilreu.pt`. A conta é criada pelo responsável; Claude não cria contas.
2. Enviar a Claude o *Website ID* e o URL do script (no separador *Tracking code*).
3. Claude actualiza `analytics.runtime.json` (`enabled: true`) num PR, verifica no site publicado e regista no handoff.

## Pendências e riscos
- **Texto de privacidade:** proposta preliminar em pt-PT, a rever pelo responsável/DPO antes da activação. Faltam EN/ES/FR e o período de conservação, que depende do plano: não inventar.
- **Terceiro e região de alojamento dos dados:** confirmar no momento da criação da conta.
- **Funis prontos no plano gratuito:** por confirmar. O funil do relatório calcula-se sempre pelos eventos.
- **Política de segurança:** o site não tem CSP hoje. Se vier a ter (lotes de segurança L3+), acrescentar o domínio do script e o de envio.
