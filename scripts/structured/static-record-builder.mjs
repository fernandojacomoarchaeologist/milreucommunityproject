/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const escape = value => String(value ?? "").replace(/[&<>"]/g,char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[char]));
const value = field => field?.["pt-PT"] || "";

export async function buildStaticRecordPages(outputRoot="dist") {
  const records = JSON.parse(readFileSync("public/data/memories.json","utf8")).records
    .filter(record => record.publication.siteVisible && record.publication.publicReleaseEligible !== false);
  const baseUrl = process.env.MILREU_PUBLIC_BASE_URL?.replace(/\/+$/,"") || null;

  for (const record of records) {
    const relativeRecordPath = `museu/memorias/${record.id}/`;
    const canonical = baseUrl ? `${baseUrl}/${relativeRecordPath}` : null;
    const imagePath = `../../../${record.media.variants.detail}`;
    const jsonPath = join(outputRoot,"data","memories",`${record.id}.json`);
    const htmlPath = join(outputRoot,"museu","memorias",record.id,"index.html");

    await mkdir(join(outputRoot,"data","memories"),{recursive:true});
    await mkdir(join(outputRoot,"museu","memorias",record.id),{recursive:true});

    const publicRecord = {
      id:record.id,title:record.title,description:record.description,date:record.date,
      classification:record.classification,places:record.places,
      media:{image:record.media.variants.detail,thumbnail:record.media.variants.thumbnail,credit:record.media.credit,digitalInterventions:record.media.digitalInterventions},
      sources:record.sources,rights:record.rights,
      routes:{canonicalPath:`/${relativeRecordPath}`,museumApp:`/#/museu/memorias/${record.id}`,immersive:`/#/museu/imersivo/${record.id}`}
    };
    await writeFile(jsonPath,JSON.stringify(publicRecord,null,2)+"\n");

    const jsonLd = {
      "@context":"https://schema.org","@type":"Photograph",
      "@id":canonical || `urn:milreu:memory:${record.id}`,
      identifier:record.id,name:value(record.title),abstract:value(record.description.short),
      dateCreated:record.date.start || undefined,temporalCoverage:value(record.date.display) || undefined,
      image:{"@type":"ImageObject",contentUrl:canonical ? `${baseUrl}/${record.media.variants.detail}` : record.media.variants.detail,caption:value(record.description.objective),creditText:value(record.media.credit)}
    };

    const page = `<!doctype html>
<html lang="pt-PT"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escape(value(record.title))} | Projeto Comunitário de Milreu</title>
<meta name="description" content="${escape(value(record.description.short))}">
${canonical ? `<link rel="canonical" href="${escape(canonical)}">` : ""}
<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g,"\\u003c")}</script>
<style>body{margin:0;background:#f2ece0;color:#1e1a17;font:18px/1.65 Georgia,serif}main{max-width:74rem;margin:auto;padding:2rem 1rem 5rem}img{display:block;width:100%;max-height:75vh;object-fit:contain;background:#1e1a17}h1{font-size:clamp(2.4rem,6vw,5.5rem);line-height:1;margin:.4em 0}.meta{font:700 .75rem Arial,sans-serif;text-transform:uppercase}.notice{padding:1rem;background:#fff;border-left:5px solid #a83227}a{color:#7e251c}</style>
</head><body><main>
<p class="meta">${escape(record.id)} · ${escape(record.editorialStatus)}</p>
<h1>${escape(value(record.title))}</h1><p>${escape(value(record.description.short))}</p>
<img src="${escape(imagePath)}" alt="${escape(value(record.title))}">
<h2>Descrição</h2><p>${escape(value(record.description.objective))}</p>
${value(record.description.community) ? `<h2>Narrativa comunitária</h2><blockquote>${escape(value(record.description.community))}</blockquote>` : ""}
<h2>Crédito</h2><p>${escape(value(record.media.credit))}</p>
<div class="notice"><strong>Direitos e correções</strong><p>A fotografia está autorizada para publicação no âmbito do projeto. Consulte o registo completo para proveniência, fontes, correções ou retirada.</p></div>
<p><a href="../../../#/museu/memorias/${record.id}">Abrir no Museu digital</a> · <a href="../../../#/museu/imersivo/${record.id}">Abrir em ecrã inteiro</a></p>
</main></body></html>`;
    await writeFile(htmlPath,page);
  }
  console.log(`${records.length} páginas estáticas de registo geradas.`);
}
