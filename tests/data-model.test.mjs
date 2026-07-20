/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Direitos e condições: consultar RIGHTS.md no repositório principal.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { validateMuseumRecord } from '../scripts/validate-data-model.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const examplePath = path.resolve(__dirname, '../data/examples/MM202601.preliminary.example.json');
const valid = JSON.parse(fs.readFileSync(examplePath, 'utf8'));
assert.deepEqual(validateMuseumRecord(valid), []);

const missingTitle = structuredClone(valid);
delete missingTitle.title;
assert.ok(validateMuseumRecord(missingTitle).some((error) => error.includes('title')));

const forbiddenCertainty = structuredClone(valid);
forbiddenCertainty.date.certainty = 'mixed';
assert.ok(validateMuseumRecord(forbiddenCertainty).some((error) => error.includes('mixed') || error.includes('certainty')));

const unsafePlace = structuredClone(valid);
unsafePlace.places[0].sensitivity = 'sensitive';
unsafePlace.places[0].publicationAllowed = true;
assert.ok(validateMuseumRecord(unsafePlace).some((error) => error.includes('sensível')));

console.log('OK — testes básicos do modelo de dados concluídos.');
