/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { readFile, writeFile } from "node:fs/promises";

const payload = JSON.parse(await readFile("public/data/memories.json","utf8"));
const records = payload.records.filter(record => record.publication.siteVisible);
const value = (field,lang="pt-PT") => field?.[lang] || "";

const index = records.map(record => {
  const place = record.places?.[0]?.publicLabel || {"pt-PT":""};
  const interventions = record.media.digitalInterventions.map(item => item.type);
  const values = [
    record.id,value(record.title),value(record.description.short),value(record.description.objective),
    value(record.description.community),value(record.description.historicalContext),
    record.classification.primaryType,value(record.classification.period),value(place),
    value(record.media.credit),...record.classification.tags
  ];
  return {
    id:record.id,title:record.title,summary:record.description.short,
    primaryType:record.classification.primaryType,period:record.classification.period,
    tags:record.classification.tags,place,dateStart:record.date.start,
    dateDisplay:record.date.display,datePrecision:record.date.precision,
    dateKnown:record.date.precision!=="unknown",interventions,credit:record.media.credit,
    searchable:values.join(" ").toLocaleLowerCase("pt-PT")
  };
});

await writeFile("public/data/museum-index.json",JSON.stringify({
  _copyright:"© 2026 Fernando Rodrigues de Jácomo — Projeto Comunitário de Milreu",
  version:"0.11.3",records:index
},null,2)+"\n");

console.log(`${index.length} registos indexados.`);
