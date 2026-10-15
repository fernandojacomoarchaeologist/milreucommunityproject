/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Museu de Memórias — avaliação (1 a 5 corações) e partilha social (Item 2, 2026-10-15).
 * - Avaliação: anónima, sem login, sem armazenamento; só um evento Umami por memória e visita
 *   (`museum_rating`, com o identificador e o valor). Não há médias nem contadores públicos.
 * - Partilha: ligação para a página PÚBLICA E ESTÁVEL da memória (/museu/memorias/ID/, com
 *   og:title/description/image), nunca para o ficheiro da imagem. Sem SDKs: Facebook sharer,
 *   wa.me e Web Share API. Eventos de INTENÇÃO (o clique não prova que a partilha foi concluída).
 * - Direitos: só memórias publicadas, elegíveis para lançamento e autorizadas para publicação no
 *   projecto. A partilha fica DESLIGADA até decisão do responsável (MUSEUM_SHARING.enabled),
 *   porque as autorizações registadas não mencionam redes sociais
 *   (docs/website/MUSEU_AVALIACAO_PARTILHA.md).
 */

export const SITE_ORIGIN = "https://projectomilreu.pt";

export const MUSEUM_SHARING = Object.freeze({
  enabled: false,
  decision: "pendente — confirmar se a autorização «para publicação no projecto» cobre a partilha de ligações com pré-visualização em redes sociais",
});

export const SHARE_EVENTS = Object.freeze({ facebook: "facebook_share_intent", whatsapp: "whatsapp_share_intent", native: "native_share_intent" });
export const RATING_EVENT = "museum_rating";

// Elegível para partilha: visível, elegível para lançamento público e autorizada para publicação.
export function isShareable(record) {
  return Boolean(record?.publication?.siteVisible)
    && record.publication.publicReleaseEligible !== false
    && record?.rights?.status === "authorized-for-project-publication"
    && /^MM\d{6}$/.test(record?.id || "");
}

export const memoryPublicUrl = record => `${SITE_ORIGIN}/museu/memorias/${record.id}/`;

export function shareLinks(record, title) {
  const url = memoryPublicUrl(record);
  const text = `${title} — Museu de Memórias de Milreu`;
  return {
    url,
    text,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
  };
}

export function validRating(value) {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 && n <= 5 ? n : null;
}
