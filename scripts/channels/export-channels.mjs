/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";

const memories = JSON.parse(await readFile("public/data/memories.json","utf8")).records;
const value = field => field?.["pt-PT"] || "";

const records = memories.map(record => {
  const visible = record.publication.siteVisible;
  const panelEditorial = value(record.channels.panel.editorialText);
  return {
    id:record.id,
    editorialStatus:record.editorialStatus,
    publication:{siteVisible:visible,blocked:!visible,blockReason:record.publication.blockReason},
    canonicalData:{
      title:record.title,dateDisplay:record.date.display,datePrecision:record.date.precision,
      primaryType:record.classification.primaryType,tags:record.classification.tags,
      credit:record.media.credit,rightsStatus:record.rights.status,sources:record.sources
    },
    media:{
      original:record.media.original,webPreview:record.media.variants.detail,
      immersive:record.media.variants.immersive,printSource:record.media.original,
      digitalInterventions:record.media.digitalInterventions
    },
    portal:{enabled:record.channels.portal.enabled && visible,route:`/museu/memorias/${record.id}`,summary:record.channels.portal.summary},
    museum:{enabled:record.channels.museum.enabled && visible,route:`/museu/memorias/${record.id}`,immersiveRoute:`/museu/imersivo/${record.id}`,introduction:record.channels.museum.introduction},
    totem:{
      enabled:false,eligibility:visible && value(record.channels.totem.shortText) ? "candidate" : "blocked",
      selectionStatus:"not-selected",shortText:record.channels.totem.shortText,
      qrTargetPath:record.channels.totem.qrTarget || `/museu/memorias/${record.id}`,
      qrStatus:"pending-public-base-url",previewRoute:`/laboratorio/totem/${record.id}`
    },
    panel:{
      enabled:false,eligibility:visible ? "candidate" : "blocked",selectionStatus:"not-selected",
      editorialText:record.channels.panel.editorialText,
      technicalPreviewText:{"pt-PT":panelEditorial || value(record.description.short),en:null,es:null,fr:null},
      technicalPreviewTextDerived:!panelEditorial,previewRoute:`/laboratorio/painel/${record.id}`
    }
  };
});

await mkdir("public/data/channels",{recursive:true});
await writeFile("public/data/channels/channel-records.json",JSON.stringify({
  _copyright:"© 2026 Fernando Rodrigues de Jácomo — Projeto Comunitário de Milreu",
  version:"0.11.0",
  notice:"Perfis físicos são candidatos técnicos. Nenhum registo foi selecionado para produção de totem ou painel.",
  records
},null,2)+"\n");

console.log(`${records.length} perfis multicanal exportados.`);
