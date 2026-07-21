/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Direitos e condições: consultar RIGHTS.md no repositório principal.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';

const LANGS = ['pt-PT', 'en', 'es', 'fr'];
const COPYRIGHT = '© 2026 Fernando Rodrigues de Jácomo';
const PROJECT = 'Projeto Comunitário de Milreu';

function arg(name, fallback = null) {
  const i = process.argv.indexOf(name);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}
function mkdir(p) { fs.mkdirSync(p, { recursive: true }); }
function writeJson(p, value) { mkdir(path.dirname(p)); fs.writeFileSync(p, JSON.stringify(value, null, 2) + '\n'); }
function sha256File(p) { return fs.existsSync(p) ? `sha256:${crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')}` : null; }
function localized(pt = null, en = null) { return { 'pt-PT': pt || null, en: en || null, es: null, fr: null }; }
function hasAny(text, terms) { const s=(text||'').toLowerCase(); return terms.some(t=>s.includes(t)); }

function loadLegacyItems(file) {
  const source = fs.readFileSync(file, 'utf8');
  const context = {};
  vm.createContext(context);
  vm.runInContext(`${source}\nthis.__museumItems = museumItems;`, context, { filename: file });
  if (!Array.isArray(context.__museumItems)) throw new Error('museumItems não foi encontrado como array.');
  return { source, items: JSON.parse(JSON.stringify(context.__museumItems)) };
}

function mapDate(item) {
  const raw = (item.dateApprox || item.year || '').trim();
  const lower = raw.toLowerCase();
  const out = {
    display: localized(raw || 'Data não determinada'),
    normalizedStart: null,
    normalizedEnd: null,
    precision: 'unknown',
    certainty: 'unknown',
    sourceRefs: [`SRC-${item.id}-LEGACY`]
  };
  if (!raw) return out;
  let m;
  if ((m = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/))) {
    out.normalizedStart = raw; out.normalizedEnd = raw; out.precision='day'; out.certainty='not-assessed'; return out;
  }
  if ((m = raw.match(/^(\d{4})-(\d{4})$/))) {
    out.normalizedStart=m[1]; out.normalizedEnd=m[2]; out.precision='range'; out.certainty='not-assessed'; return out;
  }
  if ((m = raw.match(/^\d{4}$/))) {
    out.normalizedStart=raw; out.normalizedEnd=raw; out.precision='year'; out.certainty='not-assessed'; return out;
  }
  if ((m = lower.match(/ca\.\s*(\d{4})s/))) {
    const y=Number(m[1]); out.normalizedStart=String(y); out.normalizedEnd=String(y+9); out.precision='decade'; out.certainty='probable'; return out;
  }
  if ((m = lower.match(/(?:potencialmente|possivelmente)\s+(\d{4})/))) {
    out.normalizedStart=m[1]; out.normalizedEnd=m[1]; out.precision='year'; out.certainty='hypothesis'; return out;
  }
  if ((m = lower.match(/(?:provavelmente|ca\.)\s+(\d{4})/))) {
    out.normalizedStart=m[1]; out.normalizedEnd=m[1]; out.precision='year'; out.certainty='probable'; return out;
  }
  if (lower.includes('anos 1970-1980')) {
    out.normalizedStart='1970'; out.normalizedEnd='1989'; out.precision='range'; out.certainty='probable'; return out;
  }
  if (lower.includes('entre janeiro e junho de 1987')) {
    out.normalizedStart='1987-01'; out.normalizedEnd='1987-06'; out.precision='range'; out.certainty='probable'; return out;
  }
  if (lower.includes('revelação') || lower.includes('imagem derivada') || lower.includes('produção do documentário')) {
    out.certainty = lower.includes('possivelmente') ? 'hypothesis' : 'unknown'; return out;
  }
  const yearMatch = raw.match(/\b(18|19|20)\d{2}\b/);
  if (yearMatch) {
    out.normalizedStart=yearMatch[0]; out.normalizedEnd=yearMatch[0]; out.precision='year';
    out.certainty=hasAny(raw,['possivelmente','potencialmente'])?'hypothesis':hasAny(raw,['provavelmente','ca.'])?'probable':'not-assessed';
  }
  return out;
}

function mapPlace(item) {
  const specific=(item.locationSpecific||'').trim();
  const pub=(item.locationPublic||'').trim();
  if (!specific && !pub) return [];
  const vague = hasAny(specific, ['possivelmente','potencialmente','provavelmente','não confirmado','local exato']);
  const certainty = hasAny(specific,['possivelmente','potencialmente']) ? 'hypothesis' : hasAny(specific,['provavelmente']) ? 'probable' : 'not-assessed';
  return [{
    id: null,
    publicLabel: localized(pub || 'Local não determinado'),
    specificLabel: localized(specific || null),
    precision: vague ? 'approximate' : 'area',
    coordinates: null,
    sensitivity: 'public',
    publicationAllowed: false,
    certainty,
    sourceRefs: [`SRC-${item.id}-LEGACY`]
  }];
}

function mapPeople(item) {
  const raw=(item.peoplePublic||'').trim();
  if (!raw) return [];
  const lower=raw.toLowerCase();
  let identificationStatus='partial', certainty='not-assessed';
  if (lower.includes('não identificado') || lower.includes('não é possível identificar')) identificationStatus='unidentified';
  if (hasAny(lower,['possivelmente','possíveis','potencialmente','não confirmada','aparentemente'])) { identificationStatus='probable'; certainty='probable'; }
  if ((lower.includes('restantes') || lower.includes('outros')) && (lower.includes('não identificado') || lower.includes('não confirm'))) identificationStatus='partial';
  return [{
    id: null,
    publicLabel: localized(raw),
    identificationStatus,
    publicDisplayAllowed: false,
    certainty,
    sourceRefs: [`SRC-${item.id}-LEGACY`]
  }];
}

function inferSourceType(credit) {
  const c=(credit||'').toLowerCase();
  if (hasAny(c,['arquivo nacional','torre do tombo','arquivo'])) return 'archive-record';
  if (hasAny(c,['ilustração portuguesa','jornal','hemeroteca','revista'])) return 'publication';
  if (hasAny(c,['facebook','instagram','página aldeia','partilha alternativa','redes sociais'])) return 'social-media';
  if (hasAny(c,['património cultural','instituto arqueológico alemão','museu'])) return 'institutional-page';
  if (hasAny(c,['fotografia providenciada','fotografia cedida','cedida por','coleção de','acervo de'])) return 'physical-photograph';
  return 'project-documentation';
}

function inferAccess(type) {
  return ['archive-record','publication','social-media','institutional-page'].includes(type) ? 'public-metadata' : 'restricted';
}

function inferConsent(item, sourceType) {
  const credit=(item.credit||'').toLowerCase();
  if (['archive-record','publication','institutional-page'].includes(sourceType)) return 'historical-material';
  if (hasAny(credit,['providenciada','cedida','coleção de','acervo de'])) return 'provided-for-project';
  return 'pending-review';
}

function inferPublicationBasis(item, sourceType) {
  const credit=(item.credit||'').toLowerCase();
  if (['archive-record','publication','institutional-page'].includes(sourceType)) return 'institutional-terms';
  if (hasAny(credit,['providenciada','cedida','coleção de','acervo de'])) return 'community-process';
  return 'pending-review';
}

function digitalInterventions(item) {
  const text=`${item.title||''} ${item.descriptionLong||''} ${item.rights||''}`.toLowerCase();
  const list=[];
  function push(type, desc, substantive=true, tool=null) {
    list.push({ type, description: localized(desc), tool, performedAt:null, sourceAssetId:null, promptReference:null, humanReviewStatus:'not-reviewed', substantiveChange:substantive });
  }
  if (item.id==='MM202617' || (text.includes('restaurada') && text.includes('inteligência artificial'))) {
    push('ai-assisted-enhancement','O registo legado declara uma versão restaurada com inteligência artificial, produzida no Gemini, para simulação e identificação. Exige revisão humana e não deve ser apresentado como documento original.',true,'Gemini');
  } else {
    if (text.includes('corrigida por ia') || text.includes('correção de imagem com ia')) push('ai-assisted-enhancement','O registo legado declara uma correção de imagem assistida por inteligência artificial. Os detalhes do processo e o ficheiro de origem devem ser verificados.',true,null);
  }
  if (text.includes('blur')) push('other','O registo legado declara aplicação de desfocagem para reduzir interpretações indevidas de dados distorcidos.',true,null);
  if (text.includes('adaptada para redes sociais')) push('crop','O registo legado indica adaptação da imagem para publicação em redes sociais, com possível corte de elementos.',true,null);
  return list;
}

function mapCommunityVoices(item) {
  const voices=Array.isArray(item.communityVoices)?item.communityVoices:[];
  return voices.map((v,idx)=>({
    id:`VOICE-${item.id}-${String(idx+1).padStart(2,'0')}`,
    publicName:v.name||null,
    anonymous:!v.name || String(v.name).toLowerCase()==='anónimo',
    relationToMilreu:v.relation||null,
    text:localized(v.text||null),
    language:'pt-PT',
    sourceChannel:'other',
    year:/^\d{4}$/.test(String(v.year||''))?Number(v.year):null,
    consentStatus:'pending-review',
    publicationStatus:'review-required',
    sourceRefs:[`SRC-${item.id}-LEGACY`],
    contactReference:null
  }));
}

function migrate(item, sourceRoot, sourceFingerprint) {
  const sourceType=inferSourceType(item.credit);
  const imagePath=path.join(sourceRoot,'assets','images',item.filename);
  const imageExists=fs.existsSync(imagePath);
  const interventions=digitalInterventions(item);
  const blanks=Object.entries(item).filter(([k,v])=>v===''||v===null||(Array.isArray(v)&&v.length===0)).map(([k])=>k);
  const quoted=/[“”\"]/.test(item.memoryText||'');
  const publicationStatus=item.id==='MM202617'?'blocked':'review-required';
  const sourceLegacy=`SRC-${item.id}-LEGACY`;
  const sourceOrigin=`SRC-${item.id}-ORIGIN`;
  const date=mapDate(item);
  const places=mapPlace(item);
  const people=mapPeople(item);
  return {
    _copyright:COPYRIGHT,
    _project:PROJECT,
    _rights:'Consultar RIGHTS.md; os direitos do conteúdo permanecem sujeitos às fontes e aos respetivos titulares.',
    schemaVersion:'0.1.0',
    recordType:'museum-memory',
    initiativeId:'museum-of-memories',
    id:item.id,
    recordStatus:'preliminary',
    publicationStatus,
    dataState:'preliminary',
    localisationStatus:{'pt-PT':'source',en:item.titleEn?'draft':'missing',es:'missing',fr:'missing'},
    title:localized(item.title,item.titleEn||null),
    narratives:{
      shortDescription:localized(item.descriptionShort||null),
      objectiveDescription:localized(item.descriptionLong||null),
      communityNarrative:localized(item.memoryText||null),
      historicalContext:localized(item.historicalContext||null),
      institutionalContext:localized(null)
    },
    date,
    places,
    people,
    classification:{
      primaryType:item.memoryType||null,
      secondaryTypes:[],
      periodLabel:localized(item.period||null),
      tags:[...new Set(Array.isArray(item.tags)?item.tags:[])]
    },
    media:[{
      id:`ASSET-${item.id}-LEGACY`,
      role:'public-derivative',
      fileName:item.filename||null,
      storage:'legacy-site',
      mimeType:item.filename?.toLowerCase().endsWith('.png')?'image/png':'image/jpeg',
      checksum:imageExists?sha256File(imagePath):null,
      credit:localized(item.credit||null),
      publicationAllowed:false,
      rightsStatus:'pending-review',
      digitalInterventions:interventions
    }],
    rightsAndConsent:{
      rightsStatus:'pending-review',
      consentStatus:inferConsent(item,sourceType),
      publicationBasis:inferPublicationBasis(item,sourceType),
      concernStatus:'none-reported',
      withdrawalAvailable:true,
      publicNoticeRequired:true,
      evidenceRefs:[sourceLegacy,sourceOrigin],
      notes:localized(item.rights||'Revisão de direitos necessária.')
    },
    sources:[
      {
        id:sourceLegacy,
        type:'project-documentation',
        citation:`Registo legado do Museu de Memórias de Milreu: ${item.id}.`,
        locator:`data/museum-items.js#${item.id}`,
        access:'restricted',
        supports:['title','narratives','date','places','people','classification','relations'],
        certainty:'not-assessed',
        rightsReviewStatus:'pending-review'
      },
      {
        id:sourceOrigin,
        type:sourceType,
        citation:item.credit||`Origem não indicada no registo ${item.id}.`,
        locator:null,
        access:inferAccess(sourceType),
        supports:['credit','media','rights'],
        certainty:'not-assessed',
        rightsReviewStatus:'pending-review'
      }
    ],
    provenance:[{
      id:`PROV-${item.id}-MIGRATION-01`,
      eventType:'catalogued',
      date:'2026-07-20',
      agentReference:'PACKAGE-04-MIGRATION',
      description:localized('Conversão mecânica e conservadora do registo legado para o schema 0.1.0. O conteúdo permanece preliminar e exige revisão humana.'),
      sourceRefs:[sourceLegacy],
      certainty:'certain'
    }],
    communityVoices:mapCommunityVoices(item),
    relations:(item.relatedIds||[]).map(targetId=>({
      relationType:'related-to',targetType:'memory',targetId,direction:'bidirectional',certainty:'not-assessed',
      notes:localized('Relação preservada a partir do campo relatedIds do registo legado; a reciprocidade e o tipo de relação exigem revisão.')
    })),
    audit:{
      recordVersion:'0.1.0-migrated-preliminary',
      createdAt:'2026-07-20T00:00:00Z',
      createdByReference:'PACKAGE-04-MIGRATION',
      updatedAt:null,
      updatedByReference:null,
      sourceSystem:'museum-v1:data/museum-items.js',
      previousVersionReference:`legacy:${item.id}`,
      changeReason:'Migração preliminar, reversível e sem alteração do estado de publicação.'
    },
    extensions:{
      migrationBatch:'PACKAGE-04-v0.1.0',
      sourceFingerprint,
      legacyFieldsPreserved:true,
      legacyBlankFields:blanks,
      narrativeLayerReviewRequired:true,
      rightsReviewRequired:true,
      personIdentificationReviewRequired:people.length>0,
      placeReviewRequired:places.length>0,
      dateReviewRequired:date.certainty!=='certain',
      translationReviewRequired:true,
      sourceCitationReviewRequired:true,
      containsQuotedCommunityMaterial:quoted,
      explicitDigitalInterventionMentioned:interventions.length>0,
      imageFoundInLegacySite:imageExists,
      legacy:item
    }
  };
}

function main() {
  const sourceRoot=path.resolve(arg('--source'));
  const outputRoot=path.resolve(arg('--output'));
  if (!sourceRoot || !outputRoot) throw new Error('Uso: node migrate-legacy-records.mjs --source <site-legado> --output <data/migration>');
  const legacyFile=path.join(sourceRoot,'data','museum-items.js');
  const {source,items}=loadLegacyItems(legacyFile);
  const fingerprint=`sha256:${crypto.createHash('sha256').update(source).digest('hex')}`;
  const recordDir=path.join(outputRoot,'records');
  mkdir(recordDir); mkdir(path.join(outputRoot,'snapshots')); mkdir(path.join(outputRoot,'reports')); mkdir(path.join(outputRoot,'manifests'));
  const records=items.map(item=>migrate(item,sourceRoot,fingerprint));
  for (const record of records) writeJson(path.join(recordDir,`${record.id}.preliminary.json`),record);
  writeJson(path.join(outputRoot,'snapshots','museum-items.legacy.snapshot.json'),{
    _copyright:COPYRIGHT,_project:PROJECT,_rights:'Snapshot técnico; não altera os direitos dos conteúdos.',
    sourcePath:'data/museum-items.js',sourceFingerprint:fingerprint,capturedAt:'2026-07-20',recordCount:items.length,items
  });
  const idSet=new Set(items.map(i=>i.id));
  const asym=[]; const missingTargets=[];
  for (const item of items) for (const target of item.relatedIds||[]) {
    const other=items.find(x=>x.id===target);
    if (!idSet.has(target)) missingTargets.push({source:item.id,target});
    else if (!(other.relatedIds||[]).includes(item.id)) asym.push({source:item.id,target});
  }
  const fieldStats={};
  const fields=[...new Set(items.flatMap(x=>Object.keys(x)))];
  for(const field of fields){fieldStats[field]={missing:0,blank:0};for(const item of items){if(!(field in item))fieldStats[field].missing++;else{const v=item[field];if(v===''||v===null||(Array.isArray(v)&&v.length===0))fieldStats[field].blank++;}}}
  const rightsGroups={}; for(const item of items) rightsGroups[item.rights]=(rightsGroups[item.rights]||0)+1;
  const typeGroups={}; for(const item of items) typeGroups[item.memoryType]=(typeGroups[item.memoryType]||0)+1;
  const migrationIndex=records.map(r=>({
    id:r.id,legacyFile:r.extensions.legacy.filename,recordFile:`records/${r.id}.preliminary.json`,recordStatus:r.recordStatus,
    publicationStatus:r.publicationStatus,rightsStatus:r.rightsAndConsent.rightsStatus,dateCertainty:r.date.certainty,
    englishTitleStatus:r.localisationStatus.en,reviewFlags:Object.entries(r.extensions).filter(([k,v])=>k.endsWith('Required')&&v).map(([k])=>k)
  }));
  writeJson(path.join(outputRoot,'manifests','migration-index.json'),{
    _copyright:COPYRIGHT,_project:PROJECT,version:'0.1.0',sourceFingerprint:fingerprint,recordCount:records.length,records:migrationIndex
  });
  writeJson(path.join(outputRoot,'reports','data-quality-report.json'),{
    _copyright:COPYRIGHT,_project:PROJECT,version:'0.1.0',recordCount:items.length,fieldStats,
    memoryTypes:typeGroups,recordsWithCommunityVoices:items.filter(i=>(i.communityVoices||[]).length).map(i=>i.id),
    recordsWithDigitalIntervention:records.filter(r=>r.extensions.explicitDigitalInterventionMentioned).map(r=>r.id),
    blockedRecords:records.filter(r=>r.publicationStatus==='blocked').map(r=>r.id)
  });
  writeJson(path.join(outputRoot,'reports','relations-audit.json'),{
    _copyright:COPYRIGHT,_project:PROJECT,version:'0.1.0',missingTargets,asymmetricRelations:asym,
    note:'As relações foram preservadas sem correção automática.'
  });
  writeJson(path.join(outputRoot,'reports','localisation-audit.json'),{
    _copyright:COPYRIGHT,_project:PROJECT,version:'0.1.0',
    titleCoverage:{'pt-PT':items.filter(i=>i.title).length,en:items.filter(i=>i.titleEn).length,es:0,fr:0},
    completeNarrativeCoverage:{'pt-PT':0,en:0,es:0,fr:0},
    note:'Os títulos ingleses legados foram marcados como draft. Nenhum conteúdo foi traduzido automaticamente.'
  });
  writeJson(path.join(outputRoot,'reports','rights-publication-audit.json'),{
    _copyright:COPYRIGHT,_project:PROJECT,version:'0.1.0',rightsGroups,
    allRecordsRequireRightsReview:true,allMediaPublicationAllowed:false,
    recordsWithExplicitRestriction:items.filter(i=>(i.rights||'').toLowerCase().includes('uso restrito')).map(i=>i.id),
    note:'Nenhum texto legado de direitos foi convertido em autorização confirmada.'
  });
  writeJson(path.join(outputRoot,'reports','migration-summary.json'),{
    _copyright:COPYRIGHT,_project:PROJECT,version:'0.1.0',sourceFingerprint:fingerprint,
    legacyRecordCount:items.length,migratedRecordCount:records.length,
    recordStatuses:{preliminary:records.filter(r=>r.recordStatus==='preliminary').length},
    publicationStatuses:{'review-required':records.filter(r=>r.publicationStatus==='review-required').length,blocked:records.filter(r=>r.publicationStatus==='blocked').length},
    preservation:{allLegacyFieldsPreserved:records.every(r=>r.extensions.legacyFieldsPreserved),sourceSnapshotCreated:true,reversible:true}
  });
  console.log(`OK — ${records.length} registos migrados para ${outputRoot}`);
}
main();
