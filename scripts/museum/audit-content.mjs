/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { readFile, writeFile } from "node:fs/promises";

const records = JSON.parse(await readFile("public/data/memories.json","utf8")).records;
const collections = JSON.parse(await readFile("public/data/museum-collections.json","utf8")).collections;
const ids = new Set(records.map(record => record.id));
const relations = new Set(records.flatMap(record => record.relations.filter(id => ids.has(id)).map(id => `${record.id}|${id}`)));
const nonReciprocal = [...relations].filter(pair => {
  const [a,b] = pair.split("|");
  return !relations.has(`${b}|${a}`);
}).map(pair => pair.split("|"));

const counts = key => Object.fromEntries([...new Set(records.map(key))].map(value => [value,records.filter(record => key(record)===value).length]));

const audit = {
  _copyright:"© 2026 Fernando Rodrigues de Jácomo — Projeto Comunitário de Milreu",
  version:"0.10.0",
  records:records.length,
  siteVisible:records.filter(record => record.publication.siteVisible).length,
  blocked:records.filter(record => !record.publication.siteVisible).map(record => record.id),
  datePrecision:counts(record => record.date.precision),
  primaryTypes:counts(record => record.classification.primaryType),
  digitalInterventions:{
    records:records.filter(record => record.media.digitalInterventions.length).map(record => record.id),
    visibleRecords:records.filter(record => record.publication.siteVisible && record.media.digitalInterventions.length).map(record => record.id)
  },
  nonReciprocalRelations:{count:nonReciprocal.length,pairs:nonReciprocal},
  translations:Object.fromEntries(["pt-PT","en","es","fr"].map(lang => [lang,{
    titlePresent:records.filter(record => record.title[lang]).length,
    summaryPresent:records.filter(record => record.description.short[lang]).length
  }])),
  collections:Object.fromEntries(collections.map(collection => [collection.slug,collection.memberCount]))
};

await writeFile("public/data/museum-audit.json",JSON.stringify(audit,null,2)+"\n");
console.log("Auditoria do Museu atualizada.");
