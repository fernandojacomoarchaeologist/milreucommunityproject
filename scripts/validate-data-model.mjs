/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Direitos e condições: consultar RIGHTS.md no repositório principal.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const languages = ['pt-PT', 'en', 'es', 'fr'];
const certainty = new Set(['certain', 'probable', 'hypothesis', 'unknown', 'not-assessed']);

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function walk(dir, extension) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full, extension) : (full.endsWith(extension) ? [full] : []);
  });
}

export function validateLocalized(value, label, errors) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    errors.push(`${label}: deve ser objeto localizado.`);
    return;
  }
  for (const lang of languages) {
    if (!(lang in value)) errors.push(`${label}: falta a chave ${lang}.`);
    else if (value[lang] !== null && typeof value[lang] !== 'string') errors.push(`${label}.${lang}: deve ser string ou null.`);
  }
}

export function validateMuseumRecord(record) {
  const errors = [];
  if (!record || typeof record !== 'object') return ['Registo ausente ou inválido.'];
  if (!/^MM\d{6}$/.test(record.id || '')) errors.push('id: formato inválido.');
  if (record.schemaVersion !== '0.1.0') errors.push('schemaVersion: deve ser 0.1.0.');
  if (record.recordType !== 'museum-memory') errors.push('recordType: inválido.');
  if (!record.rightsAndConsent) errors.push('rightsAndConsent: obrigatório.');
  if (!record.publicationStatus) errors.push('publicationStatus: obrigatório.');
  validateLocalized(record.title, 'title', errors);
  if (!record.localisationStatus) errors.push('localisationStatus: obrigatório.');
  else for (const lang of languages) if (!(lang in record.localisationStatus)) errors.push(`localisationStatus: falta ${lang}.`);
  if (record.date && !certainty.has(record.date.certainty)) errors.push(`date.certainty: valor inválido ${record.date.certainty}.`);
  if (JSON.stringify(record).includes('"mixed"')) errors.push('certeza: o nível mixed é proibido.');
  for (const [name, text] of Object.entries(record.narratives || {})) validateLocalized(text, `narratives.${name}`, errors);
  for (const place of record.places || []) {
    validateLocalized(place.publicLabel, 'places.publicLabel', errors);
    validateLocalized(place.specificLabel, 'places.specificLabel', errors);
    if (place.sensitivity === 'sensitive' && place.publicationAllowed) errors.push('place: localização sensível não pode estar publicável.');
  }
  for (const media of record.media || []) {
    if (media.publicationAllowed && ['pending-review','contested','withdrawn','unknown','not-assessed'].includes(media.rightsStatus)) errors.push(`media ${media.id}: publicação incompatível com direitos.`);
  }
  if (['published','approved'].includes(record.publicationStatus)) {
    const r = record.rightsAndConsent?.rightsStatus;
    if (!['cleared','community-authorised','public-domain','licensed','permission-recorded'].includes(r)) errors.push('publicationStatus: incompatível com rightsStatus.');
  }
  return errors;
}

function validateRepository() {
  const errors = [];
  const jsonFiles = [
    ...walk(path.join(root, 'data', 'schemas'), '.json'),
    ...walk(path.join(root, 'data', 'vocabularies'), '.json'),
    ...walk(path.join(root, 'data', 'templates'), '.json'),
    ...walk(path.join(root, 'data', 'examples'), '.json'),
  ];
  for (const file of jsonFiles) {
    try {
      const obj = readJson(file);
      if (!obj._copyright && !obj['x-copyright']) errors.push(`${path.relative(root, file)}: falta copyright.`);
    } catch (error) {
      errors.push(`${path.relative(root, file)}: JSON inválido: ${error.message}`);
    }
  }
  const registry = readJson(path.join(root, 'data', 'schemas', 'schema-registry.json'));
  for (const item of registry.schemas || []) {
    if (!fs.existsSync(path.join(root, item.path))) errors.push(`Schema ausente: ${item.path}`);
  }
  const example = readJson(path.join(root, 'data', 'examples', 'MM202601.preliminary.example.json'));
  errors.push(...validateMuseumRecord(example).map((e) => `MM202601 example: ${e}`));
  const markdown = walk(root, '.md');
  for (const file of markdown) {
    const text = fs.readFileSync(file, 'utf8');
    if (!text.includes('© 2026 Fernando Rodrigues de Jácomo')) errors.push(`${path.relative(root, file)}: falta copyright no MD.`);
  }
  return { errors, checkedJson: jsonFiles.length, checkedMarkdown: markdown.length };
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  const result = validateRepository();
  if (result.errors.length) {
    console.error(`Falhou: ${result.errors.length} erro(s).`);
    for (const error of result.errors) console.error(`- ${error}`);
    process.exit(1);
  }
  console.log(`OK — ${result.checkedJson} JSON e ${result.checkedMarkdown} MD verificados.`);
}
